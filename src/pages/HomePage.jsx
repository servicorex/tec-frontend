import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Award, Play, ExternalLink } from 'lucide-react';
import PlacementsSection from '../components/home/PlacementsSection';
import LatestNewsSection from '../components/home/LatestNewsSection';

// Custom YouTube Icon
const YoutubeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Verified video lectures and playlists from Dr. Y. V. Narayana's Engineering Academy
const YVN_ACADEMY_LESSONS = [
  {
    title: 'Electronic Devices & Circuits',
    type: 'Course Playlist • 21 Lessons',
    url: 'https://www.youtube.com/playlist?list=PL09L5n_6QEGqK_FoBGGZX7bDhLCfmtta8',
    thumbnail: '/college_assets/yvn_academy/edc-course.jpg',
    badge: '21 Lessons'
  },
  {
    title: 'Antennas & Wave Propagation',
    type: 'Course Playlist • 8 Lessons',
    url: 'https://www.youtube.com/playlist?list=PL09L5n_6QEGoZbvq98nW83YSaGzMJOnHZ',
    thumbnail: '/college_assets/yvn_academy/awp-course.jpg',
    badge: '8 Lessons'
  },
  {
    title: 'h-Parameters & Hybrid Model',
    type: 'Core Lecture • 35 Mins',
    url: 'https://www.youtube.com/watch?v=_iP7wz7QGeY',
    thumbnail: '/college_assets/yvn_academy/h-parameters.jpg',
    badge: '35:47'
  },
  {
    title: 'Transmission Lines',
    type: 'Course Playlist • 7 Lessons',
    url: 'https://www.youtube.com/playlist?list=PL09L5n_6QEGpaI9o_SF-zO0af-zWvx4Qu',
    thumbnail: '/college_assets/yvn_academy/transmission-lines.jpg',
    badge: '7 Lessons'
  }
];

