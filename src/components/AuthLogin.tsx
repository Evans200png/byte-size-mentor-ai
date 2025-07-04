import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, BookOpen, Star, Trophy, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Testimonials from '@/components/Testimonials';

const AuthLogin: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name);
      }

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (!isLogin) {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.error) {
        toast({
          title: "Reset Password Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Auth Section */}
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Welcome Section */}
          <div className="text-center lg:text-left space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-xl">
                <Brain className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">TechBites</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Master Technology 
                <span className="text-blue-600"> One Bite</span> at a Time
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Interactive microlearning powered by AI. Learn web development, AI/ML, 
                cloud computing, and more through personalized bite-sized lessons.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Interactive Lessons</h3>
                  <p className="text-sm text-gray-600">Bite-sized content with quizzes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Brain className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                  <p className="text-sm text-gray-600">Adaptive learning paths</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Star className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Gamified</h3>
                  <p className="text-sm text-gray-600">Earn points and badges</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Trophy className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Track Progress</h3>
                  <p className="text-sm text-gray-600">Monitor your learning journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="w-full max-w-md mx-auto lg:mx-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {showForgotPassword 
                  ? 'Reset Password' 
                  : isLogin 
                    ? 'Welcome Back!' 
                    : 'Join TechBites'
                }
              </CardTitle>
              <p className="text-gray-600">
                {showForgotPassword 
                  ? 'Enter your email to receive reset instructions'
                  : isLogin 
                    ? 'Continue your learning journey' 
                    : 'Start your learning adventure'
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {showForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Email'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </form>
              )}
              
              <div className="text-center space-y-2">
                {showForgotPassword ? (
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Sign In
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                    {isLogin && (
                      <div>
                        <button
                          type="button"
                          className="text-sm text-gray-600 hover:underline"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot your password?
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default AuthLogin;
