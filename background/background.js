class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createContextMenu();
    console.log('ForeignAdmits Background Service initialized');
  }

  createContextMenu() {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "ai-autofill",
        title: "AI Auto-Fill Form",
        contexts: ["page"]
      });
    });
  }

  setupEventListeners() {
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "ai-autofill") {
        chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_AI_AUTOFILL' });
      }
    });
  }

  handleInstallation(details) {
    if (details.reason === 'install') {
      console.log('ForeignAdmits Extension installed');
      chrome.storage.local.set({
        partnerId: '6746c1daeca27f8db23c7d4a',
        extensionEnabled: true
      });
    }
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.type) {
        case 'FETCH_STUDENTS':
          const students = await this.fetchStudents(message.partnerId);
          sendResponse({ success: true, data: students });
          break;
        case 'FETCH_STUDENT_BY_ID':
          const student = await this.fetchStudentById(message.studentId);
          sendResponse({ success: true, data: student });
          break;
        case 'AI_MAP_FIELDS':
          const mapping = await this.callOpenAIForMappingWithRetry(message.studentData, message.formFields);
          sendResponse({ success: true, data: mapping });
          break;
        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async fetchStudents(partnerId) {
    const url = `https://backend.mydreamuniversity.in/api/university-students/?where={"partnerId":"${partnerId}"}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const apiResponse = await response.json();
    return apiResponse.success && apiResponse.data ? (Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data]) : [];
  }

  async fetchStudentById(studentId) {
    const url = `https://backend.mydreamuniversity.in/api/university-students/${studentId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const apiResponse = await response.json();
    return apiResponse;
  }

  async callOpenAIForMappingWithRetry(studentData, formFields, retries = 3, delay = 1000) {
    const { openaiApiKey } = await chrome.storage.local.get('openaiApiKey');
    if (!openaiApiKey) throw new Error('OpenAI API key not set');

    const prompt = `
You are a form-filling assistant for university application forms. Map the provided student data to the form fields semantically. 

**Student Data**: 
${JSON.stringify(studentData, null, 2)}

**Form Fields** (array of objects with id, name, label, placeholder, heading, type, and options for selects):
${JSON.stringify(formFields, null, 2)}

**Instructions**:
- Output a JSON object where keys are field IDs or names (use id if available, else name), and values are the mapped data from the student object.
- For select fields, choose the closest matching option from the provided options (case-insensitive). If no exact match, select the most similar (e.g., "India" matches "IND").
- For radio/checkbox fields expecting "Yes" or "No", convert boolean values (true → "Yes", false → "No").
- For date fields, format dates as YYYY-MM-DD (e.g., convert "2025-07-08" or "07/08/2025" to "2025-07-08").
- Handle section-specific fields (e.g., "Country of Study" under "Post Graduate" vs. "Undergraduate") by considering the heading context.
- Only map fields with relevant data; skip fields with no matching data.
- If a field cannot be mapped confidently, exclude it from the output.
- Example output format:
{
  "firstName": "Rachit",
  "lastName": "Arya",
  "pgCountryOfStudy": "India",
  "hasMultipleCitizenship": "No",
  "dateOfBirth": "2001-07-25"
}
`;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3
          })
        });

        if (response.status === 429) {
          console.warn(`OpenAI rate limit hit (429). Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }

        if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);

        const { choices } = await response.json();
        return JSON.parse(choices[0].message.content);
      } catch (error) {
        if (attempt === retries - 1) throw error;
      }
    }
    throw new Error('Max retries exceeded for OpenAI call');
  }
}

new BackgroundService();