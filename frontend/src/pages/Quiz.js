import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/context/QuizContext';
import { CheckCircle2, XCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Quiz = () => {
  const navigate = useNavigate();
  const { participant, setQuizResult } = useQuiz();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!participant) {
      navigate('/register');
      return;
    }

    const checkAndLoadQuiz = async () => {
      try {
        const statusRes = await axios.get(`${API}/quiz/check/${participant.email}`);
        if (statusRes.data.completado) {
          toast.error('Você já completou o quiz!');
          navigate('/');
          return;
        }

        const questionsRes = await axios.get(`${API}/quiz/questions`);
        setQuestions(questionsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Erro ao carregar quiz');
        navigate('/');
      }
    };

    checkAndLoadQuiz();
  }, [participant, navigate]);

  const handleSelectOption = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast.error('Selecione uma resposta');
      return;
    }

    const newAnswers = [...selectedAnswers, selectedOption];
    setSelectedAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (answers) => {
    try {
      const response = await axios.post(`${API}/quiz/submit`, {
        email: participant.email,
        respostas: answers,
      });
      setQuizResult(response.data);
      navigate('/result');
    } catch (error) {
      toast.error('Erro ao enviar respostas');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-body">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-heading uppercase text-sm text-slate-600 tracking-wider" data-testid="question-counter">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="font-body text-sm text-slate-600" data-testid="progress-text">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
          >
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-primary mb-8 leading-tight" data-testid="question-text">
              {question.pergunta}
            </h2>

            <div className="space-y-4">
              {question.opcoes.map((opcao, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all font-body font-medium text-lg relative group ${
                    selectedOption === index
                      ? 'border-primary bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-primary/50 hover:bg-blue-50/50'
                  }`}
                  data-testid={`option-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedOption === index
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300 group-hover:border-primary/50'
                      }`}
                    >
                      {selectedOption === index && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <span className="flex-1">{opcao}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="w-full mt-8 bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl font-heading uppercase tracking-wide text-lg py-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="next-button"
            >
              {currentQuestion < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
            </Button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Quiz;