import { z } from 'zod';

// Comprehensive CRS Data Schema
export const CRSInputSchema = z.object({
  // Personal Information
  age: z.number().min(17).max(44),
  birthDate: z.string().optional(),
  hasSpouse: z.boolean(),

  // Education
  educationLevel: z.number().min(1).max(8), // 1-8 scale from original system
  canadianEducation: z.number().min(-1).max(3), // -1: No, 0: High school, 1: 1-2 years, 3: 3+ years

  // Language - First Language
  firstLanguageExam: z.number().min(1).max(4), // 1: IELTS, 2: CELPIP, 3: TEF, 4: TCF
  firstLanguageSpeaking: z.number().min(0).max(12), // Max 12 for CELPIP, validated dynamically
  firstLanguageWriting: z.number().min(0).max(12),  // Max 12 for CELPIP, validated dynamically
  firstLanguageReading: z.number().min(0).max(12),  // Max 12 for CELPIP, validated dynamically
  firstLanguageListening: z.number().min(0).max(12), // Max 12 for CELPIP, validated dynamically

  // Language - Second Language
  hasSecondLanguage: z.boolean(),
  secondLanguageExam: z.number().min(1).max(4).optional(),
  secondLanguageSpeaking: z.number().min(0).max(12).optional(), // Max 12 for CELPIP, validated dynamically
  secondLanguageWriting: z.number().min(0).max(12).optional(),  // Max 12 for CELPIP, validated dynamically
  secondLanguageReading: z.number().min(0).max(12).optional(),  // Max 12 for CELPIP, validated dynamically
  secondLanguageListening: z.number().min(0).max(12).optional(), // Max 12 for CELPIP, validated dynamically

  // Work Experience
  canadianExperience: z.number().min(0).max(5), // 0: none, 1-5: years
  foreignExperience: z.number().min(0).max(3), // 0: none, 1-3: years

  // Spouse Information (if applicable)
  spouseEducationLevel: z.number().min(1).max(8).optional(),
  spouseLanguageSpeaking: z.number().min(0).max(12).optional(), // Max 12 for CELPIP, validated dynamically
  spouseLanguageWriting: z.number().min(0).max(12).optional(),  // Max 12 for CELPIP, validated dynamically
  spouseLanguageReading: z.number().min(0).max(12).optional(),  // Max 12 for CELPIP, validated dynamically
  spouseLanguageListening: z.number().min(0).max(12).optional(), // Max 12 for CELPIP, validated dynamically
  spouseCanadianExperience: z.number().min(0).max(5).optional(),

  // Additional Factors
  hasCanadianFamily: z.boolean(),
  hasProvincialNomination: z.boolean(),

  // French Language Bonus
  hasFrenchLanguageSkills: z.boolean()
});

// Age Points Calculator
export function calculateAgePoints(age) {
  const agePoints = {
    17: 0, 18: 90, 19: 95, 20: 100, 21: 105, 22: 110, 23: 112, 24: 114,
    25: 116, 26: 118, 27: 120, 28: 122, 29: 124, 30: 126, 31: 128,
    32: 130, 33: 132, 34: 134, 35: 135, 36: 131, 37: 127, 38: 123,
    39: 119, 40: 115, 41: 111, 42: 107, 43: 103, 44: 99
  };
  return agePoints[age] || 0;
}

// Education Points Calculator
export function calculateEducationPoints(educationLevel, hasSpouse) {
  const educationPoints = {
    1: hasSpouse ? 0 : 0,    // Less than secondary school
    2: hasSpouse ? 28 : 30,  // Secondary diploma
    3: hasSpouse ? 84 : 90,  // One-year degree/diploma
    4: hasSpouse ? 91 : 98,  // Two-year program
    5: hasSpouse ? 112 : 120, // Bachelor's degree or 3+ year program
    6: hasSpouse ? 119 : 128, // Two or more certificates/diplomas
    7: hasSpouse ? 126 : 135, // Master's degree
    8: hasSpouse ? 140 : 150  // Doctoral degree
  };
  return educationPoints[educationLevel] || 0;
}

