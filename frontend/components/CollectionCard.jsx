'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRoutes } from '@/lib/routes';
import './CollectionCard.css';

function CollectionCard({ collection }) {
  const { language } = useLanguage();
  const r = getRoutes(language);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const videoUrl = collection.media?.video?.sizes?.['340x492'] ||
                   collection.media?.video?.video;
  const posterUrl = collection.media?.video?.thumb ||
                    collection.media?.image;

  const formatName = (name) => {
    if (!name) return '';
    const lowerName = name.toLowerCase();
    return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Załaduj wideo gdy zbliża się do viewportu
        if (entry.isIntersecting && !shouldLoad) {
          setShouldLoad(true);
        }

        // Play/pause
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
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

    observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [shouldLoad]);

  return (
    <Link href={r.collection(collection.name?.toLowerCase())} className="collection-card">
      <div className="collection-card__video">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={shouldLoad ? videoUrl : undefined}
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
          {collection.new && (
            <span className="collection-card__new-badge">Nowość</span>
          )}
          <h3>{formatName(collection.name)}</h3>
        </div>
      </div>
    </Link>
  );
}

export default CollectionCard;
