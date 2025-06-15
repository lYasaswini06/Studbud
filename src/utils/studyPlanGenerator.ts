import { StudyPlan, Task, PlanFormData } from '../types';
import { v4 as uuidv4 } from '../utils/uuid';

const LEARNING_METHODS = {
  visual: ['Flashcards', 'Mind Maps', 'Diagrams', 'Video Tutorials'],
  auditory: ['Podcasts', 'Discussion Groups', 'Voice Recordings', 'Lectures'],
  kinesthetic: ['Practice Problems', 'Lab Work', 'Simulations', 'Hands-on Projects'],
  reading: ['Textbooks', 'Articles', 'Research Papers', 'Note-taking']
};

const EXAM_TOPICS = {
  math: ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry'],
  science: ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
  language: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing', 'Speaking'],
  history: ['Ancient History', 'Modern History', 'World Wars', 'Political Systems'],
  business: ['Marketing', 'Finance', 'Operations', 'Strategy', 'Leadership']
};

const PROJECT_PHASES = {
  research: ['Literature Review', 'Data Collection', 'Market Analysis', 'Requirements Gathering'],
  planning: ['Project Scope', 'Timeline Creation', 'Resource Planning', 'Risk Assessment'],
  development: ['Prototype Creation', 'Implementation', 'Testing', 'Iteration'],
  finalization: ['Documentation', 'Presentation Prep', 'Final Review', 'Submission']
};

export function generateStudyPlan(formData: PlanFormData): StudyPlan {
  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * formData.dailyHours;

  const tasks = generateTasks(formData, totalDays);

  return {
    id: uuidv4(),
    title: formData.title,
    type: formData.type,
    subject: formData.subject,
    startDate: formData.startDate,
    endDate: formData.endDate,
    totalHours,
    completedHours: 0,
    tasks,
    weaknesses: formData.weaknesses,
    learningMethods: formData.learningMethods,
    status: 'active',
    createdAt: new Date().toISOString()
  };
}

function generateTasks(formData: PlanFormData, totalDays: number): Task[] {
  const tasks: Task[] = [];
  let currentDate = new Date(formData.startDate);

  switch (formData.type) {
    case 'exam':
      return generateExamTasks(formData, totalDays, currentDate);
    case 'project':
      return generateProjectTasks(formData, totalDays, currentDate);
    case 'subject':
      return generateSubjectTasks(formData, totalDays, currentDate);
    default:
      return [];
  }
}