// Get maximum score for each test type
export function getMaxScoreForTest(examType) {
  const maxScores = {
    1: 9,  // IELTS - General Training (0-9)
    2: 12, // CELPIP - General test (0-12)
    3: 9,  // TEF Canada (0-9)
    4: 9   // TCF Canada (0-9)
  };
  return maxScores[examType] || 9;
}

// Convert language test scores to CLB levels
export function convertToCLB(examType, speaking, writing, reading, listening) {
  const maxScore = getMaxScoreForTest(examType);

  // Test-specific CLB conversion tables
  if (examType === 2) { // CELPIP - General test
    return {
      speaking: convertCELPIPToCLB(speaking),
      writing: convertCELPIPToCLB(writing),
      reading: convertCELPIPToCLB(reading),
      listening: convertCELPIPToCLB(listening)
    };
  } else if (examType === 1) { // IELTS - General Training
    return {
      speaking: convertIELTSToCLB(speaking),
      writing: convertIELTSToCLB(writing),
      reading: convertIELTSToCLB(reading),
      listening: convertIELTSToCLB(listening)
    };
  } else {
    // Simplified conversion for other tests (TEF, TCF)
    return {
      speaking: Math.min(Math.floor(speaking), 10),
      writing: Math.min(Math.floor(writing), 10),
      reading: Math.min(Math.floor(reading), 10),
      listening: Math.min(Math.floor(listening), 10)
    };
  }
}

// CELPIP to CLB conversion table
function convertCELPIPToCLB(score) {
  if (score >= 12) return 10; // CELPIP 12 = CLB 10
  if (score >= 11) return 9;  // CELPIP 11 = CLB 9
  if (score >= 10) return 8;  // CELPIP 10 = CLB 8
  if (score >= 9) return 7;   // CELPIP 9 = CLB 7
  if (score >= 8) return 6;   // CELPIP 8 = CLB 6
  if (score >= 7) return 5;   // CELPIP 7 = CLB 5
  if (score >= 6) return 4;   // CELPIP 6 = CLB 4
  if (score >= 5) return 3;   // CELPIP 5 = CLB 3
  if (score >= 4) return 2;   // CELPIP 4 = CLB 2
  return Math.max(0, Math.floor(score));
}

// IELTS to CLB conversion table
function convertIELTSToCLB(score) {
  if (score >= 9.0) return 10; // IELTS 9.0 = CLB 10
  if (score >= 8.0) return 9;  // IELTS 8.0 = CLB 9
  if (score >= 7.0) return 8;  // IELTS 7.0 = CLB 8
  if (score >= 6.5) return 7;  // IELTS 6.5 = CLB 7
  if (score >= 6.0) return 6;  // IELTS 6.0 = CLB 6
  if (score >= 5.5) return 5;  // IELTS 5.5 = CLB 5
  if (score >= 5.0) return 4;  // IELTS 5.0 = CLB 4
  if (score >= 4.0) return 3;  // IELTS 4.0 = CLB 3
  return Math.max(0, Math.floor(score));
}

// Calculate First Language Points
export function calculateFirstLanguagePoints(clbScores, hasSpouse) {
  const { speaking, writing, reading, listening } = clbScores;

  let points = 0;

  // Speaking points
  if (speaking >= 7.0) points += hasSpouse ? 31 : 32;
  else if (speaking >= 6.0) points += hasSpouse ? 22 : 23;
  else if (speaking >= 5.0) points += hasSpouse ? 16 : 17;
  else if (speaking >= 4.0) points += hasSpouse ? 8 : 9;

  // Writing points
  if (writing >= 7.0) points += hasSpouse ? 31 : 32;
  else if (writing >= 6.0) points += hasSpouse ? 22 : 23;
  else if (writing >= 5.0) points += hasSpouse ? 16 : 17;
  else if (writing >= 4.0) points += hasSpouse ? 8 : 9;

  // Reading points
  if (reading >= 7.0) points += hasSpouse ? 31 : 32;
  else if (reading >= 6.0) points += hasSpouse ? 22 : 23;
  else if (reading >= 5.0) points += hasSpouse ? 16 : 17;
  else if (reading >= 4.0) points += hasSpouse ? 8 : 9;

  // Listening points
  if (listening >= 7.0) points += hasSpouse ? 31 : 32;
  else if (listening >= 6.0) points += hasSpouse ? 22 : 23;
  else if (listening >= 5.0) points += hasSpouse ? 16 : 17;
  else if (listening >= 4.0) points += hasSpouse ? 8 : 9;

  return points;
}

