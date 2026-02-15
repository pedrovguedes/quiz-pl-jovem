from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import re
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class ParticipantCreate(BaseModel):
    nome: str = Field(..., min_length=2)
    email: EmailStr
    telefone: str
    endereco: str
    numero: str
    cep: str
    
    @field_validator('telefone')
    def validate_telefone(cls, v):
        phone = re.sub(r'\D', '', v)
        if len(phone) < 10 or len(phone) > 11:
            raise ValueError('Telefone inválido')
        return v
    
    @field_validator('cep')
    def validate_cep(cls, v):
        cep = re.sub(r'\D', '', v)
        if len(cep) != 8:
            raise ValueError('CEP inválido')
        return v

class Participant(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    email: str
    telefone: str
    endereco: str
    numero: str
    cep: str
    pontuacao: int = 0
    completado: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuizAnswer(BaseModel):
    email: str
    respostas: List[int]

class QuizResult(BaseModel):
    pontuacao: int
    total_perguntas: int
    acertos: int

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    token: str
    username: str

# Perguntas do Quiz sobre PL Jovem
QUESTIONS = [
    {
        "id": 1,
        "pergunta": "Em que ano foi fundado o Partido Liberal?",
        "opcoes": ["2006", "2010", "2015", "2019"],
        "resposta_correta": 0
    },
    {
        "id": 2,
        "pergunta": "Qual é o principal valor defendido pelo PL Jovem?",
        "opcoes": ["Socialismo", "Liberdade individual", "Estatismo", "Corporativismo"],
        "resposta_correta": 1
    },
    {
        "id": 3,
        "pergunta": "Qual é a cor oficial do Partido Liberal?",
        "opcoes": ["Vermelho", "Verde", "Azul", "Amarelo"],
        "resposta_correta": 2
    },
    {
        "id": 4,
        "pergunta": "O PL Jovem defende qual modelo econômico?",
        "opcoes": ["Economia planificada", "Livre mercado", "Economia mista total", "Protecionismo extremo"],
        "resposta_correta": 1
    },
    {
        "id": 5,
        "pergunta": "Qual é o número do Partido Liberal nas urnas?",
        "opcoes": ["13", "17", "22", "30"],
        "resposta_correta": 2
    },
    {
        "id": 6,
        "pergunta": "Qual presidente brasileiro é filiado ao PL?",
        "opcoes": ["Lula", "FHC", "Bolsonaro", "Collor"],
        "resposta_correta": 2
    },
    {
        "id": 7,
        "pergunta": "O PL Jovem incentiva o protagonismo de qual faixa etária?",
        "opcoes": ["Crianças", "Jovens e adultos jovens", "Idosos", "Apenas maiores de 40"],
        "resposta_correta": 1
    },
    {
        "id": 8,
        "pergunta": "Qual é um dos pilares do PL Jovem?",
        "opcoes": ["Aumento de impostos", "Empreendedorismo", "Controle estatal", "Censura"],
        "resposta_correta": 1
    },
    {
        "id": 9,
        "pergunta": "O PL defende qual postura em relação à segurança pública?",
        "opcoes": ["Desarmamento total", "Tolerância zero ao crime", "Abolição da polícia", "Libertação de criminosos"],
        "resposta_correta": 1
    },
    {
        "id": 10,
        "pergunta": "Qual é o foco do PL Jovem na educação?",
        "opcoes": ["Doutrinação ideológica", "Educação de qualidade e sem viés", "Fim das escolas", "Educação apenas pública"],
        "resposta_correta": 1
    }
]

@api_router.post("/register", response_model=Participant)
async def register_participant(participant: ParticipantCreate):
    existing = await db.participants.find_one({"email": participant.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    participant_dict = participant.model_dump()
    participant_obj = Participant(**participant_dict)
    
    doc = participant_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.participants.insert_one(doc)
    return participant_obj

@api_router.get("/quiz/check/{email}")
async def check_quiz_status(email: str):
    participant = await db.participants.find_one({"email": email}, {"_id": 0})
    if not participant:
        raise HTTPException(status_code=404, detail="Participante não encontrado")
    return {"completado": participant.get("completado", False)}

@api_router.get("/quiz/questions")
async def get_questions():
    questions_without_answers = [
        {"id": q["id"], "pergunta": q["pergunta"], "opcoes": q["opcoes"]}
        for q in QUESTIONS
    ]
    return questions_without_answers

@api_router.post("/quiz/submit", response_model=QuizResult)
async def submit_quiz(answer: QuizAnswer):
    participant = await db.participants.find_one({"email": answer.email}, {"_id": 0})
    if not participant:
        raise HTTPException(status_code=404, detail="Participante não encontrado")
    
    if participant.get("completado", False):
        raise HTTPException(status_code=400, detail="Quiz já foi completado")
    
    acertos = 0
    for i, resposta in enumerate(answer.respostas):
        if i < len(QUESTIONS) and resposta == QUESTIONS[i]["resposta_correta"]:
            acertos += 1
    
    pontuacao = acertos * 100
    
    await db.participants.update_one(
        {"email": answer.email},
        {"$set": {"pontuacao": pontuacao, "completado": True}}
    )
    
    return QuizResult(
        pontuacao=pontuacao,
        total_perguntas=len(QUESTIONS),
        acertos=acertos
    )

@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(login: AdminLogin):
    if login.username == "admin" and login.password == "admin123":
        token = str(uuid.uuid4())
        return AdminToken(token=token, username=login.username)
    raise HTTPException(status_code=401, detail="Credenciais inválidas")

@api_router.get("/admin/participants")
async def get_all_participants():
    participants = await db.participants.find({}, {"_id": 0}).sort("pontuacao", -1).to_list(1000)
    return participants

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()