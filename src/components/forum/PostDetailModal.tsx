
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useForums } from '@/hooks/useForums';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostDetailModalProps {
  postId: string;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ postId, onClose }) => {
  const { replies, fetchReplies, createReply, voteOnPost, voteOnReply } = useForums();
  const { toast } = useToast();
  const [post, setPost] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPostDetails();
    fetchReplies(postId);
  }, [postId]);

  const fetchPostDetails = async () => {
    const { data } = await supabase
      .from('forum_posts')
      .select(`
        *,
        profiles:user_id (name)
      `)
      .eq('id', postId)
      .single();

    if (data) setPost(data);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    const { error } = await createReply(postId, replyContent.trim());
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    } else {
      setReplyContent('');
      toast({
        title: "Success",
        description: "Your reply has been posted!"
      });
    }
    setLoading(false);
  };

  const handleVote = async (type: 'upvote' | 'downvote', isReply: boolean, id: string) => {
    const { error } = isReply ? await voteOnReply(id, type) : await voteOnPost(id, type);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!post) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Original Post */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-medium">{post.profiles?.name || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote('upvote', false, post.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote('downvote', false, post.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Replies */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Replies ({replies.length})
            </h3>
            
            <div className="space-y-4 mb-6">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{reply.profiles?.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">{formatDate(reply.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('upvote', true, reply.id)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('downvote', true, reply.id)}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReply} className="space-y-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
              />
              <Button type="submit" disabled={loading || !replyContent.trim()}>
                {loading ? 'Posting...' : 'Post Reply'}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailModal;
