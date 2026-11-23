// Attendance Spreadsheet Helpers, Template Generator, and Validation Engine (PRD Section 6)
import * as XLSX from 'xlsx';
import { INITIAL_STUDENTS, normalizeYear, normalizeSemesterCode } from './mockData.js';

export const ATTENDANCE_COLUMNS = [
  "Student Roll Number",
  "Student Name",
  "Department",
  "Academic Year",
  "Semester",
  "Section",
  "Subject Code",
  "Attendance Period",
  "Total Classes Held",
  "Classes Attended",
  "Classes Absent",
  "Attendance Percentage"
];

// Student Registration columns: strictly Roll Number and Student Name
export const STUDENT_REGISTRATION_COLUMNS = [
  "Roll Number",
  "Student Name"
];

// Generate standard CSV template for a given section & subject
export function generateAttendanceTemplate(studentsList = [], department = "CSE", classSection = "IV B.Tech CSE-A", subjectCode = "CS711PE", period = "October 2026") {
  const source = studentsList.length > 0 ? studentsList : [];
  const rows = [
    ATTENDANCE_COLUMNS.join(","),
    ...source.map(s => {
      return `"${s.rollNumber}","${s.name}","${s.department}","${s.year}","${s.semester || ''}","${s.section}","${subjectCode}","${period}",40,,,""`;
    })
  ];
  return rows.join("\n");
}

// Generate blank registration template with just Roll Number and Student Name
export function generateStudentRegistrationTemplate() {
  return STUDENT_REGISTRATION_COLUMNS.join(",") + "\n";
}

// Generate native Excel workbook (.xlsx) for batch student enrollment (Only Roll Number and Student Name)
// Embeds template target metadata in sheet properties / headers so upload verifies exact Year & Section match
export function generateStudentRegistrationWorkbook(branch = "CSE", year = "1st Year", section = "A") {
  const ws = XLSX.utils.aoa_to_sheet([STUDENT_REGISTRATION_COLUMNS]);
  ws['!cols'] = [
    { wch: 22 }, // Roll Number
    { wch: 34 }  // Student Name
  ];
  const wb = XLSX.utils.book_new();
  const yrCode = normalizeYear(year).replace(/\s+/g, '');
  const sheetTitle = `${branch}_${yrCode}_Sec${section}`.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
  // Store custom doc metadata
  wb.Props = {
    Title: `Student Registration Template - ${branch} ${year} Section ${section}`,
    Subject: `${branch}|${normalizeYear(year)}|${section.toUpperCase()}`,
    Author: "Tirumala Engineering College"
  };
  return wb;
}

// Pre-packaged test datasets for demo convenience
export function getSampleValidCSV() {
  return [
    ATTENDANCE_COLUMNS.join(","),
    `"21TML0501","M. Sai Vardhan","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,35,3,92.1`,
    `"21TML0502","K. Pravallika","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,37,1,97.3`,
    `"21TML0503","B. Yaswanth Kumar","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,28,10,73.6`,
    `"21TML0504","G. Haritha","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,33,5,86.8`,
    `"21TML0505","P. Tarun Teun","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,24,14,63.1`
  ].join("\n");
}

export function getSampleProblematicCSV() {
  return [
    ATTENDANCE_COLUMNS.join(","),
    `"21TML0501","M. Sai Vardhan","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,35,3,92.1`,
    // Inconsistent totals: 36 + 5 != 38
    `"21TML0502","K. Pravallika","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,36,5,94.7`,
    // Unknown roll number
    `"21TML9999","Unknown Person","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,30,8,78.9`,
    // Duplicate roll number (21TML0501 again)
    `"21TML0501","M. Sai Vardhan (Duplicate)","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,35,3,92.1`,
    // Attended exceeds total held: 42 > 38
    `"21TML0504","G. Haritha","CSE","IV Year","VII Semester","A","CS711PE","October 2026",38,42,-4,110.5`,
    // Negative numbers
    `"21TML0505","P. Tarun Teja","CSE","IV Year","VII Semester","A","CS711PE","October 2026",-10,20,5,0`
  ].join("\n");
}

