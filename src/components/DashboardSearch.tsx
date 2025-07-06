
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Code, Brain, Cloud, Shield, Database, Smartphone } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  completedLessons: number;
}

interface DashboardSearchProps {
  onSelectTopic: (topic: Topic) => void;
}

const DashboardSearch: React.FC<DashboardSearchProps> = ({ onSelectTopic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Topic[]>([]);
  const [showResults, setShowResults] = useState(false);

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
    }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filteredTopics = topics.filter(topic =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredTopics);
    setShowResults(true);
  }, [searchQuery]);

  const handleSelectTopic = (topic: Topic) => {
    setSearchQuery('');
    setShowResults(false);
    onSelectTopic(topic);
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-2">
            {searchResults.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{topic.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{topic.description}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {topic.difficulty}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {showResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500">
            No topics found matching "{searchQuery}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardSearch;
