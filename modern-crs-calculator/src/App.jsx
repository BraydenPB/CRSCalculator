import { h } from 'preact'
import { useState } from 'preact/hooks'
import { calculateCRS, getMaxScoreForTest } from './crsLogic.js'

// Language score dropdown options based on new-scores-data.txt
const LANGUAGE_SCORE_OPTIONS = {
  // CELPIP-G - Integer scores (All Skills: Speaking, Listening, Reading, Writing)
  celpip: [
    { value: '12', label: '12', clb: 12 },
    { value: '11', label: '11', clb: 11 },
    { value: '10', label: '10', clb: 10 },
    { value: '9', label: '9', clb: 9 },
    { value: '8', label: '8', clb: 8 },
    { value: '7', label: '7', clb: 7 },
    { value: '6', label: '6', clb: 6 },
    { value: '5', label: '5', clb: 5 },
    { value: '4', label: '4', clb: 4 },
    { value: '3', label: '3', clb: 3 },
    { value: '2', label: '2', clb: 2 },
    { value: '1', label: '1', clb: 1 },
    { value: 'M', label: 'M', clb: 0 }
  ],

  // IELTS and PTE Core - Same ranges for both tests
  ielts_pte: [
    { value: '7.5-9.0', label: '7.5 – 9.0', clb: 10 },
    { value: '7.0', label: '7.0', clb: 9 },
    { value: '6.5', label: '6.5', clb: 8 },
    { value: '6.0', label: '6.0', clb: 7 },
    { value: '5.5', label: '5.5', clb: 6 },
    { value: '5.0', label: '5.0', clb: 5 },
    { value: '4.0-4.5', label: '4.0 – 4.5', clb: 4 },
    { value: '0-3.5', label: '0 – 3.5', clb: 0 }
  ],

  // TEF Canada Score Ranges
  tef: {
    speaking_writing_reading: [
      { value: '393-450', label: '393–450', clb: 10 },
      { value: '371-392', label: '371–392', clb: 9 },
      { value: '349-370', label: '349–370', clb: 8 },
      { value: '310-348', label: '310–348', clb: 7 },
      { value: '271-309', label: '271–309', clb: 6 },
      { value: '226-270', label: '226–270', clb: 5 },
      { value: '181-225', label: '181–225', clb: 4 },
      { value: '0-180', label: '0–180', clb: 0 }
    ],
    listening: [
      { value: '316-360', label: '316–360', clb: 10 },
      { value: '298-315', label: '298–315', clb: 9 },
      { value: '280-297', label: '280–297', clb: 8 },
      { value: '249-279', label: '249–279', clb: 7 },
      { value: '217-248', label: '217–248', clb: 6 },
      { value: '181-216', label: '181–216', clb: 5 },
      { value: '145-180', label: '145–180', clb: 4 },
      { value: '0-144', label: '0–144', clb: 0 }
    ]
  },

  // TCF Canada Score Ranges
  tcf: {
    speaking_writing: [
      { value: '16-20', label: '16–20', clb: 10 },
      { value: '14-15', label: '14–15', clb: 9 },
      { value: '12-13', label: '12–13', clb: 8 },
      { value: '10-11', label: '10–11', clb: 7 },
      { value: '7-9', label: '7–9', clb: 6 },
      { value: '6-4', label: '6–4', clb: 5 },
      { value: '0-3', label: '0–3', clb: 0 }
    ],
    listening: [
      { value: '549-699', label: '549–699', clb: 10 },
      { value: '523-548', label: '523–548', clb: 9 },
      { value: '503-522', label: '503–522', clb: 8 },
      { value: '458-502', label: '458–502', clb: 7 },
      { value: '398-457', label: '398–457', clb: 6 },
      { value: '369-397', label: '369–397', clb: 5 },
      { value: '331-368', label: '331–368', clb: 4 },
      { value: '0-330', label: '0–330', clb: 0 }
    ],
    reading: [
      { value: '549-699', label: '549–699', clb: 10 },
      { value: '524-548', label: '524–548', clb: 9 },
      { value: '499-523', label: '499–523', clb: 8 },
      { value: '453-498', label: '453–498', clb: 7 },
      { value: '406-452', label: '406–452', clb: 6 },
      { value: '375-405', label: '375–405', clb: 5 },
      { value: '342-374', label: '342–374', clb: 4 },
      { value: '0-341', label: '0–341', clb: 0 }
    ]
  }
}

