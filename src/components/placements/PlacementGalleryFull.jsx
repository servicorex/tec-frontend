import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import {
  PLACEMENT_GALLERY_BY_YEAR,
  ALL_PLACEMENT_PHOTOS,
  PLACEMENT_YEAR_TABS
} from '../../data/placementGalleryData';

export default function PlacementGalleryFull() {
  const featuredViewerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [customFeaturedPhoto, setCustomFeaturedPhoto] = useState(null);

  // Photos to display for the currently active tab
  const activePhotos = useMemo(() => {
    if (activeTab === 'all') {
      return ALL_PLACEMENT_PHOTOS;
    }
    const yearGroup = PLACEMENT_GALLERY_BY_YEAR.find((y) => y.year === activeTab);
    return yearGroup ? yearGroup.photos : ALL_PLACEMENT_PHOTOS;
  }, [activeTab]);

  // Current photo displayed in the featured viewer
  const currentPhoto = customFeaturedPhoto || activePhotos[currentPhotoIdx] || activePhotos[0] || ALL_PLACEMENT_PHOTOS[0];

  // Auto-advance featured photo every 6 seconds when not paused
  useEffect(() => {
    if (isAutoPlayPaused || activePhotos.length <= 1) return;
    const timer = setInterval(() => {
      setCustomFeaturedPhoto(null);
      setCurrentPhotoIdx((prev) => (prev + 1) % activePhotos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activePhotos.length, isAutoPlayPaused]);

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCustomFeaturedPhoto(null);
    setCurrentPhotoIdx(0);
  };

  const handlePrevPhoto = () => {
    setCustomFeaturedPhoto(null);
    setCurrentPhotoIdx((prev) => (prev - 1 + activePhotos.length) % activePhotos.length);
  };

  const handleNextPhoto = () => {
    setCustomFeaturedPhoto(null);
    setCurrentPhotoIdx((prev) => (prev + 1) % activePhotos.length);
  };

  const handleSelectPhoto = (photo, indexInList) => {
    setCustomFeaturedPhoto(photo);
    if (typeof indexInList === 'number' && indexInList >= 0) {
      setCurrentPhotoIdx(indexInList);
    }
    // Smooth scroll to featured viewer if out of view
    if (featuredViewerRef.current) {
      const rect = featuredViewerRef.current.getBoundingClientRect();
      if (rect.top < -80 || rect.bottom > window.innerHeight + 150) {
        featuredViewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div
      id="tec-placement-gallery-full"
      style={{
        backgroundColor: '#07162c',
        border: '1px solid #1c355e',
        borderRadius: '16px',
        padding: 'clamp(1.25rem, 2.5vw, 2.25rem)',
        color: '#ffffff',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.45)'
      }}
    >
      {/* Top Gallery Header & Navigation Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '1px solid #1c355e',
          paddingBottom: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            <Sparkles size={13} style={{ color: '#f59e0b' }} />
            <span>CAMPUS DRIVES ARCHIVE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.85rem)', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
            Placement Photographs & Campus Drives
          </h2>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Verified institutional campus recruitment photo record • <strong>215 photographs</strong> across 7 academic sessions (2018–19 to 2024–25)
          </p>
        </div>

        {/* Previous / Next Controls for Featured Photo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, backgroundColor: '#08172e', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #1c355e' }}>
            Photograph {currentPhotoIdx + 1} of {activePhotos.length}
          </span>
          <button 
            onClick={handlePrevPhoto}
            className="tec-full-gallery-nav-btn"
            aria-label="Previous Photograph"
            title="Previous Photograph"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNextPhoto}
            className="tec-full-gallery-nav-btn"
            aria-label="Next Photograph"
            title="Next Photograph"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Featured Photograph Viewer */}
      <div 
        ref={featuredViewerRef}
        onMouseEnter={() => setIsAutoPlayPaused(true)}
        onMouseLeave={() => setIsAutoPlayPaused(false)}
        style={{
          backgroundColor: '#08172e',
          border: '1.5px solid #1c355e',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
          marginBottom: '2.5rem'
        }}
      >
        {/* Main Stage with Aspect-Ratio Containment */}
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: 'clamp(300px, 42vw, 500px)', 
            backgroundColor: '#040d1a', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {currentPhoto && (
            <img
              key={currentPhoto.id || currentPhoto.src}
              src={currentPhoto.src}
              alt={currentPhoto.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'opacity 0.25s ease'
              }}
              onError={(e) => { 
                e.currentTarget.src = '/college_assets/placement_gallery/2024-25/congnizant.jpg'; 
              }}
            />
          )}

          {/* Gradient Banner with Title and Academic Year */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              insetInline: 0,
              background: 'linear-gradient(to top, rgba(4, 13, 26, 0.95) 0%, rgba(4, 13, 26, 0.7) 60%, transparent 100%)',
              padding: '1.5rem 1.25rem 0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.65rem'
            }}
          >
            <div>
              <div style={{ display: 'inline-block', fontSize: '0.74rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                {currentPhoto?.yearLabel || `Academic Year ${currentPhoto?.year}`}
              </div>
              <h3 style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {currentPhoto?.title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.76rem', backgroundColor: '#0e2154', border: '1px solid #1c355e', color: '#cbd5e1', padding: '0.3rem 0.75rem', borderRadius: '6px', fontWeight: 700 }}>
                {currentPhoto?.company || 'Campus Recruitment Drive'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Interactive Thumbnail Strip */}
        <div 
          style={{
            backgroundColor: '#040d1a',
            borderTop: '1px solid #1c355e',
            padding: '0.75rem 0.85rem'
          }}
        >
          <div
            className="tec-gallery-full-thumbs"
            style={{
              display: 'flex',
              gap: '0.55rem',
              overflowX: 'auto',
              paddingBottom: '0.35rem',
              scrollbarWidth: 'thin'
            }}
          >
            {activePhotos.map((photo, idx) => {
              const isSelected = currentPhoto?.src === photo.src;
              return (
                <button
                  key={photo.id}
                  onClick={() => handleSelectPhoto(photo, idx)}
                  style={{
                    width: '74px',
                    height: '50px',
                    flexShrink: 0,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: isSelected ? '2.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                    padding: 0,
                    backgroundColor: '#08172e',
                    cursor: 'pointer',
                    opacity: isSelected ? 1 : 0.6,
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  title={`${photo.title} (${photo.year})`}
                >
                  <img 
                    src={photo.src} 
                    alt={photo.title} 
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/college_assets/placement_gallery/2024-25/congnizant.jpg'; }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Academic Year Filter Tabs & Controls */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid #1c355e',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ACADEMIC SESSION ARCHIVES
          </span>
          <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
            Filter by Academic Year
          </h3>
        </div>

        {/* Scrollable Filter Tabs */}
        <div 
          className="tec-gallery-full-tabs"
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.35rem',
            scrollbarWidth: 'thin'
          }}
        >
          {PLACEMENT_YEAR_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  backgroundColor: isActive ? '#f59e0b' : '#0e2154',
                  color: isActive ? '#071739' : '#cbd5e1',
                  border: isActive ? '1px solid #f59e0b' : '1px solid #1c355e',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    backgroundColor: isActive ? 'rgba(7, 23, 57, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                    padding: '0.05rem 0.4rem',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vertically Browsable Photograph Grid */}
      {activeTab === 'all' ? (
        /* When "All Years" is active: Grouped year-by-year */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {PLACEMENT_GALLERY_BY_YEAR.map((yearGroup) => (
            <div key={yearGroup.year} className="tec-year-gallery-section">
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  marginBottom: '1rem',
                  borderLeft: '4px solid #f59e0b',
                  paddingLeft: '0.75rem'
                }}
              >
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {yearGroup.yearLabel}
                </h4>
                <span 
                  style={{
                    backgroundColor: '#0e2154',
                    border: '1px solid #1c355e',
                    color: '#fbbf24',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 800
                  }}
                >
                  {yearGroup.count} Campus Drives
                </span>
              </div>

              {/* Responsive Grid */}
              <div className="tec-full-gallery-grid">
                {yearGroup.photos.map((photo) => {
                  const globalIdx = ALL_PLACEMENT_PHOTOS.findIndex(p => p.id === photo.id);
                  const isFeatured = currentPhoto?.src === photo.src;
                  return (
                    <div
                      key={photo.id}
                      onClick={() => handleSelectPhoto(photo, globalIdx)}
                      className={`tec-full-gallery-card ${isFeatured ? 'is-active-featured' : ''}`}
                      title={`Click to preview ${photo.title} (${photo.year})`}
                    >
                      <div className="tec-full-card-img-wrap">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = '/college_assets/placement_gallery/2024-25/congnizant.jpg'; }}
                        />
                        {isFeatured && (
                          <div className="tec-full-card-active-badge">
                            <CheckCircle2 size={12} />
                            <span>Currently Featured</span>
                          </div>
                        )}
                      </div>
                      <div className="tec-full-card-caption">
                        <div className="tec-full-card-title">
                          {photo.title}
                        </div>
                        <div className="tec-full-card-meta">
                          <span>{photo.year}</span>
                          <span style={{ color: '#fbbf24' }}>View Drive →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* When a single year is selected */
        <div className="tec-full-gallery-grid">
          {activePhotos.map((photo, idx) => {
            const isFeatured = currentPhoto?.src === photo.src;
            return (
              <div
                key={photo.id}
                onClick={() => handleSelectPhoto(photo, idx)}
                className={`tec-full-gallery-card ${isFeatured ? 'is-active-featured' : ''}`}
                title={`Click to preview ${photo.title} (${photo.year})`}
              >
                <div className="tec-full-card-img-wrap">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/college_assets/placement_gallery/2024-25/congnizant.jpg'; }}
                  />
                  {isFeatured && (
                    <div className="tec-full-card-active-badge">
                      <CheckCircle2 size={12} />
                      <span>Currently Featured</span>
                    </div>
                  )}
                </div>
                <div className="tec-full-card-caption">
                  <div className="tec-full-card-title">
                    {photo.title}
                  </div>
                  <div className="tec-full-card-meta">
                    <span>{photo.year}</span>
                    <span style={{ color: '#fbbf24' }}>View Drive →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Component Specific Styles */}
      <style>{`
        .tec-full-gallery-nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: #0e2154;
          border: 1px solid #1c355e;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tec-full-gallery-nav-btn:hover {
          background-color: #f59e0b;
          color: #071739;
          border-color: #f59e0b;
        }

        .tec-full-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.15rem;
        }

        .tec-full-gallery-card {
          border-radius: 10px;
          overflow: hidden;
          background-color: #08172e;
          border: 1px solid #1c355e;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        .tec-full-gallery-card:hover {
          transform: translateY(-3px);
          border-color: #f59e0b !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
        }
        .tec-full-gallery-card.is-active-featured {
          border: 2px solid #f59e0b !important;
          background-color: #0e2154;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
        }

        .tec-full-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background-color: #040d1a;
          overflow: hidden;
        }
        .tec-full-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .tec-full-gallery-card:hover .tec-full-card-img-wrap img {
          transform: scale(1.05);
        }

        .tec-full-card-active-badge {
          position: absolute;
          top: 0.45rem;
          right: 0.45rem;
          background-color: #f59e0b;
          color: #071739;
          font-size: 0.64rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .tec-full-card-caption {
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1;
          justifyContent: space-between;
        }

        .tec-full-card-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tec-full-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }

        @media (max-width: 1100px) {
          .tec-full-gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tec-full-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .tec-full-gallery-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

