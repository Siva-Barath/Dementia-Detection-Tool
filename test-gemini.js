// Test script to verify Gemini API integration
const testGeminiAPI = async () => {
  const systemPrompt = `You are a helpful and compassionate AI assistant specializing in dementia and cognitive health. Your role is to:

1. Provide accurate, evidence-based information about dementia, Alzheimer's disease, memory loss, and cognitive health
2. Answer questions about symptoms, risk factors, prevention, and care strategies
3. Offer emotional support and practical advice for patients and caregivers
4. Always include a disclaimer that this is not medical advice and users should consult healthcare professionals
5. Be clear, concise, and empathetic in your responses
6. Focus on factual information from reputable medical sources

Please respond to the following query with these guidelines in mind.`

  try {
    console.log('Testing Gemini API...')
    
    // First, let's list available models
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=AIzaSyDipl5U6MPqYzqazaqhO9y0LkKj93HtadM`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (listResponse.ok) {
      const modelsData = await listResponse.json()
      console.log('Available models:', JSON.stringify(modelsData, null, 2))
    } else {
      console.error('Failed to list models:', listResponse.status, listResponse.statusText)
    }

    // Now try to generate content with a working model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDipl5U6MPqYzqazaqhO9y0LkKj93HtadM`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: What are the early signs of dementia?\nAssistant:`
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
      console.error('API Response Status:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error Details:', errorText)
      return false
    }

    const data = await response.json()
    console.log('API Response:', JSON.stringify(data, null, 2))
    
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
      const botResponse = data.candidates[0].content.parts[0].text
      console.log('✅ Gemini API is working!')
      console.log('Response:', botResponse)
      return true
    } else {
      console.error('❌ Unexpected response format:', data)
      return false
    }
  } catch (error) {
    console.error('❌ Gemini API Test Failed:', error)
    return false
  }
}

// Run the test
testGeminiAPI()
