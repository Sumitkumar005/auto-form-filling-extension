class PopupController {
  constructor() {
    this.students = [];
    this.selectedStudent = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSavedData();
  }

  bindEvents() {
    document.getElementById('fetchStudents').addEventListener('click', () => {
      this.fetchAllStudents();
    });

    document.getElementById('fetchByStudentId').addEventListener('click', () => {
      this.fetchByStudentId();
    });

    document.getElementById('autoFill').addEventListener('click', () => {
      this.autoFillForm();
    });

    document.getElementById('studentSelect').addEventListener('change', (e) => {
      this.selectStudent(e.target.value);
    });

    document.getElementById('aiEnabled').addEventListener('change', (e) => {
      chrome.storage.local.set({ aiEnabled: e.target.checked });
    });

    document.getElementById('openaiApiKey').addEventListener('input', (e) => {
      chrome.storage.local.set({ openaiApiKey: e.target.value });
    });
  }

  async loadSavedData() {
    try {
      const data = await chrome.storage.local.get(['partnerId', 'students', 'selectedStudent', 'aiEnabled', 'openaiApiKey']);
      
      if (data.partnerId) {
        document.getElementById('partnerId').value = data.partnerId;
      }
      
      if (data.students && data.students.length > 0) {
        this.students = data.students;
        this.populateStudentSelect();
        document.getElementById('studentSelectGroup').style.display = 'block';
      }

      if (data.selectedStudent) {
        this.selectedStudent = data.selectedStudent;
        this.displayStudentInfo(this.selectedStudent);
        document.getElementById('autoFill').disabled = false;
      }

      document.getElementById('aiEnabled').checked = data.aiEnabled || false;
      document.getElementById('openaiApiKey').value = data.openaiApiKey || '';
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  async fetchAllStudents() {
    const partnerId = document.getElementById('partnerId').value.trim();
    
    if (!partnerId) {
      this.showStatus('Please enter Partner ID', 'error');
      return;
    }

    this.showStatus('Fetching all students...', 'loading');
    
    try {
      const response = await new Promise((resolve) => chrome.runtime.sendMessage({ type: 'FETCH_STUDENTS', partnerId }, resolve));
      if (!response.success) throw new Error(response.error);
      this.students = response.data;
      
      await chrome.storage.local.set({
        partnerId: partnerId,
        students: this.students
      });
      
      this.populateStudentSelect();
      document.getElementById('studentSelectGroup').style.display = 'block';
      this.showStatus(`Found ${this.students.length} student(s)`, 'success');
      
    } catch (error) {
      console.error('Error fetching students:', error);
      this.showStatus('Error fetching students. Check Partner ID and try again.', 'error');
    }
  }

  async fetchByStudentId() {
    const studentId = document.getElementById('studentId').value.trim();
    
    if (!studentId) {
      this.showStatus('Please enter Student ID', 'error');
      return;
    }

    this.showStatus('Fetching student by ID...', 'loading');
    
    try {
      const response = await new Promise((resolve) => chrome.runtime.sendMessage({ type: 'FETCH_STUDENT_BY_ID', studentId }, resolve));
      if (!response.success) throw new Error(response.error);
      this.selectedStudent = response.data;
      this.students = [this.selectedStudent];
      
      await chrome.storage.local.set({
        selectedStudent: this.selectedStudent,
        students: this.students
      });
      
      this.displayStudentInfo(this.selectedStudent);
      document.getElementById('autoFill').disabled = false;
      this.showStatus('Student found and selected!', 'success');
      
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      this.showStatus('Student not found. Check Student ID and try again.', 'error');
    }
  }

  populateStudentSelect() {
    const select = document.getElementById('studentSelect');
    select.innerHTML = '<option value="">Select a student...</option>';
    
    this.students.forEach((student, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      const name = this.getStudentDisplayName(student);
      const id = student.studentFaId || student.studentId?._id || student._id;
      option.textContent = `${name} (${id})`;
      select.appendChild(option);
    });
  }

  selectStudent(index) {
    if (index === '') {
      this.selectedStudent = null;
      document.getElementById('studentInfo').style.display = 'none';
      document.getElementById('autoFill').disabled = true;
      return;
    }

    const student = this.students[parseInt(index)];
    if (student) {
      this.selectedStudent = student;
      chrome.storage.local.set({ selectedStudent: this.selectedStudent });
      this.displayStudentInfo(student);
      document.getElementById('autoFill').disabled = false;
    }
  }

  getStudentDisplayName(student) {
    const personal = student.personalInformation || {};
    const firstName = personal.firstName || 'Unknown';
    const lastName = personal.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  displayStudentInfo(student) {
    const personal = student.personalInformation || {};
    const details = [
      `Name: ${this.getStudentDisplayName(student)}`,
      `Email: ${personal.email || 'N/A'}`,
      `Phone: ${personal.phoneNumber || 'N/A'}`,
      `Student ID: ${student.studentId?._id || student._id || 'N/A'}`,
      `FA ID: ${student.studentFaId || 'N/A'}`
    ];
    document.getElementById('studentDetails').innerHTML = 
      details.map(detail => `<div class="student-detail">${detail}</div>`).join('');
    document.getElementById('studentInfo').style.display = 'block';
  }

  async autoFillForm() {
    if (!this.selectedStudent) {
      this.showStatus('Please select a student first', 'error');
      return;
    }

    this.showStatus('Auto-filling form...', 'loading');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (studentData) => {
          if (window.foreignAdmitsAutoFill) {
            window.foreignAdmitsAutoFill.handleAutoFill(studentData);
          } else {
            console.error('Auto-fill functionality not available');
            alert('Auto-fill not available. Please refresh.');
          }
        },
        args: [this.selectedStudent]
      });
      this.showStatus('Form auto-filled successfully!', 'success');
    } catch (error) {
      console.error('Error auto-filling form:', error);
      this.showStatus('Error auto-filling form.', 'error');
    }
  }

  showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        status.textContent = '';
        status.className = 'status';
      }, 3000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new PopupController());