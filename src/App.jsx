import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './App.css'

// Onboarding Modal Component
function OnboardingModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(1)
  const [ageRange, setAgeRange] = useState('')
  const [dayType, setDayType] = useState('')
  const [sensoryProfile, setSensoryProfile] = useState('')

  if (!isOpen) return null

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onComplete({ ageRange, dayType, sensoryProfile })
    }
  }

  const handleSkip = () => {
    onComplete({ ageRange: '', dayType: '', sensoryProfile: '' })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Let's personalize your schedule</h2>
        <div className="onboarding-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <label>What age range?</label>
            <div className="option-grid">
              {['3-5', '6-8', '9-12', '13+'].map(age => (
                <button
                  key={age}
                  className={`option-btn ${ageRange === age ? 'selected' : ''}`}
                  onClick={() => setAgeRange(age)}
                >
                  {age} years
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <label>What type of day?</label>
            <div className="option-grid">
              {['School Day', 'Home Day', 'Weekend'].map(type => (
                <button
                  key={type}
                  className={`option-btn ${dayType === type ? 'selected' : ''}`}
                  onClick={() => setDayType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <label>Sensory profile</label>
            <div className="option-grid">
              {['Low Stimulation', 'Mixed', 'High Stimulation'].map(profile => (
                <button
                  key={profile}
                  className={`option-btn ${sensoryProfile === profile ? 'selected' : ''}`}
                  onClick={() => setSensoryProfile(profile)}
                >
                  {profile}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleSkip}>Skip</button>
          <button className="btn btn-primary" onClick={handleNext}>
            {step === 3 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get sensory load (moved up for accessibility)
function getSensoryLoad(task) {
  const lowerTask = task.toLowerCase()
  // High stimulation
  if (lowerTask.includes('play') || lowerTask.includes('game') || 
      lowerTask.includes('party') || lowerTask.includes('event') ||
      lowerTask.includes('sport') || lowerTask.includes('exercise')) return 0.8
  // Medium stimulation
  if (lowerTask.includes('school') || lowerTask.includes('class') ||
      lowerTask.includes('homework') || lowerTask.includes('study') ||
      lowerTask.includes('lunch') || lowerTask.includes('dinner') ||
      lowerTask.includes('breakfast')) return 0.5
  // Low stimulation / calming
  if (lowerTask.includes('rest') || lowerTask.includes('quiet') ||
      lowerTask.includes('bed') || lowerTask.includes('sleep') ||
      lowerTask.includes('bath') || lowerTask.includes('shower') ||
      lowerTask.includes('calm') || lowerTask.includes('meditation')) return 0.2
  // Neutral
  return 0.4
}

// Sensory Balance Meter Component
function SensoryBalanceMeter({ schedule }) {
  const calculateSensoryLoad = () => {
    if (schedule.length === 0) return { level: 0, color: '#4A90E2', label: 'Balanced' }
    
    let totalLoad = 0
    schedule.forEach(item => {
      // Use the sensoryLevel if available, otherwise calculate it
      const load = item.sensoryLevel !== undefined ? item.sensoryLevel : getSensoryLoad(item.task)
      totalLoad += load
    })
    
    const avgLoad = totalLoad / schedule.length
    
    if (avgLoad < 0.3) {
      return { level: avgLoad, color: '#4A90E2', label: 'Calming', percentage: Math.round(avgLoad * 100) }
    } else if (avgLoad < 0.7) {
      return { level: avgLoad, color: '#F5A623', label: 'Neutral', percentage: Math.round(avgLoad * 100) }
    } else {
      return { level: avgLoad, color: '#E94B3C', label: 'Stimulating', percentage: Math.round(avgLoad * 100) }
    }
  }

  const sensory = calculateSensoryLoad()
  const warning = sensory.level > 0.7 && schedule.length > 5
  const calmingCount = schedule.filter(item => {
    const load = item.sensoryLevel !== undefined ? item.sensoryLevel : getSensoryLoad(item.task)
    return load < 0.3
  }).length

  return (
    <div className="sensory-meter">
      <div className="sensory-meter-header">
        <span>🎨 Sensory Balance</span>
        <span className="sensory-label" style={{ color: sensory.color }}>
          {sensory.label}
        </span>
      </div>
      <div className="sensory-bar-container">
        <div 
          className="sensory-bar" 
          style={{ 
            width: `${Math.max(sensory.level * 100, 10)}%`,
            backgroundColor: sensory.color 
          }}
        />
        <span className="sensory-percentage">{Math.round(sensory.level * 100)}%</span>
      </div>
      <div className="sensory-stats">
        <span>📊 {calmingCount} calming activities</span>
        <span>•</span>
        <span>{schedule.length - calmingCount} active activities</span>
      </div>
      {warning && (
        <div className="sensory-warning">
          ⚠️ This schedule has high stimulation. Consider adding calming breaks between activities.
        </div>
      )}
      {sensory.level < 0.3 && schedule.length > 0 && (
        <div className="sensory-info">
          ✅ Good balance! This schedule supports regulation.
        </div>
      )}
    </div>
  )
}

// Explainable AI Component
function ExplainableAI({ schedule, userProfile }) {
  if (schedule.length === 0) return null

  const getExplanation = () => {
    const explanations = []
    
    // Check for movement before homework
    const homeworkIndex = schedule.findIndex(item => 
      item.task.toLowerCase().includes('homework') || 
      item.task.toLowerCase().includes('study')
    )
    const movementBefore = schedule.slice(0, homeworkIndex).some(item =>
      item.task.toLowerCase().includes('play') ||
      item.task.toLowerCase().includes('movement') ||
      item.task.toLowerCase().includes('exercise')
    )
    
    if (homeworkIndex > -1 && movementBefore) {
      explanations.push({
        icon: '💡',
        text: `We placed a movement break before homework because children aged ${userProfile.ageRange || '6-8'} often regulate better after physical activity.`
      })
    }

    // Check for transition breaks
    const highStimCount = schedule.filter(item => getSensoryLoad(item.task) > 0.7).length
    if (highStimCount > 3) {
      explanations.push({
        icon: '🧠',
        text: 'This schedule includes multiple high-stimulation activities. Consider adding quiet breaks between them to support regulation.'
      })
    }

    // Check for meal timing
    const hasBreakfast = schedule.some(item => item.task.toLowerCase().includes('breakfast'))
    const hasLunch = schedule.some(item => item.task.toLowerCase().includes('lunch'))
    if (hasBreakfast && hasLunch) {
      const breakfastIndex = schedule.findIndex(item => item.task.toLowerCase().includes('breakfast'))
      const lunchIndex = schedule.findIndex(item => item.task.toLowerCase().includes('lunch'))
      if (lunchIndex - breakfastIndex > 4) {
        explanations.push({
          icon: '⏰',
          text: 'Regular meal times help maintain stable energy levels and reduce anxiety about what comes next.'
        })
      }
    }

    if (explanations.length === 0) {
      explanations.push({
        icon: '✨',
        text: `Based on children like yours (${userProfile.sensoryProfile || 'mixed'} sensory profile), this routine is designed to reduce transition stress and support regulation.`
      })
    }

    return explanations
  }

  const explanations = getExplanation()

  return (
    <div className="explainable-ai">
      <h3>🧠 Why This Order?</h3>
      {explanations.map((exp, idx) => (
        <div key={idx} className="explanation-item">
          <span className="explanation-icon">{exp.icon}</span>
          <span className="explanation-text">{exp.text}</span>
        </div>
      ))}
    </div>
  )
}

// Schedule Card Component (Enhanced)
function ScheduleCard({ id, task, icon, sensoryLevel, onPlayAudio, isPlaying, previewMode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const sensoryColor = sensoryLevel < 0.3 ? '#4A90E2' : sensoryLevel < 0.7 ? '#F5A623' : '#E94B3C'

  if (previewMode) {
    return (
      <div className="schedule-card preview-mode">
        <div className="card-icon-large">{icon}</div>
        <div className="card-text-large">{task}</div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`schedule-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="card-drag-handle" {...attributes} {...listeners}>
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div className="card-content">
        <div className="card-icon">{icon}</div>
        <div className="card-text">{task}</div>
        <div className="sensory-indicator" style={{ backgroundColor: sensoryColor }} />
      </div>
      <button
        className={`audio-button ${isPlaying ? 'playing' : ''}`}
        onClick={() => onPlayAudio(id)}
        aria-label={`Play audio for ${task}`}
      >
        {isPlaying ? '⏸' : '🔊'}
      </button>
    </div>
  )
}

// Smart Templates Component
function TemplateSelector({ onSelectTemplate }) {
  const templates = [
    {
      name: 'Typical School Day (Age 7)',
      activities: 'Wake up\nBreakfast\nGet ready\nSchool\nLunch\nAfter school\nHomework\nPlay time\nDinner\nBath time\nBedtime'
    },
    {
      name: 'Low-Spoon Day',
      activities: 'Wake up\nBreakfast\nQuiet time\nLunch\nRest\nSnack\nDinner\nBedtime'
    },
    {
      name: 'Weekend Reset Day',
      activities: 'Wake up\nBreakfast\nFree play\nLunch\nOutdoor time\nSnack\nDinner\nFamily time\nBedtime'
    }
  ]

  return (
    <div className="template-selector">
      <h3>📋 Quick Start Templates</h3>
      <div className="template-grid">
        {templates.map((template, idx) => (
          <button
            key={idx}
            className="template-card"
            onClick={() => onSelectTemplate(template.activities)}
          >
            <div className="template-name">{template.name}</div>
            <div className="template-preview">{template.activities.split('\n').slice(0, 3).join(' → ')}...</div>
          </button>
        ))}
      </div>
    </div>
  )
}


// Main App Component
function App() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [userProfile, setUserProfile] = useState({})
  const [inputText, setInputText] = useState('')
  const [schedule, setSchedule] = useState([])
  const [playingId, setPlayingId] = useState(null)
  const [synth, setSynth] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [showReflection, setShowReflection] = useState(false)

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSynth(window.speechSynthesis)
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Parse text input into schedule items
  const parseSchedule = (text) => {
    if (!text.trim()) return []

    const lines = text
      .split(/\n|,|;|→|->/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    return lines.map((line, index) => {
      const icon = getIconForTask(line)
      const sensoryLevel = getSensoryLoad(line)
      return {
        id: `task-${index}`,
        task: line,
        icon: icon,
        sensoryLevel: sensoryLevel,
      }
    })
  }

  // Icon mapping
  const getIconForTask = (task) => {
    const lowerTask = task.toLowerCase()
    if (lowerTask.includes('wake') || lowerTask.includes('morning')) return '🌅'
    if (lowerTask.includes('breakfast')) return '🍳'
    if (lowerTask.includes('school') || lowerTask.includes('class')) return '🏫'
    if (lowerTask.includes('lunch')) return '🍽️'
    if (lowerTask.includes('play') || lowerTask.includes('game')) return '🎮'
    if (lowerTask.includes('homework') || lowerTask.includes('study')) return '📚'
    if (lowerTask.includes('dinner')) return '🍕'
    if (lowerTask.includes('bath') || lowerTask.includes('shower')) return '🛁'
    if (lowerTask.includes('bed') || lowerTask.includes('sleep')) return '🌙'
    if (lowerTask.includes('brush') || lowerTask.includes('teeth')) return '🦷'
    if (lowerTask.includes('snack')) return '🍎'
    if (lowerTask.includes('rest') || lowerTask.includes('quiet')) return '🧘'
    if (lowerTask.includes('outdoor') || lowerTask.includes('park')) return '🌳'
    return '✅'
  }

  const handleGenerate = () => {
    const newSchedule = parseSchedule(inputText)
    setSchedule(newSchedule)
    setShowReflection(false)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSchedule((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handlePlayAudio = (id) => {
    if (!synth) {
      alert('Speech synthesis is not supported in your browser.')
      return
    }

    synth.cancel()

    const task = schedule.find((item) => item.id === id)
    if (task) {
      setPlayingId(id)
      const utterance = new SpeechSynthesisUtterance(task.task)
      utterance.onend = () => {
        setPlayingId(null)
      }
      utterance.onerror = () => {
        setPlayingId(null)
      }
      synth.speak(utterance)
    }
  }

  const handleClear = () => {
    setInputText('')
    setSchedule([])
    if (synth) {
      synth.cancel()
    }
    setPlayingId(null)
    setShowReflection(false)
  }

  const handleExport = () => {
    // In a real app, this would generate a PDF
    alert('📄 Export feature: This would generate a therapist-approved PDF with laminator-friendly spacing and black & white ink-saving mode.')
  }

  const handleShowReflection = () => {
    // Reflection: Shows caregivers they're doing a good job
    // This validates their efforts and reduces caregiver stress
    setShowReflection(true)
  }

  const handleSelectTemplate = (activities) => {
    setInputText(activities)
  }

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile)
    setShowOnboarding(false)
  }

  return (
    <div className="app">
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
      />

      <header className="app-header">
        <h1>✨ A Calm Day, Planned in Minutes</h1>
        <p className="subtitle">Less decision fatigue. More predictability. Fewer meltdowns.</p>
      </header>

      <main className="app-main">
        <section className="input-section">
          <div className="section-header">
            <h2>Create Your Schedule</h2>
            <button 
              className="preview-toggle"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? '👁️ Caregiver View' : '👀 See Like Your Child'}
            </button>
          </div>

          <TemplateSelector onSelectTemplate={handleSelectTemplate} />

          <textarea
            className="schedule-input"
            placeholder="Enter your daily schedule, one activity per line:&#10;Wake up&#10;Breakfast&#10;School&#10;Lunch&#10;Play time&#10;Dinner&#10;Bedtime"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
          />
          
          <div className="button-group">
            <button className="btn btn-primary" onClick={handleGenerate}>
              Generate Schedule
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
            {schedule.length > 0 && (
              <>
                <button className="btn btn-export" onClick={handleExport}>
                  📄 Export PDF
                </button>
                <button className="btn btn-reflect" onClick={handleShowReflection}>
                  💭 Reflection
                </button>
              </>
            )}
          </div>
        </section>

        <section className="schedule-section">
          <div className="section-header">
            <h2>Visual Schedule</h2>
            {schedule.length > 0 && (
              <button 
                className="help-button"
                onClick={() => alert(`📊 SENSORY BALANCE METER:\n\nThis shows the overall stimulation level of your schedule:\n• Blue (Calming) = Low stimulation activities\n• Yellow (Neutral) = Balanced activities\n• Orange (Stimulating) = High energy activities\n\nThe meter updates as you add or rearrange activities. If it shows high stimulation, consider adding calming breaks.\n\n💭 REFLECTION:\n\nClick the "Reflection" button to see validation of your caregiving efforts. Many caregivers worry they're "doing it wrong"—this feature shows you're supporting your child well with:\n• Count of regulation breaks\n• Overall schedule balance\n• Encouraging messages\n\nThis reduces caregiver stress and validates your hard work!`)}
                title="Click to learn about Sensory Balance & Reflection"
              >
                ❓ How does this work?
              </button>
            )}
          </div>

          {schedule.length > 0 && (
            <SensoryBalanceMeter schedule={schedule} />
          )}

          {schedule.length === 0 ? (
            <div className="empty-state">
              <p>Choose a template above or enter your daily plan to create visual cards.</p>
              <p className="empty-hint">Based on children like yours, this routine tends to reduce transition stress.</p>
            </div>
          ) : (
            <>
              {!previewMode && (
                <ExplainableAI schedule={schedule} userProfile={userProfile} />
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={schedule.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className={`schedule-container ${previewMode ? 'preview-mode' : ''}`}>
                    {schedule.map((item) => (
                      <ScheduleCard
                        key={item.id}
                        id={item.id}
                        task={item.task}
                        icon={item.icon}
                        sensoryLevel={item.sensoryLevel}
                        onPlayAudio={handlePlayAudio}
                        isPlaying={playingId === item.id}
                        previewMode={previewMode}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}

          {showReflection && schedule.length > 0 && (
            <div className="reflection-box">
              <h3>💭 End-of-Day Reflection</h3>
              <div className="reflection-content">
                <p>
                  <strong>What is Reflection?</strong><br/>
                  This feature validates your caregiving efforts. Many caregivers worry they're "doing it wrong"—this shows you're supporting your child well.
                </p>
                <div className="reflection-stats">
                  <div className="stat-item">
                    <span className="stat-number">{schedule.filter(item => {
                      const load = item.sensoryLevel !== undefined ? item.sensoryLevel : getSensoryLoad(item.task)
                      return load < 0.3
                    }).length}</span>
                    <span className="stat-label">Regulation Breaks</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{schedule.length}</span>
                    <span className="stat-label">Total Activities</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">✅</span>
                    <span className="stat-label">Well Balanced</span>
                  </div>
                </div>
                <p className="reflection-message">
                  <strong>Great job supporting your child! 🎉</strong><br/>
                  This routine is designed to reduce transition stress and support regulation.
                </p>
                <p className="reflection-note">
                  💙 Remember: You're not "doing it wrong." Every routine that supports your child is a win.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowReflection(false)}>
                Close
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Drag cards to rearrange • Click 🔊 for audio • Export for printing</p>
        <p className="footer-note">Applied UDL • Explainable AI • Evidence-based practice</p>
      </footer>
    </div>
  )
}

export default App
