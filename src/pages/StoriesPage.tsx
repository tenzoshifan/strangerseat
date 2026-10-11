import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Coffee,
  Compass,
  Lightbulb,
  MapPin,
  Mountain,
  Send,
  ShieldCheck,
  Sparkles,
  Sunrise,
  UsersRound,
  Waves,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { travelHighlights, stories, type TravelStory } from '../data/stories'
import { useAppStore } from '../store/appStore'

const emptyStoryIds: string[] = []
const storyDurationMs = 6500

const sceneIcons = {
  creek: Waves,
  cafe: Coffee,
  coast: Sunrise,
  lanes: Compass,
  waterfront: Waves,
  garden: Mountain,
  tea: Mountain,
}

function timeAgo(sharedAt: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(sharedAt).getTime()) / 60_000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

function getFirstUnseenIndex(storyList: TravelStory[], viewedIds: string[]) {
  const unseenIndex = storyList.findIndex((story) => !viewedIds.includes(story.id))
  return unseenIndex < 0 ? 0 : unseenIndex
}

export function StoriesPage() {
  const navigate = useNavigate()
  const destination = useAppStore((state) => state.settings.destination)
  const tripEndsAt = useAppStore((state) => state.settings.tripEndsAt)
  const viewedStoryIds = useAppStore((state) => state.settings.viewedStoryIds ?? emptyStoryIds)
  const savedStoryIds = useAppStore((state) => state.settings.savedStoryIds ?? emptyStoryIds)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [clock, setClock] = useState(() => Date.now())
  const tripExpired = new Date(tripEndsAt ?? 0).getTime() <= clock
  const [viewerStories, setViewerStories] = useState<TravelStory[] | null>(null)
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [replyStatus, setReplyStatus] = useState('')
  const [replyText, setReplyText] = useState('')
  const [storyProgress, setStoryProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const activeStories = useMemo(
    () => stories
      .filter((story) => !tripExpired && story.destination === destination && new Date(story.expiresAt).getTime() > clock)
      .sort((first, second) => second.sharedAt.localeCompare(first.sharedAt)),
    [clock, destination, tripExpired],
  )
  const visibleHighlights = useMemo(
    () => travelHighlights.filter((highlight) => !tripExpired && highlight.destination === destination),
    [destination, tripExpired],
  )
  const activeStory = tripExpired || activeStoryIndex === null ? null : viewerStories?.[activeStoryIndex] ?? null
  const latestStory = activeStories[0]

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!activeStory || viewedStoryIds.includes(activeStory.id)) return
    updateSettings({ viewedStoryIds: [...viewedStoryIds, activeStory.id] })
  }, [activeStory, updateSettings, viewedStoryIds])

  const closeViewer = useCallback(() => {
    setActiveStoryIndex(null)
    setViewerStories(null)
    setPaused(false)
  }, [])

  const goToNextStory = useCallback(() => {
    if (activeStoryIndex === null) return
    if (activeStoryIndex >= (viewerStories?.length ?? 0) - 1) {
      closeViewer()
      return
    }
    setStoryProgress(0)
    setReplyStatus('')
    setReplyText('')
    setPaused(false)
    setActiveStoryIndex((index) => (index ?? 0) + 1)
  }, [activeStoryIndex, closeViewer, viewerStories?.length])

  const goToPreviousStory = useCallback(() => {
    setStoryProgress(0)
    setReplyStatus('')
    setReplyText('')
    setActiveStoryIndex((index) => index === null || index <= 0 ? 0 : index - 1)
  }, [])

  useEffect(() => {
    if (activeStoryIndex === null || paused || !activeStory) return
    const timer = window.setInterval(() => {
      setStoryProgress((progress) => {
        const nextProgress = progress + (100 * 50) / storyDurationMs
        if (nextProgress >= 100) {
          window.setTimeout(goToNextStory, 0)
          return 100
        }
        return nextProgress
      })
    }, 50)
    return () => window.clearInterval(timer)
  }, [activeStory, activeStoryIndex, goToNextStory, paused])

  useEffect(() => {
    if (activeStoryIndex === null) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeViewer()
      if (event.key === 'ArrowRight') goToNextStory()
      if (event.key === 'ArrowLeft') goToPreviousStory()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeStoryIndex, closeViewer, goToNextStory, goToPreviousStory])

  function openStory(storyList: TravelStory[], storyId: string) {
    const startIndex = storyList.findIndex((story) => story.id === storyId)
    if (startIndex < 0) return
    setViewerStories(storyList)
    setStoryProgress(0)
    setReplyStatus('')
    setReplyText('')
    setActiveStoryIndex(startIndex)
  }

  function openAuthorStories(authorId: string) {
    const authorStories = activeStories.filter((story) => story.authorId === authorId)
    const firstStory = authorStories[getFirstUnseenIndex(authorStories, viewedStoryIds)]
    if (firstStory) openStory(activeStories, firstStory.id)
  }

  function toggleSaved(storyId: string) {
    updateSettings({
      savedStoryIds: savedStoryIds.includes(storyId)
        ? savedStoryIds.filter((id) => id !== storyId)
        : [...savedStoryIds, storyId],
    })
  }

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!replyText.trim()) return
    setReplyText('')
    setReplyStatus('Reply noted for this trip community.')
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest('button, input, a')) return
    pointerStart.current = { x: event.clientX, y: event.clientY }
    setPaused(true)
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    if (!pointerStart.current) return
    const deltaX = event.clientX - pointerStart.current.x
    const deltaY = event.clientY - pointerStart.current.y
    pointerStart.current = null
    setPaused(false)
    if (deltaY > 90) closeViewer()
    else if (Math.abs(deltaX) > 70) {
      if (deltaX < 0) goToNextStory()
      else goToPreviousStory()
    }
  }

  return (
    <div className="page-content stories-page">
      <section className="stories-intro">
        <div>
          <span className="eyebrow">NOTES FROM THE ROAD · {destination.toUpperCase()}</span>
          <h2>Useful little discoveries.</h2>
          <p>Local tips from travellers on the same trip. Nothing to perform, just things worth passing on.</p>
        </div>
        <span className="stories-intro-mark"><Sparkles size={17} /></span>
      </section>

      <section className="stories-community-note">
        <ShieldCheck size={15} />
        <span>Only visible to your temporary {destination} community</span>
      </section>

      <section className="story-shelf">
        <div className="story-shelf-heading">
          <div><h3>From your travellers</h3><p>{activeStories.length} fresh field notes</p></div>
          <span className="story-expiry-label"><Clock3 size={11} /> 24 hours</span>
        </div>
        {activeStories.length ? (
          <div className="story-ring-row" aria-label={`${destination} community stories`}>
            {Array.from(new Map(activeStories.map((story) => [story.authorId, story])).values()).map((story) => {
              const authorStories = activeStories.filter((item) => item.authorId === story.authorId)
              const hasUnseen = authorStories.some((item) => !viewedStoryIds.includes(item.id))
              return (
                <button className={`story-ring${hasUnseen ? ' new' : ' viewed'}`} key={story.authorId} onClick={() => openAuthorStories(story.authorId)}>
                  <span className="story-avatar">{story.initials}</span>
                  <small>{story.author.split(' ')[0]}</small>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="stories-empty-state">
            <Compass size={20} />
            <strong>It’s quiet here for now</strong>
            <span>New notes from {destination} travellers will show up as they arrive.</span>
          </div>
        )}
      </section>

      {latestStory && (
        <button className={`featured-story-card story-scene story-scene-${latestStory.scene}`} onClick={() => openStory(activeStories, latestStory.id)}>
          <span className="featured-story-top"><span><Sparkles size={12} /> FIELD NOTE</span><span>{timeAgo(latestStory.sharedAt)}</span></span>
          <span className="featured-story-location"><MapPin size={12} /> {latestStory.location}</span>
          <strong>{latestStory.tip}</strong>
          <span className="featured-story-footer"><span className="story-avatar-mini">{latestStory.initials}</span> {latestStory.author.split(' ')[0]}’s note <span className="featured-story-open"><ArrowRight size={14} /></span></span>
        </button>
      )}

      <section className="highlights-section">
        <div className="story-shelf-heading">
          <div><h3>Traveller highlights</h3><p>Saved collections from this trip</p></div>
          <Bookmark size={15} className="highlights-heading-icon" />
        </div>
        {visibleHighlights.length ? (
          <div className="highlights-grid">
            {visibleHighlights.map((highlight) => {
              const collectionStories = highlight.storyIds
                .map((storyId) => stories.find((story) => story.id === storyId && story.destination === destination))
                .filter((story): story is TravelStory => story !== undefined)
              const cover = collectionStories[0]
              if (!cover) return null
              return (
                <button className={`highlight-card story-scene story-scene-${cover.scene}`} key={highlight.id} onClick={() => openStory(collectionStories, cover.id)}>
                  <span className="highlight-card-top"><span className="highlight-owner-avatar">{highlight.initials}</span><ArrowRight size={13} /></span>
                  <strong>{highlight.title}</strong>
                  <small>{highlight.owner.split(' ')[0]} · {collectionStories.length} {collectionStories.length === 1 ? 'note' : 'notes'}</small>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="highlights-empty">Highlights from {destination} will appear here.</div>
        )}
      </section>

      {savedStoryIds.length > 0 && (
        <section className="saved-stories-section">
          <div className="story-shelf-heading">
            <div><h3>Your saved tips</h3><p>Handy notes to come back to</p></div>
            <Bookmark size={15} className="highlights-heading-icon" />
          </div>
          {savedStoryIds
            .map((storyId) => stories.find((story) => story.id === storyId))
            .filter((story): story is TravelStory => Boolean(story))
            .map((story) => (
              <button className="saved-story-row" key={story.id} onClick={() => story.destination === destination ? openStory([story], story.id) : navigate('/map')}>
                <span className={`saved-story-icon story-scene-${story.scene}`}><MapPin size={14} /></span>
                <span><strong>{story.location}</strong><small>{story.tip}</small></span>
                <ArrowRight size={14} />
              </button>
            ))}
        </section>
      )}

      <div className="community-caption"><ShieldCheck size={13} /> Trip stories expire after 24 hours. Tips you save stay on your device.</div>

      <AnimatePresence>
        {activeStory && activeStoryIndex !== null && (
          <motion.section
            className={`story-viewer story-scene story-scene-${activeStory.scene}`}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeStory.author}'s travel story`}
            initial={{ y: '100%', opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStart.current = null; setPaused(false) }}
          >
            <div className="story-progress-bars" aria-label={`Story ${activeStoryIndex + 1} of ${viewerStories?.length ?? 0}`}>
              {(viewerStories ?? []).map((story, index) => (
                <span className="story-progress-track" key={story.id}>
                  <i style={{ width: `${index < activeStoryIndex ? 100 : index === activeStoryIndex ? storyProgress : 0}%` }} />
                </span>
              ))}
            </div>
            <div className="story-viewer-top">
              <div className="story-author-lockup">
                <span className="story-viewer-avatar">{activeStory.initials}</span>
                <span><strong>{activeStory.author}</strong><small>{timeAgo(activeStory.sharedAt)} · {activeStory.destination}</small></span>
              </div>
              <div className="story-viewer-actions">
                <span className="story-expiry-chip"><Clock3 size={11} /> {new Date(activeStory.expiresAt).getTime() > clock ? `${Math.max(1, Math.ceil((new Date(activeStory.expiresAt).getTime() - clock) / 3_600_000))}h left` : 'HIGHLIGHT'}</span>
                <button className="story-close-button" aria-label="Close story" onClick={closeViewer}><X size={18} /></button>
              </div>
            </div>

            <button className="story-viewer-tap story-viewer-tap-left" aria-label="Previous story" onClick={goToPreviousStory} />
            <button className="story-viewer-tap story-viewer-tap-right" aria-label="Next story" onClick={goToNextStory} />
            <div className="story-illustration" aria-hidden="true">
              <span className="story-sun-orb" />
              <span className="story-horizon" />
              <span className="story-landmark story-landmark-one" />
              <span className="story-landmark story-landmark-two" />
              <span className="story-landmark story-landmark-three" />
              <span className="story-scene-icon">{(() => {
                const SceneIcon = sceneIcons[activeStory.scene]
                return <SceneIcon size={38} strokeWidth={1.25} />
              })()}</span>
            </div>
            <div className="story-viewer-copy">
              <span className="story-location-tag"><MapPin size={12} /> {activeStory.location}</span>
              <p>{activeStory.tip}</p>
              <span className="story-tip-sticker"><Lightbulb size={13} /> LOCAL TIP</span>
              {activeStory.companionInvite && <span className="story-company-sticker"><UsersRound size={13} /> Open invite · public route</span>}
            </div>

            <div className="story-viewer-bottom">
              {replyStatus && <span className="story-reply-status" role="status"><Check size={12} /> {replyStatus}</span>}
              <form className="story-reply-form" onSubmit={submitReply}>
                <input
                  aria-label={`Reply to ${activeStory.author}`}
                  placeholder="Send a kind reply…"
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                  maxLength={180}
                />
                <button type="submit" aria-label="Send reply" disabled={!replyText.trim()}><Send size={16} /></button>
              </form>
              <button className={`story-save-button${savedStoryIds.includes(activeStory.id) ? ' saved' : ''}`} onClick={() => toggleSaved(activeStory.id)}>
                {savedStoryIds.includes(activeStory.id) ? <Check size={14} /> : <Bookmark size={14} />}
                {savedStoryIds.includes(activeStory.id) ? 'Saved to your tips' : 'Save this tip'}
              </button>
              <span className="story-viewer-footnote"><ShieldCheck size={11} /> Shared with this trip community only</span>
            </div>
            {paused && <span className="story-paused-indicator"><ArrowDown size={12} /> PAUSED</span>}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
