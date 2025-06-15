import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import uuid
from typing import Dict, List, Any
import numpy as np

# Configure page
st.set_page_config(
    page_title="Studbud - AI Study Planner",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for beautiful styling
st.markdown("""
<style>
    .main {
        padding-top: 2rem;
    }
    
    .stApp {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .study-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 1rem 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .metric-card {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 1.5rem;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 0.5rem;
    }
    
    .task-card {
        background: rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
        border-left: 4px solid #4CAF50;
        transition: all 0.3s ease;
    }
    
    .task-card:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: translateY(-2px);
    }
    
    .completed-task {
        border-left-color: #2196F3;
        opacity: 0.7;
    }
    
    .high-priority {
        border-left-color: #f44336;
    }
    
    .medium-priority {
        border-left-color: #ff9800;
    }
    
    .low-priority {
        border-left-color: #4caf50;
    }
    
    .header-title {
        color: white;
        text-align: center;
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .header-subtitle {
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
    
    .sidebar .sidebar-content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    }
    
    .stSelectbox > div > div {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
    
    .stTextInput > div > div > input {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: white;
    }
    
    .stTextArea > div > div > textarea {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: white;
    }
    
    .stButton > button {
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border-radius: 25px;
        border: none;
        padding: 0.75rem 2rem;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .progress-bar {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        height: 10px;
        overflow: hidden;
    }
    
    .progress-fill {
        background: linear-gradient(45deg, #4CAF50, #2196F3);
        height: 100%;
        border-radius: 10px;
        transition: width 0.5s ease;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'study_plans' not in st.session_state:
    st.session_state.study_plans = []
if 'current_view' not in st.session_state:
    st.session_state.current_view = 'dashboard'
if 'selected_plan' not in st.session_state:
    st.session_state.selected_plan = None

class StudyPlanGenerator:
    def __init__(self):
        self.learning_methods = {
            'visual': ['Flashcards', 'Mind Maps', 'Diagrams', 'Video Tutorials'],
            'auditory': ['Podcasts', 'Discussion Groups', 'Voice Recordings', 'Lectures'],
            'kinesthetic': ['Practice Problems', 'Lab Work', 'Simulations', 'Hands-on Projects'],
            'reading': ['Textbooks', 'Articles', 'Research Papers', 'Note-taking']
        }
        
        self.exam_topics = {
            'math': ['Algebra', 'Calculus', 'Statistics', 'Geometry', 'Trigonometry'],
            'science': ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
            'language': ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing', 'Speaking'],
            'history': ['Ancient History', 'Modern History', 'World Wars', 'Political Systems'],
            'business': ['Marketing', 'Finance', 'Operations', 'Strategy', 'Leadership']
        }
        
        self.project_phases = {
            'research': ['Literature Review', 'Data Collection', 'Market Analysis', 'Requirements Gathering'],
            'planning': ['Project Scope', 'Timeline Creation', 'Resource Planning', 'Risk Assessment'],
            'development': ['Prototype Creation', 'Implementation', 'Testing', 'Iteration'],
            'finalization': ['Documentation', 'Presentation Prep', 'Final Review', 'Submission']
        }
    
    def generate_study_plan(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        start_date = datetime.strptime(form_data['start_date'], '%Y-%m-%d')
        end_date = datetime.strptime(form_data['end_date'], '%Y-%m-%d')
        total_days = (end_date - start_date).days + 1
        total_hours = total_days * form_data['daily_hours']
        
        tasks = self._generate_tasks(form_data, total_days, start_date)
        
        return {
            'id': str(uuid.uuid4()),
            'title': form_data['title'],
            'type': form_data['type'],
            'subject': form_data['subject'],
            'start_date': form_data['start_date'],
            'end_date': form_data['end_date'],
            'total_hours': total_hours,
            'completed_hours': 0,
            'tasks': tasks,
            'weaknesses': form_data['weaknesses'],
            'learning_methods': form_data['learning_methods'],
            'status': 'active',
            'created_at': datetime.now().isoformat()
        }
    
    def _generate_tasks(self, form_data: Dict[str, Any], total_days: int, start_date: datetime) -> List[Dict[str, Any]]:
        if form_data['type'] == 'exam':
            return self._generate_exam_tasks(form_data, total_days, start_date)
        elif form_data['type'] == 'project':
            return self._generate_project_tasks(form_data, total_days, start_date)
        else:  # subject
            return self._generate_subject_tasks(form_data, total_days, start_date)
    
    def _generate_exam_tasks(self, form_data: Dict[str, Any], total_days: int, start_date: datetime) -> List[Dict[str, Any]]:
        tasks = []
        subject_topics = self._get_subject_topics(form_data['subject'])
        weakness_topics = form_data['weaknesses']
        
        # Phase 1: Foundation (40% of time)
        foundation_days = int(total_days * 0.4)
        for i, topic in enumerate(subject_topics[:3]):
            due_date = start_date + timedelta(days=int((foundation_days / 3) * (i + 1)))
            tasks.append({
                'id': str(uuid.uuid4()),
                'title': f'Master {topic} Fundamentals',
                'description': f'Study core concepts and basic principles of {topic}',
                'due_date': due_date.strftime('%Y-%m-%d'),
                'estimated_hours': form_data['daily_hours'] * 3,
                'completed_hours': 0,
                'priority': 'high' if topic in weakness_topics else 'medium',
                'status': 'pending',
                'category': 'Foundation'
            })
        
        # Phase 2: Practice (35% of time)
        practice_start = foundation_days
        practice_days = int(total_days * 0.35)
        for i, topic in enumerate(subject_topics):
            due_date = start_date + timedelta(days=practice_start + int((practice_days / len(subject_topics)) * (i + 1)))
            tasks.append({
                'id': str(uuid.uuid4()),
                'title': f'{topic} Practice Problems',
                'description': f'Complete practice exercises and solve sample problems for {topic}',
                'due_date': due_date.strftime('%Y-%m-%d'),
                'estimated_hours': form_data['daily_hours'] * 2,
                'completed_hours': 0,
                'priority': 'high' if topic in weakness_topics else 'medium',
                'status': 'pending',
                'category': 'Practice'
            })
        
        # Phase 3: Review (25% of time)
        review_start = foundation_days + practice_days
        review_days = total_days - review_start
        
        tasks.append({
            'id': str(uuid.uuid4()),
            'title': 'Comprehensive Review',
            'description': 'Review all topics and focus on identified weaknesses',
            'due_date': (start_date + timedelta(days=review_start + int(review_days * 0.6))).strftime('%Y-%m-%d'),
            'estimated_hours': form_data['daily_hours'] * 4,
            'completed_hours': 0,
            'priority': 'high',
            'status': 'pending',
            'category': 'Review'
        })
        
        tasks.append({
            'id': str(uuid.uuid4()),
            'title': 'Mock Exams',
            'description': 'Take practice exams under timed conditions',
            'due_date': form_data['end_date'],
            'estimated_hours': form_data['daily_hours'] * 2,
            'completed_hours': 0,
            'priority': 'high',
            'status': 'pending',
            'category': 'Assessment'
        })
        
        return tasks
    
    def _generate_project_tasks(self, form_data: Dict[str, Any], total_days: int, start_date: datetime) -> List[Dict[str, Any]]:
        tasks = []
        phases = list(self.project_phases.keys())
        days_per_phase = total_days // len(phases)
        
        for phase_index, phase in enumerate(phases):
            phase_activities = self.project_phases[phase]
            for activity_index, activity in enumerate(phase_activities):
                day_offset = (phase_index * days_per_phase) + int((days_per_phase / len(phase_activities)) * (activity_index + 1))
                due_date = start_date + timedelta(days=day_offset)
                
                tasks.append({
                    'id': str(uuid.uuid4()),
                    'title': activity,
                    'description': f'Complete {activity} for {form_data["subject"]} project',
                    'due_date': due_date.strftime('%Y-%m-%d'),
                    'estimated_hours': max(2, int(form_data['daily_hours'] * 1.5)),
                    'completed_hours': 0,
                    'priority': 'high' if phase_index == len(phases) - 1 else 'medium',
                    'status': 'pending',
                    'category': phase.capitalize()
                })
        
        return tasks
    
    def _generate_subject_tasks(self, form_data: Dict[str, Any], total_days: int, start_date: datetime) -> List[Dict[str, Any]]:
        tasks = []
        subject_topics = self._get_subject_topics(form_data['subject'])
        weekly_topics = max(1, len(subject_topics) // max(1, total_days // 7))
        
        for i, topic in enumerate(subject_topics):
            week_number = i // weekly_topics
            due_date = start_date + timedelta(days=(week_number + 1) * 7)
            
            # Study task
            tasks.append({
                'id': str(uuid.uuid4()),
                'title': f'Study {topic}',
                'description': f'Learn and understand {topic} concepts',
                'due_date': due_date.strftime('%Y-%m-%d'),
                'estimated_hours': form_data['daily_hours'] * 3,
                'completed_hours': 0,
                'priority': 'high' if topic in form_data['weaknesses'] else 'medium',
                'status': 'pending',
                'category': 'Learning'
            })
            
            # Practice task
            practice_date = due_date + timedelta(days=3)
            tasks.append({
                'id': str(uuid.uuid4()),
                'title': f'Practice {topic}',
                'description': f'Apply {topic} knowledge through exercises',
                'due_date': practice_date.strftime('%Y-%m-%d'),
                'estimated_hours': form_data['daily_hours'] * 2,
                'completed_hours': 0,
                'priority': 'high' if topic in form_data['weaknesses'] else 'medium',
                'status': 'pending',
                'category': 'Practice'
            })
        
        return tasks
    
    def _get_subject_topics(self, subject: str) -> List[str]:
        subject_lower = subject.lower()
        if 'math' in subject_lower:
            return self.exam_topics['math']
        elif any(word in subject_lower for word in ['science', 'physics', 'chemistry', 'biology']):
            return self.exam_topics['science']
        elif any(word in subject_lower for word in ['language', 'english', 'literature']):
            return self.exam_topics['language']
        elif 'history' in subject_lower:
            return self.exam_topics['history']
        elif any(word in subject_lower for word in ['business', 'management']):
            return self.exam_topics['business']
        else:
            return ['Introduction', 'Core Concepts', 'Advanced Topics', 'Applications', 'Review']

def render_header():
    st.markdown('<h1 class="header-title">🧠 Studbud</h1>', unsafe_allow_html=True)
    st.markdown('<p class="header-subtitle">AI-Powered Study Planner for Academic Excellence</p>', unsafe_allow_html=True)

def render_sidebar():
    with st.sidebar:
        st.markdown("### 📚 Navigation")
        
        if st.button("🏠 Dashboard", use_container_width=True):
            st.session_state.current_view = 'dashboard'
            st.session_state.selected_plan = None
            st.rerun()
        
        if st.button("📋 Study Plans", use_container_width=True):
            st.session_state.current_view = 'plans'
            st.session_state.selected_plan = None
            st.rerun()
        
        if st.button("➕ Create Plan", use_container_width=True):
            st.session_state.current_view = 'create'
            st.session_state.selected_plan = None
            st.rerun()
        
        st.markdown("---")
        st.markdown("### 📊 Quick Stats")
        
        active_plans = len([p for p in st.session_state.study_plans if p['status'] == 'active'])
        completed_plans = len([p for p in st.session_state.study_plans if p['status'] == 'completed'])
        total_hours = sum(p['completed_hours'] for p in st.session_state.study_plans)
        
        st.metric("Active Plans", active_plans)
        st.metric("Completed Plans", completed_plans)
        st.metric("Study Hours", f"{total_hours:.1f}")

def render_dashboard():
    st.markdown("## 🏠 Dashboard")
    
    if not st.session_state.study_plans:
        st.markdown("""
        <div class="study-card">
            <h3 style="color: white; text-align: center;">Welcome to Studbud! 🎓</h3>
            <p style="color: rgba(255,255,255,0.8); text-align: center;">
                Create your first AI-powered study plan to get started on your academic journey.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("🚀 Create Your First Study Plan", use_container_width=True):
            st.session_state.current_view = 'create'
            st.rerun()
        return
    
    # Stats cards
    col1, col2, col3, col4 = st.columns(4)
    
    active_plans = [p for p in st.session_state.study_plans if p['status'] == 'active']
    completed_plans = [p for p in st.session_state.study_plans if p['status'] == 'completed']
    total_hours = sum(p['completed_hours'] for p in st.session_state.study_plans)
    
    # Get upcoming tasks
    upcoming_tasks = []
    for plan in active_plans:
        for task in plan['tasks']:
            if task['status'] == 'pending':
                upcoming_tasks.append(task)
    upcoming_tasks.sort(key=lambda x: x['due_date'])
    upcoming_tasks = upcoming_tasks[:5]
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <h2 style="color: #4CAF50; margin: 0;">{len(active_plans)}</h2>
            <p style="color: white; margin: 0;">Active Plans</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <h2 style="color: #2196F3; margin: 0;">{len(completed_plans)}</h2>
            <p style="color: white; margin: 0;">Completed Plans</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <h2 style="color: #9C27B0; margin: 0;">{total_hours:.1f}</h2>
            <p style="color: white; margin: 0;">Study Hours</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <h2 style="color: #FF9800; margin: 0;">{len(upcoming_tasks)}</h2>
            <p style="color: white; margin: 0;">Upcoming Tasks</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Active Plans
    if active_plans:
        st.markdown("### 📈 Active Study Plans")
        
        for plan in active_plans:
            progress = (plan['completed_hours'] / plan['total_hours'] * 100) if plan['total_hours'] > 0 else 0
            completed_tasks = len([t for t in plan['tasks'] if t['status'] == 'completed'])
            total_tasks = len(plan['tasks'])
            
            with st.container():
                st.markdown(f"""
                <div class="study-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h3 style="color: white; margin: 0;">{plan['title']}</h3>
                            <p style="color: rgba(255,255,255,0.7); margin: 0;">{plan['subject']}</p>
                        </div>
                        <span style="background: rgba(76, 175, 80, 0.2); color: #4CAF50; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem;">
                            {plan['type'].upper()}
                        </span>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: rgba(255,255,255,0.8);">Progress</span>
                            <span style="color: white;">{progress:.1f}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {progress}%;"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                        <span>Tasks: {completed_tasks}/{total_tasks}</span>
                        <span>Due: {plan['end_date']}</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                if st.button(f"View Details - {plan['title']}", key=f"view_{plan['id']}"):
                    st.session_state.selected_plan = plan
                    st.session_state.current_view = 'plan_detail'
                    st.rerun()
    
    # Upcoming Tasks
    if upcoming_tasks:
        st.markdown("### 📅 Upcoming Tasks")
        
        for task in upcoming_tasks:
            due_date = datetime.strptime(task['due_date'], '%Y-%m-%d')
            days_until_due = (due_date - datetime.now()).days
            
            urgency_color = "#f44336" if days_until_due <= 2 else "#ff9800" if days_until_due <= 7 else "#4caf50"
            urgency_text = "Due Today" if days_until_due == 0 else f"Due in {days_until_due} days" if days_until_due > 0 else f"{abs(days_until_due)} days overdue"
            
            st.markdown(f"""
            <div class="task-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: white; margin: 0;">{task['title']}</h4>
                        <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 0.9rem;">{task['category']}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="background: rgba(255,255,255,0.1); color: {urgency_color}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                            {urgency_text}
                        </span>
                        <p style="color: rgba(255,255,255,0.6); margin: 0.3rem 0 0 0; font-size: 0.8rem;">{task['estimated_hours']}h</p>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

def render_create_plan():
    st.markdown("## ➕ Create AI-Powered Study Plan")
    
    generator = StudyPlanGenerator()
    
    with st.form("create_plan_form"):
        st.markdown("### 📋 Basic Information")
        
        col1, col2 = st.columns(2)
        with col1:
            title = st.text_input("Plan Title *", placeholder="e.g., Final Exam Preparation")
            subject = st.text_input("Subject *", placeholder="e.g., Mathematics, Computer Science")
            start_date = st.date_input("Start Date *", value=datetime.now().date())
        
        with col2:
            plan_type = st.selectbox("Plan Type *", ["exam", "project", "subject"], 
                                   format_func=lambda x: {"exam": "🎯 Exam Preparation", 
                                                         "project": "💼 Project Completion", 
                                                         "subject": "📚 Subject Mastery"}[x])
            end_date = st.date_input("End Date *", value=datetime.now().date() + timedelta(days=30))
            daily_hours = st.slider("Daily Study Hours", 1, 12, 3)
        
        st.markdown("### 🎯 Areas of Improvement")
        weaknesses_input = st.text_area("Enter topics you need to focus on (one per line)", 
                                       placeholder="Calculus\nData Structures\nEssay Writing")
        weaknesses = [w.strip() for w in weaknesses_input.split('\n') if w.strip()] if weaknesses_input else []
        
        st.markdown("### 🧠 Learning Preferences")
        learning_methods = st.multiselect(
            "Select your preferred learning methods",
            ["Visual Learning", "Reading & Writing", "Auditory Learning", "Kinesthetic Learning",
             "Practice Problems", "Group Study", "Flashcards", "Mind Mapping",
             "Video Tutorials", "Online Courses", "Laboratory Work", "Discussion Forums"]
        )
        
        st.markdown("### 🎯 Study Goals")
        goals = st.text_area("Describe your specific goals", 
                           placeholder="I want to achieve an A grade in my final exam by mastering calculus and improving my problem-solving speed...")
        
        submitted = st.form_submit_button("🚀 Generate AI Study Plan", use_container_width=True)
        
        if submitted:
            if not title or not subject or not start_date or not end_date:
                st.error("Please fill in all required fields marked with *")
                return
            
            if end_date <= start_date:
                st.error("End date must be after start date")
                return
            
            with st.spinner("🤖 AI is analyzing your requirements and generating your personalized study plan..."):
                import time
                time.sleep(2)  # Simulate AI processing
                
                form_data = {
                    'title': title,
                    'type': plan_type,
                    'subject': subject,
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d'),
                    'daily_hours': daily_hours,
                    'weaknesses': weaknesses,
                    'learning_methods': learning_methods,
                    'goals': goals
                }
                
                new_plan = generator.generate_study_plan(form_data)
                st.session_state.study_plans.append(new_plan)
                
                st.success("🎉 Your AI-powered study plan has been created successfully!")
                st.balloons()
                
                if st.button("View Your New Study Plan"):
                    st.session_state.selected_plan = new_plan
                    st.session_state.current_view = 'plan_detail'
                    st.rerun()

def render_study_plans():
    st.markdown("## 📋 Study Plans")
    
    if not st.session_state.study_plans:
        st.markdown("""
        <div class="study-card">
            <h3 style="color: white; text-align: center;">No Study Plans Yet 📚</h3>
            <p style="color: rgba(255,255,255,0.8); text-align: center;">
                Create your first AI-powered study plan to get started!
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("➕ Create Your First Plan", use_container_width=True):
            st.session_state.current_view = 'create'
            st.rerun()
        return
    
    # Filter options
    col1, col2 = st.columns([3, 1])
    with col1:
        st.markdown("### Your Study Plans")
    with col2:
        filter_status = st.selectbox("Filter by Status", ["all", "active", "completed", "paused"])
    
    # Filter plans
    filtered_plans = st.session_state.study_plans
    if filter_status != "all":
        filtered_plans = [p for p in st.session_state.study_plans if p['status'] == filter_status]
    
    # Display plans
    for plan in filtered_plans:
        progress = (plan['completed_hours'] / plan['total_hours'] * 100) if plan['total_hours'] > 0 else 0
        completed_tasks = len([t for t in plan['tasks'] if t['status'] == 'completed'])
        total_tasks = len(plan['tasks'])
        
        days_left = (datetime.strptime(plan['end_date'], '%Y-%m-%d') - datetime.now()).days
        
        status_colors = {
            'active': '#4CAF50',
            'completed': '#2196F3',
            'paused': '#FF9800'
        }
        
        type_colors = {
            'exam': '#f44336',
            'project': '#2196F3',
            'subject': '#4CAF50'
        }
        
        st.markdown(f"""
        <div class="study-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                    <h3 style="color: white; margin: 0;">{plan['title']}</h3>
                    <p style="color: rgba(255,255,255,0.7); margin: 0;">{plan['subject']}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <span style="background: rgba(255,255,255,0.1); color: {type_colors[plan['type']]}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                        {plan['type'].upper()}
                    </span>
                    <span style="background: rgba(255,255,255,0.1); color: {status_colors[plan['status']]}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                        {plan['status'].upper()}
                    </span>
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: rgba(255,255,255,0.8);">Progress</span>
                    <span style="color: white;">{progress:.1f}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {progress}%;"></div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                    <div style="color: white; font-size: 1.5rem; font-weight: bold;">{completed_tasks}/{total_tasks}</div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Tasks</div>
                </div>
                <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                    <div style="color: {'#f44336' if days_left < 0 else '#ff9800' if days_left <= 7 else 'white'}; font-size: 1.5rem; font-weight: bold;">
                        {'Overdue' if days_left < 0 else f'{days_left}d'}
                    </div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                        {'Days' if days_left < 0 else 'Days Left'}
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7); font-size: 0.9rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <span>{plan['completed_hours']:.1f}/{plan['total_hours']:.1f}h</span>
                <span>{plan['end_date']}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns([1, 1, 1])
        with col1:
            if st.button(f"📖 View Details", key=f"view_{plan['id']}"):
                st.session_state.selected_plan = plan
                st.session_state.current_view = 'plan_detail'
                st.rerun()
        
        with col2:
            status_button_text = "⏸️ Pause" if plan['status'] == 'active' else "▶️ Resume"
            if st.button(status_button_text, key=f"toggle_{plan['id']}"):
                plan['status'] = 'paused' if plan['status'] == 'active' else 'active'
                st.rerun()
        
        with col3:
            if st.button("🗑️ Delete", key=f"delete_{plan['id']}"):
                st.session_state.study_plans.remove(plan)
                st.rerun()

def render_plan_detail():
    if not st.session_state.selected_plan:
        st.session_state.current_view = 'plans'
        st.rerun()
        return
    
    plan = st.session_state.selected_plan
    
    # Header with back button
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("← Back to Plans"):
            st.session_state.selected_plan = None
            st.session_state.current_view = 'plans'
            st.rerun()
    
    with col2:
        st.markdown(f"## 📖 {plan['title']}")
    
    # Plan overview
    progress = (plan['completed_hours'] / plan['total_hours'] * 100) if plan['total_hours'] > 0 else 0
    completed_tasks = len([t for t in plan['tasks'] if t['status'] == 'completed'])
    total_tasks = len(plan['tasks'])
    
    st.markdown(f"""
    <div class="study-card">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <div>
                <h3 style="color: white; margin-bottom: 0.5rem;">{plan['title']}</h3>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 1rem;">{plan['subject']}</p>
                
                <div style="display: flex; gap: 2rem; margin-bottom: 1rem; color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                    <span>📅 {plan['start_date']} - {plan['end_date']}</span>
                    <span>⏰ {plan['completed_hours']:.1f}/{plan['total_hours']:.1f} hours</span>
                    <span>🎯 {completed_tasks}/{total_tasks} tasks</span>
                </div>
            </div>
            
            <div>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: rgba(255,255,255,0.8);">Overall Progress</span>
                        <span style="color: white; font-weight: bold;">{progress:.1f}%</span>
                    </div>
                    <div class="progress-bar" style="height: 15px;">
                        <div class="progress-fill" style="width: {progress}%;"></div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                        <div style="color: #4CAF50; font-size: 1.5rem; font-weight: bold;">{completed_tasks}</div>
                        <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">Completed</div>
                    </div>
                    <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px;">
                        <div style="color: #FF9800; font-size: 1.5rem; font-weight: bold;">{total_tasks - completed_tasks}</div>
                        <div style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">Remaining</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Focus Areas
    if plan['weaknesses']:
        st.markdown("### 🎯 Focus Areas")
        weakness_tags = " ".join([f'<span style="background: rgba(244, 67, 54, 0.2); color: #f44336; padding: 0.3rem 0.8rem; border-radius: 15px; margin: 0.2rem; display: inline-block; font-size: 0.9rem;">{w}</span>' for w in plan['weaknesses']])
        st.markdown(f'<div style="margin-bottom: 2rem;">{weakness_tags}</div>', unsafe_allow_html=True)
    
    # Tasks by Category
    st.markdown("### 📋 Tasks by Category")
    
    # Group tasks by category
    tasks_by_category = {}
    for task in plan['tasks']:
        category = task['category']
        if category not in tasks_by_category:
            tasks_by_category[category] = []
        tasks_by_category[category].append(task)
    
    for category, tasks in tasks_by_category.items():
        category_completed = len([t for t in tasks if t['status'] == 'completed'])
        category_progress = (category_completed / len(tasks)) * 100
        
        st.markdown(f"""
        <div class="study-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: white; margin: 0;">{category}</h4>
                <span style="color: rgba(255,255,255,0.7);">{category_completed}/{len(tasks)} completed</span>
            </div>
            
            <div class="progress-bar" style="margin-bottom: 1.5rem;">
                <div class="progress-fill" style="width: {category_progress}%;"></div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        for task in tasks:
            due_date = datetime.strptime(task['due_date'], '%Y-%m-%d')
            days_until_due = (due_date - datetime.now()).days
            is_overdue = days_until_due < 0
            is_urgent = 0 <= days_until_due <= 2
            
            priority_colors = {
                'high': '#f44336',
                'medium': '#ff9800',
                'low': '#4caf50'
            }
            
            task_class = "completed-task" if task['status'] == 'completed' else f"{task['priority']}-priority"
            
            urgency_text = "Due Today" if days_until_due == 0 else f"Due in {days_until_due} days" if days_until_due > 0 else f"{abs(days_until_due)} days overdue"
            urgency_color = "#f44336" if is_overdue else "#ff9800" if is_urgent else "rgba(255,255,255,0.7)"
            
            st.markdown(f"""
            <div class="task-card {task_class}" style="margin-bottom: 1rem;">
                <div style="display: flex; align-items: flex-start; gap: 1rem;">
                    <div style="flex: 1;">
                        <h5 style="color: {'rgba(255,255,255,0.7)' if task['status'] == 'completed' else 'white'}; margin: 0; {'text-decoration: line-through;' if task['status'] == 'completed' else ''}">{task['title']}</h5>
                        <p style="color: rgba(255,255,255,0.6); margin: 0.5rem 0; font-size: 0.9rem;">{task['description']}</p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <span style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">⏰ {task['estimated_hours']}h</span>
                                <span style="background: rgba(255,255,255,0.1); color: {priority_colors[task['priority']]}; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.7rem;">
                                    {task['priority'].upper()}
                                </span>
                            </div>
                            <span style="color: {urgency_color}; font-size: 0.8rem; font-weight: bold;">
                                {urgency_text}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                        {'✅' if task['status'] == 'completed' else '⭕'}
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # Toggle task completion
            if st.button(f"{'Mark as Pending' if task['status'] == 'completed' else 'Mark as Completed'}", 
                        key=f"toggle_task_{task['id']}"):
                task['status'] = 'pending' if task['status'] == 'completed' else 'completed'
                task['completed_hours'] = task['estimated_hours'] if task['status'] == 'completed' else 0
                
                # Update plan completed hours
                plan['completed_hours'] = sum(t['completed_hours'] for t in plan['tasks'])
                
                # Update the plan in session state
                for i, p in enumerate(st.session_state.study_plans):
                    if p['id'] == plan['id']:
                        st.session_state.study_plans[i] = plan
                        break
                
                st.session_state.selected_plan = plan
                st.rerun()

def main():
    render_header()
    render_sidebar()
    
    # Main content area
    if st.session_state.current_view == 'dashboard':
        render_dashboard()
    elif st.session_state.current_view == 'create':
        render_create_plan()
    elif st.session_state.current_view == 'plans':
        render_study_plans()
    elif st.session_state.current_view == 'plan_detail':
        render_plan_detail()

if __name__ == "__main__":
    main()