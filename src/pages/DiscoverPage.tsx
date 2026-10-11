import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Check,
  Coffee,
  Compass,
  GripVertical,
  Hotel,
  MapPin,
  Mountain,
  Plus,
  Share2,
  Sparkles,
  Star,
  TentTree,
  Trash2,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { discoverCategories, discoverPlaces, type DiscoverCategory, type DiscoverPlace } from '../data/discover'
import { travellers } from '../data/travellers'
import { destinationDetails } from '../lib/destinations'
import { useAppStore, type ItineraryStop } from '../store/appStore'

const emptyStops: ItineraryStop[] = []
const categoryIcons = {
  Cafes: Coffee,
  Hotels: Hotel,
  'Tourist places': Sparkles,
  Resorts: TentTree,
}
const sceneIcons = {
  courtyard: Coffee,
  coffee: Coffee,
  lanes: Sparkles,
  water: Mountain,
  heritage: Hotel,
  garden: Sparkles,
  hills: Mountain,
  coast: TentTree,
}

const similarPlans: Record<string, { travellerId: string; placeIds: string[] }[]> = {
  Dubai: [
    { travellerId: 'maya-chen', placeIds: ['arabian-tea-house', 'al-fahidi-lanes', 'xva-art-hotel'] },
    { travellerId: 'rafi-khan', placeIds: ['arabian-tea-house', 'al-fahidi-lanes'] },
    { travellerId: 'sam-lee', placeIds: ['nightjar-coffee', 'vida-creek-resort'] },
  ],
  Goa: [
    { travellerId: 'dev-menon', placeIds: ['cafe-bodega', 'fontainhas-quarter', 'casa-fontainhas'] },
    { travellerId: 'tara-dsouza', placeIds: ['cafe-bodega', 'fontainhas-quarter'] },
    { travellerId: 'arjun-pai', placeIds: ['ahilya-by-the-sea', 'caravela-cafe'] },
  ],
  Kochi: [
    { travellerId: 'meera-varghese', placeIds: ['loafers-corner', 'fort-kochi-waterfront', 'fort-house-kochi'] },
    { travellerId: 'nikhil-rao', placeIds: ['kashi-art-cafe', 'fort-kochi-waterfront'] },
    { travellerId: 'sana-kurup', placeIds: ['loafers-corner', 'malabar-house'] },
  ],
  Munnar: [
    { travellerId: 'ishaan-thapa', placeIds: ['tea-tales-cafe', 'tea-museum-trail', 'windermere-estate'] },
    { travellerId: 'anaya-joseph', placeIds: ['tea-tales-cafe', 'tea-museum-trail'] },
    { travellerId: 'rohan-kapoor', placeIds: ['roastery-munnar', 'blanket-hotel'] },
  ],
}