// Helper function to get dropdown options for a specific test type and skill
function getLanguageScoreOptions(examType, skill) {
  if (examType === 1) {
    // IELTS
    return LANGUAGE_SCORE_OPTIONS.ielts_pte
  } else if (examType === 2) {
    // CELPIP-G
    return LANGUAGE_SCORE_OPTIONS.celpip
  } else if (examType === 5) {
    // PTE Core
    return LANGUAGE_SCORE_OPTIONS.ielts_pte
  } else if (examType === 3) {
    // TEF Canada
    if (skill === 'listening') {
      return LANGUAGE_SCORE_OPTIONS.tef.listening
    } else {
      return LANGUAGE_SCORE_OPTIONS.tef.speaking_writing_reading
    }
  } else if (examType === 4) {
    // TCF Canada
    if (skill === 'listening') {
      return LANGUAGE_SCORE_OPTIONS.tcf.listening
    } else if (skill === 'reading') {
      return LANGUAGE_SCORE_OPTIONS.tcf.reading
    } else {
      return LANGUAGE_SCORE_OPTIONS.tcf.speaking_writing
    }
  }
  return LANGUAGE_SCORE_OPTIONS.ielts_pte // default
}

// Helper function to get CLB level from dropdown value
function getCLBFromDropdownValue(examType, skill, value) {
  const options = getLanguageScoreOptions(examType, skill)
  const option = options.find(opt => opt.value === value)
  return option ? option.clb : 0
}

// Helper function to get test scale description
function getTestScale(examType) {
  switch (examType) {
    case 1: return 'IELTS: Dropdown selection'
    case 2: return 'CELPIP-G: Dropdown selection'
    case 5: return 'PTE Core: Dropdown selection'
    case 3: return 'TEF Canada: Dropdown selection'
    case 4: return 'TCF Canada: Dropdown selection'
    default: return 'Select test type'
  }
}

// Language Score Dropdown Component
const LanguageScoreDropdown = ({ examType, skill, value, onChange, label }) => {
  const options = getLanguageScoreOptions(examType, skill)

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select
        className="select"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select score</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <small className="text-gray-500">
        {getTestScale(examType)}
      </small>
    </div>
  )
}

// Form Components
const PersonalInfoForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Personal Information</h3>

    <div className="form-group">
      <label className="form-label">Age</label>
      <input
        type="number"
        min="17"
        max="45"
        className="input"
        value={data.age || ''}
        onChange={e => onChange('age', parseInt(e.target.value) || 0)}
        required
      />
      <small className="text-gray-500">Age must be between 17-45 years</small>
    </div>

    <div className="form-group">
      <label className="form-label">Marital Status</label>
      <select
        className="select"
        value={data.maritalStatus || ''}
        onChange={e => onChange('maritalStatus', parseInt(e.target.value))}
        required
      >
        <option value="">Select marital status</option>
        <option value="1">Annulled Marriage</option>
        <option value="2">Common-Law</option>
        <option value="3">Divorced / Separated</option>
        <option value="4">Legally Separated</option>
        <option value="5">Married</option>
        <option value="6">Never Married / Single</option>
        <option value="7">Widowed</option>
      </select>
    </div>

    {(data.maritalStatus === 2 || data.maritalStatus === 5) && (
      <>
        <div className="form-group">
          <label className="form-label">
            Is your spouse or common-law partner a citizen or permanent resident of Canada?
          </label>
          <select
            className="select"
            value={data.spouseIsCanadianCitizen !== undefined ? (data.spouseIsCanadianCitizen ? 'true' : 'false') : ''}
            onChange={e => onChange('spouseIsCanadianCitizen', e.target.value === 'true')}
          >
            <option value="">Select...</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Will your spouse or common-law partner come with you to Canada?
          </label>
          <select
            className="select"
            value={data.spouseAccompanying !== undefined ? (data.spouseAccompanying ? 'true' : 'false') : ''}
            onChange={e => onChange('spouseAccompanying', e.target.value === 'true')}
          >
            <option value="">Select...</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </>
    )}
  </div>
)

const EducationForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Education</h3>

    <div className="form-group">
      <label className="form-label">Your Education Level</label>
      <select
        className="select"
        value={data.educationLevel || ''}
        onChange={e => onChange('educationLevel', parseInt(e.target.value))}
        required
      >
        <option value="">Select education level</option>
        <option value="1">Less than secondary school</option>
        <option value="2">Secondary diploma (high school graduation)</option>
        <option value="3">One-year degree, diploma or certificate</option>
        <option value="4">
          Two-year program at university, college, trade or technical school
        </option>
        <option value="5">Bachelor's degree OR three or more year program</option>
        <option value="6">Two or more certificates, diplomas, or degrees</option>
        <option value="7">Master's degree, OR professional degree</option>
        <option value="8">Doctoral level university degree (Ph.D.)</option>
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Canadian Education</label>
      <select
        className="select"
        value={data.canadianEducation || ''}
        onChange={e => onChange('canadianEducation', parseInt(e.target.value))}
      >
        <option value="-1">No Canadian education</option>
        <option value="0">Secondary (high school) or less</option>
        <option value="1">1- or 2-year diploma or certificate</option>
        <option value="3">3-year or longer degree, diploma or certificate</option>
      </select>
    </div>

    {(data.maritalStatus === 2 || data.maritalStatus === 5) && (
      <div className="form-group">
        <label className="form-label">Spouse Education Level</label>
        <select
          className="select"
          value={data.spouseEducationLevel || ''}
          onChange={e => onChange('spouseEducationLevel', parseInt(e.target.value))}
        >
          <option value="">Select education level</option>
          <option value="1">Less than secondary school</option>
          <option value="2">Secondary diploma (high school graduation)</option>
          <option value="3">One-year degree, diploma or certificate</option>
          <option value="4">
            Two-year program at university, college, trade or technical school
          </option>
          <option value="5">Bachelor's degree OR three or more year program</option>
          <option value="6">Two or more certificates, diplomas, or degrees</option>
          <option value="7">Master's degree, OR professional degree</option>
          <option value="8">Doctoral level university degree (Ph.D.)</option>
        </select>
      </div>
    )}
  </div>
)

