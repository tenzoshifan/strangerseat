import { divIcon, type LatLngExpression } from 'leaflet'
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Coffee,
  Flag,
  Hotel,
  LocateFixed,
  MapPin,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UsersRound,
  UserRoundX,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import { SectionHeading } from '../components/SectionHeading'
import { places } from '../data/places'
import { travellers, type Traveller } from '../data/travellers'
import { calculateMatchPercent } from '../lib/matching'
import { destinationDetails, destinations, type Destination } from '../lib/destinations'
import { useAppStore, type PrivacyMode } from '../store/appStore'

type MapFilter = 'Same destination' | 'Same event' | 'Cafes' | 'Tourist places' | 'Hotels'
type MapPlace = (typeof places)[number]

const mapFilters: MapFilter[] = ['Same destination', 'Same event', 'Cafes', 'Tourist places', 'Hotels']
const emptyTravellerIds: string[] = []
const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY?.trim()
const tileStyles = {
  dark: cartoApiKey
    ? `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoApiKey)}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  light: cartoApiKey
    ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoApiKey)}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}
const hasCartoApiKey = Boolean(cartoApiKey)
const tileAttribution = hasCartoApiKey
  ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions/">CARTO</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function TravellerPin({
  traveller,
  coordinates,
  match,
  onSelect,
}: {
  traveller: Traveller
  coordinates: [number, number]
  match: number
  onSelect: (traveller: Traveller) => void
}) {
  const icon = divIcon({
    className: `traveller-marker${traveller.activeRecently ? ' traveller-marker-active' : ''}`,
    html: `<span class="traveller-marker-inner">${traveller.initials}</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

  return (
    <Marker
      position={coordinates}
      icon={icon}
      eventHandlers={{ click: () => onSelect(traveller) }}
      keyboard
      title={`${traveller.name}, ${match}% travel vibe match`}
      alt={`${traveller.name}, ${traveller.archetype}`}
    />
  )
}

function PlacePin({ place, onSelect }: { place: MapPlace; onSelect: (place: MapPlace) => void }) {
  const isCafe = place.category === 'Cafe'
  const isHotel = place.category === 'Hotel'
  const icon = divIcon({
    className: `place-marker${isCafe ? ' place-marker-cafe' : ''}${isHotel ? ' place-marker-hotel' : ''}`,
    html: `<span>${isCafe ? '<span class="place-marker-icon">C</span>' : isHotel ? '<span class="place-marker-icon">H</span>' : '<span class="place-marker-icon">P</span>'}</span>`,
    iconSize: [29, 29],
    iconAnchor: [14, 14],
  })

  return (
    <Marker
      position={place.coordinates}
      icon={icon}
      eventHandlers={{ click: () => onSelect(place) }}
      keyboard
      title={`${place.name}, ${place.category}`}
      alt={place.name}
    />
  )
}

