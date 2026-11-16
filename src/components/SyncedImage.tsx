import React, { useEffect, useRef, useState } from 'react';
import { getCachedMediaUrl, isMediaRef, resolveMediaUrl } from '../utils/syncService';

const DEFAULT_FALLBACK = '/assets/aistudio/Logo_THPT_Chuyen_Son_La_bf6a8e06.png';

interface SyncedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
}

export const SyncedImage: React.FC<SyncedImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  alt = '',
  onError,
  ...rest
}) => {
  const getSyncInitial = (source?: string): string => {
    if (!source) return fallbackSrc;
    if (!isMediaRef(source)) return source;
    return getCachedMediaUrl(source) || '';
  };

  const [resolvedSrc, setResolvedSrc] = useState<string>(() => getSyncInitial(src));
  const [isResolving, setIsResolving] = useState<boolean>(
    Boolean(src && isMediaRef(src) && !getCachedMediaUrl(src))
  );
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let active = true;
    if (imgRef.current) {
      delete imgRef.current.dataset.fallbackApplied;
    }

    if (!src) {
      setResolvedSrc(fallbackSrc);
      setIsResolving(false);
      return;
    }

    if (!isMediaRef(src)) {
      setResolvedSrc(src);
      setIsResolving(false);
      return;
    }

    const immediate = getCachedMediaUrl(src);
    if (immediate) {
      setResolvedSrc(immediate);
      setIsResolving(false);
      return;
    }

    setResolvedSrc('');
    setIsResolving(true);
    resolveMediaUrl(src)
      .then((url) => {
        if (active) {
          setResolvedSrc(url || fallbackSrc);
          setIsResolving(false);
        }
      })
      .catch(() => {
        if (active) {
          setResolvedSrc(fallbackSrc);
          setIsResolving(false);
        }
      });

    return () => {
      active = false;
    };
  }, [src, fallbackSrc]);

  if (isResolving && !resolvedSrc) {
    return (
      <div
        className={`animate-pulse bg-[#18291e] flex items-center justify-center ${className}`}
        aria-label={alt}
      >
        <span className="text-[10px] text-[#eccb76]/70 font-mono">Đang tải ảnh...</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      key={resolvedSrc || fallbackSrc}
      src={resolvedSrc || fallbackSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        const target = e.currentTarget;
        if (target.dataset.fallbackApplied !== '1') {
          target.dataset.fallbackApplied = '1';
          target.src = fallbackSrc;
        }
        if (onError) onError(e);
      }}
      {...rest}
    />
  );
};
