
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  lessonId?: number;
  quizId?: number;
  type: 'lesson' | 'quiz';
  title: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  topicId,
  lessonId,
  quizId,
  type,
  title
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const { submitFeedback, loading } = useFeedback();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const { error } = await submitFeedback({
      topicId,
      lessonId,
      quizId,
      rating,
      comment: comment.trim() || undefined,
      feedbackType: type
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully."
      });
      onClose();
      // Reset form
      setRating(0);
      setComment('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this {type}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              How would you rate this {type}? Your feedback helps us improve!
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-colors"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="text-center text-sm text-gray-600">
              {rating === 1 && "Poor - Needs significant improvement"}
              {rating === 2 && "Fair - Could be better"}
              {rating === 3 && "Good - Meets expectations"}
              {rating === 4 && "Very Good - Above expectations"}
              {rating === 5 && "Excellent - Outstanding!"}
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Comments (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts, suggestions, or what you liked most..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button type="submit" disabled={rating === 0 || loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
