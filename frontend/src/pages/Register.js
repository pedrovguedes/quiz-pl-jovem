import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuiz } from '@/context/QuizContext';
import { ArrowLeft, User, Mail, Phone, MapPin, Home, Navigation } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Register = () => {
  const navigate = useNavigate();
  const { setParticipant } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    numero: '',
    cep: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCEP = (value) => {
    const cep = value.replace(/\D/g, '');
    if (cep.length <= 5) return cep;
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 2) return `(${phone}`;
    if (phone.length <= 6) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    if (phone.length <= 10) return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
  };

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setFormData((prev) => ({ ...prev, cep: formatted }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/register`, formData);
      setParticipant(response.data);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/quiz');
    } catch (error) {
      const message = error.response?.data?.detail || 'Erro ao realizar cadastro';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-slate-600 hover:text-primary"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl text-primary uppercase tracking-tight mb-2" data-testid="register-heading">
              Cadastro
            </h1>
            <p className="text-slate-600 font-body">Preencha seus dados para participar do quiz</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="registration-form">
            <div>
              <Label htmlFor="nome" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo *
              </Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                placeholder="Seu nome completo"
                data-testid="input-nome"
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                placeholder="seu@email.com"
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="telefone" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone *
              </Label>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                required
                value={formData.telefone}
                onChange={handlePhoneChange}
                className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                placeholder="(11) 98765-4321"
                maxLength={15}
                data-testid="input-telefone"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="endereco" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Endereço *
                </Label>
                <Input
                  id="endereco"
                  name="endereco"
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={handleChange}
                  className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                  placeholder="Rua, Avenida..."
                  data-testid="input-endereco"
                />
              </div>

              <div>
                <Label htmlFor="numero" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Número *
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  type="text"
                  required
                  value={formData.numero}
                  onChange={handleChange}
                  className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                  placeholder="123"
                  data-testid="input-numero"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cep" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                CEP *
              </Label>
              <Input
                id="cep"
                name="cep"
                type="text"
                required
                value={formData.cep}
                onChange={handleCEPChange}
                className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                placeholder="12345-678"
                maxLength={9}
                data-testid="input-cep"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl font-heading uppercase tracking-wide text-lg py-6 rounded-xl"
              data-testid="submit-button"
            >
              {loading ? 'Cadastrando...' : 'Continuar para o Quiz'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;