
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LessonHeader from './chat/LessonHeader';
import ChatMessage from './chat/ChatMessage';
import QuizOptions from './chat/QuizOptions';
import ChatInput from './chat/ChatInput';
import { topicContent, getTopicKey, getRandomQuiz } from '@/hooks/useTopicContent';

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
      content: `Hi there! Ready to learn something new? 🎉\n\nWelcome to "${currentLesson.title}"! This comprehensive lesson will cover ${currentLesson.topic} with interactive videos, detailed notes, and hands-on practice.\n\n**What you'll get:**\n• 📹 Short, focused video tutorials\n• 📚 Comprehensive study notes\n• 🧠 Interactive quizzes (15+ questions)\n• 🎯 70% passing score required\n\nReady to begin? Type "start" to dive into the content!`,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalQuestions] = useState(15);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  
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

  const generateBotResponse = (userMessage: string): Message[] => {
    const lowerMessage = userMessage.toLowerCase();
    const topicKey = getTopicKey(currentLesson.topic);
    const content = topicContent[topicKey];
    
    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      const responses: Message[] = [];
      
      responses.push({
        id: Date.now().toString(),
        type: 'bot',
        content: `Excellent! Let's dive deep into ${currentLesson.topic}! 🚀\n\n**Learning Path:**\n1. 📹 Watch educational videos\n2. 📚 Review comprehensive notes\n3. 🧠 Complete 15 quiz questions (70% required to pass)\n\nLet's start with some carefully selected video content that will give you a solid foundation!`,
        timestamp: new Date()
      });

      content.videos.forEach((video, index) => {
        responses.push({
          id: `video-${Date.now()}-${index}`,
          type: 'video',
          content: video.description,
          videoUrl: video.url,
          videoTitle: video.title,
          timestamp: new Date()
        });
      });

      responses.push({
        id: `notes-${Date.now()}`,
        type: 'notes',
        content: `📚 **Study Notes for ${currentLesson.topic}**\n\nHere are the key concepts you need to master:`,
        notes: content.notes,
        timestamp: new Date()
      });

      return responses;
    }
    
    if (lowerMessage.includes('video') || lowerMessage.includes('watch')) {
      const responses: Message[] = [];
      
      responses.push({
        id: Date.now().toString(),
        type: 'bot',
        content: `Great! Here are the video tutorials for ${currentLesson.topic}:`,
        timestamp: new Date()
      });

      content.videos.forEach((video, index) => {
        responses.push({
          id: `video-${Date.now()}-${index}`,
          type: 'video',
          content: video.description,
          videoUrl: video.url,
          videoTitle: video.title,
          timestamp: new Date()
        });
      });

      return responses;
    }

    if (lowerMessage.includes('notes') || lowerMessage.includes('study')) {
      return [{
        id: `notes-${Date.now()}`,
        type: 'notes',
        content: `📚 **Complete Study Notes for ${currentLesson.topic}**\n\nThese notes cover everything you need to know:`,
        notes: content.notes,
        timestamp: new Date()
      }];
    }
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      const { quiz } = getRandomQuiz(topicKey, askedQuestions);
      return [{
        id: Date.now().toString(),
        type: 'bot',
        content: `Perfect! Let's test your knowledge with quiz question ${questionsAnswered + 1} of ${totalQuestions} 🤔\n\n**Question**: ${quiz.question}`,
        timestamp: new Date(),
        isQuiz: true,
        quizOptions: quiz.options,
        correctAnswer: quiz.correct
      }];
    }
    
    return [{
      id: Date.now().toString(),
      type: 'bot',
      content: `That's a thoughtful question about ${currentLesson.topic}! 👍\n\nYour curiosity shows you're engaged with the material. Here's some additional insight:\n\n• **Key Point**: ${content.notes[0]}\n• **Practical Application**: This knowledge directly applies to real-world projects\n• **Next Steps**: Try the comprehensive quiz with 15 questions to test your understanding!\n\nWould you like to see more videos, review the study notes, or take the quiz to test your understanding?`,
      timestamp: new Date()
    }];
  };

  const handleSendMessage = (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponses = generateBotResponse(messageText);
      setMessages(prev => [...prev, ...botResponses]);
      
      if (botResponses.length > 0 && botResponses[0].type === 'bot') {
        speakText(botResponses[0].content);
      }
    }, 1000);
  };

  const handleQuizAnswer = (selectedIndex: number, correctIndex: number) => {
    const isCorrect = selectedIndex === correctIndex;
    const newQuestionsAnswered = questionsAnswered + 1;
    const newQuizScore = quizScore + (isCorrect ? 1 : 0);
    
    setQuestionsAnswered(newQuestionsAnswered);
    setQuizScore(newQuizScore);

    const resultMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: isCorrect 
        ? `🎉 Excellent! That's correct!\n\n**Progress: ${newQuestionsAnswered}/${totalQuestions} questions completed**\n**Current Score: ${newQuizScore}/${newQuestionsAnswered} (${Math.round((newQuizScore/newQuestionsAnswered)*100)}%)**\n\nYou're really grasping ${currentLesson.topic} well!`
        : `Not quite right, but that's part of learning! 🤔\n\n**Progress: ${newQuestionsAnswered}/${totalQuestions} questions completed**\n**Current Score: ${newQuizScore}/${newQuestionsAnswered} (${Math.round((newQuizScore/newQuestionsAnswered)*100)}%)**\n\nReview the study materials to reinforce the concepts.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, resultMessage]);
    speakText(resultMessage.content);

    if (newQuestionsAnswered >= totalQuestions) {
      const finalScore = Math.round((newQuizScore / totalQuestions) * 100);
      const passed = finalScore >= 70;
      
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `🎊 Quiz Complete! You've answered all ${totalQuestions} questions!\n\n**Final Results:**\n• Questions answered: ${newQuestionsAnswered}/${totalQuestions}\n• Correct answers: ${newQuizScore}\n• Final Score: ${finalScore}%\n• Status: ${passed ? '✅ PASSED!' : '❌ Need 70% to pass'}\n\n${passed ? 'Congratulations! You\'ve mastered the material and earned your completion badge! 🏆' : 'Don\'t worry! Review the materials and try again. You\'re learning!'}\n\n${passed ? 'You\'ve gained valuable expertise in ' + currentLesson.topic + '! Keep up the excellent work! 🚀' : 'Take some time to review the videos and notes, then come back stronger!'}`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, completionMessage]);
        speakText(completionMessage.content);
        
        if (passed) {
          setTimeout(() => {
            onLessonComplete(finalScore);
          }, 3000);
        }
      }, 2000);
    } else {
      setTimeout(() => {
        const topicKey = getTopicKey(currentLesson.topic);
        const { quiz, newAskedQuestions } = getRandomQuiz(topicKey, askedQuestions);
        setAskedQuestions(newAskedQuestions);
        
        const nextQuizMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Next question (${newQuestionsAnswered + 1}/${totalQuestions}) 📝\n\n**Question**: ${quiz.question}`,
          timestamp: new Date(),
          isQuiz: true,
          quizOptions: quiz.options,
          correctAnswer: quiz.correct
        };
        
        setMessages(prev => [...prev, nextQuizMessage]);
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
      <LessonHeader
        currentLesson={currentLesson}
        questionsAnswered={questionsAnswered}
        quizScore={quizScore}
        totalQuestions={totalQuestions}
        isAudioEnabled={isAudioEnabled}
        onBackToDashboard={onBackToDashboard}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
      />

      <div className="max-w-4xl mx-auto p-4">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardContent className="flex-1 overflow-hidden p-0">
            <div 
              ref={chatContainerRef}
              className="h-full overflow-y-auto p-6 space-y-4"
            >
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <ChatMessage message={message} />
                  
                  {message.isQuiz && message.quizOptions && (
                    <QuizOptions
                      options={message.quizOptions}
                      onAnswerSelect={(index) => handleQuizAnswer(index, message.correctAnswer || 0)}
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <ChatInput
            inputValue={inputValue}
            isListening={isListening}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onStartListening={startListening}
            onKeyPress={handleKeyPress}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
