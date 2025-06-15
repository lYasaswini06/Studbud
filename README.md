# Studbud - AI Study Planner

A beautiful, production-ready study planner application built with Streamlit and Python. Studbud uses AI-powered algorithms to generate personalized study plans for exam preparation, project completion, and subject mastery.

## 🌟 Features

### 🎯 Three Study Plan Types
- **Exam Preparation**: Focus on weaknesses with structured phases (Foundation 40%, Practice 35%, Review 25%)
- **Project Completion**: Break down projects into manageable phases (Research, Planning, Development, Finalization)
- **Subject Mastery**: Create balanced schedules with various learning methods and regular practice

### 🤖 AI-Powered Planning
- Intelligent task generation based on subject and study type
- Weakness identification and targeted study recommendations
- Personalized scheduling based on available time and preferences
- Adaptive learning method suggestions

### 📊 Comprehensive Dashboard
- Real-time progress tracking with beautiful visualizations
- Active plans overview with completion percentages
- Upcoming task alerts with urgency indicators
- Study hours tracking and statistics

### 🎨 Beautiful Design
- Modern gradient backgrounds with glass-morphism effects
- Responsive design optimized for all screen sizes
- Smooth animations and micro-interactions
- Professional color scheme with proper contrast ratios

### 📋 Task Management
- Interactive task completion tracking
- Priority-based task organization
- Due date management with overdue alerts
- Category-based task grouping

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation

1. Clone or download the project files
2. Install required dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
streamlit run app.py
```

4. Open your browser and navigate to the provided local URL (typically `http://localhost:8501`)

## 📖 How to Use

### Creating Your First Study Plan

1. **Navigate to Create Plan**: Click the "➕ Create Plan" button in the sidebar
2. **Fill Basic Information**:
   - Enter a descriptive title for your study plan
   - Specify the subject you're studying
   - Choose your plan type (Exam, Project, or Subject)
   - Set start and end dates
   - Select daily study hours (1-12 hours)

3. **Identify Focus Areas**: List topics or areas where you need extra attention
4. **Select Learning Methods**: Choose your preferred learning styles from the available options
5. **Set Goals**: Describe your specific objectives and what you want to achieve

6. **Generate Plan**: Click "🚀 Generate AI Study Plan" and let the AI create your personalized schedule

### Managing Your Study Plans

- **Dashboard**: View all your active plans, progress statistics, and upcoming tasks
- **Study Plans**: Browse all your plans, filter by status, and manage individual plans
- **Task Management**: Mark tasks as completed, view due dates, and track progress
- **Plan Details**: Dive deep into individual plans to see all tasks organized by category

### Understanding the AI Algorithm

The AI study plan generator uses sophisticated algorithms to:

1. **Analyze Your Input**: Processes your subject, weaknesses, time constraints, and learning preferences
2. **Generate Structured Tasks**: Creates appropriate tasks based on your study plan type
3. **Optimize Scheduling**: Distributes tasks across your available time with proper pacing
4. **Prioritize Content**: Focuses more time on identified weaknesses and high-priority areas
5. **Adapt to Learning Style**: Suggests tasks and methods that match your preferred learning approaches

## 🎨 Design Philosophy

Studbud follows modern design principles:

- **Glass-morphism**: Semi-transparent elements with backdrop blur effects
- **Gradient Backgrounds**: Beautiful color transitions that are easy on the eyes
- **Micro-interactions**: Subtle animations that provide feedback and enhance user experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: High contrast ratios and readable typography

## 🔧 Technical Details

### Architecture
- **Frontend**: Streamlit with custom CSS for styling
- **Backend**: Python with object-oriented design
- **Data Storage**: Session state management (can be extended to databases)
- **Visualization**: Plotly for charts and progress tracking

### Key Components
- `StudyPlanGenerator`: Core AI algorithm for generating personalized study plans
- `Task Management System`: Handles task creation, completion tracking, and progress calculation
- `Dashboard Analytics`: Provides insights and statistics about study progress
- `Responsive UI Components`: Custom-styled Streamlit components for optimal user experience

## 🌐 Deployment

This application can be easily deployed to various platforms:

- **Streamlit Cloud**: Direct deployment from GitHub repository
- **Heroku**: Using the provided requirements.txt
- **Docker**: Containerized deployment for any cloud platform
- **Local Network**: Run locally and access from other devices on your network

## 📈 Future Enhancements

Potential features for future versions:
- Database integration for persistent data storage
- User authentication and multi-user support
- Advanced analytics and study pattern insights
- Integration with calendar applications
- Mobile app version
- Collaborative study plans
- AI-powered study recommendations based on performance

## 🤝 Contributing

This is a production-ready application that can be extended and customized. Feel free to:
- Add new study plan types
- Enhance the AI algorithms
- Improve the user interface
- Add new features and functionality

## 📄 License

This project is open source and available under the MIT License.

---

**Studbud** - Empowering students with AI-driven study planning for academic excellence! 🎓✨