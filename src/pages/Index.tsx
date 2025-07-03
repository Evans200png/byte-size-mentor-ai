
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import AuthLogin from '@/components/AuthLogin';
import Dashboard from '@/components/Dashboard';
import TopicSelector from '@/components/TopicSelector';
import ChatInterface from '@/components/ChatInterface';

type AppState = 'dashboard' | 'topics' | 'chat';

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
  const { user, loading: authLoading } = useAuth();
  const { updateUserStats } = useUserData();
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!user) {
    return <AuthLogin />;
  }

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
    // Update user stats
    updateUserStats({
      points: (score >= 80 ? 100 : 50),
      completedLessons: 1 // This will be added to current count
    });
    
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
    case 'dashboard':
      return (
        <Dashboard 
          onStartLearning={handleStartLearning}
          onResumeLesson={handleResumeLesson}
        />
      );
      
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
      return (
        <Dashboard 
          onStartLearning={handleStartLearning}
          onResumeLesson={handleResumeLesson}
        />
      );
  }
};

export default Index;
