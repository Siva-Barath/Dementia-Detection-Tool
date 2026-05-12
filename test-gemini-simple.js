// Simple test to verify Gemini API is working with exact same format as ChatBot
const testGeminiSimple = async () => {
  const systemPrompt = `You are a helpful and compassionate AI assistant specializing in dementia and cognitive health. Always include medical disclaimers.`

  try {
    console.log('Testing Gemini API with ChatBot format...')
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDipl5U6MPqYzqazaqhO9y0LkKj93HtadM`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: What are early signs of dementia?\nAssistant:`
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

    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      return false
    }

    const data = await response.json()
    console.log('Success Response:', JSON.stringify(data, null, 2))
    
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
      const botResponse = data.candidates[0].content.parts[0].text
      console.log('✅ Gemini API Working!')
      console.log('Response Length:', botResponse.length, 'characters')
      console.log('First 200 chars:', botResponse.substring(0, 200) + '...')
      return true
    } else {
      console.error('❌ Unexpected response format')
      return false
    }
  } catch (error) {
    console.error('❌ Test Failed:', error.message)
    return false
  }
}

testGeminiSimple()
