import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuiz } from '@/context/QuizContext';
import { Lock, User, ArrowLeft, Shield } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAdminToken } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      setAdminToken(response.data);
      toast.success('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-slate-400 hover:text-white"
          data-testid="back-to-home-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-3xl text-slate-800 uppercase tracking-tight mb-2" data-testid="admin-login-heading">
              Acesso Admin
            </h1>
            <p className="text-slate-600 font-body">Visualize os resultados dos participantes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <Label htmlFor="username" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuário
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                placeholder="admin"
                data-testid="input-username"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-heading uppercase text-xs tracking-wider text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="mt-2 h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary/20 rounded-lg"
                placeholder="••••••••"
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl font-heading uppercase tracking-wide text-lg py-6 rounded-xl"
              data-testid="login-button"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Credenciais padrão:</p>
            <p className="font-mono text-xs mt-1">admin / admin123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;