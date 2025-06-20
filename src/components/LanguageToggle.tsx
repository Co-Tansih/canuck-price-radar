
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 relative w-16 h-8">
      {/* Background slider */}
      <div 
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${
          language === 'fr' ? 'translate-x-8' : 'translate-x-1'
        }`} 
      />
      
      {/* EN Button */}
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-7 h-6 text-xs font-semibold rounded-full transition-colors duration-300 flex items-center justify-center ${
          language === 'en' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
      
      {/* FR Button */}
      <button
        onClick={() => setLanguage('fr')}
        className={`relative z-10 w-7 h-6 text-xs font-semibold rounded-full transition-colors duration-300 flex items-center justify-center ${
          language === 'fr' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageToggle;
