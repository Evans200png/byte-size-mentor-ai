
import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="flex items-center gap-4">
      {/* Sign In Icon */}
      <button
        onClick={onLoginClick}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        aria-label="Sign In"
      >
        <LogIn className="h-5 w-5" />
      </button>

      {/* Get Started Button */}
      <Button
        onClick={onSignupClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
      >
        Get Started
      </Button>
    </div>
  );
};

export default AuthButtons;
