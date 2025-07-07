
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topic_id: string;
  created_at: string;
}

interface ForumPost {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  profiles?: {
    name: string;
  } | null;
  replies_count?: number;
  votes_count?: number;
}

interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_reply_id: string | null;
  created_at: string;
  profiles?: {
    name: string;
  } | null;
  votes_count?: number;
}

export const useForums = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
  };

  const fetchPosts = async (categoryId?: string) => {
    setLoading(true);
    let query = supabase
      .from('forum_posts')
      .select(`
        *,
        profiles (name)
      `)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data } = await query;
    if (data) {
      // Handle the data safely with proper type assertion
      const postsWithProfiles = data.map(post => ({
        ...post,
        profiles: post.profiles && typeof post.profiles === 'object' && 'name' in post.profiles 
          ? post.profiles as { name: string }
          : null
      }));
      setPosts(postsWithProfiles);
    }
    setLoading(false);
  };

  const fetchReplies = async (postId: string) => {
    const { data } = await supabase
      .from('forum_replies')
      .select(`
        *,
        profiles (name)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) {
      // Handle the data safely with proper type assertion
      const repliesWithProfiles = data.map(reply => ({
        ...reply,
        profiles: reply.profiles && typeof reply.profiles === 'object' && 'name' in reply.profiles 
          ? reply.profiles as { name: string }
          : null
      }));
      setReplies(repliesWithProfiles);
    }
  };

  const createPost = async (categoryId: string, title: string, content: string) => {
    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase
      .from('forum_posts')
      .insert({
        category_id: categoryId,
        user_id: user.id,
        title,
        content
      });

    if (!error) {
      fetchPosts(categoryId);
    }
    return { error };
  };

  const createReply = async (postId: string, content: string, parentReplyId?: string) => {
    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
        parent_reply_id: parentReplyId || null
      });

    if (!error) {
      fetchReplies(postId);
    }
    return { error };
  };

  const voteOnPost = async (postId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase
      .from('forum_votes')
      .upsert({
        user_id: user.id,
        post_id: postId,
        vote_type: voteType
      });

    return { error };
  };

  const voteOnReply = async (replyId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return { error: 'User not authenticated' };

    const { error } = await supabase
      .from('forum_votes')
      .upsert({
        user_id: user.id,
        reply_id: replyId,
        vote_type: voteType
      });

    return { error };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    posts,
    replies,
    loading,
    fetchPosts,
    fetchReplies,
    createPost,
    createReply,
    voteOnPost,
    voteOnReply
  };
};
