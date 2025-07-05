
import React from 'react';
import { Brain } from 'lucide-react';

const HeaderLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-600 text-white rounded-xl">
        <Brain className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">TechBites</h1>
    </div>
  );
};

export default HeaderLogo;
