'use client';

import { createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toEnPath, toPlPath } from '@/lib/routes';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const language = pathname.startsWith('/en/') || pathname === '/en' ? 'ENG' : 'PL';

  const changeLanguage = (lang) => {
    if (lang === language) return;
    if (lang === 'ENG') {
      router.push(toEnPath(pathname));
    } else {
      router.push(toPlPath(pathname));
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
