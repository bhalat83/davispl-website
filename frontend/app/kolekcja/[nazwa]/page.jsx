'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { buildApiUrl } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import './KolekcjaDetails.css';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function KolekcjaDetails({ params }) {
  const { nazwa } = use(params);
  const { language } = useLanguage();
  const t = translations[language].collectionDetail;
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    fetchCollectionDetails();
  }, [nazwa]);

  const fetchCollectionDetails = async () => {
    try {
      setLoading(true);
      const nameSlug = nazwa.replace(/-2$/, '').toLowerCase();
      const response = await fetch(buildApiUrl(`/v1/collections?per_page=1000`));

      if (!response.ok) {
        throw new Error('Nie udało się pobrać szczegółów kolekcji');
      }

      const data = await response.json();
      const collection = (data.collections || []).find(
        (c) => c.name?.toLowerCase() === nameSlug
      );
      if (!collection) throw new Error('Nie znaleziono kolekcji');
      setCollection(collection);

      // Ustaw domyślnie TYLKO POSTER - video załaduje się później
      const defaultPosterUrl = collection.media?.video?.thumb ||
                               collection.media?.image;

      setCurrentMedia({
        type: 'poster',
        url: defaultPosterUrl
      });

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collection details:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImagePackage = useCallback(async () => {
    if (!collection?.variants?.length || downloadingZip) return;
    setDownloadingZip(true);
    try {
      const files = collection.variants
        .filter((v) => v.image)
        .map((v) => {
          const ext = v.image.split('.').pop()?.split('?')[0] || 'jpg';
          return { name: `${collection.name} - ${v.name}.${ext}`, url: v.image };
        });
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${collection.name?.toLowerCase()}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloadingZip(false);
    }
  }, [collection, downloadingZip]);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleVariantHover = (variantImage) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      const img = new Image();
      img.src = variantImage;
      img.onload = () => {
        setCurrentMedia({
          type: 'image',
          url: variantImage
        });
      };
    }, 100);
  };

  const handleVariantLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const videoUrl = collection.media?.video?.sizes?.['360x360'] ||
                     collection.media?.video?.sizes?.['662x662'] ||
                     collection.media?.video?.video;
    const posterUrl = collection.media?.video?.thumb ||
                      collection.media?.image;

    setCurrentMedia({
      type: 'video',
      url: videoUrl,
      poster: posterUrl
    });
  };

  const formatName = (name) => {
    if (!name) return '';
    const lowerName = name.toLowerCase();
    return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
  };

  const getVariantNumber = (variantName) => {
    if (!variantName) return '';
    const match = variantName.match(/\d+/);
    return match ? match[0] : '';
  };

  if (loading || (!collection && !error)) {
    return (
      <div className="page">
        <div className="details-loading">{t.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="details-error">Błąd: {error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="collection-details">
        {/* Nazwa kolekcji - pokazuje się nad filmem na mobile */}
        <div className="details-title-container">
          {collection.new && (
            <span className="details-new-badge">{t.isNew}</span>
          )}
          <h1 className="details-title">{formatName(collection.name)}</h1>
        </div>

        {/* Lewa kolumna - Video/Obraz */}
        <div className="details-video">
          {currentMedia && currentMedia.type === 'video' ? (
            <video
              key="collection-video"
              src={currentMedia.url}
              poster={currentMedia.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
          ) : currentMedia && (currentMedia.type === 'image' || currentMedia.type === 'poster') ? (
            <img
              src={currentMedia.url}
              alt={collection.name}
            />
          ) : null}
        </div>

        {/* Prawa kolumna - Dane */}
        <div className="details-content">

          {/* Warianty kolorów */}
          {collection.variants && collection.variants.length > 0 && (
            <div className="details-variants" onMouseLeave={handleVariantLeave}>
              {[...collection.variants]
                .sort((a, b) => {
                  const numA = parseInt(getVariantNumber(a.name)) || 0;
                  const numB = parseInt(getVariantNumber(b.name)) || 0;
                  return numA - numB;
                })
                .map((variant, index) => (
                  <div
                    key={variant.id}
                    className="variant-card"
                    onMouseEnter={() => handleVariantHover(variant.image)}
                  >
                    <img
                      src={variant.image}
                      alt={variant.name}
                      loading={index < 4 ? "eager" : "lazy"}
                      onLoad={(e) => e.target.classList.add('loaded')}
                      decoding="async"
                    />
                    <span className="variant-number">{getVariantNumber(variant.name)}</span>
                  </div>
                ))
              }
            </div>
          )}

          {/* Akordeony */}
          <div className="details-accordions">
            {/* Akordeon 1: Specyfikacja produktu */}
            {collection.attributes && collection.attributes.length > 0 && (
              <div className="accordion">
                <button
                  className={`accordion-header ${activeAccordion === 0 ? 'active' : ''}`}
                  onClick={() => toggleAccordion(0)}
                >
                  <span>{t.specification}</span>
                  <span className="accordion-icon"></span>
                </button>
                {activeAccordion === 0 && (
                  <div className="accordion-content">
                    {collection.attributes.map((attr, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{attr.name}</span>
                        <span className="spec-value">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Akordeon 2: Cechy produktu */}
            {collection.parameters && collection.parameters.length > 0 && (
              <div className="accordion">
                <button
                  className={`accordion-header ${activeAccordion === 1 ? 'active' : ''}`}
                  onClick={() => toggleAccordion(1)}
                >
                  <span>{t.features}</span>
                  <span className="accordion-icon"></span>
                </button>
                {activeAccordion === 1 && (
                  <div className="accordion-content">
                    {collection.parameters.map((param, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{param.name}</span>
                        <span className="spec-value">{param.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Akordeon 3: Pliki do pobrania */}
            <div className="accordion">
              <button
                className={`accordion-header ${activeAccordion === 2 ? 'active' : ''}`}
                onClick={() => toggleAccordion(2)}
              >
                <span>{t.downloads}</span>
                <span className="accordion-icon"></span>
              </button>
              {activeAccordion === 2 && (
                <div className="accordion-content">
                  {collection.pdf && (
                    <a
                      href={collection.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      {t.technicalSheet}
                      <DownloadIcon />
                    </a>
                  )}
                  {collection.variants?.length > 0 && (
                    <button
                      onClick={downloadImagePackage}
                      className="download-link"
                      disabled={downloadingZip}
                    >
                      {downloadingZip ? '...' : t.imagePackage}
                      <DownloadIcon />
                    </button>
                  )}
                  {!collection.pdf && !collection.variants?.length && (
                    <p>{t.noFiles}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KolekcjaDetails;
