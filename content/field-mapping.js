const FIELD_MAPPINGS = {
  firstName: ['personal information first name', 'first name', 'firstname', 'fname', 'given name'],
  middleName: ['personal information middle name', 'middle name', 'middlename', 'mname'],
  lastName: ['personal information last name', 'last name', 'lastname', 'lname', 'surname', 'family name'],
  email: ['personal information email address', 'email address', 'email', 'mail', 'e-mail'],
  phoneNumber: ['personal information mobile number', 'mobile number', 'phone', 'mobile', 'tel', 'telephone', 'contact'],
  dateOfBirth: ['personal information date of birth', 'date of birth', 'dob', 'birth date', 'birthdate', 'birthday'],
  gender: ['personal information gender', 'gender', 'sex'],
  maritalStatus: ['personal information marital status', 'marital status', 'marriage', 'married'],
  addressLine1: ['mailing address address 1', 'permanent address address 1', 'address 1', 'address1', 'street', 'line1', 'addr1'],
  addressLine2: ['mailing address address 2', 'permanent address address 2', 'address 2', 'address2', 'line2', 'addr2'],
  city: ['mailing address city', 'permanent address city', 'city', 'town'],
  state: ['mailing address state', 'permanent address state', 'state', 'province', 'region'],
  country: ['mailing address country', 'permanent address country', 'country', 'nation'],
  pincode: ['mailing address pincode', 'permanent address pincode', 'pincode', 'postal', 'zip', 'postcode'],
  sameAsMailingAddress: ['permanent address same as mailing address', 'same as mailing address'],
  passportNumber: ['passport information passport number', 'passport number', 'passport', 'document number'],
  passportIssueDate: ['passport information issue date', 'issue date', 'issued date', 'passport issue'],
  passportExpiryDate: ['passport information expiry date', 'expiry date', 'expire date', 'passport expiry'],
  passportIssueCountry: ['passport information issue country', 'issue country', 'issued country'],
  cityOfBirth: ['passport information city of birth', 'city of birth', 'birth city'],
  countryOfBirth: ['passport information country of birth', 'country of birth', 'birth country'],
  nationality: ['nationality nationality', 'nationality', 'citizen'],
  citizenship: ['nationality citizenship', 'citizenship', 'citizen'],
  multipleCitizens: ['nationality is the applicant a citizen of more than one country', 'citizen of more than one country'],
  otherNationality: ['nationality enter nationality', 'other nationality'],
  livingOtherCountry: ['nationality is the applicant living and studying in any other country', 'living and studying in any other country'],
  appliedImmigration: ['background info has applicant applied for any type of immigration', 'applied for any type of immigration'],
  immigrationDetails: ['background info specify here', 'immigration specify'],
  seriousMedical: ['background info does applicant suffer from a serious medical condition', 'serious medical condition'],
  medicalDetails: ['background info specify here', 'medical specify'],
  visaRefusal: ['background info has applicant visa refusal', 'visa refusal'],
  visaType: ['background info type of visa', 'type of visa'],
  convictedCriminal: ['background info has applicant ever been convicted of a criminal offence', 'convicted of a criminal offence'],
  criminalDetails: ['background info specify here', 'criminal specify'],
  emergencyName: ['important contacts emergency contacts name', 'emergency contacts name', 'emergency name'],
  emergencyPhone: ['important contacts emergency contacts phone', 'emergency contacts phone', 'emergency phone'],
  emergencyEmail: ['important contacts emergency contacts email', 'emergency contacts email', 'emergency email'],
  emergencyRelation: ['important contacts relation with applicant', 'relation with applicant', 'emergency relation'],
  countryOfEducation: ['education summary country of education', 'country of education'],
  highestLevelOfEducation: ['education summary highest level of education', 'highest level of education'],
  pgCountryOfStudy: ['post graduate country of study', 'postgraduate country of study'],
  pgStateOfStudy: ['post graduate state of study', 'postgraduate state of study'],
  pgLevelOfStudy: ['post graduate level of study', 'postgraduate level of study'],
  pgNameOfUniversity: ['post graduate name of university', 'postgraduate name of university'],
  pgQualification: ['post graduate qualification achieved', 'post graduate degree awarded', 'postgraduate qualification achieved', 'postgraduate degree awarded'],
  pgCityOfStudy: ['post graduate city of study', 'postgraduate city of study'],
  pgGradingSystem: ['post graduate grading system', 'postgraduate grading system'],
  pgPercentage: ['post graduate percentage', 'postgraduate percentage'],
  pgLanguageOfInstruction: ['post graduate primary language of instruction', 'postgraduate primary language of instruction'],
  pgStartDate: ['post graduate start date', 'postgraduate start date'],
  pgEndDate: ['post graduate end date', 'postgraduate end date'],
  ugCountryOfStudy: ['undergraduate country of study'],
  ugStateOfStudy: ['undergraduate state of study'],
  ugLevelOfStudy: ['undergraduate level of study'],
  ugNameOfUniversity: ['undergraduate name of university'],
  ugQualification: ['undergraduate qualification achieved', 'undergraduate degree awarded'],
  ugCityOfStudy: ['undergraduate city of study'],
  ugGradingSystem: ['undergraduate grading system'],
  ugScore: ['undergraduate score(ug)', 'undergraduate score'],
  ugLanguageOfInstruction: ['undergraduate primary language of instruction'],
  ugBacklogs: ['undergraduate backlogs'],
  ugStartDate: ['undergraduate start date'],
  ugEndDate: ['undergraduate end date'],
  grade12CountryOfStudy: ['grade 12th or equivalent education country of study', 'grade 12 country of study'],
  grade12StateOfStudy: ['grade 12th or equivalent education state of study', 'grade 12 state of study'],
  grade12LevelOfStudy: ['grade 12th or equivalent education level of study', 'grade 12 level of study'],
  grade12NameOfBoard: ['grade 12th or equivalent education name of board', 'grade 12 name of board'],
  grade12Qualification: ['grade 12th or equivalent education qualification achieved', 'grade 12 qualification achieved', 'grade 12 degree awarded'],
  grade12NameOfInstitution: ['grade 12th or equivalent education name of the institution', 'grade 12 name of the institution'],
  grade12CityOfStudy: ['grade 12th or equivalent education city of study', 'grade 12 city of study'],
  grade12GradingSystem: ['grade 12th or equivalent education grading system', 'grade 12 grading system'],
  grade12Score: ['grade 12th or equivalent education score(12th)', 'grade 12 score(12th)', 'grade 12 score'],
  grade12LanguageOfInstruction: ['grade 12th or equivalent education primary language of instruction', 'grade 12 primary language of instruction'],
  grade12StartDate: ['grade 12th or equivalent education start date', 'grade 12 start date'],
  grade12EndDate: ['grade 12th or equivalent education end date', 'grade 12 end date'],
  grade10CountryOfStudy: ['grade 10th or equivalent country of study', 'grade 10 country of study'],
  grade10StateOfStudy: ['grade 10th or equivalent state of study', 'grade 10 state of study'],
  grade10LevelOfStudy: ['grade 10th or equivalent level of study', 'grade 10 level of study'],
  grade10NameOfBoard: ['grade 10th or equivalent name of board', 'grade 10 name of board'],
  grade10Qualification: ['grade 10th or equivalent qualification achieved', 'grade 10 qualification achieved', 'grade 10 degree awarded'],
  grade10NameOfInstitution: ['grade 10th or equivalent name of the institution', 'grade 10 name of the institution'],
  grade10CityOfStudy: ['grade 10th or equivalent city of study', 'grade 10 city of study'],
  grade10GradingSystem: ['grade 10th or equivalent grading system', 'grade 10 grading system'],
  grade10Score: ['grade 10th or equivalent score(10th)', 'grade 10 score(10th)', 'grade 10 score'],
  grade10LanguageOfInstruction: ['grade 10th or equivalent primary language of instruction', 'grade 10 primary language of instruction'],
  grade10StartDate: ['grade 10th or equivalent start date', 'grade 10 start date'],
  grade10EndDate: ['grade 10th or equivalent end date', 'grade 10 end date'],
  greOverallScore: ['gre overall score'],
  greDateOfExamination: ['gre date of examination'],
  greQuantitative: ['gre quantitative', 'gre q:'],
  greVerbal: ['gre verbal', 'gre v:'],
  greAnalyticalWriting: ['gre analytical writing', 'gre aw:'],
  gmatOverallScore: ['gmat overall score'],
  gmatDateOfExamination: ['gmat date of examination'],
  gmatQuantitative: ['gmat quantitative', 'gmat q:'],
  gmatVerbal: ['gmat verbal', 'gmat v:'],
  gmatAnalyticalWriting: ['gmat analytical writing', 'gmat aw:'],
  gmatIntegratedReasoning: ['gmat integrated reasoning', 'gmat ir:'],
  toeflOverallScore: ['toefl overall score'],
  toeflDateOfExamination: ['toefl date of examination'],
  toeflReading: ['toefl reading', 'toefl r:'],
  toeflListening: ['toefl listening', 'toefl l:'],
  toeflSpeaking: ['toefl speaking', 'toefl s:'],
  toeflWriting: ['toefl writing', 'toefl w:'],
  toeflYetToReceive: ['toefl yet to receive'],
  toeflTestResultDate: ['toefl test result date'],
  toeflWaiver: ['toefl waiver'],
  toeflWaiverType: ['toefl 12th english marks', 'toefl medium of instruction', 'toefl moi'],
  ieltsOverallScore: ['ielts overall score'],
  ieltsTrfNo: ['ielts trf no'],
  ieltsDateOfExamination: ['ielts date of examination'],
  ieltsListening: ['ielts listening', 'ielts l:'],
  ieltsReading: ['ielts reading', 'ielts r:'],
  ieltsWriting: ['ielts writing', 'ielts w:'],
  ieltsSpeaking: ['ielts speaking', 'ielts s:'],
  ieltsYetToReceive: ['ielts yet to receive'],
  ieltsTestResultDate: ['ielts test result date'],
  ieltsWaiver: ['ielts waiver'],
  ieltsWaiverType: ['ielts 12th english marks', 'ielts medium of instruction', 'ielts moi'],
  pteOverallScore: ['pte overall score'],
  pteDateOfExamination: ['pte date of examination'],
  pteReading: ['pte reading', 'pte r:'],
  pteListening: ['pte listening', 'pte l:'],
  pteSpeaking: ['pte speaking', 'pte s:'],
  pteWriting: ['pte writing', 'pte w:'],
  pteYetToReceive: ['pte yet to receive'],
  pteTestResultDate: ['pte test result date'],
  pteWaiver: ['pte waiver'],
  pteWaiverType: ['pte 12th english marks', 'pte medium of instruction', 'pte moi'],
  detOverallScore: ['det overall score'],
  detDateOfExamination: ['det date of examination'],
  detCertificateId: ['det certificate id'],
  detYetToReceive: ['det yet to receive'],
  detTestResultDate: ['det test result date'],
  detWaiver: ['det waiver'],
  detWaiverType: ['det 12th english marks', 'det medium of instruction', 'det moi'],
  satOverallScore: ['sat overall score'],
  satDateOfExamination: ['sat date of examination'],
  satReadingWriting: ['sat reading & writing', 'sat rw:'],
  satMath: ['sat math', 'sat m:'],
  satEssay: ['sat essay', 'sat e:'],
  actOverallScore: ['act overall score'],
  actDateOfExamination: ['act date of examination'],
  actMath: ['act math', 'act m:'],
  actReading: ['act reading', 'act r:'],
  actScience: ['act science', 'act s:'],
  actEnglish: ['act english', 'act e:'],
  actWriting: ['act writing', 'act w:']
};

