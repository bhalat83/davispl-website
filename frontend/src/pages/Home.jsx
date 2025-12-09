import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CollectionCard from '../components/CollectionCard';
import './Home.css';

function Home() {
  const [newCollections, setNewCollections] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;

  useEffect(() => {
    fetchNewCollections();
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

  const cardWidth = 309;
  const gap = 16;
  const slideDistance = (cardWidth + gap) * itemsPerSlide;
  const totalSlides = Math.ceil(newCollections.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
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
          <h1 className="hero-title">Odkryj piękno wnętrz</h1>
          <p className="hero-subtitle">
            Tworzymy tkaniny do pięknych przestrzeni i miejsc.<br></br> Tworzą je ludzie, dla ludzi.
          </p>
          <Link to="/kolekcje" className="hero-button">
            Przeglądaj kolekcje
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-container">
          <p className="about-text">
            W Davis Fabrics łączymy pasję do designu z odpowiedzialnością za środowisko, oferując innowacyjne rozwiązania, które harmonijnie wpisują się w potrzeby współczesnych wnętrz. Nasze materiały powstają z myślą o trwałości, estetyce i zrównoważonym rozwoju, aby każdy projekt mógł być nie tylko wyjątkowy, ale także przyjazny dla natury.
          </p>
        </div>
      </section>

      {/* New Collections Section */}
      <section className="new-collections">
        <div className="new-collections-container">
          <div className="new-collections-header">
            <h2 className="new-collections-title">Nowości</h2>
            <div className="new-collections-controls">
              <Link to="/kolekcje" className="view-all-btn">
                PRZEJDŹ DO KOLEKCJI ↗
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
          <div className="carousel">
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
              <h2 className="trend-intro-title">Trendy</h2>
              <p className="trend-intro-text">
                Od klasycznych po awangardowe wzory - znajdziesz tu wszystko, co definiuje współczesny design wnętrz.
              </p>
            </div>
            <Link to="/trendy" className="trend-button">
              Przeglądaj inspiracje
            </Link>
          </div>

          {/* Kafelki 2-5 - Zdjęcia z nazwami */}
          <div className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Modernism" />
            <div className="trend-name">Modernism</div>
          </div>

          <div className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Boho" />
            <div className="trend-name">Boho</div>
          </div>

          <div className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Mid Century" />
            <div className="trend-name">Mid Century</div>
          </div>

          <div className="trend-card trend-image">
            <img src="/home/hero.jpg" alt="Classic Eclecticism" />
            <div className="trend-name">Classic Eclecticism</div>
          </div>

          {/* Kafelek 6 - Tekst końcowy */}
          <div className="trend-card trend-outro">
            <p className="trend-outro-text">
              Poznaj aktualne kolekcje tkanin, inspiracje oraz trendy rynkowe, które pomogą Ci w wyborze idealnych materiałów do Twoich projektów.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
