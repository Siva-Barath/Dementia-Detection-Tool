import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Results.css'

function Results() {
  const location = useLocation()
  const { user, updateProfile } = useAuth()
  const finalResult = location.state?.finalResult

  // Save result to user's assessment history
  useEffect(() => {
    if (!finalResult || !user) return

    const entry = {
      date: new Date().toISOString(),
      score: finalResult.cognitiveIndex,
      risk: finalResult.risk,
      breakdown: finalResult.breakdown
    }

    const history = user.assessmentHistory || []
    updateProfile({ assessmentHistory: [...history, entry] })
  }, [])

  return (
    <>
      <Navbar />
      <div className="results-page">
        <div className="results-container">
          <div className="results-icon">✅</div>
          <h1>Cognisense Results</h1>

          {finalResult ? (
            <>
              <div className="results-score">
                <h2>{finalResult.cognitiveIndex}<span>/100</span></h2>
                <p className={`results-risk risk-${finalResult.riskClass}`}>{finalResult.risk}</p>
              </div>
              <p className="results-interpretation">{finalResult.interpretation}</p>
            </>
          ) : (
            <p>Your cognitive health assessment has been successfully submitted.</p>
          )}

          <p className="results-note">
            {user ? 'Your results have been saved to your Cognisense profile.' : 'Create an account to track your results over time.'}
          </p>

          <div className="results-actions">
            <Link to="/" className="home-link">Return to Home</Link>
            {user && <Link to="/profile" className="profile-link">View Profile</Link>}
          </div>

                  </div>
      </div>
      <Footer />
    </>
  )
}

export default Results
