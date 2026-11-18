// Tirumala Engineering College (TEC), Narasaraopet - Master Mock Data & State Store
// EAMCET / EAPCET Code: TMLN | Permanently Affiliated to JNTUK | AICTE Approved | NAAC 'A' Grade

export const COLLEGE_INFO = {
  name: "Tirumala Engineering College",
  shortName: "TEC",
  eamcetCode: "TMLN",
  counselingCode: "TMLN",
  tagline: "Empowering Minds, Engineering the Future",
  established: 2008,
  affiliations: [
    "Permanently Affiliated to JNTUK, Kakinada",
    "Approved by AICTE, New Delhi",
    "Accredited by NAAC with 'A' Grade",
    "NBA Accredited for Eligible B.Tech Programs"
  ],
  campus: {
    address: "Jonnalagadda Village, Narasaraopet Mandal, Palnadu District, Andhra Pradesh - 522601",
    email: "principal@tecnrt.org",
    admissionsEmail: "admissions@tecnrt.org",
    phones: ["+91 8647 218255", "+91 9440 218256", "+91 9848 123456"],
    website: "https://www.tecnrt.org",
    campusArea: "25+ Lush Green Acres",
    studentStrength: 3450,
    facultyStrength: 185,
    placementRate: "88.4%",
    highestPackage: "18.5 LPA",
    averagePackage: "4.8 LPA"
  },
  principal: {
    name: "Dr. V. Narayana",
    qualification: "M.Tech, Ph.D, FIE",
    experience: "25+ Years in Technical Education & Administration",
    email: "principal@tecnrt.org"
  }
};

export const DEPARTMENTS = [
  {
    id: "CSE",
    code: "05",
    name: "Computer Science & Engineering",
    hod: "Dr. K. Srinivasa Rao",
    hodEmail: "hod.cse@tecnrt.org",
    intake: 180,
    studentsCount: 720,
    facultyCount: 38,
    labsCount: 8,
    avgAttendance: 86.4,
    passRate: 91.2,
    establishedYear: 2008,
    description: "Equipped with state-of-the-art computing labs, NVIDIA AI hardware, cloud infrastructure, and active industry partnerships.",
    specializations: ["Software Engineering", "Full Stack Development", "Cloud Architecture", "Cybersecurity"]
  },
  {
    id: "AIML",
    code: "42",
    name: "CSE (Artificial Intelligence & Machine Learning)",
    hod: "Dr. M. Rama Krishna",
    hodEmail: "hod.aiml@tecnrt.org",
    intake: 120,
    studentsCount: 480,
    facultyCount: 24,
    labsCount: 5,
    avgAttendance: 88.2,
    passRate: 93.0,
    establishedYear: 2020,
    description: "Focuses on deep learning algorithms, computer vision, natural language processing, and neural network computing.",
    specializations: ["Deep Learning", "Generative AI", "Computer Vision", "Robotics Perception"]
  },
  {
    id: "AIDS",
    code: "54",
    name: "CSE (Artificial Intelligence & Data Science)",
    hod: "Dr. S. Bhavani Shankar",
    hodEmail: "hod.aids@tecnrt.org",
    intake: 120,
    studentsCount: 480,
    facultyCount: 22,
    labsCount: 4,
    avgAttendance: 85.1,
    passRate: 89.8,
    establishedYear: 2021,
    description: "Comprehensive curriculum combining big data engineering, predictive analytics, business intelligence, and statistics.",
    specializations: ["Big Data Analytics", "Data Warehousing", "Statistical Modeling", "Predictive Analytics"]
  },
  {
    id: "IT",
    code: "12",
    name: "Information Technology",
    hod: "Dr. T. Venkata Reddy",
    hodEmail: "hod.it@tecnrt.org",
    intake: 60,
    studentsCount: 240,
    facultyCount: 16,
    labsCount: 4,
    avgAttendance: 83.9,
    passRate: 88.5,
    establishedYear: 2008,
    description: "Prepares students in system administration, distributed systems, information security, and enterprise software.",
    specializations: ["DevOps", "Database Administration", "Network Systems", "Information Security"]
  },
  {
    id: "ECE",
    code: "04",
    name: "Electronics & Communication Engineering",
    hod: "Dr. P. Venkateswarlu",
    hodEmail: "hod.ece@tecnrt.org",
    intake: 180,
    studentsCount: 720,
    facultyCount: 36,
    labsCount: 7,
    avgAttendance: 84.7,
    passRate: 89.4,
    establishedYear: 2008,
    description: "Cutting-edge VLSI Design, Embedded Systems, IoT incubation center, and Advanced Signal Processing laboratories.",
    specializations: ["VLSI Design", "Embedded IoT", "Wireless Communications", "Signal Processing"]
  },
  {
    id: "EEE",
    code: "02",
    name: "Electrical & Electronics Engineering",
    hod: "Dr. G. Suresh Babu",
    hodEmail: "hod.eee@tecnrt.org",
    intake: 60,
    studentsCount: 240,
    facultyCount: 18,
    labsCount: 5,
    avgAttendance: 82.5,
    passRate: 86.2,
    establishedYear: 2008,
    description: "Focus on renewable energy systems, electric vehicle powertrain tech, smart grids, and industrial drive automation.",
    specializations: ["EV Systems", "Renewable Energy", "Smart Grid Control", "Power Electronics"]
  }
];

