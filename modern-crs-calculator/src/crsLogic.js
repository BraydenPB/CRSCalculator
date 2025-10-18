import { z } from 'zod'

// Comprehensive CRS Data Schema
export const CRSInputSchema = z.object({
  // Personal Information
  age: z.number().min(17).max(45),
  birthDate: z.string().optional(),
  maritalStatus: z.number().min(1).max(7), // 1: Annulled, 2: Common-Law, 3: Divorced, 4: Legally Separated, 5: Married, 6: Never Married/Single, 7: Widowed

  // Spouse Information (if applicable)
  spouseIsCanadianCitizen: z.boolean().optional(),
  spouseAccompanying: z.boolean().optional(),

  // Education
  educationLevel: z.number().min(1).max(8), // 1-8 scale from original system
  canadianEducation: z.number().min(-1).max(3), // -1: No, 0: High school, 1: 1-2 years, 3: 3+ years

  // Language - First Language
  firstLanguageExam: z.number().min(1).max(5), // 1: IELTS, 2: CELPIP, 3: TEF, 4: TCF, 5: PTE Core
  firstLanguageSpeaking: z.string(), // Dropdown value
  firstLanguageWriting: z.string(), // Dropdown value
  firstLanguageReading: z.string(), // Dropdown value
  firstLanguageListening: z.string(), // Dropdown value

  // Language - Second Language
  hasSecondLanguage: z.boolean(),
  secondLanguageExam: z.number().min(1).max(5).optional(),
  secondLanguageSpeaking: z.string().optional(), // Dropdown value
  secondLanguageWriting: z.string().optional(), // Dropdown value
  secondLanguageReading: z.string().optional(), // Dropdown value
  secondLanguageListening: z.string().optional(), // Dropdown value

  // Work Experience
  canadianExperience: z.number().min(0).max(5), // 0: none, 1-5: years
  foreignExperience: z.number().min(0).max(3), // 0: none, 1-3: years

  // Spouse Information (if applicable)
  spouseEducationLevel: z.number().min(1).max(8).optional(),
  spouseLanguageExam: z.number().min(0).max(5).optional(), // 0: Not applicable, 1-5: test types
  spouseLanguageSpeaking: z.string().optional(), // Dropdown value
  spouseLanguageWriting: z.string().optional(), // Dropdown value
  spouseLanguageReading: z.string().optional(), // Dropdown value
  spouseLanguageListening: z.string().optional(), // Dropdown value
  spouseCanadianExperience: z.number().min(0).max(5).optional(),

  // Additional Factors
  hasCanadianFamily: z.boolean(),
  hasProvincialNomination: z.boolean(),

  // French Language Bonus
  hasFrenchLanguageSkills: z.boolean(),
})

// Helper functions for dropdown value to CLB conversion
const LANGUAGE_SCORE_OPTIONS = {
  // CELPIP-G - Integer scores (All Skills: Speaking, Listening, Reading, Writing)
  celpip: [
    { value: '12', clb: 12 },
    { value: '11', clb: 11 },
    { value: '10', clb: 10 },
    { value: '9', clb: 9 },
    { value: '8', clb: 8 },
    { value: '7', clb: 7 },
    { value: '6', clb: 6 },
    { value: '5', clb: 5 },
    { value: '4', clb: 4 },
    { value: '3', clb: 3 },
    { value: '2', clb: 2 },
    { value: '1', clb: 1 },
    { value: 'M', clb: 0 }
  ],

  // IELTS and PTE Core - Same ranges for both tests
  ielts_pte: [
    { value: '7.5-9.0', clb: 10 },
    { value: '7.0', clb: 9 },
    { value: '6.5', clb: 8 },
    { value: '6.0', clb: 7 },
    { value: '5.5', clb: 6 },
    { value: '5.0', clb: 5 },
    { value: '4.0-4.5', clb: 4 },
    { value: '0-3.5', clb: 0 }
  ],

  // TEF Canada Score Ranges
  tef: {
    speaking_writing_reading: [
      { value: '393-450', clb: 10 },
      { value: '371-392', clb: 9 },
      { value: '349-370', clb: 8 },
      { value: '310-348', clb: 7 },
      { value: '271-309', clb: 6 },
      { value: '226-270', clb: 5 },
      { value: '181-225', clb: 4 },
      { value: '0-180', clb: 0 }
    ],
    listening: [
      { value: '316-360', clb: 10 },
      { value: '298-315', clb: 9 },
      { value: '280-297', clb: 8 },
      { value: '249-279', clb: 7 },
      { value: '217-248', clb: 6 },
      { value: '181-216', clb: 5 },
      { value: '145-180', clb: 4 },
      { value: '0-144', clb: 0 }
    ]
  },

  // TCF Canada Score Ranges
  tcf: {
    speaking_writing: [
      { value: '16-20', clb: 10 },
      { value: '14-15', clb: 9 },
      { value: '12-13', clb: 8 },
      { value: '10-11', clb: 7 },
      { value: '7-9', clb: 6 },
      { value: '6-4', clb: 5 },
      { value: '0-3', clb: 0 }
    ],
    listening: [
      { value: '549-699', clb: 10 },
      { value: '523-548', clb: 9 },
      { value: '503-522', clb: 8 },
      { value: '458-502', clb: 7 },
      { value: '398-457', clb: 6 },
      { value: '369-397', clb: 5 },
      { value: '331-368', clb: 4 },
      { value: '0-330', clb: 0 }
    ],
    reading: [
      { value: '549-699', clb: 10 },
      { value: '524-548', clb: 9 },
      { value: '499-523', clb: 8 },
      { value: '453-498', clb: 7 },
      { value: '406-452', clb: 6 },
      { value: '375-405', clb: 5 },
      { value: '342-374', clb: 4 },
      { value: '0-341', clb: 0 }
    ]
  }
}

