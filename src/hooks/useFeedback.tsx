
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface FeedbackData {
  topicId: string;
  lessonId?: number;
  quizId?: number;
  rating: number;
  comment?: string;
  feedbackType: 'lesson' | 'quiz';
}

export const useFeedback = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (feedbackData: FeedbackData) => {
    if (!user) return { error: 'User not authenticated' };

    setLoading(true);
    const { error } = await supabase
      .from('lesson_feedback')
      .insert({
        user_id: user.id,
        topic_id: feedbackData.topicId,
        lesson_id: feedbackData.lessonId,
        quiz_id: feedbackData.quizId,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        feedback_type: feedbackData.feedbackType
      });

    setLoading(false);
    return { error };
  };

  const getFeedbackSummary = async () => {
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('lesson_feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error };
  };

  return {
    submitFeedback,
    getFeedbackSummary,
    loading
  };
};
