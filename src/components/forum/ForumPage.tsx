
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Users, Plus } from 'lucide-react';
import { useForums } from '@/hooks/useForums';
import ForumPostList from './ForumPostList';
import CreatePostModal from './CreatePostModal';

interface ForumPageProps {
  onBack: () => void;
}

const ForumPage: React.FC<ForumPageProps> = ({ onBack }) => {
  const { categories, fetchPosts } = useForums();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchPosts(categoryId);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  if (selectedCategory) {
    return (
      <ForumPostList
        category={selectedCategoryData!}
        onBack={() => setSelectedCategory(null)}
        onCreatePost={() => setShowCreatePost(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
            <p className="text-gray-600">Connect with fellow learners and share knowledge</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Active Community</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showCreatePost && (
          <CreatePostModal
            categories={categories}
            onClose={() => setShowCreatePost(false)}
            onPostCreated={() => {
              setShowCreatePost(false);
              if (selectedCategory) fetchPosts(selectedCategory);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ForumPage;
