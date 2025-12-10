import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

function DoPobrania() {
  const { language } = useLanguage();
  const t = translations[language].downloads;

  return (
    <div className="page">
      <h1>{t.title}</h1>
    </div>
  );
}

export default DoPobrania;
