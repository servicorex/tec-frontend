import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { COLLEGE_INFO, DEPARTMENTS } from '../../data/mockData';
import { 
  X, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  LogIn, 
  HelpCircle 
} from 'lucide-react';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, loginModalRole, setLoginModalRole, loginWithCredentials, students = [] } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(loginModalRole || 'student');
  const [hodBranch, setHodBranch] = useState('CSE');
  const [studentBranch, setStudentBranch] = useState('CSE');
  const [studentYear, setStudentYear] = useState('4th Year');
  const [studentSection, setStudentSection] = useState('Sec A');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [requireMfa, setRequireMfa] = useState(false);

  const matchingStudents = students.filter(s => {
    const sBranch = (s.department || s.branch || 'CSE').toUpperCase();
    const sYr = (s.year || '').replace(' Year', '').trim();
    const targetYr = studentYear.replace(' Year', '').trim();
    const sSec = (s.section || 'A').toUpperCase();
    const targetSec = studentSection.replace('Sec ', '').trim().toUpperCase();

    const branchMatch = sBranch === studentBranch.toUpperCase();
    const yearMatch = sYr === targetYr || s.year === studentYear;
    const secMatch = sSec === targetSec;
    return branchMatch && yearMatch && secMatch;
  });

  const autoSelectFirstStudent = (branch, year, section) => {
    const targetYr = year.replace(' Year', '').trim();
    const targetSec = section.replace('Sec ', '').trim().toUpperCase();
    const targetBranch = branch.toUpperCase();

    const matches = students.filter(s => {
      const sBranch = (s.department || s.branch || 'CSE').toUpperCase();
      const sYr = (s.year || '').replace(' Year', '').trim();
      const sSec = (s.section || 'A').toUpperCase();
      return sBranch === targetBranch && (sYr === targetYr || s.year === year) && sSec === targetSec;
    });

    if (matches.length > 0) {
      setUsername(matches[0].rollNumber);
      setPassword(matches[0].rollNumber);
    }
  };

  useEffect(() => {
    if (loginModalRole) {
      setActiveTab(loginModalRole);
      applyDemoCredentials(loginModalRole);
    }
  }, [loginModalRole, loginModalOpen]);

  // Apple HIG Modality - Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && loginModalOpen) {
        setLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loginModalOpen, setLoginModalOpen]);

  const applyDemoCredentials = (role, branch = hodBranch) => {
    setError('');
    setShowForgotNotice(false);
    setRequireMfa(false);

    if (role === 'student') {
      setStudentBranch('CSE');
      setStudentYear('4th Year');
      setStudentSection('Sec A');
      setUsername('23NE1A05K3');
      setPassword('23NE1A05K3'); // Default initial credential (must change password)
    } else if (role === 'hod') {
      const b = branch || 'CSE';
      setUsername(`hod.${b.toLowerCase()}@tecnrt.org`);
      setPassword(`HOD_${b.toUpperCase()}#2026`);
    } else if (role === 'principal' || role === 'admin') {
      setUsername('admin@tecnrt.org');
      setPassword('Admin#TEC@2026');
    }
  };

  const handleTabChange = (role) => {
    setActiveTab(role);
    setLoginModalRole(role);
    applyDemoCredentials(role, hodBranch);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both identifier and password fields.");
      return;
    }

    if (requireMfa && mfaCode.trim() !== '123456') {
      setError("Invalid 6-digit MFA verification code. (Hint: Use 123456 for demo)");
      return;
    }

    const res = await loginWithCredentials({
      role: activeTab,
      username,
      password,
      branch: hodBranch
    });

    if (res?.success) {
      const destination = (activeTab === 'admin' || activeTab === 'principal') ? 'principal' : activeTab;
      navigate(`/portal/${destination}`);
    } else if (res?.message) {
      setError(res.message);
    }
  };

  if (!loginModalOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setLoginModalOpen(false);
      }}
    >
      <div 
        className="modal-dialog" 
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        style={{ maxWidth: '520px' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: '#0a3d78', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <h3 id="login-modal-title" style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>Tirumala Portal Authentication</h3>
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '0.15rem' }}>
                Secure Institutional Access (EAPCET: {COLLEGE_INFO.eamcetCode})
              </div>
            </div>
          </div>
          <button 
            onClick={() => setLoginModalOpen(false)}
            aria-label="Close portal authentication dialog"
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#cbd5e1', 
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Tabs - Student & HOD Portals (Admin hidden from public modal) */}
        <div 
          role="tablist"
          aria-label="Portal User Roles"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.35rem 0.5rem', gap: '0.5rem' }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'student'}
            onClick={() => handleTabChange('student')}
            style={{
              padding: '0.75rem 0.5rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'student' ? 700 : 500,
              background: activeTab === 'student' ? '#ffffff' : 'transparent',
              color: activeTab === 'student' ? '#0a3d78' : '#64748b',
              borderRadius: '8px',
              border: activeTab === 'student' ? '1px solid #cbd5e1' : 'none',
              boxShadow: activeTab === 'student' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <GraduationCap size={18} />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'hod'}
            onClick={() => handleTabChange('hod')}
            style={{
              padding: '0.75rem 0.5rem',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'hod' ? 700 : 500,
              background: activeTab === 'hod' ? '#ffffff' : 'transparent',
              color: activeTab === 'hod' ? '#0a3d78' : '#64748b',
              borderRadius: '8px',
              border: activeTab === 'hod' ? '1px solid #cbd5e1' : 'none',
              boxShadow: activeTab === 'hod' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Building2 size={18} />
            <span>HOD Portal</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem' }}>
            {/* Role Specific Guidance */}
            <div style={{ background: '#f0f5fa', border: '1px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#0a3d78' }}>
              {activeTab === 'student' && (
                <div>
                  <strong>Student Access:</strong> Enter your 10-digit College Roll Number (e.g., <code>23NE1A05K3</code>) and issued password. First-time login requires setting a private password.
                </div>
              )}
              {activeTab === 'hod' && (
                <div>
                  <strong>HOD Portal:</strong> Head of Department administration for Section-wise Student Management, Attendance Upload, and Faculty Workload.
                </div>
              )}
              {(activeTab === 'principal' || activeTab === 'admin') && (
                <div>
                  <strong>Principal / Chief Administrator:</strong> College-wide institutional governance, all branch analytics, HOD provisioning, and statutory compliance.
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* HOD Branch Selector */}
            {activeTab === 'hod' && (
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: '#0a3d78' }}>
                  Branch / Academic Department
                </label>
                <select
                  className="form-select"
                  value={hodBranch}
                  onChange={(e) => {
                    const b = e.target.value;
                    setHodBranch(b);
                    setUsername(`hod.${b.toLowerCase()}@tecnrt.org`);
                    setPassword(`HOD_${b.toUpperCase()}#2026`);
                  }}
                  style={{ fontWeight: 600 }}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.name}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                  HOD session and attendance management will be strictly assigned to this department.
                </div>
              </div>
            )}

            {/* Student Branch, Year, and Section Organization */}
            {activeTab === 'student' && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0a3d78', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Select Class / Section:
                  </span>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {studentBranch} • {studentYear} • {studentSection}
                  </span>
                </div>

                {/* Branch, Year, Section Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Branch</label>
                    <select
                      className="form-select"
                      value={studentBranch}
                      onChange={(e) => {
                        const b = e.target.value;
                        setStudentBranch(b);
                        autoSelectFirstStudent(b, studentYear, studentSection);
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.id}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Academic Year</label>
                    <select
                      className="form-select"
                      value={studentYear}
                      onChange={(e) => {
                        const y = e.target.value;
                        setStudentYear(y);
                        autoSelectFirstStudent(studentBranch, y, studentSection);
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Section</label>
                    <select
                      className="form-select"
                      value={studentSection}
                      onChange={(e) => {
                        const s = e.target.value;
                        setStudentSection(s);
                        autoSelectFirstStudent(studentBranch, studentYear, s);
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                    >
                      <option value="Sec A">Sec A</option>
                      <option value="Sec B">Sec B</option>
                      <option value="Sec C">Sec C</option>
                    </select>
                  </div>
                </div>

                {/* Section Student Quick-Select Dropdown */}
                {matchingStudents.length > 0 ? (
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                      <GraduationCap size={13} />
                      Enrolled Scholars ({matchingStudents.length} in this Section):
                    </label>
                    <select
                      className="form-select"
                      value={username}
                      onChange={(e) => {
                        const roll = e.target.value;
                        setUsername(roll);
                        setPassword(roll);
                      }}
                      style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0e2154', borderColor: '#86efac', background: '#f0fdf4' }}
                    >
                      {matchingStudents.map(st => (
                        <option key={st.rollNumber} value={st.rollNumber}>
                          {st.rollNumber} — {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.73rem', color: '#64748b', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                    No students enrolled in <strong>{studentBranch} • {studentYear} • {studentSection}</strong>. You can enter an assigned roll number below or import records via HOD portal.
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {activeTab === 'student' ? 'College Roll Number (Identifier)' : activeTab === 'hod' ? 'HOD Email / Administrator ID' : 'Administrator Email / ID'}
              </label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'student' ? 'e.g., 23NE1A05K3' : activeTab === 'hod' ? 'e.g., hod.cse@tecnrt.org' : 'e.g., admin@tecnrt.org'}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  style={{ background: 'none', border: 'none', color: '#0a3d78', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                className="form-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {/* Simulated MFA Option for Privileged Administration */}
            {(activeTab === 'hod' || activeTab === 'principal') && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={requireMfa}
                    onChange={(e) => setRequireMfa(e.target.checked)}
                  />
                  <span>Enable Privileged Multi-Factor Authentication (MFA) check</span>
                </label>
                {requireMfa && (
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Enter 6-Digit Authenticator Code (Hint: 123456):</div>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="123456" 
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Forgot Password Flow (PRD 4.1 Account Recovery) */}
            {showForgotNotice && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <strong>Account Recovery Workflow (PRD 4.1 & 7.2):</strong>
                <p style={{ marginTop: '0.25rem', color: '#78350f', fontSize: '0.78rem' }}>
                  Contact your designated Department HOD or College Examination Section with your original College ID card and verified mobile OTP to reset your login credentials.
                </p>
              </div>
            )}

            {/* Quick Demo Pre-fill helper */}
            <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                <Sparkles size={14} style={{ color: '#f59e0b' }} />
                <span>Need test credentials?</span>
              </div>
              <button 
                type="button" 
                onClick={() => applyDemoCredentials(activeTab)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
              >
                Auto-fill Demo
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button 
              type="button" 
              onClick={() => setLoginModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.5rem' }}
            >
              <LogIn size={16} /> Authenticate & Access Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
