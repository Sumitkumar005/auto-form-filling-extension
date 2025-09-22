class APIUtils {
  constructor() {
    this.baseURL = '';
  }

  async fetchStudents(partnerId) {
    try {
      const url = `${this.baseURL}/a`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const apiResponse = await response.json();
      return apiResponse.success && apiResponse.data ? (Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data]) : [];
    } catch (error) {
      console.error('API Error - fetchStudents:', error);
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  }

  async fetchStudentById(studentId) {
    try {
      const url = `${this.baseURL}/ap${studentId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error - fetchStudentById:', error);
      throw new Error(`Failed to fetch student: ${error.message}`);
    }
  }

  formatStudentForDisplay(student) {
    const personal = student.personalInformation || {};
    return {
      id: student.studentId?._id || student._id,
      faId: student.studentFaId,
      name: `${personal.firstName || ''} ${personal.lastName || ''}`.trim(),
      email: personal.email,
      phone: personal.phoneNumber
    };
  }
}

if (typeof window !== 'undefined') {
  window.APIUtils = APIUtils;
}
