import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './RiskAssessment.css'

export default function RiskAssessment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [riskData, setRiskData] = useState({
    ageGroup: '',
    sleepQuality: '',
    stressLevel: '',
    familyHistory: '',
    alcoholSmoking: '',
    exercise: '',
    diet: ''
  })
  const [overallRisk, setOverallRisk] = useState('')

  useEffect(() => {
    if (user) {
      const savedRiskData = localStorage.getItem(`riskFactors_${user.email}`)
      if (savedRiskData) {
        setRiskData(JSON.parse(savedRiskData))
        calculateOverallRisk(JSON.parse(savedRiskData))
      }
    }
  }, [user])

  const calculateOverallRisk = (data) => {
    let riskScore = 0
    let riskFactors = []

    // Age risk
    if (data.ageGroup === '65+') {
      riskScore += 3
      riskFactors.push('Advanced age')
    } else if (data.ageGroup === '55-64') {
      riskScore += 2
      riskFactors.push('Higher age')
    }

    // Sleep quality risk
    if (data.sleepQuality === 'poor') {
      riskScore += 2
      riskFactors.push('Poor sleep')
    } else if (data.sleepQuality === 'fair') {
      riskScore += 1
      riskFactors.push('Fair sleep')
    }

    // Stress level risk
    if (data.stressLevel === 'high') {
      riskScore += 2
      riskFactors.push('High stress')
    } else if (data.stressLevel === 'moderate') {
      riskScore += 1
      riskFactors.push('Moderate stress')
    }

    // Family history risk
    if (data.familyHistory === 'yes') {
      riskScore += 2
      riskFactors.push('Family history')
    }

    // Lifestyle risks
    if (data.alcoholSmoking === 'regular') {
      riskScore += 2
      riskFactors.push('Regular alcohol/smoking')
    } else if (data.alcoholSmoking === 'occasional') {
      riskScore += 1
      riskFactors.push('Occasional alcohol/smoking')
    }

    // Exercise risk
    if (data.exercise === 'none') {
      riskScore += 2
      riskFactors.push('No exercise')
    } else if (data.exercise === 'occasional') {
      riskScore += 1
      riskFactors.push('Occasional exercise')
    }

    // Diet risk
    if (data.diet === 'poor') {
      riskScore += 2
      riskFactors.push('Poor diet')
    } else if (data.diet === 'average') {
      riskScore += 1
      riskFactors.push('Average diet')
    }

    // Determine overall risk level
    let riskLevel = 'Low Risk'
    if (riskScore >= 8) {
      riskLevel = 'High Risk'
    } else if (riskScore >= 5) {
      riskLevel = 'Moderate Risk'
    }

    setOverallRisk(riskLevel)
  }

  const handleInputChange = (field, value) => {
    const newData = { ...riskData, [field]: value }
    setRiskData(newData)
    calculateOverallRisk(newData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user) {
      localStorage.setItem(`riskFactors_${user.email}`, JSON.stringify(riskData))
      navigate('/dashboard')
    }
  }

  const riskLevels = {
    'Low Risk': { color: '#28a745', bg: '#d4edda' },
    'Moderate Risk': { color: '#ffc107', bg: '#fff3cd' },
    'High Risk': { color: '#dc3545', bg: '#f8d7da' }
  }

  const currentRisk = riskLevels[overallRisk] || riskLevels['Low Risk']

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="risk-assessment-page">
          <div className="risk-container">
            <div className="auth-required">
              <h2>Please Sign In</h2>
              <p>You need to be logged in to complete the risk assessment.</p>
              <button onClick={() => navigate('/login')} className="auth-btn">Sign In</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="risk-assessment-page">
        <div className="risk-container">
          <header className="risk-header">
            <h1>Risk Factor Assessment</h1>
            <p>Evaluate lifestyle factors that may impact cognitive health</p>
          </header>

          <form onSubmit={handleSubmit} className="risk-form">
            {/* Personal Information */}
            <section className="risk-section">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Age Group</label>
                  <select 
                    value={riskData.ageGroup} 
                    onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                    required
                  >
                    <option value="">Select age group</option>
                    <option value="18-34">18-34 years</option>
                    <option value="35-54">35-54 years</option>
                    <option value="55-64">55-64 years</option>
                    <option value="65+">65+ years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Family History of Dementia</label>
                  <select 
                    value={riskData.familyHistory} 
                    onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                    required
                  >
                    <option value="">Select option</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Lifestyle Factors */}
            <section className="risk-section">
              <h2>Lifestyle Factors</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Sleep Quality</label>
                  <select 
                    value={riskData.sleepQuality} 
                    onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
                    required
                  >
                    <option value="">Select sleep quality</option>
                    <option value="excellent">Excellent (7-8 hours)</option>
                    <option value="good">Good (6-7 hours)</option>
                    <option value="fair">Fair (5-6 hours)</option>
                    <option value="poor">Poor (less than 5 hours)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stress Level</label>
                  <select 
                    value={riskData.stressLevel} 
                    onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                    required
                  >
                    <option value="">Select stress level</option>
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Alcohol/Smoking</label>
                  <select 
                    value={riskData.alcoholSmoking} 
                    onChange={(e) => handleInputChange('alcoholSmoking', e.target.value)}
                    required
                  >
                    <option value="">Select option</option>
                    <option value="none">Never</option>
                    <option value="occasional">Occasional</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Exercise Frequency</label>
                  <select 
                    value={riskData.exercise} 
                    onChange={(e) => handleInputChange('exercise', e.target.value)}
                    required
                  >
                    <option value="">Select exercise frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">3-4 times per week</option>
                    <option value="occasional">1-2 times per week</option>
                    <option value="none">Never</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Diet Quality</label>
                  <select 
                    value={riskData.diet} 
                    onChange={(e) => handleInputChange('diet', e.target.value)}
                    required
                  >
                    <option value="">Select diet quality</option>
                    <option value="excellent">Excellent (balanced, fresh foods)</option>
                    <option value="good">Good (mostly healthy)</option>
                    <option value="average">Average (mixed healthy/unhealthy)</option>
                    <option value="poor">Poor (mostly processed foods)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Risk Result */}
            {overallRisk && (
              <section className="risk-result">
                <h2>Overall Risk Assessment</h2>
                <div className="risk-display" style={{ backgroundColor: currentRisk.bg }}>
                  <div className="risk-level" style={{ color: currentRisk.color }}>
                    {overallRisk}
                  </div>
                  <div className="risk-description">
                    {overallRisk === 'Low Risk' && 
                      'Your lifestyle factors suggest low cognitive risk. Continue maintaining healthy habits.'
                    }
                    {overallRisk === 'Moderate Risk' && 
                      'Your lifestyle factors suggest moderate cognitive risk. Consider improving sleep, exercise, and diet.'
                    }
                    {overallRisk === 'High Risk' && 
                      'Your lifestyle factors suggest high cognitive risk. Consult a healthcare professional for evaluation.'
                    }
                  </div>
                </div>
              </section>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Save Assessment
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="cancel-btn">
                View Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
