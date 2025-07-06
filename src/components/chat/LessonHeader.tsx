
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Volume2, VolumeX } from 'lucide-react';

interface LessonHeaderProps {
  currentLesson: {
    id: number;
    title: string;
    topic: string;
    progress: number;
    totalSteps: number;
  };
  questionsAnswered: number;
  quizScore: number;
  totalQuestions: number;
  isAudioEnabled: boolean;
  onBackToDashboard: () => void;
  onToggleAudio: () => void;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentLesson,
  questionsAnswered,
  quizScore,
  totalQuestions,
  isAudioEnabled,
  onBackToDashboard,
  onToggleAudio
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currentLesson.title}</h1>
              <p className="text-sm text-gray-600">Step {currentLesson.progress} of {currentLesson.totalSteps}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {currentLesson.topic}
            </Badge>
            {questionsAnswered > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                📊 {Math.round((quizScore/questionsAnswered)*100)}% ({quizScore}/{questionsAnswered})
              </Badge>
            )}
            <Button
              variant={isAudioEnabled ? "default" : "outline"}
              size="sm"
              onClick={onToggleAudio}
            >
              {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={(currentLesson.progress / currentLesson.totalSteps) * 100} className="h-2" />
          {questionsAnswered > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Quiz Progress: {questionsAnswered}/{totalQuestions}</span>
                <span>Need 70% to pass</span>
              </div>
              <Progress value={(questionsAnswered / totalQuestions) * 100} className="h-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
