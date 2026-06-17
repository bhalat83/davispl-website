'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import './ZrownowazonyRozwoj.css';

const tabSections = [
  {
    subtitle: 'Dbamy o środowisko',
    title: 'Materiał z recyklingu',
    description: 'Nasza linia materiałów z recyklingu to dowód na to, że innowacja i odpowiedzialność mogą iść w parze. W Davis Fabrics przekształcamy odpady w wartościowe tkaniny, które łączą trwałość, estetykę i troskę o środowisko.',
    points: [
      { number: '01', title: 'Ekologiczne surowce', description: '' },
      { number: '02', title: 'Certyfikaty', description: 'Nasze materiały z recyklingu posiadają certyfikaty potwierdzające ich ekologiczne pochodzenie, takie jak Global Recycled Standard (GRS).' },
    ],
  },
  {
    subtitle: 'Dbamy o środowisko',
    title: 'Zrównoważona produkcja',
    description: 'Nasza linia materiałów z recyklingu to dowód na to, że innowacja i odpowiedzialność mogą iść w parze. W Davis Fabrics przekształcamy odpady w wartościowe tkaniny, które łączą trwałość, estetykę i troskę o środowisko.',
    points: [
      { number: '01', title: 'Ekologiczne surowce', description: '' },
      { number: '02', title: 'Certyfikaty', description: 'Nasze materiały z recyklingu posiadają certyfikaty potwierdzające ich ekologiczne pochodzenie, takie jak Global Recycled Standard (GRS).' },
    ],
  },
  {
    subtitle: 'Dbamy o środowisko',
    title: 'Odpowiedzialne zakupy',
    description: 'Nasza linia materiałów z recyklingu to dowód na to, że innowacja i odpowiedzialność mogą iść w parze. W Davis Fabrics przekształcamy odpady w wartościowe tkaniny, które łączą trwałość, estetykę i troskę o środowisko.',
    points: [
      { number: '01', title: 'Ekologiczne surowce', description: '' },
      { number: '02', title: 'Certyfikaty', description: 'Nasze materiały z recyklingu posiadają certyfikaty potwierdzające ich ekologiczne pochodzenie, takie jak Global Recycled Standard (GRS).' },
    ],
  },
];

function ZrownowazonyRozwoj() {
  const { language } = useLanguage();
  const t = translations[language].sustainability;

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Materiał z recyklingu', 'Zrównoważona produkcja', 'Odpowiedzialne zakupy'];

  const infoImages = [
    '/zrownowazony/1.jpg',
    '/zrownowazony/1.jpg',
    '/zrownowazony/1.jpg',
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const imageCardWidth = 380;
  const imageGap = 12;
  const slideDistance = imageCardWidth + imageGap;

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, infoImages.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && currentSlide < infoImages.length - 1) nextSlide();
    if (distance < -50 && currentSlide > 0) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const section = tabSections[activeTab];

  return (
    <div className="sustainability">
      <section className="sustainability-hero">
        <div className="sustainability-hero__wrapper">
          <div className="sustainability-hero__inner">
            <img src="/zrownowazony/1.jpg" alt={t.title} className="sustainability-hero__image" />
            <div className="sustainability-hero__overlay">
              <div className="sustainability-hero__content">
                <h1 className="sustainability-hero__title">{t.title}</h1>
                <p className="sustainability-hero__description">{t.heroDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sustainability-quote">
        <div className="sustainability-quote__wrapper">
          <p className="sustainability-quote__text">{t.quoteText}</p>
        </div>
      </section>

      <section className="sustainability-pillars">
        <div className="sustainability-pillars__wrapper">
          {t.pillars.map((pillar, index) => (
            <div key={index} className={`sustainability-pillar sustainability-pillar--${index + 1}`}>
              <p className="sustainability-pillar__label">{pillar.label}</p>
              <div className="sustainability-pillar__bottom">
                <div className="sustainability-pillar__icon" dangerouslySetInnerHTML={{ __html: pillar.icon }} />
                <p className="sustainability-pillar__description">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sustainability-quote">
        <div className="sustainability-quote__wrapper">
          <p className="sustainability-quote__text">{t.quote2Text}</p>
        </div>
      </section>

      <div className="sustainability-tabs">
        <div className="sustainability-tabs__wrapper">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`sustainability-tabs__tab${activeTab === index ? ' sustainability-tabs__tab--active' : ''}`}
              onClick={() => { setActiveTab(index); setCurrentSlide(0); }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <section className="sustainability-info">
        <div className="sustainability-info__container">
          <div className="sustainability-info__content">
            <p className="sustainability-info__subtitle">{section.subtitle}</p>
            <h2 className="sustainability-info__title">{section.title}</h2>
            <p className="sustainability-info__description">{section.description}</p>

            <div className="sustainability-info__points">
              {section.points.map((point) => (
                <div key={point.number} className="sustainability-info__point">
                  <div className="sustainability-info__point-number">{point.number}</div>
                  <div className="sustainability-info__point-content">
                    <h3 className="sustainability-info__point-title">{point.title}</h3>
                    {point.description && (
                      <p className="sustainability-info__point-description">{point.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="sustainability-info__carousel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="sustainability-info__carousel-track"
              style={{ transform: `translateX(-${currentSlide * slideDistance}px)` }}
            >
              {infoImages.map((image, index) => (
                <div key={index} className="sustainability-info__carousel-item">
                  <img src={image} alt={`Zrównoważony rozwój ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sustainability-info__controls-row">
          <button onClick={prevSlide} className="carousel-btn" disabled={currentSlide === 0}>&larr;</button>
          <button onClick={nextSlide} className="carousel-btn" disabled={currentSlide >= infoImages.length - 1}>&rarr;</button>
        </div>
      </section>
    </div>
  );
}

export default ZrownowazonyRozwoj;
