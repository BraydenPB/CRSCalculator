import { h } from 'preact';
import { useState } from 'preact/hooks';
import { calculateCRS, getMaxScoreForTest } from './crsLogic.js';

// Form Components
const PersonalInfoForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Personal Information</h3>

    <div className="form-group">
      <label className="form-label">Age</label>
      <input
        type="number"
        min="17"
        max="44"
        className="input"
        value={data.age || ''}
        onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
        required
      />
      <small className="text-gray-500">Age must be between 17-44 years</small>
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          checked={data.hasSpouse || false}
          onChange={(e) => onChange('hasSpouse', e.target.checked)}
        />
        {' '}I have a spouse or common-law partner who will be included in my application
      </label>
    </div>
  </div>
);

const EducationForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Education</h3>

    <div className="form-group">
      <label className="form-label">Your Education Level</label>
      <select className="select" value={data.educationLevel || ''} onChange={(e) => onChange('educationLevel', parseInt(e.target.value))} required>
        <option value="">Select education level</option>
        <option value="1">Less than secondary school</option>
        <option value="2">Secondary diploma (high school graduation)</option>
        <option value="3">One-year degree, diploma or certificate</option>
        <option value="4">Two-year program at university, college, trade or technical school</option>
        <option value="5">Bachelor's degree OR three or more year program</option>
        <option value="6">Two or more certificates, diplomas, or degrees</option>
        <option value="7">Master's degree, OR professional degree</option>
        <option value="8">Doctoral level university degree (Ph.D.)</option>
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Canadian Education</label>
      <select className="select" value={data.canadianEducation || ''} onChange={(e) => onChange('canadianEducation', parseInt(e.target.value))}>
        <option value="-1">No Canadian education</option>
        <option value="0">Secondary (high school) or less</option>
        <option value="1">1- or 2-year diploma or certificate</option>
        <option value="3">3-year or longer degree, diploma or certificate</option>
      </select>
    </div>

    {data.hasSpouse && (
      <div className="form-group">
        <label className="form-label">Spouse Education Level</label>
        <select className="select" value={data.spouseEducationLevel || ''} onChange={(e) => onChange('spouseEducationLevel', parseInt(e.target.value))}>
          <option value="1">Less than secondary school</option>
          <option value="2">Secondary diploma (high school graduation)</option>
          <option value="3">One-year degree, diploma or certificate</option>
          <option value="4">Two-year program at university, college, trade or technical school</option>
          <option value="5">Bachelor's degree OR three or more year program</option>
          <option value="6">Two or more certificates, diplomas, or degrees</option>
          <option value="7">Master's degree, OR professional degree</option>
          <option value="8">Doctoral level university degree (Ph.D.)</option>
        </select>
      </div>
    )}
  </div>
);

