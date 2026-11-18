import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { COLLEGE_INFO } from '../../data/mockData';
import { 
  GraduationCap, 
  LogOut, 
  Bell, 
  Globe, 
  AlertTriangle, 
  Key, 
  User, 
  ShieldCheck,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export default function PortalHeader() {
  const { currentUser, logout, quickSwitchRole, updatePassword, setActiveTab } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Automatically trigger mandatory password change popup when student logs in for the first time
  useEffect(() => {
    if (currentUser?.role === 'student' && currentUser?.mustChangePassword) {
      setShowPasswordModal(true);
    }
  }, [currentUser?.role, currentUser?.mustChangePassword]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPwdError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Passwords do not match.");
      return;
    }
    updatePassword(newPassword);
    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPwdError('');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return <span className="badge badge-primary">Student Portal</span>;
      case 'hod':
        return <span className="badge" style={{ background: '#f3e8ff', color: '#6b21a8' }}>HOD Administration</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 850 }}>
      {/* PRD 4.1 & 7.2 First-time Login Password Change Requirement Alert */}
      {currentUser.mustChangePassword && (
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#92400e', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
            <span>
              <strong>Security Requirement:</strong> First-time login detected. You must change your temporary access key to set a private password and secure your portal account.
            </span>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="btn btn-accent btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
          >
            <Key size={13} /> Change Password Now
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="container-wide" style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        {/* Left: Branding & Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #0e2154 0%, #1d4ed8 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(14,33,84,0.25)'
          }}>
            <GraduationCap size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: '#0e2154' }}>
                {COLLEGE_INFO.shortName} PORTAL
              </span>
              {getRoleBadge(currentUser.role)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Tirumala Engineering College, Narasaraopet (TMLN)
            </div>
          </div>
        </div>

        {/* Right: User Information & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notifications Dropdown Toggle - Student Only */}
          {currentUser.role === 'student' && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', position: 'relative' }}
                title="Notifications"
              >
                <Bell size={18} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', border: '2px solid #ffffff' }}></span>
              </button>

              {showNotifMenu && (
                <div style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '46px', 
                  width: '320px', 
                  background: '#ffffff', 
                  borderRadius: '12px', 
                  boxShadow: 'var(--shadow-xl)', 
                  border: '1px solid #e2e8f0', 
                  padding: '1rem', 
                  zIndex: 1000 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>System Notifications</span>
                    <button onClick={() => setShowNotifMenu(false)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}>
                      <X size={16} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                    <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#1e40af' }}>End-Sem Exam Schedule Published</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>JNTUK IV-I Regular timetables released.</div>
                    </div>
                    <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>Attendance Register Synced</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Monthly spreadsheet records verified.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.35rem 0.75rem', background: '#f8fafc', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              {currentUser.profile?.name ? currentUser.profile.name.charAt(0) : 'U'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                {currentUser.profile?.name || "Active User"}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {currentUser.role === 'hod'
                  ? `HOD • ${currentUser.profile?.department || 'CSE'}`
                  : (currentUser.role === 'student' 
                      ? currentUser.profile?.rollNumber 
                      : currentUser.profile?.designation || 'Administrator')}
              </div>
            </div>
          </div>

          {/* Back to Public Site */}
          <button 
            onClick={() => {
              navigate('/');
            }}
            className="btn btn-outline btn-sm"
            title="Return to Public Website"
          >
            <Globe size={15} />
            <span className="hide-on-mobile">College Website</span>
          </button>

          {/* Logout */}
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="btn btn-outline-primary btn-sm"
            title="Sign out of current account"
            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <LogOut size={15} />
            <span className="hide-on-mobile">Sign Out</span>
          </button>
        </div>
      </div>

      {/* First-time Password Change Mandatory Modal Popup */}
      {showPasswordModal && (
        <div className="modal-backdrop" style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(6px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="modal-dialog" style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            maxWidth: '480px', 
            width: '100%', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', 
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            <div className="modal-header" style={{ 
              background: 'linear-gradient(135deg, #0e2154 0%, #1e40af 100%)', 
              color: '#ffffff', 
              padding: '1.25rem 1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={20} style={{ color: '#fbbf24' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Mandatory Password Change</h3>
                  <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginTop: '2px' }}>First-Time Student Login Security Setup</div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div style={{ 
                  background: '#fef3c7', 
                  border: '1px solid #fde68a', 
                  borderRadius: '10px', 
                  padding: '0.85rem 1rem', 
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.82rem', color: '#92400e', margin: 0, lineHeight: 1.45 }}>
                    <strong>Action Required:</strong> You have logged in with your default institutional credentials. To protect your student records, attendance, and profile privacy, you must define a private password before proceeding.
                  </p>
                </div>

                {pwdError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                    {pwdError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', display: 'block' }}>New Private Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    required 
                    placeholder="Enter at least 6 characters" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', display: 'block' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    required 
                    placeholder="Re-enter new private password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ 
                padding: '1rem 1.5rem', 
                background: '#f8fafc', 
                borderTop: '1px solid #e2e8f0', 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '0.75rem' 
              }}>
                <button 
                  type="button" 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }} 
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} /> Save Password & Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}
