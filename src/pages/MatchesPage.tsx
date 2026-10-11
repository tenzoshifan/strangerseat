import { ArrowRight, BadgeCheck, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JourneySteps } from './DestinationStartPage'
import { travellers } from '../data/travellers'
import { calculateMatchPercent } from '../lib/matching'
import { useAppStore } from '../store/appStore'

const DestinationCommunityMap = lazy(() => import('../components/DestinationCommunityMap').then((module) => ({ default: module.DestinationCommunityMap })))

export function MatchesPage() {
  const navigate = useNavigate()
  const quizResult = useAppStore((state) => state.quizResult)
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const destination = settings.destination
  const verificationStatus = settings.verificationStatus ?? 'unverified'
  const pendingIds = settings.pendingChatRequestIds ?? []
  const [now] = useState(() => Date.now())
  const [query, setQuery] = useState('')
  const matches = useMemo(
    () => travellers
      .filter((traveller) => traveller.destination === destination && !(settings.blockedTravellerIds ?? []).includes(traveller.id))
      .map((traveller) => ({ traveller, match: calculateMatchPercent(traveller.archetype, quizResult?.archetype ?? 'The Solo Sharer') }))
      .sort((first, second) => second.match - first.match),
    [destination, quizResult?.archetype, settings.blockedTravellerIds],
  )
  const tripExpired = new Date(settings.tripEndsAt ?? 0).getTime() <= now
  const visibleMatches = matches.filter(({ traveller }) =>
    `${traveller.name} ${traveller.archetype} ${traveller.status} ${traveller.event ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  function requestChat(travellerId: string) {
    if (verificationStatus !== 'verified' || tripExpired) return
    if (pendingIds.includes(travellerId)) return
    updateSettings({ pendingChatRequestIds: [...pendingIds, travellerId] })
  }

  return (
    <div className="page-content journey-page matches-page">
      <JourneySteps current={2} />
      <section className="journey-intro">
        <span className="journey-icon"><Sparkles size={20} /></span>
        <span className="eyebrow">STEP 2 · PEOPLE GOING TO {destination.toUpperCase()}</span>
        <h2>Find your kind of traveller.</h2>
        <p>Browse people heading to the same place. A match is only a suggestion—connect when it feels right.</p>
      </section>
      <button className="journey-change-place" onClick={() => navigate('/onboarding')}><MapPin size={13} /> Change destination</button>
      {!quizResult && (
        <button className="match-personalize-link" onClick={() => navigate('/quiz')}>
          <Sparkles size={14} /> Answer a few optional questions to personalize your matches <ArrowRight size={13} />
        </button>
      )}
      <label className="matches-search">
        <Search size={15} />
        <input aria-label="Search travellers in this destination" placeholder={`Search people going to ${destination}`} value={query} onChange={(event) => setQuery(event.target.value)} />
        {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X size={14} /></button>}
      </label>
      <Suspense fallback={<div className="discovery-map-loading" role="status">Preparing the destination map…</div>}>
        <DestinationCommunityMap destination={destination} />
      </Suspense>
      {visibleMatches.length ? (
        <div className="journey-match-list">
          {visibleMatches.map(({ traveller, match }) => {
            const pending = pendingIds.includes(traveller.id)
            return (
              <article className="journey-match-card" key={traveller.id}>
                <div className="journey-match-head">
                  <span className="journey-avatar">{traveller.initials}</span>
                  <span className="journey-person"><strong>{traveller.name} {traveller.verified && <BadgeCheck size={13} aria-label="Verified traveller" />}</strong><small>{traveller.archetype} · {traveller.verified ? 'Verified' : 'Not verified'}</small></span>
                  <span className="journey-match-score">{match}%<small>vibe match</small></span>
                </div>
                <p>{traveller.status}</p>
                {traveller.event && <span className="journey-event"><Sparkles size={11} /> {traveller.event}</span>}
                <button className={`journey-connect-button${pending ? ' pending' : ''}`} onClick={() => requestChat(traveller.id)} disabled={pending || verificationStatus !== 'verified' || !traveller.verified || tripExpired}>
                  {pending ? <><ShieldCheck size={14} /> Request sent · waiting for mutual opt-in</> : !traveller.verified ? <><ShieldCheck size={14} /> Traveller not verified</> : verificationStatus !== 'verified' ? <><ShieldCheck size={14} /> Verify to request a chat</> : <><MessageCircle size={14} /> Request to connect</>}
                </button>
                {verificationStatus !== 'verified' && traveller.verified && !pending && <button className="journey-verify-link" onClick={() => navigate('/safety')}>Verification keeps the community safer · Review steps</button>}
              </article>
            )
          })}
        </div>
      ) : matches.length ? (
        <section className="journey-empty-card">
          <h3>No travellers match that search.</h3>
          <p>Try a name, travel style, activity, or event.</p>
          <button className="journey-secondary-button" onClick={() => setQuery('')}>Clear search</button>
        </section>
      ) : (
        <section className="journey-empty-card">
          <span className="journey-icon"><Sparkles size={20} /></span>
          <h3>No travellers here just yet.</h3>
          <p>Try another destination or check back as more travellers join.</p>
          <button className="journey-secondary-button" onClick={() => navigate('/onboarding')}>Choose another place</button>
        </section>
      )}
      <section className="journey-next-step">
        <span className="eyebrow">STEP 3 · CONNECT & CHAT</span>
        <h3>Chat opens after you both agree.</h3>
        <p>Send a request first. Once both travellers opt in and complete verification, continue the conversation in Chats.</p>
        <button className="journey-secondary-button" onClick={() => navigate('/chats')}>Go to Chats <ArrowRight size={14} /></button>
      </section>
      <button className="journey-map-link" onClick={() => navigate('/map')}>Explore the {destination} community map</button>
    </div>
  )
}
