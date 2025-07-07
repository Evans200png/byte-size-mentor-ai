
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MessageSquare, ThumbsUp, Pin } from 'lucide-react';
import { useForums } from '@/hooks/useForums';
import CreatePostModal from './CreatePostModal';
import PostDetailModal from './PostDetailModal';

interface ForumPostListProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  onBack: () => void;
  onCreatePost: () => void;
}

const ForumPostList: React.FC<ForumPostListProps> = ({ category, onBack }) => {
  const { posts, loading, fetchPosts } = useForums();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(category.id);
  }, [category.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forums
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
          <Button onClick={() => setShowCreatePost(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPost(post.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-green-600" />
                        )}
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        {post.is_locked && (
                          <Badge variant="secondary">Locked</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {post.profiles?.name || 'Anonymous'}</span>
                        <span>{formatDate(post.created_at)}</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.replies_count || 0} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.votes_count || 0} votes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {posts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to start a discussion in this category!</p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {showCreatePost && (
          <CreatePostModal
            categories={[category]}
            defaultCategoryId={category.id}
            onClose={() => setShowCreatePost(false)}
            onPostCreated={() => {
              setShowCreatePost(false);
              fetchPosts(category.id);
            }}
          />
        )}

        {selectedPost && (
          <PostDetailModal
            postId={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ForumPostList;
