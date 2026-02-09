import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import CollectionCard from '../components/CollectionCard';
import { buildApiUrl } from '../utils/api';
import './Home.css';

function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;
  const [newCollections, setNewCollections] = useState([]);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: '/home/new-hero.png',
      text: 'Tkaniny\ndo pięknych\nprzestrzeni'
    },
    {
      image: '/home/new-hero.png',
      text: 'Tkaniny\ndo pięknych\nprzestrzeni'
    },
    {
      image: '/home/new-hero.png',
      text: 'Tkaniny\ndo pięknych\nprzestrzeni'
    }
  ];

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Trend section image carousel
  const [currentTrendImageSlide, setCurrentTrendImageSlide] = useState(0);
  const trendImages = [
    '/home/hero.jpg',
    '/home/hero.jpg',
    '/home/hero.jpg',
    '/home/hero.jpg',
    '/home/hero.jpg'
  ];

  const nextTrendImageSlide = () => {
    setCurrentTrendImageSlide((prev) => Math.min(prev + 1, trendImages.length - 1));
  };

  const prevTrendImageSlide = () => {
    setCurrentTrendImageSlide((prev) => Math.max(prev - 1, 0));
  };
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
      const response = await fetch(buildApiUrl('/v1/collections?page=1&per_page=100'));
      if (!response.ok) {
        throw new Error('Nie udało się pobrać kolekcji');
      }
      const data = await response.json();
      const collectionsArray = data.collections || [];
      // Filtruj tylko nowości
      const newOnly = collectionsArray.filter(collection => collection.new === true);
      const sortedCollections = newOnly.sort((a, b) => b.id - a.id);
      setNewCollections(sortedCollections);
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
      {/* Hero Section - Slider */}
      <section className="hero-slider">
        <div className="hero-slider-wrapper">
          <div className="hero-slides">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentHeroSlide ? 'active' : ''}`}
              >
                <img src={slide.image} alt="Davis Fabrics" className="hero-slide-image" />
                <div className="hero-slide-gradient"></div>
                <div className="hero-slide-content">
                  <h1 className="hero-slide-title">
                    {slide.text.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </h1>
                </div>
              </div>
            ))}
            <div className="hero-slider-controls">
              <button className="hero-slider-btn" onClick={prevHeroSlide} aria-label="Poprzedni slajd">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="hero-slider-btn" onClick={nextHeroSlide} aria-label="Następny slajd">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
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

      {/* Trends Section */}
      <section className="trends">
        <div className="trends-container">
          {/* Wiersz 1 */}
          <div className="trend-card trend-intro">
            <div>
              <h2 className="trend-intro-title">{t.trendsTitle}</h2>
              <p className="trend-intro-text">
                {t.trendsIntro}
              </p>
            </div>
            <Link to="/kolekcje" className="trend-button">
              {t.trendsCta}
            </Link>
          </div>

          <Link to="/kolekcje/rambo" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="RAMBO" />
            <div className="trend-name">RAMBO</div>
          </Link>

          <Link to="/kolekcje/gelato" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="GELATO" />
            <div className="trend-name">GELATO</div>
          </Link>

          {/* Wiersz 2 */}
          <Link to="/kolekcje/runo" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="RUNO" />
            <div className="trend-name">RUNO</div>
            <div className="trend-banner trend-banner-pink">HIGH DURABILITY</div>
          </Link>

          <Link to="/kolekcje/vela" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="VELA" />
            <div className="trend-name">VELA</div>
          </Link>

          <div className="trend-card trend-outro">
            <p className="trend-outro-text">
              {t.trendsOutro}
            </p>
          </div>

          {/* Wiersz 3 */}
          <div className="trend-card trend-empty"></div>

          <Link to="/kolekcje/pico" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="PICO" />
            <div className="trend-name">PICO</div>
            <div className="trend-banner trend-banner-blue">OUTDOOR</div>
          </Link>

          <Link to="/kolekcje/sunlight" className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="SUNLIGHT" />
            <div className="trend-name">SUNLIGHT</div>
            <div className="trend-banner trend-banner-blue">OUTDOOR</div>
          </Link>
        </div>
      </section>

      {/* Contract Collections Section */}
      <section className="new-collections">
        <div className="new-collections-container">
          <div className="new-collections-header">
            <h2 className="new-collections-title">KOLEKCJE KONTRAKTOWE</h2>
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

      {/* Trend Hero Section */}
      <section className="home-trend-hero">
        <div className="home-trend-hero-container">
          {/* Left Column - Text */}
          <div className="home-trend-hero-content">
            <h2 className="home-trend-title">USŁUGI DLA BIZNESU</h2>
            <ul className="home-trend-services-list">
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">01</span>
                <span className="home-trend-service-name">SZWALNIA I PRODUKCJA</span>
              </li>
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">02</span>
                <span className="home-trend-service-name">DRUKARNIA TKANIN</span>
              </li>
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">03</span>
                <span className="home-trend-service-name">PIKOWANIE</span>
              </li>
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">04</span>
                <span className="home-trend-service-name">DEDYKOWANE TECHNOLOGIE DODATKOWE</span>
              </li>
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">05</span>
                <span className="home-trend-service-name">BADANIE TKANIN - DAVIS LAB</span>
              </li>
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">06</span>
                <span className="home-trend-service-name">NARZĘDZIA MARKETINGOWE</span>
              </li>
              <li className="home-trend-service-item">
                <span className="home-trend-service-number">07</span>
                <span className="home-trend-service-name">STREFA ARCHITEKTA</span>
              </li>
            </ul>
          </div>

          {/* Right Column - Image Carousel */}
          <div className="home-trend-hero-images">
            <div className="home-trend-carousel">
              <div
                className="home-trend-carousel-track"
                style={{
                  transform: `translateX(-${currentTrendImageSlide * 392}px)`
                }}
              >
                {trendImages.map((image, index) => (
                  <div key={index} className="home-trend-carousel-item">
                    <img src={image} alt={`Trend ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="home-trend-image-controls">
              <button onClick={prevTrendImageSlide} className="home-trend-slider-btn" disabled={currentTrendImageSlide === 0}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={nextTrendImageSlide} className="home-trend-slider-btn" disabled={currentTrendImageSlide >= trendImages.length - 1}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trend Features Section */}
      <section className="home-trend-features">
        <div className="home-trend-features-container">
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" />
                <path d="M9 9L15 15M15 9L9 15" />
              </svg>
            </div>
            <p className="home-feature-text">Prostota i minimalistyczna forma jako fundament współczesnego designu</p>
          </div>
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" />
                <path d="M9 9L15 15M15 9L9 15" />
              </svg>
            </div>
            <p className="home-feature-text">Geometria jako podstawa struktury i estetyki</p>
          </div>
          <div className="home-feature-item">
            <div className="home-feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" />
                <path d="M9 9L15 15M15 9L9 15" />
              </svg>
            </div>
            <p className="home-feature-text">Stonowana paleta barw, która wprowadza harmonię oraz spokój</p>
          </div>
        </div>
        <div className="home-trend-features-button-wrapper">
          <Link to="/oferta" className="home-trend-button">
            Przejdź do usług
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
