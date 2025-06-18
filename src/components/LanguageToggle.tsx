
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 relative">
      {/* Background slider */}
      <div 
        className={`absolute top-1 w-8 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
          language === 'fr' ? 'transform translate-x-8' : 'transform translate-x-0'
        }`} 
      />
      
      {/* EN Button */}
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
          language === 'en' ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        EN
      </button>
      
      {/* FR Button */}
      <button
        onClick={() => setLanguage('fr')}
        className={`relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
          language === 'fr' ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageToggle;