function MapZoomListener({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({ zoomend: (event) => onZoom(event.target.getZoom()) })
  return null
}

function MapActions({ destination }: { destination: Destination }) {
  const map = useMap()

  useEffect(() => {
    const centerOnDestination = () => {
      const details = destinationDetails[destination]
      map.flyTo(details.coordinates, details.zoom, { duration: 0.65 })
    }
    document.addEventListener('map-center-destination', centerOnDestination)
    return () => document.removeEventListener('map-center-destination', centerOnDestination)
  }, [destination, map])

  return null
}

function TravellerCluster({
  people,
  position,
  onZoom,
}: {
  people: Traveller[]
  position: [number, number]
  onZoom: (zoom: number) => void
}) {
  const map = useMap()

  return (
    <Marker
      position={position}
      icon={clusterIcon(people.length)}
      eventHandlers={{
        click: () => {
          const zoom = Math.min(map.getZoom() + 3, 15)
          map.flyTo(position, zoom, { duration: 0.55 })
          onZoom(zoom)
        },
      }}
      keyboard
      title={`${people.length} travellers nearby. Zoom in to see them.`}
      alt={`${people.length} traveller cluster`}
    />
  )
}

function MapController({
  destination,
  focus,
}: {
  destination: Destination
  focus: [number, number] | null
}) {
  const map = useMap()

  useEffect(() => {
    const details = destinationDetails[destination]
    map.flyTo(details.coordinates, details.zoom, { duration: 0.75 })
  }, [destination, map])

  useEffect(() => {
    if (focus) map.flyTo(focus, Math.max(map.getZoom(), 14), { duration: 0.65 })
  }, [focus, map])

  return null
}

function clusterTravellers(
  people: Traveller[],
  positions: Record<string, [number, number]>,
  zoom: number,
) {
  if (zoom > 11) return people.map((traveller) => ({ type: 'person' as const, traveller, position: positions[traveller.id] }))

  const gridSize = zoom <= 8 ? 3 : zoom <= 9 ? 1.5 : 0.45
  const groups = new Map<string, Traveller[]>()
  for (const traveller of people) {
    const [lat, lng] = positions[traveller.id]
    const key = `${Math.floor(lat / gridSize)}:${Math.floor(lng / gridSize)}`
    groups.set(key, [...(groups.get(key) ?? []), traveller])
  }

  return [...groups.values()].map((group) => {
    const position = group.reduce<[number, number]>(
      (center, person) => [
        center[0] + positions[person.id][0] / group.length,
        center[1] + positions[person.id][1] / group.length,
      ],
      [0, 0],
    )
    return group.length > 1
      ? { type: 'cluster' as const, people: group, position }
      : { type: 'person' as const, traveller: group[0], position: positions[group[0].id] }
  })
}

function clusterIcon(count: number) {
  return divIcon({
    className: 'traveller-cluster',
    html: `<span>${count}</span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  })
}

function jitterPosition(traveller: Traveller, motionStep: number): [number, number] {
  const seed = traveller.id.split('').reduce((value, character) => value + character.charCodeAt(0), 0)
  const radians = (seed + motionStep * 8) * 0.42
  const blurLat = Math.sin(seed) * 0.00115
  const blurLng = Math.cos(seed) * 0.00115
  const movement = motionStep % 48
  return [
    traveller.coordinates[0] + blurLat + Math.sin(radians) * 0.00055 * Math.sin(movement * 0.13),
    traveller.coordinates[1] + blurLng + Math.cos(radians) * 0.00055 * Math.cos(movement * 0.13),
  ]
}

export function MapPage() {
  const navigate = useNavigate()
  const quizResult = useAppStore((state) => state.quizResult)
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [filter, setFilter] = useState<MapFilter>('Same destination')
  const [mapStyle, setMapStyle] = useState<'dark' | 'light'>('light')
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedTraveller, setSelectedTraveller] = useState<Traveller | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)
  const [mapZoom, setMapZoom] = useState(destinationDetails[settings.destination].zoom)
  const [motionStep, setMotionStep] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [requestStates, setRequestStates] = useState<Record<string, { chat?: boolean; location?: boolean }>>({})
  const [requestMessage, setRequestMessage] = useState('')
  const [profileSafetyNotice, setProfileSafetyNotice] = useState('')
  const destination = settings.destination
  const selectedTravellerIds = settings.selectedTravellerIds ?? []
  const blockedTravellerIds = settings.blockedTravellerIds ?? emptyTravellerIds
  const verificationStatus = settings.verificationStatus ?? 'unverified'
  const tripExpired = new Date(settings.tripEndsAt ?? now).getTime() <= now

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMotionStep((step) => step + 1)
      setNow(Date.now())
    }, 6500)
    return () => window.clearInterval(interval)
  }, [])

  const destinationTravellers = useMemo(
    () => travellers.filter((traveller) => traveller.destination === destination && !blockedTravellerIds.includes(traveller.id)),
    [blockedTravellerIds, destination],
  )
  const destinationPlaces = useMemo(
    () => places.filter((place) => place.destination === destination),
    [destination],
  )
  const positions = useMemo(
    () => Object.fromEntries(destinationTravellers.map((traveller) => [traveller.id, jitterPosition(traveller, motionStep)])),
    [destinationTravellers, motionStep],
  )
  const filteredTravellers = destinationTravellers.filter((traveller) => {
    if (tripExpired) return false
    if (filter === 'Same event') return Boolean(traveller.event)
    if (filter !== 'Same destination') return false
    return true
  })
  const filteredPlaces = destinationPlaces.filter((place) => {
    if (filter === 'Cafes') return place.category === 'Cafe'
    if (filter === 'Tourist places') return place.category === 'Tourist place'
    if (filter === 'Hotels') return place.category === 'Hotel'
    return false
  })
  const clusters = clusterTravellers(filteredTravellers, positions, mapZoom)
  const matchFor = (traveller: Traveller) =>
    calculateMatchPercent(traveller.archetype, quizResult?.archetype ?? 'The Solo Sharer')
  const searchText = query.trim().toLowerCase()
  const searchTravellers = searchText
    ? destinationTravellers.filter((person) => !tripExpired &&
      `${person.name} ${person.archetype} ${person.status} ${person.event ?? ''}`.toLowerCase().includes(searchText),
    ).slice(0, 3)
    : []
  const searchPlaces = searchText
    ? destinationPlaces.filter((place) =>
      `${place.name} ${place.neighbourhood} ${place.category}`.toLowerCase().includes(searchText),
    ).slice(0, 3)
    : []
  const topMatches = (tripExpired ? [] : destinationTravellers)
    .map((traveller) => ({ ...traveller, match: matchFor(traveller) }))
    .sort((first, second) => second.match - first.match)
    .slice(0, 2)
  const destinationInfo = destinationDetails[destination]
  const mapCenter = destinationInfo.coordinates as LatLngExpression

  function chooseTraveller(traveller: Traveller) {
    setSelectedTraveller(traveller)
    setSelectedPlace(null)
    setQuery('')
    setRequestMessage('')
  }

  function choosePlace(place: MapPlace) {
    setSelectedPlace(place)
    setSelectedTraveller(null)
    setQuery('')
  }

  function sendRequest(kind: 'chat' | 'location') {
    if (!selectedTraveller) return
    if (tripExpired) {
      setRequestMessage('This trip community has closed. Start a new trip in Privacy & safety to send requests.')
      return
    }
    if (kind === 'chat' && verificationStatus !== 'verified') {
      setRequestMessage('Complete traveller verification before requesting a chat.')
      return
    }
    if (kind === 'chat' && !selectedTraveller.verified) {
      setRequestMessage('Chat requests are available only with verified travellers.')
      return
    }
    const requestKey = kind === 'chat' ? 'pendingChatRequestIds' : 'pendingLocationRequestIds'
    const pending = settings[requestKey] ?? []
    if (pending.includes(selectedTraveller.id)) return
    updateSettings({ [requestKey]: [...pending, selectedTraveller.id] })
    setRequestStates((current) => ({
      ...current,
      [selectedTraveller.id]: { ...current[selectedTraveller.id], [kind]: true },
    }))
    setRequestMessage(
      kind === 'chat'
        ? 'Request sent. You can chat once you both accept.'
        : 'Request sent. Approximate location stays private until you both opt in.',
    )
  }

  function blockProfileTraveller() {
    if (!selectedTraveller) return
    updateSettings({ blockedTravellerIds: [...blockedTravellerIds, selectedTraveller.id] })
    setSelectedTraveller(null)
    setProfileSafetyNotice('Traveller blocked on this device. They are hidden from your map.')
  }

  function reportProfileTraveller() {
    if (!selectedTraveller) return
    const reports = settings.chatReports ?? []
    updateSettings({
      chatReports: [...reports, {
        chatId: `profile-${selectedTraveller.id}`,
        travellerId: selectedTraveller.id,
        reason: 'Profile concern',
        submittedAt: new Date().toISOString(),
      }],
    })
    setProfileSafetyNotice(`Profile concern saved locally for ${selectedTraveller.name}. No support team was contacted.`)
  }

  function updatePrivacy(mode: PrivacyMode) {
    updateSettings({ privacyMode: mode })
  }

  function changeDestination(nextDestination: Destination) {
    updateSettings({ destination: nextDestination })
    setSelectedTraveller(null)
    setSelectedPlace(null)
    setQuery('')
    setFilter('Same destination')
    setMapZoom(destinationDetails[nextDestination].zoom)
  }

  return (
    <div className="page-content map-page">
      {profileSafetyNotice && <div className="map-safety-notice" role="status">{profileSafetyNotice}<button onClick={() => setProfileSafetyNotice('')} aria-label="Dismiss notice"><X size={13} /></button></div>}
      <div className="destination-heading">
        <div>
          <span className="eyebrow">YOUR TRAVEL COMMUNITY</span>
          <h2>{destination}, together.</h2>
        </div>
        <label className="destination-select-wrap">
          <span className="sr-only">Choose destination</span>
          <span className="destination-dot" />
          <select
            className="destination-picker"
            aria-label="Choose destination"
            value={destination}
            onChange={(event) => changeDestination(event.target.value as Destination)}
          >
            {destinations.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
          <span className="destination-code">{destinationInfo.code}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </label>
      </div>

      <div className="map-search-wrap">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Search travellers or places"
            placeholder="Find a traveller or place"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query
            ? <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>
            : <span className="search-shortcut">⌘ K</span>}
        </label>
        {(searchTravellers.length > 0 || searchPlaces.length > 0) && (
          <div className="map-search-results" role="listbox" aria-label="Search results">
            {searchTravellers.map((person) => (
              <button key={person.id} role="option" aria-selected="false" onClick={() => chooseTraveller(person)}>
                <span className="search-result-avatar">{person.initials}</span>
                <span><strong>{person.name}</strong><small>{person.archetype}</small></span>
                <ArrowUpRight size={14} />
              </button>
            ))}
            {searchPlaces.map((place) => (
              <button key={place.id} role="option" aria-selected="false" onClick={() => choosePlace(place)}>
                <span className="search-result-place"><MapPin size={15} /></span>
                <span><strong>{place.name}</strong><small>{place.neighbourhood} · {place.category}</small></span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        )}
        {searchText && searchTravellers.length === 0 && searchPlaces.length === 0 && (
          <div className="map-search-results search-empty">No travellers or places found in {destination}.</div>
        )}
      </div>

      <section className={`map-card live-map-card${mapStyle === 'light' ? ' light-map' : ''}${hasCartoApiKey ? ' carto-map' : ''}`} aria-label={`Traveller and place map for ${destination}`}>
        <MapContainer
          center={mapCenter}
          zoom={destinationInfo.zoom}
          zoomControl={false}
          scrollWheelZoom
          className="leaflet-map"
          aria-label="Interactive community map"
        >
          <TileLayer
            attribution={tileAttribution}
            url={tileStyles[mapStyle]}
          />
          <ZoomControl position="bottomright" />
          <MapController
            destination={destination}
            focus={selectedTraveller?.coordinates ?? selectedPlace?.coordinates ?? null}
          />
          <MapActions destination={destination} />
          <MapZoomListener onZoom={setMapZoom} />
          {clusters.map((cluster) => cluster.type === 'cluster' ? (
            <TravellerCluster
              key={cluster.people.map((person) => person.id).join('-')}
              people={cluster.people}
              position={cluster.position}
              onZoom={setMapZoom}
            />
          ) : (
            <TravellerPin
              key={cluster.traveller.id}
              traveller={cluster.traveller}
              coordinates={cluster.position}
              match={matchFor(cluster.traveller)}
              onSelect={chooseTraveller}
            />
          ))}
          {filteredPlaces.map((place) => <PlacePin key={place.id} place={place} onSelect={choosePlace} />)}
        </MapContainer>

        <div className="map-overlay map-overlay-top">
          <span className="live-indicator"><span /> COMMUNITY MAP</span>
          <div className="map-overlay-actions">
            {settings.privacyMode === 'ghost' && <span className="ghost-indicator">GHOST MODE</span>}
            <button
              className="map-control"
              aria-label="Privacy settings"
              onClick={() => setPrivacyOpen(true)}
            >
              <ShieldCheck size={15} />
            </button>
            <button
              className="map-control map-style-control"
              aria-label={`Switch to ${mapStyle === 'dark' ? 'light' : 'dark'} map`}
              onClick={() => setMapStyle((style) => style === 'dark' ? 'light' : 'dark')}
            >
              {mapStyle === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>

        {(!selectedTraveller || tripExpired) && !selectedPlace && (
          <div className="map-overlay map-overlay-bottom">
            <div className="map-count">
              <span className="count-icon"><UsersRound size={15} /></span>
              <span>
                <strong>{filter === 'Same destination' || filter === 'Same event' ? filteredTravellers.length : filteredPlaces.length} {filter === 'Same destination' || filter === 'Same event' ? 'travellers' : 'places'}</strong>
                <small>in {destination} · approximate areas</small>
              </span>
            </div>
            <button
              className="locate-button"
              aria-label="Center map on destination"
              onClick={() => document.dispatchEvent(new CustomEvent('map-center-destination'))}
            >
              <LocateFixed size={16} />
            </button>
          </div>
        )}

        {selectedTraveller && !tripExpired && (
          <article className="traveller-sheet" aria-label={`${selectedTraveller.name} traveller details`}>
            <button className="sheet-close" aria-label="Close traveller details" onClick={() => setSelectedTraveller(null)}><X size={16} /></button>
            <div className="sheet-profile">
              <span className={`sheet-avatar${selectedTraveller.activeRecently ? ' active' : ''}`}>{selectedTraveller.initials}</span>
              <div className="sheet-person-copy">
                <div className="sheet-name">{selectedTraveller.name}{selectedTraveller.verified && <BadgeCheck size={14} aria-label="Verified traveller" />}</div>
                <span>{selectedTraveller.archetype}</span>
              </div>
              <span className="sheet-match">{matchFor(selectedTraveller)}%<small>match</small></span>
            </div>
            <p className="sheet-status"><span className="status-dot" />{selectedTraveller.status}<span className="status-time">{selectedTraveller.activeRecently ? '5m ago' : 'earlier today'}</span></p>
            <div className="sheet-actions">
              <button
                className="request-chat-button"
                onClick={() => sendRequest('chat')}
                disabled={tripExpired || verificationStatus !== 'verified' || !selectedTraveller.verified || Boolean(requestStates[selectedTraveller.id]?.chat)}
                title={verificationStatus !== 'verified' ? 'Verify your own account before requesting a chat.' : !selectedTraveller.verified ? 'Only verified travellers can receive chat requests.' : undefined}
              >
                {requestStates[selectedTraveller.id]?.chat || (settings.pendingChatRequestIds ?? []).includes(selectedTraveller.id) ? <><Check size={14} /> Request pending</> : <><UsersRound size={14} /> Request to chat</>}
              </button>
              <button
                className="request-location-button"
                onClick={() => sendRequest('location')}
                disabled={tripExpired || Boolean(requestStates[selectedTraveller.id]?.location)}
              >
                {requestStates[selectedTraveller.id]?.location || (settings.pendingLocationRequestIds ?? []).includes(selectedTraveller.id) ? <><Check size={14} /> Pending</> : <><MapPin size={14} /> Request location</>}
              </button>
            </div>
            {requestMessage && <p className="request-feedback" role="status">{requestMessage}</p>}
            <div className="profile-safety-actions">
              <button onClick={reportProfileTraveller}><Flag size={12} /> Report profile</button>
              <button onClick={blockProfileTraveller}><UserRoundX size={12} /> Block traveller</button>
            </div>
            {verificationStatus !== 'verified' && !tripExpired && <button className="verify-before-chat" onClick={() => navigate('/safety')}>Verify to request chats <ArrowUpRight size={12} /></button>}
          </article>
        )}

        {selectedPlace && (
          <article className="traveller-sheet place-sheet" aria-label={`${selectedPlace.name} details`}>
            <button className="sheet-close" aria-label="Close place details" onClick={() => setSelectedPlace(null)}><X size={16} /></button>
            <span className="place-sheet-icon">{selectedPlace.category === 'Cafe' ? <Coffee size={16} /> : selectedPlace.category === 'Hotel' ? <Hotel size={16} /> : <MapPin size={16} />}</span>
            <div className="place-sheet-copy">
              <span className="eyebrow">{selectedPlace.category} · {selectedPlace.neighbourhood}</span>
              <strong>{selectedPlace.name}</strong>
              <p>{selectedPlace.note}</p>
            </div>
          </article>
        )}
      </section>

      <div className="privacy-note">
        <ShieldCheck size={15} />
        <span>Locations are approximate by default. Exact location needs mutual opt-in.</span>
      </div>

      <div className="map-filters" aria-label="Map filters">
        {mapFilters.map((item) => (
          <button
            className={`filter-chip${filter === item ? ' selected' : ''}`}
            key={item}
            aria-pressed={filter === item}
            onClick={() => {
              setFilter(item)
              setSelectedTraveller(null)
              setSelectedPlace(null)
            }}
          >
            {item === 'Cafes' && <Coffee size={12} />}
            {item === 'Hotels' && <Hotel size={12} />}
            {item}
          </button>
        ))}
      </div>

      {settings.privacyMode === 'ghost' ? (
        <div className="ghost-mode-note"><Moon size={16} /><span><strong>Ghost Mode is on</strong><small>Your location is hidden from your trip community.</small></span></div>
      ) : (
        <div className="privacy-note privacy-mode-note"><ShieldCheck size={15} /><span>Sharing: {settings.privacyMode === 'selected' ? `${selectedTravellerIds.length} selected travellers` : 'your trip community'}</span><button onClick={() => setPrivacyOpen(true)}>Change</button></div>
      )}

      <section className="quick-matches">
        <SectionHeading title="Your kind of travellers" detail={`A good fit for ${quizResult?.archetype ?? 'your travel vibe'}`} />
        <div className="match-list">
          {topMatches.map((traveller, index) => (
            <button className="match-row match-row-button" key={traveller.id} onClick={() => chooseTraveller(traveller)}>
              <span className={`match-avatar match-avatar-${index}`}>{traveller.initials}</span>
              <span className="match-copy">
                <strong>{traveller.name} {traveller.verified && <BadgeCheck size={13} aria-label="Verified traveller" />}</strong>
                <span>{traveller.archetype}</span>
              </span>
              <span className="match-score">{traveller.match}%<small>match</small></span>
            </button>
          ))}
        </div>
      </section>

      {privacyOpen && (
        <div className="privacy-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPrivacyOpen(false)
        }}>
          <section className="privacy-modal" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
            <div className="privacy-modal-heading">
              <span className="privacy-modal-icon"><ShieldCheck size={18} /></span>
              <div><span className="eyebrow">YOU’RE IN CONTROL</span><h2 id="privacy-title">Location privacy</h2></div>
              <button className="sheet-close" aria-label="Close privacy settings" onClick={() => setPrivacyOpen(false)}><X size={16} /></button>
            </div>
            <p className="privacy-modal-intro">Your exact live location is never shown on the map. You can change who sees your approximate area.</p>
            <div className="privacy-options">
              <button className={`privacy-option${settings.privacyMode === 'community' ? ' active' : ''}`} onClick={() => updatePrivacy('community')}>
                <span className="privacy-option-icon"><UsersRound size={16} /></span>
                <span><strong>My travellers</strong><small>Share an approximate area with this trip community.</small></span>
                <span className="privacy-radio">{settings.privacyMode === 'community' && <Check size={12} />}</span>
              </button>
              <button className={`privacy-option${settings.privacyMode === 'selected' ? ' active' : ''}`} onClick={() => updatePrivacy('selected')}>
                <span className="privacy-option-icon"><ShieldCheck size={16} /></span>
                <span><strong>Select travellers</strong><small>Choose specific people from this destination.</small></span>
                <span className="privacy-radio">{settings.privacyMode === 'selected' && <Check size={12} />}</span>
              </button>
              <button className={`privacy-option${settings.privacyMode === 'ghost' ? ' active' : ''}`} onClick={() => updatePrivacy('ghost')}>
                <span className="privacy-option-icon"><Moon size={16} /></span>
                <span><strong>Ghost Mode</strong><small>Hide your location from everyone in the community.</small></span>
                <span className="privacy-radio">{settings.privacyMode === 'ghost' && <Check size={12} />}</span>
              </button>
            </div>
            {settings.privacyMode === 'selected' && (
              <div className="traveller-access-list">
                <span className="eyebrow">PEOPLE WHO CAN SEE YOUR APPROXIMATE AREA</span>
                {destinationTravellers.map((person) => {
                  const isSelected = selectedTravellerIds.includes(person.id)
                  return (
                    <label key={person.id} className="access-person">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => updateSettings({
                          selectedTravellerIds: isSelected
                            ? selectedTravellerIds.filter((id) => id !== person.id)
                            : [...selectedTravellerIds, person.id],
                        })}
                      />
                      <span className="access-avatar">{person.initials}</span>
                      <span><strong>{person.name}</strong><small>{person.archetype}</small></span>
                    </label>
                  )
                })}
              </div>
            )}
            <div className="privacy-modal-footer"><ShieldCheck size={14} /> Location requests are shared only after both people agree.</div>
            <button className="privacy-done-button" onClick={() => setPrivacyOpen(false)}>Done</button>
          </section>
        </div>
      )}
    </div>
  )
}