// Helper function to get CLB level from dropdown value
function getCLBFromDropdownValue(examType, skill, value) {
  if (!value) return 0

  let options
  if (examType === 1) {
    // IELTS
    options = LANGUAGE_SCORE_OPTIONS.ielts_pte
  } else if (examType === 2) {
    // CELPIP-G
    options = LANGUAGE_SCORE_OPTIONS.celpip
  } else if (examType === 5) {
    // PTE Core
    options = LANGUAGE_SCORE_OPTIONS.ielts_pte
  } else if (examType === 3) {
    // TEF Canada
    if (skill === 'listening') {
      options = LANGUAGE_SCORE_OPTIONS.tef.listening
    } else {
      options = LANGUAGE_SCORE_OPTIONS.tef.speaking_writing_reading
    }
  } else if (examType === 4) {
    // TCF Canada
    if (skill === 'listening') {
      options = LANGUAGE_SCORE_OPTIONS.tcf.listening
    } else if (skill === 'reading') {
      options = LANGUAGE_SCORE_OPTIONS.tcf.reading
    } else {
      options = LANGUAGE_SCORE_OPTIONS.tcf.speaking_writing
    }
  } else {
    return 0
  }

  const option = options.find(opt => opt.value === value)
  return option ? option.clb : 0
}

// Age Points Calculator
export function calculateAgePoints(age) {
  const agePoints = {
    17: 0,
    18: 90,
    19: 95,
    20: 100,
    21: 105,
    22: 110,
    23: 112,
    24: 114,
    25: 116,
    26: 118,
    27: 120,
    28: 122,
    29: 124,
    30: 126,
    31: 128,
    32: 130,
    33: 132,
    34: 134,
    35: 135,
    36: 131,
    37: 127,
    38: 123,
    39: 119,
    40: 115,
    41: 111,
    42: 107,
    43: 103,
    44: 99,
    45: 95, // 45 years old
  }
  return agePoints[age] || 0
}

// Education Points Calculator
export function calculateEducationPoints(educationLevel, maritalStatus) {
  const hasSpouse = maritalStatus === 2 || maritalStatus === 5; // Common-Law or Married
  const educationPoints = {
    1: hasSpouse ? 0 : 0, // Less than secondary school
    2: hasSpouse ? 28 : 30, // Secondary diploma
    3: hasSpouse ? 84 : 90, // One-year degree/diploma
    4: hasSpouse ? 91 : 98, // Two-year program
    5: hasSpouse ? 112 : 120, // Bachelor's degree or 3+ year program
    6: hasSpouse ? 119 : 128, // Two or more certificates/diplomas
    7: hasSpouse ? 126 : 135, // Master's degree
    8: hasSpouse ? 140 : 150, // Doctoral degree
  }
  return educationPoints[educationLevel] || 0
}

