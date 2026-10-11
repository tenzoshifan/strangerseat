import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Coffee,
  Flag,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Send,
  ShieldCheck,
  Star,
  UserRoundX,
  UsersRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatMessages as mockMessages, chats, quickReplies, reviewTags, type ChatMessage, type ChatReport, type PartnerReview } from '../data/chats'
import { discoverPlaces } from '../data/discover'
import { travellers } from '../data/travellers'
import { useAppStore } from '../store/appStore'
import { JourneySteps } from './DestinationStartPage'

const emptyMessages: ChatMessage[] = []
const emptyIds: string[] = []
const emptyReviews: PartnerReview[] = []
const emptyReports: ChatReport[] = []
const reportReasons = ['Unwanted messages', 'Unsafe meetup suggestion', 'Impersonation', 'Other concern']
const disappearingAfterMs = 24 * 60 * 60 * 1000

function formatMessageTime(timestamp: string) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp))
}

function hoursLeft(timestamp: string, now: number) {
  return Math.min(24, Math.max(1, Math.ceil((new Date(timestamp).getTime() - now) / (60 * 60 * 1000))))
}

function createLocalMessage(chatId: string, text: string): ChatMessage {
  const sentAt = new Date().toISOString()
  return {
    id: `${chatId}-you-${Date.parse(sentAt)}-${Math.random().toString(36).slice(2, 7)}`,
    chatId,
    sender: 'you',
    text,
    sentAt,
    expiresAt: new Date(Date.parse(sentAt) + disappearingAfterMs).toISOString(),
  }
}

function createPartnerReview(chatId: string, travellerId: string, rating: number, tags: string[]): PartnerReview {
  return {
    chatId,
    travellerId,
    rating,
    tags,
    submittedAt: new Date().toISOString(),
  }
}

function createChatReport(chatId: string, travellerId: string, reason: string): ChatReport {
  return { chatId, travellerId, reason, submittedAt: new Date().toISOString() }
}

