import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import logo from '../assets/logo/davis-fabrics-logo-RGB.svg';
import './Navigation.css';

function Navigation() {
  const { language, changeLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const languageSelectorRef = useRef(null);
  const mobileMenuRef = useRef(null);
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        const hamburger = document.querySelector('.hamburger-menu');
        if (!hamburger || !hamburger.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
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

        {/* Desktop Navigation */}
        <div className="nav-right desktop-nav">
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

        {/* Mobile Menu Toggle */}
        <button
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="mobile-nav-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
          <nav className="mobile-nav-menu">
            <Link to="/kolekcje" onClick={() => setIsMobileMenuOpen(false)}>{t.collections}</Link>
            <Link to="/trendy" onClick={() => setIsMobileMenuOpen(false)}>{t.trends}</Link>
            <Link to="/oferta" onClick={() => setIsMobileMenuOpen(false)}>{t.offer}</Link>
            <Link to="/o-nas" onClick={() => setIsMobileMenuOpen(false)}>{t.about}</Link>
            <Link to="/do-pobrania" onClick={() => setIsMobileMenuOpen(false)}>{t.downloads}</Link>
            <Link to="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>{t.contact}</Link>
          </nav>
          <div className="mobile-language-selector">
            <div className="mobile-language-label">Language / Język</div>
            <div className="mobile-language-buttons">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`mobile-language-option ${language === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