// Get maximum score for each test type
export function getMaxScoreForTest(examType) {
  const maxScores = {
    1: 9, // IELTS - General Training (0-9)
    2: 12, // CELPIP - General test (0-12)
    3: 450, // TEF Canada (0-450)
    4: 450, // TCF Canada (0-450)
    5: 90, // PTE Core (0-90)
  }
  return maxScores[examType] || 9
}

// Convert language test scores to CLB levels (using dropdown values)
export function convertToCLB(examType, speaking, writing, reading, listening) {
  return {
    speaking: getCLBFromDropdownValue(examType, 'speaking', speaking),
    writing: getCLBFromDropdownValue(examType, 'writing', writing),
    reading: getCLBFromDropdownValue(examType, 'reading', reading),
    listening: getCLBFromDropdownValue(examType, 'listening', listening),
  }
}

// CELPIP to CLB conversion table
function convertCELPIPToCLB(score) {
  if (score >= 12) return 10 // CELPIP 12 = CLB 10
  if (score >= 11) return 9 // CELPIP 11 = CLB 9
  if (score >= 10) return 8 // CELPIP 10 = CLB 8
  if (score >= 9) return 7 // CELPIP 9 = CLB 7
  if (score >= 8) return 6 // CELPIP 8 = CLB 6
  if (score >= 7) return 5 // CELPIP 7 = CLB 5
  if (score >= 6) return 4 // CELPIP 6 = CLB 4
  if (score >= 5) return 3 // CELPIP 5 = CLB 3
  if (score >= 4) return 2 // CELPIP 4 = CLB 2
  return Math.max(0, Math.floor(score))
}

// IELTS to CLB conversion table
function convertIELTSToCLB(score) {
  if (score >= 9.0) return 10 // IELTS 9.0 = CLB 10
  if (score >= 8.0) return 9 // IELTS 8.0 = CLB 9
  if (score >= 7.0) return 8 // IELTS 7.0 = CLB 8
  if (score >= 6.5) return 7 // IELTS 6.5 = CLB 7
  if (score >= 6.0) return 6 // IELTS 6.0 = CLB 6
  if (score >= 5.5) return 5 // IELTS 5.5 = CLB 5
  if (score >= 5.0) return 4 // IELTS 5.0 = CLB 4
  if (score >= 4.0) return 3 // IELTS 4.0 = CLB 3
  return Math.max(0, Math.floor(score))
}

// PTE Core to CLB conversion table
function convertPTEToCLB(score) {
  if (score >= 89) return 10 // PTE 89-90 = CLB 10
  if (score >= 84) return 9 // PTE 84-88 = CLB 9
  if (score >= 79) return 8 // PTE 79-83 = CLB 8
  if (score >= 73) return 7 // PTE 73-78 = CLB 7
  if (score >= 64) return 6 // PTE 64-72 = CLB 6
  if (score >= 59) return 5 // PTE 59-63 = CLB 5
  if (score >= 51) return 4 // PTE 51-58 = CLB 4
  if (score >= 41) return 3 // PTE 41-50 = CLB 3
  return Math.max(0, Math.floor(score / 10))
}

// TEF Canada to CLB conversion table (Speaking, Writing, Reading)
function convertTEFToCLB(score) {
  if (score >= 393) return 10 // TEF 393-450 = CLB 10
  if (score >= 371) return 9 // TEF 371-392 = CLB 9
  if (score >= 349) return 8 // TEF 349-370 = CLB 8
  if (score >= 310) return 7 // TEF 310-348 = CLB 7
  if (score >= 271) return 6 // TEF 271-309 = CLB 6
  if (score >= 226) return 5 // TEF 226-270 = CLB 5
  if (score >= 181) return 4 // TEF 181-225 = CLB 4
  if (score >= 121) return 3 // TEF 121-180 = CLB 3
  return Math.max(0, Math.floor(score / 45))
}

// TEF Canada to CLB conversion table (Listening - different ranges)
function convertTEFToListeningCLB(score) {
  if (score >= 316) return 10 // TEF 316-360 = CLB 10
  if (score >= 298) return 9 // TEF 298-315 = CLB 9
  if (score >= 280) return 8 // TEF 280-297 = CLB 8
  if (score >= 249) return 7 // TEF 249-279 = CLB 7
  if (score >= 217) return 6 // TEF 217-248 = CLB 6
  if (score >= 181) return 5 // TEF 181-216 = CLB 5
  if (score >= 145) return 4 // TEF 145-180 = CLB 4
  return Math.max(0, Math.floor(score / 36))
}

