import { useNavigate } from 'react-router-dom'
import './Hero.css'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Welcome to NeuroCare</h1>
        <p className="hero-subtitle">
          An intelligent platform to monitor and detect early signs of cognitive decline.
        </p>
        <button className="hero-btn" onClick={() => navigate('/test')}>
          Start Assessment
        </button>
      </div>
    </section>
  )
}

export default Hero
