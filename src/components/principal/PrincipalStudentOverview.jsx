import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Search, Filter, Eye, X, Building2, Calendar, Layers, Key } from 'lucide-react';
import { normalizeYear, normalizeSemesterCode } from '../../data/mockData';

export default function PrincipalStudentOverview() {
  const { students, adminForcedPasswordReset } = useAuth();
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [search, setSearch] = useState('');
  const [activeStudentModal, setActiveStudentModal] = useState(null);
  const [resetModalStudent, setResetModalStudent] = useState(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  const academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const departmentsList = ['CSE', 'AIML', 'AIDS', 'IT', 'ECE', 'EEE'];
  const sectionsList = ['Sec A', 'Sec B', 'Sec C'];

  const filtered = useMemo(() => {
    return students.filter(s => {
      const sDept = (s.department || s.branch || 'CSE').toUpperCase();
      const sYear = normalizeYear(s.year);
      const sSec = (s.section || 'A').toUpperCase();

      const matchesDept = selectedDept === 'All' || sDept === selectedDept.toUpperCase();
      const matchesYear = selectedYear === 'All' || sYear === selectedYear;
      const matchesSection = selectedSection === 'All' || sSec === selectedSection.replace('Sec ', '').trim().toUpperCase();

      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        s.rollNumber.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q) ||
        (s.admissionNumber && s.admissionNumber.toLowerCase().includes(q));

      return matchesDept && matchesYear && matchesSection && matchesSearch;
    });
  }, [students, selectedDept, selectedYear, selectedSection, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', borderLeft: '4px solid #2563eb' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            Institution Records
          </span>
          <h2 style={{ fontSize: '1.4rem', color: '#0e2154', margin: 0 }}>
            College-Wide Student Enrollment Registry
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>
            Authorized institutional student drill-down organized across active engineering departments, academic years, and class sections.
          </p>
        </div>

        <div style={{ background: '#f0fdf4', padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534' }}>
            {filtered.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
            Enrolled Students
          </div>
        </div>
      </div>

      {/* Multi-Tier Hierarchical Filter Bar: Branch, Year, Section */}
      <div className="card" style={{ padding: '1.25rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Tier 1: Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by Roll Number, Name, or Admission ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Tier 2: Branch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '70px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Building2 size={13} /> Branch:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {departmentsList.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(prev => prev === dept ? 'All' : dept)}
                className={`btn btn-sm ${selectedDept === dept ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Tier 3: Academic Year Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '70px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} /> Year:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {academicYears.map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(prev => prev === yr ? 'All' : yr)}
                className={`btn btn-sm ${selectedYear === yr ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Tier 4: Section Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '70px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Layers size={13} /> Section:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {sectionsList.map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSection(prev => prev === sec ? 'All' : sec)}
                className={`btn btn-sm ${selectedSection === sec ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Students Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Year & Semester</th>
              <th>Section</th>
              <th>Attendance %</th>
              <th>CGPA</th>
              <th>Standing</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const isDetained = s.attendanceOverall < 65;
              const isCondonation = s.attendanceOverall < 75 && s.attendanceOverall >= 65;
              return (
                <tr key={s.id}>
                  <td><strong style={{ color: '#1d4ed8' }}>{s.rollNumber}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                  </td>
                  <td><span className="badge badge-primary">{s.department}</span></td>
                  <td>{s.year} ({s.semester})</td>
                  <td>Sec {s.section}</td>
                  <td>
                    <strong style={{ color: isDetained ? '#dc2626' : isCondonation ? '#d97706' : '#059669' }}>
                      {s.attendanceOverall}%
                    </strong>
                  </td>
                  <td><strong>{s.cgpa}</strong></td>
                  <td>
                    <span className={`badge ${isDetained ? 'badge-danger' : isCondonation ? 'badge-warning' : 'badge-success'}`}>
                      {isDetained ? 'Detention Warning' : isCondonation ? 'Condonation' : 'Eligible'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => {
                          setResetModalStudent(s);
                          setResetPasswordValue(s.rollNumber);
                        }}
                        className="btn btn-outline btn-sm"
                        title="Reset Student Password directly"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem', borderColor: '#f59e0b', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Key size={11} /> Reset Pass
                      </button>
                      <button 
                        onClick={() => setActiveStudentModal(s)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      >
                        <Eye size={12} /> View File
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Authorized Drill-down Student File Modal (PRD 4.4) */}
      {activeStudentModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header" style={{ background: '#0e2154', color: '#ffffff' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Official Student Confidential Record</h3>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                  Roll Number: {activeStudentModal.rollNumber} • {activeStudentModal.department}
                </div>
              </div>
              <button onClick={() => setActiveStudentModal(null)} style={{ background: 'none', border: 'none', color: '#cbd5e1' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <div>Legal Name: <strong>{activeStudentModal.name}</strong></div>
                <div>Parent: <strong>{activeStudentModal.fatherName}</strong></div>
                <div>Branch: <strong>{activeStudentModal.department}</strong></div>
                <div>Semester: <strong>{activeStudentModal.semester}</strong></div>
                <div>Admission: <strong>{activeStudentModal.admissionType}</strong></div>
                <div>Contact: <strong>{activeStudentModal.phone}</strong></div>
                <div>Attendance: <strong style={{ color: activeStudentModal.attendanceOverall >= 75 ? '#059669' : '#dc2626' }}>{activeStudentModal.attendanceOverall}%</strong></div>
                <div>Cumulative CGPA: <strong>{activeStudentModal.cgpa}</strong></div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569' }}>
                Address: {activeStudentModal.address}
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={() => {
                  const target = activeStudentModal;
                  setActiveStudentModal(null);
                  setResetModalStudent(target);
                  setResetPasswordValue(target.rollNumber);
                }} 
                className="btn btn-outline"
                style={{ borderColor: '#f59e0b', color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Key size={13} /> Reset Password
              </button>
              <button onClick={() => setActiveStudentModal(null)} className="btn btn-primary">Close File</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reset Student Password Modal */}
      {resetModalStudent && (
        <div className="modal-backdrop" onClick={() => setResetModalStudent(null)}>
          <div className="modal-dialog" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} style={{ color: '#d97706' }} />
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                  Reset Student Password
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setResetModalStudent(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await adminForcedPasswordReset(resetModalStudent.rollNumber, resetPasswordValue);
              setResetModalStudent(null);
            }}>
              <div className="modal-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#92400e' }}>
                  <strong>Administrator Override:</strong> Directly set a new password for student <strong>{resetModalStudent.name}</strong> (Roll: <code>{resetModalStudent.rollNumber}</code>). No prior password required.
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    minLength={6}
                    value={resetPasswordValue}
                    onChange={e => setResetPasswordValue(e.target.value)}
                    placeholder="Enter new student password"
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Default initial credentials can be set to the student's roll number (e.g., <code>{resetModalStudent.rollNumber}</code>).
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '1rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setResetModalStudent(null)}>
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
