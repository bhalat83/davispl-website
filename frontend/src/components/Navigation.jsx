import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import logo from '../assets/logo/davis-fabrics-logo-RGB.svg';
import './Navigation.css';

function Navigation() {
  const { language, changeLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageSelectorRef = useRef(null);
  const t = translations[language].nav;

  const languages = [
    { code: 'PL', label: 'Polski' },
    { code: 'ENG', label: 'English' }
  ];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Davis Fabrics" />
        </Link>
        <div className="nav-right">
          <nav className="nav-menu">
            <Link to="/kolekcje">{t.collections}</Link>
            <Link to="/trendy">{t.trends}</Link>
            <Link to="/oferta">{t.offer}</Link>
            <Link to="/o-nas">{t.about}</Link>
            <Link to="/do-pobrania">{t.downloads}</Link>
            <Link to="/kontakt">{t.contact}</Link>
          </nav>
          <div className="language-selector" ref={languageSelectorRef}>
            <button
              className="language-button"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              {language}
              <span className={`language-arrow ${isLanguageMenuOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isLanguageMenuOpen && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
