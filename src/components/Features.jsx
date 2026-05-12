import './Features.css'

function Features() {
  const features = [
    {
      icon: '🧠',
      title: 'Cognitive Tests',
      description: 'Evaluate memory, attention, and thinking skills'
    },
    {
      icon: '🗣️',
      title: 'Speech Analysis',
      description: 'Analyze speech patterns for early detection'
    },
    {
      icon: '📊',
      title: 'Smart Insights',
      description: 'Get personalized cognitive health reports'
    }
  ]

  return (
    <section className="features">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
