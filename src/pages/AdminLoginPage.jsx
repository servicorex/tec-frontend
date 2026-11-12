import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, AlertCircle, Key, Lock, ArrowLeft } from 'lucide-react';

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
      background: 'linear-gradient(135deg, #061126 0%, #0a2550 50%, #03122c 100%)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Return to Public Website link */}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#cbd5e1',
          padding: '0.5rem 0.9rem',
          borderRadius: '8px',
          fontSize: '0.82rem',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} /> Return to College Site
      </button>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          background: '#091d3e',
          color: '#ffffff',
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          borderBottom: '3px solid #f59e0b'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: '#fbbf24'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, fontWeight: 800 }}>
            Institutional Administration
          </h2>
          <div style={{ fontSize: '0.74rem', color: '#93c5fd', marginTop: '0.35rem' }}>
            Tirumala Engineering College • Restricted Executive Access
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAdminSubmit} style={{ padding: '1.75rem 1.5rem' }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.65rem 0.85rem',
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

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: '#0e2154', fontSize: '0.85rem' }}>
              Administrator Email
            </label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., admin@tecnrt.org"
              style={{ fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700, color: '#0e2154', fontSize: '0.85rem' }}>
              Secret Password Key
            </label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter administrator password"
              style={{ fontSize: '0.9rem' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#0e2154',
              borderColor: '#0e2154'
            }}
          >
            <LogIn size={18} />
            {isSubmitting ? "Authenticating..." : "Authenticate & Access Suite"}
          </button>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.72rem',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            Restricted URL: Access granted strictly to College Principal, Chief Administrator, and Authorized System Controllers.
          </div>
        </form>
      </div>
    </div>
  );
}

