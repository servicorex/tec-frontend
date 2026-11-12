import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Mail, Phone, Building2, CheckCircle2, UserPlus, KeyRound, X, ShieldAlert, Key } from 'lucide-react';

export default function PrincipalHODManagement() {
  const { showToast, students = [], facultyList = [], departments = [], assignOrUpdateHOD, adminForcedPasswordReset } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeptForEdit, setSelectedDeptForEdit] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [formData, setFormData] = useState({
    departmentId: 'CSE',
    hodName: '',
    hodEmail: '',
    initialPassword: ''
  });

  const handleOpenAssignModal = (dept = null) => {
    if (dept) {
      setSelectedDeptForEdit(dept);
      setFormData({
        departmentId: dept.id,
        hodName: dept.hod,
        hodEmail: dept.hodEmail,
        initialPassword: `HOD_${dept.id}#2026`
      });
    } else {
      setSelectedDeptForEdit(null);
      setFormData({
        departmentId: departments[0]?.id || 'CSE',
        hodName: '',
        hodEmail: '',
        initialPassword: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveHOD = async (e) => {
    e.preventDefault();
    if (!formData.hodName.trim() || !formData.hodEmail.trim()) {
      showToast("Please provide both HOD name and institutional email.", "warning");
      return;
    }

    await assignOrUpdateHOD(formData);
    setIsModalOpen(false);
  };

  const handleOpenResetModal = (dept) => {
    setResetTargetUser(dept);
    setNewPasswordInput(`HOD_${dept.id}#2026`);
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (!resetTargetUser || !newPasswordInput.trim()) return;
    await adminForcedPasswordReset(resetTargetUser.hodEmail, newPasswordInput.trim());
    setIsResetModalOpen(false);
    setResetTargetUser(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', borderLeft: '4px solid #f59e0b' }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '0.4rem' }}>
            Academic Leadership
          </span>
          <h2 style={{ fontSize: '1.4rem', color: '#0e2154' }}>
            Heads of Department (HOD) Directory & Performance
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
            Direct leadership contacts, departmental compliance governance, and HOD authority provisioning.
          </p>
        </div>

        <button 
          onClick={() => handleOpenAssignModal()}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <UserPlus size={16} /> Provision / Reassign HOD
        </button>
      </div>

      {/* HOD Cards Grid */}
      <div className="grid-3">
        {departments.map(dept => (
          <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{dept.id} HOD</span>
                <span className="badge badge-success">Active Appointment</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                {dept.hod}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, marginBottom: '0.75rem' }}>
                Head of Department, {dept.name}
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={13} style={{ color: '#2563eb' }} />
                  <span style={{ color: '#1d4ed8' }}>{dept.hodEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ color: '#64748b' }}>Students under supervision:</span>
                  <strong>{students.filter(s => (s.department || s.branch || '').toUpperCase() === dept.id.toUpperCase()).length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Faculty under supervision:</span>
                  <strong>{facultyList.filter(f => (f.department || '').toUpperCase() === dept.id.toUpperCase()).length}</strong>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ color: '#059669', fontWeight: 700 }}>Avg Attendance: {dept.avgAttendance}%</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  onClick={() => handleOpenResetModal(dept)}
                  className="btn btn-outline btn-sm"
                  title="Direct password reset without old credentials"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem', borderColor: '#f59e0b', color: '#d97706' }}
                >
                  <Key size={11} /> Reset Key
                </button>
                <button 
                  onClick={() => handleOpenAssignModal(dept)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  Edit / Reassign
                </button>
                <button 
                  onClick={() => showToast(`Initiated correspondence with ${dept.hod} (${dept.hodEmail})`, "info")}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PROVISION / REASSIGN HOD */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} style={{ color: '#0e2154' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  {selectedDeptForEdit ? `Reassign HOD for ${selectedDeptForEdit.id}` : 'Provision New HOD Assignment'}
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveHOD}>
              <div className="modal-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#166534' }}>
                  <strong>Authority Transfer:</strong> Assigning a new HOD automatically grants them full departmental administrative rights over class rosters, student enrollments, and attendance validation.
                </div>

                <div className="form-group">
                  <label className="form-label">Department / Branch</label>
                  <select 
                    className="form-select"
                    value={formData.departmentId}
                    onChange={e => {
                      const d = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        departmentId: d,
                        hodEmail: prev.hodEmail || `hod.${d.toLowerCase()}@tecnrt.org`,
                        initialPassword: prev.initialPassword || `HOD_${d}#2026`
                      }));
                    }}
                    disabled={!!selectedDeptForEdit}
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.id} — {d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">HOD Full Name & Title</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    placeholder="e.g. Dr. K. Srinivasa Rao"
                    value={formData.hodName}
                    onChange={e => setFormData({ ...formData, hodName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Institutional Email (Login Username)</label>
                  <input 
                    type="email" 
                    className="form-input"
                    required
                    placeholder="e.g. hod.cse@tecnrt.org"
                    value={formData.hodEmail}
                    onChange={e => setFormData({ ...formData, hodEmail: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Password / Security Key</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    placeholder="e.g. HOD_CSE#2026"
                    value={formData.initialPassword}
                    onChange={e => setFormData({ ...formData, initialPassword: e.target.value })}
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    The newly appointed HOD will be prompted to verify and retain or update their security key upon first login.
                  </div>
                </div>

              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Provision HOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DIRECT PASSWORD RESET */}
      {isResetModalOpen && resetTargetUser && (
        <div className="modal-backdrop" onClick={() => setIsResetModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} style={{ color: '#d97706' }} />
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                  Reset HOD Security Key
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setIsResetModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmReset}>
              <div className="modal-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#92400e' }}>
                  <strong>Administrator Override:</strong> You can set a new security key for <strong>{resetTargetUser.hod}</strong> (<code>{resetTargetUser.hodEmail}</code>) directly without knowing their current password.
                </div>

                <div className="form-group">
                  <label className="form-label">New Password / Security Key</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    minLength={6}
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Recommended format: <code>HOD_{resetTargetUser.id}#2026</code>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsResetModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d97706', borderColor: '#d97706' }}>
                  Forcibly Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
