
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  isListening: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onStartListening: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isListening,
  onInputChange,
  onSendMessage,
  onStartListening,
  onKeyPress
}) => {
  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type 'start', 'videos', 'notes', or 'quiz' to explore content..."
          className="flex-1"
        />
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={onStartListening}
          disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button onClick={onSendMessage} disabled={!inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Try commands: "start", "videos", "notes", "quiz" | Quiz requires 70% to pass (15 questions)
      </p>
    </div>
  );
};

export default ChatInput;