function generateExamTasks(formData: PlanFormData, totalDays: number, startDate: Date): Task[] {
  const tasks: Task[] = [];
  const subjectTopics = getSubjectTopics(formData.subject);
  const weaknessTopics = formData.weaknesses;
  
  // Phase 1: Foundation (40% of time)
  const foundationDays = Math.floor(totalDays * 0.4);
  subjectTopics.slice(0, 3).forEach((topic, index) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + Math.floor((foundationDays / 3) * (index + 1)));
    
    tasks.push({
      id: uuidv4(),
      title: `Master ${topic} Fundamentals`,
      description: `Study core concepts and basic principles of ${topic}`,
      dueDate: dueDate.toISOString().split('T')[0],
      estimatedHours: formData.dailyHours * 3,
      completedHours: 0,
      priority: weaknessTopics.includes(topic) ? 'high' : 'medium',
      status: 'pending',
      category: 'Foundation'
    });
  });

  // Phase 2: Practice (35% of time)
  const practiceStart = foundationDays;
  const practiceDays = Math.floor(totalDays * 0.35);
  subjectTopics.forEach((topic, index) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + practiceStart + Math.floor((practiceDays / subjectTopics.length) * (index + 1)));
    
    tasks.push({
      id: uuidv4(),
      title: `${topic} Practice Problems`,
      description: `Complete practice exercises and solve sample problems for ${topic}`,
      dueDate: dueDate.toISOString().split('T')[0],
      estimatedHours: formData.dailyHours * 2,
      completedHours: 0,
      priority: weaknessTopics.includes(topic) ? 'high' : 'medium',
      status: 'pending',
      category: 'Practice'
    });
  });

  // Phase 3: Review (25% of time)
  const reviewStart = foundationDays + practiceDays;
  const reviewDays = totalDays - reviewStart;
  
  tasks.push({
    id: uuidv4(),
    title: 'Comprehensive Review',
    description: 'Review all topics and focus on identified weaknesses',
    dueDate: new Date(startDate.getTime() + (reviewStart + Math.floor(reviewDays * 0.6)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: formData.dailyHours * 4,
    completedHours: 0,
    priority: 'high',
    status: 'pending',
    category: 'Review'
  });

  tasks.push({
    id: uuidv4(),
    title: 'Mock Exams',
    description: 'Take practice exams under timed conditions',
    dueDate: formData.endDate,
    estimatedHours: formData.dailyHours * 2,
    completedHours: 0,
    priority: 'high',
    status: 'pending',
    category: 'Assessment'
  });

  return tasks;
}

function generateProjectTasks(formData: PlanFormData, totalDays: number, startDate: Date): Task[] {
  const tasks: Task[] = [];
  const phases = Object.keys(PROJECT_PHASES);
  const daysPerPhase = Math.floor(totalDays / phases.length);

  phases.forEach((phase, phaseIndex) => {
    const phaseActivities = PROJECT_PHASES[phase as keyof typeof PROJECT_PHASES];
    const activitiesPerPhase = phaseActivities.length;
    
    phaseActivities.forEach((activity, activityIndex) => {
      const dueDate = new Date(startDate);
      const dayOffset = (phaseIndex * daysPerPhase) + Math.floor((daysPerPhase / activitiesPerPhase) * (activityIndex + 1));
      dueDate.setDate(dueDate.getDate() + dayOffset);
      
      tasks.push({
        id: uuidv4(),
        title: activity,
        description: `Complete ${activity} for ${formData.subject} project`,
        dueDate: dueDate.toISOString().split('T')[0],
        estimatedHours: Math.max(2, Math.floor(formData.dailyHours * 1.5)),
        completedHours: 0,
        priority: phaseIndex === phases.length - 1 ? 'high' : 'medium',
        status: 'pending',
        category: phase.charAt(0).toUpperCase() + phase.slice(1)
      });
    });
  });

  return tasks;
}

function generateSubjectTasks(formData: PlanFormData, totalDays: number, startDate: Date): Task[] {
  const tasks: Task[] = [];
  const subjectTopics = getSubjectTopics(formData.subject);
  const weeklyTopics = Math.ceil(subjectTopics.length / Math.ceil(totalDays / 7));
  
  subjectTopics.forEach((topic, index) => {
    const weekNumber = Math.floor(index / weeklyTopics);
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + (weekNumber + 1) * 7);
    
    // Study task
    tasks.push({
      id: uuidv4(),
      title: `Study ${topic}`,
      description: `Learn and understand ${topic} concepts`,
      dueDate: dueDate.toISOString().split('T')[0],
      estimatedHours: formData.dailyHours * 3,
      completedHours: 0,
      priority: formData.weaknesses.includes(topic) ? 'high' : 'medium',
      status: 'pending',
      category: 'Learning'
    });

    // Practice task
    const practiceDate = new Date(dueDate);
    practiceDate.setDate(practiceDate.getDate() + 3);
    
    tasks.push({
      id: uuidv4(),
      title: `Practice ${topic}`,
      description: `Apply ${topic} knowledge through exercises`,
      dueDate: practiceDate.toISOString().split('T')[0],
      estimatedHours: formData.dailyHours * 2,
      completedHours: 0,
      priority: formData.weaknesses.includes(topic) ? 'high' : 'medium',
      status: 'pending',
      category: 'Practice'
    });
  });

  return tasks;
}

function getSubjectTopics(subject: string): string[] {
  const subjectLower = subject.toLowerCase();
  if (subjectLower.includes('math')) return EXAM_TOPICS.math;
  if (subjectLower.includes('science') || subjectLower.includes('physics') || subjectLower.includes('chemistry') || subjectLower.includes('biology')) return EXAM_TOPICS.science;
  if (subjectLower.includes('language') || subjectLower.includes('english') || subjectLower.includes('literature')) return EXAM_TOPICS.language;
  if (subjectLower.includes('history')) return EXAM_TOPICS.history;
  if (subjectLower.includes('business') || subjectLower.includes('management')) return EXAM_TOPICS.business;
  
  // Default generic topics
  return ['Introduction', 'Core Concepts', 'Advanced Topics', 'Applications', 'Review'];
}