// Calculate First Language Points
export function calculateFirstLanguagePoints(clbScores, hasSpouse) {
  const { speaking, writing, reading, listening } = clbScores

  let points = 0

  // Speaking points
  if (speaking >= 7.0) points += hasSpouse ? 31 : 32
  else if (speaking >= 6.0) points += hasSpouse ? 22 : 23
  else if (speaking >= 5.0) points += hasSpouse ? 16 : 17
  else if (speaking >= 4.0) points += hasSpouse ? 8 : 9

  // Writing points
  if (writing >= 7.0) points += hasSpouse ? 31 : 32
  else if (writing >= 6.0) points += hasSpouse ? 22 : 23
  else if (writing >= 5.0) points += hasSpouse ? 16 : 17
  else if (writing >= 4.0) points += hasSpouse ? 8 : 9

  // Reading points
  if (reading >= 7.0) points += hasSpouse ? 31 : 32
  else if (reading >= 6.0) points += hasSpouse ? 22 : 23
  else if (reading >= 5.0) points += hasSpouse ? 16 : 17
  else if (reading >= 4.0) points += hasSpouse ? 8 : 9

  // Listening points
  if (listening >= 7.0) points += hasSpouse ? 31 : 32
  else if (listening >= 6.0) points += hasSpouse ? 22 : 23
  else if (listening >= 5.0) points += hasSpouse ? 16 : 17
  else if (listening >= 4.0) points += hasSpouse ? 8 : 9

  return points
}

// Calculate Second Language Points
export function calculateSecondLanguagePoints(clbScores) {
  const { speaking, writing, reading, listening } = clbScores

  let points = 0

  // Maximum 6 points per skill, total max 24
  if (speaking >= 7.0) points += 6
  else if (speaking >= 5.0) points += 3
  else if (speaking >= 4.0) points += 1

  if (writing >= 7.0) points += 6
  else if (writing >= 5.0) points += 3
  else if (writing >= 4.0) points += 1

  if (reading >= 7.0) points += 6
  else if (reading >= 5.0) points += 3
  else if (reading >= 4.0) points += 1

  if (listening >= 7.0) points += 6
  else if (listening >= 5.0) points += 3
  else if (listening >= 4.0) points += 1

  return points
}

// Canadian Work Experience Points
export function calculateCanadianExperiencePoints(years, maritalStatus) {
  const hasSpouse = maritalStatus === 2 || maritalStatus === 5; // Common-Law or Married
  const experiencePoints = {
    0: 0,
    1: hasSpouse ? 35 : 40,
    2: hasSpouse ? 63 : 70,
    3: hasSpouse ? 84 : 80,
    4: hasSpouse ? 105 : 100,
    5: hasSpouse ? 119 : 120,
  }
  return experiencePoints[years] || 0
}

// Spouse Education Points
export function calculateSpouseEducationPoints(educationLevel) {
  const spouseEducationPoints = {
    1: 0, // Less than secondary school
    2: 2, // Secondary diploma
    3: 6, // One-year degree/diploma
    4: 7, // Two-year program
    5: 8, // Bachelor's degree
    6: 9, // Two or more certificates/diplomas
    7: 10, // Master's degree
    8: 10, // Doctoral degree
  }
  return spouseEducationPoints[educationLevel] || 0
}

// Spouse Language Points
export function calculateSpouseLanguagePoints(clbScores) {
  const { speaking, writing, reading, listening } = clbScores
  let points = 0

  // 5 points per skill at CLB 4+
  if (speaking >= 4.0) points += 5
  if (writing >= 4.0) points += 5
  if (reading >= 4.0) points += 5
  if (listening >= 4.0) points += 5

  return points
}

// Spouse Canadian Experience Points
export function calculateSpouseCanadianExperiencePoints(years) {
  const spouseExperiencePoints = {
    0: 0,
    1: 5,
    2: 7,
    3: 8,
    4: 9,
    5: 10,
  }
  return spouseExperiencePoints[years] || 0
}

