import { apiClient } from './apiClient';

export const authApi = {
  login: async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    if (res?.token) {
      apiClient.setToken(res.token);
    }
    return res;
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },

  logout: () => {
    apiClient.setToken(null);
  }
};

export const studentApi = {
  getDashboard: () => apiClient.get('/student/dashboard'),
  getProfile: () => apiClient.get('/student/profile'),
  updateProfile: (profileData) => apiClient.put('/student/profile', profileData),
  getAttendance: () => apiClient.get('/student/attendance'),
  getExams: () => apiClient.get('/student/exams'),
  getFees: () => apiClient.get('/student/fees'),
  getNotifications: () => apiClient.get('/student/notifications')
};

export const hodApi = {
  getOverview: () => apiClient.get('/hod/overview'),
  getSections: () => apiClient.get('/hod/sections'),
  createSection: (sectionName, academicYear) => apiClient.post('/hod/sections', { sectionName, academicYear }),
  getStudents: (year, section) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (section) params.append('section', section);
    const qs = params.toString();
    return apiClient.get(`/hod/students${qs ? `?${qs}` : ''}`);
  },
  createStudent: (studentData) => apiClient.post('/hod/students', studentData),
  batchProvision: (rollNumbers) => apiClient.post('/hod/students/provision/batch', { rollNumbers }),
  importStudentsCsv: (file, year, semester, section) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);
    formData.append('semester', semester);
    formData.append('section', section);
    return apiClient.post('/hod/students/import-csv', formData);
  },
  validateAttendance: (file, year, semester, section, period) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);
    formData.append('semester', semester);
    formData.append('section', section);
    formData.append('period', period);
    return apiClient.post('/hod/attendance/validate', formData);
  },
  publishAttendance: (file, year, semester, section, period, academicYear) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year);
    formData.append('semester', semester);
    formData.append('section', section);
    formData.append('period', period);
    if (academicYear) formData.append('academicYear', academicYear);
    return apiClient.post('/hod/attendance/publish', formData);
  },
  getFaculty: () => apiClient.get('/hod/faculty'),
  getStatutoryReport: (semester) => {
    const qs = semester ? `?semester=${encodeURIComponent(semester)}` : '';
    return apiClient.get(`/hod/reports/statutory${qs}`);
  },
  applyDetentionOverride: (summaryId, reason) => apiClient.post('/hod/reports/override', { summaryId, reason }),
  getSubjects: (semester, regulation) => {
    const params = new URLSearchParams();
    if (semester) params.append('semester', semester);
    if (regulation) params.append('regulation', regulation);
    const qs = params.toString();
    return apiClient.get(`/hod/subjects${qs ? `?${qs}` : ''}`);
  },
  saveSubject: (subjectData) => apiClient.post('/hod/subjects', subjectData)
};

export const adminApi = {
  getOverview: () => apiClient.get('/admin/overview'),
  getAuditLogs: (page = 0, size = 50) => apiClient.get(`/admin/audit-logs?page=${page}&size=${size}`),
  assignHod: (email, departmentId, initialPassword) => apiClient.post('/admin/hod', { email, departmentId, initialPassword }),
  resetUserPassword: (username, newPassword) => apiClient.post('/admin/reset-password', { username, newPassword })
};

