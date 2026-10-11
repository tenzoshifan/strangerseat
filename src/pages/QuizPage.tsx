import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Coffee,
  Copy,
  Heart,
  Lightbulb,
  MapPin,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Waves,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  archetypeDetails,
  getTravelArchetype,
  travelQuiz,
  type QuizQuestionId,
} from '../data/travelQuiz'
import { useAppStore } from '../store/appStore'

const optionIcons: Record<string, LucideIcon> = {
  landmarks: MapPin,
  hidden: Compass,
  food: Coffee,
  people: UsersRound,
  nature: Waves,
  learning: Lightbulb,
  'same-interests': Sparkles,
  explorer: Compass,
  easygoing: Wind,
  social: Heart,
  independent: Send,
  budget: MapPin,
  moderate: Coffee,
  premium: Sparkles,
  activity: Compass,
  city: MapPin,
  cafes: Coffee,
  events: UsersRound,
  photography: Lightbulb,
  adventure: Waves,
  tips: Send,
  enjoy: Heart,
  interests: Sparkles,
  'online-first': Send,
  'info-only': Compass,
  'public-only': ShieldCheck,
}

const archetypeIcons: Record<string, LucideIcon> = {
  compass: Compass,
  utensils: Coffee,
  'map-pin': MapPin,
  users: UsersRound,
  wind: Wind,
  sparkles: Sparkles,
  send: Send,
}

type Answers = Partial<Record<QuizQuestionId, string[]>>

function getShareText(archetype: string, summary: string) {
  return `My travel vibe is ${archetype}. ${summary} Find your travel vibe with The Stranger Seat.`
}

