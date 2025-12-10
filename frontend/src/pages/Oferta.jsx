import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import './Oferta.css';

function Oferta() {
  const { language } = useLanguage();
  const t = translations[language].offer;

  return (
    <div className="oferta">
      {/* Hero Section - Usługa pikowania */}
      <section className="oferta-hero">
        <div className="oferta-hero-container">
          {/* Left Column - 40% */}
          <div className="oferta-hero-content">
            <div className="oferta-subtitle">{t.weOffer}</div>
            <h1 className="oferta-title">{t.quiltingTitle}</h1>
            <p className="oferta-description">
              {t.quiltingDescription}
            </p>
            <ul className="oferta-list">
              <li>{t.quiltingFeature1}</li>
              <li>{t.quiltingFeature2}</li>
              <li>{t.quiltingFeature3}</li>
            </ul>
            <Link to="/kontakt" className="oferta-button">
              {t.askForOffer}
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
            <div className="oferta-subtitle">{t.weOffer}</div>
            <h1 className="oferta-title">{t.printsTitle}</h1>
            <p className="oferta-description">
              {t.printsDescription}
            </p>
            <ul className="oferta-list">
              <li>{t.printsFeature1}</li>
              <li>{t.printsFeature2}</li>
              <li>{t.printsFeature3}</li>
            </ul>
            <Link to="/kontakt" className="oferta-button">
              {t.askForOffer}
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section - Trzecia usługa */}
      <section className="oferta-hero">
        <div className="oferta-hero-container">
          {/* Left Column - 40% */}
          <div className="oferta-hero-content">
            <div className="oferta-subtitle">{t.distinguishYourBrand}</div>
            <h1 className="oferta-title">{t.marketingTitle}</h1>
            <p className="oferta-description">
              {t.marketingDescription}
            </p>
            <ul className="oferta-list">
              <li>{t.marketingFeature1}</li>
              <li>{t.marketingFeature2}</li>
              <li>{t.marketingFeature3}</li>
            </ul>
            <Link to="/kontakt" className="oferta-button">
              {t.askForOffer}
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
            {t.aboutText}
          </p>
        </div>
      </section>

      {/* Davis Home Section - Black Background */}
      <section className="oferta-davis-home">
        <div className="oferta-davis-home-wrapper">
          <div className="oferta-davis-home-container">
            {/* Left Column - 50% */}
            <div className="oferta-davis-home-content">
              <div className="oferta-davis-home-subtitle">{t.davisHomeSubtitle}</div>
              <h2 className="oferta-davis-home-title">{t.davisHomeTitle}</h2>
              <p className="oferta-davis-home-description">
                {t.davisHomeDescription}
              </p>
              <Link to="/kontakt" className="oferta-davis-home-button">
                {t.davisHomeCta}
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
              <div className="oferta-davis-home-subtitle">{t.davisHomeSubtitle}</div>
              <h2 className="oferta-davis-home-title">{t.davisHomeTitle}</h2>
              <p className="oferta-davis-home-description">
                {t.davisHomeDescription}
              </p>
              <Link to="/kontakt" className="oferta-davis-home-button">
                {t.davisHomeCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Oferta;