function distanceFromCenter(place: DiscoverPlace) {
  const [latitude, longitude] = destinationDetails[place.destination].coordinates
  const [placeLatitude, placeLongitude] = place.coordinates
  const radians = (degrees: number) => (degrees * Math.PI) / 180
  const deltaLatitude = radians(placeLatitude - latitude)
  const deltaLongitude = radians(placeLongitude - longitude)
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(radians(latitude)) * Math.cos(radians(placeLatitude)) * Math.sin(deltaLongitude / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function travelMinutes(first: DiscoverPlace, second: DiscoverPlace) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180
  const deltaLatitude = radians(second.coordinates[0] - first.coordinates[0])
  const deltaLongitude = radians(second.coordinates[1] - first.coordinates[1])
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(radians(first.coordinates[0])) * Math.cos(radians(second.coordinates[0])) * Math.sin(deltaLongitude / 2) ** 2
  const kilometres = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.max(8, Math.round(kilometres * 18))
}

function priceLabel(place: DiscoverPlace) {
  const marker = place.currency === 'AED' ? 'AED ' : '₹'
  return `${marker}${'•'.repeat(place.priceLevel)}`
}

function friendlyCurrency(currency: DiscoverPlace['currency']) {
  return currency === 'AED' ? 'AED' : '₹'
}

function createItineraryStop(place: DiscoverPlace, day: number, order: number): ItineraryStop {
  const addedAt = new Date().toISOString()
  return {
    id: `${place.id}-${Date.parse(addedAt)}`,
    placeId: place.id,
    destination: place.destination,
    day,
    order,
    addedAt,
  }
}

export function DiscoverPage() {
  const settings = useAppStore((state) => state.settings)
  const destination = settings.destination
  const itineraryStops = settings.itineraryStops ?? emptyStops
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [category, setCategory] = useState<DiscoverCategory>('Cafes')
  const [selectedDay, setSelectedDay] = useState(1)
  const [notice, setNotice] = useState('')
  const [sharing, setSharing] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [draggingStopId, setDraggingStopId] = useState<string | null>(null)
  const draggedStopId = useRef<string | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])
  const placesForDestination = useMemo(
    () => discoverPlaces.filter((place) => place.destination === destination),
    [destination],
  )
  const recommendations = placesForDestination.filter((place) => place.category === category)
  const destinationStops = itineraryStops
    .filter((stop) => stop.destination === destination)
    .sort((first, second) => first.day - second.day || first.order - second.order)
  const stopsByDay = [1, 2, 3].map((day) => ({
    day,
    stops: destinationStops.filter((stop) => stop.day === day),
  }))

  function placeForStop(stop: ItineraryStop | undefined) {
    return stop ? discoverPlaces.find((place) => place.id === stop.placeId) : undefined
  }

  function addToItinerary(place: DiscoverPlace) {
    if (destinationStops.some((stop) => stop.placeId === place.id)) {
      setNotice(`${place.name} is already in your ${destination} itinerary.`)
      return
    }
    updateSettings({
      itineraryStops: [
        ...itineraryStops,
        createItineraryStop(place, selectedDay, destinationStops.filter((stop) => stop.day === selectedDay).length),
      ],
    })
    setNotice(`${place.name} added to day ${selectedDay}.`)
  }

  function removeFromItinerary(stopId: string) {
    const nextStops = itineraryStops
      .filter((stop) => stop.id !== stopId)
      .map((stop) => stop.destination === destination
        ? { ...stop, order: destinationStops.filter((item) => item.day === stop.day && item.id !== stopId).findIndex((item) => item.id === stop.id) }
        : stop)
    updateSettings({ itineraryStops: nextStops })
    setNotice('Stop removed from your itinerary.')
  }

  function moveStop(stopId: string, direction: -1 | 1) {
    const dayStops = destinationStops.filter((stop) => stop.day === selectedDay)
    const currentIndex = dayStops.findIndex((stop) => stop.id === stopId)
    const nextIndex = currentIndex + direction
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= dayStops.length) return
    updateSettings({
      itineraryStops: reorderStops(dayStops, currentIndex, nextIndex, itineraryStops, destination),
    })
  }

  function reorderStops(
    dayStops: ItineraryStop[],
    fromIndex: number,
    toIndex: number,
    allStops: ItineraryStop[],
    currentDestination: string,
  ) {
    const reordered = [...dayStops]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    const orderMap = new Map(reordered.map((stop, index) => [stop.id, index]))
    return allStops.map((stop) => stop.destination === currentDestination && orderMap.has(stop.id)
      ? { ...stop, order: orderMap.get(stop.id) ?? stop.order }
      : stop)
  }

  function finishPointerReorder(event: ReactPointerEvent<HTMLDivElement>) {
    const sourceId = draggedStopId.current
    draggedStopId.current = null
    setDraggingStopId(null)
    if (!sourceId) return
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-itinerary-stop-id]') : null
    const targetId = target?.dataset.itineraryStopId
    if (!targetId || sourceId === targetId) return
    const dayStops = destinationStops.filter((stop) => stop.day === selectedDay)
    const sourceIndex = dayStops.findIndex((stop) => stop.id === sourceId)
    const targetIndex = dayStops.findIndex((stop) => stop.id === targetId)
    if (sourceIndex < 0 || targetIndex < 0) return
    updateSettings({ itineraryStops: reorderStops(dayStops, sourceIndex, targetIndex, itineraryStops, destination) })
  }

  async function shareItinerary() {
    const shareStops = destinationStops
      .map((stop) => ({ stop, place: placeForStop(stop) }))
      .filter((entry): entry is { stop: ItineraryStop; place: DiscoverPlace } => Boolean(entry.place))
    if (!shareStops.length) {
      setNotice('Add a place to your itinerary before sharing it.')
      return
    }
    const text = [
      `My ${destination} trip plan`,
      ...shareStops.map(({ stop, place }) => `Day ${stop.day}: ${place.name} — ${place.neighbourhood}`),
      'A Stranger Seat trip plan · compare and opt in together',
    ].join('\n')
    setSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({ title: `${destination} trip plan`, text })
        setNotice('Your itinerary was shared.')
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setNotice('Itinerary copied. Share it with a travel companion when you’re ready.')
      } else {
        setNotice('Sharing isn’t available in this browser. Your itinerary is still saved on this device.')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setNotice('Sharing cancelled. Your itinerary is still saved on this device.')
      } else {
        setNotice('Could not share right now. Your itinerary is still saved on this device.')
      }
    } finally {
      setSharing(false)
    }
  }

  const totalCost = destinationStops.reduce((sum, stop) => {
    const place = placeForStop(stop)
    return sum + (place?.estimatedCost ?? 0)
  }, 0)
  const currency = placesForDestination[0]?.currency ?? 'INR'
  const tripExpired = new Date(settings.tripEndsAt ?? now).getTime() <= now
  const companions = (tripExpired ? [] : similarPlans[destination] ?? [])
    .map((plan) => {
      const traveller = travellers.find((person) => person.id === plan.travellerId)
      const matches = destinationStops.filter((stop) => plan.placeIds.includes(stop.placeId)).length
      const plannedPlaceIds = new Set(destinationStops.map((stop) => stop.placeId))

      const matchedPlaceIds = new Set(plan.placeIds.filter((placeId) => plannedPlaceIds.has(placeId)))
      const unionCount = new Set([...plannedPlaceIds, ...plan.placeIds]).size
      return { traveller, matches, percentage: unionCount ? Math.round((matchedPlaceIds.size / unionCount) * 100) : 0 }
    })
    .filter((match) => match.traveller && match.matches > 0)
    .sort((first, second) => second.percentage - first.percentage)
    .slice(0, 3)

  return (
    <div className="page-content discover-page">
      <section className="discover-intro">
        <div>
          <span className="eyebrow">FIND YOUR OWN PACE · {destination.toUpperCase()}</span>
          <h2>Good places, thoughtfully picked.</h2>
          <p>Traveller-loved stops and an itinerary that stays yours until you choose to share it.</p>
        </div>
        <span className="discover-intro-icon"><Compass size={18} /></span>
      </section>

      <section className="discover-section">
        <div className="discover-section-heading">
          <div><h3>Places travellers return to</h3><p>Community favourites in {destination}</p></div>
          <span className="discover-heading-icon"><Sparkles size={15} /></span>
        </div>
        <div className="discover-category-tabs" role="tablist" aria-label="Discover places by type">
          {discoverCategories.map((item) => {
            const Icon = categoryIcons[item]
            return (
              <button
                className={`discover-category-tab${category === item ? ' active' : ''}`}
                key={item}
                role="tab"
                aria-selected={category === item}
                onClick={() => setCategory(item)}
              >
                <Icon size={13} /> {item}
              </button>
            )
          })}
        </div>
        <div className="discover-cards">
          <AnimatePresence mode="wait">
            <motion.div
              className="discover-card-list"
              key={`${destination}-${category}`}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
              role="tabpanel"
            >
              {recommendations.map((place) => {
                const SceneIcon = sceneIcons[place.scene]
                const isAdded = destinationStops.some((stop) => stop.placeId === place.id)
                return (
                  <article className="discover-place-card" key={place.id}>
                    <div className={`discover-place-cover discover-scene-${place.scene}`}>
                      <span className="discover-place-cover-icon"><SceneIcon size={22} strokeWidth={1.6} /></span>
                      <span className="discover-rating"><Star size={11} fill="currentColor" /> {place.rating.toFixed(1)}</span>
                      <span className="discover-price">{priceLabel(place)}</span>
                    </div>
                    <div className="discover-place-info">
                      <div className="discover-place-title">
                        <div><h4>{place.name}</h4><span><MapPin size={10} /> {place.neighbourhood}</span></div>
                        <button
                          className={`discover-add-button${isAdded ? ' added' : ''}`}
                          aria-label={isAdded ? `${place.name} added to itinerary` : `Add ${place.name} to itinerary day ${selectedDay}`}
                          aria-pressed={isAdded}
                          onClick={() => addToItinerary(place)}
                        >{isAdded ? <Check size={15} /> : <Plus size={15} />}</button>
                      </div>
                      <p>{place.description}</p>
                      <div className="discover-tags">{place.vibeTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <div className="discover-match-row">
                        <span className="discover-match-chip"><UsersRound size={11} /> {place.travellerMatch}% match</span>
                        <small>{place.matchReason}</small>
                      </div>
                      <span className="discover-cost">{place.estimatedCost ? `~${friendlyCurrency(place.currency)}${place.estimatedCost.toLocaleString()} per ${place.category === 'Hotels' || place.category === 'Resorts' ? 'night' : 'person'}` : 'Free to explore'} <span>·</span> {distanceFromCenter(place).toFixed(1)} km from centre</span>
                    </div>
                  </article>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="itinerary-section">
        <div className="discover-section-heading">
          <div><span className="eyebrow">YOUR PLAN · SAVED ON THIS DEVICE</span><h3>Build a day that feels right.</h3><p>Add a stop from any category, then shape the order.</p></div>
          <span className="itinerary-heading-icon"><Bookmark size={15} /></span>
        </div>

        <div className="itinerary-summary">
          <div><span>{destinationStops.length}</span><small>{destinationStops.length === 1 ? 'planned stop' : 'planned stops'}</small></div>
          <i />
          <div><span>{currency === 'AED' ? 'AED' : '₹'}{totalCost.toLocaleString()}</span><small>estimated total*</small></div>
          <button className="itinerary-share-button" onClick={shareItinerary} disabled={sharing}>
            <Share2 size={13} /> {sharing ? 'Sharing…' : 'Share'}
          </button>
        </div>

        <div className="itinerary-day-tabs" role="tablist" aria-label="Select itinerary day">
          {[1, 2, 3].map((day) => (
            <button className={selectedDay === day ? 'active' : ''} key={day} role="tab" aria-selected={selectedDay === day} onClick={() => setSelectedDay(day)}>
              Day {day}<small>{destinationStops.filter((stop) => stop.day === day).length} {destinationStops.filter((stop) => stop.day === day).length === 1 ? 'stop' : 'stops'}</small>
            </button>
          ))}
        </div>

        <div
          className="itinerary-timeline"
          aria-label={`Day ${selectedDay} itinerary stops`}
          onPointerUp={finishPointerReorder}
          onPointerCancel={() => { draggedStopId.current = null; setDraggingStopId(null) }}
        >
          {stopsByDay[selectedDay - 1].stops.length ? (
            stopsByDay[selectedDay - 1].stops.map((stop, index) => {
              const place = placeForStop(stop)
              if (!place) return null
              const nextStop = placeForStop(stopsByDay[selectedDay - 1].stops[index + 1])
              return (
                <div key={stop.id}>
                  <article
                    className={`itinerary-stop-card${draggingStopId === stop.id ? ' dragging' : ''}`}
                    data-itinerary-stop-id={stop.id}
                  >
                    <span
                      className="itinerary-drag-handle"
                      aria-label="Drag to reorder"
                      onPointerDown={() => { draggedStopId.current = stop.id; setDraggingStopId(stop.id) }}
                    ><GripVertical size={15} /></span>
                    <span className="itinerary-stop-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="itinerary-stop-copy"><strong>{place.name}</strong><small>{place.neighbourhood} · {place.category}</small></span>
                    <span className="itinerary-stop-cost">{place.estimatedCost ? `${friendlyCurrency(place.currency)}${place.estimatedCost.toLocaleString()}` : 'Free'}</span>
                    <span className="itinerary-stop-actions">
                      <button aria-label={`Move ${place.name} earlier`} disabled={index === 0} onClick={() => moveStop(stop.id, -1)}><ArrowUp size={12} /></button>
                      <button aria-label={`Move ${place.name} later`} disabled={index === stopsByDay[selectedDay - 1].stops.length - 1} onClick={() => moveStop(stop.id, 1)}><ArrowDown size={12} /></button>
                      <button aria-label={`Remove ${place.name}`} onClick={() => removeFromItinerary(stop.id)}><Trash2 size={12} /></button>
                    </span>
                  </article>
                  {nextStop && (
                    <div className="itinerary-travel-time"><span /> <ArrowRight size={10} /> ~{travelMinutes(place, nextStop)} min between stops <small>estimated travel</small></div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="itinerary-empty">
              <span><MapPin size={16} /></span>
              <strong>Your day is open</strong>
              <p>Choose a hotel, cafe, local place, or resort above to start sketching day {selectedDay}.</p>
            </div>
          )}
        </div>
        <p className="itinerary-disclaimer">*Estimates are per person for cafes and attractions, per night for stays. Travel times are rough distance-based guides.</p>

        <div className="itinerary-matches">
          <div className="itinerary-match-heading"><span><UsersRound size={14} /></span><div><strong>Plans that overlap</strong><small>Mock traveller plans · mutual opt-in only</small></div></div>
          {companions.length ? companions.map(({ traveller, matches, percentage }) => traveller && (
            <article className="itinerary-match-row" key={traveller.id}>
              <span className="itinerary-match-avatar">{traveller.initials}</span>
              <span className="itinerary-match-person"><strong>{traveller.name}</strong><small>{traveller.archetype.replace('The ', '')} · {matches} shared {matches === 1 ? 'stop' : 'stops'}</small></span>
              <span className="itinerary-match-percent">{percentage}%<small>overlap</small></span>
            </article>
          )) : (
            <p className="itinerary-match-empty">Add a place above to see which travellers have a similar plan. Nothing is shared until both people choose to.</p>
          )}
        </div>
      </section>

      {notice && <div className="discover-live-notice" role="status"><Check size={13} />{notice}<button aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}
      <div className="discover-footer"><UsersRound size={13} /> Recommendations and companion plans are mock signals for this trip community.</div>
    </div>
  )
}
