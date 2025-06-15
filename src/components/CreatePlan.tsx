import React, { useState } from 'react';
import { PlanFormData } from '../types';
import { generateStudyPlan } from '../utils/studyPlanGenerator';
import { Brain, BookOpen, Briefcase, GraduationCap, Plus, X } from 'lucide-react';

interface CreatePlanProps {
  onPlanCreated: (plan: any) => void;
}

const CreatePlan: React.FC<CreatePlanProps> = ({ onPlanCreated }) => {
  const [formData, setFormData] = useState<PlanFormData>({
    title: '',
    type: 'exam',
    subject: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dailyHours: 2,
    weaknesses: [],
    learningMethods: [],
    goals: ''
  });

  const [newWeakness, setNewWeakness] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const planTypes = [
    { id: 'exam', title: 'Exam Preparation', description: 'Focus on weaknesses and effective time allocation', icon: GraduationCap },
    { id: 'project', title: 'Project Completion', description: 'Break down tasks and meet deadlines', icon: Briefcase },
    { id: 'subject', title: 'Subject Mastery', description: 'Balanced schedule with various learning methods', icon: BookOpen }
  ];

  const learningMethods = [
    'Visual Learning', 'Reading & Writing', 'Auditory Learning', 'Kinesthetic Learning',
    'Practice Problems', 'Group Study', 'Flashcards', 'Mind Mapping',
    'Video Tutorials', 'Online Courses', 'Laboratory Work', 'Discussion Forums'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const plan = generateStudyPlan(formData);
    onPlanCreated(plan);
    setIsGenerating(false);

    // Reset form
    setFormData({
      title: '',
      type: 'exam',
      subject: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      dailyHours: 2,
      weaknesses: [],
      learningMethods: [],
      goals: ''
    });
  };

  const addWeakness = () => {
    if (newWeakness.trim() && !formData.weaknesses.includes(newWeakness.trim())) {
      setFormData(prev => ({
        ...prev,
        weaknesses: [...prev.weaknesses, newWeakness.trim()]
      }));
      setNewWeakness('');
    }
  };

  const removeWeakness = (weakness: string) => {
    setFormData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.filter(w => w !== weakness)
    }));
  };

  const toggleLearningMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      learningMethods: prev.learningMethods.includes(method)
        ? prev.learningMethods.filter(m => m !== method)
        : [...prev.learningMethods, method]
    }));
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Generating Your AI Study Plan</h3>
          <p className="text-white/70">Analyzing your requirements and creating a personalized schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Create Your AI-Powered Study Plan</h2>
        <p className="text-white/70 text-lg">
          Let our AI analyze your needs and generate a personalized study schedule tailored to your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Plan Type Selection */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Choose Your Study Plan Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id as any }))}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    formData.type === type.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-8 h-8 text-white mb-3" />
                  <h4 className="font-semibold text-white mb-2">{type.title}</h4>
                  <p className="text-white/70 text-sm">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/90 font-medium mb-2">Plan Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Final Exam Preparation"
              />
            </div>
            <div>
              <label className="block text-white/90 font-medium mb-2">Subject *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics, Computer Science"
              />
            </div>
            <div>
              <label className="block text-white/90 font-medium mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white/90 font-medium mb-2">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-white/90 font-medium mb-2">Daily Study Hours</label>
              <input
                type="range"
                min="1"
                max="12"
                value={formData.dailyHours}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyHours: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-white/70 text-sm mt-1">
                <span>1 hour</span>
                <span className="font-medium text-white">{formData.dailyHours} hours/day</span>
                <span>12 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Areas of Improvement</h3>
          <p className="text-white/70 mb-4">Add topics or areas where you need extra focus and practice.</p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newWeakness}
              onChange={(e) => setNewWeakness(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWeakness())}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Calculus, Data Structures"
            />
            <button
              type="button"
              onClick={addWeakness}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.weaknesses.map((weakness, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm"
              >
                {weakness}
                <button
                  type="button"
                  onClick={() => removeWeakness(weakness)}
                  className="ml-2 text-red-300 hover:text-red-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Learning Methods */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Preferred Learning Methods</h3>
          <p className="text-white/70 mb-4">Select your preferred learning styles to personalize your study plan.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {learningMethods.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => toggleLearningMethod(method)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.learningMethods.includes(method)
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                    : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10 hover:text-white'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Study Goals</h3>
          <textarea
            value={formData.goals}
            onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe your specific goals and what you want to achieve..."
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto"
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate AI Study Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlan;