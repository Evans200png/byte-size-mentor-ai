
import React from 'react';
import { BookOpen, Star, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Testimonials from '@/components/Testimonials';
import TopicsSection from '@/components/TopicsSection';

const AuthLogin: React.FC = () => {
  const { toast } = useToast();

  const handleTopicClick = (topicId: string) => {
    toast({
      title: "Login Required",
      description: "Please sign in or create an account to start learning!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center space-y-8 py-16">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master Technology 
                <span className="text-blue-600"> One Bite</span> at a Time
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Interactive microlearning powered by AI. Learn web development, AI/ML, 
                cloud computing, and more through personalized bite-sized lessons.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
                <BookOpen className="h-12 w-12 text-blue-600" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Lessons</h3>
                  <p className="text-gray-600">Bite-sized content with engaging quizzes and hands-on practice</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
                <Star className="h-12 w-12 text-yellow-600" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Learning</h3>
                  <p className="text-gray-600">Adaptive learning paths that adjust to your pace and style</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
                <Trophy className="h-12 w-12 text-green-600" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-gray-600">Gamified experience with points, badges, and achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <TopicsSection onTopicClick={handleTopicClick} />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default AuthLogin;
