import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Award, Users, Trophy } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center" data-testid="logo-container">
            <motion.img
              src="https://customer-assets.emergentagent.com/job_pl-history-challenge/artifacts/c46t6jpj_PLJ%20TRANSPARENTE.png"
              alt="PLJ Chega ai Logo"
              className="w-64 h-64 object-contain drop-shadow-2xl"
              style={{ mixBlendMode: 'multiply' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              data-testid="logo-image"
            />
          </div>

          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 uppercase tracking-tight" data-testid="main-heading">
            Quiz PL Jovem
          </h1>

          <p className="font-body text-xl sm:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed" data-testid="subtitle">
            Teste seus conhecimentos sobre a história do PL Jovem e mostre que você é um verdadeiro patriota!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              data-testid="feature-questions"
            >
              <Award className="w-8 h-8 text-secondary mb-3 mx-auto" />
              <h3 className="font-heading font-bold text-white text-lg uppercase">10 Perguntas</h3>
              <p className="text-blue-100 text-sm mt-2">Desafie seu conhecimento</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              data-testid="feature-points"
            >
              <Trophy className="w-8 h-8 text-secondary mb-3 mx-auto" />
              <h3 className="font-heading font-bold text-white text-lg uppercase">100 Pontos</h3>
              <p className="text-blue-100 text-sm mt-2">Por cada acerto</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              data-testid="feature-ranking"
            >
              <Users className="w-8 h-8 text-secondary mb-3 mx-auto" />
              <h3 className="font-heading font-bold text-white text-lg uppercase">Ranking</h3>
              <p className="text-blue-100 text-sm mt-2">Compare sua pontuação</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate('/register')}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-2xl hover:shadow-secondary/50 font-heading uppercase tracking-wide text-xl py-8 px-12 rounded-xl group"
              size="lg"
              data-testid="start-quiz-button"
            >
              Começar Quiz
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 text-blue-200 text-sm"
          >
            Apenas uma tentativa por participante
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-4 right-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="text-white/60 hover:text-white text-xs"
          data-testid="admin-access-link"
        >
          Acesso Admin
        </Button>
      </div>
    </div>
  );
};

export default Landing;