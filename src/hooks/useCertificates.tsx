
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Certificate {
  id: string;
  topic_id: string;
  topic_title: string;
  certificate_id: string;
  issued_at: string;
  score_achieved: number;
  lessons_completed: number;
  total_lessons: number;
}

export const useCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });

    if (data) setCertificates(data);
    setLoading(false);
  };

  const checkEligibilityAndCreateCertificate = async (
    topicId: string,
    topicTitle: string,
    averageScore: number,
    completedLessons: number,
    totalLessons: number
  ) => {
    if (!user) return { eligible: false };

    // Check if user already has certificate for this topic
    const { data: existing } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .single();

    if (existing) {
      return { eligible: false, alreadyEarned: true };
    }

    // Check eligibility criteria
    const eligible = averageScore >= 70 && completedLessons === totalLessons;

    if (eligible) {
      // Generate certificate_id on the client side since the trigger might not be working
      const certificateId = `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
      
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: user.id,
          topic_id: topicId,
          topic_title: topicTitle,
          certificate_id: certificateId,
          score_achieved: Math.round(averageScore),
          lessons_completed: completedLessons,
          total_lessons: totalLessons
        })
        .select()
        .single();

      if (!error && data) {
        setCertificates(prev => [data, ...prev]);
        return { eligible: true, certificate: data };
      }
    }

    return { eligible };
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  return {
    certificates,
    loading,
    fetchCertificates,
    checkEligibilityAndCreateCertificate
  };
};
