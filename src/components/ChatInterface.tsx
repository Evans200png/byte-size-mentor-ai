
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  ArrowLeft, 
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  isQuiz?: boolean;
  quizOptions?: string[];
  correctAnswer?: number;
}

interface ChatInterfaceProps {
  currentLesson: {
    id: number;
    title: string;
    topic: string;
    progress: number;
    totalSteps: number;
  };
  onBackToDashboard: () => void;
  onLessonComplete: (score: number) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentLesson, 
  onBackToDashboard, 
  onLessonComplete 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi there! Ready to learn something new? 🎉\n\nWelcome to "${currentLesson.title}"! This lesson will cover the fundamentals of ${currentLesson.topic}. Let's start with the basics and build your understanding step by step.\n\n**What you'll learn:**\n• Core concepts and terminology\n• Practical applications\n• Best practices\n\nReady to begin? Type "start" or click the voice button to continue!`,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    if (isAudioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
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
        handleSendMessage(transcript);
      };
      
      recognition.start();
    }
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Lesson content responses
    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `Great! Let's dive into ${currentLesson.topic}! 🚀\n\n**Lesson 1: Introduction**\n\n${currentLesson.topic} is a fundamental concept in modern technology. Here are the key points:\n\n• **Definition**: The core principle behind ${currentLesson.topic}\n• **Importance**: Why it matters in today's tech landscape\n• **Applications**: Real-world uses and benefits\n\nThis forms the foundation for everything else we'll learn. Understanding these basics will help you grasp more advanced concepts later.\n\nReady for a quick check? Let me ask you a question!`,
        timestamp: new Date()
      };
    }
    
    if (lowerMessage.includes('question') || lowerMessage.includes('quiz')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `Perfect! Here's your first quiz question: 🤔\n\n**Question**: Which of the following best describes ${currentLesson.topic}?`,
        timestamp: new Date(),
        isQuiz: true,
        quizOptions: [
          `A fundamental building block of modern applications`,
          `An outdated technology with limited use`,
          `Only useful for large enterprises`,
          `A simple concept with no real-world applications`
        ],
        correctAnswer: 0
      };
    }
    
    // Default encouraging response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: `That's a great question! 👍\n\nYou're showing excellent curiosity about ${currentLesson.topic}. This kind of thinking will help you master these concepts quickly.\n\nLet me elaborate on that point:\n\n• **Key insight**: Your question touches on an important aspect\n• **Practical tip**: This knowledge will be useful in real projects\n• **Next step**: Let's explore this further with a hands-on example\n\nKeep asking questions - that's how we learn best! What would you like to know more about?`,
      timestamp: new Date()
    };
  };

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate and add bot response after a short delay
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      setMessages(prev => [...prev, botResponse]);
      speakText(botResponse.content);
    }, 1000);
  };

  const handleQuizAnswer = (selectedIndex: number, correctIndex: number) => {
    const isCorrect = selectedIndex === correctIndex;
    setQuestionsAnswered(prev => prev + 1);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    const resultMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: isCorrect 
        ? `🎉 Excellent! That's correct!\n\nYou're really getting the hang of this. Your understanding of ${currentLesson.topic} is developing nicely. Let's continue building on this knowledge!`
        : `Not quite right, but that's okay! 🤔\n\nLearning is all about making mistakes and growing from them. The correct answer helps us understand ${currentLesson.topic} better. Let's review the concept and try another approach!`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, resultMessage]);
    speakText(resultMessage.content);

    // Check if lesson is complete
    if (questionsAnswered >= 2) {
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `🎊 Congratulations! You've completed "${currentLesson.title}"!\n\n**Your Results:**\n• Questions answered: ${questionsAnswered + 1}\n• Correct answers: ${quizScore + (isCorrect ? 1 : 0)}\n• Score: ${Math.round(((quizScore + (isCorrect ? 1 : 0)) / (questionsAnswered + 1)) * 100)}%\n\nYou're making fantastic progress! Keep up the great work and continue learning new topics to level up your skills! 🚀`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, completionMessage]);
        speakText(completionMessage.content);
        
        setTimeout(() => {
          onLessonComplete(Math.round(((quizScore + (isCorrect ? 1 : 0)) / (questionsAnswered + 1)) * 100));
        }, 3000);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
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
              <Button
                variant={isAudioEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={(currentLesson.progress / currentLesson.totalSteps) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardContent className="flex-1 overflow-hidden p-0">
            <div 
              ref={chatContainerRef}
              className="h-full overflow-y-auto p-6 space-y-4"
            >
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                  
                  {message.isQuiz && message.quizOptions && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] space-y-2">
                        {message.quizOptions.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                            onClick={() => handleQuizAnswer(index, message.correctAnswer || 0)}
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
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or ask a question..."
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
              <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Try voice commands like "next lesson", "repeat", or "explain more"
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
