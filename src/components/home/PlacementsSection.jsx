import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SHOWCASE_LATEST_PHOTOS_20 } from '../../data/placementGalleryData';

// Verified college placement data: latest three available academic years
const LATEST_PLACEMENT_STATS = [
  { year: '2023–2024', count: 885, label: 'Verified Selections', highlight: '35+ Tier-1 & Core Recruiters' },
  { year: '2024–2025', count: 891, label: 'Verified Selections', highlight: 'Cognizant, Infosys & Alldigi' },
  { year: '2025–2026', count: 910, label: 'Active Placement Season', highlight: 'Ongoing Campus Recruitment Drives' }
];

// Verified prominent recruiting companies from official TEC records
const TOP_RECRUITERS = [
  { name: 'Cognizant (CTS)', package: '4.00 – 6.75 LPA', type: 'MNC' },
  { name: 'Tata Consultancy Services', package: '3.36 – 7.00 LPA', type: 'MNC' },
  { name: 'Infosys Limited', package: '3.60 – 6.50 LPA', type: 'MNC' },
  { name: 'Wipro Technologies', package: '3.50 – 6.50 LPA', type: 'MNC' },
  { name: 'HCL Technologies', package: '3.65 – 4.25 LPA', type: 'MNC' },
  { name: 'Tech Mahindra', package: '3.25 – 5.50 LPA', type: 'MNC' },
  { name: 'Delphi TVS', package: '2.40 – 3.20 LPA', type: 'Core' },
  { name: 'Mphasis', package: '3.50 – 4.50 LPA', type: 'IT' },
  { name: 'Hexaware / KPIT', package: '4.00 – 6.00 LPA', type: 'Core/IT' },
  { name: 'Alldigi Tech', package: '2.40 LPA', type: 'Core' },
  { name: 'Allsec Technologies', package: '2.40 LPA', type: 'IT' },
  { name: 'Movidu Technologies', package: '4.00 LPA', type: 'Product' }
];

