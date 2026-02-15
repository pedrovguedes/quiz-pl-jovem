import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { LogOut, Users, Trophy, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminToken, setAdminToken } = useQuiz();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin');
      return;
    }

    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`${API}/admin/participants`);
        setParticipants(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Erro ao carregar participantes');
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [adminToken, navigate]);

  const handleLogout = () => {
    setAdminToken(null);
    navigate('/admin');
  };

  const completedParticipants = participants.filter((p) => p.completado);
  const averageScore = completedParticipants.length > 0
    ? Math.round(completedParticipants.reduce((acc, p) => acc + p.pontuacao, 0) / completedParticipants.length)
    : 0;
  const maxScore = completedParticipants.length > 0
    ? Math.max(...completedParticipants.map((p) => p.pontuacao))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-body">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-heading font-bold text-2xl uppercase tracking-tight" data-testid="dashboard-heading">
              Dashboard Admin
            </h1>
            <p className="text-slate-400 text-sm font-body">PL Jovem Quiz</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
            data-testid="stat-total-participants"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-heading uppercase text-xs text-slate-600 tracking-wider">Total de Participantes</span>
            </div>
            <div className="font-heading font-bold text-4xl text-primary">{participants.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
            data-testid="stat-average-score"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="font-heading uppercase text-xs text-slate-600 tracking-wider">Média de Pontos</span>
            </div>
            <div className="font-heading font-bold text-4xl text-secondary">{averageScore}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
            data-testid="stat-max-score"
          >
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="font-heading uppercase text-xs text-slate-600 tracking-wider">Maior Pontuação</span>
            </div>
            <div className="font-heading font-bold text-4xl text-accent">{maxScore}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-heading font-bold text-xl text-slate-800 uppercase" data-testid="participants-table-heading">
              Lista de Participantes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" data-testid="participants-table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-heading uppercase text-xs text-slate-600 tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-left font-heading uppercase text-xs text-slate-600 tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left font-heading uppercase text-xs text-slate-600 tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-left font-heading uppercase text-xs text-slate-600 tracking-wider">Endereço</th>
                  <th className="px-6 py-4 text-center font-heading uppercase text-xs text-slate-600 tracking-wider">Pontuação</th>
                  <th className="px-6 py-4 text-center font-heading uppercase text-xs text-slate-600 tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-body">
                      Nenhum participante ainda
                    </td>
                  </tr>
                ) : (
                  participants.map((participant, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors" data-testid={`participant-row-${index}`}>
                      <td className="px-6 py-4 font-body font-medium text-slate-800">{participant.nome}</td>
                      <td className="px-6 py-4 font-body text-slate-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {participant.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-slate-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {participant.telefone}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body text-slate-600 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {participant.endereco}, {participant.numero} - CEP: {participant.cep}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block font-heading font-bold text-lg text-primary">
                          {participant.pontuacao}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {participant.completado ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-heading uppercase">
                            Completado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-heading uppercase">
                            Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;