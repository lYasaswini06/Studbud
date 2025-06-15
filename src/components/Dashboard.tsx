import React from 'react';
import { StudyPlan } from '../types';
import { Calendar, Clock, TrendingUp, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardProps {
  plans: StudyPlan[];
  onPlanSelect: (plan: StudyPlan) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plans, onPlanSelect }) => {
  const activePlans = plans.filter(plan => plan.status === 'active');
  const completedPlans = plans.filter(plan => plan.status === 'completed');
  const totalHours = plans.reduce((sum, plan) => sum + plan.completedHours, 0);
  const upcomingTasks = plans.flatMap(plan => 
    plan.tasks.filter(task => task.status === 'pending')
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5);

  const stats = [
    { label: 'Active Plans', value: activePlans.length, icon: Target, color: 'blue' },
    { label: 'Completed Plans', value: completedPlans.length, icon: CheckCircle, color: 'green' },
    { label: 'Study Hours', value: totalHours, icon: Clock, color: 'purple' },
    { label: 'Upcoming Tasks', value: upcomingTasks.length, icon: AlertCircle, color: 'orange' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to Your Study Dashboard</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Track your progress, manage your study plans, and achieve your academic goals with AI-powered insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Plans */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Active Study Plans
        </h3>
        {activePlans.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No active study plans. Create your first plan to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePlans.map((plan) => {
              const progress = plan.totalHours > 0 ? (plan.completedHours / plan.totalHours) * 100 : 0;
              const completedTasks = plan.tasks.filter(task => task.status === 'completed').length;
              const totalTasks = plan.tasks.length;
              
              return (
                <div
                  key={plan.id}
                  onClick={() => onPlanSelect(plan)}
                  className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {plan.title}
                      </h4>
                      <p className="text-white/60 text-sm mt-1">{plan.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.type === 'exam' ? 'bg-red-500/20 text-red-300' :
                      plan.type === 'project' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {plan.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-white/70 mb-1">
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
                    
                    <div className="flex justify-between text-sm text-white/70">
                      <span>Tasks: {completedTasks}/{totalTasks}</span>
                      <span>Due: {new Date(plan.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Tasks
        </h3>
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">All caught up! No upcoming tasks.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => {
              const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysUntilDue <= 2;
              
              return (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <p className="text-white/60 text-sm mt-1">{task.category}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isUrgent ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {daysUntilDue === 0 ? 'Due Today' :
                       daysUntilDue === 1 ? 'Due Tomorrow' :
                       `${daysUntilDue} days`}
                    </span>
                    <p className="text-white/60 text-xs mt-1">{task.estimatedHours}h</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;