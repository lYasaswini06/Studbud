import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreatePlan from './components/CreatePlan';
import StudyPlans from './components/StudyPlans';
import { StudyPlan } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  // Load plans from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('studyPlans');
    if (savedPlans) {
      setStudyPlans(JSON.parse(savedPlans));
    }
  }, []);

  // Save plans to localStorage whenever plans change
  useEffect(() => {
    localStorage.setItem('studyPlans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  const handlePlanCreated = (plan: StudyPlan) => {
    setStudyPlans(prev => [...prev, plan]);
    setCurrentView('plans');
  };

  const handlePlanUpdate = (updatedPlan: StudyPlan) => {
    setStudyPlans(prev => prev.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    ));
  };

  const handlePlanDelete = (planId: string) => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== planId));
    setCurrentView('plans');
  };

  const handlePlanSelect = (plan: StudyPlan) => {
    setCurrentView('plans');
    // The StudyPlans component will handle the selection
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard plans={studyPlans} onPlanSelect={handlePlanSelect} />;
      case 'create':
        return <CreatePlan onPlanCreated={handlePlanCreated} />;
      case 'plans':
        return (
          <StudyPlans
            plans={studyPlans}
            onPlanUpdate={handlePlanUpdate}
            onPlanDelete={handlePlanDelete}
          />
        );
      default:
        return <Dashboard plans={studyPlans} onPlanSelect={handlePlanSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentView()}
        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;