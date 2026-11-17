import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FACULTY_MEMBERS, DEPARTMENTS } from '../../data/mockData';
import { Users, Search, Filter, Mail, Phone, BookOpen } from 'lucide-react';

export default function PrincipalFacultyOverview() {
  const { facultyList = [], departments = [] } = useAuth();
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');

  const activeFacultyList = facultyList.length > 0 ? facultyList : FACULTY_MEMBERS;
  const deptList = departments.length > 0 ? departments.map(d => d.id) : ['CSE', 'ECE', 'EEE', 'IT'];

  const filtered = activeFacultyList.filter(f => {
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    const matchesSearch = (f.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (f.staffId || '').toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#ffffff', borderLeft: '4px solid #10b981' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>
            College Human Resources
          </span>
          <h2 style={{ fontSize: '1.4rem', color: '#0e2154', margin: 0 }}>
            Institution Faculty Directory ({activeFacultyList.length} Staff Members)
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
            College-wide verified faculty teaching assignments, credentials, and departmental affiliations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search Faculty Name or Staff ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', ...deptList].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`btn btn-sm ${selectedDept === dept ? 'btn-primary' : 'btn-outline'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Identifier</th>
              <th>Faculty Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Contact</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>No faculty members registered</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Faculty appointments will appear once officially registered by HODs or Administration.
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(fac => (
                <tr key={fac.id}>
                  <td><strong style={{ color: '#1d4ed8' }}>{fac.staffId}</strong></td>
                  <td><strong>{fac.name}</strong></td>
                  <td>{fac.designation}</td>
                  <td><span className="badge badge-primary">{fac.department}</span></td>
                  <td>{fac.qualification}</td>
                  <td>{fac.experience}</td>
                  <td style={{ fontSize: '0.78rem', color: '#475569' }}>{fac.email}</td>
                  <td>
                    <span className={`badge ${fac.pendingUploads > 0 ? 'badge-warning' : 'badge-success'}`}>
                      {fac.pendingUploads > 0 ? 'Pending' : 'Verified Compliant'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
