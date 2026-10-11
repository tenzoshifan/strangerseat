import { MessageCircle, Sparkles, UserRound, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/matches', label: 'Matches', icon: UsersRound },
  { to: '/today', label: 'Today', icon: Sparkles },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
  { to: '/stories', label: 'Stories', icon: UsersRound },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          aria-label={label}
        >
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
