
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-3 glass-card px-3 py-2 rounded-lg">
      <span className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-primary' : 'text-gray-500'}`}>
        EN
      </span>
      <Switch
        checked={language === 'fr'}
        onCheckedChange={(checked) => setLanguage(checked ? 'fr' : 'en')}
        className="data-[state=checked]:bg-primary"
      />
      <span className={`text-sm font-medium transition-colors ${language === 'fr' ? 'text-primary' : 'text-gray-500'}`}>
        FR
      </span>
    </div>
  );
};

export default LanguageToggle;