// Skill Transferability Factors (Max 100 points)
export function calculateSkillTransferabilityFactors(data) {
  let points = 0

  const firstLangCLB = convertToCLB(
    data.firstLanguageExam,
    data.firstLanguageSpeaking,
    data.firstLanguageWriting,
    data.firstLanguageReading,
    data.firstLanguageListening
  )

  const maxCLB = Math.max(
    firstLangCLB.speaking,
    firstLangCLB.writing,
    firstLangCLB.reading,
    firstLangCLB.listening
  )

  // Education + Language
  if (data.educationLevel >= 5 && maxCLB >= 7.0) {
    points += 50
  } else if (data.educationLevel >= 4 && maxCLB >= 7.0) {
    points += 25
  } else if (data.educationLevel >= 3 && maxCLB >= 7.0) {
    points += 13
  }

  // Education + Canadian Experience
  if (data.educationLevel >= 5 && data.canadianExperience >= 1) {
    points += 50
  } else if (data.educationLevel >= 4 && data.canadianExperience >= 1) {
    points += 25
  } else if (data.educationLevel >= 3 && data.canadianExperience >= 1) {
    points += 13
  }

  // Foreign Experience + Language
  if (data.foreignExperience >= 3 && maxCLB >= 7.0) {
    points += 50
  } else if (data.foreignExperience >= 2 && maxCLB >= 7.0) {
    points += 25
  } else if (data.foreignExperience >= 1 && maxCLB >= 7.0) {
    points += 13
  }

  // Foreign Experience + Canadian Experience
  if (data.foreignExperience >= 3 && data.canadianExperience >= 2) {
    points += 50
  } else if (data.foreignExperience >= 2 && data.canadianExperience >= 2) {
    points += 25
  } else if (data.foreignExperience >= 1 && data.canadianExperience >= 1) {
    points += 13
  }

  // Certificate of Qualification + Language (simplified)
  // This would need more complex logic for trade certificates

  return Math.min(points, 100) // Cap at 100 points
}

// Additional Points
export function calculateAdditionalPoints(data) {
  let points = 0

  // Provincial Nomination (600 points)
  if (data.hasProvincialNomination) points += 600

  // Note: Arranged Employment points (50-200 points) were eliminated in March 2025
  // No longer awarded for LMIA-supported job offers

  // Canadian Education
  if (data.canadianEducation === 1)
    points += 15 // 1-2 years
  else if (data.canadianEducation === 3) points += 30 // 3+ years

  // Family in Canada
  if (data.hasCanadianFamily) points += 15

  // French Language Skills
  if (data.hasFrenchLanguageSkills) {
    // Simplified - would need actual French test scores
    points += 25 // Basic French bonus
  }

  return points
}

// Dynamic validation for language scores based on test type (dropdown values)
function validateLanguageScores(data) {
  const errors = []

  // Validate first language scores (dropdown values)
  if (!data.firstLanguageSpeaking) {
    errors.push('First language speaking score is required')
  }
  if (!data.firstLanguageWriting) {
    errors.push('First language writing score is required')
  }
  if (!data.firstLanguageReading) {
    errors.push('First language reading score is required')
  }
  if (!data.firstLanguageListening) {
    errors.push('First language listening score is required')
  }

  // Validate second language scores if provided
  if (data.hasSecondLanguage && data.secondLanguageExam) {
    if (!data.secondLanguageSpeaking) {
      errors.push('Second language speaking score is required when second language test is selected')
    }
    if (!data.secondLanguageWriting) {
      errors.push('Second language writing score is required when second language test is selected')
    }
    if (!data.secondLanguageReading) {
      errors.push('Second language reading score is required when second language test is selected')
    }
    if (!data.secondLanguageListening) {
      errors.push('Second language listening score is required when second language test is selected')
    }
  }

  // Validate spouse language scores if provided
  if (data.spouseLanguageExam && data.spouseLanguageExam !== 0) {
    if (!data.spouseLanguageSpeaking) {
      errors.push('Spouse language speaking score is required when spouse language test is selected')
    }
    if (!data.spouseLanguageWriting) {
      errors.push('Spouse language writing score is required when spouse language test is selected')
    }
    if (!data.spouseLanguageReading) {
      errors.push('Spouse language reading score is required when spouse language test is selected')
    }
    if (!data.spouseLanguageListening) {
      errors.push('Spouse language listening score is required when spouse language test is selected')
    }
  }

  return errors
}

