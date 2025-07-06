
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuizOptionsProps {
  options: string[];
  onAnswerSelect: (index: number) => void;
}

const QuizOptions: React.FC<QuizOptionsProps> = ({ options, onAnswerSelect }) => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] space-y-2">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto p-3 whitespace-normal"
            onClick={() => onAnswerSelect(index)}
          >
            <div className="flex items-start gap-2">
              <span className="font-medium text-blue-600">
                {String.fromCharCode(65 + index)}.
              </span>
              <span>{option}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuizOptions;