// Calculate Second Language Points
export function calculateSecondLanguagePoints(clbScores) {
  const { speaking, writing, reading, listening } = clbScores;

  let points = 0;

  // Maximum 6 points per skill, total max 24
  if (speaking >= 7.0) points += 6;
  else if (speaking >= 5.0) points += 3;
  else if (speaking >= 4.0) points += 1;

  if (writing >= 7.0) points += 6;
  else if (writing >= 5.0) points += 3;
  else if (writing >= 4.0) points += 1;

  if (reading >= 7.0) points += 6;
  else if (reading >= 5.0) points += 3;
  else if (reading >= 4.0) points += 1;

  if (listening >= 7.0) points += 6;
  else if (listening >= 5.0) points += 3;
  else if (listening >= 4.0) points += 1;

  return points;
}

// Canadian Work Experience Points
export function calculateCanadianExperiencePoints(years, hasSpouse) {
  const experiencePoints = {
    0: 0,
    1: hasSpouse ? 35 : 40,
    2: hasSpouse ? 63 : 70,
    3: hasSpouse ? 84 : 80,
    4: hasSpouse ? 105 : 100,
    5: hasSpouse ? 119 : 120
  };
  return experiencePoints[years] || 0;
}

// Spouse Education Points
export function calculateSpouseEducationPoints(educationLevel) {
  const spouseEducationPoints = {
    1: 0,    // Less than secondary school
    2: 2,    // Secondary diploma
    3: 6,    // One-year degree/diploma
    4: 7,    // Two-year program
    5: 8,    // Bachelor's degree
    6: 9,    // Two or more certificates/diplomas
    7: 10,   // Master's degree
    8: 10    // Doctoral degree
  };
  return spouseEducationPoints[educationLevel] || 0;
}

// Spouse Language Points
export function calculateSpouseLanguagePoints(clbScores) {
  const { speaking, writing, reading, listening } = clbScores;
  let points = 0;

  // 5 points per skill at CLB 4+
  if (speaking >= 4.0) points += 5;
  if (writing >= 4.0) points += 5;
  if (reading >= 4.0) points += 5;
  if (listening >= 4.0) points += 5;

  return points;
}

// Spouse Canadian Experience Points
export function calculateSpouseCanadianExperiencePoints(years) {
  const spouseExperiencePoints = {
    0: 0,
    1: 5,
    2: 7,
    3: 8,
    4: 9,
    5: 10
  };
  return spouseExperiencePoints[years] || 0;
}

