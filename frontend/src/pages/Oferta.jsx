import { Link } from 'react-router-dom';
import './Oferta.css';

function Oferta() {
  return (
    <div className="oferta">
      {/* Hero Section - Usługa pikowania */}
      <section className="oferta-hero">
        <div className="oferta-hero-container">
          {/* Left Column - 40% */}
          <div className="oferta-hero-content">
            <div className="oferta-subtitle">Oferujemy</div>
            <h1 className="oferta-title">Usługę pikowania</h1>
            <p className="oferta-description">
              Nadaj swoim produktom wyjątkowy wygląd dzięki precyzyjnemu pikowaniu.
            </p>
            <ul className="oferta-list">
              <li>Tworzymy unikalne wzory, które dodają głębi i elegancji tkaninom.</li>
              <li>Oferujemy szeroki wybór technik i konfiguracji, dostosowanych do Twoich potrzeb.</li>
              <li>Gwarantujemy trwałość pikowania dzięki nowoczesnym maszynom i najwyższej jakości materiałom.</li>
            </ul>
            <Link to="/kontakt" className="oferta-button">
              Zapytaj o ofertę
            </Link>
          </div>

          {/* Right Column - 60% */}
          <div className="oferta-hero-image">
            <img src="/home/hero.jpg" alt="Usługa pikowania" />
          </div>
        </div>
      </section>

      {/* Hero Section - Druga usługa (odwrócone kolumny) */}
      <section className="oferta-hero">
        <div className="oferta-hero-container oferta-hero-reversed">
          {/* Left Column - 60% - Image */}
          <div className="oferta-hero-image">
            <img src="/home/hero.jpg" alt="Usługa pikowania" />
          </div>

          {/* Right Column - 40% - Content */}
          <div className="oferta-hero-content">
            <div className="oferta-subtitle">Oferujemy</div>
            <h1 className="oferta-title">Indywidualne printy</h1>
            <p className="oferta-description">
              Nadaj swoim produktom wyjątkowy wygląd dzięki precyzyjnemu pikowaniu.
            </p>
            <ul className="oferta-list">
              <li>Tworzymy unikalne wzory, które dodają głębi i elegancji tkaninom.</li>
              <li>Oferujemy szeroki wybór technik i konfiguracji, dostosowanych do Twoich potrzeb.</li>
              <li>Gwarantujemy trwałość pikowania dzięki nowoczesnym maszynom i najwyższej jakości materiałom.</li>
            </ul>
            <Link to="/kontakt" className="oferta-button">
              Zapytaj o ofertę
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section - Trzecia usługa */}
      <section className="oferta-hero">
        <div className="oferta-hero-container">
          {/* Left Column - 40% */}
          <div className="oferta-hero-content">
            <div className="oferta-subtitle">Wyróżnij swoją markę, dzięki</div>
            <h1 className="oferta-title">Usłudze marketingu</h1>
            <p className="oferta-description">
              Nadaj swoim produktom wyjątkowy wygląd dzięki precyzyjnemu pikowaniu.
            </p>
            <ul className="oferta-list">
              <li>Tworzymy unikalne wzory, które dodają głębi i elegancji tkaninom.</li>
              <li>Oferujemy szeroki wybór technik i konfiguracji, dostosowanych do Twoich potrzeb.</li>
              <li>Gwarantujemy trwałość pikowania dzięki nowoczesnym maszynom i najwyższej jakości materiałom.</li>
            </ul>
            <Link to="/kontakt" className="oferta-button">
              Zapytaj o ofertę
            </Link>
          </div>

          {/* Right Column - 60% */}
          <div className="oferta-hero-image">
            <img src="/home/hero.jpg" alt="Usługa pikowania" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="oferta-about">
        <div className="oferta-about-container">
          <p className="oferta-about-text">
            W Davis Fabrics łączymy pasję do designu z odpowiedzialnością za środowisko, oferując innowacyjne rozwiązania, które harmonijnie wpisują się w potrzeby współczesnych wnętrz. Nasze materiały powstają z myślą o trwałości, estetyce i zrównoważonym rozwoju, aby każdy projekt mógł być nie tylko wyjątkowy, ale także przyjazny dla natury.
          </p>
        </div>
      </section>

      {/* Davis Home Section - Black Background */}
      <section className="oferta-davis-home">
        <div className="oferta-davis-home-wrapper">
          <div className="oferta-davis-home-container">
            {/* Left Column - 50% */}
            <div className="oferta-davis-home-content">
              <div className="oferta-davis-home-subtitle">Davis Home</div>
              <h2 className="oferta-davis-home-title">Szwalnia</h2>
              <p className="oferta-davis-home-description">
                Davis Home to nasza dedykowana szwalnia, gdzie z pasją tworzymy wyjątkowe tekstylia domowe, takie jak poduszki dekoracyjne, narzuty oraz akcesoria dla dzieci i zwierząt domowych.
                <br /><br />
                Każdy produkt powstaje z dbałością o najdrobniejsze detale, łącząc funkcjonalność z estetyką, aby wprowadzić do Twojego domu ciepło i styl. Nasze kolekcje są inspirowane najnowszymi trendami w designie, dzięki czemu komponują się z różnorodnymi aranżacjami wnętrz.
              </p>
              <Link to="/kontakt" className="oferta-davis-home-button">
                Poznaj Davis Home
              </Link>
            </div>

            {/* Right Column - 50% */}
            <div className="oferta-davis-home-image">
              <img src="/home/hero.jpg" alt="Davis Home Szwalnia" />
            </div>
          </div>
        </div>
      </section>

      {/* Davis Home Section - Gray Background - Reversed */}
      <section className="oferta-davis-home oferta-davis-home-reversed">
        <div className="oferta-davis-home-wrapper">
          <div className="oferta-davis-home-container">
            {/* Left Column - 50% - Image */}
            <div className="oferta-davis-home-image">
              <img src="/home/hero.jpg" alt="Davis Home Szwalnia" />
            </div>

            {/* Right Column - 50% - Content */}
            <div className="oferta-davis-home-content">
              <div className="oferta-davis-home-subtitle">Davis Home</div>
              <h2 className="oferta-davis-home-title">Szwalnia</h2>
              <p className="oferta-davis-home-description">
                Davis Home to nasza dedykowana szwalnia, gdzie z pasją tworzymy wyjątkowe tekstylia domowe, takie jak poduszki dekoracyjne, narzuty oraz akcesoria dla dzieci i zwierząt domowych.
                <br /><br />
                Każdy produkt powstaje z dbałością o najdrobniejsze detale, łącząc funkcjonalność z estetyką, aby wprowadzić do Twojego domu ciepło i styl. Nasze kolekcje są inspirowane najnowszymi trendami w designie, dzięki czemu komponują się z różnorodnymi aranżacjami wnętrz.
              </p>
              <Link to="/kontakt" className="oferta-davis-home-button">
                Poznaj Davis Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Oferta;
