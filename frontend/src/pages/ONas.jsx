import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import './ONas.css';

function ONas() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <div className="onas">
      {/* Hero Section */}
      <section className="onas-hero">
        <div className="onas-hero-container">
          <div className="onas-hero-content">
            <h1 className="onas-title">{t.title}</h1>
            <p className="onas-description">{t.description}</p>

            <div className="onas-points">
              <div className="onas-point">
                <div className="onas-point-number">01</div>
                <div className="onas-point-content">
                  <h3 className="onas-point-title">{t.quality.title}</h3>
                  <p className="onas-point-description">{t.quality.description}</p>
                </div>
              </div>

              <div className="onas-point">
                <div className="onas-point-number">02</div>
                <div className="onas-point-content">
                  <h3 className="onas-point-title">{t.experience.title}</h3>
                </div>
              </div>

              <div className="onas-point">
                <div className="onas-point-number">03</div>
                <div className="onas-point-content">
                  <h3 className="onas-point-title">{t.expansion.title}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="onas-hero-image">
            <img src="/home/hero.jpg" alt={t.title} />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="onas-timeline">
        <div className="onas-timeline-container">
          <div className="timeline-line"></div>

          {t.timeline.map((item, index) => (
            <div
              key={index}
              className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
            >
              <div className="timeline-content">
                <div className="timeline-date">{item.date}</div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>
              </div>
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                <div className="timeline-connector"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Text Section */}
      <section className="onas-about-section">
        <div className="onas-about-section-container">
          <p className="onas-about-section-text">
            {t.aboutText}
          </p>
        </div>
      </section>
    </div>
  );
}

export default ONas;
