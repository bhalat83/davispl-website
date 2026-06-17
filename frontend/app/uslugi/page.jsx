'use client';

import { useState, useEffect } from 'react';
import CollectionCard from '@/components/CollectionCard';
import { buildApiUrl } from '@/lib/api';
import './Uslugi.css';

const DESC = 'Kompleksowa realizacja od projektu po gotowy produkt. Kompleksowa realizacja od projektu po gotowy produkt. Kompleksowa realizacja od projektu po gotowy produkt.';

const SERVICES = [
  {
    num: '01',
    title: 'SZWALNIA I PRODUKCJA',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
  {
    num: '02',
    title: 'DRUKARNIA',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
  {
    num: '03',
    title: 'PIKOWANIE',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
  {
    num: '04',
    title: 'DEDYKOWANE TECHNOLOGIE DODATKOWE',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
  {
    num: '05',
    title: 'BADANIA TKANIN - DAVIS LAB',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
  {
    num: '06',
    title: 'NARZĘDZIA MARKETINGOWE',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
  {
    num: '07',
    title: 'STREFA ARCHITEKTA',
    desc: DESC,
    items: ['projektowanie i prototypy', 'szycie małoseryjne i seryjne', 'haft komputerowy', 'cięcie wielowarstwowe', 'wykończenia ultradźwiękowe', 'personalizowany branding (metki, opakowania)'],
  },
];

function Carousel({ collections }) {
  const [slide, setSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 4;
    };
    setItemsPerSlide(calc());
    const onResize = () => setItemsPerSlide(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cardWidth = 309;
  const gap = 16;
  const slideDistance = (cardWidth + gap) * itemsPerSlide;
  const totalSlides = Math.ceil(collections.length / itemsPerSlide);

  const prev = () => setSlide((p) => Math.max(p - 1, 0));
  const next = () => setSlide((p) => Math.min(p + 1, totalSlides - 1));

  return (
    <div className="uslugi-carousel-wrap">
      <div className="uslugi-carousel-header">
        <div className="carousel-controls">
          <button className="carousel-btn" onClick={prev} disabled={slide === 0}>&larr;</button>
          <button className="carousel-btn" onClick={next} disabled={slide >= totalSlides - 1}>&rarr;</button>
        </div>
      </div>
      <div
        className="carousel"
        style={{ marginLeft: '70px' }}
        onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
        onTouchEnd={() => {
          const dist = touchStart - touchEnd;
          if (dist > 50) next();
          if (dist < -50) prev();
          setTouchStart(0); setTouchEnd(0);
        }}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${slide * slideDistance}px)` }}>
          {collections.map((col) => (
            <div key={col.id} className="carousel-item">
              <CollectionCard collection={col} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccordionItem({ num, title, desc, items, defaultOpen, collections }) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <div className={`uslugi-accordion-item${open ? ' uslugi-accordion-item--open' : ''}`}>
      <button className="uslugi-accordion-header" onClick={() => setOpen((p) => !p)}>
        <div className="uslugi-accordion-heading">
          <span className="uslugi-service-num">{num}</span>
          <span className="uslugi-service-title">{title}</span>
        </div>
        <span className={`uslugi-accordion-chevron${open ? ' uslugi-accordion-chevron--open' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="uslugi-accordion-body">
          <div className="uslugi-accordion-top">
            <div className="uslugi-accordion-desc-col">
              <p className="uslugi-service-desc">{desc}</p>
            </div>
            <div className="uslugi-accordion-list-col">
              <ul className="uslugi-service-list">
                {items.map((item) => (
                  <li key={item} className="uslugi-service-item">
                    <span className="uslugi-service-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Carousel collections={collections} />
        </div>
      )}
    </div>
  );
}

function Uslugi() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch(buildApiUrl('/v1/collections?per_page=8'))
      .then((r) => r.json())
      .then((data) => {
        const sorted = (data.collections || []).sort((a, b) => b.id - a.id);
        setCollections(sorted.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page uslugi-page">
      <section className="uslugi-hero">
        <div className="uslugi-hero__image">
          <img src="/home/hero.jpg" alt="Usługi Davis Fabrics" />
        </div>
        <div className="uslugi-hero__content">
          <h1>TWORZYMY<br />TKANINY<br />DO PIĘKNYCH<br />PRZESTRZENI</h1>
          <p>
            Pomagamy ludziom, firmom,<br />
            studiom projektowym,<br />
            projektantom wnętrz<br />
            czy architektom - wyposażyć<br />
            projekt w tkaninę
          </p>
        </div>
      </section>

      <section className="uslugi-bg-section">
        <div className="uslugi-bg-section__left">
          <p>Szukamy optymalnych<br />i kompleksowych rozwiązań<br />we współpracy z naszymi<br />partnerami w branży meblowej.</p>
          <p>Mamy usługi dla profesjonalistów,<br />które uczynią Twoją realizację<br />uszytą na miarę<br />i wyjątkową.</p>
        </div>
        <div className="uslugi-bg-section__right">
          <p>Stawiamy na<br />trendy, design,<br />a przede wszystkim<br />na dobre relacje.</p>
        </div>
      </section>

      <section className="uslugi-service-section">
        <div className="uslugi-accordion">
          {SERVICES.map(({ num, title, desc, items }, idx) => (
            <AccordionItem
              key={num}
              num={num}
              title={title}
              desc={desc}
              items={items}
              defaultOpen={idx === 0}
              collections={collections}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Uslugi;
