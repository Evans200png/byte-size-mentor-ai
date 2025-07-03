
import React, { useState, useEffect } from 'react';
import AuthLogin from '@/components/AuthLogin';
import Dashboard from '@/components/Dashboard';
import TopicSelector from '@/components/TopicSelector';
import ChatInterface from '@/components/ChatInterface';

type AppState = 'auth' | 'dashboard' | 'topics' | 'chat';

interface User {
  name: string;
  email: string;
  level: number;
  points: number;
  streak: number;
  completedLessons: number;
  totalLessons: number;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  completedLessons: number;
  color: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('microlearning_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAppState('dashboard');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('microlearning_user');
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAppState('dashboard');
  };

  const handleStartLearning = () => {
    setAppState('topics');
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setAppState('chat');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    setSelectedTopic(null);
  };

  const handleResumeLesson = () => {
    // For demo purposes, select the first topic with progress
    const webDevTopic = {
      id: 'web-dev',
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, JavaScript, and modern frameworks like React',
      icon: () => null,
      difficulty: 'Beginner' as const,
      duration: '45 min',
      lessons: 12,
      completedLessons: 3,
      color: 'bg-blue-500'
    };
    
    setSelectedTopic(webDevTopic);
    setAppState('chat');
  };

  const handleLessonComplete = (score: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        points: user.points + (score >= 80 ? 100 : 50),
        completedLessons: user.completedLessons + 1,
        level: Math.floor((user.completedLessons + 1) / 5) + 1
      };
      
      setUser(updatedUser);
      localStorage.setItem('microlearning_user', JSON.stringify(updatedUser));
    }
    
    setTimeout(() => {
      setAppState('dashboard');
      setSelectedTopic(null);
    }, 1000);
  };

  const getCurrentLesson = () => {
    if (!selectedTopic) return null;
    
    return {
      id: 1,
      title: selectedTopic.title,
      topic: selectedTopic.title.split(' ')[0],
      progress: selectedTopic.completedLessons + 1,
      totalSteps: selectedTopic.lessons
    };
  };

  // Render based on current app state
  switch (appState) {
    case 'auth':
      return <AuthLogin onLogin={handleLogin} />;
      
    case 'dashboard':
      return user ? (
        <Dashboard 
          user={user}
          onStartLearning={handleStartLearning}
          onResumeLesson={handleResumeLesson}
        />
      ) : null;
      
    case 'topics':
      return (
        <TopicSelector 
          onSelectTopic={handleSelectTopic}
          onBackToDashboard={handleBackToDashboard}
        />
      );
      
    case 'chat':
      const currentLesson = getCurrentLesson();
      return currentLesson ? (
        <ChatInterface 
          currentLesson={currentLesson}
          onBackToDashboard={handleBackToDashboard}
          onLessonComplete={handleLessonComplete}
        />
      ) : null;
      
    default:
      return <AuthLogin onLogin={handleLogin} />;
  }
};

export default Index;
