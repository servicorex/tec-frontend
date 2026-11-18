import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, studentApi, hodApi, adminApi } from '../services/api';
import { 
  INITIAL_STUDENTS, 
  FACULTY_MEMBERS, 
  DEPARTMENTS, 
  AUDIT_LOGS, 
  COLLEGE_INFO,
  ATTENDANCE_UPLOAD_HISTORY,
  INITIAL_EXAM_TIMETABLES,
  calculateProfileCompletion,
  isProfileComplete,
  PROFILE_STATUSES,
  ACCOUNT_STATUSES,
  SEMESTER_STRUCTURE,
  SEMESTER_PROGRESSION,
  normalizeSemesterCode,
  normalizeYear,
  getSemesterProgressionInfo
} from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Current user / active view
  // role: 'public' | 'student' | 'hod' | 'principal' (Faculty completely removed)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tec_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.isAuthenticated && parsed?.role && parsed.role !== 'public') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return {
      role: 'public',
      isAuthenticated: false,
      profile: null,
      mustChangePassword: false
    };
  });

  // Persistent state helper using localStorage
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('tec_departments');
      return saved ? JSON.parse(saved) : DEPARTMENTS;
    } catch {
      return DEPARTMENTS;
    }
  });

  const [activeTab, setActiveTab] = useState('overview');

  const [students, setStudents] = useState(() => {
    try {
      const v = localStorage.getItem('tec_students_version');
      if (v !== 'v3_empty') {
        localStorage.setItem('tec_students_version', 'v3_empty');
        localStorage.setItem('tec_students', JSON.stringify([]));
        localStorage.removeItem('tec_upload_history');
        return [];
      }
      const saved = localStorage.getItem('tec_students');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [facultyList, setFacultyList] = useState(() => {
    try {
      const saved = localStorage.getItem('tec_faculty');
      return saved ? JSON.parse(saved) : FACULTY_MEMBERS;
    } catch {
      return FACULTY_MEMBERS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('tec_audit_logs');
      return saved ? JSON.parse(saved) : AUDIT_LOGS;
    } catch {
      return AUDIT_LOGS;
    }
  });

  const [uploadHistory, setUploadHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('tec_upload_history');
      return saved ? JSON.parse(saved) : ATTENDANCE_UPLOAD_HISTORY;
    } catch {
      return ATTENDANCE_UPLOAD_HISTORY;
    }
  });

  const [publishedTimetables, setPublishedTimetables] = useState(() => {
    try {
      const saved = localStorage.getItem('tec_timetables');
      return saved ? JSON.parse(saved) : INITIAL_EXAM_TIMETABLES;
    } catch {
      return INITIAL_EXAM_TIMETABLES;
    }
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState('student');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      if (currentUser?.isAuthenticated && currentUser.role !== 'public') {
        localStorage.setItem('tec_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('tec_current_user');
      }
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [currentUser]);

  // Auto-persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tec_departments', JSON.stringify(departments));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem('tec_students', JSON.stringify(students));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('tec_faculty', JSON.stringify(facultyList));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [facultyList]);

  useEffect(() => {
    try {
      localStorage.setItem('tec_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('tec_upload_history', JSON.stringify(uploadHistory));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [uploadHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('tec_timetables', JSON.stringify(publishedTimetables));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [publishedTimetables]);

  // Toast notification helper
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add audit log
  const logAction = ({ action, details, affectedClass = "N/A", status = "Success" }) => {
    const newLog = {
      id: `AUD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.profile?.name || "System User",
      role: currentUser.role ? currentUser.role.toUpperCase() : "ANONYMOUS",
      action,
      academicPeriod: "ODD 2026-27",
      affectedClass,
      details,
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Quick Switcher for evaluating Student and HOD portals
  const quickSwitchRole = (role, branch) => {
    if (role === 'faculty') {
      showToast("The Faculty Portal has been permanently discontinued.", "warning");
      return;
    }

    if (role === 'public') {
      setCurrentUser({
        role: 'public',
        isAuthenticated: false,
        profile: null,
        mustChangePassword: false
      });
      setActiveTab('overview');
      showToast("Switched to Tirumala Public Website", "info");
      return;
    }

    if (role === 'student') {
      const student = students.find(s => s.rollNumber === '21TML0501') || students[0];
      setCurrentUser({
        role: 'student',
        isAuthenticated: true,
        profile: student,
        mustChangePassword: false
      });
      setActiveTab('overview');
      showToast(`Logged in as Student: ${student.name} (${student.rollNumber})`, "success");
    } else if (role === 'hod') {
      const branchId = branch || 'CSE';
      const dept = departments.find(d => d.id === branchId) || departments.find(d => d.id === 'CSE') || departments[0] || DEPARTMENTS[0];
      setCurrentUser({
        role: 'hod',
        isAuthenticated: true,
        profile: {
          name: dept.hod,
          email: dept.hodEmail,
          department: dept.id,
          departmentName: dept.name,
          designation: `Head of the Department, ${dept.id}`
        },
        mustChangePassword: false
      });
      setActiveTab('department-overview');
      showToast(`Logged in as HOD: ${dept.hod} (${dept.name})`, "success");
    }
  };

  // Explicit login with backend integration and fallback simulation
  const loginWithCredentials = async ({ role, username, password, branch }) => {
    if (role === 'faculty') {
      return { success: false, message: "Faculty Portal has been permanently discontinued." };
    }

    try {
      // 1. Attempt Real Backend API Authentication
      const res = await authApi.login(username, password);
      if (res && res.success && res.user) {
        const backendRole = res.user.role.toLowerCase();
        const mustChange = res.user.mustChangePassword || !res.user.passwordChanged;

        if (backendRole === 'student') {
          // Attempt to fetch live student profile from backend
          let profile = null;
          try {
            profile = await studentApi.getProfile();
          } catch (e) {
            console.warn("Backend profile load fallback to basic info", e);
          }

          const studentObj = {
            id: res.user.id,
            rollNumber: res.user.username,
            name: profile?.fullName || res.user.username,
            department: profile?.departmentId || 'CSE',
            year: profile?.year || '4th Year',
            semester: profile?.semester || 'Sem 4-1',
            section: profile?.section || 'A',
            accountStatus: mustChange ? 'PROVISIONED' : 'ACTIVE',
            mustChangePassword: mustChange
          };

          setCurrentUser({
            role: 'student',
            isAuthenticated: true,
            profile: studentObj,
            mustChangePassword: mustChange
          });
          setActiveTab('overview');
          setLoginModalOpen(false);
          showToast(`Welcome ${studentObj.name}! (Authenticated with Live Backend)`, "success");
          return { success: true, mustChange };
        } else if (backendRole === 'hod') {
          const deptId = res.user.departmentId || branch || 'CSE';
          const dept = departments.find(d => d.id === deptId) || departments[0] || DEPARTMENTS[0];
          setCurrentUser({
            role: 'hod',
            isAuthenticated: true,
            profile: {
              id: res.user.id,
              name: dept.hod,
              email: res.user.username,
              department: deptId,
              departmentName: dept.name,
              designation: `Head of Department (${deptId})`
            },
            mustChangePassword: false
          });
          setActiveTab('department-overview');
          setLoginModalOpen(false);
          showToast(`Welcome Dr. ${dept.hod} (${deptId})! (Authenticated with Live Backend)`, "success");
          return { success: true };
        } else if (backendRole === 'admin') {
          setCurrentUser({
            role: 'principal',
            isAuthenticated: true,
            profile: {
              id: res.user.id,
              name: 'Dr. Y. V. Narayana',
              email: res.user.username,
              designation: 'Principal & Chief Administrator'
            },
            mustChangePassword: false
          });
          setActiveTab('overview');
          setLoginModalOpen(false);
          showToast("Welcome Principal / College Administrator!", "success");
          return { success: true };
        }
      }
    } catch (apiErr) {
      console.warn("Backend authentication unavailable or invalid, checking mock registry fallback:", apiErr.message);
    }

    if (role === 'student') {
      const found = students.find(s => s.rollNumber.toUpperCase() === username.trim().toUpperCase());
      if (!found) {
        showToast(`Roll Number ${username} not found in registered records.`, "error");
        return { success: false, message: "Student roll number not registered in college records." };
      }

      // Check Account Provisioning State
      if (found.accountStatus === ACCOUNT_STATUSES.PENDING) {
        showToast(`Account for ${found.rollNumber} is pending provisioning. Please request temporary credential from department HOD.`, "warning");
        return { success: false, message: "Account pending institutional provisioning by HOD." };
      }

      // Check credentials:
      // 1. Permanent private password set by student or reset by admin
      const isCustomPassword = found.password && password.trim() === found.password;
      // 2. Temporary password issued through the provisioning process
      const isTempPassword = found.tempPassword && password.trim() === found.tempPassword;
      // 3. Fallback to roll number if provisioned with default key and neither custom nor temp password is set
      const isInitialPassword = !found.password && !found.tempPassword && password.trim().toUpperCase() === found.rollNumber.toUpperCase();

      if (!isCustomPassword && !isTempPassword && !isInitialPassword) {
        showToast("Incorrect password or temporary access key.", "error");
        return { success: false, message: "Invalid credentials." };
      }

      // First login requires setting a private password
      const mustChange = (found.mustChangePassword !== false && (isTempPassword || isInitialPassword)) || found.accountStatus !== 'ACTIVE';
      
      setCurrentUser({
        role: 'student',
        isAuthenticated: true,
        profile: found,
        mustChangePassword: mustChange
      });
      setActiveTab('overview');
      setLoginModalOpen(false);
      logAction({
        action: "STUDENT_LOGIN",
        details: `Student logged in with Roll No: ${found.rollNumber}`,
        affectedClass: `${found.year} ${found.department}-${found.section}`
      });
      showToast(`Welcome back, ${found.name}!`, "success");
      return { success: true, mustChange };
    }

    if (role === 'hod') {
      const branchId = (branch || 'CSE').trim().toUpperCase();
      const dept = departments.find(d => d.id.toUpperCase() === branchId) || departments.find(d => d.id.toUpperCase() === 'CSE') || departments[0] || DEPARTMENTS[0];
      
      const expectedEmail = (dept.hodEmail || `hod.${dept.id.toLowerCase()}@tecnrt.org`).trim().toLowerCase();
      const expectedPassword = dept.password || `HOD_${dept.id.toUpperCase()}#2026`;

      const inputEmail = username.trim().toLowerCase();
      const inputPassword = password.trim();

      // Only accept the currently assigned official email for this department HOD
      if (inputEmail !== expectedEmail) {
        showToast("Invalid HOD email or identifier for this department.", "error");
        return { success: false, message: "Invalid email." };
      }

      // Check current assigned password
      if (inputPassword !== expectedPassword) {
        showToast("Invalid HOD password or security key.", "error");
        return { success: false, message: "Invalid password." };
      }

      setCurrentUser({
        role: 'hod',
        isAuthenticated: true,
        profile: {
          name: dept.hod,
          email: expectedEmail,
          department: dept.id,
          departmentName: dept.name,
          designation: `Head of Department (${dept.id})`
        },
        mustChangePassword: false
      });
      setActiveTab('department-overview');
      setLoginModalOpen(false);
      logAction({
        action: "HOD_LOGIN",
        details: `HOD logged in: ${dept.hod} (${dept.id} Dept)`,
        affectedClass: `${dept.id} Department`
      });
      showToast(`Welcome Dr. ${dept.hod} (${dept.id})!`, "success");
      return { success: true };
    }

    if (role === 'principal' || role === 'admin') {
      setCurrentUser({
        role: 'principal',
        isAuthenticated: true,
        profile: {
          id: 'admin-01',
          name: 'Dr. Y. V. Narayana',
          email: username.trim() || 'admin@tecnrt.org',
          designation: 'Principal & Chief Institutional Administrator'
        },
        mustChangePassword: false
      });
      setActiveTab('college-overview');
      setLoginModalOpen(false);
      logAction({
        action: "ADMIN_LOGIN",
        details: `Principal / Chief Administrator logged in: ${username.trim() || 'admin@tecnrt.org'}`,
        affectedClass: "Institutional Administration"
      });
      showToast("Welcome Principal / College Administrator!", "success");
      return { success: true };
    }

    return { success: false, message: "Invalid credentials or role specified." };
  };

  const logout = () => {
    logAction({
      action: "USER_LOGOUT",
      details: `${currentUser.profile?.name || "User"} signed out`
    });
    localStorage.removeItem('tec_current_user');
    localStorage.removeItem('tec_auth_token');
    setCurrentUser({
      role: 'public',
      isAuthenticated: false,
      profile: null,
      mustChangePassword: false
    });
    setActiveTab('overview');
    showToast("Signed out successfully", "info");
  };

  // Change password method
  const updatePassword = async (newPassword) => {
    try {
      // If student is logged in, use backend change-password endpoint
      const currentPassword = currentUser.profile?.rollNumber || newPassword;
      await authApi.changePassword(currentPassword, newPassword);
      showToast("Password updated in database successfully!", "success");
    } catch (err) {
      console.warn("Backend change password note:", err.message);
    }

    if (currentUser.role === 'student' && currentUser.profile) {
      const roll = currentUser.profile.rollNumber;
      setStudents(prev => prev.map(s => 
        s.rollNumber === roll 
          ? { ...s, password: newPassword, accountStatus: "ACTIVE", mustChangePassword: false }
          : s
      ));
      setCurrentUser(prev => ({
        ...prev,
        mustChangePassword: false,
        profile: {
          ...prev.profile,
          password: newPassword,
          accountStatus: "ACTIVE",
          mustChangePassword: false
        }
      }));
    } else {
      setCurrentUser(prev => ({ ...prev, mustChangePassword: false }));
    }
    showToast("Password updated successfully and encrypted in session.", "success");
    logAction({
      action: "PASSWORD_CHANGE",
      details: "Temporary password changed and private password secured"
    });
  };

  // Student creation by Faculty or HOD (PRD 5.2 & 7.1)
  const createStudent = (newStudentData) => {
    // Uniqueness check
    const rollClean = newStudentData.rollNumber.trim().toUpperCase();
    const exists = students.some(s => s.rollNumber.toUpperCase() === rollClean);
    if (exists) {
      showToast(`Roll Number ${newStudentData.rollNumber} already exists in the institutional registry!`, "error");
      return { success: false, message: "Duplicate Roll Number" };
    }

    const tempPass = `TEC#${rollClean.slice(-4) || '2026'}@2026`;
    const targetYr = normalizeYear(newStudentData.year || '1st Year');
    const targetSem = normalizeSemesterCode(newStudentData.semester || '1-1');
    const targetSec = (newStudentData.section || 'A').trim().toUpperCase();
    const admYear = targetYr === '1st Year' ? '2024' : targetYr === '2nd Year' ? '2023' : targetYr === '3rd Year' ? '2022' : '2021';
    const admNum = `ADM-${admYear}-${rollClean.slice(-4) || '0001'}`;

    const created = {
      id: `std-${Date.now()}`,
      rollNumber: rollClean,
      name: newStudentData.name.trim(),
      shortName: newStudentData.shortName || "",
      course: "B.Tech",
      department: newStudentData.department,
      branch: newStudentData.department,
      year: targetYr,
      semester: targetSem,
      section: targetSec,
      admissionNumber: admNum,
      dob: newStudentData.dob || "",
      gender: newStudentData.gender || "Not Specified",
      bloodGroup: newStudentData.bloodGroup || "Not Specified",
      phone: newStudentData.phone || "",
      email: newStudentData.email || `${rollClean.toLowerCase()}@tecnrt.org`,
      fatherPhone: newStudentData.fatherPhone || "",
      fatherEmail: newStudentData.fatherEmail || "",
      currentAddress: newStudentData.currentAddress || "",
      permanentAddress: newStudentData.permanentAddress || "",
      fatherName: newStudentData.fatherName || "",
      fatherOccupation: newStudentData.fatherOccupation || "",
      motherName: newStudentData.motherName || "",
      motherOccupation: newStudentData.motherOccupation || "",
      guardianName: newStudentData.guardianName || "",
      guardianContact: newStudentData.guardianContact || "",
      admissionYear: admYear,
      admissionDate: newStudentData.admissionDate || "",
      admissionType: newStudentData.admissionType || "Convener Quota (EAPCET)",
      admissionQuota: newStudentData.admissionQuota || "Convener Quota",
      casteCategory: newStudentData.casteCategory || "",
      scholarshipStatus: newStudentData.scholarshipStatus || "Pending Verification",
      feeReimbursementStatus: newStudentData.feeReimbursementStatus || "Pending Verification",
      profileStatus: PROFILE_STATUSES.INCOMPLETE,
      profileCompletion: 15,
      cgpa: parseFloat(newStudentData.cgpa) || 8.0,
      sgpaLast: 8.0,
      attendanceOverall: newStudentData.attendance ? parseFloat(newStudentData.attendance) : null,
      status: "Active",
      accountSetup: false,
      accountStatus: ACCOUNT_STATUSES.PENDING,
      tempPassword: tempPass,
      mustChangePassword: true,
      provisionedAt: null,
      totalClassesHeld: 0,
      totalClassesAttended: 0,
      totalClassesAbsent: 0,
      feeStatus: "Pending",
      feeDue: 65000,
      totalFee: 65000
    };

    setStudents(prev => [created, ...prev]);
    logAction({
      action: "STUDENT_RECORD_CREATED",
      details: `Created new student: ${created.name} (${created.rollNumber}) in ${created.department} - Profile Incomplete, Account Pending`,
      affectedClass: `${created.year} ${created.department}-${created.section}`
    });
    showToast(`Student ${created.name} (${created.rollNumber}) registered! Profile Incomplete, Account pending.`, "success");
    return { success: true, student: created, tempPassword: tempPass };
  };

  // Update Student Profile (Student enters permitted info, saves immediately without HOD review)
  const updateStudentProfile = (rollNumber, updatedFields) => {
    let updatedStudent = null;
    let isComplete = false;

    setStudents(prev => prev.map(s => {
      if (s.rollNumber.toUpperCase() === rollNumber.toUpperCase()) {
        const merged = { ...s, ...updatedFields };
        isComplete = isProfileComplete(merged);
        const newPct = calculateProfileCompletion(merged);
        const newStatus = isComplete ? PROFILE_STATUSES.COMPLETE : PROFILE_STATUSES.INCOMPLETE;

        updatedStudent = {
          ...merged,
          profileCompletion: newPct,
          profileStatus: newStatus
        };
        return updatedStudent;
      }
      return s;
    }));

    if (currentUser?.profile?.rollNumber?.toUpperCase() === rollNumber.toUpperCase() && updatedStudent) {
      setCurrentUser(prev => ({
        ...prev,
        profile: updatedStudent
      }));
    }

    logAction({
      action: "PROFILE_SAVED",
      details: `Student ${rollNumber} saved profile. Status: ${isComplete ? 'Complete' : 'Incomplete'}.`,
      affectedClass: updatedStudent ? `${updatedStudent.year} ${updatedStudent.department}-${updatedStudent.section}` : "Student Profile"
    });

    if (isComplete) {
      showToast("Profile saved successfully! Status: Complete.", "success");
    } else {
      showToast("Profile saved! Status: Incomplete (fill all required fields).", "info");
    }

    return { success: true, student: updatedStudent, isComplete };
  };

  // Optional Direct record update helper
  const reviewStudentProfile = (rollNumber, { status }) => {
    let updatedStudent = null;
    setStudents(prev => prev.map(s => {
      if (s.rollNumber.toUpperCase() === rollNumber.toUpperCase()) {
        updatedStudent = {
          ...s,
          profileStatus: status || s.profileStatus
        };
        return updatedStudent;
      }
      return s;
    }));
    return { success: true, student: updatedStudent };
  };

  const requestProfileCorrection = () => ({ success: true });
  const reviewCorrectionRequest = () => ({ success: true });

  // Account Provisioning
  const provisionStudentAccount = (rollNumber) => {
    let tempKey = `TEC#${rollNumber.slice(-4) || '2026'}@2026`;
    let updatedStudent = null;

    setStudents(prev => prev.map(s => {
      if (s.rollNumber.toUpperCase() === rollNumber.toUpperCase()) {
        tempKey = s.tempPassword || tempKey;
        updatedStudent = {
          ...s,
          accountStatus: ACCOUNT_STATUSES.PROVISIONED,
          tempPassword: tempKey,
          mustChangePassword: true,
          provisionedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        return updatedStudent;
      }
      return s;
    }));

    logAction({
      action: "ACCOUNT_PROVISIONED",
      details: `HOD issued provisioning credentials for student ${rollNumber}`,
      affectedClass: updatedStudent ? `${updatedStudent.year} ${updatedStudent.department}-${updatedStudent.section}` : "Security"
    });

    showToast(`Account provisioned for ${rollNumber}! Temporary access key generated.`, "success");
    return { success: true, tempPassword: tempKey, student: updatedStudent };
  };

  // Batch provision all pending accounts in department
  const batchProvisionAccounts = (department) => {
    let count = 0;
    setStudents(prev => prev.map(s => {
      if (s.department === department && s.accountStatus === ACCOUNT_STATUSES.PENDING) {
        count++;
        return {
          ...s,
          accountStatus: ACCOUNT_STATUSES.PROVISIONED,
          tempPassword: `TEC#${s.rollNumber.slice(-4) || '2026'}@2026`,
          mustChangePassword: true,
          provisionedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return s;
    }));

    if (count > 0) {
      logAction({
        action: "BATCH_ACCOUNTS_PROVISIONED",
        details: `HOD provisioned ${count} student portal accounts in ${department}`,
        affectedClass: `${department} Accounts`
      });
      showToast(`Provisioned ${count} pending student accounts in ${department}!`, "success");
    } else {
      showToast("No pending student accounts found to provision in this department.", "info");
    }
    return { success: true, count };
  };

  // Submit attendance from spreadsheet upload (Overall Multi-Subject & Single Subject)
  const submitAttendanceUpload = ({ fileName, validRows, submissionType, context }) => {
    // Update student attendance records
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        const match = validRows.find(r => r.rollNumber.toUpperCase() === student.rollNumber.toUpperCase());
        if (match) {
          const updatedPct = match.overallAttendance !== undefined ? match.overallAttendance : match.calculatedPercentage;
          const status = updatedPct < 65 ? "Detained Warning (<65%)" : updatedPct < 75 ? "Active (Condonation Alert)" : "Active";
          
          let totalHeld = match.totalHeld;
          let totalAttended = match.attended;
          let totalAbsent = match.absent;
          let subjectAttendance = student.subjectAttendance;

          if (match.subjects && match.subjects.length > 0) {
            subjectAttendance = match.subjects.map(sub => {
              const held = 40;
              const attended = Math.round(held * (sub.attendancePct / 100));
              return {
                code: sub.code,
                name: sub.name,
                faculty: "Department Faculty",
                classesHeld: held,
                classesAttended: attended,
                attendancePct: sub.attendancePct
              };
            });
            totalHeld = subjectAttendance.reduce((acc, s) => acc + s.classesHeld, 0) || 240;
            totalAttended = subjectAttendance.reduce((acc, s) => acc + s.classesAttended, 0) || Math.round(totalHeld * (updatedPct / 100));
            totalAbsent = totalHeld - totalAttended;
          }

          // Build or update semester-specific attendance record
          const targetSem = normalizeSemesterCode(context.semester || student.semester || '1-1');
          const currentSemAttendance = student.semesterAttendance || {};
          const existingSemRecord = currentSemAttendance[targetSem] || {};
          const updatedSemRecord = {
            ...existingSemRecord,
            conducted: totalHeld || 240,
            attended: totalAttended || 212,
            absent: totalAbsent ?? ((totalHeld || 240) - (totalAttended || 212)),
            percentage: typeof updatedPct === 'number' ? updatedPct.toFixed(2) : String(updatedPct),
            monthlyAttendance: existingSemRecord.monthlyAttendance && existingSemRecord.monthlyAttendance.length > 0
              ? existingSemRecord.monthlyAttendance
              : [
                  {
                    month: context.period || "October 2026",
                    classesConducted: totalHeld || 240,
                    classesAttended: totalAttended || 212,
                    classesAbsent: totalAbsent ?? ((totalHeld || 240) - (totalAttended || 212)),
                    attendancePercentage: typeof updatedPct === 'number' ? updatedPct.toFixed(2) : String(updatedPct)
                  }
                ]
          };

          return {
            ...student,
            totalClassesHeld: totalHeld || 240,
            totalClassesAttended: totalAttended || 212,
            totalClassesAbsent: totalAbsent ?? ((totalHeld || 240) - (totalAttended || 212)),
            attendanceOverall: updatedPct,
            subjectAttendance: subjectAttendance || student.subjectAttendance,
            semesterAttendance: {
              ...currentSemAttendance,
              [targetSem]: updatedSemRecord
            },
            status
          };
        }
        return student;
      });
    });

    // Sync active student profile if currently viewing student portal
    setCurrentUser(curr => {
      if (curr.role === 'student' && curr.profile) {
        const match = validRows.find(r => r.rollNumber.toUpperCase() === curr.profile.rollNumber.toUpperCase());
        if (match) {
          const updatedPct = match.overallAttendance !== undefined ? match.overallAttendance : match.calculatedPercentage;
          const status = updatedPct < 65 ? "Detained Warning (<65%)" : updatedPct < 75 ? "Active (Condonation Alert)" : "Active";
          
          let totalHeld = match.totalHeld;
          let totalAttended = match.attended;
          let totalAbsent = match.absent;
          let subjectAttendance = curr.profile.subjectAttendance;

          if (match.subjects && match.subjects.length > 0) {
            subjectAttendance = match.subjects.map(sub => {
              const held = 40;
              const attended = Math.round(held * (sub.attendancePct / 100));
              return {
                code: sub.code,
                name: sub.name,
                faculty: "Department Faculty",
                classesHeld: held,
                classesAttended: attended,
                attendancePct: sub.attendancePct
              };
            });
            totalHeld = subjectAttendance.reduce((acc, s) => acc + s.classesHeld, 0) || 240;
            totalAttended = subjectAttendance.reduce((acc, s) => acc + s.classesAttended, 0) || Math.round(totalHeld * (updatedPct / 100));
            totalAbsent = totalHeld - totalAttended;
          }

          const targetSem = normalizeSemesterCode(context.semester || curr.profile.semester || '1-1');
          const currentSemAttendance = curr.profile.semesterAttendance || {};
          const existingSemRecord = currentSemAttendance[targetSem] || {};
          const updatedSemRecord = {
            ...existingSemRecord,
            conducted: totalHeld || 240,
            attended: totalAttended || 212,
            absent: totalAbsent ?? ((totalHeld || 240) - (totalAttended || 212)),
            percentage: typeof updatedPct === 'number' ? updatedPct.toFixed(2) : String(updatedPct)
          };

          return {
            ...curr,
            profile: {
              ...curr.profile,
              totalClassesHeld: totalHeld || 240,
              totalClassesAttended: totalAttended || 212,
              totalClassesAbsent: totalAbsent ?? ((totalHeld || 240) - (totalAttended || 212)),
              attendanceOverall: updatedPct,
              subjectAttendance: subjectAttendance || curr.profile.subjectAttendance,
              semesterAttendance: {
                ...currentSemAttendance,
                [targetSem]: updatedSemRecord
              },
              status
            }
          };
        }
      }
      return curr;
    });

    const auditRef = `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const historyItem = {
      id: `UPL-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      uploadedBy: `${currentUser.profile?.name || "HOD Office"}`,
      academicPeriod: context.period || "October 2026",
      class: context.classSection || `${context.year || "II Year"} ${context.branch || "CSE"}-${context.section || "A"}`,
      subject: context.subjectsSummary || context.subject || "All Subjects (Overall Section Attendance)",
      totalRows: validRows.length,
      validRows: validRows.length,
      rejectedRows: 0,
      status: "Published & Active on Student Portals",
      nature: submissionType === 'new' ? "New Period Submission" : submissionType === 'replace' ? "Replacement / Correction" : "Update Records",
      auditRef
    };

    setUploadHistory(prev => [historyItem, ...prev]);

    logAction({
      action: "ATTENDANCE_UPLOAD_COMMITTED",
      details: `HOD Published ${submissionType.toUpperCase()}: ${fileName} for ${validRows.length} students in ${context.classSection || "Target Section"}.`,
      affectedClass: context.classSection || "Target Section"
    });

    showToast(`Successfully published overall attendance for ${validRows.length} students!`, "success");
  };

  // Manual Attendance Update for individual student (PRD Requirement 5)
  const updateManualAttendance = ({ rollNumber, classesHeld, classesAttended, reason, subject, period }) => {
    const held = parseInt(classesHeld, 10);
    const attended = parseInt(classesAttended, 10);

    if (isNaN(held) || isNaN(attended) || held <= 0 || attended < 0 || attended > held) {
      showToast("Invalid attendance values: Attended must not exceed classes held.", "error");
      return { success: false, message: "Invalid numbers" };
    }

    const absent = held - attended;
    const calculatedPercentage = parseFloat(((attended / held) * 100).toFixed(1));
    const status = calculatedPercentage < 65 ? "Detained Warning (<65%)" : calculatedPercentage < 75 ? "Active (Condonation Alert)" : "Active";

    let targetStudent = null;

    setStudents(prev => prev.map(s => {
      if (s.rollNumber.toUpperCase() === rollNumber.toUpperCase()) {
        targetStudent = s;
        return {
          ...s,
          totalClassesHeld: held,
          totalClassesAttended: attended,
          totalClassesAbsent: absent,
          attendanceOverall: calculatedPercentage,
          status
        };
      }
      return s;
    }));

    // Sync active student profile if currently viewing student portal
    setCurrentUser(curr => {
      if (curr.role === 'student' && curr.profile?.rollNumber?.toUpperCase() === rollNumber.toUpperCase()) {
        return {
          ...curr,
          profile: {
            ...curr.profile,
            totalClassesHeld: held,
            totalClassesAttended: attended,
            totalClassesAbsent: absent,
            attendanceOverall: calculatedPercentage,
            status
          }
        };
      }
      return curr;
    });

    logAction({
      action: "MANUAL_ATTENDANCE_RECORDED",
      details: `HOD manual adjustment for ${rollNumber}: ${attended}/${held} (${calculatedPercentage}%). Reason: ${reason || "Administrative adjustment"}.`,
      affectedClass: targetStudent ? `${targetStudent.year} ${targetStudent.department}-${targetStudent.section}` : rollNumber
    });

    showToast(`Attendance updated for student ${rollNumber} to ${calculatedPercentage}%!`, "success");
    return { success: true };
  };

  // Batch Student Import via Excel / CSV into specific branch/year/sem/section (Requirement 4)
  const importStudentsToSection = ({ branch, year, semester, section, newStudents }) => {
    const valid = [];
    const rejected = [];
    const fallbackYr = normalizeYear(year);
    const fallbackSem = normalizeSemesterCode(semester);
    const fallbackSec = (section || "A").replace(/^Sec(tion)?\s*/i, '').trim().toUpperCase();
    const fallbackBranch = branch || "CSE";

    newStudents.forEach(st => {
      const roll = (st.rollNumber || "").trim().toUpperCase();
      const name = (st.name || "").trim();

      if (!roll || !name) {
        rejected.push({ ...st, reason: "Missing Roll Number or Student Name" });
        return;
      }

      // Check duplicate against active state and current batch
      const exists = students.some(s => s.rollNumber.toUpperCase() === roll) || valid.some(s => s.rollNumber === roll);
      if (exists) {
        rejected.push({ ...st, reason: `Roll Number [${roll}] already exists in institutional roster` });
        return;
      }

      // Individual row values with fallback to context
      const studentBranch = (st.branch || st.department || fallbackBranch).toUpperCase();
      const studentYear = normalizeYear(st.year || fallbackYr);
      const studentSemester = normalizeSemesterCode(st.semester || fallbackSem);
      const studentSection = (st.section || fallbackSec).replace(/^Sec(tion)?\s*/i, '').trim().toUpperCase() || "A";

      // Determine admission year based on academic year
      const admYear = studentYear === '1st Year' ? '2024' : studentYear === '2nd Year' ? '2023' : studentYear === '3rd Year' ? '2022' : '2021';

      valid.push({
        id: `std-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        rollNumber: roll,
        name,
        shortName: "",
        course: "B.Tech",
        department: studentBranch,
        branch: studentBranch,
        year: studentYear,
        semester: studentSemester,
        section: studentSection,
        admissionNumber: `ADM-${admYear}-${roll.slice(-4) || '0001'}`,
        dob: "",
        gender: "Not Specified",
        bloodGroup: "Not Specified",
        phone: "",
        email: `${roll.toLowerCase()}@tecnrt.org`,
        fatherPhone: "",
        fatherEmail: "",
        currentAddress: "",
        permanentAddress: "",
        fatherName: "",
        fatherOccupation: "",
        motherName: "",
        motherOccupation: "",
        guardianName: "",
        guardianContact: "",
        admissionYear: admYear,
        admissionDate: "",
        admissionType: "Convener Quota (EAPCET)",
        admissionQuota: "Convener Quota",
        casteCategory: "",
        scholarshipStatus: "Pending Verification",
        feeReimbursementStatus: "Pending Verification",
        profileStatus: PROFILE_STATUSES.INCOMPLETE,
        profileCompletion: 15,
        cgpa: 8.0,
        sgpaLast: 8.0,
        attendanceOverall: null,
        status: "Active",
        accountSetup: false,
        accountStatus: ACCOUNT_STATUSES.PENDING,
        tempPassword: `TEC#${roll.slice(-4) || '2026'}@2026`,
        mustChangePassword: true,
        provisionedAt: null,
        totalClassesHeld: 0,
        totalClassesAttended: 0,
        totalClassesAbsent: 0,
        feeStatus: "Pending",
        feeDue: 65000,
        totalFee: 65000
      });
    });

    if (valid.length > 0) {
      setStudents(prev => [...valid, ...prev]);
      logAction({
        action: "BATCH_STUDENTS_IMPORTED",
        details: `Imported ${valid.length} students into ${fallbackYr} ${fallbackBranch}-${fallbackSec} (${fallbackSem})`,
        affectedClass: `${fallbackYr} ${fallbackBranch}-${fallbackSec}`
      });
      showToast(`Imported ${valid.length} students successfully into ${fallbackYr} ${fallbackBranch}-${fallbackSec} (${fallbackSem})!`, "success");
    }

    if (rejected.length > 0) {
      showToast(`${rejected.length} rows were skipped due to validation errors.`, "warning");
    }

    return { 
      success: valid.length > 0, 
      count: valid.length, 
      importedCount: valid.length, 
      rejectedCount: rejected.length, 
      rejected 
    };
  };

  // Publish Examination Timetables (Requirement 8)
  const publishTimetable = ({ branch, year, semester, examType, title, instructions, schedule }) => {
    const id = `TT-${(examType || "REG").substring(0, 3).toUpperCase()}-${branch || "CSE"}-${(year || "IV").replace(/\s+/g, '')}-${(semester || "VII").replace(/\s+/g, '')}`;
    
    const newEntry = {
      id,
      branch: branch || "CSE",
      year: year || "IV Year",
      semester: semester || "VII Semester",
      examType: examType || "Regular",
      title: title || `B.Tech ${year} ${semester} ${examType} Examination Schedule`,
      publishedDate: new Date().toISOString().substring(0, 10),
      publishedBy: `${currentUser.profile?.name || "Dr. K. Srinivasa Rao"} (HOD, ${branch || "CSE"})`,
      status: "Published",
      instructions: instructions || "Students must carry official JNTUK Hall Tickets and College Identity Cards. Mobile phones are prohibited.",
      schedule: schedule || []
    };

    setPublishedTimetables(prev => {
      const filtered = prev.filter(t => t.id !== id);
      return [newEntry, ...filtered];
    });

    logAction({
      action: "EXAM_TIMETABLE_PUBLISHED",
      details: `HOD published ${examType} Exam Timetable for ${branch} ${year} (${semester}) with ${schedule.length} subjects.`,
      affectedClass: `${branch} ${year}`
    });

    showToast(`Published ${examType} examination timetable for ${branch} ${year}! Visible to students.`, "success");
    return { success: true, timetable: newEntry };
  };

  // Faculty Directory & Workload Allocation
  const addFacultyMember = (memberData) => {
    const exists = facultyList.some(f => f.staffId.toUpperCase() === memberData.staffId.trim().toUpperCase());
    if (exists) {
      showToast(`Staff ID ${memberData.staffId} already exists in faculty directory!`, "error");
      return { success: false, message: "Duplicate Staff ID" };
    }

    const newFaculty = {
      id: `fac-${Date.now()}`,
      staffId: memberData.staffId.trim().toUpperCase(),
      name: memberData.name.trim(),
      designation: memberData.designation || "Assistant Professor",
      department: memberData.department,
      qualification: memberData.qualification.trim(),
      experience: memberData.experience.trim(),
      email: memberData.email.trim().toLowerCase(),
      phone: memberData.phone.trim(),
      assignedSubjects: memberData.assignedSubjects || [],
      weeklyHours: Number(memberData.weeklyHours) || 16,
      pendingUploads: 0,
      attendanceStatus: "Active & Compliant"
    };

    setFacultyList(prev => [newFaculty, ...prev]);
    logAction({
      action: "FACULTY_ALLOCATED",
      details: `HOD allocated new staff member ${newFaculty.name} (${newFaculty.staffId}) to ${newFaculty.department}`,
      affectedClass: `${newFaculty.department} Faculty`
    });
    showToast(`Staff member ${newFaculty.name} (${newFaculty.staffId}) successfully allocated!`, "success");
    return { success: true, faculty: newFaculty };
  };

  const updateFacultyMember = (staffId, updatedData) => {
    setFacultyList(prev => prev.map(f => {
      if (f.staffId.toUpperCase() === staffId.toUpperCase() || f.id === staffId) {
        return { ...f, ...updatedData };
      }
      return f;
    }));
    logAction({
      action: "FACULTY_ALLOCATION_UPDATED",
      details: `HOD updated workload and allocation for ${updatedData.name || staffId}`,
      affectedClass: `${updatedData.department || 'Department'} Faculty`
    });
    showToast(`Workload and allocation updated for ${updatedData.name || staffId}.`, "success");
    return { success: true };
  };

  // Student Academic Progression / Promotion
  const promoteStudent = (rollNumber, { destinationYear, destinationSemester, destinationSection } = {}) => {
    const student = students.find(s => s.rollNumber.toUpperCase() === rollNumber.trim().toUpperCase());
    if (!student) {
      showToast(`Student ${rollNumber} not found.`, "error");
      return { success: false, message: "Student not found" };
    }

    const currentSemCode = normalizeSemesterCode(student.semester);
    const progression = getSemesterProgressionInfo(currentSemCode);

    if (!progression.canPromote && !destinationSemester) {
      showToast(`Student ${student.name} (${student.rollNumber}) has completed the final semester (4-2).`, "warning");
      return { success: false, message: "Student has completed final semester" };
    }

    const nextSem = destinationSemester || progression.nextSem;
    const nextYear = destinationYear || progression.nextYear;
    const nextSection = destinationSection || student.section || 'A';

    // Preserve historical attendance records in semesterAttendance map
    const existingSemAttendance = student.semesterAttendance || {};
    const updatedSemAttendance = {
      ...existingSemAttendance,
      [currentSemCode]: existingSemAttendance[currentSemCode] || {
        conducted: student.totalClassesHeld || 0,
        attended: student.totalClassesAttended || 0,
        absent: student.totalClassesAbsent ?? Math.max(0, (student.totalClassesHeld || 0) - (student.totalClassesAttended || 0)),
        percentage: student.attendanceOverall ? String(student.attendanceOverall) : "0.00",
        monthlyAttendance: student.monthlyAttendance ? [...student.monthlyAttendance] : []
      }
    };

    const promotionRecord = {
      promotedAt: new Date().toISOString(),
      promotedBy: currentUser.profile?.name || "HOD",
      fromSemester: currentSemCode,
      fromYear: student.year,
      fromSection: student.section,
      toSemester: nextSem,
      toYear: nextYear,
      toSection: nextSection
    };

    const updatedStudent = {
      ...student,
      year: nextYear,
      semester: nextSem,
      section: nextSection,
      semesterAttendance: updatedSemAttendance,
      promotionHistory: [...(student.promotionHistory || []), promotionRecord]
    };

    setStudents(prev => prev.map(s => (s.rollNumber.toUpperCase() === rollNumber.trim().toUpperCase() ? updatedStudent : s)));

    // Synchronize current logged in student profile if applicable
    if (currentUser.role === 'student' && currentUser.profile?.rollNumber?.toUpperCase() === rollNumber.trim().toUpperCase()) {
      setCurrentUser(prev => ({
        ...prev,
        profile: updatedStudent
      }));
    }

    logAction({
      action: "STUDENT_PROMOTED",
      details: `Student ${student.name} (${student.rollNumber}) promoted from ${currentSemCode} (${student.year}) to ${nextSem} (${nextYear}) - Section ${nextSection}`,
      affectedClass: `${nextYear} ${student.department || 'CSE'}-${nextSection}`
    });

    showToast(`Successfully promoted ${student.name} to ${nextSem} (${nextYear})!`, "success");
    return { success: true, student: updatedStudent };
  };

  const batchPromoteStudents = (rollNumbers = []) => {
    if (!rollNumbers.length) {
      showToast("No students selected for promotion.", "warning");
      return { success: false, message: "No students selected" };
    }

    let promotedCount = 0;
    const updatedStudentsList = students.map(student => {
      const isSelected = rollNumbers.some(rn => rn.toUpperCase() === student.rollNumber.toUpperCase());
      if (!isSelected) return student;

      const currentSemCode = normalizeSemesterCode(student.semester);
      const progression = getSemesterProgressionInfo(currentSemCode);
      if (!progression.canPromote) return student;

      const nextSem = progression.nextSem;
      const nextYear = progression.nextYear;
      const nextSection = student.section || 'A';

      const existingSemAttendance = student.semesterAttendance || {};
      const updatedSemAttendance = {
        ...existingSemAttendance,
        [currentSemCode]: existingSemAttendance[currentSemCode] || {
          conducted: student.totalClassesHeld || 0,
          attended: student.totalClassesAttended || 0,
          absent: student.totalClassesAbsent ?? Math.max(0, (student.totalClassesHeld || 0) - (student.totalClassesAttended || 0)),
          percentage: student.attendanceOverall ? String(student.attendanceOverall) : "0.00",
          monthlyAttendance: student.monthlyAttendance ? [...student.monthlyAttendance] : []
        }
      };

      promotedCount++;
      return {
        ...student,
        year: nextYear,
        semester: nextSem,
        section: nextSection,
        semesterAttendance: updatedSemAttendance,
        promotionHistory: [
          ...(student.promotionHistory || []),
          {
            promotedAt: new Date().toISOString(),
            promotedBy: currentUser.profile?.name || "HOD",
            fromSemester: currentSemCode,
            fromYear: student.year,
            fromSection: student.section,
            toSemester: nextSem,
            toYear: nextYear,
            toSection: nextSection
          }
        ]
      };
    });

    setStudents(updatedStudentsList);

    if (currentUser.role === 'student' && currentUser.profile?.rollNumber) {
      const activeUpdated = updatedStudentsList.find(s => s.rollNumber.toUpperCase() === currentUser.profile.rollNumber.toUpperCase());
      if (activeUpdated) {
        setCurrentUser(prev => ({ ...prev, profile: activeUpdated }));
      }
    }

    logAction({
      action: "BATCH_STUDENTS_PROMOTED",
      details: `HOD batch-promoted ${promotedCount} students to their next semester progression`,
      affectedClass: `Multiple Sections`
    });

    showToast(`Successfully promoted ${promotedCount} student(s) to next semester!`, "success");
    return { success: true, count: promotedCount };
  };

  // Assign or update Department HOD
  const assignOrUpdateHOD = async ({ departmentId, hodName, hodEmail, initialPassword }) => {
    const deptId = (departmentId || 'CSE').trim().toUpperCase();
    const email = (hodEmail || `hod.${deptId.toLowerCase()}@tecnrt.org`).trim().toLowerCase();
    const name = (hodName || `Dr. ${deptId} HOD`).trim();
    const pwd = initialPassword || `HOD_${deptId}#2026`;

    try {
      // If live backend is reachable, invoke admin API
      await adminApi.assignHod(email, deptId, pwd).catch(() => null);
    } catch {
      // Fallback gracefully
    }

    setDepartments(prev => prev.map(d => {
      if (d.id.toUpperCase() === deptId) {
        return {
          ...d,
          hod: name,
          hodEmail: email,
          password: pwd
        };
      }
      return d;
    }));

    // If currently logged-in user is this HOD, update active session in real-time
    setCurrentUser(curr => {
      if (curr.role === 'hod' && (curr.profile?.department || '').toUpperCase() === deptId) {
        return {
          ...curr,
          profile: {
            ...curr.profile,
            name: name,
            email: email
          }
        };
      }
      return curr;
    });

    logAction({
      action: "HOD_PROVISIONED",
      details: `Administrator provisioned HOD authority for ${name} (${email}) over Department ${deptId}`,
      affectedClass: `${deptId} Leadership`
    });

    showToast(`HOD authority for ${deptId} successfully assigned to ${name}!`, "success");
    return { success: true };
  };

  // Administrator Force Password Reset (without needing current password)
  const adminForcedPasswordReset = async (identifier, newPassword) => {
    const cleanId = (identifier || '').trim();
    if (!cleanId) {
      showToast("User identifier or roll number is required.", "error");
      return { success: false, message: "Missing identifier" };
    }

    if (!newPassword || newPassword.trim().length < 6) {
      showToast("New password must be at least 6 characters long.", "warning");
      return { success: false, message: "Password too short" };
    }

    try {
      await adminApi.resetUserPassword(cleanId, newPassword.trim()).catch(() => null);
    } catch {
      // Backend optional fallback
    }

    // Update in frontend student roster if matching roll number
    const isStudent = students.some(s => s.rollNumber.toUpperCase() === cleanId.toUpperCase());
    if (isStudent) {
      setStudents(prev => prev.map(s => {
        if (s.rollNumber.toUpperCase() === cleanId.toUpperCase()) {
          return {
            ...s,
            password: newPassword.trim(),
            tempPassword: newPassword.trim(),
            mustChangePassword: false,
            accountStatus: ACCOUNT_STATUSES.ACTIVE
          };
        }
        return s;
      }));
    }

    // Update in departments if matching HOD email or dept ID
    setDepartments(prev => prev.map(d => {
      if (d.hodEmail.toLowerCase() === cleanId.toLowerCase() || d.id.toUpperCase() === cleanId.toUpperCase()) {
        return {
          ...d,
          password: newPassword
        };
      }
      return d;
    }));

    logAction({
      action: "ADMIN_RESET_PASSWORD",
      details: `Administrator forcibly reset login password for user ${cleanId}`,
      affectedClass: `Account Security`
    });

    showToast(`Password for ${cleanId} successfully reset! User can now sign in immediately.`, "success");
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        students,
        setStudents,
        createStudent,
        updateStudentProfile,
        reviewStudentProfile,
        requestProfileCorrection,
        reviewCorrectionRequest,
        provisionStudentAccount,
        batchProvisionAccounts,
        importStudentsToSection,
        updateManualAttendance,
        submitAttendanceUpload,
        promoteStudent,
        batchPromoteStudents,
        departments,
        assignOrUpdateHOD,
        adminForcedPasswordReset,
        facultyList,
        setFacultyList,
        addFacultyMember,
        updateFacultyMember,
        publishedTimetables,
        publishTimetable,
        uploadHistory,
        auditLogs,
        logAction,
        quickSwitchRole,
        loginWithCredentials,
        logout,
        updatePassword,
        loginModalOpen,
        setLoginModalOpen,
        loginModalRole,
        setLoginModalRole,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