// Main CRS Calculation Function
export function calculateCRS(data) {
  // Validate input data
  const validData = CRSInputSchema.parse(data)

  // Perform dynamic validation for language scores
  const validationErrors = validateLanguageScores(validData)
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join('; '))
  }

  let totalScore = 0
  let breakdown = {
    sectionA: { title: 'Core Human Capital Factors', points: 0, details: {} },
    sectionB: { title: 'Spouse/Common-law Partner Factors', points: 0, details: {} },
    sectionC: { title: 'Skill Transferability Factors', points: 0, details: {} },
    sectionD: { title: 'Additional Points', points: 0, details: {} },
  }

  // Section A: Core Human Capital Factors
  const agePoints = calculateAgePoints(validData.age)
  const educationPoints = calculateEducationPoints(validData.educationLevel, validData.maritalStatus)

  const firstLangCLB = convertToCLB(
    validData.firstLanguageExam,
    validData.firstLanguageSpeaking,
    validData.firstLanguageWriting,
    validData.firstLanguageReading,
    validData.firstLanguageListening
  )

  const hasSpouse = validData.maritalStatus === 2 || validData.maritalStatus === 5; // Common-Law or Married
  const firstLanguagePoints = calculateFirstLanguagePoints(firstLangCLB, hasSpouse)

  let secondLanguagePoints = 0
  if (validData.hasSecondLanguage && validData.secondLanguageExam) {
    const secondLangCLB = convertToCLB(
      validData.secondLanguageExam,
      validData.secondLanguageSpeaking || 0,
      validData.secondLanguageWriting || 0,
      validData.secondLanguageReading || 0,
      validData.secondLanguageListening || 0
    )
    secondLanguagePoints = calculateSecondLanguagePoints(secondLangCLB)
  }

  const canadianExperiencePoints = calculateCanadianExperiencePoints(
    validData.canadianExperience,
    validData.maritalStatus
  )

  breakdown.sectionA.points =
    agePoints +
    educationPoints +
    firstLanguagePoints +
    secondLanguagePoints +
    canadianExperiencePoints
  breakdown.sectionA.details = {
    age: agePoints,
    education: educationPoints,
    firstLanguage: firstLanguagePoints,
    secondLanguage: secondLanguagePoints,
    canadianExperience: canadianExperiencePoints,
  }

  // Section B: Spouse Factors (if applicable)
  if (hasSpouse) {
    const spouseEducationPoints = calculateSpouseEducationPoints(
      validData.spouseEducationLevel || 1
    )

    let spouseLanguagePoints = 0
    if (validData.spouseLanguageExam && validData.spouseLanguageExam !== 0 && validData.spouseLanguageSpeaking) {
      const spouseCLB = convertToCLB(
        validData.spouseLanguageExam,
        validData.spouseLanguageSpeaking,
        validData.spouseLanguageWriting,
        validData.spouseLanguageReading,
        validData.spouseLanguageListening
      )
      spouseLanguagePoints = calculateSpouseLanguagePoints(spouseCLB)
    }

    const spouseExperiencePoints = calculateSpouseCanadianExperiencePoints(
      validData.spouseCanadianExperience || 0
    )

    breakdown.sectionB.points =
      spouseEducationPoints + spouseLanguagePoints + spouseExperiencePoints
    breakdown.sectionB.details = {
      education: spouseEducationPoints,
      language: spouseLanguagePoints,
      experience: spouseExperiencePoints,
    }
  }

  // Section C: Skill Transferability Factors
  const transferabilityPoints = calculateSkillTransferabilityFactors(validData)
  breakdown.sectionC.points = transferabilityPoints

  // Section D: Additional Points
  const additionalPoints = calculateAdditionalPoints(validData)
  breakdown.sectionD.points = additionalPoints
  breakdown.sectionD.details = {
    provincialNomination: validData.hasProvincialNomination ? 600 : 0,
    arrangedEmployment: 0, // Arranged employment points eliminated in March 2025
    canadianEducation:
      validData.canadianEducation === 1 ? 15 : validData.canadianEducation === 3 ? 30 : 0,
    canadianFamily: validData.hasCanadianFamily ? 15 : 0,
    frenchSkills: validData.hasFrenchLanguageSkills ? 25 : 0,
  }

  // Calculate total score
  totalScore =
    breakdown.sectionA.points +
    breakdown.sectionB.points +
    breakdown.sectionC.points +
    breakdown.sectionD.points

  return {
    totalScore,
    breakdown,
    validData,
    clbScores: {
      firstLanguage: firstLangCLB,
      secondLanguage: validData.hasSecondLanguage
        ? convertToCLB(
            validData.secondLanguageExam || 1,
            validData.secondLanguageSpeaking || 0,
            validData.secondLanguageWriting || 0,
            validData.secondLanguageReading || 0,
            validData.secondLanguageListening || 0
          )
        : null,
    },
  }
}