// Skill Transferability Factors (Max 100 points)
export function calculateSkillTransferabilityFactors(data) {
  let points = 0;

  const firstLangCLB = convertToCLB(
    data.firstLanguageExam,
    data.firstLanguageSpeaking,
    data.firstLanguageWriting,
    data.firstLanguageReading,
    data.firstLanguageListening
  );

  const maxCLB = Math.max(firstLangCLB.speaking, firstLangCLB.writing, firstLangCLB.reading, firstLangCLB.listening);

  // Education + Language
  if (data.educationLevel >= 5 && maxCLB >= 7.0) {
    points += 50;
  } else if (data.educationLevel >= 4 && maxCLB >= 7.0) {
    points += 25;
  } else if (data.educationLevel >= 3 && maxCLB >= 7.0) {
    points += 13;
  }

  // Education + Canadian Experience
  if (data.educationLevel >= 5 && data.canadianExperience >= 1) {
    points += 50;
  } else if (data.educationLevel >= 4 && data.canadianExperience >= 1) {
    points += 25;
  } else if (data.educationLevel >= 3 && data.canadianExperience >= 1) {
    points += 13;
  }

  // Foreign Experience + Language
  if (data.foreignExperience >= 3 && maxCLB >= 7.0) {
    points += 50;
  } else if (data.foreignExperience >= 2 && maxCLB >= 7.0) {
    points += 25;
  } else if (data.foreignExperience >= 1 && maxCLB >= 7.0) {
    points += 13;
  }

  // Foreign Experience + Canadian Experience
  if (data.foreignExperience >= 3 && data.canadianExperience >= 2) {
    points += 50;
  } else if (data.foreignExperience >= 2 && data.canadianExperience >= 2) {
    points += 25;
  } else if (data.foreignExperience >= 1 && data.canadianExperience >= 1) {
    points += 13;
  }

  // Certificate of Qualification + Language (simplified)
  // This would need more complex logic for trade certificates

  return Math.min(points, 100); // Cap at 100 points
}

// Additional Points
export function calculateAdditionalPoints(data) {
  let points = 0;

  // Provincial Nomination (600 points)
  if (data.hasProvincialNomination) points += 600;

  // Note: Arranged Employment points (50-200 points) were eliminated in March 2025
  // No longer awarded for LMIA-supported job offers

  // Canadian Education
  if (data.canadianEducation === 1) points += 15;  // 1-2 years
  else if (data.canadianEducation === 3) points += 30; // 3+ years

  // Family in Canada
  if (data.hasCanadianFamily) points += 15;

  // French Language Skills
  if (data.hasFrenchLanguageSkills) {
    // Simplified - would need actual French test scores
    points += 25; // Basic French bonus
  }

  return points;
}

// Dynamic validation for language scores based on test type
function validateLanguageScores(data) {
  const errors = [];

  // Validate first language scores
  const firstLangMax = getMaxScoreForTest(data.firstLanguageExam);
  if (data.firstLanguageSpeaking > firstLangMax) {
    errors.push(`First language speaking score cannot exceed ${firstLangMax} for selected test`);
  }
  if (data.firstLanguageWriting > firstLangMax) {
    errors.push(`First language writing score cannot exceed ${firstLangMax} for selected test`);
  }
  if (data.firstLanguageReading > firstLangMax) {
    errors.push(`First language reading score cannot exceed ${firstLangMax} for selected test`);
  }
  if (data.firstLanguageListening > firstLangMax) {
    errors.push(`First language listening score cannot exceed ${firstLangMax} for selected test`);
  }

  // Validate second language scores if provided
  if (data.hasSecondLanguage && data.secondLanguageExam) {
    const secondLangMax = getMaxScoreForTest(data.secondLanguageExam);
    if (data.secondLanguageSpeaking > secondLangMax) {
      errors.push(`Second language speaking score cannot exceed ${secondLangMax} for selected test`);
    }
    if (data.secondLanguageWriting > secondLangMax) {
      errors.push(`Second language writing score cannot exceed ${secondLangMax} for selected test`);
    }
    if (data.secondLanguageReading > secondLangMax) {
      errors.push(`Second language reading score cannot exceed ${secondLangMax} for selected test`);
    }
    if (data.secondLanguageListening > secondLangMax) {
      errors.push(`Second language listening score cannot exceed ${secondLangMax} for selected test`);
    }
  }

  return errors;
}

