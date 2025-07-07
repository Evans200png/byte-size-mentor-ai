
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { useCertificates } from '@/hooks/useCertificates';
import AuthLogin from '@/components/AuthLogin';
import Dashboard from '@/components/Dashboard';
import TopicSelector from '@/components/TopicSelector';
import ChatInterface from '@/components/ChatInterface';
import ForumPage from '@/components/forum/ForumPage';
import CertificatesPage from '@/components/certificates/CertificatesPage';
import AIChatbot from '@/components/chatbot/AIChatbot';
import FeedbackModal from '@/components/feedback/FeedbackModal';

type AppState = 'dashboard' | 'topics' | 'chat' | 'forums' | 'certificates';

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
  const { checkEligibilityAndCreateCertificate } = useCertificates();
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    topicId: string;
    lessonId?: number;
    quizId?: number;
    type: 'lesson' | 'quiz';
    title: string;
  }>({
    isOpen: false,
    topicId: '',
    type: 'lesson',
    title: ''
  });

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
    // Add color property if it doesn't exist
    const topicWithColor = {
      ...topic,
      color: topic.color || getTopicColor(topic.id)
    };
    
    setSelectedTopic(topicWithColor);
    setAppState('chat');
  };

  const getTopicColor = (topicId: string) => {
    const colorMap: { [key: string]: string } = {
      'web-dev': 'bg-blue-500',
      'ai-ml': 'bg-purple-500',
      'cloud': 'bg-green-500',
      'cybersecurity': 'bg-red-500',
      'data-science': 'bg-orange-500',
      'mobile-dev': 'bg-teal-500'
    };
    return colorMap[topicId] || 'bg-blue-500';
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    setSelectedTopic(null);
  };

  const handleOpenForums = () => {
    setAppState('forums');
  };

  const handleOpenCertificates = () => {
    setAppState('certificates');
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

  const handleLessonComplete = async (score: number, lessonType: 'lesson' | 'quiz') => {
    if (!selectedTopic) return;

    // Show feedback modal
    setFeedbackModal({
      isOpen: true,
      topicId: selectedTopic.id,
      lessonId: lessonType === 'lesson' ? 1 : undefined,
      quizId: lessonType === 'quiz' ? 1 : undefined,
      type: lessonType,
      title: selectedTopic.title
    });

    // Update user stats
    const pointsEarned = score >= 80 ? 100 : 50;
    const newCompletedLessons = (selectedTopic.completedLessons || 0) + 1;
    
    updateUserStats({
      points: pointsEarned,
      completedLessons: 1 // This will be added to current count
    });

    // Check for certificate eligibility
    if (newCompletedLessons === selectedTopic.lessons && score >= 70) {
      await checkEligibilityAndCreateCertificate(
        selectedTopic.id,
        selectedTopic.title,
        score,
        newCompletedLessons,
        selectedTopic.lessons
      );
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
    case 'dashboard':
      return (
        <>
          <Dashboard 
            onStartLearning={handleStartLearning}
            onResumeLesson={handleResumeLesson}
            onSelectTopic={handleSelectTopic}
            onOpenForums={handleOpenForums}
            onOpenCertificates={handleOpenCertificates}
          />
          <AIChatbot />
          <FeedbackModal
            isOpen={feedbackModal.isOpen}
            onClose={() => setFeedbackModal({ ...feedbackModal, isOpen: false })}
            topicId={feedbackModal.topicId}
            lessonId={feedbackModal.lessonId}
            quizId={feedbackModal.quizId}
            type={feedbackModal.type}
            title={feedbackModal.title}
          />
        </>
      );
      
    case 'topics':
      return (
        <>
          <TopicSelector 
            onSelectTopic={handleSelectTopic}
            onBackToDashboard={handleBackToDashboard}
          />
          <AIChatbot />
        </>
      );
      
    case 'chat':
      const currentLesson = getCurrentLesson();
      return currentLesson ? (
        <>
          <ChatInterface 
            currentLesson={currentLesson}
            onBackToDashboard={handleBackToDashboard}
            onLessonComplete={(score) => handleLessonComplete(score, 'quiz')}
          />
          <AIChatbot />
        </>
      ) : null;

    case 'forums':
      return (
        <>
          <ForumPage onBack={handleBackToDashboard} />
          <AIChatbot />
        </>
      );

    case 'certificates':
      return (
        <>
          <CertificatesPage onBack={handleBackToDashboard} />
          <AIChatbot />
        </>
      );
      
    default:
      return (
        <>
          <Dashboard 
            onStartLearning={handleStartLearning}
            onResumeLesson={handleResumeLesson}
            onSelectTopic={handleSelectTopic}
            onOpenForums={handleOpenForums}
            onOpenCertificates={handleOpenCertificates}
          />
          <AIChatbot />
        </>
      );
  }
};

export default Index;
