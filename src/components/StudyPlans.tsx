import React, { useState } from 'react';
import { StudyPlan, Task } from '../types';
import { Calendar, Clock, Target, TrendingUp, CheckCircle, Circle, AlertCircle, Edit, Trash2, Play, Pause } from 'lucide-react';

interface StudyPlansProps {
  plans: StudyPlan[];
  onPlanUpdate: (plan: StudyPlan) => void;
  onPlanDelete: (planId: string) => void;
}

const StudyPlans: React.FC<StudyPlansProps> = ({ plans, onPlanUpdate, onPlanDelete }) => {
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const filteredPlans = plans.filter(plan => filter === 'all' || plan.status === filter);

  const toggleTaskStatus = (task: Task) => {
    if (!selectedPlan) return;

    const updatedTasks = selectedPlan.tasks.map(t => {
      if (t.id === task.id) {
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        return {
          ...t,
          status: newStatus,
          completedHours: newStatus === 'completed' ? t.estimatedHours : 0
        };
      }
      return t;
    });

    const completedHours = updatedTasks.reduce((sum, t) => sum + t.completedHours, 0);

    const updatedPlan = {
      ...selectedPlan,
      tasks: updatedTasks,
      completedHours
    };

    setSelectedPlan(updatedPlan);
    onPlanUpdate(updatedPlan);
  };

  const updatePlanStatus = (plan: StudyPlan, status: StudyPlan['status']) => {
    const updatedPlan = { ...plan, status };
    onPlanUpdate(updatedPlan);
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(updatedPlan);
    }
  };

  if (selectedPlan) {
    const progress = selectedPlan.totalHours > 0 ? (selectedPlan.completedHours / selectedPlan.totalHours) * 100 : 0;
    const completedTasks = selectedPlan.tasks.filter(task => task.status === 'completed').length;
    const totalTasks = selectedPlan.tasks.length;

    const tasksByCategory = selectedPlan.tasks.reduce((acc, task) => {
      if (!acc[task.category]) acc[task.category] = [];
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Back to Plans
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updatePlanStatus(selectedPlan, selectedPlan.status === 'active' ? 'paused' : 'active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  selectedPlan.status === 'active' 
                    ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                    : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                }`}
              >
                {selectedPlan.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{selectedPlan.status === 'active' ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={() => onPlanDelete(selectedPlan.id)}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold text-white mb-2">{selectedPlan.title}</h1>
              <p className="text-white/70 mb-4">{selectedPlan.subject}</p>
              
              <div className="flex items-center space-x-6 text-sm text-white/70">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedPlan.startDate).toLocaleDateString()} - {new Date(selectedPlan.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPlan.completedHours}/{selectedPlan.totalHours} hours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{completedTasks}/{totalTasks} tasks</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{completedTasks}</div>
                  <div className="text-white/70 text-sm">Completed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{totalTasks - completedTasks}</div>
                  <div className="text-white/70 text-sm">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        {selectedPlan.weaknesses.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedPlan.weaknesses.map((weakness, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium"
                >
                  {weakness}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tasks by Category */}
        <div className="space-y-6">
          {Object.entries(tasksByCategory).map(([category, tasks]) => {
            const categoryCompleted = tasks.filter(t => t.status === 'completed').length;
            const categoryProgress = (categoryCompleted / tasks.length) * 100;

            return (
              <div key={category} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                  <span className="text-white/70 text-sm">{categoryCompleted}/{tasks.length} completed</span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${categoryProgress}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => {
                    const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysUntilDue < 0;
                    const isUrgent = daysUntilDue <= 2 && daysUntilDue >= 0;

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          task.status === 'completed'
                            ? 'bg-green-500/10 border-green-500/30'
                            : isOverdue
                            ? 'bg-red-500/10 border-red-500/30'
                            : isUrgent
                            ? 'bg-orange-500/10 border-orange-500/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleTaskStatus(task)}
                            className={`mt-1 transition-colors ${
                              task.status === 'completed'
                                ? 'text-green-400 hover:text-green-300'
                                : 'text-white/50 hover:text-white'
                            }`}
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              task.status === 'completed' ? 'text-white/70 line-through' : 'text-white'
                            }`}>
                              {task.title}
                            </h4>
                            <p className="text-white/60 text-sm mt-1">{task.description}</p>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-4 text-sm text-white/70">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {task.estimatedHours}h
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-green-500/20 text-green-300'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>

                              <span className={`text-sm font-medium ${
                                isOverdue ? 'text-red-300' :
                                isUrgent ? 'text-orange-300' :
                                'text-white/70'
                              }`}>
                                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                                 daysUntilDue === 0 ? 'Due today' :
                                 daysUntilDue === 1 ? 'Due tomorrow' :
                                 `Due in ${daysUntilDue} days`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Study Plans</h2>
        <div className="flex items-center space-x-2">
          {(['all', 'active', 'completed', 'paused'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Study Plans Found</h3>
          <p className="text-white/70">
            {filter === 'all' 
              ? "You haven't created any study plans yet. Create your first plan to get started!"
              : `No ${filter} study plans found.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const progress = plan.totalHours > 0 ? (plan.completedHours / plan.totalHours) * 100 : 0;
            const completedTasks = plan.tasks.filter(task => task.status === 'completed').length;
            const totalTasks = plan.tasks.length;
            const daysLeft = Math.ceil((new Date(plan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {plan.title}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">{plan.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.type === 'exam' ? 'bg-red-500/20 text-red-300' :
                      plan.type === 'project' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {plan.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      plan.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-white/70 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{completedTasks}/{totalTasks}</div>
                      <div className="text-white/70 text-xs">Tasks</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${daysLeft < 0 ? 'text-red-300' : daysLeft <= 7 ? 'text-orange-300' : 'text-white'}`}>
                        {daysLeft < 0 ? 'Overdue' : `${daysLeft}d`}
                      </div>
                      <div className="text-white/70 text-xs">
                        {daysLeft < 0 ? 'Days' : 'Days Left'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>{plan.completedHours}/{plan.totalHours}h</span>
                      <span>{new Date(plan.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyPlans;