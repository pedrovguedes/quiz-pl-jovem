import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [participant, setParticipant] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  const value = {
    participant,
    setParticipant,
    quizResult,
    setQuizResult,
    adminToken,
    setAdminToken,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};