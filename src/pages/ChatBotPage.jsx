import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ChatBotPage.css'

export default function ChatBotPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your NeuroCare AI assistant. I can help answer questions about dementia, cognitive health, memory, and brain health. How can I assist you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const systemPrompt = `You are a helpful and compassionate AI assistant specializing in dementia and cognitive health. Your role is to:

1. Provide accurate, evidence-based information about dementia, Alzheimer's disease, memory loss, and cognitive health
2. Answer questions about symptoms, risk factors, prevention, and care strategies
3. Offer emotional support and practical advice for patients and caregivers
4. Always include a disclaimer that this is not medical advice and users should consult healthcare professionals
5. Be clear, concise, and empathetic in your responses
6. Focus on factual information from reputable medical sources

Please respond to the following query with these guidelines in mind.`

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDipl5U6MPqYzqazaqhO9y0LkKj93HtadM`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${userMessage.content}\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API')
      }

      const data = await response.json()
      let botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        'I apologize, but I\'m having trouble responding right now. Please try again or consult with a healthcare professional for immediate concerns.'

      // Clean up formatting - remove markdown and extra asterisks
      botResponse = botResponse
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '')  // Remove asterisks
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
        .trim()

      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
    } catch (error) {
      console.error('Gemini API error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. For immediate concerns about cognitive health, please consult with a healthcare professional or call emergency services if this is an emergency.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <>
      <Navbar />
      <div className="chatbot-page">
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h2>Cognisense CongniAI Assistant</h2>
            <p>Dementia & Cognitive Health Support</p>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-content loading">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about dementia, memory, cognitive health..."
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '...' : '➤'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