export function QuizPage() {
  const navigate = useNavigate()
  const saveQuizResult = useAppStore((state) => state.saveQuizResult)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ReturnType<typeof buildResult> | null>(null)
  const [shareMessage, setShareMessage] = useState('')

  function buildResult(currentAnswers: Answers) {
    const archetype = getTravelArchetype(currentAnswers)
    const details = archetypeDetails[archetype]
    return { archetype, ...details }
  }

  const question = travelQuiz[step]
  const selectedOptions = question ? answers[question.id] ?? [] : []
  const ResultIcon = result ? archetypeIcons[result.icon] : Compass

  function selectOption(questionId: QuizQuestionId, optionId: string, multiple: boolean) {
    setAnswers((current) => {
      const selected = current[questionId] ?? []
      const next = multiple
        ? selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId]
        : [optionId]
      return { ...current, [questionId]: next }
    })
  }

  function finishQuiz(currentAnswers: Answers) {
    const nextResult = buildResult(currentAnswers)
    const savedResult = {
      archetype: nextResult.archetype,
      traits: nextResult.traits,
      summary: nextResult.summary,
      completedAt: new Date().toISOString(),
    }
    saveQuizResult(savedResult)
    setResult(nextResult)
  }

  function continueQuiz() {
    if (step === travelQuiz.length - 1) {
      finishQuiz(answers)
      return
    }
    setStep((current) => current + 1)
  }

  function skipQuestion() {
    if (step === travelQuiz.length - 1) {
      finishQuiz(answers)
      return
    }
    setStep((current) => current + 1)
  }

  async function shareResult() {
    if (!result) return
    const shareText = getShareText(result.archetype, result.summary)

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My travel vibe', text: shareText })
        setShareMessage('Your travel vibe is ready to share.')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setShareMessage('Sharing is unavailable right now. You can still copy your result.')
      }
      return
    }

    if (!navigator.clipboard) {
      setShareMessage('Copying is unavailable in this browser.')
      return
    }

    try {
      await navigator.clipboard.writeText(shareText)
      setShareMessage('Your travel vibe has been copied.')
    } catch {
      setShareMessage('Could not copy your result. Please try again.')
    }
  }

  if (result) {
    return (
      <div className="quiz-screen result-screen">
        <header className="quiz-topbar">
          <span className="quiz-brand"><Compass size={17} /> THE STRANGER SEAT</span>
          <span className="quiz-overline">YOUR TRAVEL VIBE</span>
        </header>
        <main className="quiz-content result-content">
          <motion.div
            className="result-card"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="result-orbit orbit-one" />
            <div className="result-orbit orbit-two" />
            <span className="result-kicker"><Sparkles size={14} /> YOUR TRAVEL ARCHETYPE</span>
            <span className="result-icon"><ResultIcon size={29} strokeWidth={1.8} /></span>
            <h1>{result.archetype}</h1>
            <div className="trait-list">
              {result.traits.map((trait) => <span key={trait}>{trait}</span>)}
            </div>
            <div className="result-divider" />
            <span className="result-summary-label">YOUR TRAVEL VIBE</span>
            <p>{result.summary}</p>
            <div className="result-signature">
              <span><Compass size={13} /> THE STRANGER SEAT</span>
              <span>A LITTLE LESS ALONE</span>
            </div>
          </motion.div>
          <div className="result-message">
            <h2>There’s no one right way to travel.</h2>
            <p>This is a starting point for meeting people who make your trip feel more like yours.</p>
          </div>
          <button className="share-result-button" onClick={shareResult}>
            <Share2 size={16} /> Share your travel vibe <Copy size={14} className="share-copy-icon" />
          </button>
          <p className="share-feedback" role="status" aria-live="polite">{shareMessage}</p>
          <button className="primary-quiz-button" onClick={() => navigate('/matches')}>
            See my travel matches <ArrowRight size={16} />
          </button>
        </main>
        <footer className="quiz-footer"><ShieldCheck size={13} /> Your answers stay private and help shape useful connections.</footer>
      </div>
    )
  }

  return (
    <div className="quiz-screen">
      <header className="quiz-topbar">
        <span className="quiz-brand"><Compass size={17} /> THE STRANGER SEAT</span>
        <button className="quiz-skip-all" onClick={() => finishQuiz({})}>Skip quiz</button>
      </header>
      <div className="quiz-progress-wrap">
        <div className="quiz-progress-meta">
          <span>GET TO KNOW YOUR TRAVEL VIBE</span>
          <span>{step + 1} <i>of</i> {travelQuiz.length}</span>
        </div>
        <div className="quiz-progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={travelQuiz.length} aria-valuenow={step + 1}>
          {travelQuiz.map((item, index) => (
            <span className={index <= step ? 'complete' : ''} key={item.id} />
          ))}
        </div>
      </div>

      <main className="quiz-content">
        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            className="quiz-question"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            aria-labelledby={`question-${question.id}`}
          >
            <span className="quiz-step-label">A FEW THOUGHTFUL QUESTIONS</span>
            <h1 id={`question-${question.id}`} tabIndex={-1}>{question.prompt}</h1>
            <p className="quiz-helper">{question.helper}</p>
            <div className="quiz-options" role={question.multiple ? 'group' : 'radiogroup'} aria-label={question.prompt}>
              {question.options.map((option, index) => {
                const Icon = optionIcons[option.id] ?? Sparkles
                const selected = selectedOptions.includes(option.id)
                return (
                  <button
                    className={`quiz-option${selected ? ' selected' : ''}`}
                    key={option.id}
                    role={question.multiple ? 'checkbox' : 'radio'}
                    aria-checked={selected}
                    onClick={() => selectOption(question.id, option.id, Boolean(question.multiple))}
                  >
                    <span className="quiz-option-icon"><Icon size={17} strokeWidth={1.8} /></span>
                    <span className="quiz-option-copy">
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                    <span className="quiz-option-select">{selected ? <Check size={14} /> : question.multiple ? null : <span className="radio-dot" />}</span>
                    <span className="sr-only">Option {index + 1}</span>
                  </button>
                )
              })}
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="quiz-actions">
        <div className="quiz-action-secondary">
          <button
            className="back-quiz-button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            aria-label="Previous question"
          >
            <ArrowLeft size={16} />
          </button>
          <button className="skip-question-button" onClick={skipQuestion}>Skip</button>
        </div>
        <button className="primary-quiz-button" onClick={continueQuiz} disabled={selectedOptions.length === 0}>
          {step === travelQuiz.length - 1 ? 'See my travel vibe' : 'Continue'}
          <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  )
}
