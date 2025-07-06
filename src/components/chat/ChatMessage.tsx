
import React from 'react';
import { FileVideo, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'system' | 'video' | 'notes';
  content: string;
  timestamp: Date;
  isQuiz?: boolean;
  quizOptions?: string[];
  correctAnswer?: number;
  videoUrl?: string;
  videoTitle?: string;
  notes?: string[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const getMessageStyles = () => {
    if (message.type === 'user') return 'bg-blue-600 text-white';
    if (message.type === 'system') return 'bg-green-50 border border-green-200 text-green-800';
    if (message.type === 'video') return 'bg-purple-50 border border-purple-200 text-purple-800';
    if (message.type === 'notes') return 'bg-amber-50 border border-amber-200 text-amber-800';
    return 'bg-white border border-gray-200 text-gray-900';
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] rounded-lg px-4 py-3 ${getMessageStyles()}`}>
        {message.type === 'video' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <FileVideo className="h-5 w-5" />
              <span className="font-semibold">{message.videoTitle}</span>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <iframe
                width="100%"
                height="315"
                src={message.videoUrl}
                title={message.videoTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
            </div>
            
            <p className="text-sm mt-2">{message.content}</p>
          </div>
        )}
        
        {message.type === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5" />
              <span className="font-semibold">Study Notes</span>
            </div>
            
            <div className="whitespace-pre-wrap text-sm leading-relaxed mb-3">
              {message.content}
            </div>
            
            <div className="bg-white rounded-lg p-4 space-y-2">
              {message.notes?.map((note, index) => (
                <div key={index} className="text-sm leading-relaxed border-l-2 border-amber-400 pl-3">
                  {note}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(message.type === 'bot' || message.type === 'system' || message.type === 'user') && (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
