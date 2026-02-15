import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/context/QuizContext';
import { Trophy, Award, Target, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

const Result = () => {
  const navigate = useNavigate();
  const { quizResult, participant } = useQuiz();

  useEffect(() => {
    if (!quizResult || !participant) {
      navigate('/');
      return;
    }

    if (quizResult.acertos >= 7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [quizResult, participant, navigate]);

  if (!quizResult || !participant) return null;

  const percentage = (quizResult.acertos / quizResult.total_perguntas) * 100;
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;

  const getMessage = () => {
    if (isExcellent) return 'Excelente! Você é um expert no PL Jovem!';
    if (isGood) return 'Muito bem! Você conhece bastante sobre o PL Jovem!';
    return 'Continue estudando! Todo conhecimento é importante!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Trophy className="w-24 h-24 text-secondary mx-auto mb-6" data-testid="trophy-icon" />
          </motion.div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary uppercase tracking-tight mb-4" data-testid="result-heading">
            Quiz Concluído!
          </h1>

          <p className="font-body text-xl text-slate-600 mb-8" data-testid="result-message">{getMessage()}</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-8 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-primary" />
              <span className="font-heading uppercase text-sm text-slate-600 tracking-wider">Sua Pontuação</span>
            </div>
            <div className="font-heading font-extrabold text-6xl text-primary mb-2" data-testid="final-score">
              {quizResult.pontuacao}
            </div>
            <div className="text-slate-600 font-body">pontos de {quizResult.total_perguntas * 100} possíveis</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-slate-50 rounded-xl p-6">
              <Target className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="font-heading font-bold text-3xl text-accent" data-testid="correct-answers">{quizResult.acertos}</div>
              <div className="text-slate-600 text-sm font-body">Acertos</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="font-heading font-bold text-3xl text-slate-600" data-testid="accuracy-percentage">{Math.round(percentage)}%</div>
              <div className="text-slate-600 text-sm font-body">Aproveitamento</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl font-heading uppercase tracking-wide text-lg py-6 rounded-xl"
              data-testid="home-button"
            >
              <Home className="w-5 h-5 mr-2" />
              Voltar ao Início
            </Button>
          </motion.div>

          <p className="mt-6 text-slate-500 text-sm font-body">Obrigado por participar, {participant.nome}!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Result;