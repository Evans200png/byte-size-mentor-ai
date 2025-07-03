
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserStats {
  level: number;
  points: number;
  streak: number;
  completedLessons: number;
  totalLessons: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserStats(null);
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserProfile(profile);
      setUserStats(stats ? {
        level: stats.level || 1,
        points: stats.points || 0,
        streak: stats.streak || 0,
        completedLessons: stats.completed_lessons || 0,
        totalLessons: stats.total_lessons || 50
      } : null);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStats = async (updates: Partial<UserStats>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          level: updates.level,
          points: updates.points,
          streak: updates.streak,
          completed_lessons: updates.completedLessons,
          total_lessons: updates.totalLessons,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (!error) {
        setUserStats(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return {
    userStats,
    userProfile,
    loading,
    updateUserStats,
    refetch: fetchUserData
  };
};
