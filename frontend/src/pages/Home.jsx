import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import CollectionCard from '../components/CollectionCard';
import './Home.css';

function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;
  const [newCollections, setNewCollections] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Dynamically calculate items per slide based on screen width
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 4;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  useEffect(() => {
    fetchNewCollections();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNewCollections = async () => {
    try {
      const response = await fetch('/api/v1/collections?page=1&per_page=6');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać kolekcji');
      }
      const data = await response.json();
      const collectionsArray = data.collections || [];
      const sortedCollections = collectionsArray.sort((a, b) => b.id - a.id);
      setNewCollections(sortedCollections.slice(0, 6));
    } catch (err) {
      console.error('Error fetching new collections:', err);
    }
  };

  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (windowWidth <= 480) {
      // On mobile, carousel items are 60% width
      return windowWidth * 0.6;
    }
    if (windowWidth <= 768) {
      // On tablet, carousel items are 50% width
      return windowWidth * 0.5;
    }
    return 309;
  };

  const cardWidth = getCardWidth();
  const gap = 16;
  const slideDistance = (cardWidth + gap) * itemsPerSlide;
  const totalSlides = Math.ceil(newCollections.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image">
          {/* Placeholder for hero image - replace src with actual image path */}
          <img src="/home/hero.jpg" alt="Davis Fabrics" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">
            {t.heroSubtitle}
          </p>
          <Link to="/kolekcje" className="hero-button">
            {t.heroCta}
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-container">
          <p className="about-text">
            {t.aboutText}
          </p>
        </div>
      </section>

      {/* New Collections Section */}
      <section className="new-collections">
        <div className="new-collections-container">
          <div className="new-collections-header">
            <h2 className="new-collections-title">{t.newCollectionsTitle}</h2>
            <div className="new-collections-controls">
              <Link to="/kolekcje" className="view-all-btn">
                {t.viewAllCollections}
              </Link>
              <div className="carousel-controls">
                <button onClick={prevSlide} className="carousel-btn carousel-prev" disabled={currentSlide === 0}>
                  ←
                </button>
                <button onClick={nextSlide} className="carousel-btn carousel-next" disabled={currentSlide >= totalSlides - 1}>
                  →
                </button>
              </div>
            </div>
          </div>
          <div
            className="carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentSlide * slideDistance}px)`
              }}
            >
              {newCollections.map((collection) => (
                <div key={collection.id} className="carousel-item">
                  <CollectionCard collection={collection} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trends Section */}
      <section className="trends">
        <div className="trends-container">
          {/* Kafelek 1 - Intro */}
          <div className="trend-card trend-intro">
            <div>
              <h2 className="trend-intro-title">{t.trendsTitle}</h2>
              <p className="trend-intro-text">
                {t.trendsIntro}
              </p>
            </div>
            <Link to="/trendy" className="trend-button">
              {t.trendsCta}
            </Link>
          </div>

          {/* Kafelki 2-5 - Zdjęcia z nazwami */}
          <Link to="/trendy#modernism" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Modernism" />
            <div className="trend-name">Modernism</div>
          </Link>

          <Link to="/trendy#boho" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Boho" />
            <div className="trend-name">Boho</div>
          </Link>

          <Link to="/trendy#mid-century" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Mid Century" />
            <div className="trend-name">Mid Century</div>
          </Link>

          <Link to="/trendy#classic-eclecticism" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Classic Eclecticism" />
            <div className="trend-name">Classic Eclecticism</div>
          </Link>

          {/* Kafelek 6 - Tekst końcowy */}
          <div className="trend-card trend-outro">
            <p className="trend-outro-text">
              {t.trendsOutro}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