export const PROFILE_STATUSES = {
  COMPLETE: 'Complete',
  INCOMPLETE: 'Incomplete'
};

export const ACCOUNT_STATUSES = {
  PENDING: 'PENDING',
  PROVISIONED: 'PROVISIONED',
  ACTIVE: 'ACTIVE'
};

export const REQUIRED_PROFILE_FIELDS = [
  'name',
  'dob',
  'gender',
  'bloodGroup',
  'phone',
  'email',
  'fatherName',
  'fatherPhone',
  'motherName',
  'currentAddress',
  'permanentAddress',
  'admissionYear',
  'admissionType'
];

export const isProfileComplete = (student) => {
  if (!student) return false;
  for (const key of REQUIRED_PROFILE_FIELDS) {
    const val = student[key];
    if (!val || typeof val !== 'string' || val.trim() === '' || val === 'Not Specified') {
      return false;
    }
  }
  const phoneDigits = (student.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) return false;

  const fatherPhoneDigits = (student.fatherPhone || '').replace(/\D/g, '');
  if (fatherPhoneDigits.length < 10) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(student.email || '')) return false;

  return true;
};

export const getProfileStatus = (student) => {
  return isProfileComplete(student) ? PROFILE_STATUSES.COMPLETE : PROFILE_STATUSES.INCOMPLETE;
};

export const calculateProfileCompletion = (student) => {
  if (!student) return 0;
  const fields = [
    student.name,
    student.dob,
    student.gender,
    student.bloodGroup,
    student.phone,
    student.email,
    student.fatherName,
    student.fatherPhone,
    student.motherName,
    student.currentAddress,
    student.permanentAddress,
    student.admissionYear,
    student.admissionType
  ];
  const filled = fields.filter(f => f && typeof f === 'string' && f.trim() !== '' && f !== 'Not Specified').length;
  return Math.round((filled / fields.length) * 100);
};

// =========================================================================
// CANONICAL ACADEMIC SEMESTER STRUCTURE & PROGRESSION (Shared Single Truth)
// =========================================================================
export const SEMESTER_STRUCTURE = [
  { code: '1-1', label: '1-1', fullName: '1st Year I Semester (1-1)', year: '1st Year', yearCode: 'I Year', semesterNumber: 1 },
  { code: '1-2', label: '1-2', fullName: '1st Year II Semester (1-2)', year: '1st Year', yearCode: 'I Year', semesterNumber: 2 },
  { code: '2-1', label: '2-1', fullName: '2nd Year I Semester (2-1)', year: '2nd Year', yearCode: 'II Year', semesterNumber: 3 },
  { code: '2-2', label: '2-2', fullName: '2nd Year II Semester (2-2)', year: '2nd Year', yearCode: 'II Year', semesterNumber: 4 },
  { code: '3-1', label: '3-1', fullName: '3rd Year I Semester (3-1)', year: '3rd Year', yearCode: 'III Year', semesterNumber: 5 },
  { code: '3-2', label: '3-2', fullName: '3rd Year II Semester (3-2)', year: '3rd Year', yearCode: 'III Year', semesterNumber: 6 },
  { code: '4-1', label: '4-1', fullName: '4th Year I Semester (4-1)', year: '4th Year', yearCode: 'IV Year', semesterNumber: 7 },
  { code: '4-2', label: '4-2', fullName: '4th Year II Semester (4-2)', year: '4th Year', yearCode: 'IV Year', semesterNumber: 8 }
];

