
import { useState } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Ali Ahmed", roll: "1001", className: "Class 8", phone: "03001234567" },
  { id: 2, name: "Sara Khan", roll: "1002", className: "Class 7", phone: "03111234567" },
  { id: 3, name: "Usman Malik", roll: "1003", className: "Class 9", phone: "03221234567" },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [schoolSettings, setSchoolSettings] = useState(() => {
    const defaults = { schoolName: "School Management System", address: "", phone: "", email: "", session: "2026-2027", currency: "PKR", logoUrl: "", accentColor: "#4263eb" };
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem("schoolSettings")) || {}) }; } catch { return defaults; }
  });
  const [adminProfile, setAdminProfile] = useState(() => {
    const defaults = { name: "Admin User", email: "admin@school.local", phone: "" };
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem("schoolAdminProfile")) || {}) }; } catch { return defaults; }
  });
  const [adminForm, setAdminForm] = useState(() => ({ ...adminProfile }));
  const [schoolForm, setSchoolForm] = useState(() => ({ ...schoolSettings }));
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [adminNotice, setAdminNotice] = useState("");
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("schoolStudents");
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });
  const [search, setSearch] = useState("");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().getFullYear() +
    "-" +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    "-" +
    String(new Date().getDate()).padStart(2, "0")
  );

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("schoolAttendance")) || {};
    } catch {
      return {};
    }
  });

  const [attendanceSearch, setAttendanceSearch] = useState("");

  function markAttendance(studentId, status) {
    const updated = {
      ...attendanceRecords,
      [attendanceDate]: {
        ...(attendanceRecords[attendanceDate] || {}),
        [studentId]: status,
      },
    };

    setAttendanceRecords(updated);
    localStorage.setItem("schoolAttendance", JSON.stringify(updated));
  }

  const todayAttendance = attendanceRecords[attendanceDate] || {};

  const filteredAttendanceStudents = students.filter((student) =>
    `${student.name} ${student.roll} ${student.className}`
      .toLowerCase()
      .includes(attendanceSearch.toLowerCase())
  );

  const presentCount = students.filter(
    (student) => todayAttendance[student.id] === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => todayAttendance[student.id] === "Absent"
  ).length;

  // Dashboard attendance for today's local date.
  const dashboardToday = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  })();

  const dashboardAttendance = attendanceRecords[dashboardToday] || {};

  const attendancePercentage =
    students.length === 0
      ? 0
      : Math.round(
          (students.filter(
            (student) => dashboardAttendance[student.id] === "Present"
          ).length /
            students.length) *
            100
        );

  const dashboardPresentCount = students.filter(
    (student) => dashboardAttendance[student.id] === "Present"
  ).length;
  const dashboardAbsentCount = students.filter(
    (student) => dashboardAttendance[student.id] === "Absent"
  ).length;
  const dashboardMarkedCount = dashboardPresentCount + dashboardAbsentCount;


  const [classes, setClasses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("schoolClasses")) || [];
    } catch {
      return [];
    }
  });

  const [classSearch, setClassSearch] = useState("");
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);

  const [classForm, setClassForm] = useState({
    name: "",
    teacher: "",
    room: "",
  });

  function saveClasses(updated) {
    setClasses(updated);
    localStorage.setItem("schoolClasses", JSON.stringify(updated));
  }

  function openClassForm(item = null) {
    setEditingClassId(item ? item.id : null);
    setClassForm(
      item
        ? { name: item.name, teacher: item.teacher, room: item.room }
        : { name: "", teacher: "", room: "" }
    );
    setShowClassForm(true);
  }

  function submitClass(event) {
    event.preventDefault();

    if (!classForm.name.trim()) {
      alert("Please enter a class name.");
      return;
    }

    const updated =
      editingClassId !== null
        ? classes.map((item) =>
          item.id === editingClassId ? { ...item, ...classForm } : item
        )
        : [...classes, { ...classForm, id: Date.now() }];

    saveClasses(updated);
    setShowClassForm(false);
    setEditingClassId(null);
    setClassForm({ name: "", teacher: "", room: "" });
  }

  function deleteClass(id) {
    if (window.confirm("Are you sure you want to delete this class?")) {
      saveClasses(classes.filter((item) => item.id !== id));
    }
  }

  const filteredClasses = classes.filter((item) =>
    `${item.name} ${item.teacher} ${item.room}`
      .toLowerCase()
      .includes(classSearch.toLowerCase())
  );





  const [teachers, setTeachers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("schoolTeachers")) || [];
    } catch {
      return [];
    }
  });

  const [teacherSearch, setTeacherSearch] = useState("");
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    subject: "",
    phone: "",
    email: "",
  });

  function saveTeachers(updated) {
    setTeachers(updated);
    localStorage.setItem("schoolTeachers", JSON.stringify(updated));
  }

  function openTeacherForm(teacher = null) {
    setEditingTeacherId(teacher ? teacher.id : null);
    setTeacherForm(
      teacher
        ? {
          name: teacher.name,
          subject: teacher.subject,
          phone: teacher.phone,
          email: teacher.email,
        }
        : { name: "", subject: "", phone: "", email: "" }
    );
    setShowTeacherForm(true);
  }

  function submitTeacher(event) {
    event.preventDefault();

    if (!teacherForm.name.trim() || !teacherForm.subject.trim()) {
      alert("Teacher name aur subject enter karein.");
      return;
    }

    const updated =
      editingTeacherId !== null
        ? teachers.map((teacher) =>
          teacher.id === editingTeacherId
            ? { ...teacher, ...teacherForm }
            : teacher
        )
        : [...teachers, { ...teacherForm, id: Date.now() }];

    saveTeachers(updated);
    setShowTeacherForm(false);
    setEditingTeacherId(null);
    setTeacherForm({ name: "", subject: "", phone: "", email: "" });
  }

  function deleteTeacher(id) {
    if (window.confirm("Kya aap is teacher ko delete karna chahte hain?")) {
      saveTeachers(teachers.filter((teacher) => teacher.id !== id));
    }
  }

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.name} ${teacher.subject} ${teacher.phone}`
      .toLowerCase()
      .includes(teacherSearch.toLowerCase())
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    roll: "",
    className: "Class 6",
    phone: "",
  });

  function saveStudents(updated) {
    setStudents(updated);
    localStorage.setItem("schoolStudents", JSON.stringify(updated));
  }

  function openAddForm() {
    setEditingId(null);
    setForm({ name: "", roll: "", className: "Class 6", phone: "" });
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      roll: student.roll,
      className: student.className,
      phone: student.phone,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.roll.trim()) {
      alert("Please enter the student name and roll number.");
      return;
    }

    const duplicate = students.some(
      (student) =>
        student.roll.trim().toLowerCase() === form.roll.trim().toLowerCase() &&
        student.id !== editingId
    );

    if (duplicate) {
      alert("This roll number already exists.");
      return;
    }

    if (editingId !== null) {
      saveStudents(
        students.map((student) =>
          student.id === editingId ? { ...student, ...form } : student
        )
      );
    } else {
      saveStudents([
        ...students,
        { ...form, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", roll: "", className: "Class 6", phone: "" });
  }

  function deleteStudent(id) {
    if (window.confirm("Are you sure you want to delete this student?")) {
      saveStudents(students.filter((student) => student.id !== id));
    }
  }

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.roll} ${student.className}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Fee records are stored locally in the browser, matching this project's current storage approach.
  const [feeRecords, setFeeRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("schoolFees")) || [];
    } catch {
      return [];
    }
  });
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const localToday = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;
  const [feeSearch, setFeeSearch] = useState("");
  const [feeStatusFilter, setFeeStatusFilter] = useState("All");
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [feeForm, setFeeForm] = useState({
    studentId: "",
    month: currentMonth,
    feeAmount: "",
    amountPaid: "0",
    paymentDate: localToday,
    note: "",
  });

  function saveFeeRecords(updated) {
    setFeeRecords(updated);
    localStorage.setItem("schoolFees", JSON.stringify(updated));
  }

  function openFeeForm() {
    setFeeForm({
      studentId: students.length ? String(students[0].id) : "",
      month: currentMonth,
      feeAmount: "",
      amountPaid: "0",
      paymentDate: localToday,
      note: "",
    });
    setShowFeeForm(true);
  }

  function submitFeeRecord(event) {
    event.preventDefault();
    const student = students.find((item) => String(item.id) === String(feeForm.studentId));
    const feeAmount = Number(feeForm.feeAmount);
    const amountPaid = Number(feeForm.amountPaid || 0);

    if (!student) {
      alert("Please add a student first, then create a fee record.");
      return;
    }
    if (!feeForm.month || !feeForm.paymentDate || !Number.isFinite(feeAmount) || feeAmount <= 0) {
      alert("Please enter a valid month and fee amount greater than zero.");
      return;
    }
    if (!Number.isFinite(amountPaid) || amountPaid < 0) {
      alert("Amount received cannot be negative.");
      return;
    }

    const existing = feeRecords.find(
      (record) => String(record.studentId) === String(student.id) && record.month === feeForm.month
    );

    if (existing) {
      const remaining = Math.max(0, Number(existing.feeAmount) - Number(existing.amountPaid));
      if (amountPaid > remaining) {
        alert(`This student already has a fee record for ${feeForm.month}. Remaining balance is Rs. ${remaining.toLocaleString()}. Enter a payment up to this amount.`);
        return;
      }
      const updated = feeRecords.map((record) => {
        if (record.id !== existing.id) return record;
        const newPayment = amountPaid > 0 ? [{ id: Date.now(), amount: amountPaid, date: feeForm.paymentDate, note: feeForm.note.trim() }] : [];
        const newPaid = Number(record.amountPaid) + amountPaid;
        return {
          ...record,
          amountPaid: newPaid,
          status: newPaid >= Number(record.feeAmount) ? "Paid" : newPaid > 0 ? "Partial" : "Unpaid",
          payments: [...(record.payments || []), ...newPayment],
          lastPayment: amountPaid > 0 ? { amount: amountPaid, date: feeForm.paymentDate, note: feeForm.note.trim() } : record.lastPayment,
        };
      });
      saveFeeRecords(updated);
      const updatedRecord = updated.find((record) => record.id === existing.id);
      setShowFeeForm(false);
      if (amountPaid > 0) setSelectedReceipt({ ...updatedRecord, receiptAmount: amountPaid, receiptDate: feeForm.paymentDate, receiptNote: feeForm.note.trim() });
      else alert("Fee record updated.");
      return;
    }

    if (amountPaid > feeAmount) {
      alert("Amount received cannot be greater than the total fee.");
      return;
    }
    const record = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      roll: student.roll,
      className: student.className,
      month: feeForm.month,
      feeAmount,
      amountPaid,
      balance: feeAmount - amountPaid,
      status: amountPaid >= feeAmount ? "Paid" : amountPaid > 0 ? "Partial" : "Unpaid",
      createdAt: localToday,
      payments: amountPaid > 0 ? [{ id: Date.now(), amount: amountPaid, date: feeForm.paymentDate, note: feeForm.note.trim() }] : [],
      lastPayment: amountPaid > 0 ? { amount: amountPaid, date: feeForm.paymentDate, note: feeForm.note.trim() } : null,
    };
    saveFeeRecords([record, ...feeRecords]);
    setShowFeeForm(false);
    if (amountPaid > 0) setSelectedReceipt({ ...record, receiptAmount: amountPaid, receiptDate: feeForm.paymentDate, receiptNote: feeForm.note.trim() });
  }

  const enrichedFeeRecords = feeRecords.map((record) => {
    const student = students.find((item) => String(item.id) === String(record.studentId));
    const feeAmount = Number(record.feeAmount) || 0;
    const amountPaid = Number(record.amountPaid) || 0;
    return {
      ...record,
      studentName: student?.name || record.studentName || "Deleted student",
      roll: student?.roll || record.roll || "—",
      className: student?.className || record.className || "—",
      balance: Math.max(0, feeAmount - amountPaid),
      status: amountPaid >= feeAmount ? "Paid" : amountPaid > 0 ? "Partial" : "Unpaid",
    };
  });
  const filteredFeeRecords = enrichedFeeRecords.filter((record) => {
    const matchesSearch = `${record.studentName} ${record.roll} ${record.className} ${record.month}`.toLowerCase().includes(feeSearch.toLowerCase());
    return matchesSearch && (feeStatusFilter === "All" || record.status === feeStatusFilter);
  });
  const totalFees = enrichedFeeRecords.reduce((sum, record) => sum + Number(record.feeAmount || 0), 0);
  const totalCollected = enrichedFeeRecords.reduce((sum, record) => sum + Number(record.amountPaid || 0), 0);
  const totalOutstanding = enrichedFeeRecords.reduce((sum, record) => sum + Math.max(0, Number(record.feeAmount || 0) - Number(record.amountPaid || 0)), 0);

  // Exams and marks are saved locally, consistent with the rest of this demo app.
  const [examResults, setExamResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem("schoolExamResults")) || []; }
    catch { return []; }
  });
  const [examSearch, setExamSearch] = useState("");
  const [examStatusFilter, setExamStatusFilter] = useState("All");
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [examForm, setExamForm] = useState({
    examName: "", examDate: localToday, studentId: students.length ? String(students[0].id) : "",
    subject: "", totalMarks: "100", passMarks: "40", obtainedMarks: ""
  });

  function saveExamResults(updated) {
    setExamResults(updated);
    localStorage.setItem("schoolExamResults", JSON.stringify(updated));
  }

  function gradeForPercentage(percentage) {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  }

  function submitExamResult(event) {
    event.preventDefault();
    const student = students.find((item) => String(item.id) === String(examForm.studentId));
    const totalMarksValue = Number(examForm.totalMarks);
    const passMarksValue = Number(examForm.passMarks);
    const obtainedValue = Number(examForm.obtainedMarks);
    if (!student) { alert("Please add a student first."); return; }
    if (!examForm.examName.trim() || !examForm.subject.trim() || !examForm.examDate) {
      alert("Please enter exam name, date and subject."); return;
    }
    if (!Number.isFinite(totalMarksValue) || totalMarksValue <= 0 || !Number.isFinite(passMarksValue) || passMarksValue < 0 || passMarksValue > totalMarksValue || !Number.isFinite(obtainedValue) || obtainedValue < 0 || obtainedValue > totalMarksValue) {
      alert("Check marks: obtained and passing marks must be between zero and total marks."); return;
    }
    const percentage = Math.round((obtainedValue / totalMarksValue) * 10000) / 100;
    const record = {
      id: Date.now(), examName: examForm.examName.trim(), examDate: examForm.examDate,
      studentId: student.id, studentName: student.name, roll: student.roll, className: student.className,
      subject: examForm.subject.trim(), totalMarks: totalMarksValue, passMarks: passMarksValue,
      obtainedMarks: obtainedValue, percentage, grade: gradeForPercentage(percentage),
      status: obtainedValue >= passMarksValue ? "Pass" : "Fail"
    };
    const existing = examResults.find((item) => String(item.studentId) === String(student.id) && item.examName.toLowerCase() === record.examName.toLowerCase() && item.subject.toLowerCase() === record.subject.toLowerCase());
    if (existing) {
      if (!window.confirm("Marks already exist for this student, exam and subject. Update the existing marks?")) return;
      saveExamResults(examResults.map((item) => item.id === existing.id ? { ...record, id: existing.id } : item));
    } else {
      saveExamResults([record, ...examResults]);
    }
    setExamForm({ ...examForm, subject: "", obtainedMarks: "" });
    setShowExamForm(false);
  }

  const filteredExamResults = examResults.filter((record) => {
    const query = `${record.examName} ${record.studentName} ${record.roll} ${record.className} ${record.subject}`.toLowerCase();
    return query.includes(examSearch.toLowerCase()) && (examStatusFilter === "All" || record.status === examStatusFilter);
  });
  const examNamesCount = new Set(examResults.map((record) => `${record.examName}|${record.examDate}|${record.className}`)).size;
  const examPassCount = examResults.filter((record) => record.status === "Pass").length;
  const examAverage = examResults.length ? Math.round(examResults.reduce((sum, record) => sum + Number(record.percentage || 0), 0) / examResults.length) : 0;
  const reportGroups = Object.values(examResults.reduce((groups, record) => {
    const key = `${record.examName}|${record.examDate}|${record.studentId}`;
    if (!groups[key]) groups[key] = { examName: record.examName, examDate: record.examDate, studentId: record.studentId, studentName: record.studentName, roll: record.roll, className: record.className, subjects: [] };
    groups[key].subjects.push(record);
    return groups;
  }, {}));

  // Payroll and promotion records are stored locally with the rest of this demo app.
  const [payroll, setPayroll] = useState(() => { try { return JSON.parse(localStorage.getItem("schoolPayroll")) || []; } catch { return []; } });
  const [payrollSearch, setPayrollSearch] = useState("");
  const [payrollForm, setPayrollForm] = useState({ teacherId: "", month: localToday.slice(0, 7), baseSalary: "", bonus: "0", deduction: "0", status: "Pending", paymentDate: localToday });
  const [promotionHistory, setPromotionHistory] = useState(() => { try { return JSON.parse(localStorage.getItem("schoolPromotionHistory")) || []; } catch { return []; } });
  const [promotionClass, setPromotionClass] = useState("Class 1");
  const [promotionSearch, setPromotionSearch] = useState("");

  function savePayroll(updated) { setPayroll(updated); localStorage.setItem("schoolPayroll", JSON.stringify(updated)); }
  function addPayrollRecord(event) {
    event.preventDefault();
    const teacher = teachers.find(item => String(item.id) === String(payrollForm.teacherId));
    const base = Number(payrollForm.baseSalary), bonus = Number(payrollForm.bonus || 0), deduction = Number(payrollForm.deduction || 0);
    if (!teacher) { alert("Pehle teacher select karein."); return; }
    if (!payrollForm.month || !Number.isFinite(base) || base <= 0 || !Number.isFinite(bonus) || bonus < 0 || !Number.isFinite(deduction) || deduction < 0 || deduction > base + bonus) { alert("Salary, month aur bonus/deduction check karein."); return; }
    const duplicate = payroll.find(item => String(item.teacherId) === String(teacher.id) && item.month === payrollForm.month);
    if (duplicate && !window.confirm("Is teacher ki is month ki payroll pehle se hai. Update karna hai?")) return;
    const record = { id: duplicate ? duplicate.id : Date.now(), teacherId: teacher.id, teacherName: teacher.name, subject: teacher.subject || "—", month: payrollForm.month, baseSalary: base, bonus, deduction, netSalary: base + bonus - deduction, status: payrollForm.status, paymentDate: payrollForm.status === "Paid" ? (payrollForm.paymentDate || localToday) : "" };
    savePayroll(duplicate ? payroll.map(item => item.id === duplicate.id ? record : item) : [record, ...payroll]);
    setPayrollForm({ ...payrollForm, baseSalary: "", bonus: "0", deduction: "0", status: "Pending" });
  }
  function togglePayrollStatus(record) {
    const paid = record.status !== "Paid";
    savePayroll(payroll.map(item => item.id === record.id ? { ...item, status: paid ? "Paid" : "Pending", paymentDate: paid ? localToday : "" } : item));
  }
  function deletePayrollRecord(id) { if (window.confirm("Delete this payroll record?")) savePayroll(payroll.filter(item => item.id !== id)); }
  const filteredPayroll = payroll.filter(item => `${item.teacherName} ${item.subject} ${item.month} ${item.status}`.toLowerCase().includes(payrollSearch.toLowerCase()));
  const payrollPaidTotal = payroll.filter(item => item.status === "Paid").reduce((sum, item) => sum + Number(item.netSalary || 0), 0);
  const payrollPendingTotal = payroll.filter(item => item.status !== "Paid").reduce((sum, item) => sum + Number(item.netSalary || 0), 0);
  const classOptions = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const promotionCandidates = students.filter(student => student.className === promotionClass && `${student.name} ${student.roll}`.toLowerCase().includes(promotionSearch.toLowerCase()));
  function promoteClassStudents() {
    const candidates = students.filter(student => student.className === promotionClass);
    if (!candidates.length) { alert("Is class mein koi student nahi mila."); return; }
    const nextClass = promotionClass === "Class 10" ? "Graduated" : `Class ${Number(promotionClass.replace("Class ", "")) + 1}`;
    if (!window.confirm(`${candidates.length} students ko ${promotionClass} se ${nextClass} mein promote karein?`)) return;
    const updatedStudents = students.map(student => student.className === promotionClass ? { ...student, className: nextClass } : student);
    saveStudents(updatedStudents);
    const historyRecord = { id: Date.now(), date: localToday, fromClass: promotionClass, toClass: nextClass, count: candidates.length, studentNames: candidates.map(student => student.name) };
    const updatedHistory = [historyRecord, ...promotionHistory]; setPromotionHistory(updatedHistory); localStorage.setItem("schoolPromotionHistory", JSON.stringify(updatedHistory));
    alert(`${candidates.length} students successfully promoted to ${nextClass}.`);
  }

  // Timetable and school notices are stored in this browser, like the other demo modules.
  const [timetable, setTimetable] = useState(() => {
    try { return JSON.parse(localStorage.getItem("schoolTimetable")) || []; } catch { return []; }
  });
  const [timetableForm, setTimetableForm] = useState({ className: "", day: "Monday", subject: "", teacher: "", startTime: "08:00", endTime: "08:40", room: "" });
  const [timetableSearch, setTimetableSearch] = useState("");
  const [notices, setNotices] = useState(() => {
    try { return JSON.parse(localStorage.getItem("schoolNotices")) || []; } catch { return []; }
  });
  const [noticeForm, setNoticeForm] = useState({ title: "", audience: "All", date: localToday, message: "" });
  const [noticeSearch, setNoticeSearch] = useState("");

  function addTimetableEntry(event) {
    event.preventDefault();
    if (!timetableForm.className.trim() || !timetableForm.subject.trim() || !timetableForm.teacher.trim()) { alert("Please enter class, subject and teacher."); return; }
    if (timetableForm.startTime >= timetableForm.endTime) { alert("End time must be later than start time."); return; }
    const entry = { ...timetableForm, id: Date.now(), className: timetableForm.className.trim(), subject: timetableForm.subject.trim(), teacher: timetableForm.teacher.trim(), room: timetableForm.room.trim() };
    const updated = [entry, ...timetable];
    setTimetable(updated); localStorage.setItem("schoolTimetable", JSON.stringify(updated));
    setTimetableForm({ ...timetableForm, subject: "", teacher: "", room: "" });
  }

  function deleteTimetableEntry(id) {
    if (!window.confirm("Delete this timetable entry?")) return;
    const updated = timetable.filter(item => item.id !== id); setTimetable(updated); localStorage.setItem("schoolTimetable", JSON.stringify(updated));
  }

  function addNotice(event) {
    event.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.message.trim()) { alert("Please enter a notice title and message."); return; }
    const updated = [{ ...noticeForm, id: Date.now(), title: noticeForm.title.trim(), message: noticeForm.message.trim() }, ...notices];
    setNotices(updated); localStorage.setItem("schoolNotices", JSON.stringify(updated));
    setNoticeForm({ title: "", audience: "All", date: localToday, message: "" });
  }

  function deleteNotice(id) {
    if (!window.confirm("Delete this notice?")) return;
    const updated = notices.filter(item => item.id !== id); setNotices(updated); localStorage.setItem("schoolNotices", JSON.stringify(updated));
  }

  const filteredTimetable = timetable.filter(item => `${item.className} ${item.day} ${item.subject} ${item.teacher} ${item.room}`.toLowerCase().includes(timetableSearch.toLowerCase()));
  const filteredNotices = notices.filter(item => `${item.title} ${item.audience} ${item.message}`.toLowerCase().includes(noticeSearch.toLowerCase()));

  function saveAdminProfile(event) {
    event.preventDefault();
    const updated = { ...adminForm, name: adminForm.name.trim(), email: adminForm.email.trim(), phone: adminForm.phone.trim() };
    if (!updated.name || !updated.email) { setAdminNotice("Admin name aur email required hain."); return; }
    setAdminProfile(updated); localStorage.setItem("schoolAdminProfile", JSON.stringify(updated));
    setAdminNotice("Admin profile save ho gaya.");
  }
  function saveSchoolSettings(event) {
    event.preventDefault();
    const updated = { ...schoolForm, schoolName: schoolForm.schoolName.trim(), address: schoolForm.address.trim(), phone: schoolForm.phone.trim(), email: schoolForm.email.trim(), session: schoolForm.session.trim() };
    if (!updated.schoolName) { setAdminNotice("School name required hai."); return; }
    setSchoolSettings(updated); localStorage.setItem("schoolSettings", JSON.stringify(updated));
    setAdminNotice("School settings save ho gayi.");
  }
  function changeLocalAdminPassword(event) {
    event.preventDefault();
    const saved = localStorage.getItem("schoolAdminPassword");
    if ((saved || "admin123") !== passwordForm.current) { setAdminNotice("Current password sahi nahi hai. First time default password admin123 hai."); return; }
    if (passwordForm.next.length < 8) { setAdminNotice("New password kam az kam 8 characters ka hona chahiye."); return; }
    if (passwordForm.next !== passwordForm.confirm) { setAdminNotice("New password aur confirm password match nahi karte."); return; }
    localStorage.setItem("schoolAdminPassword", passwordForm.next);
    setPasswordForm({ current: "", next: "", confirm: "" });
    setAdminNotice("Local demo password update ho gaya. Note: yeh real server authentication nahi hai.");
  }
  function resetSchoolDemoData() {
    if (!window.confirm("WARNING: Is browser ke School Management records delete ho jayenge. Pehle JSON backup bana lein. Continue?")) return;
    const keys = ["schoolStudents", "schoolTeachers", "schoolClasses", "schoolAttendance", "schoolFees", "schoolExamResults", "schoolTimetable", "schoolNotices", "schoolPayroll", "schoolPromotionHistory"];
    keys.forEach(key => localStorage.removeItem(key));
    window.alert("School records clear kar diye gaye. App reload ho rahi hai.");
    window.location.reload();
  }

  function openAdminPanel() {
    setActivePage("Admin Panel");
    setShowForm(false);
    setShowExamForm(false);
    setAdminNotice("");
  }

  const menuItems = ["Dashboard", "Students", "Teachers", "Classes", "Attendance", "Fees", "Exams & Results", "Payroll", "Student Promotion", "Timetable", "Notices", "Reports & Backup"];

  const accentPalette = { "#4263eb": "#304bd1", "#0f9f8f": "#087d70", "#16803c": "#11632f", "#7c3aed": "#6024c4", "#ea580c": "#c2410c" };

  return (
    <div className="app" style={{ "--primary": schoolSettings.accentColor || "#4263eb", "--primary-dark": accentPalette[schoolSettings.accentColor] || "#304bd1" }}>
      <aside className="sidebar">
        <h2 className="school-brand">{schoolSettings.logoUrl ? <img className="school-brand-logo" src={schoolSettings.logoUrl} alt="School logo" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : null}<span className="school-brand-name">{schoolSettings.schoolName || "School Management System"}</span></h2>
        <p className="sidebar-label">MAIN MENU</p>

        {menuItems.map((item) => (
          <button
            key={item}
            className={`menu-item ${activePage === item ? "active" : ""}`}
            onClick={() => {
              setActivePage(item);
              setShowForm(false);
              setShowExamForm(false);
            }}
          >
            <span>
              {item === "Dashboard" ? "▦" :
                item === "Students" ? "♙" :
                  item === "Teachers" ? "♟" :
                    item === "Classes" ? "▤" :
                      item === "Attendance" ? "✓" : item === "Fees" ? "₹" : item === "Payroll" ? "₨" : item === "Student Promotion" ? "⇧" : item === "Timetable" ? "◷" : item === "Notices" ? "♢" : item === "Reports & Backup" ? "⇩" : item === "Admin Panel" ? "⚙" : "✎"}
            </span>
            <span>{item}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          {/* <div className="sidebar-profile">
            <div className="avatar">{(adminProfile.name || "Admin User").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</div>
            <div className="sidebar-profile-text">
              <strong>{adminProfile.name || "Admin User"}</strong>
              <small>Administrator</small>
            </div>
          </div> */}
          <button type="button" className={`sidebar-admin-button ${activePage === "Admin Panel" ? "active" : ""}`} onClick={openAdminPanel}>
            <span className="sidebar-admin-icon">⚙</span>
            <span>Admin Panel</span>
            <span className="sidebar-admin-arrow">→</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>School Management System / {activePage}</p>
          </div>
          <button type="button" className="admin-badge" onClick={openAdminPanel} aria-label="Open Admin Panel" title="Open Admin Panel">
            <span className="admin-badge-avatar">{(adminProfile.name || "Admin").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</span>
            <span>{adminProfile.name || "Admin User"}</span>
            <span className="admin-badge-chevron">⌄</span>
          </button>
        </header>

        {activePage === "Dashboard" && (
          <div className="dashboard-page">
            <section className="dashboard-hero">
              <div className="dashboard-hero-copy">
                <span className="dashboard-eyebrow"><i /> SCHOOL ADMINISTRATION</span>
                <h2>Good day, Admin <span>✦</span></h2>
                <p>Your school at a glance. Here’s the latest overview of students, attendance, fees and academic progress.</p>
                <div className="dashboard-hero-meta">
                  <span className="hero-date-icon">▦</span>
                  <span>{new Date().toLocaleDateString("en-PK", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="hero-meta-divider" />
                  <span className="hero-session">Academic Session {schoolSettings.session || "2026–2027"}</span>
                </div>
                <div className="dashboard-hero-actions">
                  <button className="hero-primary-btn" onClick={() => { setActivePage("Students"); openAddForm(); }}>＋ Add Student</button>
                  <button className="hero-secondary-btn" onClick={() => setActivePage("Attendance")}>View Attendance <span>↗</span></button>
                </div>
              </div>
              <div className="dashboard-hero-art" aria-hidden="true">
                <div className="hero-orbit orbit-one" />
                <div className="hero-orbit orbit-two" />
                <div className="hero-glass-card hero-glass-card-back"><span>✦</span><b>Learning</b><small>Every day matters</small></div>
                <div className="hero-school-icon"><span>⌂</span><i>✦</i></div>
                <div className="hero-glass-card hero-glass-card-front"><span className="hero-mini-check">✓</span><div><b>School is active</b><small>All systems in one place</small></div></div>
              </div>
            </section>

            <div className="dashboard-section-heading">
              <div><span className="dashboard-section-kicker">AT A GLANCE</span><h2>School performance</h2><p>Live figures from your saved school records.</p></div>
              <span className="dashboard-live-pill"><i /> Updated from your data</span>
            </div>

            <section className="dashboard-kpi-grid">
              <button className="dashboard-kpi kpi-students" onClick={() => setActivePage("Students")}>
                <div className="kpi-top"><span className="kpi-icon">♙</span><span className="kpi-arrow">↗</span></div>
                <span className="kpi-label">Total students</span><strong>{students.length}</strong>
                <span className="kpi-foot"><b className="kpi-dot" /> Registered in the system</span>
              </button>
              <button className="dashboard-kpi kpi-teachers" onClick={() => setActivePage("Teachers")}>
                <div className="kpi-top"><span className="kpi-icon">♟</span><span className="kpi-arrow">↗</span></div>
                <span className="kpi-label">Total teachers</span><strong>{teachers.length}</strong>
                <span className="kpi-foot"><b className="kpi-dot" /> Teaching staff records</span>
              </button>
              <button className="dashboard-kpi kpi-classes" onClick={() => setActivePage("Classes")}>
                <div className="kpi-top"><span className="kpi-icon">▤</span><span className="kpi-arrow">↗</span></div>
                <span className="kpi-label">Total classes</span><strong>{classes.length}</strong>
                <span className="kpi-foot"><b className="kpi-dot" /> Classes configured</span>
              </button>
              <button className="dashboard-kpi kpi-attendance" onClick={() => setActivePage("Attendance")}>
                <div className="kpi-top"><span className="kpi-icon">✓</span><span className="kpi-arrow">↗</span></div>
                <span className="kpi-label">Attendance today</span><strong>{attendancePercentage}<small>%</small></strong>
                <span className="kpi-foot"><b className="kpi-dot" /> {dashboardPresentCount} present · {dashboardAbsentCount} absent</span>
              </button>
              <button className="dashboard-kpi kpi-fees" onClick={() => setActivePage("Fees")}>
                <div className="kpi-top"><span className="kpi-icon">₨</span><span className="kpi-arrow">↗</span></div>
                <span className="kpi-label">Fees collected</span><strong className="kpi-money">{Number(totalCollected || 0).toLocaleString("en-PK")}</strong>
                <span className="kpi-foot"><b className="kpi-dot" /> PKR recorded payments</span>
              </button>
              <button className="dashboard-kpi kpi-exams" onClick={() => setActivePage("Exams & Results")}>
                <div className="kpi-top"><span className="kpi-icon">✎</span><span className="kpi-arrow">↗</span></div>
                <span className="kpi-label">Exam records</span><strong>{examResults.length}</strong>
                <span className="kpi-foot"><b className="kpi-dot" /> {examPassCount} results marked pass</span>
              </button>
            </section>

            <section className="dashboard-main-grid">
              <div className="dashboard-panel attendance-panel">
                <div className="dashboard-panel-heading"><div><span className="panel-overline">DAILY REGISTER</span><h3>Attendance overview</h3><p>Today’s student attendance status</p></div><button className="panel-link" onClick={() => setActivePage("Attendance")}>Open register <span>→</span></button></div>
                <div className="attendance-overview-content">
                  <div className="attendance-ring" style={{ "--attendance-value": `${attendancePercentage}%` }}><div><strong>{attendancePercentage}%</strong><span>Present rate</span></div></div>
                  <div className="attendance-breakdown">
                    <div className="attendance-breakdown-row"><span><i className="attendance-dot present-dot" /> Present</span><strong>{dashboardPresentCount}<small> students</small></strong></div>
                    <div className="mini-progress"><span className="mini-progress-present" style={{ width: `${students.length ? dashboardPresentCount / students.length * 100 : 0}%` }} /></div>
                    <div className="attendance-breakdown-row"><span><i className="attendance-dot absent-dot" /> Absent</span><strong>{dashboardAbsentCount}<small> students</small></strong></div>
                    <div className="mini-progress"><span className="mini-progress-absent" style={{ width: `${students.length ? dashboardAbsentCount / students.length * 100 : 0}%` }} /></div>
                    <div className="attendance-breakdown-row"><span><i className="attendance-dot unmarked-dot" /> Not marked</span><strong>{Math.max(0, students.length - dashboardMarkedCount)}<small> students</small></strong></div>
                    <div className="mini-progress"><span className="mini-progress-unmarked" style={{ width: `${students.length ? Math.max(0, students.length - dashboardMarkedCount) / students.length * 100 : 0}%` }} /></div>
                  </div>
                </div>
                <div className="attendance-panel-footer"><span>Register completion</span><strong>{students.length ? Math.round(dashboardMarkedCount / students.length * 100) : 0}%</strong></div>
                <div className="attendance-panel-track"><span style={{ width: `${students.length ? Math.round(dashboardMarkedCount / students.length * 100) : 0}%` }} /></div>
              </div>

              <div className="dashboard-panel school-health-panel">
                <div className="dashboard-panel-heading"><div><span className="panel-overline">SCHOOL SNAPSHOT</span><h3>Workspace summary</h3><p>Quick status of your modules</p></div><span className="health-icon">✦</span></div>
                <div className="health-list">
                  <button onClick={() => setActivePage("Students")}><span className="health-row-icon health-blue">♙</span><span className="health-row-copy"><b>Student records</b><small>Manage enrolment details</small></span><strong>{students.length}</strong><span className="health-chevron">›</span></button>
                  <button onClick={() => setActivePage("Fees")}><span className="health-row-icon health-green">₨</span><span className="health-row-copy"><b>Fee collection</b><small>Outstanding: PKR {Number(totalOutstanding || 0).toLocaleString("en-PK")}</small></span><strong>{feeRecords.length}</strong><span className="health-chevron">›</span></button>
                  <button onClick={() => setActivePage("Exams & Results")}><span className="health-row-icon health-purple">✎</span><span className="health-row-copy"><b>Exams & results</b><small>Average score: {examAverage}%</small></span><strong>{examNamesCount}</strong><span className="health-chevron">›</span></button>
                </div>
                <div className="school-status-note"><span className="status-pulse" /><span><b>Everything in one place</b><small>Your records are saved in this browser.</small></span></div>
              </div>
            </section>

            <section className="dashboard-bottom-grid">
              <div className="dashboard-panel recent-students-panel">
                <div className="dashboard-panel-heading"><div><span className="panel-overline">ENROLMENT</span><h3>Recently listed students</h3><p>Student records currently in the system</p></div><button className="panel-link" onClick={() => setActivePage("Students")}>View all <span>→</span></button></div>
                {students.length ? <div className="recent-student-list">{students.slice(-4).reverse().map((student, index) => <div className="recent-student-row" key={student.id}><span className={`recent-student-avatar avatar-tone-${index % 4}`}>{String(student.name || "S").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase()}</span><span className="recent-student-name"><b>{student.name}</b><small>Roll No. {student.roll || "—"}</small></span><span className="recent-student-class">{student.className || "No class"}</span><span className="student-row-status"><i /> Active</span></div>)}</div> : <div className="dashboard-empty"><span>♙</span><b>No students yet</b><small>Add your first student to see records here.</small><button onClick={() => { setActivePage("Students"); openAddForm(); }}>＋ Add student</button></div>}
              </div>
              <div className="dashboard-panel recent-exams-panel">
                <div className="dashboard-panel-heading"><div><span className="panel-overline">ACADEMIC PROGRESS</span><h3>Recent exam results</h3><p>Latest saved marks and grades</p></div><button className="panel-link" onClick={() => setActivePage("Exams & Results")}>View all <span>→</span></button></div>
                {examResults.length ? <div className="recent-exam-list">{examResults.slice(0, 4).map(record => <div className="recent-exam-row" key={record.id}><span className="exam-subject-icon">✎</span><span className="recent-exam-copy"><b>{record.studentName}</b><small>{record.examName} · {record.subject}</small></span><span className="recent-exam-score"><b>{record.percentage}%</b><small className={record.status === "Pass" ? "grade-pass" : "grade-fail"}>{record.grade} · {record.status}</small></span></div>)}</div> : <div className="dashboard-empty"><span>✎</span><b>No exam results yet</b><small>Saved results will appear in this section.</small><button onClick={() => setActivePage("Exams & Results")}>Open exams →</button></div>}
              </div>
            </section>

            <section className="dashboard-quick-actions">
              <div><span className="panel-overline">SHORTCUTS</span><h3>What would you like to do?</h3><p>Go directly to a frequently used module.</p></div>
              <div className="dashboard-shortcut-list">
                <button onClick={() => { setActivePage("Students"); openAddForm(); }}><span className="shortcut-icon shortcut-indigo">＋</span><span><b>Add student</b><small>New enrolment</small></span><i>↗</i></button>
                <button onClick={() => { setActivePage("Teachers"); setShowTeacherForm(true); setEditingTeacherId(null); setTeacherForm({ name: "", subject: "", phone: "", email: "" }); }}><span className="shortcut-icon shortcut-mint">♙</span><span><b>Add teacher</b><small>Staff records</small></span><i>↗</i></button>
                <button onClick={() => setActivePage("Fees")}><span className="shortcut-icon shortcut-amber">₨</span><span><b>Record a fee</b><small>Manage payments</small></span><i>↗</i></button>
                <button onClick={() => setActivePage("Exams & Results")}><span className="shortcut-icon shortcut-lilac">✎</span><span><b>Enter results</b><small>Exam marks</small></span><i>↗</i></button>
              </div>
            </section>
          </div>
        )}

        {activePage === "Students" && (
          <section className="content-card students-page">
            <div className="students-toolbar">
              <div>
                <h2>All Students</h2>
                <p>Manage your school student records.</p>
              </div>
              {!showForm && (
                <button className="primary-btn" onClick={openAddForm}>
                  + Add Student
                </button>
              )}
            </div>

            {showForm && (
              <form className="student-form" onSubmit={handleSubmit}>
                <h3>{editingId !== null ? "Edit Student" : "Add New Student"}</h3>

                <div className="form-grid">
                  <label>
                    Student Name *
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter full name"
                      required
                    />
                  </label>
                  <label>
                    Roll Number *
                    <input
                      value={form.roll}
                      onChange={(e) => setForm({ ...form, roll: e.target.value })}
                      placeholder="e.g. 1004"
                      required
                    />
                  </label>
                  <label>
                    Class
                    <select
                      value={form.className}
                      onChange={(e) => setForm({ ...form, className: e.target.value })}
                    >
                      {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
                        "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Phone Number
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="03XXXXXXXXX"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="primary-btn" type="submit">
                    {editingId !== null ? "Update Student" : "Save Student"}
                  </button>
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-toolbar">
              <input
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, roll number or class..."
              />
              <span className="student-count">{filteredStudents.length} students</span>
            </div>

            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Class</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <strong>{student.name}</strong>
                        </div>
                      </td>
                      <td>{student.roll}</td>
                      <td><span className="class-tag">{student.className}</span></td>
                      <td>{student.phone || "—"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => openEditForm(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteStudent(student.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}


        {activePage === "Teachers" && (
          <section className="content-card students-page">
            <div className="students-toolbar">
              <div>
                <h2>All Teachers</h2>
                <p>Manage teacher records and contact details.</p>
              </div>

              {!showTeacherForm && (
                <button className="primary-btn" onClick={() => openTeacherForm()}>
                  + Add Teacher
                </button>
              )}
            </div>

            {showTeacherForm && (
              <form className="student-form" onSubmit={submitTeacher}>
                <h3>{editingTeacherId !== null ? "Edit Teacher" : "Add New Teacher"}</h3>

                <div className="form-grid">
                  <label>
                    Teacher Name *
                    <input
                      required
                      value={teacherForm.name}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, name: e.target.value })
                      }
                      placeholder="Enter teacher name"
                    />
                  </label>

                  <label>
                    Subject *
                    <input
                      required
                      value={teacherForm.subject}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, subject: e.target.value })
                      }
                      placeholder="e.g. Mathematics"
                    />
                  </label>

                  <label>
                    Phone
                    <input
                      value={teacherForm.phone}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, phone: e.target.value })
                      }
                      placeholder="03XXXXXXXXX"
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      value={teacherForm.email}
                      onChange={(e) =>
                        setTeacherForm({ ...teacherForm, email: e.target.value })
                      }
                      placeholder="teacher@example.com"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="primary-btn" type="submit">
                    {editingTeacherId !== null ? "Update Teacher" : "Save Teacher"}
                  </button>
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => setShowTeacherForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-toolbar">
              <input
                className="search-input"
                placeholder="Search teachers..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
              />
              <span className="student-count">{filteredTeachers.length} teachers</span>
            </div>

            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar">
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>
                          <strong>{teacher.name}</strong>
                        </div>
                      </td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.phone || "—"}</td>
                      <td>{teacher.email || "—"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => openTeacherForm(teacher)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteTeacher(teacher.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredTeachers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No teachers found. Click Add Teacher to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "Classes" && (
          <section className="content-card students-page">
            <div className="students-toolbar">
              <div>
                <h2>All Classes</h2>
                <p>Manage classes, teachers and room numbers.</p>
              </div>

              {!showClassForm && (
                <button className="primary-btn" onClick={() => openClassForm()}>
                  + Add Class
                </button>
              )}
            </div>

            {showClassForm && (
              <form className="student-form" onSubmit={submitClass}>
                <h3>{editingClassId !== null ? "Edit Class" : "Add New Class"}</h3>

                <div className="form-grid">
                  <label>
                    Class Name *
                    <input
                      required
                      value={classForm.name}
                      onChange={(e) =>
                        setClassForm({ ...classForm, name: e.target.value })
                      }
                      placeholder="e.g. Class 6"
                    />
                  </label>

                  <label>
                    Class Teacher
                    <input
                      value={classForm.teacher}
                      onChange={(e) =>
                        setClassForm({ ...classForm, teacher: e.target.value })
                      }
                      placeholder="Enter teacher name"
                    />
                  </label>

                  <label>
                    Room Number
                    <input
                      value={classForm.room}
                      onChange={(e) =>
                        setClassForm({ ...classForm, room: e.target.value })
                      }
                      placeholder="e.g. Room 101"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button className="primary-btn" type="submit">
                    {editingClassId !== null ? "Update Class" : "Save Class"}
                  </button>

                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => setShowClassForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-toolbar">
              <input
                className="search-input"
                placeholder="Search classes..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
              />
              <span className="student-count">{filteredClasses.length} classes</span>
            </div>

            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Class Teacher</th>
                    <th>Room Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredClasses.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td>{item.teacher || "—"}</td>
                      <td>{item.room || "—"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => openClassForm(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteClass(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredClasses.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No classes found. Click Add Class to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "Attendance" && (
          <section className="content-card students-page">
            <div className="students-toolbar">
              <div>
                <h2>Student Attendance</h2>
                <p>Mark and review daily student attendance.</p>
              </div>

              <label className="attendance-date-label">
                Attendance Date
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </label>
            </div>

            <section className="stats-grid attendance-stats">
              <div className="stat-card">
                <div className="stat-icon blue">♙</div>
                <p>Total Students</p>
                <h2>{students.length}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <p>Present</p>
                <h2>{presentCount}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">✕</div>
                <p>Absent</p>
                <h2>{absentCount}</h2>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">◷</div>
                <p>Not Marked</p>
                <h2>{students.length - presentCount - absentCount}</h2>
              </div>
            </section>

            <div className="table-toolbar">
              <input
                className="search-input"
                placeholder="Search student by name or roll number..."
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
              />
              <span className="student-count">
                {filteredAttendanceStudents.length} students
              </span>
            </div>

            <div className="table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Class</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendanceStudents.map((student) => {
                    const status = todayAttendance[student.id];

                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="student-name-cell">
                            <div className="student-avatar">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <strong>{student.name}</strong>
                          </div>
                        </td>

                        <td>{student.roll}</td>
                        <td>{student.className}</td>

                        <td>
                          <div className="attendance-actions">
                            <button
                              className={`attendance-btn present-btn ${status === "Present" ? "selected" : ""
                                }`}
                              onClick={() => markAttendance(student.id, "Present")}
                            >
                              Present
                            </button>

                            <button
                              className={`attendance-btn absent-btn ${status === "Absent" ? "selected" : ""
                                }`}
                              onClick={() => markAttendance(student.id, "Absent")}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAttendanceStudents.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No students found. Add students in Students Management first.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}




        {activePage === "Fees" && (
          <section className="content-card students-page fees-page">
            <div className="students-toolbar">
              <div>
                <h2>Fees Management</h2>
                <p>Track monthly fees, payments, balances and print receipts.</p>
              </div>
              <button className="primary-btn" onClick={openFeeForm} disabled={students.length === 0}>+ Add Fee Record</button>
            </div>

            <div className="fee-summary-grid">
              <div className="fee-summary-card"><span className="fee-summary-icon fee-blue">▤</span><p>Total Fees</p><h3>Rs. {totalFees.toLocaleString()}</h3><small>All saved fee records</small></div>
              <div className="fee-summary-card"><span className="fee-summary-icon fee-green">✓</span><p>Collected</p><h3>Rs. {totalCollected.toLocaleString()}</h3><small>Payments received</small></div>
              <div className="fee-summary-card"><span className="fee-summary-icon fee-orange">◷</span><p>Outstanding</p><h3>Rs. {totalOutstanding.toLocaleString()}</h3><small>Remaining balance</small></div>
              <div className="fee-summary-card"><span className="fee-summary-icon fee-purple">♙</span><p>Fee Records</p><h3>{feeRecords.length}</h3><small>Student-month entries</small></div>
            </div>

            {showFeeForm && (
              <form className="student-form fee-form" onSubmit={submitFeeRecord}>
                <h3>Add Fee Record / Receive Payment</h3>
                {students.length === 0 ? <p>Please add a student in Students Management first.</p> : (
                  <div className="form-grid">
                    <label>Student *
                      <select value={feeForm.studentId} onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })} required>
                        {students.map((student) => <option key={student.id} value={String(student.id)}>{student.name} — Roll {student.roll} ({student.className})</option>)}
                      </select>
                    </label>
                    <label>Fee Month *
                      <input type="month" value={feeForm.month} onChange={(e) => setFeeForm({ ...feeForm, month: e.target.value })} required />
                    </label>
                    <label>Total Monthly Fee (Rs.) *
                      <input type="number" min="1" step="1" value={feeForm.feeAmount} onChange={(e) => setFeeForm({ ...feeForm, feeAmount: e.target.value })} placeholder="e.g. 5000" required />
                    </label>
                    <label>Amount Received (Rs.)
                      <input type="number" min="0" step="1" value={feeForm.amountPaid} onChange={(e) => setFeeForm({ ...feeForm, amountPaid: e.target.value })} placeholder="0 for unpaid" />
                    </label>
                    <label>Payment Date *
                      <input type="date" value={feeForm.paymentDate} onChange={(e) => setFeeForm({ ...feeForm, paymentDate: e.target.value })} required />
                    </label>
                    <label>Payment Note
                      <input value={feeForm.note} onChange={(e) => setFeeForm({ ...feeForm, note: e.target.value })} placeholder="Cash, bank transfer, etc." />
                    </label>
                  </div>
                )}
                <p className="fee-form-hint">If this student already has a record for the selected month, the received amount will be added as a partial payment to that record.</p>
                <div className="form-actions">
                  <button className="primary-btn" type="submit">Save Fee Record</button>
                  <button className="secondary-btn" type="button" onClick={() => setShowFeeForm(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="table-toolbar fee-toolbar">
              <input className="search-input" value={feeSearch} onChange={(e) => setFeeSearch(e.target.value)} placeholder="Search student, roll number or month..." />
              <select className="fee-filter" value={feeStatusFilter} onChange={(e) => setFeeStatusFilter(e.target.value)} aria-label="Filter by payment status">
                <option value="All">All statuses</option><option value="Paid">Paid</option><option value="Partial">Partial</option><option value="Unpaid">Unpaid</option>
              </select>
              <span className="student-count">{filteredFeeRecords.length} records</span>
            </div>

            <div className="table-wrap">
              <table className="students-table fees-table">
                <thead><tr><th>Student</th><th>Month</th><th>Total Fee</th><th>Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredFeeRecords.map((record) => (
                    <tr key={record.id}>
                      <td><div className="student-name-cell"><div className="student-avatar">{record.studentName.charAt(0).toUpperCase()}</div><div><strong>{record.studentName}</strong><small className="fee-subline">Roll {record.roll} · {record.className}</small></div></div></td>
                      <td>{record.month}</td><td>Rs. {Number(record.feeAmount).toLocaleString()}</td><td>Rs. {Number(record.amountPaid).toLocaleString()}</td><td><strong className={record.balance > 0 ? "balance-due" : "balance-clear"}>Rs. {record.balance.toLocaleString()}</strong></td>
                      <td><span className={`fee-status fee-status-${record.status.toLowerCase()}`}>{record.status}</span></td>
                      <td><div className="action-buttons"><button className="edit-btn" onClick={() => setSelectedReceipt({ ...record, receiptAmount: record.lastPayment?.amount ?? record.amountPaid, receiptDate: record.lastPayment?.date ?? record.createdAt, receiptNote: record.lastPayment?.note ?? "" })}>Receipt</button>{record.balance > 0 && <button className="fee-pay-btn" onClick={() => { setFeeForm({ studentId: String(record.studentId), month: record.month, feeAmount: String(record.feeAmount), amountPaid: "0", paymentDate: localToday, note: "" }); setShowFeeForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Receive</button>}</div></td>
                    </tr>
                  ))}
                  {filteredFeeRecords.length === 0 && <tr><td colSpan="7" className="empty-state">No fee records found. Click “Add Fee Record” to get started.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activePage === "Exams & Results" && (
          <section className="content-card students-page exams-page">
            <div className="students-toolbar">
              <div><h2>Exams & Results</h2><p>Create exam entries, record student marks and print report cards.</p></div>
              <button className="primary-btn" onClick={() => { setExamForm({ examName: "", examDate: localToday, studentId: students.length ? String(students[0].id) : "", subject: "", totalMarks: "100", passMarks: "40", obtainedMarks: "" }); setShowExamForm(!showExamForm); }} disabled={students.length === 0}>+ Enter Marks</button>
            </div>
            <div className="fee-summary-grid exam-summary-grid">
              <div className="fee-summary-card"><span className="fee-summary-icon fee-blue">▤</span><p>Exam Groups</p><h3>{examNamesCount}</h3><small>Exam, date and class combinations</small></div>
              <div className="fee-summary-card"><span className="fee-summary-icon fee-purple">✎</span><p>Marks Entries</p><h3>{examResults.length}</h3><small>Student subject records</small></div>
              <div className="fee-summary-card"><span className="fee-summary-icon fee-green">✓</span><p>Pass Entries</p><h3>{examPassCount}</h3><small>Marks at or above pass marks</small></div>
              <div className="fee-summary-card"><span className="fee-summary-icon fee-orange">%</span><p>Average</p><h3>{examAverage}%</h3><small>Average percentage across entries</small></div>
            </div>
            {showExamForm && <form className="student-form exam-form" onSubmit={submitExamResult}>
              <h3>Enter Student Marks</h3>
              {students.length === 0 ? <p>Add students before entering marks.</p> : <div className="form-grid">
                <label>Exam Name *<input value={examForm.examName} onChange={(e) => setExamForm({ ...examForm, examName: e.target.value })} placeholder="e.g. Mid Term 2026" required /></label>
                <label>Exam Date *<input type="date" value={examForm.examDate} onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })} required /></label>
                <label>Student *<select value={examForm.studentId} onChange={(e) => setExamForm({ ...examForm, studentId: e.target.value })} required>{students.map((student) => <option key={student.id} value={String(student.id)}>{student.name} — Roll {student.roll} ({student.className})</option>)}</select></label>
                <label>Subject *<input value={examForm.subject} onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })} placeholder="e.g. Mathematics" required /></label>
                <label>Total Marks *<input type="number" min="1" step="any" value={examForm.totalMarks} onChange={(e) => setExamForm({ ...examForm, totalMarks: e.target.value })} required /></label>
                <label>Passing Marks *<input type="number" min="0" step="any" value={examForm.passMarks} onChange={(e) => setExamForm({ ...examForm, passMarks: e.target.value })} required /></label>
                <label>Obtained Marks *<input type="number" min="0" step="any" max={examForm.totalMarks || undefined} value={examForm.obtainedMarks} onChange={(e) => setExamForm({ ...examForm, obtainedMarks: e.target.value })} placeholder="Enter marks" required /></label>
              </div>}
              <p className="fee-form-hint">Percentage, grade and pass/fail status are calculated automatically. Use the same exam name and date for subjects belonging to one exam.</p>
              <div className="form-actions"><button className="primary-btn" type="submit">Save Marks</button><button className="secondary-btn" type="button" onClick={() => setShowExamForm(false)}>Cancel</button></div>
            </form>}
            <div className="table-toolbar fee-toolbar"><input className="search-input" value={examSearch} onChange={(e) => setExamSearch(e.target.value)} placeholder="Search exam, student, roll or subject..." /><select className="fee-filter" value={examStatusFilter} onChange={(e) => setExamStatusFilter(e.target.value)} aria-label="Filter results"><option value="All">All results</option><option value="Pass">Pass</option><option value="Fail">Fail</option></select><span className="student-count">{filteredExamResults.length} entries</span></div>
            <div className="table-wrap"><table className="students-table exams-table"><thead><tr><th>Exam / Date</th><th>Student</th><th>Subject</th><th>Marks</th><th>Percentage</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead><tbody>
              {filteredExamResults.map((record) => <tr key={record.id}><td><strong>{record.examName}</strong><small className="fee-subline">{record.examDate}</small></td><td><div className="student-name-cell"><div className="student-avatar">{record.studentName.charAt(0).toUpperCase()}</div><div><strong>{record.studentName}</strong><small className="fee-subline">Roll {record.roll} · {record.className}</small></div></div></td><td>{record.subject}</td><td><strong>{record.obtainedMarks}</strong> / {record.totalMarks}</td><td>{Number(record.percentage).toFixed(2)}%</td><td><span className="exam-grade">{record.grade}</span></td><td><span className={`fee-status ${record.status === "Pass" ? "fee-status-paid" : "fee-status-unpaid"}`}>{record.status}</span></td><td><div className="action-buttons"><button className="edit-btn" onClick={() => setSelectedReport(reportGroups.find((group) => String(group.studentId) === String(record.studentId) && group.examName === record.examName && group.examDate === record.examDate))}>Report Card</button><button className="delete-btn" onClick={() => { if (window.confirm("Delete this marks entry?")) saveExamResults(examResults.filter((item) => item.id !== record.id)); }}>Delete</button></div></td></tr>)}
              {filteredExamResults.length === 0 && <tr><td colSpan="8" className="empty-state">No results found. Click “Enter Marks” to add the first result.</td></tr>}
            </tbody></table></div>
          </section>
        )}

        {selectedReport && (
          <div className="receipt-overlay" role="dialog" aria-modal="true" aria-label="Student report card">
            <div className="receipt-card report-card">
              <div className="receipt-brand"><div className="receipt-logo">SMS</div><div><h2>School Management System</h2><p>STUDENT EXAM REPORT CARD</p></div></div>
              <div className="receipt-rule" />
              <h3>Student Details</h3>
              <div className="receipt-details"><div><small>Student Name</small><strong>{selectedReport.studentName}</strong></div><div><small>Roll Number</small><strong>{selectedReport.roll}</strong></div><div><small>Class</small><strong>{selectedReport.className}</strong></div><div><small>Exam</small><strong>{selectedReport.examName}</strong></div><div><small>Exam Date</small><strong>{selectedReport.examDate}</strong></div></div>
              <h3>Subject Results</h3>
              <div className="table-wrap report-table-wrap"><table className="students-table"><thead><tr><th>Subject</th><th>Obtained</th><th>Total</th><th>%</th><th>Grade</th><th>Status</th></tr></thead><tbody>{selectedReport.subjects.map((item) => <tr key={item.id}><td>{item.subject}</td><td>{item.obtainedMarks}</td><td>{item.totalMarks}</td><td>{Number(item.percentage).toFixed(2)}%</td><td>{item.grade}</td><td>{item.status}</td></tr>)}</tbody></table></div>
              <div className="report-total"><span>Total Marks</span><strong>{selectedReport.subjects.reduce((sum, item) => sum + Number(item.obtainedMarks), 0)} / {selectedReport.subjects.reduce((sum, item) => sum + Number(item.totalMarks), 0)}</strong><span>Overall Percentage</span><strong>{(selectedReport.subjects.reduce((sum, item) => sum + Number(item.obtainedMarks), 0) / Math.max(1, selectedReport.subjects.reduce((sum, item) => sum + Number(item.totalMarks), 0)) * 100).toFixed(2)}%</strong><span>Overall Result</span><strong>{selectedReport.subjects.every((item) => item.status === "Pass") ? "PASS" : "NEEDS IMPROVEMENT"}</strong></div>
              <p className="receipt-thanks">Generated by School Management System.</p><div className="receipt-actions"><button className="primary-btn" onClick={() => window.print()}>Print Report Card</button><button className="secondary-btn" onClick={() => setSelectedReport(null)}>Close</button></div>
            </div>
          </div>
        )}

        {selectedReceipt && (
          <div className="receipt-overlay" role="dialog" aria-modal="true" aria-label="Fee receipt">
            <div className="receipt-card">
              <div className="receipt-brand"><div className="receipt-logo">SMS</div><div><h2>School Management System</h2><p>OFFICIAL FEE RECEIPT</p></div></div>
              <div className="receipt-meta"><span>Receipt No. <strong>FEE-{String(selectedReceipt.id).slice(-6)}</strong></span><span>Date <strong>{selectedReceipt.receiptDate || selectedReceipt.createdAt || localToday}</strong></span></div>
              <div className="receipt-rule" />
              <h3>Student Details</h3>
              <div className="receipt-details"><div><small>Student Name</small><strong>{selectedReceipt.studentName}</strong></div><div><small>Roll Number</small><strong>{selectedReceipt.roll}</strong></div><div><small>Class</small><strong>{selectedReceipt.className}</strong></div><div><small>Fee Month</small><strong>{selectedReceipt.month}</strong></div></div>
              <h3>Payment Summary</h3>
              <div className="receipt-line"><span>Monthly Fee</span><strong>Rs. {Number(selectedReceipt.feeAmount).toLocaleString()}</strong></div>
              <div className="receipt-line"><span>This Receipt Amount</span><strong>Rs. {Number(selectedReceipt.receiptAmount || 0).toLocaleString()}</strong></div>
              <div className="receipt-line"><span>Total Paid To Date</span><strong>Rs. {Number(selectedReceipt.amountPaid || 0).toLocaleString()}</strong></div>
              <div className="receipt-line receipt-balance"><span>Remaining Balance</span><strong>Rs. {Math.max(0, Number(selectedReceipt.feeAmount) - Number(selectedReceipt.amountPaid)).toLocaleString()}</strong></div>
              {selectedReceipt.receiptNote && <p className="receipt-note">Note: {selectedReceipt.receiptNote}</p>}
              <p className="receipt-thanks">Thank you. Please keep this receipt for your records.</p>
              <div className="receipt-actions"><button className="primary-btn" onClick={() => window.print()}>Print Receipt</button><button className="secondary-btn" onClick={() => setSelectedReceipt(null)}>Close</button></div>
            </div>
          </div>
        )}

        {activePage === "Payroll" && (
          <section className="content-card extra-module-page payroll-page">
            <div className="students-toolbar"><div><h2>Teacher Payroll</h2><p>Record monthly salaries, bonuses, deductions and payment status.</p></div><span className="module-count">{payroll.length} records</span></div>
            <div className="payroll-summary-grid"><div className="payroll-summary"><span>Paid salaries</span><strong>PKR {payrollPaidTotal.toLocaleString("en-PK")}</strong><small>Across all saved payroll records</small></div><div className="payroll-summary"><span>Pending salaries</span><strong>PKR {payrollPendingTotal.toLocaleString("en-PK")}</strong><small>Still marked as pending</small></div><div className="payroll-summary"><span>Paid records</span><strong>{payroll.filter(item => item.status === "Paid").length}</strong><small>Out of {payroll.length} payroll records</small></div></div>
            <form className="student-form" onSubmit={addPayrollRecord}><h3>＋ Add Monthly Salary</h3><div className="form-grid">
              <label>Teacher *<select value={payrollForm.teacherId} onChange={e => setPayrollForm({ ...payrollForm, teacherId: e.target.value })} required><option value="">Select teacher</option>{teachers.map(teacher => <option key={teacher.id} value={teacher.id}>{teacher.name} — {teacher.subject}</option>)}</select></label>
              <label>Salary month *<input type="month" value={payrollForm.month} onChange={e => setPayrollForm({ ...payrollForm, month: e.target.value })} required /></label>
              <label>Base salary (PKR) *<input type="number" min="1" step="1" value={payrollForm.baseSalary} onChange={e => setPayrollForm({ ...payrollForm, baseSalary: e.target.value })} placeholder="e.g. 35000" required /></label>
              <label>Bonus (PKR)<input type="number" min="0" step="1" value={payrollForm.bonus} onChange={e => setPayrollForm({ ...payrollForm, bonus: e.target.value })} /></label>
              <label>Deduction (PKR)<input type="number" min="0" step="1" value={payrollForm.deduction} onChange={e => setPayrollForm({ ...payrollForm, deduction: e.target.value })} /></label>
              <label>Payment status<select value={payrollForm.status} onChange={e => setPayrollForm({ ...payrollForm, status: e.target.value })}><option>Pending</option><option>Paid</option></select></label>
            </div><div className="form-actions"><button className="primary-btn" type="submit">Save Payroll Record</button></div>{teachers.length === 0 && <p className="payroll-hint">Payroll add karne se pehle Teachers module mein teacher record add karein.</p>}</form>
            <div className="extra-list-heading"><h3>Salary Records</h3><input className="search-input" value={payrollSearch} onChange={e => setPayrollSearch(e.target.value)} placeholder="Search teacher, month, status..." /></div>
            <div className="table-wrap"><table className="students-table"><thead><tr><th>Teacher</th><th>Month</th><th>Base</th><th>Bonus</th><th>Deduction</th><th>Net Salary</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredPayroll.map(record => <tr key={record.id}><td><strong>{record.teacherName}</strong><small className="table-subline">{record.subject}</small></td><td>{record.month}</td><td>PKR {Number(record.baseSalary).toLocaleString("en-PK")}</td><td>{Number(record.bonus).toLocaleString("en-PK")}</td><td>{Number(record.deduction).toLocaleString("en-PK")}</td><td><strong>PKR {Number(record.netSalary).toLocaleString("en-PK")}</strong></td><td><span className={`payroll-status ${record.status === "Paid" ? "is-paid" : "is-pending"}`}>{record.status}</span></td><td><div className="payroll-actions"><button className="edit-btn" onClick={() => togglePayrollStatus(record)}>{record.status === "Paid" ? "Mark Pending" : "Mark Paid"}</button><button className="delete-btn" onClick={() => deletePayrollRecord(record.id)}>Delete</button></div></td></tr>)}{filteredPayroll.length === 0 && <tr><td colSpan="8" className="empty-table-cell">No salary records found. Add a teacher salary above.</td></tr>}</tbody></table></div>
          </section>
        )}

        {activePage === "Student Promotion" && (
          <section className="content-card extra-module-page promotion-page">
            <div className="students-toolbar"><div><h2>Student Promotion</h2><p>Promote a whole class to the next grade while keeping student details.</p></div><span className="module-count">{promotionHistory.length} promotion batches</span></div>
            <div className="promotion-notice"><strong>Before you promote</strong><span>Confirm the selected class carefully. Promotion updates each student's current class. Class 10 students move to Graduated.</span></div>
            <div className="promotion-control-panel"><label>Select current class<select value={promotionClass} onChange={e => setPromotionClass(e.target.value)}>{classOptions.map(name => <option key={name}>{name}</option>)}</select></label><div className="promotion-count"><span>Students in selected class</span><strong>{students.filter(student => student.className === promotionClass).length}</strong></div><button className="primary-btn" onClick={promoteClassStudents}>Promote Entire Class →</button></div>
            <div className="extra-list-heading"><h3>Students to be promoted</h3><input className="search-input" value={promotionSearch} onChange={e => setPromotionSearch(e.target.value)} placeholder="Search student or roll number..." /></div>
            <div className="table-wrap"><table className="students-table"><thead><tr><th>Student</th><th>Roll Number</th><th>Current Class</th><th>Next Class</th></tr></thead><tbody>{promotionCandidates.map(student => <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.roll || "—"}</td><td>{student.className}</td><td><span className="promotion-next-tag">{promotionClass === "Class 10" ? "Graduated" : `Class ${Number(promotionClass.replace("Class ", "")) + 1}`}</span></td></tr>)}{promotionCandidates.length === 0 && <tr><td colSpan="4" className="empty-table-cell">No students found in this class.</td></tr>}</tbody></table></div>
            <div className="promotion-history-panel"><h3>Recent Promotion History</h3>{promotionHistory.length ? promotionHistory.slice(0, 8).map(item => <div className="promotion-history-row" key={item.id}><span className="promotion-history-icon">⇧</span><span><strong>{item.fromClass} → {item.toClass}</strong><small>{item.count} students · {item.date}</small></span><b>{item.count}</b></div>) : <div className="extra-empty-state"><span>⇧</span><strong>No promotions recorded</strong><p>Completed class promotions will appear here.</p></div>}</div>
          </section>
        )}

        {activePage === "Timetable" && (
          <section className="content-card extra-module-page">
            <div className="students-toolbar"><div><h2>Class Timetable</h2><p>Create and manage weekly class periods.</p></div><span className="module-count">{timetable.length} periods</span></div>
            <form className="student-form" onSubmit={addTimetableEntry}>
              <h3>＋ Add Timetable Period</h3>
              <div className="form-grid">
                <label>Class *<input value={timetableForm.className} onChange={e => setTimetableForm({ ...timetableForm, className: e.target.value })} placeholder="e.g. Class 8" required /></label>
                <label>Day *<select value={timetableForm.day} onChange={e => setTimetableForm({ ...timetableForm, day: e.target.value })}>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => <option key={day}>{day}</option>)}</select></label>
                <label>Subject *<input value={timetableForm.subject} onChange={e => setTimetableForm({ ...timetableForm, subject: e.target.value })} placeholder="e.g. Mathematics" required /></label>
                <label>Teacher *<input value={timetableForm.teacher} onChange={e => setTimetableForm({ ...timetableForm, teacher: e.target.value })} placeholder="Teacher name" required /></label>
                <label>Start time *<input type="time" value={timetableForm.startTime} onChange={e => setTimetableForm({ ...timetableForm, startTime: e.target.value })} required /></label>
                <label>End time *<input type="time" value={timetableForm.endTime} onChange={e => setTimetableForm({ ...timetableForm, endTime: e.target.value })} required /></label>
                <label>Room (optional)<input value={timetableForm.room} onChange={e => setTimetableForm({ ...timetableForm, room: e.target.value })} placeholder="e.g. Room 04" /></label>
              </div>
              <button className="primary-btn" type="submit">Save Period</button>
            </form>
            <div className="extra-list-heading"><h3>Weekly Schedule</h3><input className="search-input" value={timetableSearch} onChange={e => setTimetableSearch(e.target.value)} placeholder="Search class, subject, teacher..." /></div>
            <div className="table-wrap"><table className="students-table"><thead><tr><th>Class</th><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th><th>Action</th></tr></thead><tbody>
              {filteredTimetable.slice().sort((a,b) => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(a.day)-["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(b.day) || a.startTime.localeCompare(b.startTime)).map(item => <tr key={item.id}><td><strong>{item.className}</strong></td><td>{item.day}</td><td>{item.startTime}–{item.endTime}</td><td>{item.subject}</td><td>{item.teacher}</td><td>{item.room || "—"}</td><td><button className="delete-btn" onClick={() => deleteTimetableEntry(item.id)}>Delete</button></td></tr>)}
              {filteredTimetable.length === 0 && <tr><td colSpan="7" className="empty-table-cell">No timetable periods yet. Add the first period above.</td></tr>}
            </tbody></table></div>
          </section>
        )}

        {activePage === "Notices" && (
          <section className="content-card extra-module-page">
            <div className="students-toolbar"><div><h2>School Notices & Announcements</h2><p>Publish reminders, events and important school updates.</p></div><span className="module-count">{notices.length} notices</span></div>
            <form className="student-form" onSubmit={addNotice}>
              <h3>＋ Publish New Notice</h3>
              <div className="form-grid">
                <label>Notice title *<input value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="e.g. Parent Teacher Meeting" required /></label>
                <label>Audience<select value={noticeForm.audience} onChange={e => setNoticeForm({ ...noticeForm, audience: e.target.value })}><option>All</option><option>Students</option><option>Teachers</option><option>Parents</option></select></label>
                <label>Publish date *<input type="date" value={noticeForm.date} onChange={e => setNoticeForm({ ...noticeForm, date: e.target.value })} required /></label>
                <label className="notice-message-label">Message *<textarea rows="3" value={noticeForm.message} onChange={e => setNoticeForm({ ...noticeForm, message: e.target.value })} placeholder="Write the full announcement here..." required /></label>
              </div>
              <button className="primary-btn" type="submit">Publish Notice</button>
            </form>
            <div className="extra-list-heading"><h3>Published Notices</h3><input className="search-input" value={noticeSearch} onChange={e => setNoticeSearch(e.target.value)} placeholder="Search notices..." /></div>
            <div className="notice-list">
              {filteredNotices.map(notice => <article className="notice-card" key={notice.id}><div className="notice-card-top"><span className="notice-date">{notice.date}</span><span className="notice-audience">{notice.audience}</span></div><h3>{notice.title}</h3><p>{notice.message}</p><button className="delete-btn" onClick={() => deleteNotice(notice.id)}>Delete notice</button></article>)}
              {filteredNotices.length === 0 && <div className="extra-empty-state"><span>♢</span><strong>No notices found</strong><p>Publish a notice above to keep school updates organized.</p></div>}
            </div>
          </section>
        )}

        {activePage === "Reports & Backup" && (
          <section className="reports-page">
            <div className="reports-intro">
              <div>
                <span className="reports-eyebrow">SCHOOL OVERVIEW</span>
                <h2>Reports & Data Backup</h2>
                <p>Review your saved school records and keep a safe backup of your demo data.</p>
              </div>
              <div className="reports-date">{new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            <div className="reports-stats-grid">
              <div className="report-stat"><span className="report-stat-icon report-indigo">♙</span><span>Total students</span><strong>{students.length}</strong><small>Student records saved</small></div>
              <div className="report-stat"><span className="report-stat-icon report-green">♟</span><span>Total teachers</span><strong>{teachers.length}</strong><small>Teacher records saved</small></div>
              <div className="report-stat"><span className="report-stat-icon report-amber">₨</span><span>Fees collected</span><strong>Rs. {Number(totalCollected || 0).toLocaleString("en-PK")}</strong><small>Recorded payments</small></div>
              <div className="report-stat"><span className="report-stat-icon report-purple">✎</span><span>Exam entries</span><strong>{examResults.length}</strong><small>Saved subject results</small></div>
            </div>
            <div className="reports-main-grid">
              <div className="reports-panel">
                <div className="reports-panel-heading"><span className="reports-panel-icon">▤</span><div><h3>School records summary</h3><p>Current data saved in this browser</p></div></div>
                <div className="reports-summary-row"><span>Students</span><strong>{students.length}</strong></div>
                <div className="reports-summary-row"><span>Teachers</span><strong>{teachers.length}</strong></div>
                <div className="reports-summary-row"><span>Classes</span><strong>{classes.length}</strong></div>
                <div className="reports-summary-row"><span>Attendance dates recorded</span><strong>{Object.keys(attendanceRecords).length}</strong></div>
                <div className="reports-summary-row"><span>Fee records</span><strong>{feeRecords.length}</strong></div>
                <div className="reports-summary-row"><span>Exam result entries</span><strong>{examResults.length}</strong></div>
                <button className="reports-print-btn" onClick={() => window.print()}>Print summary report <span>↗</span></button>
              </div>
              <div className="reports-panel backup-panel">
                <div className="reports-panel-heading"><span className="reports-panel-icon backup-icon">⇩</span><div><h3>Backup & restore</h3><p>Protect your school data before making changes</p></div></div>
                <div className="backup-tip"><strong>Recommended</strong><span>Download a backup regularly and keep it somewhere safe.</span></div>
                <button className="backup-download-btn" onClick={() => {
                  const keys = ["schoolStudents", "schoolTeachers", "schoolClasses", "schoolAttendance", "schoolFees", "schoolExamResults", "schoolTimetable", "schoolNotices", "schoolPayroll", "schoolPromotionHistory", "schoolSettings", "schoolAdminProfile"];
                  const backup = { app: "School Management System", version: 1, exportedAt: new Date().toISOString(), data: Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])) };
                  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `school-management-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  URL.revokeObjectURL(url);
                }}><span>⇩</span><span><strong>Download full backup</strong><small>Export all module records as JSON</small></span></button>
                <label className="backup-upload-btn"><span>⇧</span><span><strong>Restore from backup</strong><small>Select a previous JSON backup file</small></span><input type="file" accept="application/json,.json" onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    const backup = JSON.parse(await file.text());
                    if (!backup || backup.app !== "School Management System" || !backup.data || typeof backup.data !== "object") throw new Error("Invalid backup file");
                    const keys = ["schoolStudents", "schoolTeachers", "schoolClasses", "schoolAttendance", "schoolFees", "schoolExamResults", "schoolTimetable", "schoolNotices", "schoolPayroll", "schoolPromotionHistory", "schoolSettings", "schoolAdminProfile"];
                    if (!window.confirm("Restore this backup? Current records in this browser will be replaced.")) { event.target.value = ""; return; }
                    keys.forEach(key => {
                      if (Object.prototype.hasOwnProperty.call(backup.data, key)) {
                        if (backup.data[key] === null) localStorage.removeItem(key);
                        else localStorage.setItem(key, backup.data[key]);
                      }
                    });
                    window.alert("Backup restored. The app will reload now.");
                    window.location.reload();
                  } catch (error) {
                    window.alert("Could not restore this file. Please select a valid School Management System JSON backup.");
                  } finally {
                    event.target.value = "";
                  }
                }} /></label>
                <p className="backup-warning">Restore replaces the matching records in this browser. Keep a copy of your current data first.</p>
              </div>
            </div>
          </section>
        )}

        {activePage === "Admin Panel" && (
          <section className="admin-panel-page">
            <div className="admin-panel-welcome"><div><span className="admin-panel-kicker">SYSTEM CONTROL CENTER</span><h2>Admin Panel</h2><p>School details, administrator profile, and local application maintenance.</p></div><div className="admin-panel-status"><span className="admin-status-dot" /> Local demo mode</div></div>
            {adminNotice && <div className="admin-feedback" role="status">{adminNotice}<button type="button" onClick={() => setAdminNotice("")} aria-label="Dismiss message">×</button></div>}
            <div className="admin-overview-grid">
              <div className="admin-overview-card"><span className="admin-overview-icon">♙</span><span>Students</span><strong>{students.length}</strong><small>Registered records</small></div>
              <div className="admin-overview-card"><span className="admin-overview-icon">♟</span><span>Teachers</span><strong>{teachers.length}</strong><small>Staff records</small></div>
              <div className="admin-overview-card"><span className="admin-overview-icon">▤</span><span>Classes</span><strong>{classes.length}</strong><small>Configured classes</small></div>
              <div className="admin-overview-card"><span className="admin-overview-icon">▣</span><span>Stored modules</span><strong>{[students.length, teachers.length, classes.length, Object.keys(attendanceRecords).length, feeRecords.length, examResults.length, timetable.length, notices.length, payroll.length].filter(value => value > 0).length}/9</strong><small>Modules with saved records</small></div>
            </div>
            <div className="admin-panel-grid">
              <form className="content-card admin-settings-card" onSubmit={saveSchoolSettings}>
                <div className="admin-card-heading"><span className="admin-card-icon">⌂</span><div><h3>School Profile & Settings</h3><p>These details can be used for school documents and reports.</p></div></div>
                <div className="form-grid admin-form-grid">
                  <label>School name *<input value={schoolForm.schoolName} onChange={e => setSchoolForm({ ...schoolForm, schoolName: e.target.value })} required placeholder="Enter school name" /></label>
                  <label>Academic session<input value={schoolForm.session} onChange={e => setSchoolForm({ ...schoolForm, session: e.target.value })} placeholder="2026-2027" /></label>
                  <label>Contact phone<input value={schoolForm.phone} onChange={e => setSchoolForm({ ...schoolForm, phone: e.target.value })} placeholder="School phone" /></label>
                  <label>School email<input type="email" value={schoolForm.email} onChange={e => setSchoolForm({ ...schoolForm, email: e.target.value })} placeholder="school@example.com" /></label>
                  <label>Currency<select value={schoolForm.currency} onChange={e => setSchoolForm({ ...schoolForm, currency: e.target.value })}><option value="PKR">PKR — Pakistani Rupee</option><option value="USD">USD — US Dollar</option><option value="INR">INR — Indian Rupee</option><option value="AED">AED — UAE Dirham</option></select></label>
                  <label>School address<input value={schoolForm.address} onChange={e => setSchoolForm({ ...schoolForm, address: e.target.value })} placeholder="City, area, address" /></label>
                  <label>School logo URL<input type="url" value={schoolForm.logoUrl || ""} onChange={e => setSchoolForm({ ...schoolForm, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" /></label>
                  <label>Accent colour<select value={schoolForm.accentColor || "#4263eb"} onChange={e => setSchoolForm({ ...schoolForm, accentColor: e.target.value })}><option value="#4263eb">Blue</option><option value="#0f9f8f">Teal</option><option value="#16803c">Green</option><option value="#7c3aed">Purple</option><option value="#ea580c">Orange</option></select></label>
                </div>
                <div className="form-actions"><button className="primary-btn" type="submit">Save School Settings</button></div>
              </form>
              <form className="content-card admin-settings-card" onSubmit={saveAdminProfile}>
                <div className="admin-card-heading"><span className="admin-card-icon">♙</span><div><h3>Administrator Profile</h3><p>Update the name and contact information shown in the panel.</p></div></div>
                <div className="form-grid admin-form-grid">
                  <label>Admin name *<input value={adminForm.name} onChange={e => setAdminForm({ ...adminForm, name: e.target.value })} required /></label>
                  <label>Admin email *<input type="email" value={adminForm.email} onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} required /></label>
                  <label>Admin phone<input value={adminForm.phone} onChange={e => setAdminForm({ ...adminForm, phone: e.target.value })} placeholder="Contact number" /></label>
                </div>
                <div className="form-actions"><button className="primary-btn" type="submit">Save Admin Profile</button></div>
              </form>
              <form className="content-card admin-settings-card" onSubmit={changeLocalAdminPassword}>
                <div className="admin-card-heading"><span className="admin-card-icon">⌑</span><div><h3>Local Demo Password</h3><p>For this browser demo only; it does not secure a production website.</p></div></div>
                <div className="admin-security-note"><strong>Important</strong><span>First-use default is <code>admin123</code>. This password is stored in browser LocalStorage, so it is not suitable for real authentication.</span></div>
                <div className="form-grid admin-form-grid">
                  <label>Current password<input type="password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} required autoComplete="current-password" /></label>
                  <label>New password<input type="password" value={passwordForm.next} onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })} required minLength={8} autoComplete="new-password" /></label>
                  <label>Confirm new password<input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} required minLength={8} autoComplete="new-password" /></label>
                </div>
                <div className="form-actions"><button className="primary-btn" type="submit">Update Local Password</button></div>
              </form>
              <div className="content-card admin-settings-card admin-maintenance-card">
                <div className="admin-card-heading"><span className="admin-card-icon">⚙</span><div><h3>System Maintenance</h3><p>Manage local records and export your data before maintenance.</p></div></div>
                <div className="admin-maintenance-row"><div><strong>Download a full backup</strong><p>Export all saved school modules and settings as JSON. Password is excluded for safety. Restore a backup from Reports & Backup.</p></div><button className="secondary-btn" type="button" onClick={() => { const keys = Object.keys(localStorage).filter(key => key.startsWith("school") && key !== "schoolAdminPassword"); const backup = { app: "School Management System", version: 3, exportedAt: new Date().toISOString(), note: "Admin password is intentionally excluded from backups.", data: Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])) }; const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `school-management-backup-${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }}>Download Backup ↓</button></div>
                <div className="admin-maintenance-row danger-maintenance"><div><strong>Clear school records</strong><p>Deletes operational records from this browser. Administrator and school profile settings are kept.</p></div><button className="delete-btn" type="button" onClick={resetSchoolDemoData}>Clear Records</button></div>
                <p className="admin-local-warning">This project currently uses LocalStorage, not a backend database. Data is tied to this browser and device. Use a real backend, hashed passwords and server-side sessions before production use.</p>
              </div>
            </div>
          </section>
        )}

        {activePage !== "Dashboard" &&
          activePage !== "Students" &&
          activePage !== "Teachers" &&
          activePage !== "Classes" &&
          activePage !== "Attendance" &&
          activePage !== "Fees" &&
          activePage !== "Exams & Results" &&
          activePage !== "Payroll" &&
          activePage !== "Student Promotion" &&
          activePage !== "Timetable" &&
          activePage !== "Notices" &&
          activePage !== "Reports & Backup" &&
          activePage !== "Admin Panel" && (
            <section className="content-card page-placeholder">
              <div className="placeholder-icon">📚</div>
              <h2>{activePage} Management</h2>
              <p>
                We will add the working features for this section in the next steps.
              </p>
            </section>
          )}


      </main>
    </div>
  );
}

export default App;
