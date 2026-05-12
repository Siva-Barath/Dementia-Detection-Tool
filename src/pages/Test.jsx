import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Test.css'

function Test() {
  return (
    <>
      <Navbar />
      <div className="test-page">
        <div className="test-container">
          <h1>Assessment Page</h1>
          <p>This page will contain the cognitive assessment tests.</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Test
