'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { getRoutes } from '@/lib/routes';
import './Navigation.css';

function Navigation() {
  const { language, changeLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const languageSelectorRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();
  const t = translations[language].nav;
  const r = getRoutes(language);

  const languages = [
    { code: 'PL', label: 'Polski' },
    { code: 'ENG', label: 'English' }
  ];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageMenuOpen(false);
  };

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery.trim()) {
      router.push(`/kolekcje?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(!isSearchOpen);
      if (!isSearchOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/kolekcje?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="navigation">
      <div className="nav-container desktop-nav">
        {/* 1. Logo */}
        <Link href={r.home} className="logo">
          <img src="/logo/davis-fabrics-logo-RGB.svg" alt="Davis Fabrics" />
        </Link>

        {/* 2. Menu główne */}
        <nav className="nav-menu">
          <Link href={r.collections}>{t.collections}</Link>
          <Link href={r.trends}>{t.trends}</Link>
          <Link href={r.offer}>{t.offer}</Link>
          <Link href={r.about}>{t.about}</Link>
          <Link href={r.grs}>GRS</Link>
          <Link href={r.downloads}>{t.downloads}</Link>
          <Link href={r.contact}>{t.contact}</Link>
        </nav>

        {/* 3. Strefa Architekta */}
        <Link href={r.architect} className="nav-architect-link">
          {t.architect}
        </Link>

        {/* 4. Lupa + Języki */}
        <div className="nav-tools">
          {/* Wyszukiwarka */}
          <div className={`nav-search ${isSearchOpen ? 'open' : ''}`} ref={searchContainerRef}>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Szukaj kolekcji..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              ref={searchInputRef}
            />
            <button className="nav-search-btn" onClick={handleSearchToggle} aria-label="Szukaj">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Język */}
          <div className="language-selector" ref={languageSelectorRef}>
            <button
              className="language-button"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            >
              {language}
              <span className={`language-arrow ${isLanguageMenuOpen ? 'open' : ''}`}></span>
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

      {/* Mobile Navigation Container */}
      <div className="nav-container-mobile mobile-nav-header">
        <Link href={r.home} className="logo">
          <img src="/logo/davis-fabrics-logo-RGB.svg" alt="Davis Fabrics" />
        </Link>

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
            <Link href={r.collections} onClick={() => setIsMobileMenuOpen(false)}>{t.collections}</Link>
            <Link href={r.trends} onClick={() => setIsMobileMenuOpen(false)}>{t.trends}</Link>
            <Link href={r.offer} onClick={() => setIsMobileMenuOpen(false)}>{t.offer}</Link>
            <Link href={r.about} onClick={() => setIsMobileMenuOpen(false)}>{t.about}</Link>
            <Link href={r.grs} onClick={() => setIsMobileMenuOpen(false)}>GRS</Link>
            <Link href={r.downloads} onClick={() => setIsMobileMenuOpen(false)}>{t.downloads}</Link>
            <Link href={r.contact} onClick={() => setIsMobileMenuOpen(false)}>{t.contact}</Link>
            <Link href={r.architect} onClick={() => setIsMobileMenuOpen(false)} className="mobile-architect-link">{t.architect}</Link>
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
