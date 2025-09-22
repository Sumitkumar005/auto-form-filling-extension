const CONSTANTS = {
  API: {
    BASE_URL: '',
    ENDPOINTS: {
      STUDENTS: '/api/university-students/'
    }
  },
  STORAGE_KEYS: {
    PARTNER_ID: 'partnerId',
    STUDENTS: 'students',
    SELECTED_STUDENT: 'selectedStudent',
    EXTENSION_ENABLED: 'extensionEnabled',
    AI_ENABLED: 'aiEnabled',
    OPENAI_API_KEY: 'openaiApiKey'
  },
  DEFAULTS: {
    PARTNER_ID: '6746c1daeca27f8db23c7d4a',
    AUTO_FILL_DELAY: 150
  }
};

if (typeof window !== 'undefined') {
  window.FA_CONSTANTS = CONSTANTS;
}
