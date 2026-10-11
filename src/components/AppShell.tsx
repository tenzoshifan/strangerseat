import { Bell, Compass } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav'
import { useAppStore } from '../store/appStore'

const pageTitles: Record<string, string> = {
  '/matches': 'Find travellers',
  '/map': 'The Stranger Seat',
  '/today': 'Your day',
  '/insights': 'Travel insights',
  '/discover': 'Discover & plan',
  '/chats': 'Conversations',
  '/stories': 'Travel notes',
  '/profile': 'Your profile',
  '/safety': 'Privacy & safety',
}

export function AppShell() {
  const location = useLocation()
  const tripEndsAt = useAppStore((state) => state.settings.tripEndsAt)
  const destination = useAppStore((state) => state.settings.destination)
  const [now, setNow] = useState(() => Date.now())
  const tripExpired = new Date(tripEndsAt ?? now).getTime() <= now

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="app-screen">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <Compass size={17} strokeWidth={2.2} />
          </span>
          <div>
            <span className="eyebrow">A little less alone</span>
            <h1>{pageTitles[location.pathname] ?? 'The Stranger Seat'}</h1>
          </div>
        </div>
        <button className="icon-button notification-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
      </header>
      {tripExpired && location.pathname !== '/safety' && (
        <div className="community-closed-banner" role="status">
          <span><strong>{destination} trip community closed</strong><small>Traveller discovery and chat are paused until your next trip.</small></span>
          <Link to="/safety">Review</Link>
        </div>
      )}
      <main className="page-scroll" id="main-content">
        <div
          key={location.pathname}
          className="page-transition"
        >
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
