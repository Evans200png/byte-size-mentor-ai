
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, BookOpen, Clock, Play, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';

interface DashboardProps {
  onStartLearning: () => void;
  onResumeLesson: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartLearning, onResumeLesson }) => {
  const { signOut } = useAuth();
  const { userStats, userProfile, loading } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const badges = [
    { name: 'First Steps', icon: Star, earned: (userStats?.completedLessons || 0) > 0, color: 'bg-yellow-500' },
    { name: 'Quick Learner', icon: Clock, earned: (userStats?.streak || 0) >= 3, color: 'bg-blue-500' },
    { name: 'Knowledge Seeker', icon: BookOpen, earned: (userStats?.completedLessons || 0) >= 10, color: 'bg-gray-300' },
    { name: 'Master', icon: Trophy, earned: (userStats?.level || 0) >= 5, color: 'bg-gray-300' }
  ];

  const progressPercentage = userStats 
    ? (userStats.completedLessons / userStats.totalLessons) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile?.name || 'Learner'}! 🎉
            </h1>
            <p className="text-lg text-gray-600">Ready to continue your learning journey?</p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="ml-4"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{userStats?.level || 1}</div>
              <div className="text-sm text-gray-600">Level</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{userStats?.points || 0}</div>
              <div className="text-sm text-gray-600">Points</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{userStats?.streak || 0}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {userStats?.completedLessons || 0}/{userStats?.totalLessons || 50}
              </div>
              <div className="text-sm text-gray-600">Lessons</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              
              <div className="flex gap-4">
                <Button onClick={onResumeLesson} className="flex-1" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Resume Learning
                </Button>
                <Button onClick={onStartLearning} variant="outline" className="flex-1" size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Topics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg border-2 transition-all ${
                    badge.earned
                      ? 'border-yellow-300 bg-yellow-50 hover:shadow-md'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-full ${badge.earned ? badge.color : 'bg-gray-300'} mb-2`}>
                    <badge.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                  {badge.earned && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Earned!
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
