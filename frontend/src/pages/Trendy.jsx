import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CollectionCard from '../components/CollectionCard';
import './Trendy.css';

function Trendy() {
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const [collections, setCollections] = useState([]);
  const [currentCollectionSlide, setCurrentCollectionSlide] = useState(0);
  const itemsPerSlide = 4;

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

  const cardWidth = 309;
  const gap = 16;
  const slideDistance = (cardWidth + gap) * itemsPerSlide;
  const totalSlides = Math.ceil(collections.length / itemsPerSlide);

  const nextCollectionSlide = () => {
    setCurrentCollectionSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevCollectionSlide = () => {
    setCurrentCollectionSlide((prev) => Math.max(prev - 1, 0));
  };

  const imageCardWidth = 380;
  const imageGap = 12;
  const imageSlideDistance = imageCardWidth + imageGap;

  const nextImageSlide = () => {
    setCurrentImageSlide((prev) => Math.min(prev + 1, trendImages.length - 1));
  };

  const prevImageSlide = () => {
    setCurrentImageSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
      <div className="trendy">
        {/* Hero Section - Two Columns */}
        <section className="trendy-hero">
          <div className="trendy-hero-container">
            {/* Left Column - 40% */}
            <div className="trendy-hero-content">
              <div className="trendy-date">1910 - 1980</div>
              <h1 className="trendy-title">Modernism</h1>
              <p className="trendy-description">
                Modernizm to styl, który celebruje prostotę i funkcjonalność, tworząc przestrzenie idealne dla miłośników współczesnego designu. Kolekcja "Modernism" łączy minimalistyczne wzory z neutralnymi, stonowanymi kolorami, tworząc tkaniny, które harmonijnie wpisują się w nowoczesne wnętrza.
                <br /><br />
                Każdy detal został zaprojektowany z myślą o estetyce i praktyczności, dzięki czemu ta linia jest odpowiedzią na potrzeby osób ceniących przestrzeń, światło i elegancję.
              </p>
              <Link to="/kolekcje" className="trendy-button">
                Zobacz kolekcje
              </Link>
            </div>

            {/* Right Column - 60% */}
            <div className="trendy-hero-images">
              <div className="trendy-carousel">
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
              <p className="feature-text">Prostota i minimalistyczna forma jako fundament współczesnego designu</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Geometria jako podstawa struktury i estetyki</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Stonowana paleta barw, która wprowadza harmonię oraz spokój</p>
            </div>
          </div>
        </section>

        {/* Collections Carousel Section - Modernism */}
        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">Produkty w stylu Modernism</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  PRZEJDŹ DO KOLEKCJI ↗
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
            <div className="carousel">
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
        <section className="trendy-hero">
          <div className="trendy-hero-container">
            <div className="trendy-hero-content">
              <div className="trendy-date">1960 - 1980</div>
              <h1 className="trendy-title">Boho</h1>
              <p className="trendy-description">
                Modernizm to styl, który celebruje prostotę i funkcjonalność, tworząc przestrzenie idealne dla miłośników współczesnego designu. Kolekcja "Modernism" łączy minimalistyczne wzory z neutralnymi, stonowanymi kolorami, tworząc tkaniny, które harmonijnie wpisują się w nowoczesne wnętrza.
                <br /><br />
                Każdy detal został zaprojektowany z myślą o estetyce i praktyczności, dzięki czemu ta linia jest odpowiedzią na potrzeby osób ceniących przestrzeń, światło i elegancję.
              </p>
              <Link to="/kolekcje" className="trendy-button">
                Zobacz kolekcje
              </Link>
            </div>
            <div className="trendy-hero-images">
              <div className="trendy-carousel">
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
              <p className="feature-text">Prostota i minimalistyczna forma jako fundament współczesnego designu</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Geometria jako podstawa struktury i estetyki</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Stonowana paleta barw, która wprowadza harmonię oraz spokój</p>
            </div>
          </div>
        </section>

        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">Produkty w stylu Boho</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  PRZEJDŹ DO KOLEKCJI ↗
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
            <div className="carousel">
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
        <section className="trendy-hero">
          <div className="trendy-hero-container">
            <div className="trendy-hero-content">
              <div className="trendy-date">1940 - 1970</div>
              <h1 className="trendy-title">Mid Century</h1>
              <p className="trendy-description">
                Modernizm to styl, który celebruje prostotę i funkcjonalność, tworząc przestrzenie idealne dla miłośników współczesnego designu. Kolekcja "Modernism" łączy minimalistyczne wzory z neutralnymi, stonowanymi kolorami, tworząc tkaniny, które harmonijnie wpisują się w nowoczesne wnętrza.
                <br /><br />
                Każdy detal został zaprojektowany z myślą o estetyce i praktyczności, dzięki czemu ta linia jest odpowiedzią na potrzeby osób ceniących przestrzeń, światło i elegancję.
              </p>
              <Link to="/kolekcje" className="trendy-button">
                Zobacz kolekcje
              </Link>
            </div>
            <div className="trendy-hero-images">
              <div className="trendy-carousel">
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
              <p className="feature-text">Prostota i minimalistyczna forma jako fundament współczesnego designu</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Geometria jako podstawa struktury i estetyki</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Stonowana paleta barw, która wprowadza harmonię oraz spokój</p>
            </div>
          </div>
        </section>

        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">Produkty w stylu Mid Century</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  PRZEJDŹ DO KOLEKCJI ↗
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
            <div className="carousel">
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
        <section className="trendy-hero">
          <div className="trendy-hero-container">
            <div className="trendy-hero-content">
              <div className="trendy-date">1880 - 1920</div>
              <h1 className="trendy-title">Classic Eclecticism</h1>
              <p className="trendy-description">
                Modernizm to styl, który celebruje prostotę i funkcjonalność, tworząc przestrzenie idealne dla miłośników współczesnego designu. Kolekcja "Modernism" łączy minimalistyczne wzory z neutralnymi, stonowanymi kolorami, tworząc tkaniny, które harmonijnie wpisują się w nowoczesne wnętrza.
                <br /><br />
                Każdy detal został zaprojektowany z myślą o estetyce i praktyczności, dzięki czemu ta linia jest odpowiedzią na potrzeby osób ceniących przestrzeń, światło i elegancję.
              </p>
              <Link to="/kolekcje" className="trendy-button">
                Zobacz kolekcje
              </Link>
            </div>
            <div className="trendy-hero-images">
              <div className="trendy-carousel">
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
              <p className="feature-text">Prostota i minimalistyczna forma jako fundament współczesnego designu</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Geometria jako podstawa struktury i estetyki</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" />
                  <path d="M9 9L15 15M15 9L9 15" />
                </svg>
              </div>
              <p className="feature-text">Stonowana paleta barw, która wprowadza harmonię oraz spokój</p>
            </div>
          </div>
        </section>

        <section className="trendy-collections">
          <div className="trendy-collections-container">
            <div className="trendy-collections-header">
              <h2 className="trendy-collections-title">Produkty w stylu Classic Eclecticism</h2>
              <div className="trendy-collections-controls">
                <Link to="/kolekcje" className="view-all-btn">
                  PRZEJDŹ DO KOLEKCJI ↗
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
            <div className="carousel">
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
