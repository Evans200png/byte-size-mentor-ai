
-- Create discussion forums tables
CREATE TABLE public.forum_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  topic_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.forum_categories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id),
  CHECK ((post_id IS NOT NULL AND reply_id IS NULL) OR (post_id IS NULL AND reply_id IS NOT NULL))
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  certificate_id TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score_achieved INTEGER NOT NULL,
  lessons_completed INTEGER NOT NULL,
  total_lessons INTEGER NOT NULL
);

-- Create feedback table
CREATE TABLE public.lesson_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id TEXT NOT NULL,
  lesson_id INTEGER,
  quiz_id INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  feedback_type TEXT CHECK (feedback_type IN ('lesson', 'quiz')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default forum categories
INSERT INTO public.forum_categories (name, description, topic_id) VALUES
('Web Development', 'Discuss HTML, CSS, JavaScript, React, and modern web frameworks', 'web-dev'),
('AI & Machine Learning', 'Share insights on AI, ML algorithms, neural networks, and data modeling', 'ai-ml'),
('Cloud Computing', 'Talk about AWS, Azure, Google Cloud, and cloud architecture', 'cloud'),
('Cybersecurity', 'Discuss security practices, ethical hacking, and threat prevention', 'cybersecurity'),
('Data Science', 'Share knowledge on data analysis, visualization, and statistical modeling', 'data-science'),
('Mobile Development', 'Discuss iOS, Android, React Native, and mobile app development', 'mobile-dev');

-- Add Row Level Security (RLS) policies
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_feedback ENABLE ROW LEVEL SECURITY;

-- Forum categories policies (public read, admin write)
CREATE POLICY "Anyone can view forum categories" ON public.forum_categories FOR SELECT USING (true);

-- Forum posts policies
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Forum replies policies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create their own replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = user_id);

-- Forum votes policies
CREATE POLICY "Anyone can view forum votes" ON public.forum_votes FOR SELECT USING (true);
CREATE POLICY "Users can create their own votes" ON public.forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.forum_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.forum_votes FOR DELETE USING (auth.uid() = user_id);

-- Certificates policies
CREATE POLICY "Users can view their own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own certificates" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view their own feedback" ON public.lesson_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own feedback" ON public.lesson_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON public.lesson_feedback FOR UPDATE USING (auth.uid() = user_id);

-- Create function to generate certificate ID
CREATE OR REPLACE FUNCTION generate_certificate_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'CERT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)) || '-' || EXTRACT(YEAR FROM NOW());
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate certificate ID
CREATE OR REPLACE FUNCTION set_certificate_id() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_id IS NULL OR NEW.certificate_id = '' THEN
    NEW.certificate_id := generate_certificate_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certificate_id_trigger
  BEFORE INSERT ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION set_certificate_id();