const LanguageForm = ({ data, onChange }) => {
  // Calculate CLB levels from dropdown values
  const getFirstLangCLB = () => {
    if (!data.firstLanguageExam) return { speaking: 0, writing: 0, reading: 0, listening: 0 }

    return {
      speaking: getCLBFromDropdownValue(data.firstLanguageExam, 'speaking', data.firstLanguageSpeaking),
      writing: getCLBFromDropdownValue(data.firstLanguageExam, 'writing', data.firstLanguageWriting),
      reading: getCLBFromDropdownValue(data.firstLanguageExam, 'reading', data.firstLanguageReading),
      listening: getCLBFromDropdownValue(data.firstLanguageExam, 'listening', data.firstLanguageListening),
    }
  }

  const firstLangCLB = getFirstLangCLB()

  return (
    <div className="form-section">
      <h3 className="section-title">Language Skills</h3>

      <div className="calculator-grid">
        <div>
          <h4 className="font-medium mb-4">First Language</h4>

          <div className="form-group">
            <label className="form-label">Language Test</label>
            <select
              className="select"
              value={data.firstLanguageExam || ''}
              onChange={e => onChange('firstLanguageExam', parseInt(e.target.value))}
            >
              <option value="">Select test</option>
              <option value="1">IELTS - General Training</option>
              <option value="2">CELPIP - General test</option>
              <option value="5">PTE Core</option>
              <option value="3">TEF Canada</option>
              <option value="4">TCF Canada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <LanguageScoreDropdown
              examType={data.firstLanguageExam || 1}
              skill="speaking"
              value={data.firstLanguageSpeaking}
              onChange={value => onChange('firstLanguageSpeaking', value)}
              label="Speaking"
            />
            <LanguageScoreDropdown
              examType={data.firstLanguageExam || 1}
              skill="writing"
              value={data.firstLanguageWriting}
              onChange={value => onChange('firstLanguageWriting', value)}
              label="Writing"
            />
            <LanguageScoreDropdown
              examType={data.firstLanguageExam || 1}
              skill="reading"
              value={data.firstLanguageReading}
              onChange={value => onChange('firstLanguageReading', value)}
              label="Reading"
            />
            <LanguageScoreDropdown
              examType={data.firstLanguageExam || 1}
              skill="listening"
              value={data.firstLanguageListening}
              onChange={value => onChange('firstLanguageListening', value)}
              label="Listening"
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <strong>CLB Levels:</strong> Speaking: {firstLangCLB.speaking}, Writing:{' '}
            {firstLangCLB.writing}, Reading: {firstLangCLB.reading}, Listening:{' '}
            {firstLangCLB.listening}
          </div>
        </div>

        {data.hasSecondLanguage && (
          <div>
            <h4 className="font-medium mb-4">Second Language</h4>

            <div className="form-group">
              <label className="form-label">Language Test</label>
              <select
                className="select"
                value={data.secondLanguageExam || ''}
                onChange={e => onChange('secondLanguageExam', parseInt(e.target.value))}
              >
                <option value="">Select test</option>
                <option value="1">IELTS - General Training</option>
                <option value="2">CELPIP - General test</option>
                <option value="5">PTE Core</option>
                <option value="3">TEF Canada</option>
                <option value="4">TCF Canada</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <LanguageScoreDropdown
                examType={data.secondLanguageExam || 1}
                skill="speaking"
                value={data.secondLanguageSpeaking}
                onChange={value => onChange('secondLanguageSpeaking', value)}
                label="Speaking"
              />
              <LanguageScoreDropdown
                examType={data.secondLanguageExam || 1}
                skill="writing"
                value={data.secondLanguageWriting}
                onChange={value => onChange('secondLanguageWriting', value)}
                label="Writing"
              />
              <LanguageScoreDropdown
                examType={data.secondLanguageExam || 1}
                skill="reading"
                value={data.secondLanguageReading}
                onChange={value => onChange('secondLanguageReading', value)}
                label="Reading"
              />
              <LanguageScoreDropdown
                examType={data.secondLanguageExam || 1}
                skill="listening"
                value={data.secondLanguageListening}
                onChange={value => onChange('secondLanguageListening', value)}
                label="Listening"
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasSecondLanguage || false}
            onChange={e => onChange('hasSecondLanguage', e.target.checked)}
          />{' '}
          I have second language test results
        </label>
      </div>
    </div>
  )
}

// Spouse Language Form Component
const SpouseLanguageForm = ({ data, onChange }) => {
  const hasSpouse = data.maritalStatus === 2 || data.maritalStatus === 5 // Common-Law or Married
  const spouseAccompanying = data.spouseAccompanying

  if (!hasSpouse || !spouseAccompanying) return null

  return (
    <div className="form-section">
      <h3 className="section-title">Spouse/Common-law Partner Language Skills</h3>

      <div className="calculator-grid">
        <div>
          <h4 className="font-medium mb-4">Spouse Language Test Results</h4>

          <div className="form-group">
            <label className="form-label">Language Test</label>
            <select
              className="select"
              value={data.spouseLanguageExam || ''}
              onChange={e => onChange('spouseLanguageExam', parseInt(e.target.value))}
            >
              <option value="">Select test</option>
              <option value="1">IELTS - General Training</option>
              <option value="2">CELPIP - General test</option>
              <option value="5">PTE Core</option>
              <option value="3">TEF Canada</option>
              <option value="4">TCF Canada</option>
              <option value="0">Not applicable</option>
            </select>
          </div>

          {data.spouseLanguageExam && data.spouseLanguageExam !== '0' && (
            <div className="grid grid-cols-2 gap-4">
              <LanguageScoreDropdown
                examType={data.spouseLanguageExam}
                skill="speaking"
                value={data.spouseLanguageSpeaking}
                onChange={value => onChange('spouseLanguageSpeaking', value)}
                label="Speaking"
              />
              <LanguageScoreDropdown
                examType={data.spouseLanguageExam}
                skill="writing"
                value={data.spouseLanguageWriting}
                onChange={value => onChange('spouseLanguageWriting', value)}
                label="Writing"
              />
              <LanguageScoreDropdown
                examType={data.spouseLanguageExam}
                skill="reading"
                value={data.spouseLanguageReading}
                onChange={value => onChange('spouseLanguageReading', value)}
                label="Reading"
              />
              <LanguageScoreDropdown
                examType={data.spouseLanguageExam}
                skill="listening"
                value={data.spouseLanguageListening}
                onChange={value => onChange('spouseLanguageListening', value)}
                label="Listening"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ExperienceForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Work Experience</h3>

    <div className="calculator-grid">
      <div className="form-group">
        <label className="form-label">Canadian Work Experience</label>
        <select
          className="select"
          value={data.canadianExperience || ''}
          onChange={e => onChange('canadianExperience', parseInt(e.target.value))}
        >
          <option value="0">None or less than a year</option>
          <option value="1">1 year</option>
          <option value="2">2 years</option>
          <option value="3">3 years</option>
          <option value="4">4 years</option>
          <option value="5">5 years or more</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Foreign Work Experience (outside Canada)</label>
        <select
          className="select"
          value={data.foreignExperience || ''}
          onChange={e => onChange('foreignExperience', parseInt(e.target.value))}
        >
          <option value="0">None or less than a year</option>
          <option value="1">1 year</option>
          <option value="2">2 years</option>
          <option value="3">3 years or more</option>
        </select>
      </div>

      {(data.maritalStatus === 2 || data.maritalStatus === 5) && (
        <div className="form-group">
          <label className="form-label">Spouse Canadian Work Experience</label>
          <select
            className="select"
            value={data.spouseCanadianExperience || ''}
            onChange={e => onChange('spouseCanadianExperience', parseInt(e.target.value))}
          >
            <option value="0">None or less than a year</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years or more</option>
          </select>
        </div>
      )}
    </div>
  </div>
)

const AdditionalFactorsForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Additional Factors</h3>

    <div className="space-y-4">
      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasCanadianFamily || false}
            onChange={e => onChange('hasCanadianFamily', e.target.checked)}
          />{' '}
          I have a brother or sister living in Canada who is a citizen or permanent resident
        </label>
      </div>

      <div className="form-group">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Arranged employment points (50-200) were eliminated from CRS
            scoring as of March 25, 2025. Job offers with LMIA no longer provide additional points.
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasProvincialNomination || false}
            onChange={e => onChange('hasProvincialNomination', e.target.checked)}
          />{' '}
          I have a provincial or territorial nomination
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasFrenchLanguageSkills || false}
            onChange={e => onChange('hasFrenchLanguageSkills', e.target.checked)}
          />{' '}
          I have French language skills (bonus points)
        </label>
      </div>
    </div>
  </div>
)

