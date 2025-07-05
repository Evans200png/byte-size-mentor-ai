
import React from 'react';
import { Brain, Shield, Code, Cloud, Database, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Topic {
  id: string;
  title: string;
  buttonText: string;
  bgColor: string;
  hoverColor: string;
  icon: React.ComponentType<any>;
}

interface TopicsSectionProps {
  onTopicClick: (topicId: string) => void;
}

const TopicsSection: React.FC<TopicsSectionProps> = ({ onTopicClick }) => {
  const topics: Topic[] = [
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      buttonText: 'Learn AI/ML',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      icon: Brain
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      buttonText: 'Learn Cybersecurity',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      icon: Shield
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      buttonText: 'Learn Web Dev',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      icon: Code
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      buttonText: 'Learn Cloud',
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      icon: Cloud
    },
    {
      id: 'data-science',
      title: 'Data Science',
      buttonText: 'Learn Data Science',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      icon: Database
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Development',
      buttonText: 'Learn Mobile Dev',
      bgColor: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700',
      icon: Smartphone
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What You Can Learn on TechBites
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our interactive topics and start your microlearning journey.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const IconComponent = topic.icon;
            
            return (
              <Card
                key={topic.id}
                className={`${topic.bgColor} ${topic.hoverColor} text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in border-0`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onTopicClick(topic.id)}
              >
                <CardContent className="p-8 text-center">
                  {/* Topic Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-xl font-semibold mb-4">
                    {topic.title}
                  </h3>

                  {/* Learn Button */}
                  <Button
                    variant="secondary"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-2 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopicClick(topic.id);
                    }}
                  >
                    {topic.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            Ready to start your learning journey? Choose a topic above or explore all our courses!
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopicsSection;
