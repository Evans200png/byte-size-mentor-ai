
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  Brain, 
  Cloud, 
  Shield, 
  Database, 
  Smartphone,
  ArrowLeft,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

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

interface TopicSelectorProps {
  onSelectTopic: (topic: Topic) => void;
  onBackToDashboard: () => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic, onBackToDashboard }) => {
  const topics: Topic[] = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Learn HTML, CSS, JavaScript, and modern frameworks like React',
      icon: Code,
      difficulty: 'Beginner',
      duration: '45 min',
      lessons: 12,
      completedLessons: 3,
      color: 'bg-blue-500'
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      description: 'Explore artificial intelligence, neural networks, and ML algorithms',
      icon: Brain,
      difficulty: 'Intermediate',
      duration: '60 min',
      lessons: 15,
      completedLessons: 0,
      color: 'bg-purple-500'
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      description: 'Master AWS, Azure, Docker, and cloud-native architectures',
      icon: Cloud,
      difficulty: 'Intermediate',
      duration: '50 min',
      lessons: 10,
      completedLessons: 1,
      color: 'bg-green-500'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Learn security fundamentals, ethical hacking, and threat prevention',
      icon: Shield,
      difficulty: 'Advanced',
      duration: '55 min',
      lessons: 14,
      completedLessons: 0,
      color: 'bg-red-500'
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Analyze data with Python, R, and visualization tools',
      icon: Database,
      difficulty: 'Intermediate',
      duration: '65 min',
      lessons: 16,
      completedLessons: 2,
      color: 'bg-orange-500'
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Development',
      description: 'Build iOS and Android apps with React Native and Flutter',
      icon: Smartphone,
      difficulty: 'Beginner',
      duration: '40 min',
      lessons: 11,
      completedLessons: 0,
      color: 'bg-teal-500'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Learning Path</h1>
            <p className="text-gray-600">Select a topic to start your microlearning journey</p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            const progressPercentage = (topic.completedLessons / topic.lessons) * 100;
            
            return (
              <Card key={topic.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${topic.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                      {topic.completedLessons > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {topic.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {topic.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {topic.lessons} lessons
                    </div>
                  </div>
                  
                  {/* Progress */}
                  {topic.completedLessons > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{topic.completedLessons}/{topic.lessons}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">
                      Ready to start your learning journey!
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Button 
                    onClick={() => onSelectTopic(topic)}
                    className="w-full"
                    variant={topic.completedLessons > 0 ? "default" : "outline"}
                  >
                    {topic.completedLessons > 0 ? "Continue Learning" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Learning Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Stay Consistent</h4>
                  <p className="text-gray-600">Learn for 15-20 minutes daily for best results</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Practice Actively</h4>
                  <p className="text-gray-600">Complete quizzes and engage with the content</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ask Questions</h4>
                  <p className="text-gray-600">Use the chat to clarify concepts and explore deeper</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopicSelector;