const ResultsDisplay = ({ result }) => {
  if (!result) return null

  const { totalScore, breakdown } = result

  const getScoreColor = score => {
    if (score >= 500) return 'text-green-600'
    if (score >= 400) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="result-card">
      <h2 className="text-2xl font-bold text-center mb-6">Your CRS Score</h2>

      <div className="text-center mb-8">
        <div className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>{totalScore}</div>
        <div className="text-gray-600 mt-2">points out of 1200+</div>
      </div>

      <div className="space-y-4">
        <div className="score-display">
          <h3 className="font-semibold text-lg mb-3">Section A: Core Human Capital Factors</h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {breakdown.sectionA.points} points
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>Age: {breakdown.sectionA.details.age} pts</div>
            <div>Education: {breakdown.sectionA.details.education} pts</div>
            <div>First Language: {breakdown.sectionA.details.firstLanguage} pts</div>
            <div>Second Language: {breakdown.sectionA.details.secondLanguage} pts</div>
            <div>Canadian Experience: {breakdown.sectionA.details.canadianExperience} pts</div>
          </div>
        </div>

        {breakdown.sectionB.points > 0 && (
          <div className="score-display">
            <h3 className="font-semibold text-lg mb-3">
              Section B: Spouse/Common-law Partner Factors
            </h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {breakdown.sectionB.points} points
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>Education: {breakdown.sectionB.details.education} pts</div>
              <div>Language: {breakdown.sectionB.details.language} pts</div>
              <div>Experience: {breakdown.sectionB.details.experience} pts</div>
            </div>
          </div>
        )}

        <div className="score-display">
          <h3 className="font-semibold text-lg mb-3">Section C: Skill Transferability Factors</h3>
          <div className="text-2xl font-bold text-blue-600">{breakdown.sectionC.points} points</div>
          <div className="text-sm text-gray-600 mt-2">
            Combination of education, language, and experience factors
          </div>
        </div>

        <div className="score-display">
          <h3 className="font-semibold text-lg mb-3">Section D: Additional Points</h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {breakdown.sectionD.points} points
          </div>
          <div className="space-y-1 text-sm">
            {breakdown.sectionD.details.provincialNomination > 0 && (
              <div>
                Provincial Nomination: {breakdown.sectionD.details.provincialNomination} pts
              </div>
            )}
            {breakdown.sectionD.details.arrangedEmployment > 0 && (
              <div>Arranged Employment: {breakdown.sectionD.details.arrangedEmployment} pts</div>
            )}
            {breakdown.sectionD.details.canadianEducation > 0 && (
              <div>Canadian Education: {breakdown.sectionD.details.canadianEducation} pts</div>
            )}
            {breakdown.sectionD.details.canadianFamily > 0 && (
              <div>Family in Canada: {breakdown.sectionD.details.canadianFamily} pts</div>
            )}
            {breakdown.sectionD.details.frenchSkills > 0 && (
              <div>French Language Skills: {breakdown.sectionD.details.frenchSkills} pts</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> This calculator provides an estimate of your CRS score. Actual
          scores may vary based on official IRCC calculations and policy changes.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [formData, setFormData] = useState({
    // Personal
    age: 25,
    maritalStatus: 6, // Never Married / Single
    spouseIsCanadianCitizen: false,
    spouseAccompanying: false,

    // Education
    educationLevel: 5, // Bachelor's degree
    canadianEducation: -1, // No Canadian education

    // First Language
    firstLanguageExam: 1, // IELTS
    firstLanguageSpeaking: '7.0', // Dropdown value
    firstLanguageWriting: '7.0', // Dropdown value
    firstLanguageReading: '7.0', // Dropdown value
    firstLanguageListening: '7.5-9.0', // Dropdown value (higher CLB)

    // Second Language
    hasSecondLanguage: false,

    // Spouse Language
    spouseLanguageExam: 0, // Not applicable
    spouseLanguageSpeaking: '',
    spouseLanguageWriting: '',
    spouseLanguageReading: '',
    spouseLanguageListening: '',

    // Experience
    canadianExperience: 0,
    foreignExperience: 1,

    // Additional
    hasCanadianFamily: false,
    hasProvincialNomination: false,
    hasFrenchLanguageSkills: false,
  })

  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const calculateScore = () => {
    try {
      const calculationResult = calculateCRS(formData)
      setResult(calculationResult)
      setErrors({})
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors({ general: error.message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Modern CRS Calculator</h1>
          <p className="text-lg text-gray-600">
            Calculate your Comprehensive Ranking System score for Canadian Express Entry
          </p>
        </header>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errors.general}
          </div>
        )}

        <div className="space-y-6">
          <PersonalInfoForm data={formData} onChange={handleInputChange} />
          <EducationForm data={formData} onChange={handleInputChange} />
          <LanguageForm data={formData} onChange={handleInputChange} />
          <SpouseLanguageForm data={formData} onChange={handleInputChange} />
          <ExperienceForm data={formData} onChange={handleInputChange} />
          <AdditionalFactorsForm data={formData} onChange={handleInputChange} />

          <div className="text-center">
            <button onClick={calculateScore} className="btn-primary text-lg px-8 py-4">
              Calculate My CRS Score
            </button>
          </div>

          {result && <ResultsDisplay result={result} />}
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p className="text-sm">
            © 2025 Modern CRS Calculator. This tool is for informational purposes only and does not
            constitute immigration advice.
          </p>
        </footer>
      </div>
    </div>
  )
}
