import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, X, Send, Mic, MicOff } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: '1',
          content: "Hi! I'm your TechBites learning assistant. I can help you navigate the platform, suggest topics to learn, and answer questions about your learning journey. How can I help you today?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('topic') || input.includes('learn') || input.includes('course')) {
      return "Based on current trends, I'd recommend starting with:\n\n🔹 **Web Development** - High demand and beginner-friendly\n🔹 **AI & Machine Learning** - Future-focused and exciting\n🔹 **Cybersecurity** - Critical skills in high demand\n\nWhat interests you most? I can guide you to the right lessons!";
    }
    
    if (input.includes('certificate') || input.includes('completion')) {
      return "To earn a certificate, you need to:\n\n✅ Complete all lessons in a topic\n✅ Score at least 70% on all quizzes\n✅ Pass the final assessment\n\nYour certificates will appear in the 'My Certificates' section of your dashboard. Would you like me to check your current progress?";
    }
    
    if (input.includes('forum') || input.includes('discussion') || input.includes('community')) {
      return "Our discussion forums are perfect for connecting with other learners! You can:\n\n💬 Ask questions and get help\n🤝 Share learning tips and experiences\n🎯 Discuss specific topics with peers\n\nAccess the forums from your dashboard. Each topic has its own dedicated discussion board!";
    }
    
    if (input.includes('quiz') || input.includes('test') || input.includes('score')) {
      return "Our quizzes are designed to reinforce your learning:\n\n📊 You need 70% to pass\n🔄 You can retake quizzes to improve\n⭐ Higher scores earn more points\n\nQuizzes are available at the end of each lesson section. Good luck!";
    }
    
    if (input.includes('help') || input.includes('how') || input.includes('navigate')) {
      return "I'm here to help you navigate TechBites! Here's what you can do:\n\n🏠 **Dashboard** - View your progress and stats\n📚 **Topics** - Choose what to learn next\n💬 **Forums** - Connect with other learners\n🏆 **Certificates** - Track your achievements\n\nWhat would you like to explore first?";
    }
    
    if (input.includes('progress') || input.includes('stats') || input.includes('level')) {
      return "You can track your learning progress on your dashboard:\n\n📈 **Level & Points** - Earned through completing lessons\n🔥 **Streak** - Days of continuous learning\n📊 **Completion Rate** - Lessons completed vs total\n\nKeep learning consistently to maintain your streak and level up!";
    }
    
    return "I'd be happy to help! I can assist with:\n\n🎯 **Topic recommendations** - What to learn next\n📚 **Platform navigation** - Finding lessons and features\n🏆 **Certificates** - Requirements and progress\n💬 **Community** - Using forums and discussions\n\nJust ask me anything about your learning journey!";
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };
      
      recognition.start();
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <User className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">TechBites Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={startListening}
            disabled={!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChatbot;