const LanguageForm = ({ data, onChange }) => {
  // Get max score for selected test types
  const firstLangMaxScore = getMaxScoreForTest(data.firstLanguageExam || 1);
  const secondLangMaxScore = getMaxScoreForTest(data.secondLanguageExam || 1);

  const firstLangCLB = {
    speaking: Math.min(Math.floor(data.firstLanguageSpeaking || 0), 10),
    writing: Math.min(Math.floor(data.firstLanguageWriting || 0), 10),
    reading: Math.min(Math.floor(data.firstLanguageReading || 0), 10),
    listening: Math.min(Math.floor(data.firstLanguageListening || 0), 10)
  };

  return (
    <div className="form-section">
      <h3 className="section-title">Language Skills</h3>

      <div className="calculator-grid">
        <div>
          <h4 className="font-medium mb-4">First Language</h4>

          <div className="form-group">
            <label className="form-label">Language Test</label>
            <select className="select" value={data.firstLanguageExam || ''} onChange={(e) => onChange('firstLanguageExam', parseInt(e.target.value))}>
              <option value="">Select test</option>
              <option value="1">IELTS - General Training</option>
              <option value="2">CELPIP - General test</option>
              <option value="3">TEF Canada</option>
              <option value="4">TCF Canada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Speaking (0-{firstLangMaxScore})</label>
              <input
                type="number"
                min="0"
                max={firstLangMaxScore}
                step="0.5"
                className="input"
                value={data.firstLanguageSpeaking || ''}
                onChange={(e) => onChange('firstLanguageSpeaking', parseFloat(e.target.value) || 0)}
              />
              <small className="text-gray-500">
                {data.firstLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
              </small>
            </div>
            <div className="form-group">
              <label className="form-label">Writing (0-{firstLangMaxScore})</label>
              <input
                type="number"
                min="0"
                max={firstLangMaxScore}
                step="0.5"
                className="input"
                value={data.firstLanguageWriting || ''}
                onChange={(e) => onChange('firstLanguageWriting', parseFloat(e.target.value) || 0)}
              />
              <small className="text-gray-500">
                {data.firstLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
              </small>
            </div>
            <div className="form-group">
              <label className="form-label">Reading (0-{firstLangMaxScore})</label>
              <input
                type="number"
                min="0"
                max={firstLangMaxScore}
                step="0.5"
                className="input"
                value={data.firstLanguageReading || ''}
                onChange={(e) => onChange('firstLanguageReading', parseFloat(e.target.value) || 0)}
              />
              <small className="text-gray-500">
                {data.firstLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
              </small>
            </div>
            <div className="form-group">
              <label className="form-label">Listening (0-{firstLangMaxScore})</label>
              <input
                type="number"
                min="0"
                max={firstLangMaxScore}
                step="0.5"
                className="input"
                value={data.firstLanguageListening || ''}
                onChange={(e) => onChange('firstLanguageListening', parseFloat(e.target.value) || 0)}
              />
              <small className="text-gray-500">
                {data.firstLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
              </small>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <strong>CLB Levels:</strong> Speaking: {firstLangCLB.speaking}, Writing: {firstLangCLB.writing}, Reading: {firstLangCLB.reading}, Listening: {firstLangCLB.listening}
          </div>
        </div>

        {data.hasSecondLanguage && (
          <div>
            <h4 className="font-medium mb-4">Second Language</h4>

            <div className="form-group">
              <label className="form-label">Language Test</label>
              <select className="select" value={data.secondLanguageExam || ''} onChange={(e) => onChange('secondLanguageExam', parseInt(e.target.value))}>
                <option value="">Select test</option>
                <option value="1">IELTS - General Training</option>
                <option value="2">CELPIP - General test</option>
                <option value="3">TEF Canada</option>
                <option value="4">TCF Canada</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Speaking (0-{secondLangMaxScore})</label>
                <input
                  type="number"
                  min="0"
                  max={secondLangMaxScore}
                  step="0.5"
                  className="input"
                  value={data.secondLanguageSpeaking || ''}
                  onChange={(e) => onChange('secondLanguageSpeaking', parseFloat(e.target.value) || 0)}
                />
                <small className="text-gray-500">
                  {data.secondLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Writing (0-{secondLangMaxScore})</label>
                <input
                  type="number"
                  min="0"
                  max={secondLangMaxScore}
                  step="0.5"
                  className="input"
                  value={data.secondLanguageWriting || ''}
                  onChange={(e) => onChange('secondLanguageWriting', parseFloat(e.target.value) || 0)}
                />
                <small className="text-gray-500">
                  {data.secondLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Reading (0-{secondLangMaxScore})</label>
                <input
                  type="number"
                  min="0"
                  max={secondLangMaxScore}
                  step="0.5"
                  className="input"
                  value={data.secondLanguageReading || ''}
                  onChange={(e) => onChange('secondLanguageReading', parseFloat(e.target.value) || 0)}
                />
                <small className="text-gray-500">
                  {data.secondLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Listening (0-{secondLangMaxScore})</label>
                <input
                  type="number"
                  min="0"
                  max={secondLangMaxScore}
                  step="0.5"
                  className="input"
                  value={data.secondLanguageListening || ''}
                  onChange={(e) => onChange('secondLanguageListening', parseFloat(e.target.value) || 0)}
                />
                <small className="text-gray-500">
                  {data.secondLanguageExam === 2 ? 'CELPIP: 0-12 scale' : 'IELTS: 0-9 scale'}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasSecondLanguage || false}
            onChange={(e) => onChange('hasSecondLanguage', e.target.checked)}
          />
          {' '}I have second language test results
        </label>
      </div>
    </div>
  );
};

const ExperienceForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Work Experience</h3>

    <div className="calculator-grid">
      <div className="form-group">
        <label className="form-label">Canadian Work Experience</label>
        <select className="select" value={data.canadianExperience || ''} onChange={(e) => onChange('canadianExperience', parseInt(e.target.value))}>
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
        <select className="select" value={data.foreignExperience || ''} onChange={(e) => onChange('foreignExperience', parseInt(e.target.value))}>
          <option value="0">None or less than a year</option>
          <option value="1">1 year</option>
          <option value="2">2 years</option>
          <option value="3">3 years or more</option>
        </select>
      </div>

      {data.hasSpouse && (
        <div className="form-group">
          <label className="form-label">Spouse Canadian Work Experience</label>
          <select className="select" value={data.spouseCanadianExperience || ''} onChange={(e) => onChange('spouseCanadianExperience', parseInt(e.target.value))}>
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
);

const AdditionalFactorsForm = ({ data, onChange }) => (
  <div className="form-section">
    <h3 className="section-title">Additional Factors</h3>

    <div className="space-y-4">
      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasCanadianFamily || false}
            onChange={(e) => onChange('hasCanadianFamily', e.target.checked)}
          />
          {' '}I have a brother or sister living in Canada who is a citizen or permanent resident
        </label>
      </div>

      <div className="form-group">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Arranged employment points (50-200) were eliminated from CRS scoring as of March 25, 2025.
            Job offers with LMIA no longer provide additional points.
          </p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasProvincialNomination || false}
            onChange={(e) => onChange('hasProvincialNomination', e.target.checked)}
          />
          {' '}I have a provincial or territorial nomination
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={data.hasFrenchLanguageSkills || false}
            onChange={(e) => onChange('hasFrenchLanguageSkills', e.target.checked)}
          />
          {' '}I have French language skills (bonus points)
        </label>
      </div>
    </div>
  </div>
);

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  const { totalScore, breakdown } = result;

  const getScoreColor = (score) => {
    if (score >= 500) return 'text-green-600';
    if (score >= 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="result-card">
      <h2 className="text-2xl font-bold text-center mb-6">Your CRS Score</h2>

      <div className="text-center mb-8">
        <div className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
          {totalScore}
        </div>
        <div className="text-gray-600 mt-2">points out of 1200+</div>
      </div>

      <div className="space-y-4">
        <div className="score-display">
          <h3 className="font-semibold text-lg mb-3">Section A: Core Human Capital Factors</h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">{breakdown.sectionA.points} points</div>
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
            <h3 className="font-semibold text-lg mb-3">Section B: Spouse/Common-law Partner Factors</h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">{breakdown.sectionB.points} points</div>
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
          <div className="text-sm text-gray-600 mt-2">Combination of education, language, and experience factors</div>
        </div>

        <div className="score-display">
          <h3 className="font-semibold text-lg mb-3">Section D: Additional Points</h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">{breakdown.sectionD.points} points</div>
          <div className="space-y-1 text-sm">
            {breakdown.sectionD.details.provincialNomination > 0 && <div>Provincial Nomination: {breakdown.sectionD.details.provincialNomination} pts</div>}
            {breakdown.sectionD.details.arrangedEmployment > 0 && <div>Arranged Employment: {breakdown.sectionD.details.arrangedEmployment} pts</div>}
            {breakdown.sectionD.details.canadianEducation > 0 && <div>Canadian Education: {breakdown.sectionD.details.canadianEducation} pts</div>}
            {breakdown.sectionD.details.canadianFamily > 0 && <div>Family in Canada: {breakdown.sectionD.details.canadianFamily} pts</div>}
            {breakdown.sectionD.details.frenchSkills > 0 && <div>French Language Skills: {breakdown.sectionD.details.frenchSkills} pts</div>}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> This calculator provides an estimate of your CRS score.
          Actual scores may vary based on official IRCC calculations and policy changes.
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [formData, setFormData] = useState({
    // Personal
    age: 25,
    hasSpouse: false,

    // Education
    educationLevel: 5, // Bachelor's degree
    canadianEducation: -1, // No Canadian education

    // First Language
    firstLanguageExam: 1, // IELTS
    firstLanguageSpeaking: 7,
    firstLanguageWriting: 7,
    firstLanguageReading: 7,
    firstLanguageListening: 7,

    // Second Language
    hasSecondLanguage: false,

    // Experience
    canadianExperience: 0,
    foreignExperience: 1,

    // Additional
    hasCanadianFamily: false,
    hasProvincialNomination: false,
    hasFrenchLanguageSkills: false
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const calculateScore = () => {
    try {
      const calculationResult = calculateCRS(formData);
      setResult(calculationResult);
      setErrors({});
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Modern CRS Calculator
          </h1>
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
            © 2025 Modern CRS Calculator. This tool is for informational purposes only and does not constitute immigration advice.
          </p>
        </footer>
      </div>
    </div>
  );
}