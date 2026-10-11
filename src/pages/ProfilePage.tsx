import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  MapPin,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { stories } from '../data/stories'
import { useAppStore, type PrivacyMode } from '../store/appStore'

const emptyIds: string[] = []

const privacyChoices: { value: PrivacyMode; label: string; icon: typeof UsersRound }[] = [
  { value: 'community', label: 'Community', icon: UsersRound },
  { value: 'selected', label: 'Selected', icon: ShieldCheck },
  { value: 'ghost', label: 'Ghost', icon: Moon },
]

function formatTripDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function relativeDaysLabel(days: number) {
  if (days <= 0) return 'Trip ended'
  return `${days} ${days === 1 ? 'day' : 'days'} left`
}

export function ProfilePage() {
  const navigate = useNavigate()
  const quizResult = useAppStore((state) => state.quizResult)
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [now, setNow] = useState(() => Date.now())
  const savedStoryIds = settings.savedStoryIds ?? emptyIds
  const savedStories = useMemo(
    () => savedStoryIds
      .map((id) => stories.find((story) => story.id === id))
      .filter((story): story is (typeof stories)[number] => Boolean(story)),
    [savedStoryIds],
  )
  const tripEnd = new Date(settings.tripEndsAt ?? now).getTime()
  const tripExpired = tripEnd <= now
  const tripDaysRemaining = Math.max(0, Math.ceil((tripEnd - now) / (24 * 60 * 60 * 1000)))
  const itineraryCount = (settings.itineraryStops ?? []).filter((stop) => stop.destination === settings.destination).length
  const joinedEventCount = (settings.joinedEventIds ?? []).length
  const tripHistory = settings.tripHistory ?? []
  const verified = settings.verificationStatus === 'verified'
  const phoneChecked = settings.verificationStatus === 'phone'
  const hasTrustedContact = Boolean(settings.trustedContactName && settings.trustedContactPhone)
  const trustSignals = [
    { label: 'Travel vibe saved', points: quizResult ? 20 : 0, max: 20 },
    { label: 'Traveller verification', points: verified ? 35 : phoneChecked ? 15 : 0, max: 35 },
    { label: 'Trusted contact added', points: hasTrustedContact ? 20 : 0, max: 20 },
    { label: 'Privacy choice reviewed', points: settings.privacyMode !== 'community' ? 15 : 0, max: 15 },
    { label: 'Active trip dates set', points: !tripExpired ? 10 : 0, max: 10 },
  ]
  const trustScore = trustSignals.reduce((sum, signal) => sum + signal.points, 0)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  function setPrivacyMode(privacyMode: PrivacyMode) {
    updateSettings({ privacyMode })
  }

  return (
    <div className="page-content profile-page">
      <section className="profile-card">
        <div className="profile-avatar" aria-hidden="true">Y</div>
        <span className="eyebrow">YOUR TRAVEL PROFILE</span>
        <h2>{quizResult?.archetype ?? 'A little about you'}</h2>
        <p>{quizResult?.summary ?? 'Your profile stays focused on this trip—not a follower count.'}</p>
        <div className="profile-tags">
          {quizResult?.traits.map((trait) => <span key={trait}><Compass size={13} /> {trait}</span>)}
          <span className={verified ? 'verified-profile-tag' : ''}>
            <BadgeCheck size={13} /> {verified ? 'Verified traveller' : phoneChecked ? 'Phone checked' : 'Not verified'}
          </span>
        </div>
        <button className="retake-quiz-button" onClick={() => navigate('/quiz')}>Retake travel-vibe quiz</button>
      </section>

      <section className="profile-trust-card" aria-labelledby="trust-score-title">
        <div className="profile-section-heading">
          <span className="profile-section-icon teal"><ShieldCheck size={15} /></span>
          <div><h3 id="trust-score-title">Trust score</h3><p>Profile setup signals · demo estimate</p></div>
          <strong className="trust-score-value">{trustScore}<small>/100</small></strong>
        </div>
        <div className="trust-score-track" role="progressbar" aria-label="Trust setup score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={trustScore}><span style={{ width: `${trustScore}%` }} /></div>
        <div className="trust-signal-grid">
          {trustSignals.map((signal) => (
            <div className={`trust-signal${signal.points ? ' complete' : ''}`} key={signal.label}>
              <span>{signal.points ? <Check size={10} /> : <span className="trust-signal-dot" />}</span>
              <small>{signal.label}</small>
              <b>{signal.points}/{signal.max}</b>
            </div>
          ))}
        </div>
        <p className="trust-score-disclaimer">This is a local setup-completeness estimate, not a peer rating, safety guarantee, or judgment of you.</p>
      </section>

      <section className="profile-trip-section" aria-labelledby="profile-trips-title">
        <div className="profile-section-heading">
          <span className="profile-section-icon violet"><MapPin size={15} /></span>
          <div><h3 id="profile-trips-title">Your trips</h3><p>Temporary communities, kept in context</p></div>
          <span className="profile-trip-count">{tripHistory.length + 1} total</span>
        </div>
        <article className={`profile-current-trip${tripExpired ? ' ended' : ''}`}>
          <div className="profile-current-trip-top">
            <span className="profile-trip-destination"><MapPin size={12} /> {settings.destination}</span>
            <span className={`profile-trip-status${tripExpired ? ' ended' : ''}`}><i />{tripExpired ? 'ENDED' : 'CURRENT TRIP'}</span>
          </div>
          <strong>{formatTripDate(settings.tripStartedAt ?? new Date(now).toISOString())} – {formatTripDate(settings.tripEndsAt ?? new Date(now).toISOString())}</strong>
          <div className="profile-trip-metrics">
            <span><Clock3 size={11} /> {relativeDaysLabel(tripDaysRemaining)}</span>
            <span><Compass size={11} /> {itineraryCount} {itineraryCount === 1 ? 'saved stop' : 'saved stops'}</span>
            <span><UsersRound size={11} /> {joinedEventCount} joined {joinedEventCount === 1 ? 'plan' : 'plans'}</span>
          </div>
          <button className="profile-trip-link" onClick={() => navigate(tripExpired ? '/safety' : '/discover')}>
            {tripExpired ? 'Start or review a trip' : 'Open your itinerary'} <ArrowRight size={12} />
          </button>
        </article>
        {tripHistory.length > 0 && (
          <div className="profile-trip-history">
            <span className="eyebrow">PAST COMMUNITIES</span>
            {tripHistory.slice(0, 3).map((trip) => (
              <article className="profile-past-trip" key={trip.id}>
                <span className="past-trip-icon"><CalendarDays size={13} /></span>
                <span><strong>{trip.destination}</strong><small>{formatTripDate(trip.startedAt)} – {formatTripDate(trip.endedAt)}</small></span>
                <span className="past-trip-detail">{trip.itineraryStopCount} stops</span>
              </article>
            ))}
          </div>
        )}
        <p className="profile-trip-note">Trip history is saved only on this device. Communities close automatically; saved itinerary stops remain yours.</p>
      </section>

      <section className="profile-highlights-section" aria-labelledby="profile-highlights-title">
        <div className="profile-section-heading">
          <span className="profile-section-icon amber"><Bookmark size={14} /></span>
          <div><h3 id="profile-highlights-title">Your highlights</h3><p>Tips you chose to keep</p></div>
          <span className="profile-trip-count">{savedStories.length} saved</span>
        </div>
        {savedStories.length ? (
          <div className="profile-highlight-list">
            {savedStories.slice(0, 3).map((story) => (
              <button className="profile-highlight-row" key={story.id} onClick={() => navigate('/stories')}>
                <span className={`profile-highlight-icon story-scene-${story.scene}`}><Sparkles size={13} /></span>
                <span><strong>{story.location}</strong><small>{story.destination} · {story.tip}</small></span>
                <ArrowRight size={13} />
              </button>
            ))}
          </div>
        ) : (
          <div className="profile-empty-highlights"><Bookmark size={16} /><span><strong>No saved tips yet</strong><small>Save a useful story and it will be easy to find here.</small></span></div>
        )}
        <button className="profile-section-link" onClick={() => navigate('/stories')}>Browse trip stories <ArrowRight size={12} /></button>
      </section>

      <section className="profile-settings-section" aria-labelledby="profile-settings-title">
        <div className="profile-section-heading">
          <span className="profile-section-icon teal"><Compass size={15} /></span>
          <div><h3 id="profile-settings-title">Your settings</h3><p>Change these whenever your plans do</p></div>
        </div>
        <div className="profile-setting-group">
          <div className="profile-setting-label"><span><strong>Location privacy</strong><small>Your exact live location is never shared.</small></span><button className="profile-inline-link" onClick={() => navigate('/safety')}>More <ArrowRight size={11} /></button></div>
          <div className="profile-privacy-choices" role="group" aria-label="Location privacy mode">
            {privacyChoices.map(({ value, label, icon: Icon }) => (
              <button key={value} className={settings.privacyMode === value ? 'selected' : ''} aria-pressed={settings.privacyMode === value} onClick={() => setPrivacyMode(value)}><Icon size={12} />{label}</button>
            ))}
          </div>
        </div>
        <div className="profile-notification-setting">
          <span className="profile-setting-icon violet"><Bell size={14} /></span>
          <span><strong>Notifications</strong><small>{settings.notificationsEnabled ? 'Travel and safety reminders on' : 'Reminders are paused'}</small></span>
          <button className={`safety-toggle${settings.notificationsEnabled ? ' enabled' : ''}`} role="switch" aria-checked={settings.notificationsEnabled} aria-label="Notifications" onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}><i /></button>
        </div>
        <button className="profile-row profile-theme-row" onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}>
          <span className="row-icon violet">{settings.theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}</span>
          <span><strong>Appearance</strong><small>{settings.theme === 'dark' ? 'Dark theme' : 'Light theme'} · tap to switch</small></span>
          <span className="profile-theme-value">{settings.theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
        <button className="profile-row profile-safety-row" onClick={() => navigate('/safety')}>
          <span className="row-icon teal"><ShieldCheck size={16} /></span>
          <span><strong>Privacy & safety</strong><small>Verification, trusted contact, trip end, and SOS</small></span>
          <ArrowRight size={15} />
        </button>
      </section>

      <p className="profile-footer">Travel with a little more trust.<br />And a little less alone.</p>
    </div>
  )
}
