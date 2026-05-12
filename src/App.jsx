import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ChatBotPage from './pages/ChatBotPage'
import Dashboard from './pages/Dashboard'
import RiskAssessment from './pages/RiskAssessment'
import WellnessCheckin from './pages/WellnessCheckin'
import HabitTracker from './pages/HabitTracker'
import LearnHub from './pages/LearnHub'
import Goals from './pages/Goals'
import Journal from './pages/Journal'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chatbot" element={<ChatBotPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/risk-assessment" element={<RiskAssessment />} />
      <Route path="/learn" element={<LearnHub />} />
      <Route path="/test" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/wellness" element={<ProtectedRoute><WellnessCheckin /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitTracker /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