export const SEMESTER_PROGRESSION = {
  '1-1': { nextSem: '1-2', nextYear: '1st Year' },
  '1-2': { nextSem: '2-1', nextYear: '2nd Year' },
  '2-1': { nextSem: '2-2', nextYear: '2nd Year' },
  '2-2': { nextSem: '3-1', nextYear: '3rd Year' },
  '3-1': { nextSem: '3-2', nextYear: '3rd Year' },
  '3-2': { nextSem: '4-1', nextYear: '4th Year' },
  '4-1': { nextSem: '4-2', nextYear: '4th Year' },
  '4-2': { nextSem: null, nextYear: 'Graduated / Programme Completed' }
};

export const normalizeSemesterCode = (sem) => {
  if (!sem) return '1-1';
  const s = String(sem).trim();
  if (s === '1-1' || s.includes('1-1') || s.startsWith('I Sem') || s === '1' || s === 'I') return '1-1';
  if (s === '1-2' || s.includes('1-2') || s.startsWith('II Sem') || s === '2' || s === 'II') return '1-2';
  if (s === '2-1' || s.includes('2-1') || s.startsWith('III Sem') || s === '3' || s === 'III') return '2-1';
  if (s === '2-2' || s.includes('2-2') || s.startsWith('IV Sem') || s === '4' || s === 'IV') return '2-2';
  if (s === '3-1' || s.includes('3-1') || s.startsWith('V Sem') || s === '5' || s === 'V') return '3-1';
  if (s === '3-2' || s.includes('3-2') || s.startsWith('VI Sem') || s === '6' || s === 'VI') return '3-2';
  if (s === '4-1' || s.includes('4-1') || s.startsWith('VII Sem') || s === '7' || s === 'VII') return '4-1';
  if (s === '4-2' || s.includes('4-2') || s.startsWith('VIII Sem') || s === '8' || s === 'VIII') return '4-2';
  return s;
};

export const normalizeYear = (yr) => {
  if (!yr) return '1st Year';
  const y = String(yr).trim();
  if (y.includes('1') || y.startsWith('I ') || y === 'I Year') return '1st Year';
  if (y.includes('2') || y.startsWith('II ') || y === 'II Year') return '2nd Year';
  if (y.includes('3') || y.startsWith('III ') || y === 'III Year') return '3rd Year';
  if (y.includes('4') || y.startsWith('IV ') || y === 'IV Year') return '4th Year';
  return yr;
};

export const getSemesterProgressionInfo = (currentSem) => {
  const code = normalizeSemesterCode(currentSem);
  const prog = SEMESTER_PROGRESSION[code];
  return {
    currentCode: code,
    nextSem: prog?.nextSem || null,
    nextYear: prog?.nextYear || null,
    canPromote: !!prog?.nextSem
  };
};

export const SAMPLE_MULTI_SEMESTER_ATTENDANCE = {};

