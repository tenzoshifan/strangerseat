import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Cloud,
  CloudDrizzle,
  Coffee,
  Compass,
  MapPin,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Sun,
  UsersRound,
  Wind,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { travellers } from '../data/travellers'
import {
  communityEvents,
  dailyPlans,
  dailyWeather,
  destinationTimeZones,
  travellerArrivals,
} from '../data/today'
import { destinationDetails } from '../lib/destinations'
import { useAppStore } from '../store/appStore'

function getDestinationNow(timeZone: string, now: Date) {
  const hour = Number(new Intl.DateTimeFormat('en', { timeZone, hour: 'numeric', hourCycle: 'h23' }).format(now))
  const time = new Intl.DateTimeFormat('en', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).format(now)
  const date = new Intl.DateTimeFormat('en', { timeZone, weekday: 'long', month: 'long', day: 'numeric' }).format(now)
  const clock = new Intl.DateTimeFormat('en', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return { hour, time, date, clock, greeting }
}

const planIcons = {
  food: Coffee,
  walk: Wind,
  culture: Sparkles,
  rest: Sun,
}

const emptyEventIds: string[] = []

function statusForStop(time: string, currentTime: string) {
  if (currentTime >= time) return 'past'
  const [hour, minute] = time.split(':').map(Number)
  const [currentHour, currentMinute] = currentTime.split(':').map(Number)
  const minutesUntil = hour * 60 + minute - (currentHour * 60 + currentMinute)
  return minutesUntil < 60 ? 'next' : 'upcoming'
}

export function TodayPage() {
  const navigate = useNavigate()
  const destination = useAppStore((state) => state.settings.destination)
  const joinedEventIds = useAppStore((state) => state.settings.joinedEventIds ?? emptyEventIds)
  const tripEndsAt = useAppStore((state) => state.settings.tripEndsAt)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [now, setNow] = useState(() => new Date())
  const timeZone = destinationTimeZones[destination]
  const tripExpired = new Date(tripEndsAt ?? now.getTime()).getTime() <= now.getTime()
  const destinationNow = useMemo(() => getDestinationNow(timeZone, now), [timeZone, now])
  const weather = dailyWeather[destination]
  const details = destinationDetails[destination]
  const plan = dailyPlans[destination]
  const events = tripExpired ? [] : communityEvents[destination]
  const arrivals = (tripExpired ? [] : travellerArrivals[destination])
    .map((arrival) => ({
      ...arrival,
      traveller: travellers.find((traveller) => traveller.id === arrival.travellerId),
    }))
    .filter((arrival) => arrival.traveller)
  const communityCount = tripExpired ? 0 : travellers.filter((traveller) => traveller.destination === destination).length
  const interestCounts = travellers
    .filter((traveller) => traveller.destination === destination)
    .reduce<Record<string, number>>((counts, traveller) => {
      counts[traveller.archetype] = (counts[traveller.archetype] ?? 0) + 1
      return counts
    }, {})
  const mostSharedInterest = Object.entries(interestCounts).sort((first, second) => second[1] - first[1])[0]?.[0] ?? 'Local exploring'
  const WeatherIcon = weather.icon === 'rain' ? CloudDrizzle : weather.icon === 'cloud' ? Cloud : Sun

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(interval)
  }, [])

  function toggleJoinedEvent(eventId: string) {
    updateSettings({
      joinedEventIds: joinedEventIds.includes(eventId)
        ? joinedEventIds.filter((id) => id !== eventId)
        : [...joinedEventIds, eventId],
    })
  }

  return (
    <div className="page-content today-page">
      <section className="today-greeting">
        <div className="today-greeting-copy">
          <span className="eyebrow">{destinationNow.date.toUpperCase()} · {destination.toUpperCase()}</span>
          <h2>{destinationNow.greeting}, traveller.</h2>
          <p>A few good ideas for finding your rhythm in {destination}.</p>
        </div>
        <div className="live-clock" aria-label={`Local time ${destinationNow.time}`}>
          <span className="clock-pulse" />
          <Clock3 size={13} />
          <strong>{destinationNow.time}</strong>
          <small>LOCAL</small>
        </div>
      </section>

      <section className="today-weather-card" aria-label={`Weather in ${destination}`}>
        <div className={`weather-icon weather-icon-${weather.icon}`}><WeatherIcon size={23} /></div>
        <div className="today-weather-copy">
          <strong>{destination} <span>·</span> {weather.temperature}°</strong>
          <span>{weather.condition}</span>
          <small>{weather.note}</small>
        </div>
        <div className="weather-range"><span>HIGH <b>{weather.high}°</b></span><i /><span>LOW <b>{weather.low}°</b></span></div>
      </section>

      <section className="plan-section">
        <SectionHeading
          title="Today's plan"
          detail="A flexible little outline—take what works."
          action={<span className="plan-date-chip"><CalendarDays size={12} /> TODAY</span>}
        />
        <div className="timeline-card">
          {plan.map((stop, index) => {
            const Icon = planIcons[stop.category]
            const status = statusForStop(stop.time, destinationNow.clock)
            return (
              <article className={`timeline-stop${status === 'next' ? ' timeline-stop-next' : ''}${status === 'past' ? ' timeline-stop-past' : ''}`} key={stop.id}>
                <div className="timeline-rail">
                  <span className="timeline-icon">{status === 'past' ? <Check size={13} /> : <Icon size={14} />}</span>
                  {index < plan.length - 1 && <span className="timeline-line" />}
                </div>
                <div className="timeline-copy">
                  <div className="timeline-meta"><time>{stop.time}</time>{status === 'next' && <span className="next-up-badge">UP NEXT</span>}{status === 'past' && <span className="done-badge">DONE</span>}</div>
                  <h3>{stop.title}</h3>
                  <span className="timeline-location"><MapPin size={11} /> {stop.neighbourhood}</span>
                  <p>{stop.note}</p>
                </div>
                <ChevronRight size={15} className="timeline-chevron" aria-hidden="true" />
              </article>
            )
          })}
        </div>
      </section>

      <section className="arrivals-section">
        <SectionHeading
          title="Arriving today"
          detail={`${arrivals.length} travellers starting their day here`}
          action={<span className="arrival-count"><UsersRound size={12} /> {communityCount} in town</span>}
        />
        <div className="arrival-carousel" aria-label={`Travellers arriving in ${destination} today`}>
          {arrivals.map(({ traveller, arrival }) => traveller && (
            <article className="arrival-card" key={traveller.id}>
              <div className={`arrival-avatar arrival-avatar-${traveller.archetype.toLowerCase().replaceAll(' ', '-')}`}>
                {traveller.initials}
                {traveller.verified && <span className="arrival-verified"><BadgeCheck size={12} /></span>}
              </div>
              <strong>{traveller.name.split(' ')[0]}</strong>
              <span className="arrival-archetype">{traveller.archetype.replace('The ', '')}</span>
              <span className="arrival-time">{arrival}</span>
            </article>
          ))}
        </div>
        <button className="all-travellers-link" onClick={() => navigate('/map')}>
          See your destination community <ArrowRight size={14} />
        </button>
      </section>

      <section className="events-section">
        <SectionHeading title="Out in the open" detail={tripExpired ? 'Your trip community has closed' : 'Public plans from your trip community'} />
        {tripExpired && <div className="community-ended-inline">This temporary community has ended. Start a new trip in Privacy & safety to see traveller plans.</div>}
        <div className="event-list">
          {events.map((event) => {
            const isJoined = joinedEventIds.includes(event.id)
            const going = event.goingTravellerIds
              .map((id) => travellers.find((traveller) => traveller.id === id))
              .filter((traveller) => traveller !== undefined)
            return (
              <article className="event-card" key={event.id}>
                <div className="event-card-heading">
                  <span className="event-category"><UsersRound size={12} /> {event.category}</span>
                  <span className="event-date">{event.time}</span>
                </div>
                <h3>{event.title}</h3>
                <span className="event-venue"><MapPin size={12} /> {event.venue} <i>·</i> {event.neighbourhood}</span>
                <p>{event.description}</p>
                <div className="event-footer">
                  <div className="going-people" aria-label={`${going.length} travellers going`}>
                    <div className="going-avatars">
                      {going.slice(0, 3).map((traveller, index) => (
                        <span className={`going-avatar going-avatar-${index}`} key={traveller.id} title={traveller.name}>{traveller.initials}</span>
                      ))}
                    </div>
                    <span><strong>{going.length + (isJoined ? 1 : 0)} going</strong><small>community members</small></span>
                  </div>
                  <button
                    className={`join-event-button${isJoined ? ' joined' : ''}`}
                    aria-pressed={isJoined}
                    onClick={() => toggleJoinedEvent(event.id)}
                  >
                    {isJoined ? <><Check size={13} /> Joined</> : <>Join community <ArrowRight size={13} /></>}
                  </button>
                </div>
                {isJoined && <div className="joined-event-note" role="status">You’re in the event community. You can leave whenever you like.</div>}
              </article>
            )
          })}
        </div>
      </section>

      <section className="quick-insights-section">
        <SectionHeading
          title="Quick insights"
          detail={`A small read on ${destination} today`}
          action={<button className="insights-open-link" onClick={() => navigate('/insights')}><BarChart3 size={12} /> See all</button>}
        />
        <div className="quick-insights-strip">
          <article className="quick-insight-card">
            <span className="insight-icon insight-icon-teal"><UsersRound size={14} /></span>
            <strong>{communityCount}</strong>
            <small>travellers in town</small>
          </article>
          <article className="quick-insight-card">
            <span className="insight-icon insight-icon-violet"><CalendarDays size={14} /></span>
            <strong>{events.length}</strong>
            <small>public plans today</small>
          </article>
          <article className="quick-insight-card">
            <span className="insight-icon insight-icon-amber"><Compass size={14} /></span>
            <strong>{mostSharedInterest.replace('The ', '')}</strong>
            <small>shared travel vibe</small>
          </article>
        </div>
      </section>

      <button className="today-discover-link" onClick={() => navigate('/discover')}>
        <span><Compass size={15} /> Find a good stop and shape your day</span><ArrowRight size={14} />
      </button>
      <div className="today-footnote"><ShieldCheck size={14} /> Plans are suggestions. Join only what feels comfortable, in public places.</div>
      <span className="today-destination-footnote"><MapPin size={12} /> {destination}, {details.region} <span>·</span> Local time {destinationNow.clock}</span>
    </div>
  )
}