export default function HomePage() {
  const [heroAnimated, setHeroAnimated] = useState(false);
  const [campusRevealed, setCampusRevealed] = useState(false);
  const heroImgRef = useRef(null);

  useEffect(() => {
    // 1. Text & CTA entrance animations
    const textTimer = setTimeout(() => {
      setHeroAnimated(true);
    }, 280);

    // 2. Automatic mobile campus reveal animation
    // On mobile phone load or reload, begins zoomed in on the white college building
    // and smoothly, automatically pulls back to reveal the complete campus.
    const prefersReducedMotion = typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    if (prefersReducedMotion) {
      setCampusRevealed(true);
      return () => clearTimeout(textTimer);
    }

    let revealTimer;
    const triggerCampusReveal = () => {
      // 350ms delay gives time for initial paint / brand loader fade before pulling back
      revealTimer = setTimeout(() => {
        setCampusRevealed(true);
      }, 350);
    };

    const img = heroImgRef.current;
    if (img && img.complete) {
      triggerCampusReveal();
    } else if (img) {
      img.addEventListener('load', triggerCampusReveal, { once: true });
    } else {
      triggerCampusReveal();
    }

    return () => {
      clearTimeout(textTimer);
      if (revealTimer) clearTimeout(revealTimer);
      if (img) img.removeEventListener('load', triggerCampusReveal);
    };
  }, []);

  const scrollToPrincipal = (e) => {
    e.preventDefault();
    const elem = document.getElementById('principal-section');
    if (elem) {
      window.scrollTo({
        top: elem.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="tec-homepage-root" style={{ width: '100%', overflowX: 'hidden' }}>
      {/* 1. CAMPUS HERO WITH INTEGRATED RESPONSIVE CONTENT OVERLAY */}
      <section 
        className={`tec-homepage-fullwidth-hero ${heroAnimated ? 'hero-animated' : ''} ${campusRevealed ? 'campus-revealed' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 135px)',
          minHeight: '540px',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#0a1d37',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        aria-label="Tirumala Engineering College Campus Panorama"
      >
        {/* Single primary campus panorama image with balanced framing & clarity */}
        <img
          ref={heroImgRef}
          src="/campus_panorama.png"
          alt="Tirumala Engineering College Campus Panorama"
          className="tec-hero-panorama-img"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '38% 30%',
            display: 'block',
            margin: 0,
            padding: 0,
            border: 'none',
            zIndex: 1
          }}
        />

        {/* Directional gradient overlay ensuring readability while keeping the building & sunlight sunny and clear */}
        <div 
          className="tec-hero-gradient-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(5, 20, 45, 0.72) 0%, rgba(5, 20, 45, 0.45) 45%, rgba(5, 20, 45, 0.05) 85%)',
            pointerEvents: 'none',
            zIndex: 2
          }}
        />

        {/* Hero Content rendered cleanly on both desktop and mobile */}
        <div 
          className="container tec-hero-content-wrapper"
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            paddingTop: 'clamp(1.5rem, 4vh, 3.5rem)',
            paddingBottom: 'clamp(1.5rem, 4vh, 3.5rem)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ maxWidth: '620px', color: '#ffffff', flex: '1 1 520px' }}>
            {/* Top Pill Badge */}
            <div 
              className="hero-anim-eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'rgba(5, 29, 59, 0.65)',
                border: '1px solid rgba(245, 158, 11, 0.55)',
                borderRadius: '9999px',
                marginBottom: '0.85rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
              <span 
                className="tec-hero-pill-text-desktop"
                style={{
                  fontSize: 'clamp(0.66rem, 1.3vw, 0.78rem)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#ffffff'
                }}
              >
                TIRUMALA ENGINEERING COLLEGE • AUTONOMOUS • EAPCET CODE: TMLN
              </span>
              <span 
                className="tec-hero-pill-text-mobile"
                style={{
                  display: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#ffffff'
                }}
              >
                AUTONOMOUS • EAPCET: TMLN
              </span>
            </div>

            {/* Main Heading */}
            <h1 
              className="hero-anim-heading"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.65rem, 3.8vw, 3rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: '#ffffff',
                margin: '0 0 0.85rem 0',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)'
              }}
            >
              Engineering Education<br />
              <span style={{ color: '#fbbf24' }}>with Discipline and Purpose</span>
            </h1>

            {/* Supporting Description */}
            <p 
              className="hero-anim-desc"
              style={{
                fontSize: 'clamp(0.85rem, 1.25vw, 0.98rem)',
                lineHeight: 1.55,
                color: '#faf9f6',
                margin: '0 0 1.35rem 0',
                maxWidth: '560px',
                fontWeight: 500,
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.7)'
              }}
            >
              Affiliated with JNTUK and accredited by NAAC and NBA. We offer practical laboratory training, ₹60L annual merit scholarships, and focused placement preparation that secured 910 offers in 2025–2026.
            </p>

            {/* Hero CTAs */}
            <div 
              className="hero-anim-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}
            >
              {/* Primary CTA */}
              <Link
                to="/admissions/courses"
                className="tec-btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  backgroundColor: '#f59e0b',
                  color: '#051d3b',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  padding: '0.7rem 1.4rem',
                  minHeight: '44px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Explore B.Tech Courses</span>
                <ArrowRight size={17} />
              </Link>

              {/* Secondary CTA */}
              <button
                onClick={scrollToPrincipal}
                className="tec-btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  justifyContent: 'center',
                  backgroundColor: '#0a1d37',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  padding: '0.7rem 1.35rem',
                  minHeight: '44px',
                  borderRadius: '8px',
                  border: '1px solid #e5e2dc',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Principal's Message</span>
                <ChevronDown size={17} />
              </button>
            </div>
          </div>

          {/* Right: Three Accreditation Badges - Large, High-Prominence Institutional Recognition Display */}
          <div 
            className="tec-hero-badges-wrapper"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 10,
              flex: '0 0 auto'
            }}
            aria-label="Accreditation Badges"
          >
            <div 
              className="tec-hero-badges-label"
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#fbbf24',
                marginBottom: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)',
                background: 'rgba(5, 29, 59, 0.75)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid rgba(245, 158, 11, 0.45)'
              }}
            >
              <Award size={15} style={{ color: '#f59e0b' }} />
              <span>National Accreditations & Recognitions</span>
            </div>

            <div 
              className="tec-hero-badges-row"
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '1.15rem'
              }}
            >
              {/* Badge 1: NAAC Accreditation */}
              <div 
                className="tec-hero-badge-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(5, 29, 59, 0.88)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.15rem',
                  minWidth: '160px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
                title="NAAC Accredited Institution"
              >
                <div 
                  className="tec-hero-badge-img-box"
                  style={{ 
                    width: '78px', 
                    height: '78px', 
                    background: '#ffffff', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '6px', 
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)' 
                  }}
                >
                  <img 
                    src="/college_assets/logos/NAAC_LOGO.png" 
                    alt="NAAC Accreditation" 
                    className="tec-hero-badge-img"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.currentTarget.src = '/college_assets/logos/logo_naac.png'; }}
                  />
                </div>
                <div className="tec-hero-badge-title" style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                  NAAC
                </div>
                <div className="tec-hero-badge-sub" style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginTop: '0.2rem' }}>
                  Accredited
                </div>
                <div className="tec-hero-badge-desc" style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.15rem' }}>
                  Autonomous Institution
                </div>
              </div>

              {/* Badge 2: NAAC A+ (Prominent Centerpiece) */}
              <div 
                className="tec-hero-badge-card tec-hero-badge-card-highlight"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(5, 29, 59, 0.94)',
                  border: '2px solid #f59e0b',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.15rem',
                  minWidth: '175px',
                  boxShadow: '0 8px 30px rgba(245, 158, 11, 0.35)',
                  position: 'relative',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
                title="NAAC Grade 'A+' Accreditation"
              >
                <div 
                  className="tec-hero-badge-pill-tag"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    backgroundColor: '#f59e0b',
                    color: '#071739',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  Premier Grade
                </div>
                <div 
                  className="tec-hero-badge-img-box"
                  style={{ 
                    width: '84px', 
                    height: '84px', 
                    background: '#ffffff', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '6px', 
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)' 
                  }}
                >
                  <img 
                    src="/college_assets/logos/images.jpg" 
                    alt="NAAC A+ Badge" 
                    className="tec-hero-badge-img"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.currentTarget.src = '/college_assets/logos/logo_naac.png'; }}
                  />
                </div>
                <div className="tec-hero-badge-title" style={{ fontWeight: 900, fontSize: '1.35rem', color: '#fbbf24', letterSpacing: '0.02em', lineHeight: 1.15 }}>
                  NAAC A+
                </div>
                <div className="tec-hero-badge-sub" style={{ fontSize: '0.82rem', color: '#fef3c7', fontWeight: 800, marginTop: '0.2rem' }}>
                  Grade 'A+'
                </div>
                <div className="tec-hero-badge-desc" style={{ fontSize: '0.68rem', color: '#fcd34d', fontWeight: 600, marginTop: '0.15rem' }}>
                  Institutional Excellence
                </div>
              </div>

              {/* Badge 3: NBA Accreditation */}
              <div 
                className="tec-hero-badge-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(5, 29, 59, 0.88)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.15rem',
                  minWidth: '160px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
                title="NBA Accredited Programs"
              >
                <div 
                  className="tec-hero-badge-img-box"
                  style={{ 
                    width: '78px', 
                    height: '78px', 
                    background: '#ffffff', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '6px', 
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)' 
                  }}
                >
                  <img 
                    src="/college_assets/logos/logo_nba.png" 
                    alt="NBA Accreditation" 
                    className="tec-hero-badge-img"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="tec-hero-badge-title" style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1.2 }}>
                  NBA
                </div>
                <div className="tec-hero-badge-sub" style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginTop: '0.2rem' }}>
                  Accredited
                </div>
                <div className="tec-hero-badge-desc" style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.15rem' }}>
                  Tier-II Engineering Programs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK TASK BAR FOR STUDENTS & PARENTS */}
      <section
        className="tec-quicklinks-section"
        style={{
          width: '100%',
          backgroundColor: '#051d3b',
          borderBottom: '1px solid #0d4a91',
          padding: '0.85rem 0',
          position: 'relative',
          zIndex: 5
        }}
        aria-label="Quick Task Navigation"
      >
        <div 
          className="container tec-quicklinks-container"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div className="tec-quicklinks-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9e9a91', fontSize: '0.82rem', fontWeight: 600 }}>
            <span style={{ color: '#fbbf24', fontWeight: 800 }}>Quick Links:</span>
            <span className="tec-quicklinks-desc">Direct access for students, parents, and recruiters</span>
          </div>

          <div className="tec-quicklinks-grid">
            {/* 1. Admissions 2026 */}
            <Link
              to="/admissions/procedure"
              className="tec-quicklink-btn"
            >
              <span>Admissions 2026</span>
            </Link>

            {/* 2. UG Programs */}
            <Link
              to="/admissions/courses"
              className="tec-quicklink-btn"
            >
              <span>UG Programs</span>
            </Link>

            {/* 3. PG Programs */}
            <Link
              to="/admissions/courses"
              className="tec-quicklink-btn"
            >
              <span>PG Programs</span>
            </Link>

            {/* 4. Examination Portal */}
            <a
              href="http://www.tecnrt.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="tec-quicklink-btn tec-quicklink-btn-accent"
            >
              <span>Examination Portal</span>
            </a>

            {/* 5. Placement Achievements */}
            <Link
              to="/placements/statistics"
              className="tec-quicklink-btn"
            >
              <span>Placement Achievements</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL PRINCIPAL'S SECTION */}
      <section 
        id="principal-section"
        style={{
          width: '100%',
          backgroundColor: '#fbfaf8',
          padding: 'clamp(1.5rem, 3vh, 2.5rem) 0',
          borderTop: '1px solid #e5e2dc',
          borderBottom: '1px solid #e5e2dc',
          position: 'relative',
          scrollMarginTop: '135px'
        }}
        aria-label="Principal's Message"
      >
        <div className="container">
          {/* Section Heading - Clean without redundant eyebrow label */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              color: '#0a3d78',
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem 0'
            }}>
              From the Principal's Desk
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#524f49',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.5
            }}>
              Guiding students with academic discipline, practical industry skills, and ethical values.
            </p>
            <div style={{ width: '48px', height: '3px', backgroundColor: '#f59e0b', margin: '0.9rem auto 0 auto', borderRadius: '2px' }} />
          </div>

          {/* 3-Column Desktop / Responsive Editorial Layout with Centered Portrait */}
          <div className="tec-principal-grid">
            
            {/* COLUMN 1: Left Editorial Content */}
            <div className="tec-principal-col">
              {/* Teaching and Learning */}
              <div className="tec-content-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0a3d78', margin: '0 0 0.45rem 0', lineHeight: 1.25 }}>
                  Teaching and Learning
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#524f49', lineHeight: 1.65, margin: 0 }}>
                  Dr. Y. V. Narayana oversees the academic standards at Tirumala Engineering College, focusing on practical laboratory coursework, autonomous curriculum updates aligned with industry demands, and continuous faculty development to ensure students understand core engineering concepts thoroughly.
                </p>
              </div>

              {/* Thin Neutral Divider */}
              <div className="tec-card-divider" />

              {/* Our Educational Mission */}
              <div className="tec-content-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0a3d78', margin: '0 0 0.45rem 0', lineHeight: 1.25 }}>
                  Our Educational Mission
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#524f49', lineHeight: 1.65, margin: 0 }}>
                  Founded to bring quality engineering education to students across the Palnadu region, TEC pairs affordable college education with disciplined campus life, modern computing labs, and active faculty mentorship so graduates can build stable, rewarding technical careers.
                </p>
              </div>
            </div>

            {/* COLUMN 2: Centered Prominent Portrait of Principal Sir */}
            <div className="tec-principal-portrait-col">
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '0.85rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e2dc',
                textAlign: 'center'
              }}>
                {/* Portrait Image */}
                <div style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#0a3d78',
                  aspectRatio: '16/11',
                  maxHeight: '260px'
                }}>
                  <img 
                    src="/college_assets/Principal1.png"
                    alt="Dr. Y. V. Narayana, Principal of Tirumala Engineering College"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 35%',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Portrait Caption & Credentials */}
                <div style={{ padding: '0.85rem 0.5rem 0.5rem 0.5rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#0a3d78',
                    margin: '0 0 0.25rem 0',
                    lineHeight: 1.2
                  }}>
                    Dr. Y. V. Narayana
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '0.45rem' }}>
                    Principal & Professor
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6e6a62', fontWeight: 600, lineHeight: 1.45, marginBottom: '0.85rem' }}>
                    M.Tech., Ph.D., MISTE, MIE, MCSI (UK)<br />
                    <span>28+ Years of Academic & Administrative Leadership</span>
                  </div>

                  {/* Institutional Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: '#f0f7ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    color: '#0a3d78',
                    fontWeight: 700
                  }}>
                    <Award size={13} style={{ color: '#f59e0b' }} />
                    <span>Founder Principal • UGC Autonomous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Right Teaching & Learning Showcase (Y.V.N. Engineering Academy) */}
            <div className="tec-principal-col">
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: 'clamp(0.9rem, 1.8vw, 1.15rem)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.07)',
                  border: '1px solid #e5e2dc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                {/* Showcase Header */}
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                    <YoutubeIcon size={14} color="#dc2626" />
                    <span>Y.V.N. Engineering Academy</span>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0a3d78',
                    margin: '0 0 0.3rem 0',
                    lineHeight: 1.25
                  }}>
                    Learn with Dr. Y. V. Narayana
                  </h3>
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#524f49',
                    lineHeight: 1.48,
                    margin: 0
                  }}>
                    Explore engineering concepts through practical explanations, subject-focused lessons, and educational videos from Dr. Y. V. Narayana's Engineering Academy.
                  </p>
                </div>

                {/* 2x2 Thumbnail Grid */}
                <div 
                  className="tec-yvn-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.6rem',
                    margin: '0.65rem 0'
                  }}
                >
                  {YVN_ACADEMY_LESSONS.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tec-yvn-thumb-card"
                      title={`${item.title} (${item.type})`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        backgroundColor: '#fbfaf8',
                        border: '1px solid #e5e2dc',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      {/* Thumbnail wrapper */}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#0a3d78', overflow: 'hidden' }}>
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.25s ease' }}
                        />
                        {/* Play Icon Overlay */}
                        <div 
                          className="tec-yvn-play-overlay"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.22)',
                            transition: 'background-color 0.15s ease'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(220, 38, 38, 0.92)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.35)'
                          }}>
                            <Play size={11} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
                          </div>
                        </div>

                        {/* Duration / Lesson Count Badge */}
                        <div 
                          className="tec-yvn-badge"
                          style={{
                            position: 'absolute',
                            bottom: '0.25rem',
                            right: '0.25rem',
                            backgroundColor: 'rgba(7, 23, 57, 0.88)',
                            color: '#ffffff',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            letterSpacing: '0.02em'
                          }}
                        >
                          {item.badge}
                        </div>
                      </div>

                      {/* Card Caption */}
                      <div style={{ padding: '0.35rem 0.45rem', display: 'flex', flexDirection: 'column', gap: '0.12rem' }}>
                        <div 
                          className="tec-yvn-card-title"
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#0a3d78',
                            lineHeight: 1.25,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {item.title}
                        </div>
                        <div className="tec-yvn-card-type" style={{ fontSize: '0.65rem', color: '#6e6a62', fontWeight: 600 }}>
                          {item.type}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Bottom Call-To-Action aligned toward the right */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.2rem' }}>
                  <a
                    href="https://www.youtube.com/@YVNEngineeringAcademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tec-yvn-channel-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <YoutubeIcon size={15} color="#ffffff" />
                    <span>Explore All Lessons on YouTube</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CAMPUS PLACEMENTS STATISTICS */}
      <PlacementsSection />

      {/* 4. LATEST NEWS & UPDATES */}
      <LatestNewsSection />

      {/* Scoped CSS for Animations and Responsive Layout */}
      <style>{`
        /* Smooth Entrance Animations for Hero Text */
        @keyframes heroFadeRise {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-anim-eyebrow,
        .hero-anim-heading,
        .hero-anim-desc,
        .hero-anim-actions {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .hero-animated .hero-anim-eyebrow {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.08s;
        }
        .hero-animated .hero-anim-heading {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.2s;
        }
        .hero-animated .hero-anim-desc {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.32s;
        }
        .hero-animated .hero-anim-actions {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 0.44s;
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-anim-eyebrow,
          .hero-anim-heading,
          .hero-anim-desc,
          .hero-anim-actions {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* Hover and Focus States for Hero CTAs - Neutral shadows only */
        .tec-btn-primary:hover {
          background-color: #d97706 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
        }
        .tec-btn-primary:focus-visible {
          outline: 3px solid #f59e0b;
          outline-offset: 3px;
        }
        .tec-btn-secondary:hover {
          background-color: #12284c !important;
          border-color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.28) !important;
        }
        .tec-btn-secondary:focus-visible {
          outline: 3px solid #ffffff;
          outline-offset: 3px;
        }

        /* Accreditation Badges on Desktop Hero */
        .tec-hero-badge-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(251, 191, 36, 0.8) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55) !important;
        }
        .tec-hero-badge-card-highlight:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: #fbbf24 !important;
          box-shadow: 0 12px 36px rgba(245, 158, 11, 0.5) !important;
        }

        @media (max-width: 992px) and (min-width: 769px) {
          .tec-hero-content-wrapper {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .tec-hero-badges-wrapper {
            align-items: flex-start !important;
            margin-top: 2rem !important;
            width: 100% !important;
          }
          .tec-hero-badges-row {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 1rem !important;
            width: 100% !important;
          }
          .tec-hero-badge-card {
            flex: 1 1 160px !important;
          }
        }

        /* Principal Grid: 3-column desktop layout with centered portrait */
        .tec-principal-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr 1.15fr;
          gap: clamp(1.25rem, 2.2vw, 2.25rem);
          align-items: center;
        }

        .tec-principal-col {
          display: flex;
          flex-direction: column;
        }

        .tec-principal-portrait-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .tec-card-divider {
          height: 1px;
          background-color: #e5e2dc;
          margin: 1.25rem 0;
        }

        /* Hero Dynamic Gradient Overlay */
        .tec-hero-gradient-overlay {
          background: linear-gradient(135deg, rgba(5, 29, 59, 0.9) 0%, rgba(5, 29, 59, 0.65) 48%, rgba(5, 29, 59, 0.12) 80%);
        }

        /* Ambient mobile background layer hidden on desktop */
        .tec-hero-panorama-bg {
          display: none;
        }

        /* Quick Links Grid */
        .tec-quicklinks-grid {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tec-quicklink-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background-color: rgba(255, 255, 255, 0.08);
          color: #faf9f6;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          min-height: 40px;
          border-radius: 6px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .tec-quicklink-btn:hover {
          background-color: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.3);
          color: #ffffff;
        }

        .tec-quicklink-btn-accent {
          background-color: rgba(245, 158, 11, 0.18) !important;
          color: #fbbf24 !important;
          font-weight: 700 !important;
          border: 1px solid rgba(245, 158, 11, 0.45) !important;
        }
        .tec-principal-view-full-btn:hover {
          background-color: #0e2154 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }

        /* YVN Engineering Academy Showcase Styles */
        .tec-yvn-thumb-card:hover {
          transform: translateY(-2px);
          border-color: #0a3d78 !important;
          box-shadow: 0 4px 14px rgba(10, 61, 120, 0.12) !important;
        }
        .tec-yvn-thumb-card:hover .tec-yvn-play-overlay {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .tec-yvn-thumb-card:hover img {
          transform: scale(1.04);
        }
        .tec-yvn-channel-btn:hover {
          background-color: #b91c1c !important;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4) !important;
          transform: translateY(-1px);
        }

        /* Desktop: Section fills viewport perfectly with vertical centering */
        @media (min-width: 861px) {
          #principal-section {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-sizing: border-box;
          }
        }

        /* Responsive Breakpoints */
        /* Maintain 3-column desktop layout; only collapse on tablet/mobile <= 860px */
        @media (max-width: 860px) {
          .tec-principal-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .tec-principal-portrait-col {
            order: -1;
            max-width: 440px;
            margin: 0 auto;
            width: 100%;
          }
          .tec-card-divider {
            margin: 1rem 0;
          }
        }

        @media (max-width: 768px) {
          .tec-quicklinks-section {
            padding: 0.65rem 0 !important;
          }
          .tec-quicklinks-desc {
            display: none !important;
          }
          .tec-quicklinks-grid {
            flex-wrap: wrap !important;
            gap: 0.35rem !important;
            justify-content: flex-start !important;
          }
          .tec-quicklink-btn {
            font-size: 0.76rem !important;
            padding: 0.35rem 0.65rem !important;
            min-height: 36px !important;
          }

          .tec-hero-pill-text-desktop {
            display: none !important;
          }
          .tec-hero-pill-text-mobile {
            display: inline !important;
          }

          /* Ambient background layer: completely hidden to avoid blurred mess */
          .tec-hero-panorama-bg {
            display: none !important;
          }

          /* Dynamic mobile hero: balanced height to keep full page structure compact & accessible */
          .tec-homepage-fullwidth-hero {
            position: relative !important;
            height: auto !important;
            min-height: clamp(520px, 86vh, 640px) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
          }

          /* Sharp primary campus panorama: starts zoomed in on the white college building, then smoothly pulls back to reveal the full campus */
          .tec-hero-panorama-img {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: 38% 35% !important;
            z-index: 1 !important;
            transform-origin: 38% 45% !important;
            transform: scale(1.28) translate3d(0, 0, 0) !important;
            will-change: transform;
            transition: transform 2.2s cubic-bezier(0.22, 1, 0.36, 1) !important;
          }

          .campus-revealed .tec-hero-panorama-img {
            transform: scale(1.0) translate3d(0, 0, 0) !important;
          }

          /* Seamless gradient overlay ensuring text contrast without obscuring the campus architecture */
          .tec-hero-gradient-overlay {
            position: absolute !important;
            inset: 0 !important;
            z-index: 2 !important;
            pointer-events: none !important;
            background: linear-gradient(180deg, 
              rgba(5, 29, 59, 0.85) 0%, 
              rgba(5, 29, 59, 0.60) 42%, 
              rgba(5, 29, 59, 0.35) 75%, 
              rgba(5, 29, 59, 0.70) 100%) !important;
          }

          /* Mobile Accreditation Display: sleek, genuine institutional recognition strip */
          .tec-hero-badges-wrapper {
            align-items: stretch !important;
            margin-top: 1.15rem !important;
            width: 100% !important;
          }

          .tec-hero-badges-label {
            align-self: center !important;
            font-size: 0.68rem !important;
            padding: 0.22rem 0.65rem !important;
            margin-bottom: 0.5rem !important;
            letter-spacing: 0.05em !important;
          }

          .tec-hero-badges-row {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.45rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .tec-hero-badge-card {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            background: rgba(5, 29, 59, 0.72) !important;
            border: 1px solid rgba(255, 255, 255, 0.16) !important;
            backdrop-filter: blur(8px) !important;
            border-radius: 10px !important;
            padding: 0.55rem 0.25rem !important;
            min-width: 0 !important;
            width: 100% !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
            box-sizing: border-box !important;
            transition: none !important;
          }

          .tec-hero-badge-card-highlight {
            background: rgba(5, 29, 59, 0.85) !important;
            border: 1.5px solid #f59e0b !important;
            box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25) !important;
          }

          .tec-hero-badge-img-box {
            width: 48px !important;
            height: 48px !important;
            background: #ffffff !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4px !important;
            margin-bottom: 0.35rem !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
            flex-shrink: 0 !important;
          }

          .tec-hero-badge-img {
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
          }

          .tec-hero-badge-title {
            font-size: 0.82rem !important;
            font-weight: 800 !important;
            line-height: 1.15 !important;
            color: #ffffff !important;
            letter-spacing: 0.02em !important;
          }

          .tec-hero-badge-card-highlight .tec-hero-badge-title {
            color: #fbbf24 !important;
          }

          .tec-hero-badge-sub {
            font-size: 0.65rem !important;
            font-weight: 700 !important;
            margin-top: 0.15rem !important;
            color: #cbd5e1 !important;
            line-height: 1.1 !important;
          }

          .tec-hero-badge-card-highlight .tec-hero-badge-sub {
            color: #fef3c7 !important;
          }

          .tec-hero-badge-desc {
            display: none !important;
          }

          .tec-hero-badge-pill-tag {
            top: -7px !important;
            font-size: 0.52rem !important;
            padding: 0.1rem 0.45rem !important;
          }

          /* Ensure Principal's section does not overlap */
          #principal-section {
            position: relative !important;
            z-index: 5 !important;
            clear: both !important;
          }
          .tec-hero-content-wrapper {
            padding-top: clamp(0.75rem, 2.2vh, 1.15rem) !important;
            padding-bottom: clamp(0.75rem, 2.2vh, 1.15rem) !important;
            padding-left: clamp(0.65rem, 3.5vw, 1rem) !important;
            padding-right: clamp(0.65rem, 3.5vw, 1rem) !important;
            box-sizing: border-box !important;
          }
          .hero-anim-eyebrow {
            margin-bottom: 0.4rem !important;
            padding: 0.22rem 0.6rem !important;
          }
          .hero-anim-heading {
            font-size: clamp(1.22rem, 5vw, 1.5rem) !important;
            line-height: 1.18 !important;
            margin-bottom: 0.4rem !important;
          }
          .hero-anim-desc {
            font-size: clamp(0.76rem, 2.6vw, 0.84rem) !important;
            line-height: 1.38 !important;
            margin-bottom: 0.7rem !important;
            max-width: 480px !important;
          }
          .hero-anim-actions {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 0.45rem !important;
            width: 100% !important;
          }
          .tec-btn-primary, .tec-btn-secondary {
            flex: 1 1 135px !important;
            justify-content: center !important;
            padding: 0.5rem 0.75rem !important;
            font-size: 0.8rem !important;
            min-height: 38px !important;
            border-radius: 7px !important;
          }
        }

        @media (max-width: 440px) {
          .hero-anim-eyebrow {
            white-space: normal !important;
          }
        }

        @media (max-width: 360px) {
          .tec-hero-badges-row {
            gap: 0.3rem !important;
          }
          .tec-hero-badge-card {
            padding: 0.45rem 0.15rem !important;
          }
          .tec-hero-badge-img-box {
            width: 42px !important;
            height: 42px !important;
            padding: 3px !important;
          }
          .tec-hero-badge-title {
            font-size: 0.74rem !important;
          }
          .tec-hero-badge-sub {
            font-size: 0.58rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tec-hero-panorama-img,
          .campus-revealed .tec-hero-panorama-img,
          .tec-hero-panorama-bg,
          .campus-revealed .tec-hero-panorama-bg {
            transform: none !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
