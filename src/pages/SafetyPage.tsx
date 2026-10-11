import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  Clock3,
  Copy,
  LockKeyhole,
  MapPin,
  Moon,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { travellers } from '../data/travellers'
import { useAppStore, type PrivacyMode, type VerificationStatus } from '../store/appStore'

type VerificationStep = 'intro' | 'phone' | 'id' | 'selfie' | 'done'
type Notice = { tone: 'success' | 'warning'; text: string } | null

const emptyIds: string[] = []
const emptyReports: { chatId: string; travellerId: string; reason: string; submittedAt: string }[] = []

function getEmergencyNumber(destination: string) {
  return destination === 'Dubai' ? '999' : '112'
}

function isValidPhone(phone: string) {
  return /^\+?[0-9\s()-]{7,20}$/.test(phone.trim())
}

export function SafetyPage() {
  const navigate = useNavigate()
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [verificationStep, setVerificationStep] = useState<VerificationStep>(
    settings.verificationStatus === 'verified' ? 'done' : 'intro',
  )
  const [otp, setOtp] = useState('')
  const [idConfirmed, setIdConfirmed] = useState(false)
  const [selfieConfirmed, setSelfieConfirmed] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [contactName, setContactName] = useState(settings.trustedContactName ?? '')
  const [contactPhone, setContactPhone] = useState(settings.trustedContactPhone ?? '')
  const [contactSaved, setContactSaved] = useState(false)
  const [tripLength, setTripLength] = useState('7')
  const [notice, setNotice] = useState<Notice>(null)
  const [sosConfirmOpen, setSosConfirmOpen] = useState(false)

  const tripEnd = new Date(settings.tripEndsAt ?? now).getTime()
  const tripExpired = tripEnd <= now
  const daysRemaining = Math.max(0, Math.ceil((tripEnd - now) / (24 * 60 * 60 * 1000)))
  const blockedTravellerIds = settings.blockedTravellerIds ?? emptyIds
  const chatReports = settings.chatReports ?? emptyReports
  const privacyOptions: { mode: PrivacyMode; title: string; detail: string; icon: typeof UsersRound }[] = [
    { mode: 'community', title: 'My travellers', detail: 'Share an approximate area with this destination community.', icon: UsersRound },
    { mode: 'selected', title: 'Select travellers', detail: 'Choose who can see your approximate area on the map.', icon: UserRoundCheck },
    { mode: 'ghost', title: 'Ghost mode', detail: 'Hide your location from everyone in the community.', icon: Moon },
  ]
  const canShareTrip = Boolean(settings.tripSharingEnabled && settings.trustedContactName && isValidPhone(settings.trustedContactPhone))
  const emergencyNumber = getEmergencyNumber(settings.destination)
  const verificationCopy = useMemo(() => {
    const copy: Record<VerificationStatus, string> = {
      unverified: 'Chat and location requests are unavailable until you finish the checks.',
      phone: 'Phone step complete. Finish the document and selfie checks for your verified badge.',
      verified: 'Your mock verification is complete. You can request chats with verified travellers.',
    }
    return copy[settings.verificationStatus ?? 'unverified']
  }, [settings.verificationStatus])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  function setVerificationStatus(status: VerificationStatus) {
    updateSettings({ verificationStatus: status })
  }

  function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setNotice({ tone: 'warning', text: 'Enter a six-digit demo code to continue.' })
      return
    }
    setVerificationStatus('phone')
    setVerificationStep('id')
    setNotice({ tone: 'success', text: 'Demo phone check complete. No message was sent.' })
  }

  function continueIdCheck() {
    if (!idConfirmed) {
      setNotice({ tone: 'warning', text: 'Confirm that you reviewed the ID-check demo to continue.' })
      return
    }
    setVerificationStep('selfie')
    setNotice(null)
  }

  function finishSelfieCheck() {
    if (!selfieConfirmed) {
      setNotice({ tone: 'warning', text: 'Confirm the selfie-step demo to finish.' })
      return
    }
    setVerificationStatus('verified')
    setVerificationStep('done')
    setNotice({ tone: 'success', text: 'Verified Traveller badge unlocked for this local preview.' })
  }

  function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!contactName.trim() || !isValidPhone(contactPhone)) {
      setNotice({ tone: 'warning', text: 'Add a trusted contact name and a valid phone number.' })
      return
    }
    updateSettings({ trustedContactName: contactName.trim(), trustedContactPhone: contactPhone.trim() })
    setContactSaved(true)
    setNotice({ tone: 'success', text: 'Trusted contact saved on this device only.' })
  }

  function toggleTripSharing() {
    if (!canShareTrip) {
      setNotice({ tone: 'warning', text: 'Save a trusted contact name and valid phone number before enabling trip sharing.' })
      return
    }
    updateSettings({ tripSharingEnabled: !settings.tripSharingEnabled })
    setNotice({
      tone: 'success',
      text: settings.tripSharingEnabled
        ? 'Trip sharing paused. No location is being shared.'
        : 'Trip sharing is ready. Updates are sent only when you tap Share trip update.',
    })
  }

  async function shareTripUpdate() {
    if (!canShareTrip) {
      setNotice({ tone: 'warning', text: 'Save a trusted contact and turn on trip sharing first.' })
      return
    }
    const text = `A trip check-in from The Stranger Seat\nI’m travelling in ${settings.destination}. My community shares approximate areas only; this message does not include live location.\nTrusted contact: ${settings.trustedContactName} (${settings.trustedContactPhone})`
    try {
      if (navigator.share) {
        await navigator.share({ title: `${settings.destination} trip check-in`, text })
        setNotice({ tone: 'success', text: 'Trip check-in shared using your device share sheet.' })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setNotice({ tone: 'success', text: 'Trip check-in copied. Choose when and how to send it.' })
      } else {
        setNotice({ tone: 'warning', text: 'Sharing is unavailable in this browser. Your trip settings remain saved.' })
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setNotice({ tone: 'warning', text: 'Share cancelled. No check-in was sent.' })
      } else {
        setNotice({ tone: 'warning', text: 'Could not open sharing. Your trip settings remain saved.' })
      }
    }
  }

  function setTripEnd() {
    const days = Number(tripLength)
    if (!Number.isFinite(days) || days < 1 || days > 30) {
      setNotice({ tone: 'warning', text: 'Choose a trip length between 1 and 30 days.' })
      return
    }
    updateSettings({ tripEndsAt: new Date(now + days * 24 * 60 * 60 * 1000).toISOString() })
    setNotice({ tone: 'success', text: `This ${settings.destination} community will close automatically in ${days} days.` })
  }

  function restartTrip() {
    const tripStartedAt = settings.tripStartedAt ?? new Date(now).toISOString()
    const tripHistory = settings.tripHistory ?? []
    const currentTripId = `${settings.tripGeneration ?? 0}-${tripStartedAt}`
    const finishedTrip = {
      id: currentTripId,
      destination: settings.destination,
      startedAt: tripStartedAt,
      endedAt: settings.tripEndsAt ?? new Date(now).toISOString(),
      itineraryStopCount: (settings.itineraryStops ?? []).filter((stop) => stop.destination === settings.destination).length,
      joinedEventCount: (settings.joinedEventIds ?? []).length,
    }
    updateSettings({
      tripStartedAt: new Date(now).toISOString(),
      tripEndsAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tripGeneration: (settings.tripGeneration ?? 0) + 1,
      tripHistory: tripHistory.some((trip) => trip.id === currentTripId)
        ? tripHistory
        : [finishedTrip, ...tripHistory].slice(0, 12),
      joinedEventIds: [],
      pendingChatRequestIds: [],
      pendingLocationRequestIds: [],
    })
    setNotice({ tone: 'success', text: `A new ${settings.destination} community is open for seven days.` })
  }

  function changePrivacy(mode: PrivacyMode) {
    updateSettings({ privacyMode: mode })
    setNotice({ tone: 'success', text: mode === 'ghost' ? 'Ghost mode is on. Your approximate location is hidden.' : 'Location privacy updated. Exact live location remains private.' })
  }

  async function copySosMessage() {
    const sosText = `I may need help. I’m travelling in ${settings.destination}. Please contact me and call local emergency services (${emergencyNumber}) if you cannot reach me.`
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(sosText)
        setNotice({ tone: 'success', text: 'Emergency message copied. Send it to your trusted contact when ready.' })
      } else {
        setNotice({ tone: 'warning', text: 'Clipboard access is unavailable. You can still use the emergency call option.' })
      }
    } catch {
      setNotice({ tone: 'warning', text: 'Could not copy the message. You can still use the emergency call option.' })
    }
  }

  return (
    <div className="page-content safety-page">
      <section className="safety-page-intro">
        <span className="safety-page-icon"><ShieldCheck size={18} /></span>
        <div><span className="eyebrow">YOUR SAFETY, YOUR CALL</span><h2>Privacy & safety</h2><p>Practical safeguards. Nothing is shared without your choice.</p></div>
      </section>

      {notice && <div className={`safety-notice safety-notice-${notice.tone}`} role="status"><Check size={13} />{notice.text}<button aria-label="Dismiss notice" onClick={() => setNotice(null)}><X size={13} /></button></div>}

      <section className="safety-card verification-card">
        <div className="safety-card-heading">
          <span className="safety-card-icon teal"><BadgeCheck size={16} /></span>
          <div><h3>Traveller verification</h3><p>Mock phone, ID, and selfie checks</p></div>
          <span className={`verification-state${settings.verificationStatus === 'verified' ? ' is-verified' : ''}`}>{settings.verificationStatus === 'verified' ? 'VERIFIED' : 'NOT VERIFIED'}</span>
        </div>
        <p className="safety-card-copy">{verificationCopy}</p>
        <div className="verification-steps" aria-label="Verification progress">
          {[
            { label: 'Phone OTP', done: settings.verificationStatus === 'phone' || settings.verificationStatus === 'verified' },
            { label: 'ID check', done: settings.verificationStatus === 'verified' && idConfirmed },
            { label: 'Selfie', done: settings.verificationStatus === 'verified' && selfieConfirmed },
          ].map((step, index) => <span className={step.done ? 'done' : ''} key={step.label}><i>{step.done ? <Check size={10} /> : index + 1}</i>{step.label}</span>)}
        </div>
        {verificationStep === 'intro' && (
          <div className="verification-action">
            <p>For this prototype, each step is simulated. No phone message, ID scan, or selfie leaves your device.</p>
            <button className="safety-primary-button" onClick={() => { setVerificationStep('phone'); setNotice(null) }}>Start demo verification <ArrowRight size={13} /></button>
          </div>
        )}
        {verificationStep === 'phone' && (
          <form className="verification-action" onSubmit={submitOtp}>
            <label htmlFor="demo-otp">Enter any six-digit demo code</label>
            <div className="verification-input-row"><input id="demo-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" /><button className="safety-primary-button" type="submit">Continue</button></div>
            <small>No OTP will be sent. The code is not stored.</small>
          </form>
        )}
        {verificationStep === 'id' && (
          <div className="verification-action">
            <p><LockKeyhole size={12} /> ID check demo: review a document step without uploading or saving an ID image.</p>
            <label className="safety-checkbox"><input type="checkbox" checked={idConfirmed} onChange={(event) => setIdConfirmed(event.target.checked)} /> I understand this is a local verification simulation.</label>
            <button className="safety-primary-button" onClick={continueIdCheck}>Continue to selfie step <ArrowRight size={13} /></button>
          </div>
        )}
        {verificationStep === 'selfie' && (
          <div className="verification-action">
            <p><UserRoundCheck size={13} /> Selfie check demo: no camera opens and no image is captured.</p>
            <label className="safety-checkbox"><input type="checkbox" checked={selfieConfirmed} onChange={(event) => setSelfieConfirmed(event.target.checked)} /> I understand no selfie is captured in this preview.</label>
            <button className="safety-primary-button" onClick={finishSelfieCheck}>Finish demo verification <BadgeCheck size={13} /></button>
          </div>
        )}
        {verificationStep === 'done' && settings.verificationStatus === 'verified' && (
          <div className="verification-complete"><BadgeCheck size={14} /> Verified Traveller badge active on this device.</div>
        )}
        {settings.verificationStatus === 'verified' && (
          <button className="safety-text-button" onClick={() => { setVerificationStatus('unverified'); setVerificationStep('intro'); setIdConfirmed(false); setSelfieConfirmed(false); setOtp('') }}>Reset verification demo</button>
        )}
      </section>

      <section className="safety-card">
        <div className="safety-card-heading">
          <span className="safety-card-icon violet"><MapPin size={15} /></span>
          <div><h3>Location privacy</h3><p>Exact location stays off the map</p></div>
        </div>
        <div className="safety-privacy-options">
          {privacyOptions.map(({ mode, title, detail, icon: Icon }) => (
            <button className={`safety-privacy-option${settings.privacyMode === mode ? ' active' : ''}`} key={mode} aria-pressed={settings.privacyMode === mode} onClick={() => changePrivacy(mode)}>
              <span className="safety-privacy-icon"><Icon size={14} /></span><span><strong>{title}</strong><small>{detail}</small></span><span className="safety-radio">{settings.privacyMode === mode && <Check size={10} />}</span>
            </button>
          ))}
        </div>
        {settings.privacyMode === 'selected' && (
          <div className="safety-selected-people">
            <span className="eyebrow">APPROXIMATE AREA SHARED WITH</span>
            {travellers.filter((traveller) => traveller.destination === settings.destination && !blockedTravellerIds.includes(traveller.id)).map((traveller) => {
              const selected = (settings.selectedTravellerIds ?? []).includes(traveller.id)
              return <label key={traveller.id}><input type="checkbox" checked={selected} onChange={() => updateSettings({ selectedTravellerIds: selected ? settings.selectedTravellerIds.filter((id) => id !== traveller.id) : [...settings.selectedTravellerIds, traveller.id] })} /><span>{traveller.initials}</span>{traveller.name}</label>
            })}
          </div>
        )}
      </section>

      <section className="safety-card">
        <div className="safety-card-heading">
          <span className="safety-card-icon amber"><UsersRound size={15} /></span>
          <div><h3>Trusted contact</h3><p>Choose someone you trust outside this trip</p></div>
        </div>
        <form className="trusted-contact-form" onSubmit={saveContact}>
          <label>Name<input value={contactName} onChange={(event) => { setContactName(event.target.value); setContactSaved(false) }} autoComplete="name" placeholder="Contact name" maxLength={60} /></label>
          <label>Phone<input value={contactPhone} onChange={(event) => { setContactPhone(event.target.value); setContactSaved(false) }} autoComplete="tel" inputMode="tel" placeholder="+1 555 010 0123" maxLength={24} /></label>
          <button className="safety-secondary-button" type="submit">{contactSaved ? <><Check size={13} /> Saved on device</> : 'Save trusted contact'}</button>
        </form>
        <div className="trip-share-setting">
          <span><strong>Trip check-ins</strong><small>Send a city-level update only when you choose.</small></span>
          <button className={`safety-toggle${settings.tripSharingEnabled ? ' enabled' : ''}`} role="switch" aria-checked={Boolean(settings.tripSharingEnabled)} aria-label="Enable trip check-ins" onClick={toggleTripSharing}><i /></button>
        </div>
        <button className="safety-secondary-button share-trip-button" disabled={!canShareTrip} onClick={shareTripUpdate}><Copy size={13} /> Share a trip update</button>
        {!canShareTrip && <small className="safety-field-hint">Save a trusted contact and turn on trip check-ins first.</small>}
      </section>

      <section className="safety-card trip-expiry-card">
        <div className="safety-card-heading">
          <span className={`safety-card-icon${tripExpired ? ' danger' : ' teal'}`}><Clock3 size={15} /></span>
          <div><h3>Temporary community</h3><p>Trip-bound, not a permanent group</p></div>
        </div>
        {tripExpired ? (
          <div className="trip-expired-note"><strong>This {settings.destination} community has closed.</strong><small>Traveller discovery and community chat stay unavailable until you start a new trip. Your saved plans remain on this device.</small><button className="safety-primary-button" onClick={restartTrip}><RotateCcw size={13} /> Start a new 7-day trip</button></div>
        ) : (
          <>
            <div className="trip-end-status"><Clock3 size={13} /><span>This community closes in <strong>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</strong>.</span></div>
            <label className="trip-length-label" htmlFor="trip-length">Set community end</label>
            <div className="trip-end-controls">
              <select id="trip-length" value={tripLength} onChange={(event) => setTripLength(event.target.value)}><option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select>
              <button className="safety-secondary-button" onClick={setTripEnd}>Update</button>
            </div>
            <small className="safety-field-hint">When the trip ends, this temporary community closes automatically. Your saved personal itinerary stays on your device.</small>
          </>
        )}
      </section>

      <section className="sos-card">
        <div className="sos-card-heading"><span><ShieldAlert size={18} /></span><div><h3>Need urgent help?</h3><p>Open safety actions for your current destination.</p></div></div>
        <button className="sos-trigger-button" onClick={() => setSosConfirmOpen(true)}>Open SOS options</button>
        <small>This preview never contacts emergency services unless you explicitly choose the call link.</small>
      </section>

      <section className="safety-card safety-records-card">
        <div className="safety-card-heading">
          <span className="safety-card-icon teal"><ShieldCheck size={15} /></span>
          <div><h3>Your safety controls</h3><p>Local settings on this device</p></div>
        </div>
        <div className="safety-record-row"><span>Blocked travellers</span><strong>{blockedTravellerIds.length}</strong></div>
        <div className="safety-record-row"><span>Reports saved locally</span><strong>{chatReports.length}</strong></div>
        <button className="safety-text-button" onClick={() => navigate('/profile')}>Back to your profile <ArrowRight size={12} /></button>
      </section>

      <section className="safety-card notifications-card">
        <span className="safety-card-icon violet"><Bell size={15} /></span><div><h3>Safety notifications</h3><p>Keep trip and consent reminders visible.</p></div><button className={`safety-toggle${settings.notificationsEnabled ? ' enabled' : ''}`} role="switch" aria-checked={settings.notificationsEnabled} aria-label="Safety notifications" onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}><i /></button>
      </section>

      <p className="safety-disclaimer">Verification, messaging, reports, and sharing are prototype-only and stay in local browser storage. This app is not emergency support.</p>

      {sosConfirmOpen && (
        <div className="safety-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSosConfirmOpen(false) }}>
          <section className="safety-modal" role="dialog" aria-modal="true" aria-labelledby="sos-title">
            <button className="safety-modal-close" aria-label="Close SOS options" onClick={() => setSosConfirmOpen(false)}><X size={15} /></button>
            <span className="sos-modal-icon"><ShieldAlert size={20} /></span>
            <h3 id="sos-title">SOS · {settings.destination}</h3>
            <p>This prototype does not dispatch help. If you are in immediate danger, contact local emergency services directly.</p>
            {settings.trustedContactName && <div className="sos-contact-reminder"><UsersRound size={13} /> Trusted contact: <strong>{settings.trustedContactName}</strong></div>}
            <button className="safety-secondary-button" onClick={copySosMessage}><Copy size={13} /> Copy emergency message</button>
            <a className="sos-call-link" href={`tel:${emergencyNumber}`}><Phone size={14} /> Call local emergency services ({emergencyNumber})</a>
            <small>Calls are initiated only if you tap the phone link. Your live location is not included.</small>
          </section>
        </div>
      )}
    </div>
  )
}
