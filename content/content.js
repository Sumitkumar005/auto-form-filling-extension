class AutoFillController {
  constructor() {
    this.studentData = null;
    this.fieldMapper = new FieldMapper();
    this.delayMs = 150;
    this.init();
  }

  init() {
    this.injectFloatingButton();
    this.loadStoredStudent();
    window.foreignAdmitsAutoFill = this;
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'TRIGGER_AI_AUTOFILL') this.handleAutoFill();
    });
  }

  async loadStoredStudent() {
    try {
      const data = await chrome.storage.local.get(['selectedStudent']);
      if (data.selectedStudent) {
        this.studentData = data.selectedStudent;
        console.log('Loaded student data:', this.studentData);
      }
    } catch (error) {
      console.error('Error loading stored student:', error);
    }
  }

  injectFloatingButton() {
    const existingButton = document.getElementById('fa-autofill-btn');
    if (existingButton) existingButton.remove();

    const button = document.createElement('div');
    button.id = 'fa-autofill-btn';
    button.innerHTML = `
      <div style="
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: #667eea; color: white; padding: 12px 16px;
        border-radius: 25px; cursor: pointer; font-family: Arial, sans-serif;
        font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease; user-select: none;"
        onmouseover="this.style.background='#5a67d8'; this.style.transform='scale(1.05)'"
        onmouseout="this.style.background='#667eea'; this.style.transform='scale(1)'">
        🎓 AI Auto-Fill Form
      </div>
    `;
    button.addEventListener('click', () => this.handleAutoFill());
    document.body.appendChild(button);
  }

  async handleAutoFill(studentData = null) {
    if (!studentData) {
      await this.loadStoredStudent();
      if (!this.studentData) {
        this.showNotification('No student data available. Select a student first.', 'error');
        return;
      }
      studentData = this.studentData;
    }

    const studentName = this.getStudentName();
    const confirmation = confirm(`AI Auto-fill with ${studentName}?`);
    if (!confirmation) return;

    try {
      const { aiEnabled } = await chrome.storage.local.get('aiEnabled');
      const filled = aiEnabled ? await this.aiFillForm(studentData) : await this.fillForm(studentData);
      this.showNotification(`Form filled successfully! (${filled} fields)`, 'success');
    } catch (error) {
      console.error('Auto-fill error:', error);
      if (error.message.includes('429')) {
        this.showNotification('OpenAI rate limit exceeded (429). Wait a few minutes or check your account quota.', 'error');
      } else {
        this.showNotification('Error filling form. Check console for details.', 'error');
      }
    }
  }

  async fillForm(studentData) {
    console.log('Starting basic auto-fill with student data:', studentData);
    const mappedData = this.fieldMapper.mapStudentData(studentData);
    console.log('Mapped data for form filling:', mappedData);
    const fields = this.detectFormFields();
    console.log('Detected form fields:', fields);

    let filledCount = 0;
    const unmatchedKeys = new Set(Object.keys(mappedData));

    for (const [dataKey, dataValue] of Object.entries(mappedData)) {
      if (dataValue && dataValue.toString().trim()) {
        const elements = this.findFieldElements(dataKey, fields);
        for (const element of elements) {
          if (this.fillField(element, dataValue)) {
            filledCount++;
            unmatchedKeys.delete(dataKey);
            console.log(`Filled ${dataKey} with value: ${dataValue}`);
            await this.delay(this.delayMs);
          }
        }
      }
    }

    if (unmatchedKeys.size > 0) {
      console.warn('Unmatched data keys:', Array.from(unmatchedKeys));
    }
    console.log(`Basic auto-fill completed: ${filledCount} fields`);
    return filledCount;
  }

  async aiFillForm(studentData) {
    console.log('Starting AI auto-fill with student data:', studentData);
    const formFields = this.detectFormFields();
    const response = await new Promise((resolve) => chrome.runtime.sendMessage({ type: 'AI_MAP_FIELDS', studentData, formFields }, resolve));
    if (!response.success) throw new Error(response.error);

    let filledCount = 0;
    for (const [fieldKey, value] of Object.entries(response.data)) {
      const element = document.querySelector(`[id="${fieldKey}"], [name="${fieldKey}"]`);
      if (element && this.fillField(element, value)) {
        filledCount++;
        console.log(`AI-filled ${fieldKey} with value: ${value}`);
        await this.delay(this.delayMs);
      }
    }
    console.log(`AI auto-fill completed: ${filledCount} fields`);
    return filledCount;
  }

  detectFormFields() {
    const fields = [];
    const selectors = [
      'input[type="text"]', 'input[type="email"]', 'input[type="tel"]', 'input[type="number"]',
      'input[type="date"]', 'input:not([type])', 'select', 'textarea', 'input[type="radio"]',
      'input[type="checkbox"]'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (this.isVisible(element) && !element.disabled && !element.readonly) {
          const field = {
            id: element.id?.toLowerCase() || '',
            name: element.name?.toLowerCase() || '',
            label: this.getFieldLabel(element).toLowerCase(),
            placeholder: element.placeholder?.toLowerCase() || '',
            heading: this.getClosestHeading(element).toLowerCase(),
            type: element.type || element.tagName.toLowerCase()
          };
          if (element.tagName === 'SELECT') {
            field.options = Array.from(element.options).map(opt => opt.text.trim().toLowerCase());
          }
          fields.push(field);
        }
      });
    });
    return fields;
  }

  getClosestHeading(element) {
    let current = element.parentElement;
    while (current && current !== document.body) {
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (/^h[1-6]$/i.test(sibling.tagName)) {
          return sibling.textContent.trim();
        }
        sibling = sibling.previousElementSibling;
      }
      current = current.parentElement;
    }
    return '';
  }

  findFieldElements(dataKey, fields) {
    const elements = [];
    const searchTerms = FIELD_MAPPINGS[dataKey] || [dataKey.toLowerCase()];

    for (const field of fields) {
      const fieldText = `${field.heading} ${field.id} ${field.name} ${field.placeholder} ${field.label}`.toLowerCase().trim();
      for (const term of searchTerms) {
        if (fieldText.includes(term.toLowerCase().trim())) {
          elements.push(field.element);
          break;
        }
      }
    }
    return elements;
  }

  fillField(element, value) {
    const type = element.type?.toLowerCase() || element.tagName.toLowerCase();
    switch (type) {
      case 'select-one':
        return this.fillSelectField(element, value);
      case 'radio':
        return this.fillRadioField(element, value);
      case 'checkbox':
        return this.fillCheckboxField(element, value);
      case 'date':
        return this.fillDateField(element, value);
      default:
        return this.fillTextField(element, value);
    }
  }

  fillTextField(element, value) {
    element.focus();
    element.value = value.toString().trim();
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
    return true;
  }

  fillSelectField(element, value) {
    const valueStr = value.toString().toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const option of element.options) {
      const optionText = option.text.toLowerCase().trim();
      const optionValue = option.value.toLowerCase().trim();
      const scoreText = this.similarity(valueStr, optionText);
      const scoreValue = this.similarity(valueStr, optionValue);
      const score = Math.max(scoreText, scoreValue);

      if (score > bestScore && score >= 0.8) {
        bestScore = score;
        bestMatch = option;
      }
    }

    if (bestMatch) {
      element.value = bestMatch.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    // Fallback to existing substring match
    for (const option of element.options) {
      if (option.text.toLowerCase().includes(valueStr) || 
          option.value.toLowerCase().includes(valueStr) ||
          valueStr.includes(option.text.toLowerCase().trim()) ||
          valueStr.includes(option.value.toLowerCase().trim())) {
        element.value = option.value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
    return false;
  }

  dispatchSelectEvents(element) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  stringSimilarity(s1, s2) {
    if (s1.length === 0) return s2.length === 0 ? 1 : 0;
    if (s2.length === 0) return 0;
    const matrix = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(0));
    for (let i = 0; i <= s1.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i-1] === s2[j-1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i-1][j] + 1,
          matrix[i][j-1] + 1,
          matrix[i-1][j-1] + cost
        );
      }
    }
    return 1 - matrix[s1.length][s2.length] / Math.max(s1.length, s2.length);
  }

  // Add this utility method for fuzzy matching
  levenshteinDistance(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = s1[i-1] === s2[j-1] ? dp[i-1][j-1] : Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1;
      }
    }
    return dp[m][n];
  }

  similarity(s1, s2) {
    const dist = this.levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());
    return 1 - (dist / Math.max(s1.length, s2.length));
  }

  fillRadioField(element, value) {
    const valueStr = value.toString().toLowerCase();
    const normalizedValue = ['married', 'yes', 'true', '1', 'on'].includes(valueStr) ? 'yes' :
                             ['single', 'no', 'false', '0', 'off'].includes(valueStr) ? 'no' : valueStr;
    const radioName = element.name;
    const radioGroup = document.querySelectorAll(`input[name="${radioName}"][type="radio"]`);
    
    for (const radio of radioGroup) {
      const label = this.getFieldLabel(radio).toLowerCase();
      const radioVal = radio.value.toLowerCase();
      if (radioVal === normalizedValue || label.includes(normalizedValue) ||
          normalizedValue.includes(radioVal) || this.similarity(normalizedValue, radioVal) >= 0.8) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
    return false;
  }

  fillCheckboxField(element, value) {
    const boolValue = ['true', '1', 'yes', 'on', 'checked', 'married'].includes(value.toString().toLowerCase());
    element.checked = boolValue;
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  fillDateField(element, value) {
    let dateStr = value.toString().trim();
    let date;

    try {
      // Expanded format attempts
      const formats = [
        'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD-MM-YYYY', 'YYYY/MM/DD'
      ];
      for (const fmt of formats) {
        date = this.parseDateWithFormat(dateStr, fmt);
        if (date && !isNaN(date.getTime())) break;
      }

      if (!date || isNaN(date.getTime())) {
        date = new Date(dateStr); // Fallback
      }

      if (!isNaN(date.getTime())) {
        element.value = date.toISOString().split('T')[0]; // YYYY-MM-DD for input[type=date]
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    } catch (error) {
      console.error('Date parsing error:', error);
    }
    return false;
  }

  // Add helper method
  parseDateWithFormat(dateStr, fmt) {
    const parts = dateStr.split(/[-/]/);
    if (parts.length !== 3) return null;
    let year, month, day;
    switch (fmt) {
      case 'YYYY-MM-DD': year = parts[0]; month = parts[1] - 1; day = parts[2]; break;
      case 'DD/MM/YYYY': day = parts[0]; month = parts[1] - 1; year = parts[2]; break;
      case 'MM/DD/YYYY': month = parts[0] - 1; day = parts[1]; year = parts[2]; break;
      case 'DD-MM-YYYY': day = parts[0]; month = parts[1] - 1; year = parts[2]; break;
      case 'YYYY/MM/DD': year = parts[0]; month = parts[1] - 1; day = parts[2]; break;
    }
    return new Date(year, month, day);
  }

  getFieldLabel(element) {
    if (element.labels && element.labels.length > 0) {
      return element.labels[0].textContent.trim();
    }
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent.replace(element.value || '', '').trim();
    const prevSibling = element.previousElementSibling;
    if (prevSibling && ['LABEL', 'SPAN', 'DIV', 'P'].includes(prevSibling.tagName)) {
      const text = prevSibling.textContent.trim();
      if (text && text.length < 100) return text;
    }
    return element.placeholder || '';
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && 
           element.offsetWidth > 0 && element.offsetHeight > 0;
  }
 
  getStudentName() {
    if (!this.studentData) return 'Unknown';
    const personal = this.studentData.personalInformation || {};
    const firstName = personal.firstName || 'Unknown';
    const lastName = personal.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 80px; right: 20px; z-index: 10001;
      padding: 12px 20px; border-radius: 6px; font-family: Arial, sans-serif;
      font-size: 14px; font-weight: 600; max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;
      ${type === 'success' ? 'background: #48bb78; color: white;' : 'background: #f56565; color: white;'}
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.parentNode?.removeChild(notification), 300);
    }, 3000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}



if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AutoFillController());
} else {
  new AutoFillController();
}


