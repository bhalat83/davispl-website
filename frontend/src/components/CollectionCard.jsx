import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './CollectionCard.css';

function CollectionCard({ collection }) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const videoUrl = collection.media?.video?.sizes?.['340x492'] ||
                   collection.media?.video?.video;
  const posterUrl = collection.media?.video?.thumb ||
                    collection.media?.image;

  // Formatowanie nazwy: pierwsza litera wielka, reszta małe
  const formatName = (name) => {
    if (!name) return '';
    const lowerName = name.toLowerCase();
    return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {
              // Ignore autoplay errors
            });
          } else {
            videoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <Link to={`/kolekcje/${collection.id}`} className="collection-card">
      <div className="collection-card__video">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            muted
            loop
            playsInline
            preload="none"
          />
        ) : posterUrl ? (
          <img src={posterUrl} alt={collection.name} loading="lazy" />
        ) : null}
        <div className="collection-card__name">
          <h3>{formatName(collection.name)}</h3>
        </div>
      </div>
    </Link>
  );
}

export default CollectionCard;