// PRD Section 6.3 & 6.5 Comprehensive Attendance Validation Engine
export function parseAndValidateCSV(csvContent, context = {}) {
  const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      isValid: false,
      summary: { totalRows: 0, validRows: 0, rejectedRows: 0, warningRows: 0 },
      rows: [],
      generalError: "File is empty or does not contain a valid header row."
    };
  }

  const parsedRows = [];
  const seenRollNumbers = new Set();
  let validCount = 0;
  let rejectedCount = 0;
  let warningCount = 0;

  // Use dynamic registered students list if provided in context
  const activeRoster = context.students && context.students.length > 0 ? context.students : INITIAL_STUDENTS;

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split on commas not inside quotes
    const cells = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(",");
    const cleanCells = cells.map(c => c.replace(/^["']|["']$/g, "").trim());

    const rollNumber = cleanCells[0] || "";
    const name = cleanCells[1] || "";
    const dept = cleanCells[2] || "";
    const year = cleanCells[3] || "";
    const sem = cleanCells[4] || "";
    const sec = cleanCells[5] || "";
    const subject = cleanCells[6] || "";
    const period = cleanCells[7] || "";
    const totalHeldStr = cleanCells[8] || cleanCells[7];
    const attendedStr = cleanCells[9] || cleanCells[8];
    const absentStr = cleanCells[10] || cleanCells[9];

    const errors = [];
    const warnings = [];

    // Rule 1: Missing required roll number
    if (!rollNumber) {
      errors.push("Missing Student Roll Number");
    } else {
      // Rule 2: Unknown student in college roster
      const studentMatch = activeRoster.find(s => s.rollNumber.toUpperCase() === rollNumber.toUpperCase());
      if (!studentMatch) {
        errors.push(`Unknown Roll Number [${rollNumber}] not registered in college roster`);
      } else {
        // Rule 3: Department mismatch
        if (context.department && studentMatch.department !== context.department) {
          errors.push(`Roll Number belongs to [${studentMatch.department}], outside selected department [${context.department}]`);
        }
        // Rule 3b: Section mismatch check if target section is specified
        if (context.section && studentMatch.section !== context.section) {
          errors.push(`Student is enrolled in Section [${studentMatch.section}], not the target Section [${context.section}]`);
        }
      }

      // Rule 4: Duplicate row in same submission
      if (seenRollNumbers.has(rollNumber.toUpperCase())) {
        errors.push(`Duplicate row for Roll Number [${rollNumber}] in this spreadsheet`);
      } else {
        seenRollNumbers.add(rollNumber.toUpperCase());
      }
    }

    // Numeric checks
    const totalHeld = parseInt(totalHeldStr, 10);
    const attended = parseInt(attendedStr, 10);
    const absent = parseInt(absentStr, 10);

    if (isNaN(totalHeld)) {
      errors.push("Total Classes Held must be a valid integer");
    } else if (totalHeld <= 0) {
      errors.push("Total Classes Held must be greater than zero");
    }

    if (isNaN(attended)) {
      errors.push("Classes Attended must be a valid integer");
    } else if (attended < 0) {
      errors.push("Classes Attended cannot be negative");
    }

    if (isNaN(absent)) {
      errors.push("Classes Absent must be a valid integer");
    } else if (absent < 0) {
      errors.push("Classes Absent cannot be negative");
    }

    if (!isNaN(totalHeld) && !isNaN(attended)) {
      if (attended > totalHeld) {
        errors.push(`Classes Attended (${attended}) exceeds Total Classes Held (${totalHeld})`);
      }
    }

    // Mathematical consistency: Attended + Absent == Total Held
    if (!isNaN(totalHeld) && !isNaN(attended) && !isNaN(absent)) {
      if (attended + absent !== totalHeld) {
        errors.push(`Sum of Attended (${attended}) + Absent (${absent}) = ${attended + absent}, does not match Total Held (${totalHeld})`);
      }
    }

    // Calculation (Backend re-computation per PRD 6.3)
    let calculatedPct = 0;
    if (!isNaN(totalHeld) && !isNaN(attended) && totalHeld > 0) {
      calculatedPct = parseFloat(((attended / totalHeld) * 100).toFixed(1));
    }

    // Warning for low attendance
    if (calculatedPct < 65) {
      warnings.push(`Detention Alert: Attendance (${calculatedPct}%) is below 65% mandatory threshold`);
    } else if (calculatedPct < 75) {
      warnings.push(`Condonation Required: Attendance (${calculatedPct}%) is between 65% and 75%`);
    }

    const rowStatus = errors.length > 0 ? "REJECTED" : warnings.length > 0 ? "WARNING" : "VALID";
    if (rowStatus === "VALID") validCount++;
    else if (rowStatus === "WARNING") {
      validCount++;
      warningCount++;
    } else {
      rejectedCount++;
    }

    parsedRows.push({
      rowNumber: i,
      rollNumber,
      name,
      department: dept || context.department || "CSE",
      academicYear: year || context.year || "IV Year",
      semester: sem || context.semester || "VII Semester",
      section: sec || context.section || "A",
      subjectCode: subject || context.subject || "CS711PE",
      period: period || context.period || "October 2026",
      totalHeld: isNaN(totalHeld) ? totalHeldStr : totalHeld,
      attended: isNaN(attended) ? attendedStr : attended,
      absent: isNaN(absent) ? absentStr : absent,
      calculatedPercentage: calculatedPct,
      status: rowStatus,
      errors,
      warnings
    });
  }

  return {
    isValid: rejectedCount === 0,
    summary: {
      totalRows: lines.length - 1,
      validRows: validCount,
      rejectedRows: rejectedCount,
      warningRows: warningCount
    },
    rows: parsedRows
  };
}

// Helper to robustly parse a CSV line handling quoted fields with commas and escaped quotes
export function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Student Batch Registration CSV Parser & Validator (Multi-Column Format: Roll, Name, Branch, Year, Semester, Section)
export function parseAndValidateStudentCSV(csvContent, existingStudents = [], context = {}) {
  const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      isValid: false,
      summary: { totalRows: 0, validRows: 0, rejectedRows: 0 },
      rows: [],
      generalError: "File is empty or does not contain records."
    };
  }

  // Parse header line to determine column positions dynamically
  const headerCells = splitCSVLine(lines[0]).map(c => c.replace(/^["']|["']$/g, "").trim().toLowerCase());
  const colIndex = {
    roll: headerCells.findIndex(c => c.includes("roll")),
    name: headerCells.findIndex(c => c.includes("name")),
    branch: headerCells.findIndex(c => c.includes("branch") || c.includes("dept") || c.includes("department")),
    year: headerCells.findIndex(c => c.includes("year")),
    semester: headerCells.findIndex(c => c.includes("sem")),
    section: headerCells.findIndex(c => c.includes("sec"))
  };

  // Fallbacks if not recognized by header name
  const rollIdx = colIndex.roll >= 0 ? colIndex.roll : 0;
  const nameIdx = colIndex.name >= 0 ? colIndex.name : 1;
  const branchIdx = colIndex.branch >= 0 ? colIndex.branch : 2;
  const yearIdx = colIndex.year >= 0 ? colIndex.year : 3;
  const semIdx = colIndex.semester >= 0 ? colIndex.semester : 4;
  const secIdx = colIndex.section >= 0 ? colIndex.section : 5;

  // Expected target year & section from context
  const targetYear = normalizeYear(context.year || "1st Year");
  const targetSection = (context.section || "A").replace(/^Sec(tion)?\s*/i, '').trim().toUpperCase() || "A";
  const targetBranch = (context.branch || context.department || "CSE").toUpperCase();

  // If the file itself has metadata (from template or filename), check for year/section mismatch
  const filename = (context.filename || "").toUpperCase();
  let filenameMismatchError = null;

  // Check if filename indicates a different year (e.g. 4THYEAR vs 1STYEAR)
  const allYears = [
    { label: '1st Year', patterns: ['1STYEAR', '1ST_YEAR', '1ST-YEAR', 'YEAR1', 'YEAR_1'] },
    { label: '2nd Year', patterns: ['2NDYEAR', '2ND_YEAR', '2ND-YEAR', 'YEAR2', 'YEAR_2'] },
    { label: '3rd Year', patterns: ['3RDYEAR', '3RD_YEAR', '3RD-YEAR', 'YEAR3', 'YEAR_3'] },
    { label: '4th Year', patterns: ['4THYEAR', '4TH_YEAR', '4TH-YEAR', 'YEAR4', 'YEAR_4'] }
  ];

  for (const y of allYears) {
    if (y.label !== targetYear) {
      if (y.patterns.some(p => filename.includes(p))) {
        filenameMismatchError = `Year Mismatch: You uploaded a file meant for [${y.label}], but current target section is [${targetYear} Section ${targetSection}]. Please select the matching academic year or download the template for ${targetYear}.`;
        break;
      }
    }
  }

  // Check if filename indicates a different section (e.g. SECA vs SECB)
  if (!filenameMismatchError && filename.includes('SEC')) {
    const secMatch = filename.match(/SEC_?([A-Z])/);
    if (secMatch && secMatch[1] && secMatch[1] !== targetSection) {
      filenameMismatchError = `Section Mismatch: File is titled for [Section ${secMatch[1]}], but you are uploading into [Section ${targetSection}]. Please upload into Section ${secMatch[1]} or use the Section ${targetSection} template.`;
    }
  }

  const seenRolls = new Set();
  const parsedRows = [];
  let validCount = 0;
  let rejectedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = splitCSVLine(rawLine);
    const cleanCells = cells.map(c => c.replace(/^["']|["']$/g, "").trim());

    const rollNumber = (cleanCells[rollIdx] || "").toUpperCase();
    const name = cleanCells[nameIdx] || "";
    
    // Read row-level branch/year/section if present in CSV columns
    const fileRowYear = colIndex.year >= 0 && cleanCells[yearIdx] ? normalizeYear(cleanCells[yearIdx]) : null;
    const fileRowSec = colIndex.section >= 0 && cleanCells[secIdx] ? cleanCells[secIdx].replace(/^Sec(tion)?\s*/i, '').trim().toUpperCase() : null;

    const branch = targetBranch;
    const year = fileRowYear || targetYear;
    const semester = normalizeSemesterCode(context.semester || "1-1");
    const section = fileRowSec || targetSection;

    const errors = [];

    if (filenameMismatchError) {
      errors.push(filenameMismatchError);
    }

    // Check row-level year mismatch
    if (fileRowYear && fileRowYear !== targetYear) {
      errors.push(`Row year [${fileRowYear}] does not match target class [${targetYear}]`);
    }

    // Check row-level section mismatch
    if (fileRowSec && fileRowSec !== targetSection) {
      errors.push(`Row section [Section ${fileRowSec}] does not match target section [Section ${targetSection}]`);
    }

    if (!rollNumber) {
      errors.push("Missing Roll Number");
    } else {
      if (existingStudents.some(s => s.rollNumber.toUpperCase() === rollNumber)) {
        errors.push(`Roll Number [${rollNumber}] already exists in institutional registry`);
      }
      if (seenRolls.has(rollNumber)) {
        errors.push(`Duplicate Roll Number [${rollNumber}] inside spreadsheet`);
      } else {
        seenRolls.add(rollNumber);
      }
    }

    if (!name) {
      errors.push("Missing Student Name");
    }

    const isRowValid = errors.length === 0;
    if (isRowValid) validCount++;
    else rejectedCount++;

    parsedRows.push({
      rowNumber: i,
      rollNumber,
      name,
      department: branch,
      branch: branch,
      year: year,
      semester: semester,
      section: section,
      status: isRowValid ? "VALID" : "REJECTED",
      errors
    });
  }

  return {
    isValid: rejectedCount === 0 && validCount > 0,
    summary: {
      totalRows: lines.length - 1,
      validRows: validCount,
      rejectedRows: rejectedCount
    },
    rows: parsedRows
  };
}

// Generate Overall Attendance Template (Native Excel .xlsx & CSV with proper column widths)
export function generateOverallAttendanceWorkbook(
  studentsList = [],
  subjects = [],
  department = "CSE",
  classSection = "II Year CSE-A",
  period = "November 2026"
) {
  // 1. Roll Number and Student Name
  const headers = ["Roll Number", "Student Name"];
  subjects.forEach(s => {
    const label = s.name || s.code;
    headers.push(`${label} (Attended)`);
    headers.push(`${label} (Total Held)`);
  });

  const data = [headers];

  if (studentsList && studentsList.length > 0) {
    studentsList.forEach(s => {
      const row = [s.rollNumber, s.name];
      subjects.forEach(() => {
        row.push(""); // Blank attended classes for teacher entry
        row.push(""); // Blank conducted classes for teacher entry
      });
      data.push(row);
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set professional auto column widths so text is never truncated in Excel
  ws['!cols'] = [
    { wch: 18 }, // Roll Number
    { wch: 28 }, // Student Name
    ...subjects.flatMap(s => [
      { wch: Math.max(16, ((s.name || s.code).length + 12)) },
      { wch: Math.max(16, ((s.name || s.code).length + 14)) }
    ])
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance Sheet");
  return wb;
}

// Generate Overall Attendance CSV Template with Subject Classes Conducted vs Attended
export function generateOverallAttendanceTemplate(
  studentsList = [],
  subjects = [],
  department = "CSE",
  classSection = "IV Year CSE-A",
  period = "October 2026"
) {
  const headers = ["Roll Number", "Student Name"];
  subjects.forEach(s => {
    const label = s.name || s.code;
    headers.push(`${label} (Attended)`);
    headers.push(`${label} (Total Held)`);
  });

  let rows = [];
  if (studentsList && studentsList.length > 0) {
    rows = studentsList.map(s => {
      const vals = [];
      subjects.forEach(() => {
        vals.push(""); // Blank attended classes
        vals.push(""); // Blank conducted classes
      });
      return `"${s.rollNumber}","${s.name}",${vals.join(",")}`;
    });
  }
  return [headers.join(","), ...rows].join("\n");
}

// Overall Attendance CSV Parser & Multi-Subject Validator
export function parseAndValidateOverallAttendanceCSV(csvContent, context = {}) {
  const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      isValid: false,
      summary: { totalRows: 0, validRows: 0, rejectedRows: 0, warningRows: 0 },
      rows: [],
      generalError: "File is empty or does not contain a valid header row."
    };
  }

  // Parse Header
  const headerCells = lines[0].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[0].split(",");
  const cleanHeader = headerCells.map(c => c.replace(/^["']|["']$/g, "").trim());

  if (cleanHeader.length < 3) {
    return {
      isValid: false,
      summary: { totalRows: 0, validRows: 0, rejectedRows: 0, warningRows: 0 },
      rows: [],
      generalError: "CSV must have at least 3 columns: Roll Number, Student Name, and at least one Subject column."
    };
  }

  const lastColIsOverall = cleanHeader[cleanHeader.length - 1].toLowerCase().includes("overall");
  const subjectEndIndex = lastColIsOverall ? cleanHeader.length - 1 : cleanHeader.length;
  const headerSubjectNames = cleanHeader.slice(2, subjectEndIndex);

  const parsedRows = [];
  const seenRollNumbers = new Set();
  let validCount = 0;
  let rejectedCount = 0;
  let warningCount = 0;

  const activeRoster = context.students && context.students.length > 0 ? context.students : INITIAL_STUDENTS;
  const configuredSubjects = context.subjects && context.subjects.length > 0 ? context.subjects : [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(",");
    const cleanCells = cells.map(c => c.replace(/^["']|["']$/g, "").trim());

    const rollNumber = (cleanCells[0] || "").toUpperCase();
    const name = cleanCells[1] || "";
    const errors = [];
    const warnings = [];

    // 1. Roll number validation
    if (!rollNumber) {
      errors.push("Missing Student Roll Number");
    } else {
      if (seenRollNumbers.has(rollNumber)) {
        errors.push(`Duplicate row for Roll Number [${rollNumber}] in this spreadsheet`);
      } else {
        seenRollNumbers.add(rollNumber);
      }

      // Check against roster
      const studentMatch = activeRoster.find(s => s.rollNumber.toUpperCase() === rollNumber);
      if (!studentMatch) {
        errors.push(`Unknown Roll Number [${rollNumber}] not registered in college roster`);
      } else {
        if (context.department && studentMatch.department !== context.department) {
          errors.push(`Roll Number belongs to [${studentMatch.department}], outside assigned department [${context.department}]`);
        }
        if (context.section && studentMatch.section !== context.section) {
          errors.push(`Student is enrolled in Section [${studentMatch.section}], not target Section [${context.section}]`);
        }
      }
    }

    // 2. Subject columns validation (Supports single column % OR two columns: Attended, Conducted)
    const rowSubjects = [];
    let sumPercentage = 0;
    let validSubjectCount = 0;

    // Detect if headers follow "Subject (Attended)", "Subject (Total Held)" pairs
    const isAttendedHeldPairs = headerSubjectNames.some(h => /attended|held|conducted/i.test(h));

    if (isAttendedHeldPairs) {
      // Process pairs
      for (let sIdx = 0; sIdx < configuredSubjects.length; sIdx++) {
        const sub = configuredSubjects[sIdx];
        const attendedColIdx = 2 + (sIdx * 2);
        const heldColIdx = 2 + (sIdx * 2) + 1;

        const attendedVal = parseFloat(cleanCells[attendedColIdx] || '0');
        const heldVal = parseFloat(cleanCells[heldColIdx] || '0');

        if (isNaN(heldVal) || heldVal <= 0) {
          errors.push(`Invalid classes held for ${sub.name || sub.code}`);
        } else if (isNaN(attendedVal) || attendedVal < 0 || attendedVal > heldVal) {
          errors.push(`Attended classes (${cleanCells[attendedColIdx]}) cannot exceed conducted (${heldVal}) for ${sub.name || sub.code}`);
        } else {
          const subPct = parseFloat(((attendedVal / heldVal) * 100).toFixed(1));
          sumPercentage += subPct;
          validSubjectCount++;
          rowSubjects.push({
            code: sub.code || `SUB${sIdx + 1}`,
            name: sub.name || `Subject ${sIdx + 1}`,
            classesHeld: heldVal,
            classesAttended: attendedVal,
            attendancePct: subPct
          });
        }
      }
    } else {
      // Standard percentage columns
      for (let sIdx = 0; sIdx < headerSubjectNames.length; sIdx++) {
        const colName = headerSubjectNames[sIdx];
        const valStr = cleanCells[2 + sIdx] || "";
        const numStr = valStr.replace(/%/g, "").trim();
        const numVal = parseFloat(numStr);

        const matchedConfig = configuredSubjects.find(cs => 
          (cs.name && cs.name.toLowerCase() === colName.toLowerCase()) || 
          (cs.code && cs.code.toLowerCase() === colName.toLowerCase())
        ) || configuredSubjects[sIdx] || { code: `SUB${sIdx + 1}`, name: colName };

        if (valStr === "" || isNaN(numVal)) {
          errors.push(`Missing or invalid percentage value for subject [${colName}]`);
        } else if (numVal < 0 || numVal > 100) {
          errors.push(`Attendance percentage for [${colName}] (${valStr}) must be between 0% and 100%`);
        } else {
          sumPercentage += numVal;
          validSubjectCount++;
          rowSubjects.push({
            code: matchedConfig.code || `SUB${sIdx + 1}`,
            name: matchedConfig.name || colName,
            classesHeld: 50,
            classesAttended: Math.round(50 * (numVal / 100)),
            attendancePct: parseFloat(numVal.toFixed(1))
          });
        }
      }
    }

    // 3. Overall calculation
    let calculatedOverall = 0;
    if (validSubjectCount > 0) {
      calculatedOverall = parseFloat((sumPercentage / validSubjectCount).toFixed(1));
    }

    if (lastColIsOverall && cleanCells[cleanHeader.length - 1]) {
      const explicitOverall = parseFloat(cleanCells[cleanHeader.length - 1].replace(/%/g, "").trim());
      if (!isNaN(explicitOverall) && Math.abs(explicitOverall - calculatedOverall) > 1.5) {
        warnings.push(`Provided overall (${explicitOverall}%) differs from computed subject average (${calculatedOverall}%) — calculated average used`);
      }
    }

    if (calculatedOverall < 65) {
      warnings.push(`Detention Alert: Aggregate attendance (${calculatedOverall}%) is below 65% mandatory threshold`);
    } else if (calculatedOverall < 75) {
      warnings.push(`Condonation Required: Aggregate attendance (${calculatedOverall}%) is between 65% and 75%`);
    }

    const rowStatus = errors.length > 0 ? "REJECTED" : warnings.length > 0 ? "WARNING" : "VALID";
    if (rowStatus === "VALID") validCount++;
    else if (rowStatus === "WARNING") {
      validCount++;
      warningCount++;
    } else {
      rejectedCount++;
    }

    parsedRows.push({
      rowNumber: i,
      rollNumber,
      name,
      department: context.department || "CSE",
      year: context.year || "II Year",
      section: context.section || "A",
      period: context.period || "October 2026",
      subjects: rowSubjects,
      overallAttendance: calculatedOverall,
      status: rowStatus,
      errors,
      warnings
    });
  }

  return {
    isValid: rejectedCount === 0,
    summary: {
      totalRows: lines.length - 1,
      validRows: validCount,
      rejectedRows: rejectedCount,
      warningRows: warningCount
    },
    rows: parsedRows,
    subjectNames: headerSubjectNames
  };
}

// Sample Valid Overall Attendance CSV
export function getSampleValidOverallCSV(subjects = [], context = {}) {
  const dept = context.department || 'CSE';
  const sec = context.section || 'A';
  const subjectList = subjects.length > 0 ? subjects : [
    { code: 'CS301PC', name: 'Data Structures & Algorithms' },
    { code: 'CS302PC', name: 'Discrete Mathematics' },
    { code: 'CS303PC', name: 'Digital Logic Design' },
    { code: 'CS304PC', name: 'Python Programming' }
  ];
  const headers = ["Roll Number", "Student Name", ...subjectList.map(s => s.name), "Overall Attendance"];
  
  const roster = context.students && context.students.length > 0 ? context.students : INITIAL_STUDENTS;
  let targetStudents = roster.filter(s => s.department === dept && (context.section ? s.section === sec : true));
  
  if (targetStudents.length === 0) {
    targetStudents = roster.slice(0, 3);
  }

  const sampleScores = [
    [92, 88, 85, 90, 89],
    [95, 92, 94, 96, 91],
    [78, 80, 74, 82, 79],
    [85, 84, 86, 88, 85]
  ];

  const rows = targetStudents.map((s, idx) => {
    const scores = sampleScores[idx % sampleScores.length];
    const pcts = subjectList.map((_, sIdx) => scores[sIdx % scores.length]);
    const avg = (pcts.reduce((a, b) => a + b, 0) / pcts.length).toFixed(1);
    return `"${s.rollNumber}","${s.name}",${pcts.map(p => `${p}%`).join(",")},"${avg}%"`;
  });

  return [headers.join(","), ...rows].join("\n");
}

// Sample Problematic Overall Attendance CSV
export function getSampleProblematicOverallCSV(subjects = [], context = {}) {
  const subjectList = subjects.length > 0 ? subjects : [
    { code: 'CS301PC', name: 'Data Structures & Algorithms' },
    { code: 'CS302PC', name: 'Discrete Mathematics' },
    { code: 'CS303PC', name: 'Digital Logic Design' },
    { code: 'CS304PC', name: 'Python Programming' }
  ];
  const headers = ["Roll Number", "Student Name", ...subjectList.map(s => s.name), "Overall Attendance"];
  
  const roster = context.students && context.students.length > 0 ? context.students : INITIAL_STUDENTS;
  const firstStudent = roster[0] || { rollNumber: "23NE1A05K3", name: "RangiSetty Veda Venkata Rajeevan" };

  return [
    headers.join(","),
    // 1. Valid row
    `"${firstStudent.rollNumber}","${firstStudent.name}",${subjectList.map(() => '88%').join(",")},"88.0%"`,
    // 2. Unknown student roll number
    `"23NE1A9999","Unknown Student",${subjectList.map(() => '82%').join(",")},"82.0%"`,
    // 3. Out-of-bounds percentage (125%)
    `"${firstStudent.rollNumber}","Duplicate Row with 125%",${subjectList.map((_, i) => i === 0 ? '125%' : '80%').join(",")},"89.0%"`,
    // 4. Negative percentage (-10%)
    `"24NE1A0502","Invalid Negative Score",${subjectList.map((_, i) => i === 0 ? '-10%' : '75%').join(",")},"53.8%"`,
    // 5. Condonation / Detention Warning (<65%)
    `"24NE1A0503","Low Attendance Student",${subjectList.map(() => '58%').join(",")},"58.0%"`
  ].join("\n");
}