class FieldMapper {
  mapStudentData(studentData) {
    const mapped = {};
    try {
      const personal = studentData.personalInformation || {};
      const mailing = personal.mailingAddress || {};
      const permanent = personal.permanentAddress || {};
      const passport = personal.passport || {};
      const nationality = personal.nationality || {};
      const background = studentData.background || {};
      const emergency = studentData.emergency || {};
      const education = studentData.academicQualification || {};
      const tests = studentData.testScores || {};

      mapped.firstName = personal.firstName;
      mapped.lastName = personal.lastName;
      mapped.email = personal.email;
      mapped.phoneNumber = personal.phoneNumber;
      mapped.dateOfBirth = personal.dateOfBirth;
      mapped.gender = personal.gender;
      mapped.maritalStatus = personal.maritalStatus;

      mapped.addressLine1 = mailing.line1 || permanent.line1;
      mapped.addressLine2 = mailing.line2 || permanent.line2;
      mapped.city = mailing.city || permanent.city;
      mapped.state = mailing.state || permanent.state;
      mapped.country = mailing.country || permanent.country;
      mapped.pincode = mailing.pincode || permanent.pincode;
      mapped.sameAsMailingAddress = (mailing.line1 === permanent.line1 && mailing.line2 === permanent.line2 && 
                                     mailing.city === permanent.city && mailing.state === permanent.state && 
                                     mailing.country === permanent.country && mailing.pincode === permanent.pincode);

      mapped.passportNumber = passport.number;
      mapped.passportIssueDate = passport.issueDate;
      mapped.passportExpiryDate = passport.expiryDate;
      mapped.passportIssueCountry = passport.isssueCountry || passport.country;
      mapped.cityOfBirth = passport.cityOfBirth;
      mapped.countryOfBirth = passport.countryOfBirth;

      mapped.nationality = nationality.country;
      mapped.citizenship = nationality.citizenship;
      mapped.multipleCitizens = nationality.hasMultipleCitizenship ? 'Yes' : 'No';
      mapped.otherNationality = nationality.hasMultipleCitizenshipCountry;
      mapped.livingOtherCountry = nationality.isStudyingAbroad ? 'Yes' : 'No';

      mapped.appliedImmigration = background.immigrationApplied ? 'Yes' : 'No';
      mapped.immigrationDetails = background.immigrationAppliedCountry;
      mapped.seriousMedical = background.hasMedicalCondition ? 'Yes' : 'No';
      mapped.medicalDetails = background.medicalDetails;
      mapped.visaRefusal = background.visaRefused ? 'Yes' : 'No';
      mapped.visaType = background.visaRefusalType;
      mapped.convictedCriminal = background.hasCriminalRecord ? 'Yes' : 'No';
      mapped.criminalDetails = background.criminalRecordDetails;
      mapped.maritalStatus = personal.maritalStatus === 'Married' ? 'yes' : (personal.maritalStatus === 'Single' ? 'no' : personal.maritalStatus);
      mapped.gender = personal.gender.toLowerCase();

      mapped.emergencyName = emergency.name;
      mapped.emergencyPhone = emergency.phone;
      mapped.emergencyEmail = emergency.email;
      mapped.emergencyRelation = emergency.relationshipWithApplicant;

      mapped.countryOfEducation = education.countryOfEducation;
      mapped.highestLevelOfEducation = education.highestLevel;

      const pg = education.postgraduateMarks || {};
      mapped.pgCountryOfStudy = pg.country;
      mapped.pgStateOfStudy = pg.state;
      mapped.pgLevelOfStudy = pg.level;
      mapped.pgNameOfUniversity = pg.postgradCollegeName;
      mapped.pgQualification = pg.degreeType;
      mapped.pgCityOfStudy = pg.city;
      mapped.pgGradingSystem = String(pg.scoreSystem);
      mapped.pgPercentage = pg.score;
      mapped.pgLanguageOfInstruction = pg.language;
      mapped.pgStartDate = pg.startDate;
      mapped.pgEndDate = pg.endDate;

      const ug = education.undergraduateMarks || {};
      mapped.ugCountryOfStudy = ug.country;
      mapped.ugStateOfStudy = ug.state;
      mapped.ugLevelOfStudy = ug.level;
      mapped.ugNameOfUniversity = ug.undergradCollegeName;
      mapped.ugQualification = ug.degreeType;
      mapped.ugCityOfStudy = ug.city;
      mapped.ugGradingSystem = String(ug.scoreSystem);
      mapped.ugScore = ug.score;
      mapped.ugLanguageOfInstruction = ug.language;
      mapped.ugBacklogs = ug.degreeBacklogs;
      mapped.ugStartDate = ug.startDate;
      mapped.ugEndDate = ug.endDate;

      const g12 = education.highSchoolMarks || {};
      mapped.grade12CountryOfStudy = g12.country;
      mapped.grade12StateOfStudy = g12.state;
      mapped.grade12LevelOfStudy = g12.level;
      mapped.grade12NameOfBoard = g12.boardName;
      mapped.grade12Qualification = g12.degreeType;
      mapped.grade12NameOfInstitution = g12.highSchoolName;
      mapped.grade12CityOfStudy = g12.city;
      mapped.grade12GradingSystem = String(g12.highSchoolScoreSystem);
      mapped.grade12Score = g12.highSchoolScore;
      mapped.grade12LanguageOfInstruction = g12.language;
      mapped.grade12StartDate = g12.startDate;
      mapped.grade12EndDate = g12.endDate;

      const g10 = education.grade10 || {};
      mapped.grade10CountryOfStudy = g10.country;
      mapped.grade10StateOfStudy = g10.state;
      mapped.grade10LevelOfStudy = g10.level;
      mapped.grade10NameOfBoard = g10.boardName;
      mapped.grade10Qualification = g10.degreeType;
      mapped.grade10NameOfInstitution = g10.schoolName;
      mapped.grade10CityOfStudy = g10.city;
      mapped.grade10GradingSystem = String(g10.schoolScoreSystem);
      mapped.grade10Score = g10.schoolScore;
      mapped.grade10LanguageOfInstruction = g10.language;
      mapped.grade10StartDate = g10.startDate;
      mapped.grade10EndDate = g10.endDate;

      const gre = tests.gre || {};
      mapped.greOverallScore = gre.overallScore;
      mapped.greDateOfExamination = gre.examDate;
      mapped.greQuantitative = gre.quantitative;
      mapped.greVerbal = gre.verbal;
      mapped.greAnalyticalWriting = gre.analyticalWriting;

      const gmat = tests.gmat || {};
      mapped.gmatOverallScore = gmat.overallScore;
      mapped.gmatDateOfExamination = gmat.examDate;
      mapped.gmatQuantitative = gmat.quantitative;
      mapped.gmatVerbal = gmat.verbal;
      mapped.gmatAnalyticalWriting = gmat.analyticalWriting;
      mapped.gmatIntegratedReasoning = gmat.integratedReasoning;

      const toefl = tests.toefl || {};
      mapped.toeflOverallScore = toefl.overallScore;
      mapped.toeflDateOfExamination = toefl.examDate;
      mapped.toeflReading = toefl.reading;
      mapped.toeflListening = toefl.listening;
      mapped.toeflSpeaking = toefl.speaking;
      mapped.toeflWriting = toefl.writing;
      mapped.toeflYetToReceive = toefl.yetToReceive ? 'Yes' : 'No';
      mapped.toeflTestResultDate = toefl.testResultDate;
      mapped.toeflWaiver = toefl.waiver ? 'Yes' : 'No';
      mapped.toeflWaiverType = toefl.waiverType;

      const ielts = tests.ielts || {};
      mapped.ieltsOverallScore = ielts.overallScore;
      mapped.ieltsTrfNo = ielts.trfNo;
      mapped.ieltsDateOfExamination = ielts.examDate;
      mapped.ieltsListening = ielts.listening;
      mapped.ieltsReading = ielts.reading;
      mapped.ieltsWriting = ielts.writing;
      mapped.ieltsSpeaking = ielts.speaking;
      mapped.ieltsYetToReceive = ielts.yetToReceive ? 'Yes' : 'No';
      mapped.ieltsTestResultDate = ielts.testResultDate;
      mapped.ieltsWaiver = ielts.waiver ? 'Yes' : 'No';
      mapped.ieltsWaiverType = ielts.waiverType;

      const pte = tests.pte || tests['0'] || {};
      mapped.pteOverallScore = pte.testScore || pte.overallScore;
      mapped.pteDateOfExamination = pte.examDate;
      mapped.pteReading = pte.reading;
      mapped.pteListening = pte.listening;
      mapped.pteSpeaking = pte.speaking;
      mapped.pteWriting = pte.writing;
      mapped.pteYetToReceive = pte.yetToReceive ? 'Yes' : 'No';
      mapped.pteTestResultDate = pte.testResultDate;
      mapped.pteWaiver = pte.waiver ? 'Yes' : 'No';
      mapped.pteWaiverType = pte.waiverType;

      const det = tests.det || {};
      mapped.detOverallScore = det.overallScore;
      mapped.detDateOfExamination = det.examDate;
      mapped.detCertificateId = det.certificateId;
      mapped.detYetToReceive = det.yetToReceive ? 'Yes' : 'No';
      mapped.detTestResultDate = det.testResultDate;
      mapped.detWaiver = det.waiver ? 'Yes' : 'No';
      mapped.detWaiverType = det.waiverType;

      const sat = tests.sat || {};
      mapped.satOverallScore = sat.overallScore;
      mapped.satDateOfExamination = sat.examDate;
      mapped.satReadingWriting = sat.readingWriting;
      mapped.satMath = sat.math;
      mapped.satEssay = sat.essay;

      const act = tests.act || {};
      mapped.actOverallScore = act.overallScore;
      mapped.actDateOfExamination = act.examDate;
      mapped.actMath = act.math;
      mapped.actReading = act.reading;
      mapped.actScience = act.science;
      mapped.actEnglish = act.english;
      mapped.actWriting = act.writing;

      mapped.studentId = studentData.studentId?._id || studentData._id;
      mapped.studentFaId = studentData.studentFaId;
    } catch (error) {
      console.error('Error mapping student data:', error);
    }

    Object.keys(mapped).forEach(key => {
      if (mapped[key] === null || mapped[key] === undefined || mapped[key] === '') {
        delete mapped[key];
      }
    });

    return mapped;
  }
}