export default function PlacementsSection() {
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState(() => LATEST_PLACEMENT_STATS.map(() => 0));
  const isVisibleRef = useRef(false);
  const rafIdRef = useRef(null);
  const [isScrollPaused, setIsScrollPaused] = useState(false);

  // Animated counters for the 3 latest academic years
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const startAnimation = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (prefersReducedMotion) {
        setCounts(LATEST_PLACEMENT_STATS.map(item => item.count));
        return;
      }

      const duration = 1600;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        if (progress < 1) {
          setCounts(
            LATEST_PLACEMENT_STATS.map(item => Math.min(item.count, Math.round(item.count * ease)))
          );
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          setCounts(LATEST_PLACEMENT_STATS.map(item => item.count));
          rafIdRef.current = null;
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            startAnimation();
          }
        } else {
          if (isVisibleRef.current) {
            isVisibleRef.current = false;
            if (rafIdRef.current) {
              cancelAnimationFrame(rafIdRef.current);
              rafIdRef.current = null;
            }
            setCounts(LATEST_PLACEMENT_STATS.map(() => 0));
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="placements-section"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#0a1d37',
        borderTop: '1px solid #142847',
        color: '#ffffff',
        overflow: 'hidden'
      }}
      aria-label="Campus Placements Statistics and Drives"
    >
      {/* Main Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: 'clamp(2.5rem, 4.5vw, 4rem)',
          paddingBottom: 'clamp(3rem, 5vw, 4.5rem)'
        }}
      >
        {/* Marquee Announcement Banner */}
        <div
          style={{
            backgroundColor: '#08172e',
            border: '1px solid #1c355e',
            borderRadius: '9999px',
            padding: '0.6rem 1.25rem',
            marginBottom: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f59e0b',
              color: '#071739',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              flexShrink: 0
            }}
          >
            PLACEMENT FLASH
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              color: '#cbd5e1'
            }}
          >
            <div className="tec-marquee-scroll">
              <span style={{ marginRight: '3rem' }}>
                <strong style={{ color: '#fbbf24' }}>2024–25 Record Selections:</strong> 891+ Offers secured across Cognizant, Infosys, Delphi TVS, Alldigi & Top MNCs.
              </span>
              <span style={{ marginRight: '3rem' }}>
                <strong style={{ color: '#fbbf24' }}>2025–26 Ongoing Season:</strong> Continuous on-campus drives with 910+ active selections in progress.
              </span>
              <span style={{ marginRight: '3rem' }}>
                <strong style={{ color: '#fbbf24' }}>Highest Package:</strong> 14.50 LPA • Average Package: 4.80 LPA.
              </span>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 3.5vw, 2.85rem)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            <TrendingUp size={15} />
            <span>Academic Excellence & Placements</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.85rem, 3.4vw, 2.5rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem 0'
            }}
          >
            Placement Achievements & Campus Drives
          </h2>

          <div
            style={{
              width: '48px',
              height: '3px',
              backgroundColor: '#f59e0b',
              margin: '0 auto 0.75rem auto',
              borderRadius: '2px'
            }}
          />

          <p
            style={{
              color: '#d4cfc5',
              fontSize: 'clamp(0.86rem, 1.3vw, 0.96rem)',
              maxWidth: '740px',
              margin: '0 auto',
              lineHeight: 1.55
            }}
          >
            Verified recruitment milestones, campus drive previews, and corporate hiring partners at Tirumala Engineering College Jonnalagadda.
          </p>
        </div>

        {/* Balanced 3-Column Desktop Layout: Statistics (Left) | Photo Preview (Middle) | Recruiters (Right) */}
        <div className="tec-placement-3col-grid">
          
          {/* COLUMN 1 (LEFT): Three-Year Placement Statistics */}
          <div className="tec-placement-3col-card">
            <div className="tec-col-header">
              <span className="tec-col-badge">LATEST RECORDS</span>
              <h3 className="tec-col-title">Three-Year Placement Statistics</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'space-between' }}>
              {LATEST_PLACEMENT_STATS.map((stat, index) => {
                const isCurrentYear = index === 2;
                return (
                  <div
                    key={stat.year}
                    className="tec-counter-card"
                    style={{
                      backgroundColor: isCurrentYear ? '#0e2154' : '#08172e',
                      border: isCurrentYear
                        ? '1.5px solid #f59e0b'
                        : '1px solid #1c355e',
                      borderRadius: '12px',
                      padding: '1rem 1.1rem',
                      textAlign: 'left',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                      transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isCurrentYear && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: '#f59e0b',
                          color: '#071739',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        Ongoing
                      </span>
                    )}

                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: isCurrentYear ? '#fbbf24' : '#94a3b8',
                        textTransform: 'uppercase',
                        marginBottom: '0.15rem'
                      }}
                    >
                      Academic Year {stat.year}
                    </div>

                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 2.5vw, 2.25rem)',
                        fontWeight: 900,
                        lineHeight: 1.05,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.2rem',
                        margin: '0.15rem 0'
                      }}
                    >
                      <span className="tec-counter-value">
                        {counts[index]}
                      </span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                        +
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginLeft: '0.3rem' }}>
                        Offers
                      </span>
                    </div>

                    <div style={{ fontSize: '0.73rem', color: '#cbd5e1', marginTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.3rem' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>•</span> {stat.highlight}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2 (MIDDLE): Small Placement Photograph Preview with Subtle Vertical Auto-Scroll */}
          <div className="tec-placement-3col-card">
            <div className="tec-col-header">
              <span className="tec-col-badge">CAMPUS DRIVES</span>
              <h3 className="tec-col-title">Recent Recruitment Drives</h3>
            </div>

            <div 
              style={{
                backgroundColor: '#08172e',
                border: '1px solid #1c355e',
                borderRadius: '14px',
                padding: '0.85rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                boxSizing: 'border-box'
              }}
            >
              {/* Subtle Vertical Auto-Scrolling Viewport */}
              <div 
                className="tec-middle-scroll-viewport"
                onMouseEnter={() => setIsScrollPaused(true)}
                onMouseLeave={() => setIsScrollPaused(false)}
                title="Recent Drives from 2024–25 & 2023–24 (Hover to pause)"
              >
                {/* Subtle top & bottom ambient fade gradients */}
                <div className="tec-middle-fade-top" />
                <div className="tec-middle-fade-bottom" />

                {/* Duplicated track for seamless infinite loop */}
                <div className={`tec-middle-scroll-track ${isScrollPaused ? 'tec-scroll-paused' : ''}`}>
                  {[...SHOWCASE_LATEST_PHOTOS_20, ...SHOWCASE_LATEST_PHOTOS_20].map((photo, sIdx) => (
                    <div
                      key={`${photo.id}-${sIdx}`}
                      className="tec-middle-scroll-card"
                    >
                      <div className="tec-middle-thumb-wrap">
                        <img 
                          src={photo.src} 
                          alt={photo.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = '/college_assets/placement_gallery/2024-25/congnizant.jpg'; }}
                        />
                      </div>
                      <div className="tec-middle-info">
                        <div className="tec-middle-title">
                          {photo.title}
                        </div>
                        <div className="tec-middle-meta">
                          <span className={`tec-year-pill ${photo.year === '2024-25' ? 'pill-latest' : 'pill-prev'}`}>
                            {photo.year}
                          </span>
                          <span className="tec-middle-company">{photo.company}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button directly below the middle preview */}
              <Link
                to="/placements/gallery"
                className="tec-explore-gallery-btn"
              >
                <span>Explore All Placement Photographs</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* COLUMN 3 (RIGHT): Prominent Recruiting Enterprises */}
          <div className="tec-placement-3col-card">
            <div className="tec-col-header">
              <span className="tec-col-badge">CORPORATE PARTNERS</span>
              <h3 className="tec-col-title">Prominent Recruiting Enterprises</h3>
            </div>

            <div 
              style={{
                backgroundColor: '#08172e',
                border: '1px solid #1c355e',
                borderRadius: '14px',
                padding: '0.85rem 0.95rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                boxSizing: 'border-box'
              }}
            >
              <div 
                className="tec-recruiter-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.55rem'
                }}
              >
                {TOP_RECRUITERS.map((company, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      padding: '0.48rem 0.6rem',
                      backgroundColor: '#0e2154',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {company.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700 }}>
                        {company.package}
                      </span>
                      <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                        {company.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #1c355e', marginTop: '0.75rem', paddingTop: '0.65rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Over <strong>75+ National & Global Enterprises</strong> recruit annually at TEC Jonnalagadda.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Scoped CSS Styles */}
      <style>{`
        /* 3-Column Balanced Layout */
        .tec-placement-3col-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr 1.12fr;
          gap: 1.25rem;
          align-items: stretch;
        }

        .tec-placement-3col-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .tec-col-header {
          margin-bottom: 0.75rem;
        }

        .tec-col-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 800;
          color: #fbbf24;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.15rem;
        }

        .tec-col-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .tec-counter-card:hover {
          transform: translateY(-2px);
          border-color: #f59e0b !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
        }

        /* Middle Column Subtle Vertical Auto-Scroll Viewport */
        .tec-middle-scroll-viewport {
          position: relative;
          overflow: hidden;
          height: 310px;
          border-radius: 10px;
          background-color: #040d1a;
          border: 1px solid #1c355e;
        }

        .tec-middle-fade-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 25px;
          background: linear-gradient(to bottom, #040d1a 10%, transparent 100%);
          z-index: 2;
          pointer-events: none;
        }

        .tec-middle-fade-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: linear-gradient(to top, #040d1a 10%, transparent 100%);
          z-index: 2;
          pointer-events: none;
        }

        @keyframes tecSubtleVerticalScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .tec-middle-scroll-track {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding: 0.6rem 0.55rem;
          animation: tecSubtleVerticalScroll 32s linear infinite;
        }

        .tec-middle-scroll-viewport:hover .tec-middle-scroll-track,
        .tec-scroll-paused {
          animation-play-state: paused !important;
        }

        .tec-middle-scroll-card {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.45rem 0.55rem;
          background-color: #08172e;
          border: 1px solid #1c355e;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .tec-middle-scroll-card:hover {
          background-color: #0e2154;
          border-color: #f59e0b;
        }

        .tec-middle-thumb-wrap {
          width: 60px;
          height: 42px;
          border-radius: 5px;
          overflow: hidden;
          background-color: #020710;
          flex-shrink: 0;
        }
        .tec-middle-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tec-middle-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.12rem;
        }

        .tec-middle-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tec-middle-meta {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .tec-year-pill {
          font-size: 0.6rem;
          font-weight: 800;
          padding: 0.06rem 0.35rem;
          border-radius: 4px;
        }
        .pill-latest {
          background-color: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .pill-prev {
          background-color: rgba(37, 99, 235, 0.2);
          color: #93c5fd;
          border: 1px solid rgba(37, 99, 235, 0.4);
        }

        .tec-middle-company {
          font-size: 0.65rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Explore All Button directly below the middle preview */
        .tec-explore-gallery-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background-color: #f59e0b;
          color: #071739;
          font-weight: 800;
          font-size: 0.82rem;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(245, 158, 11, 0.25);
          transition: all 0.2s ease;
          margin-top: 0.75rem;
        }
        .tec-explore-gallery-btn:hover {
          background-color: #fbbf24;
          transform: translateY(-2px);
          box-shadow: 0 5px 16px rgba(245, 158, 11, 0.4);
          color: #051226;
        }

        /* Marquee styles */
        @keyframes marqueeScroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .tec-marquee-scroll {
          display: inline-block;
          white-space: nowrap;
          animation: marqueeScroll 28s linear infinite;
        }

        .tec-marquee-scroll:hover {
          animation-play-state: paused;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .tec-placement-3col-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .tec-middle-scroll-viewport {
            height: 280px;
          }
        }

        @media (max-width: 540px) {
          .tec-recruiter-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tec-marquee-scroll {
            animation: none !important;
            transform: none !important;
          }
          .tec-middle-scroll-track {
            animation: none !important;
            transform: none !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
