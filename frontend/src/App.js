import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Landing from '@/pages/Landing';
import Register from '@/pages/Register';
import Quiz from '@/pages/Quiz';
import Result from '@/pages/Result';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import { QuizProvider } from '@/context/QuizContext';
import '@/App.css';

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;