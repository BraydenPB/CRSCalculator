import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { calculateCRS, getMaxScoreForTest } from './crsLogic.js'
import ThemeToggle from './components/ThemeToggle.jsx'

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

// Modern Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    e.preventDefault()
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex])
        } else {
          setIsOpen(!isOpen)
        }
        break
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => (prev + 1) % options.length)
        }
        break
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => prev <= 0 ? options.length - 1 : prev - 1)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <div
        className={`custom-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={value ? 'text-gray-900 dark:text-gray-100' : 'custom-dropdown-placeholder'}>
          {displayValue}
        </span>
        <svg
          className={`custom-dropdown-arrow ${isOpen ? 'open' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className={`custom-dropdown-menu ${isOpen ? 'open' : ''}`} role="listbox">
        {options.map((option, index) => (
          <div
            key={option.value}
            className={`custom-dropdown-option ${
              option.value === value ? 'selected' : ''
            } ${highlightedIndex === index ? 'highlighted' : ''}`}
            onClick={() => handleSelect(option)}
            role="option"
            aria-selected={option.value === value}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// Language Score Dropdown Component
const LanguageScoreDropdown = ({ examType, skill, value, onChange, label }) => {
  const options = getLanguageScoreOptions(examType, skill)
  const dropdownOptions = [
    { value: '', label: 'Select score...' },
    ...options.map(option => ({
      value: option.value,
      label: `${option.label}${option.clb > 0 ? ` (CLB ${option.clb})` : ''}`
    }))
  ]

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="form-group fade-in">
      <label className="form-label flex items-center gap-2">
        {label}
        <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          CLB
        </span>
      </label>
      <div className="relative">
        <CustomDropdown
          options={dropdownOptions}
          value={value || ''}
          onChange={onChange}
          placeholder="Select score..."
        />
        {value && selectedOption && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              selectedOption.clb >= 9
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : selectedOption.clb >= 7
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              CLB {selectedOption.clb}
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <small className="text-gray-500 text-sm">
          {getTestScale(examType)}
        </small>
        {value && selectedOption?.clb >= 7 && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            ✓ Eligible for points
          </span>
        )}
      </div>
    </div>
  )
}

// Form Components
const PersonalInfoForm = ({ data, onChange }) => (
  <div className="form-section fade-in">
    <h3 className="section-title">Personal Information</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          Age
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            17-45 years
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="17"
            max="45"
            className="input text-lg font-semibold"
            value={data.age || ''}
            onChange={e => onChange('age', parseInt(e.target.value) || 0)}
            required
            placeholder="Enter your age"
          />
          {data.age && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                data.age >= 20 && data.age <= 29
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : data.age >= 18 && data.age <= 35
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {data.age >= 20 && data.age <= 29 ? 'Max points' :
                 data.age >= 18 && data.age <= 35 ? 'Good points' : 'Lower points'}
              </span>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <small className="text-gray-500">Age must be between 17-45 years</small>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Marital Status</label>
        <div className="relative">
          <CustomDropdown
            options={[
              { value: '', label: 'Select marital status...' },
              { value: '6', label: 'Never Married / Single' },
              { value: '5', label: 'Married' },
              { value: '2', label: 'Common-Law' },
              { value: '3', label: 'Divorced / Separated' },
              { value: '4', label: 'Legally Separated' },
              { value: '1', label: 'Annulled Marriage' },
              { value: '7', label: 'Widowed' }
            ]}
            value={data.maritalStatus?.toString() || ''}
            onChange={(value) => onChange('maritalStatus', value ? parseInt(value) : '')}
            placeholder="Select marital status..."
          />
        </div>
        {data.maritalStatus && (
          <div className="mt-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <small className="text-green-600 font-medium">Status selected</small>
          </div>
        )}
      </div>
    </div>

    {(data.maritalStatus === 2 || data.maritalStatus === 5) && (
      <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h4 className="font-semibold text-blue-900">Spouse/Partner Information</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">
              Is your spouse or common-law partner a citizen or permanent resident of Canada?
            </label>
            <CustomDropdown
              options={[
                { value: '', label: 'Select status...' },
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Yes' }
              ]}
              value={data.spouseIsCanadianCitizen !== undefined ? (data.spouseIsCanadianCitizen ? 'true' : 'false') : ''}
              onChange={(value) => onChange('spouseIsCanadianCitizen', value === 'true')}
              placeholder="Select status..."
            />
            {data.spouseIsCanadianCitizen === true && (
              <div className="mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <small className="text-green-600 font-medium">Additional points may apply</small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Will your spouse or common-law partner come with you to Canada?
            </label>
            <CustomDropdown
              options={[
                { value: '', label: 'Select option...' },
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Yes' }
              ]}
              value={data.spouseAccompanying !== undefined ? (data.spouseAccompanying ? 'true' : 'false') : ''}
              onChange={(value) => onChange('spouseAccompanying', value === 'true')}
              placeholder="Select option..."
            />
            {data.spouseAccompanying === true && (
              <div className="mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <small className="text-blue-600 font-medium">Spouse factors will be considered</small>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
)

const EducationForm = ({ data, onChange }) => (
  <div className="form-section fade-in">
    <h3 className="section-title">Education</h3>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            Your Education Level
            <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Required
            </span>
          </label>
          <div className="relative">
            <CustomDropdown
              options={[
                { value: '', label: 'Select education level...' },
                { value: '1', label: 'Less than secondary school' },
                { value: '2', label: 'Secondary diploma (high school graduation)' },
                { value: '3', label: 'One-year degree, diploma or certificate' },
                { value: '4', label: 'Two-year program at university, college, trade or technical school' },
                { value: '5', label: 'Bachelor\'s degree OR three or more year program' },
                { value: '6', label: 'Two or more certificates, diplomas, or degrees' },
                { value: '7', label: 'Master\'s degree, OR professional degree' },
                { value: '8', label: 'Doctoral level university degree (Ph.D.)' }
              ]}
              value={data.educationLevel?.toString() || ''}
              onChange={(value) => onChange('educationLevel', value ? parseInt(value) : '')}
              placeholder="Select education level..."
            />
            {data.educationLevel && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  parseInt(data.educationLevel) >= 7
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : parseInt(data.educationLevel) >= 5
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : parseInt(data.educationLevel) >= 3
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {parseInt(data.educationLevel) >= 7 ? 'High points' :
                   parseInt(data.educationLevel) >= 5 ? 'Good points' :
                   parseInt(data.educationLevel) >= 3 ? 'Moderate points' : 'Basic points'}
                </span>
              </div>
            )}
          </div>
          {data.educationLevel && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-800 font-medium">
                  Education level selected: {parseInt(data.educationLevel) >= 5 ? 'Eligible for skilled worker points' : 'Consider upgrading education'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            Canadian Education
            <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Bonus Points
            </span>
          </label>
          <CustomDropdown
            options={[
              { value: '-1', label: 'No Canadian education' },
              { value: '0', label: 'Secondary (high school) or less' },
              { value: '1', label: '1- or 2-year diploma or certificate' },
              { value: '3', label: '3-year or longer degree, diploma or certificate' }
            ]}
            value={data.canadianEducation?.toString() || ''}
            onChange={(value) => onChange('canadianEducation', value ? parseInt(value) : '')}
            placeholder="Select Canadian education level..."
          />
          {data.canadianEducation > 0 && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-800 font-medium">
                  Additional points for Canadian education!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {(data.maritalStatus === 2 || data.maritalStatus === 5) && (
        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              Spouse Education Level
              <span className="text-xs font-normal text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Spouse Factor
              </span>
            </label>
            <select
              className="select"
              value={data.spouseEducationLevel || ''}
              onChange={e => onChange('spouseEducationLevel', parseInt(e.target.value))}
            >
              <option value="">Select education level...</option>
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
            {data.spouseEducationLevel && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-purple-800 font-medium">
                    Spouse education factor applied
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
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
            <CustomDropdown
              options={[
                { value: '', label: 'Select test' },
                { value: '1', label: 'IELTS - General Training' },
                { value: '2', label: 'CELPIP - General test' },
                { value: '5', label: 'PTE Core' },
                { value: '3', label: 'TEF Canada' },
                { value: '4', label: 'TCF Canada' }
              ]}
              value={data.firstLanguageExam?.toString() || ''}
              onChange={(value) => onChange('firstLanguageExam', value ? parseInt(value) : '')}
              placeholder="Select test"
            />
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
        <CustomDropdown
          options={[
            { value: '0', label: 'None or less than a year' },
            { value: '1', label: '1 year' },
            { value: '2', label: '2 years' },
            { value: '3', label: '3 years' },
            { value: '4', label: '4 years' },
            { value: '5', label: '5 years or more' }
          ]}
          value={data.canadianExperience?.toString() || ''}
          onChange={(value) => onChange('canadianExperience', value ? parseInt(value) : '')}
          placeholder="Select Canadian work experience..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Foreign Work Experience (outside Canada)</label>
        <CustomDropdown
          options={[
            { value: '0', label: 'None or less than a year' },
            { value: '1', label: '1 year' },
            { value: '2', label: '2 years' },
            { value: '3', label: '3 years or more' }
          ]}
          value={data.foreignExperience?.toString() || ''}
          onChange={(value) => onChange('foreignExperience', value ? parseInt(value) : '')}
          placeholder="Select foreign work experience..."
        />
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
        <div className="text-gray-600 mt-2 dark:text-gray-400">points out of 1200+</div>
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

      <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center space-section-sm fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Modern CRS Calculator
                </h1>
              </div>
              <ThemeToggle />
            </div>
            <p className="text-lg text-gray-600 mb-8 dark:text-gray-300">
              Calculate your Comprehensive Ranking System score for Canadian Express Entry
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updated for 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Accurate Calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </header>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 fade-in">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{errors.general}</span>
          </div>
        )}

        <div className="calculator-grid">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-300">1</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Core Information</h2>
              </div>
              <PersonalInfoForm data={formData} onChange={handleInputChange} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                  <span className="text-xs font-bold text-green-600 dark:text-green-300">2</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education & Language</h2>
              </div>
              <div className="space-y-8">
                <EducationForm data={formData} onChange={handleInputChange} />
                <LanguageForm data={formData} onChange={handleInputChange} />
                <SpouseLanguageForm data={formData} onChange={handleInputChange} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-300">3</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience & Additional Factors</h2>
              </div>
              <div className="space-y-8">
                <ExperienceForm data={formData} onChange={handleInputChange} />
                <AdditionalFactorsForm data={formData} onChange={handleInputChange} />
              </div>
            </div>

            <div className="text-center space-section-sm">
              <button
                onClick={calculateScore}
                className="btn-primary"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Calculate My CRS Score
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {result && <ResultsDisplay result={result} />}

            {!result && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Tips</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Age 20-29 years receives maximum points</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>CLB 9+ in all language skills gives maximum points</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Canadian education adds bonus points</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Provincial nomination adds 600 points</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="space-section pt-8 border-t border-gray-200 dark:border-gray-600">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm space-group-sm">
              © 2025 Modern CRS Calculator. This tool is for informational purposes only and does not
              constitute immigration advice.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Use</span>
              <span>•</span>
              <span>Contact</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
