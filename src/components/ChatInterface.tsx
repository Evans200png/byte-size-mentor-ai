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
  XCircle,
  Play,
  FileVideo,
  BookOpen
} from 'lucide-react';

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

// Comprehensive educational content for all topics
const topicContent = {
  "Web": {
    videos: [
      {
        title: "HTML Fundamentals - Building Your First Web Page",
        url: "https://www.youtube.com/embed/UB1O30fR-EE",
        description: "Learn the basics of HTML structure and create your first webpage"
      },
      {
        title: "CSS Styling - Making Your Website Beautiful",
        url: "https://www.youtube.com/embed/yfoY53QXEnI",
        description: "Master CSS to style your HTML and create visually appealing websites"
      },
      {
        title: "JavaScript Basics - Adding Interactivity",
        url: "https://www.youtube.com/embed/PkZNo7MFNFg",
        description: "Introduction to JavaScript programming for web development"
      }
    ],
    notes: [
      "🌐 **HTML (HyperText Markup Language)** is the standard markup language for creating web pages",
      "📝 **Key HTML Elements**: `<html>`, `<head>`, `<body>`, `<h1>-<h6>`, `<p>`, `<div>`, `<span>`",
      "🎨 **CSS (Cascading Style Sheets)** controls the presentation and layout of web pages",
      "📐 **Box Model**: Content → Padding → Border → Margin",
      "⚡ **JavaScript** adds interactivity and dynamic behavior to websites",
      "🔧 **DOM (Document Object Model)** allows JavaScript to manipulate HTML elements",
      "📱 **Responsive Design** ensures websites work on all devices using media queries",
      "🚀 **Modern Tools**: React, Vue, Angular for building complex web applications"
    ],
    quizzes: [
      {
        question: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language"
        ],
        correct: 0
      },
      {
        question: "Which CSS property controls the text size?",
        options: ["font-weight", "font-size", "text-size", "font-style"],
        correct: 1
      }
    ]
  },
  "AI": {
    videos: [
      {
        title: "Introduction to Artificial Intelligence - Core Concepts",
        url: "https://www.youtube.com/embed/JMUxmLyrhSk",
        description: "Understanding AI fundamentals, machine learning, and neural networks"
      },
      {
        title: "Machine Learning Algorithms Explained",
        url: "https://www.youtube.com/embed/ukzFI9rgwfU",
        description: "Learn about supervised, unsupervised, and reinforcement learning"
      },
      {
        title: "Deep Learning and Neural Networks",
        url: "https://www.youtube.com/embed/aircAruvnKk",
        description: "Explore deep learning concepts and neural network architectures"
      }
    ],
    notes: [
      "🤖 **Artificial Intelligence (AI)** is the simulation of human intelligence in machines",
      "🧠 **Machine Learning (ML)** is a subset of AI that learns from data without explicit programming",
      "🔍 **Supervised Learning**: Training with labeled data (classification, regression)",
      "🎯 **Unsupervised Learning**: Finding patterns in unlabeled data (clustering, association)",
      "🎮 **Reinforcement Learning**: Learning through interaction and rewards",
      "⚡ **Neural Networks**: Computing systems inspired by biological neural networks",
      "🔥 **Deep Learning**: ML using deep neural networks with multiple layers",
      "📊 **Applications**: Image recognition, NLP, autonomous vehicles, recommendation systems"
    ],
    quizzes: [
      {
        question: "What type of learning uses labeled training data?",
        options: [
          "Supervised Learning",
          "Unsupervised Learning", 
          "Reinforcement Learning",
          "Deep Learning"
        ],
        correct: 0
      },
      {
        question: "Which is NOT a common application of AI?",
        options: [
          "Image Recognition",
          "Natural Language Processing",
          "Manual Data Entry",
          "Autonomous Vehicles"
        ],
        correct: 2
      }
    ]
  },
  "Cloud": {
    videos: [
      {
        title: "Cloud Computing Fundamentals - AWS, Azure, GCP",
        url: "https://www.youtube.com/embed/M988_fsOSWo",
        description: "Introduction to cloud computing concepts and major providers"
      },
      {
        title: "Docker and Containerization Explained",
        url: "https://www.youtube.com/embed/fqMOX6JJhGo",
        description: "Learn containerization with Docker and container orchestration"
      },
      {
        title: "Kubernetes for Beginners",
        url: "https://www.youtube.com/embed/X48VuDVv0do",
        description: "Container orchestration and management with Kubernetes"
      }
    ],
    notes: [
      "☁️ **Cloud Computing** delivers computing services over the internet",
      "🏢 **Service Models**: IaaS (Infrastructure), PaaS (Platform), SaaS (Software)",
      "🌍 **Major Providers**: AWS (Amazon), Microsoft Azure, Google Cloud Platform",
      "📦 **Containerization**: Packaging applications with Docker for consistency",
      "⚙️ **Kubernetes**: Container orchestration platform for managing containerized applications",
      "🔒 **Security**: Identity management, encryption, compliance in cloud environments",
      "💰 **Cost Benefits**: Pay-as-you-use, reduced infrastructure costs",
      "📈 **Scalability**: Auto-scaling resources based on demand"
    ],
    quizzes: [
      {
        question: "What does SaaS stand for?",
        options: [
          "Software as a Service",
          "System as a Service",
          "Security as a Service",
          "Storage as a Service"
        ],
        correct: 0
      },
      {
        question: "Which tool is primarily used for containerization?",
        options: ["Kubernetes", "Docker", "Terraform", "Jenkins"],
        correct: 1
      }
    ]
  },
  "Cybersecurity": {
    videos: [
      {
        title: "Cybersecurity Fundamentals - Protecting Digital Assets",
        url: "https://www.youtube.com/embed/inWWhr5tnEA",
        description: "Essential cybersecurity concepts and threat landscape overview"
      },
      {
        title: "Ethical Hacking and Penetration Testing",
        url: "https://www.youtube.com/embed/3Kq1MIfTWCE",
        description: "Introduction to ethical hacking methodologies and penetration testing"
      },
      {
        title: "Network Security and Firewalls",
        url: "https://www.youtube.com/embed/kDEX1HXybrU",
        description: "Understanding network security principles and firewall configurations"
      }
    ],
    notes: [
      "🛡️ **Cybersecurity** protects systems, networks, and data from digital attacks",
      "🎯 **CIA Triad**: Confidentiality, Integrity, Availability",
      "🦠 **Common Threats**: Malware, phishing, ransomware, social engineering",
      "🔐 **Authentication**: Multi-factor authentication (MFA) and strong passwords",
      "🌐 **Network Security**: Firewalls, VPNs, intrusion detection systems",
      "🕵️ **Ethical Hacking**: Authorized testing to find vulnerabilities",
      "📋 **Compliance**: GDPR, HIPAA, SOX regulations and standards",
      "🚨 **Incident Response**: Preparation, detection, containment, recovery"
    ],
    quizzes: [
      {
        question: "What does the CIA Triad stand for in cybersecurity?",
        options: [
          "Central Intelligence Agency",
          "Confidentiality, Integrity, Availability",
          "Computer Information Assurance",
          "Cyber Intelligence Analysis"
        ],
        correct: 1
      },
      {
        question: "Which is NOT a common type of malware?",
        options: ["Virus", "Trojan", "Firewall", "Ransomware"],
        correct: 2
      }
    ]
  },
  "Data": {
    videos: [
      {
        title: "Data Science with Python - Getting Started",
        url: "https://www.youtube.com/embed/ua-CiDNNj30",
        description: "Introduction to data science using Python, pandas, and numpy"
      },
      {
        title: "Data Visualization with matplotlib and seaborn",
        url: "https://www.youtube.com/embed/UO98lJQ3QGI",  
        description: "Creating effective data visualizations and charts"
      },
      {
        title: "Statistics for Data Science",
        url: "https://www.youtube.com/embed/xxpc-HPKN28",
        description: "Essential statistical concepts for data analysis"
      }
    ],
    notes: [
      "📊 **Data Science** extracts insights and knowledge from structured and unstructured data",
      "🐍 **Python Libraries**: Pandas (data manipulation), NumPy (numerical computing), Matplotlib (visualization)",
      "📈 **Data Analysis Process**: Collection → Cleaning → Exploration → Modeling → Interpretation",
      "🎯 **Statistical Concepts**: Mean, median, standard deviation, correlation, hypothesis testing",
      "🤖 **Machine Learning Integration**: Scikit-learn for predictive modeling",
      "📊 **Data Visualization**: Creating meaningful charts and graphs to communicate findings",
      "💾 **Data Sources**: Databases, APIs, CSV files, web scraping",
      "🔍 **Exploratory Data Analysis (EDA)**: Understanding data patterns and relationships"
    ],
    quizzes: [
      {
        question: "Which Python library is primarily used for data manipulation?",
        options: ["NumPy", "Matplotlib", "Pandas", "Scikit-learn"],
        correct: 2
      },
      {
        question: "What is the first step in the data analysis process?",
        options: ["Modeling", "Collection", "Visualization", "Interpretation"],
        correct: 1
      }
    ]
  },
  "Mobile": {
    videos: [
      {
        title: "React Native - Build Mobile Apps with JavaScript",
        url: "https://www.youtube.com/embed/0-S5a0eXPoc",
        description: "Learn React Native for cross-platform mobile development"
      },
      {
        title: "Flutter Development - Google's UI Toolkit",
        url: "https://www.youtube.com/embed/1gDhl4leEzA",
        description: "Introduction to Flutter for building beautiful mobile apps"
      },
      {
        title: "Mobile App Design Principles",
        url: "https://www.youtube.com/embed/6LCGCKOr_fM",
        description: "Essential UI/UX principles for mobile application design"
      }
    ],
    notes: [
      "📱 **Mobile Development** creates applications for mobile devices (iOS, Android)",
      "⚛️ **React Native**: JavaScript framework for cross-platform mobile apps",
      "🎯 **Flutter**: Google's UI toolkit using Dart language for native performance",
      "🍎 **iOS Development**: Swift/Objective-C with Xcode IDE",
      "🤖 **Android Development**: Java/Kotlin with Android Studio",
      "🎨 **UI/UX Design**: Material Design (Android), Human Interface Guidelines (iOS)",
      "📦 **App Distribution**: App Store (iOS), Google Play Store (Android)",
      "🔧 **Development Tools**: Expo, Ionic, Xamarin for cross-platform development"
    ],
    quizzes: [
      {
        question: "Which language does Flutter primarily use?",
        options: ["JavaScript", "Swift", "Dart", "Kotlin"],
        correct: 2
      },
      {
        question: "What is React Native based on?",
        options: ["React", "Angular", "Vue", "Svelte"],
        correct: 0
      }
    ]
  }
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentLesson, 
  onBackToDashboard, 
  onLessonComplete 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi there! Ready to learn something new? 🎉\n\nWelcome to "${currentLesson.title}"! This comprehensive lesson will cover ${currentLesson.topic} with interactive videos, detailed notes, and hands-on practice.\n\n**What you'll get:**\n• 📹 Short, focused video tutorials\n• 📚 Comprehensive study notes\n• 🧠 Interactive quizzes\n• 🎯 Practical exercises\n\nReady to begin? Type "start" to dive into the content!`,
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

  const getTopicKey = (topic: string): keyof typeof topicContent => {
    const topicMap: { [key: string]: keyof typeof topicContent } = {
      'web': 'Web',
      'ai': 'AI',
      'machine': 'AI',
      'cloud': 'Cloud',
      'cybersecurity': 'Cybersecurity',
      'cyber': 'Cybersecurity',
      'security': 'Cybersecurity',
      'data': 'Data',
      'mobile': 'Mobile',
      'app': 'Mobile'
    };
    
    const lowerTopic = topic.toLowerCase();
    // Check for partial matches
    for (const key in topicMap) {
      if (lowerTopic.includes(key)) {
        return topicMap[key];
      }
    }
    return 'Web'; // Default fallback
  };

  const generateBotResponse = (userMessage: string): Message[] => {
    const lowerMessage = userMessage.toLowerCase();
    const topicKey = getTopicKey(currentLesson.topic);
    const content = topicContent[topicKey];
    
    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      const responses: Message[] = [];
      
      // Introduction message
      responses.push({
        id: Date.now().toString(),
        type: 'bot',
        content: `Excellent! Let's dive deep into ${currentLesson.topic}! 🚀\n\n**Learning Path:**\n1. 📹 Watch educational videos\n2. 📚 Review comprehensive notes\n3. 🧠 Test your knowledge with quizzes\n\nLet's start with some carefully selected video content that will give you a solid foundation!`,
        timestamp: new Date()
      });

      // Add video content
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

      // Add notes
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
      const randomQuiz = content.quizzes[Math.floor(Math.random() * content.quizzes.length)];
      return [{
        id: Date.now().toString(),
        type: 'bot',
        content: `Perfect! Let's test your knowledge with a quiz question! 🤔\n\n**Question**: ${randomQuiz.question}`,
        timestamp: new Date(),
        isQuiz: true,
        quizOptions: randomQuiz.options,
        correctAnswer: randomQuiz.correct
      }];
    }
    
    // Default encouraging response
    return [{
      id: Date.now().toString(),
      type: 'bot',
      content: `That's a thoughtful question about ${currentLesson.topic}! 👍\n\nYour curiosity shows you're engaged with the material. Here's some additional insight:\n\n• **Key Point**: ${content.notes[0]}\n• **Practical Application**: This knowledge directly applies to real-world projects\n• **Next Steps**: Try the hands-on exercises to reinforce your learning\n\nWould you like to see more videos, review the study notes, or take a quiz to test your understanding?`,
      timestamp: new Date()
    }];
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

    // Generate and add bot response(s) after a short delay
    setTimeout(() => {
      const botResponses = generateBotResponse(messageText);
      setMessages(prev => [...prev, ...botResponses]);
      
      // Speak the first bot response
      if (botResponses.length > 0 && botResponses[0].type === 'bot') {
        speakText(botResponses[0].content);
      }
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
        ? `🎉 Excellent! That's correct!\n\nYou're really grasping ${currentLesson.topic} well. Your understanding is developing nicely through the combination of videos, notes, and practice!`
        : `Not quite right, but that's part of learning! 🤔\n\nReview the video content and study notes to reinforce the concepts. The correct answer helps deepen your understanding of ${currentLesson.topic}.`,
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
          content: `🎊 Congratulations! You've completed "${currentLesson.title}"!\n\n**Your Results:**\n• Videos watched: ✅\n• Notes reviewed: ✅\n• Questions answered: ${questionsAnswered + 1}\n• Correct answers: ${quizScore + (isCorrect ? 1 : 0)}\n• Final Score: ${Math.round(((quizScore + (isCorrect ? 1 : 0)) / (questionsAnswered + 1)) * 100)}%\n\nYou've gained valuable knowledge in ${currentLesson.topic}! Keep up the excellent work! 🚀`,
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
                      className={`max-w-[90%] rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : message.type === 'video'
                          ? 'bg-purple-50 border border-purple-200 text-purple-800'
                          : message.type === 'notes'
                          ? 'bg-amber-50 border border-amber-200 text-amber-800'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
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
                      
                      {(message.type === 'bot' || message.type === 'system') && (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      )}
                      
                      {message.type === 'user' && (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      )}
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
                placeholder="Type 'start', 'videos', 'notes', or 'quiz' to explore content..."
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
              💡 Try commands: "start", "videos", "notes", "quiz" or ask specific questions
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