export const getStudentSemesterAttendance = (student, semCode) => {
  const code = normalizeSemesterCode(semCode);

  // 1. Check if student has explicit multi-semester attendance records
  if (student?.semesterAttendance?.[code]) {
    const semData = student.semesterAttendance[code];
    const monthly = semData.monthlyAttendance || [];
    const conducted = semData.conducted ?? (monthly.length > 0 ? monthly.reduce((s, m) => s + (m.classesConducted || m.held || 0), 0) : 0);
    const attended = semData.attended ?? (monthly.length > 0 ? monthly.reduce((s, m) => s + (m.classesAttended || m.attended || 0), 0) : 0);
    const absent = semData.absent ?? Math.max(0, conducted - attended);
    const percentage = conducted > 0 ? ((attended / conducted) * 100).toFixed(2) : "0.00";

    return {
      hasData: conducted > 0,
      conducted,
      attended,
      absent,
      percentage,
      monthlyAttendance: monthly
    };
  }

  // 2. If semCode matches student's active semester and has root data
  const currentSem = normalizeSemesterCode(student?.semester || '1-1');
  if (code === currentSem && (student?.monthlyAttendance?.length > 0 || student?.totalClassesHeld > 0)) {
    const monthly = student.monthlyAttendance || [];
    const conducted = monthly.length > 0
      ? monthly.reduce((s, m) => s + (m.classesConducted || m.held || 0), 0)
      : (student.totalClassesHeld || 0);
    const attended = monthly.length > 0
      ? monthly.reduce((s, m) => s + (m.classesAttended || m.attended || 0), 0)
      : (student.totalClassesAttended || 0);
    const absent = monthly.length > 0
      ? monthly.reduce((s, m) => s + (m.classesAbsent || m.absent || 0), 0)
      : (student.totalClassesAbsent ?? Math.max(0, conducted - attended));
    const percentage = conducted > 0 ? ((attended / conducted) * 100).toFixed(2) : "0.00";

    return {
      hasData: conducted > 0,
      conducted,
      attended,
      absent,
      percentage,
      monthlyAttendance: monthly
    };
  }

  // 3. Clean empty state for un-commenced / empty semesters
  return {
    hasData: false,
    conducted: 0,
    attended: 0,
    absent: 0,
    percentage: "0.00",
    monthlyAttendance: []
  };
};

export const INITIAL_STUDENTS = [];

export const INITIAL_EXAM_TIMETABLES = [];

export const STUDENT_SUBJECTS = {};

export const STUDENT_EXAMS = {};

export const STUDENT_FEES = {};

export const FACULTY_MEMBERS = [];

export const FACULTY_TIMETABLE = [];

export const ATTENDANCE_UPLOAD_HISTORY = [];

export const AUDIT_LOGS = [];

export const ANNOUNCEMENTS = [
  {
    id: "anc-1",
    title: "JNTUK B.Tech IV-I Regular End Semester Examination Time-Table Release",
    date: "October 12, 2026",
    category: "Examinations",
    priority: "High",
    content: "The University examination center has released the official schedule for B.Tech IV Year I Semester Regular & Supplementary Examinations starting November 16, 2026. Hall tickets will be issued via the student portal."
  },
  {
    id: "anc-2",
    title: "Campus Placement Drive: TCS Digital, Cognizant & Tech Mahindra",
    date: "October 08, 2026",
    category: "Placements",
    priority: "High",
    content: "Final Year B.Tech students (CSE, IT, ECE, EEE) who have maintained minimum 75% attendance and no active standing backlogs are eligible to appear for the pooled recruitment drive on October 24, 2026."
  },
  {
    id: "anc-3",
    title: "AICTE Sponsored National Conference on Next-Gen Generative AI & Cloud",
    date: "September 29, 2026",
    category: "Academic",
    priority: "Medium",
    content: "Department of CSE and AI&ML is organizing a two-day national level conference on November 28-29, 2026. Faculty and student researchers are invited to submit papers."
  },
  {
    id: "anc-4",
    title: "Attendance Review for Condonation / Detention - ODD Semester 2026",
    date: "September 25, 2026",
    category: "Attendance",
    priority: "High",
    content: "Students having attendance between 65% and 75% on medical grounds must submit authentic medical certificates counter-signed by the parent to their respective HOD before October 28."
  }
];

export const PLACEMENT_STATS = {
  academicYear: "2025-2026 (Ongoing 2026-27)",
  totalOffers: 624,
  highestPackage: "18.5 LPA",
  averagePackage: "4.8 LPA",
  placementPercentage: "88.4%",
  topRecruiters: [
    { name: "TCS", offers: 142, tier: "MNC" },
    { name: "Cognizant", offers: 98, tier: "MNC" },
    { name: "Wipro", offers: 76, tier: "MNC" },
    { name: "Infosys", offers: 64, tier: "MNC" },
    { name: "Tech Mahindra", offers: 55, tier: "MNC" },
    { name: "Capgemini", offers: 48, tier: "MNC" },
    { name: "Hyundai Transys", offers: 24, tier: "Core" },
    { name: "Kia Motors India", offers: 18, tier: "Core" },
    { name: "Efftronics Systems", offers: 22, tier: "Product/Embedded" },
    { name: "Virtusa", offers: 32, tier: "MNC" }
  ]
};
