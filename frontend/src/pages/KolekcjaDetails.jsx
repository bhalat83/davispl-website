import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './KolekcjaDetails.css';

function KolekcjaDetails() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    fetchCollectionDetails();
  }, [id]);

  const fetchCollectionDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/collections/${id}`);

      if (!response.ok) {
        throw new Error('Nie udało się pobrać szczegółów kolekcji');
      }

      const data = await response.json();
      // API zwraca {code, message, collection}
      setCollection(data.collection);

      // Ustaw domyślnie TYLKO POSTER - video załaduje się później
      const defaultPosterUrl = data.collection.media?.video?.thumb ||
                               data.collection.media?.image;

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

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleVariantHover = (variantImage) => {
    // Clear previous timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Debounce hover - wait 100ms before changing
    hoverTimeoutRef.current = setTimeout(() => {
      // Preload image before showing
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
    // Clear timeout on leave
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Wróć do video
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

  // Formatowanie nazwy: pierwsza litera wielka, reszta małe
  const formatName = (name) => {
    if (!name) return '';
    const lowerName = name.toLowerCase();
    return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
  };

  // Wyciągnij numer z nazwy wariantu (np. "Pico 04" -> "04")
  const getVariantNumber = (variantName) => {
    if (!variantName) return '';
    // Wyciągnij wszystkie cyfry z nazwy
    const match = variantName.match(/\d+/);
    return match ? match[0] : '';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="details-loading">Ładowanie...</div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="page">
        <div className="details-error">Błąd: {error || 'Nie znaleziono kolekcji'}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="collection-details">
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
          {/* Nazwa kolekcji */}
          <h1 className="details-title">{formatName(collection.name)}</h1>

          {/* Warianty kolorów */}
          {collection.variants && collection.variants.length > 0 && (
            <div className="details-variants">
              {collection.variants.slice(0, 16).map((variant, index) => (
                <div
                  key={variant.id}
                  className="variant-card"
                  onMouseEnter={() => handleVariantHover(variant.image)}
                  onMouseLeave={handleVariantLeave}
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
              ))}
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
                  <span>Specyfikacja produktu</span>
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
                  <span>Cechy produktu</span>
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
                <span>Pliki do pobrania</span>
                <span className="accordion-icon"></span>
              </button>
              {activeAccordion === 2 && (
                <div className="accordion-content">
                  {collection.pdf ? (
                    <a
                      href={collection.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      📄 Karta techniczna PDF
                    </a>
                  ) : (
                    <p>Brak dostępnych plików</p>
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
