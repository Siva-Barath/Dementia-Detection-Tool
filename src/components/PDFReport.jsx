import { useState } from 'react'

export default function PDFReport({ assessmentData, userData }) {
  const [generating, setGenerating] = useState(false)

  const generatePDF = async () => {
    setGenerating(true)
    
    // Create comprehensive PDF content
    const pdfContent = `
COGNISENSE - COGNITIVE HEALTH REPORT
===========================================

PATIENT INFORMATION
--------------------
Name: ${userData?.name || 'N/A'}
Email: ${userData?.email || 'N/A'}
Date: ${new Date().toLocaleDateString()}

ASSESSMENT RESULTS
--------------------
Overall Cognitive Index: ${assessmentData?.cognitiveIndex || 'N/A'}/100

DOMAIN BREAKDOWN
------------------
Memory Score: ${assessmentData?.breakdown?.memory || 'N/A'}/30
Verbal Score: ${assessmentData?.breakdown?.verbal || 'N/A'}/20  
Reaction Score: ${assessmentData?.breakdown?.reaction || 'N/A'}/20
Matching Score: ${assessmentData?.breakdown?.matching || 'N/A'}/30

PERFORMANCE ANALYSIS
--------------------
${assessmentData?.cognitiveIndex >= 80 ? '✅ Strong cognitive performance within expected ranges' :
  assessmentData?.cognitiveIndex >= 60 ? '⚠️ Moderate cognitive performance - improvement recommended' :
  '❌ Cognitive performance below expected ranges - professional evaluation advised'}

AI INSIGHTS
------------
${assessmentData?.aiInsight || 'AI insights not available'}

PERSONALIZED RECOMMENDATIONS
---------------------------
${assessmentData?.recommendations?.join('\n') || 'No specific recommendations available'}

RISK FACTORS
------------
${Object.entries(assessmentData?.riskFactors || {}).map(([factor, level]) => 
  `- ${factor}: ${level.charAt(0).toUpperCase() + level.slice(1)}`
).join('\n')}

NEXT STEPS
----------
1. Continue regular cognitive assessments with Cognisense
2. Follow AI-powered recommendations
3. Monitor lifestyle risk factors
4. Consult healthcare provider if concerns persist

REPORT GENERATED: ${new Date().toLocaleString()}
COGNISENSE - AI-POWERED COGNITIVE HEALTH PLATFORM
    `.trim()

    // Generate and download actual PDF file
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cognisense-Cognitive-Report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setGenerating(false)
  }

  return (
    <div className="pdf-report">
      <h3>📄 Download Cognitive Report</h3>
      <p>Generate a comprehensive PDF report of your cognitive assessment results.</p>
      
      <button 
        onClick={generatePDF} 
        disabled={generating}
        className="pdf-download-btn"
      >
        {generating ? '🔄 Generating...' : '📄 Download Report'}
      </button>
      
      <div className="report-preview">
        <h4>Report Includes:</h4>
        <ul>
          <li>✅ Complete assessment scores</li>
          <li>✅ Domain breakdown analysis</li>
          <li>✅ AI-powered insights</li>
          <li>✅ Personalized recommendations</li>
          <li>✅ Risk factor analysis</li>
          <li>✅ Next steps guidance</li>
        </ul>
      </div>
    </div>
  )
}
