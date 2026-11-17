import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { COLLEGE_INFO, DEPARTMENTS } from '../../data/mockData';
import StatCard from '../common/StatCard';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Percent, 
  Award, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function PrincipalOverview() {
  const { currentUser, setActiveTab, auditLogs, students = [], facultyList = [], departments = [] } = useAuth();
  const activeDepartments = departments.length > 0 ? departments : DEPARTMENTS;

  const totalStudents = students.length;
  const totalFaculty = facultyList.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Principal Executive Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #09142b 0%, #0e2154 50%, #17337f 100%)', 
        borderRadius: '16px', 
        padding: '1.75rem', 
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-lg)',
        borderLeft: '5px solid #f59e0b'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-accent">
              Principal Executive Suite
            </span>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem' }}>
              EAPCET Code: {COLLEGE_INFO.eamcetCode} • JNTUK Permanent Affiliation
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800 }}>
            Institutional Governance & Oversight
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Principal: <strong>{COLLEGE_INFO.principal.name}</strong> ({COLLEGE_INFO.principal.qualification}) • Tirumala Engineering College
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('student-overview')} 
            className="btn btn-accent btn-sm"
          >
            <GraduationCap size={15} /> Student Registry
          </button>
          <button 
            onClick={() => setActiveTab('hod-management')} 
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <Building2 size={15} /> HOD Leadership
          </button>
        </div>
      </div>

      {/* College-wide KPIs */}
      <div className="grid-4">
        <StatCard 
          title="Total Student Body"
          value={String(totalStudents)}
          subtitle={`${activeDepartments.length} Engineering Branches`}
          icon={GraduationCap}
          color="primary"
          badgeText="Active Scholars"
          badgeType="primary"
        />

        <StatCard 
          title="College Faculty Roster"
          value={String(totalFaculty)}
          subtitle={`Across ${activeDepartments.length} Engineering Depts`}
          icon={Users}
          color="purple"
          badgeText="Verified Staff"
          badgeType="primary"
        />

        <StatCard 
          title="College Attendance Avg"
          value="88.5%"
          subtitle="Mandatory JNTUK Benchmark"
          icon={Percent}
          color="success"
          badgeText="Institutional Safe"
          badgeType="success"
        />

        <StatCard 
          title="Campus Placements"
          value="88.4%"
          subtitle="Active Academic Cycle"
          icon={Award}
          color="accent"
          badgeText="2025-26 Batch"
          badgeType="success"
        />
      </div>

      {/* Cross-Department Comparison Table & Recent Audit Logs */}
      <div>
        {/* Live Institutional Audit Feed (PRD 4.4 & 13.15) */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Institutional Audit Stream</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Real-time log of administrative and attendance actions</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.slice(0, 6).map(log => (
              <div key={log.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: '#1d4ed8' }}>{log.action}</span>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: '#334155', lineHeight: 1.4 }}>
                  {log.details}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', color: '#64748b', fontSize: '0.7rem' }}>
                  <span>Actor: <strong>{log.user}</strong> ({log.role})</span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
