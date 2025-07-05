
import React, { useState } from 'react';
import HeaderLogo from '@/components/HeaderLogo';
import AuthButtons from '@/components/AuthButtons';
import LoginModal from '@/components/LoginModal';
import SignupModal from '@/components/SignupModal';

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleCloseSignup = () => {
    setShowSignupModal(false);
  };

  const handleSwitchToSignup = () => {
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <HeaderLogo />
            <AuthButtons 
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
            />
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={handleCloseLogin}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Sign Up Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={handleCloseSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Header;