// Main CRS Calculation Function
export function calculateCRS(data) {
  // Validate input data
  const validData = CRSInputSchema.parse(data);

  // Perform dynamic validation for language scores
  const validationErrors = validateLanguageScores(validData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join('; '));
  }

  let totalScore = 0;
  let breakdown = {
    sectionA: { title: "Core Human Capital Factors", points: 0, details: {} },
    sectionB: { title: "Spouse/Common-law Partner Factors", points: 0, details: {} },
    sectionC: { title: "Skill Transferability Factors", points: 0, details: {} },
    sectionD: { title: "Additional Points", points: 0, details: {} }
  };

  // Section A: Core Human Capital Factors
  const agePoints = calculateAgePoints(validData.age);
  const educationPoints = calculateEducationPoints(validData.educationLevel, validData.hasSpouse);

  const firstLangCLB = convertToCLB(
    validData.firstLanguageExam,
    validData.firstLanguageSpeaking,
    validData.firstLanguageWriting,
    validData.firstLanguageReading,
    validData.firstLanguageListening
  );
  const firstLanguagePoints = calculateFirstLanguagePoints(firstLangCLB, validData.hasSpouse);

  let secondLanguagePoints = 0;
  if (validData.hasSecondLanguage && validData.secondLanguageExam) {
    const secondLangCLB = convertToCLB(
      validData.secondLanguageExam,
      validData.secondLanguageSpeaking || 0,
      validData.secondLanguageWriting || 0,
      validData.secondLanguageReading || 0,
      validData.secondLanguageListening || 0
    );
    secondLanguagePoints = calculateSecondLanguagePoints(secondLangCLB);
  }

  const canadianExperiencePoints = calculateCanadianExperiencePoints(validData.canadianExperience, validData.hasSpouse);

  breakdown.sectionA.points = agePoints + educationPoints + firstLanguagePoints + secondLanguagePoints + canadianExperiencePoints;
  breakdown.sectionA.details = {
    age: agePoints,
    education: educationPoints,
    firstLanguage: firstLanguagePoints,
    secondLanguage: secondLanguagePoints,
    canadianExperience: canadianExperiencePoints
  };

  // Section B: Spouse Factors (if applicable)
  if (validData.hasSpouse) {
    const spouseEducationPoints = calculateSpouseEducationPoints(validData.spouseEducationLevel || 1);

    let spouseLanguagePoints = 0;
    if (validData.spouseLanguageSpeaking !== undefined) {
      const spouseCLB = convertToCLB(
        1, // Assume English
        validData.spouseLanguageSpeaking || 0,
        validData.spouseLanguageWriting || 0,
        validData.spouseLanguageReading || 0,
        validData.spouseLanguageListening || 0
      );
      spouseLanguagePoints = calculateSpouseLanguagePoints(spouseCLB);
    }

    const spouseExperiencePoints = calculateSpouseCanadianExperiencePoints(validData.spouseCanadianExperience || 0);

    breakdown.sectionB.points = spouseEducationPoints + spouseLanguagePoints + spouseExperiencePoints;
    breakdown.sectionB.details = {
      education: spouseEducationPoints,
      language: spouseLanguagePoints,
      experience: spouseExperiencePoints
    };
  }

  // Section C: Skill Transferability Factors
  const transferabilityPoints = calculateSkillTransferabilityFactors(validData);
  breakdown.sectionC.points = transferabilityPoints;

  // Section D: Additional Points
  const additionalPoints = calculateAdditionalPoints(validData);
  breakdown.sectionD.points = additionalPoints;
  breakdown.sectionD.details = {
    provincialNomination: validData.hasProvincialNomination ? 600 : 0,
    arrangedEmployment: 0, // Arranged employment points eliminated in March 2025
    canadianEducation: validData.canadianEducation === 1 ? 15 : (validData.canadianEducation === 3 ? 30 : 0),
    canadianFamily: validData.hasCanadianFamily ? 15 : 0,
    frenchSkills: validData.hasFrenchLanguageSkills ? 25 : 0
  };

  // Calculate total score
  totalScore = breakdown.sectionA.points + breakdown.sectionB.points + breakdown.sectionC.points + breakdown.sectionD.points;

  return {
    totalScore,
    breakdown,
    validData,
    clbScores: {
      firstLanguage: firstLangCLB,
      secondLanguage: validData.hasSecondLanguage ? convertToCLB(
        validData.secondLanguageExam || 1,
        validData.secondLanguageSpeaking || 0,
        validData.secondLanguageWriting || 0,
        validData.secondLanguageReading || 0,
        validData.secondLanguageListening || 0
      ) : null
    }
  };
}