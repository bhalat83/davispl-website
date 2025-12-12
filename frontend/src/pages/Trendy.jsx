import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import CollectionCard from '../components/CollectionCard';
import './Trendy.css';

function Trendy() {
  const { language } = useLanguage();
  const t = translations[language].trends;
  const location = useLocation();
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const [collections, setCollections] = useState([]);
  const [currentCollectionSlide, setCurrentCollectionSlide] = useState(0);
  const [imageTouchStart, setImageTouchStart] = useState(0);
  const [imageTouchEnd, setImageTouchEnd] = useState(0);
  const [collectionTouchStart, setCollectionTouchStart] = useState(0);
  const [collectionTouchEnd, setCollectionTouchEnd] = useState(0);

  // Dynamically calculate items per slide based on screen width
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 4;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  // Placeholder images - replace with actual images
  const trendImages = [
    '/home/hero.jpg',
    '/home/hero.jpg',
    '/home/hero.jpg',
    '/home/hero.jpg',
    '/home/hero.jpg'
  ];

  useEffect(() => {
    fetchCollections();
  }, []);

  // Scroll to section based on hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/v1/collections?page=1&per_page=6');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać kolekcji');
      }
      const data = await response.json();
      const collectionsArray = data.collections || [];
      const sortedCollections = collectionsArray.sort((a, b) => b.id - a.id);
      setCollections(sortedCollections.slice(0, 6));
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 309;
    if (window.innerWidth <= 480) {
      return window.innerWidth * 0.6;
    }
    if (window.innerWidth <= 768) {
      return window.innerWidth * 0.5;
    }
    return 309;
  };

  const cardWidth = getCardWidth();
  const gap = 16;
  const slideDistance = (cardWidth + gap) * itemsPerSlide;
  const totalSlides = Math.ceil(collections.length / itemsPerSlide);

  const nextCollectionSlide = () => {
    setCurrentCollectionSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevCollectionSlide = () => {
    setCurrentCollectionSlide((prev) => Math.max(prev - 1, 0));
  };

  // Calculate image card width - images always slide one at a time
  const getImageCardWidth = () => {
    if (typeof window === 'undefined') return 380;
    if (window.innerWidth <= 1024) {
      // On mobile/tablet, use dynamic width
      return window.innerWidth * 0.8;
    }
    return 380;
  };

  const imageCardWidth = getImageCardWidth();
  const imageGap = 12;
  const imageSlideDistance = imageCardWidth + imageGap;

  const nextImageSlide = () => {
    setCurrentImageSlide((prev) => Math.min(prev + 1, trendImages.length - 1));
  };

  const prevImageSlide = () => {
    setCurrentImageSlide((prev) => Math.max(prev - 1, 0));
  };

  // Touch handlers for image carousel
  const handleImageTouchStart = (e) => {
    setImageTouchStart(e.targetTouches[0].clientX);
  };

  const handleImageTouchMove = (e) => {
    setImageTouchEnd(e.targetTouches[0].clientX);
  };

  const handleImageTouchEnd = () => {
    if (!imageTouchStart || !imageTouchEnd) return;

    const distance = imageTouchStart - imageTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageSlide < trendImages.length - 1) {
      nextImageSlide();
    }
    if (isRightSwipe && currentImageSlide > 0) {
      prevImageSlide();
    }

    setImageTouchStart(0);
    setImageTouchEnd(0);
  };

  // Touch handlers for collection carousel
  const handleCollectionTouchStart = (e) => {
    setCollectionTouchStart(e.targetTouches[0].clientX);
  };

  const handleCollectionTouchMove = (e) => {
    setCollectionTouchEnd(e.targetTouches[0].clientX);
  };

  const handleCollectionTouchEnd = () => {
    if (!collectionTouchStart || !collectionTouchEnd) return;

    const distance = collectionTouchStart - collectionTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentCollectionSlide < totalSlides - 1) {
      nextCollectionSlide();
    }
    if (isRightSwipe && currentCollectionSlide > 0) {
      prevCollectionSlide();
    }

    setCollectionTouchStart(0);
    setCollectionTouchEnd(0);
  };

  return (
      <div className="trendy">
        {/* Hero Section - Two Columns */}
        <section id="modernism" className="trendy-hero">
          <div className="trendy-hero-container">
            {/* Left Column - 40% */}
            <div className="trendy-hero-content">
              <div className="trendy-date">{t.modernismDate}</div>
              <h1 className="trendy-title">{t.modernismTitle}</h1>
              <p className="trendy-description">
                {t.modernismDescription}
              </p>
              <Link to="/kolekcje" className="trendy-button">
                {t.seeCollections}
              </Link>
            </div>

            {/* Right Column - 60% */}
            <div className="trendy-hero-images">
              <div
                className="trendy-carousel"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <div
                  className="trendy-carousel-track"
                  style={{
                    transform: `translateX(-${currentImageSlide * imageSlideDistance}px)`
                  }}
                >
                  {trendImages.map((image, index) => (
                    <div key={index} className="trendy-carousel-item">
                      <img src={image} alt={`Trend ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="trendy-image-controls">
                <button onClick={prevImageSlide} className="carousel-btn" disabled={currentImageSlide === 0}>←</button>
                <button onClick={nextImageSlide} className="carousel-btn" disabled={currentImageSlide >= trendImages.length - 1}>→</button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - 3 Columns */}
        <section className="trendy-features">
          <div className="trendy-features-container">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature1}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature2}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature3}</p>
            </div>
          </div>
        </section>

        {/* Collections Carousel Section - Modernism */}
        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">{t.productsInStyle} {t.modernismTitle}</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  {t.viewAllCollections}
                </Link>
                <div className="carousel-controls">
                  <button onClick={prevCollectionSlide} className="carousel-btn carousel-prev" disabled={currentCollectionSlide === 0}>
                    ←
                  </button>
                  <button onClick={nextCollectionSlide} className="carousel-btn carousel-next" disabled={currentCollectionSlide >= totalSlides - 1}>
                    →
                  </button>
                </div>
              </div>
            </div>
            <div
              className="carousel"
              onTouchStart={handleCollectionTouchStart}
              onTouchMove={handleCollectionTouchMove}
              onTouchEnd={handleCollectionTouchEnd}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentCollectionSlide * slideDistance}px)`
                }}
              >
                {collections.map((collection) => (
                  <div key={collection.id} className="carousel-item">
                    <CollectionCard collection={collection} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section - Boho */}
        <section id="boho" className="trendy-hero">
          <div className="trendy-hero-container">
            <div className="trendy-hero-content">
              <div className="trendy-date">{t.bohoDate}</div>
              <h1 className="trendy-title">{t.bohoTitle}</h1>
              <p className="trendy-description">
                {t.modernismDescription}
              </p>
              <Link to="/kolekcje" className="trendy-button">
                {t.seeCollections}
              </Link>
            </div>
            <div className="trendy-hero-images">
              <div
                className="trendy-carousel"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <div
                  className="trendy-carousel-track"
                  style={{
                    transform: `translateX(-${currentImageSlide * imageSlideDistance}px)`
                  }}
                >
                  {trendImages.map((image, index) => (
                    <div key={index} className="trendy-carousel-item">
                      <img src={image} alt={`Trend ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="trendy-image-controls">
                <button onClick={prevImageSlide} className="carousel-btn" disabled={currentImageSlide === 0}>←</button>
                <button onClick={nextImageSlide} className="carousel-btn" disabled={currentImageSlide >= trendImages.length - 1}>→</button>
              </div>
            </div>
          </div>
        </section>

        <section className="trendy-features">
          <div className="trendy-features-container">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature1}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature2}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature3}</p>
            </div>
          </div>
        </section>

        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">{t.productsInStyle} {t.bohoTitle}</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  {t.viewAllCollections}
                </Link>
                <div className="carousel-controls">
                  <button onClick={prevCollectionSlide} className="carousel-btn carousel-prev" disabled={currentCollectionSlide === 0}>
                    ←
                  </button>
                  <button onClick={nextCollectionSlide} className="carousel-btn carousel-next" disabled={currentCollectionSlide >= totalSlides - 1}>
                    →
                  </button>
                </div>
              </div>
            </div>
            <div
              className="carousel"
              onTouchStart={handleCollectionTouchStart}
              onTouchMove={handleCollectionTouchMove}
              onTouchEnd={handleCollectionTouchEnd}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentCollectionSlide * slideDistance}px)`
                }}
              >
                {collections.map((collection) => (
                  <div key={collection.id} className="carousel-item">
                    <CollectionCard collection={collection} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section - Mid Century */}
        <section id="mid-century" className="trendy-hero">
          <div className="trendy-hero-container">
            <div className="trendy-hero-content">
              <div className="trendy-date">{t.midCenturyDate}</div>
              <h1 className="trendy-title">{t.midCenturyTitle}</h1>
              <p className="trendy-description">
                {t.modernismDescription}
              </p>
              <Link to="/kolekcje" className="trendy-button">
                {t.seeCollections}
              </Link>
            </div>
            <div className="trendy-hero-images">
              <div
                className="trendy-carousel"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <div
                  className="trendy-carousel-track"
                  style={{
                    transform: `translateX(-${currentImageSlide * imageSlideDistance}px)`
                  }}
                >
                  {trendImages.map((image, index) => (
                    <div key={index} className="trendy-carousel-item">
                      <img src={image} alt={`Trend ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="trendy-image-controls">
                <button onClick={prevImageSlide} className="carousel-btn" disabled={currentImageSlide === 0}>←</button>
                <button onClick={nextImageSlide} className="carousel-btn" disabled={currentImageSlide >= trendImages.length - 1}>→</button>
              </div>
            </div>
          </div>
        </section>

        <section className="trendy-features">
          <div className="trendy-features-container">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature1}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature2}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature3}</p>
            </div>
          </div>
        </section>

        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">{t.productsInStyle} {t.midCenturyTitle}</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  {t.viewAllCollections}
                </Link>
                <div className="carousel-controls">
                  <button onClick={prevCollectionSlide} className="carousel-btn carousel-prev" disabled={currentCollectionSlide === 0}>
                    ←
                  </button>
                  <button onClick={nextCollectionSlide} className="carousel-btn carousel-next" disabled={currentCollectionSlide >= totalSlides - 1}>
                    →
                  </button>
                </div>
              </div>
            </div>
            <div
              className="carousel"
              onTouchStart={handleCollectionTouchStart}
              onTouchMove={handleCollectionTouchMove}
              onTouchEnd={handleCollectionTouchEnd}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentCollectionSlide * slideDistance}px)`
                }}
              >
                {collections.map((collection) => (
                  <div key={collection.id} className="carousel-item">
                    <CollectionCard collection={collection} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section - Classic Eclecticism */}
        <section id="classic-eclecticism" className="trendy-hero">
          <div className="trendy-hero-container">
            <div className="trendy-hero-content">
              <div className="trendy-date">{t.classicDate}</div>
              <h1 className="trendy-title">{t.classicTitle}</h1>
              <p className="trendy-description">
                {t.modernismDescription}
              </p>
              <Link to="/kolekcje" className="trendy-button">
                {t.seeCollections}
              </Link>
            </div>
            <div className="trendy-hero-images">
              <div
                className="trendy-carousel"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <div
                  className="trendy-carousel-track"
                  style={{
                    transform: `translateX(-${currentImageSlide * imageSlideDistance}px)`
                  }}
                >
                  {trendImages.map((image, index) => (
                    <div key={index} className="trendy-carousel-item">
                      <img src={image} alt={`Trend ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="trendy-image-controls">
                <button onClick={prevImageSlide} className="carousel-btn" disabled={currentImageSlide === 0}>←</button>
                <button onClick={nextImageSlide} className="carousel-btn" disabled={currentImageSlide >= trendImages.length - 1}>→</button>
              </div>
            </div>
          </div>
        </section>

        <section className="trendy-features">
          <div className="trendy-features-container">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature1}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature2}</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">{t.feature3}</p>
            </div>
          </div>
        </section>

        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">{t.productsInStyle} {t.classicTitle}</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  {t.viewAllCollections}
                </Link>
                <div className="carousel-controls">
                  <button onClick={prevCollectionSlide} className="carousel-btn carousel-prev" disabled={currentCollectionSlide === 0}>
                    ←
                  </button>
                  <button onClick={nextCollectionSlide} className="carousel-btn carousel-next" disabled={currentCollectionSlide >= totalSlides - 1}>
                    →
                  </button>
                </div>
              </div>
            </div>
            <div
              className="carousel"
              onTouchStart={handleCollectionTouchStart}
              onTouchMove={handleCollectionTouchMove}
              onTouchEnd={handleCollectionTouchEnd}
            >
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentCollectionSlide * slideDistance}px)`
                }}
              >
                {collections.map((collection) => (
                  <div key={collection.id} className="carousel-item">
                    <CollectionCard collection={collection} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}

export default Trendy;
