import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, AlertCircle, ArrowLeft, Building2, Award, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const { loginWithCredentials, currentUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin@tecnrt.org');
  const [password, setPassword] = useState('Admin#TEC@2026');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated as admin, redirect to principal suite
  if (currentUser?.role === 'principal' || currentUser?.role === 'admin') {
    navigate('/portal/principal', { replace: true });
    return null;
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await loginWithCredentials({
        role: 'principal',
        username: username.trim(),
        password: password.trim()
      });

      if (res?.success) {
        navigate('/portal/principal');
      } else {
        setError(res?.message || "Invalid administrator credentials.");
      }
    } catch (err) {
      setError(err?.message || "Authentication service failed. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #0f2752 0%, #061124 60%, #030814 100%)',
      padding: '2rem 1.5rem',
      position: 'relative',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Return to Public Website button */}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#e2e8f0',
          padding: '0.55rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
      >
        <ArrowLeft size={16} /> Return to College Site
      </button>

      {/* Main Split Container */}
      <div style={{
        width: '100%',
        maxWidth: '920px',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        minHeight: '520px'
      }}>

        {/* LEFT SIDE: Big College Logo, Branding & Accreditation */}
        <div style={{
          flex: '1.05',
          background: 'linear-gradient(155deg, #091d3e 0%, #0e2a56 55%, #05142b 100%)',
          color: '#ffffff',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Subtle Ambient Ring */}
          <div style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Big College Logo / Seal */}
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: '#ffffff',
            padding: '12px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <img 
              src="/college_assets/tec_crest.png" 
              alt="Tirumala Engineering College Seal"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/college_assets/tec_official_seal_clean.png';
              }}
            />
          </div>

          {/* Institution Title */}
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            margin: '0 0 0.4rem 0',
            color: '#ffffff',
            lineHeight: 1.25
          }}>
            TIRUMALA ENGINEERING COLLEGE
          </h1>

          <div style={{
            fontSize: '0.82rem',
            color: '#fbbf24',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            UGC AUTONOMOUS • ESTD. 2008
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: '#cbd5e1',
            maxWidth: '300px',
            lineHeight: 1.45,
            marginBottom: '1.5rem'
          }}>
            Approved by AICTE, New Delhi • Permanently Affiliated to JNTUK • Accredited by NAAC 'A' Grade & NBA
          </div>

          {/* Accreditation Badges */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              color: '#e2e8f0',
              fontWeight: 600
            }}>
              EAPCET: TMLN
            </span>
            <span style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              color: '#fef3c7',
              fontWeight: 700
            }}>
              NAAC 'A' Grade
            </span>
            <span style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              color: '#dbeafe',
              fontWeight: 600
            }}>
              NBA Tier-II
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Admin Login Form */}
        <div style={{
          flex: '1',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              marginBottom: '0.75rem'
            }}>
              <ShieldCheck size={14} />
              RESTRICTED EXECUTIVE ACCESS
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0e2154',
              margin: '0 0 0.35rem 0'
            }}>
              Administrator Login
            </h2>
            <p style={{
              fontSize: '0.82rem',
              color: '#64748b',
              margin: 0
            }}>
              Sign in to manage college administration, departments, and institutional records.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminSubmit}>
            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '0.75rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '0.82rem',
                marginBottom: '0.45rem'
              }}>
                Administrator Email / User ID
              </label>
              <input 
                type="email" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@tecnrt.org"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0e2154';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{
                display: 'block',
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '0.82rem',
                marginBottom: '0.45rem'
              }}>
                Secret Password Key
              </label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0e2154';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.background = '#f8fafc';
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#0e2154',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(14, 33, 84, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = '#183884';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.background = '#0e2154';
              }}
            >
              <LogIn size={18} />
              {isSubmitting ? "Authenticating..." : "Authenticate & Access Suite"}
            </button>
          </form>

          {/* Footer Note */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.72rem',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.45
          }}>
            Authorized for College Principal, Chief Administrator, and System Directors only.
          </div>
        </div>

      </div>
    </div>
  );
}
