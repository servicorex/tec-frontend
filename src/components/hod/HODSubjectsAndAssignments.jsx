import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hodApi } from '../../services/api';
import { BookOpen, User, CheckCircle2, Plus, X, Layers, Filter } from 'lucide-react';

export default function HODSubjectsAndAssignments() {
  const { currentUser, showToast } = useAuth();
  const assignedBranch = currentUser?.profile?.department || 'CSE';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegulation, setSelectedRegulation] = useState('R20');
  const [selectedSemester, setSelectedSemester] = useState('Sem 4-1');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    year: '4th Year',
    semester: 'Sem 4-1',
    regulation: 'R20',
    type: 'Theory',
    credits: 3.0
  });

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await hodApi.getSubjects(selectedSemester, selectedRegulation);
      if (res) {
        setSubjects(res);
      }
    } catch (e) {
      console.warn("Backend subjects API unavailable, keeping local state:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [selectedSemester, selectedRegulation]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      showToast('Please fill in Subject Code and Subject Name', 'error');
      return;
    }

    const payload = {
      subjectCode: formData.code.trim().toUpperCase(),
      subjectName: formData.name.trim(),
      year: formData.year,
      semester: formData.semester,
      regulation: formData.regulation,
      subjectType: formData.type,
      credits: Number(formData.credits) || 3.0
    };

    try {
      const res = await hodApi.saveSubject(payload);
      showToast(`Subject ${payload.subjectCode} (${payload.regulation}) saved to curriculum!`, 'success');
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        year: '4th Year',
        semester: 'Sem 4-1',
        regulation: selectedRegulation,
        type: 'Theory',
        credits: 3.0
      });
      loadSubjects();
    } catch (err) {
      showToast(err.message || 'Failed to save subject', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', borderLeft: '4px solid #10b981' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
            Academic Curriculum Mapping
          </span>
          <h2 style={{ fontSize: '1.4rem', color: '#0e2154' }}>
            {assignedBranch} Subjects & Faculty Allocation Matrix
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
            Authorizes which faculty members manage and submit attendance for specific classes in {assignedBranch}.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={15} /> Add / Update Curriculum Course
        </button>
      </div>

      {/* Regulation & Semester Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Regulation:</span>
            <select
              value={selectedRegulation}
              onChange={e => setSelectedRegulation(e.target.value)}
              className="form-control"
              style={{ width: '110px', padding: '0.35rem 0.6rem', fontSize: '0.82rem' }}
            >
              <option value="R20">JNTU R20</option>
              <option value="R23">JNTU R23</option>
              <option value="R19">JNTU R19</option>
              <option value="R16">JNTU R16</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Semester:</span>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="form-control"
              style={{ width: '130px', padding: '0.35rem 0.6rem', fontSize: '0.82rem' }}
            >
              <option value="Sem 1-1">I B.Tech I Sem</option>
              <option value="Sem 1-2">I B.Tech II Sem</option>
              <option value="Sem 2-1">II B.Tech I Sem</option>
              <option value="Sem 2-2">II B.Tech II Sem</option>
              <option value="Sem 3-1">III B.Tech I Sem</option>
              <option value="Sem 3-2">III B.Tech II Sem</option>
              <option value="Sem 4-1">IV B.Tech I Sem</option>
              <option value="Sem 4-2">IV B.Tech II Sem</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Showing <strong>{subjects.length}</strong> registered subjects for {assignedBranch} ({selectedRegulation} • {selectedSemester})
        </div>
      </div>

      {/* Subject Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Regulation</th>
              <th>Year & Semester</th>
              <th>Credits</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  Loading department curriculum...
                </td>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', color: '#64748b', marginBottom: '0.75rem' }}>
                    <BookOpen size={20} />
                  </div>
                  <p style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    No subjects configured for {selectedRegulation} ({selectedSemester})
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '440px', margin: '0 auto 1rem auto' }}>
                    Different student batches or regulations study different syllabus sets. Click &quot;Add / Update Curriculum Course&quot; to configure subjects for this regulation.
                  </p>
                  <button onClick={() => setShowAddModal(true)} className="btn btn-outline-primary btn-sm">
                    <Plus size={13} /> Add Subject for {selectedRegulation}
                  </button>
                </td>
              </tr>
            ) : (
              subjects.map((item) => (
                <tr key={item.id || item.subjectCode}>
                  <td><strong style={{ color: '#1d4ed8' }}>{item.subjectCode}</strong></td>
                  <td><strong>{item.subjectName}</strong></td>
                  <td><span className="badge badge-primary">{item.regulation || 'R20'}</span></td>
                  <td>{item.year} • {item.semester}</td>
                  <td><strong>{item.credits}</strong></td>
                  <td>
                    <span className={`badge ${item.subjectType === 'Laboratory' ? 'badge-accent' : 'badge-success'}`}>
                      {item.subjectType || 'Theory'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem', background: '#fff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.15rem', color: '#0e2154', margin: 0 }}>Add / Update Curriculum Subject</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Subject Code *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. CS701PC" 
                  value={formData.code} 
                  onChange={e => setFormData({ ...formData, code: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Subject Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Machine Learning & Deep Learning" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Regulation</label>
                  <select 
                    className="form-control"
                    value={formData.regulation}
                    onChange={e => setFormData({ ...formData, regulation: e.target.value })}
                  >
                    <option value="R20">JNTUK R20</option>
                    <option value="R23">JNTUK R23</option>
                    <option value="R19">JNTUK R19</option>
                    <option value="R16">JNTUK R16</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Semester</label>
                  <select 
                    className="form-control"
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                  >
                    <option value="Sem 1-1">Sem 1-1 (I-I)</option>
                    <option value="Sem 1-2">Sem 1-2 (I-II)</option>
                    <option value="Sem 2-1">Sem 2-1 (II-I)</option>
                    <option value="Sem 2-2">Sem 2-2 (II-II)</option>
                    <option value="Sem 3-1">Sem 3-1 (III-I)</option>
                    <option value="Sem 3-2">Sem 3-2 (III-II)</option>
                    <option value="Sem 4-1">Sem 4-1 (IV-I)</option>
                    <option value="Sem 4-2">Sem 4-2 (IV-II)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Credits</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    className="form-control" 
                    value={formData.credits} 
                    onChange={e => setFormData({ ...formData, credits: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Subject Type</label>
                  <select 
                    className="form-control"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Theory">Theory</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Elective">Professional / Open Elective</option>
                    <option value="Project">Project / Seminar</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Subject to Curriculum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