export function ChatsPage() {
  const navigate = useNavigate()
  const settings = useAppStore((state) => state.settings)
  const destination = settings.destination
  const storedMessages = settings.chatMessages ?? emptyMessages
  const blockedTravellerIds = settings.blockedTravellerIds ?? emptyIds
  const partnerReviews = settings.partnerReviews ?? emptyReviews
  const chatReports = settings.chatReports ?? emptyReports
  const updateSettings = useAppStore((state) => state.updateSettings)
  const tripGeneration = settings.tripGeneration ?? 0
  const tripStartedAt = new Date(settings.tripStartedAt ?? 0).getTime()
  const messages = useMemo(
    () => [
      ...(tripGeneration === 0 ? mockMessages : []),
      ...storedMessages.filter((message) => new Date(message.sentAt).getTime() >= tripStartedAt),
    ],
    [storedMessages, tripGeneration, tripStartedAt],
  )
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState<'report' | 'block' | null>(null)
  const [reportReason, setReportReason] = useState(reportReasons[0])
  const [notice, setNotice] = useState('')
  const [rating, setRating] = useState(0)
  const [selectedReviewTags, setSelectedReviewTags] = useState<string[]>([])
  const threadEndRef = useRef<HTMLDivElement>(null)
  const tripExpired = new Date(settings.tripEndsAt ?? 0).getTime() <= now
  const isVerified = settings.verificationStatus === 'verified'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const unexpiredMessages = storedMessages.filter((message) => new Date(message.expiresAt).getTime() > now)
    if (unexpiredMessages.length !== storedMessages.length) {
      updateSettings({ chatMessages: unexpiredMessages })
    }
  }, [now, storedMessages, updateSettings])

  const activeChats = useMemo(
    () => chats
      .filter((chat) => chat.destination === destination && !blockedTravellerIds.includes(chat.travellerId))
      .flatMap((chat) => {
        const traveller = travellers.find((person) => person.id === chat.travellerId)
        if (!traveller?.verified) return []
        const latestMessage = messages
          .filter((message) => message.chatId === chat.id && new Date(message.expiresAt).getTime() > now)
          .sort((first, second) => second.sentAt.localeCompare(first.sentAt))[0]
        return [{ chat, traveller, latestMessage }]
      }),
    [blockedTravellerIds, destination, messages, now],
  )
  const selectedEntry = tripExpired || !isVerified
    ? null
    : activeChats.find((entry) => entry.chat.id === selectedChatId) ?? null
  const threadMessages = selectedEntry
    ? messages
      .filter((message) => message.chatId === selectedEntry.chat.id && new Date(message.expiresAt).getTime() > now)
      .sort((first, second) => first.sentAt.localeCompare(second.sentAt))
    : []
  const meetup = selectedEntry
    ? discoverPlaces.find((place) => place.id === selectedEntry.chat.publicMeetupCafeId && place.destination === destination)
    : undefined
  const existingReview = selectedEntry
    ? partnerReviews.find((review) => review.chatId === selectedEntry.chat.id)
    : undefined
  const canReview = Boolean(selectedEntry?.chat.tripFinished && !existingReview)

  useEffect(() => {
    if (!selectedChatId || !threadMessages.length) return
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [selectedChatId, threadMessages.length])

  function selectChat(chatId: string) {
    setSelectedChatId(chatId)
    setMessageText('')
    setNotice('')
    setMenuOpen(false)
    setRating(0)
    setSelectedReviewTags([])
  }

  function closeThread() {
    setSelectedChatId(null)
    setMenuOpen(false)
    setDialog(null)
  }

  function sendMessageText(text: string) {
    const trimmed = text.trim()
    if (!selectedEntry || !trimmed) return
    const newMessage = createLocalMessage(selectedEntry.chat.id, trimmed)
    updateSettings({ chatMessages: [...storedMessages, newMessage] })
    setMessageText('')
    setNotice('')
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessageText(messageText)
  }

  function sendMeetupProposal() {
    if (!selectedEntry || !meetup) return
    const message = createLocalMessage(selectedEntry.chat.id, `Public meetup idea: ${meetup.name}, ${meetup.neighbourhood}. Only if you're comfortable — we can keep chatting here too.`)
    updateSettings({ chatMessages: [...storedMessages, message] })
    setNotice('Public meetup suggestion sent. The other traveller can choose whether to respond.')
  }

  function toggleReviewTag(tag: string) {
    setSelectedReviewTags((current) => current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag])
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedEntry || rating === 0 || existingReview) return
    const review = createPartnerReview(selectedEntry.chat.id, selectedEntry.traveller.id, rating, selectedReviewTags)
    updateSettings({ partnerReviews: [...partnerReviews, review] })
    setNotice('Thank you. Your private review was saved on this device.')
  }

  function reportTraveller() {
    if (!selectedEntry) return
    const report = createChatReport(selectedEntry.chat.id, selectedEntry.traveller.id, reportReason)
    updateSettings({ chatReports: [...chatReports, report] })
    setDialog(null)
    setMenuOpen(false)
    setNotice(`Report noted: ${reportReason}. In this demo it stays on this device; no support team is notified.`)
  }

  function blockTraveller() {
    if (!selectedEntry) return
    updateSettings({ blockedTravellerIds: [...blockedTravellerIds, selectedEntry.traveller.id] })
    setSelectedChatId(null)
    setDialog(null)
    setNotice('Traveller blocked. Their chat is hidden on this device.')
  }

  function updateReviewRating(value: number) {
    setRating(value)
  }

  return (
    <div className={`page-content chats-page${selectedEntry ? ' thread-open' : ''}`}>
      <JourneySteps current={3} />
      {selectedEntry ? (
        <section className="chat-thread" aria-label={`Secret chat with ${selectedEntry.traveller.name}`}>
          <header className="thread-header">
            <button className="thread-back-button" aria-label="Back to conversations" onClick={closeThread}><ArrowLeft size={17} /></button>
            <span className="thread-avatar">{selectedEntry.traveller.initials}<i /></span>
            <div className="thread-person">
              <strong>{selectedEntry.traveller.name} <BadgeCheck size={13} aria-label="Verified traveller" /></strong>
              <small>{selectedEntry.traveller.archetype.replace('The ', '')} · {selectedEntry.chat.destination}</small>
            </div>
            <button className="thread-menu-button" aria-label="Chat safety options" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal size={18} /></button>
            {menuOpen && (
              <div className="thread-menu" role="menu">
                <button role="menuitem" onClick={() => { setDialog('report'); setMenuOpen(false) }}><Flag size={14} /> Report this traveller</button>
                <button role="menuitem" onClick={() => { setDialog('block'); setMenuOpen(false) }}><UserRoundX size={14} /> Block and hide chat</button>
              </div>
            )}
          </header>

          <div className="secret-chat-banner">
            <span className="secret-chat-icon"><LockKeyhole size={13} /></span>
            <span><strong>SECRET CHAT</strong><small>Local demo · not end-to-end encrypted</small></span>
            <span className="message-expiry-chip"><Clock3 size={11} /> 24h</span>
          </div>
          <div className="chat-ephemeral-note"><Clock3 size={12} /> Messages disappear from this device 24 hours after sending. Avoid sharing sensitive details or screenshots.</div>

          <div className="thread-messages" aria-live="polite">
            <div className="chat-day-divider"><span /> YOUR TRIP COMMUNITY <span /></div>
            {threadMessages.map((message) => (
              <article className={`chat-message ${message.sender === 'you' ? 'message-own' : 'message-other'}`} key={message.id}>
                {message.sender === 'traveller' && <span className="message-avatar">{selectedEntry.traveller.initials}</span>}
                <div className="chat-message-content">
                  <p>{message.text}</p>
                  <span>{formatMessageTime(message.sentAt)} <i>·</i> disappears in {hoursLeft(message.expiresAt, now)}h</span>
                </div>
              </article>
            ))}
            <div ref={threadEndRef} />
          </div>

          {notice && <div className="chat-inline-notice" role="status"><Check size={12} />{notice}<button aria-label="Dismiss message" onClick={() => setNotice('')}><X size={13} /></button></div>}

          {meetup && (
            <section className="meetup-suggestion">
              <span className="meetup-suggestion-icon"><Coffee size={14} /></span>
              <div><strong>A public place to meet</strong><small>{meetup.name} · {meetup.neighbourhood}</small></div>
              <button onClick={sendMeetupProposal}>Suggest <ArrowRight size={12} /></button>
            </section>
          )}

          {canReview && (
            <form className="partner-review-card" onSubmit={submitReview}>
              <div className="review-card-heading"><span><Star size={14} /></span><div><strong>How was your travel partner?</strong><small>Private feedback · helps the community build trust</small></div></div>
              <div className="review-stars" role="group" aria-label="Rate this travel partner">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={rating === value} onClick={() => updateReviewRating(value)}>
                    <Star size={19} fill={value <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <div className="review-tag-list">
                {reviewTags.map((tag) => (
                  <button className={selectedReviewTags.includes(tag) ? 'selected' : ''} key={tag} type="button" aria-pressed={selectedReviewTags.includes(tag)} onClick={() => toggleReviewTag(tag)}>
                    {selectedReviewTags.includes(tag) && <Check size={10} />}{tag}
                  </button>
                ))}
              </div>
              <button className="submit-review-button" type="submit" disabled={!rating}>Send private review</button>
            </form>
          )}
          {existingReview && <div className="review-saved-card" role="status"><ShieldCheck size={15} /> Private review saved · {existingReview.rating}/5 · {existingReview.tags.join(', ') || 'no tags'}</div>}

          <div className="quick-reply-row" aria-label="Quick replies">
            {quickReplies.map((reply) => <button key={reply} onClick={() => sendMessageText(reply)}>{reply}</button>)}
          </div>
          <form className="chat-compose" onSubmit={sendMessage}>
            <input aria-label="Write a helpful message" placeholder="Share a helpful detail…" value={messageText} onChange={(event) => setMessageText(event.target.value)} maxLength={500} />
            <button aria-label="Send message" type="submit" disabled={!messageText.trim()}><Send size={16} /></button>
          </form>
          <div className="thread-safety-footer"><ShieldCheck size={12} /> Keep plans public, trust your pace, and leave whenever you like.</div>
        </section>
      ) : tripExpired ? (
        <section className="safety-gate-card">
          <span className="safety-card-icon amber"><Clock3 size={17} /></span>
          <span className="eyebrow">COMMUNITY CLOSED</span>
          <h2>This trip has ended.</h2>
          <p>Your temporary community is closed. Saved personal plans remain on this device; start a new trip to meet travellers again.</p>
          <button className="safety-primary-button" onClick={() => navigate('/safety')}>Open Privacy & safety <ArrowRight size={13} /></button>
        </section>
      ) : !isVerified ? (
        <section className="safety-gate-card">
          <span className="safety-card-icon teal"><BadgeCheck size={17} /></span>
          <span className="eyebrow">VERIFICATION REQUIRED</span>
          <h2>Chats open after verification.</h2>
          <p>Finish the phone, ID, and selfie demo checks before messaging. Unverified travellers cannot send or receive chats in this preview.</p>
          <button className="safety-primary-button" onClick={() => navigate('/safety')}>Verify traveller <ArrowRight size={13} /></button>
        </section>
      ) : (
        <>
          <section className="greeting-block chats-intro">
            <span className="eyebrow">TRAVEL, NOT SMALL TALK · {destination.toUpperCase()}</span>
            <h2>Conversations</h2>
            <p>Helpful details with verified travellers going somewhere similar.</p>
          </section>
          <div className="chat-safety-card">
            <span className="safety-icon"><LockKeyhole size={17} /></span>
            <div><strong>Your space, your pace</strong><p>Chats open only after mutual opt-in. Messages are temporary.</p></div>
            <ShieldCheck size={17} className="safety-check" />
          </div>
          {notice && <div className="chat-inline-notice" role="status"><Check size={12} />{notice}<button aria-label="Dismiss message" onClick={() => setNotice('')}><X size={13} /></button></div>}
          <section className="chat-list-section">
            <div className="chat-list-heading">            <div><h3>Your trip chats</h3><p>{activeChats.length} verified {activeChats.length === 1 ? 'conversation' : 'conversations'} in {destination}</p></div><span className="chat-list-expiry"><Clock3 size={11} /> Temporary</span></div>
            {activeChats.length ? activeChats.map(({ chat, traveller, latestMessage }) => (
              <button className="chat-list-card" key={chat.id} onClick={() => selectChat(chat.id)}>
                <span className="chat-list-avatar">{traveller.initials}<i /></span>
                <span className="chat-list-copy">
                  <span className="chat-list-name">{traveller.name}<BadgeCheck size={12} aria-label="Verified traveller" /></span>
                  <span className="chat-list-preview">{latestMessage?.text ?? 'Start a practical travel conversation.'}</span>
                  <span className="chat-list-meta"><Clock3 size={10} /> {chat.expiresInHours}h community window <i>·</i> {chat.updatedAt}</span>
                </span>
                <span className="chat-list-end"><span className="chat-secret-pill"><LockKeyhole size={10} /> SECRET</span><ArrowRight size={14} /></span>
              </button>
            )) : (
              <div className="empty-state chat-empty-state">
                <span className="empty-illustration"><MessageCircle size={25} /></span>
                <h3>No verified conversations yet</h3>
                <p>Chat becomes available after a verified traveller accepts your request. You stay in control at every step.</p>
              </div>
            )}
          </section>
          <div className="chat-safety-reminder"><UsersRound size={14} /> Share practical tips freely; exact location only with mutual opt-in.</div>
        </>
      )}

      {dialog && selectedEntry && (
        <div className="chat-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}>
          <section className="chat-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="chat-dialog-title">
            <button className="chat-dialog-close" aria-label="Close" onClick={() => setDialog(null)}><X size={16} /></button>
            {dialog === 'report' ? (
              <>
                <span className="chat-dialog-icon report"><Flag size={17} /></span>
                <h3 id="chat-dialog-title">Report a concern</h3>
                <p>Your safety matters. Choose the closest reason. This mock report stays on this device and does not reach a support team.</p>
                <label className="report-reason-label" htmlFor="report-reason">Reason</label>
                <select id="report-reason" value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
                  {reportReasons.map((reason) => <option key={reason}>{reason}</option>)}
                </select>
                <div className="chat-dialog-actions"><button onClick={() => setDialog(null)}>Cancel</button><button className="danger-action" onClick={reportTraveller}>Save report</button></div>
              </>
            ) : (
              <>
                <span className="chat-dialog-icon block"><UserRoundX size={18} /></span>
                <h3 id="chat-dialog-title">Block {selectedEntry.traveller.name}?</h3>
                <p>Their conversation will be hidden on this device. In this mock app, blocking is local and does not send a notification.</p>
                <div className="chat-dialog-actions"><button onClick={() => setDialog(null)}>Keep chat</button><button className="danger-action" onClick={blockTraveller}>Block traveller</button></div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
