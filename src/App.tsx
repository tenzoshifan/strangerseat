import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ChatsPage } from './pages/ChatsPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { InsightsPage } from './pages/InsightsPage'
import { MatchesPage } from './pages/MatchesPage'
import { ProfilePage } from './pages/ProfilePage'
import { QuizPage } from './pages/QuizPage'
import { DestinationStartPage } from './pages/DestinationStartPage'
import { StoriesPage } from './pages/StoriesPage'
import { SafetyPage } from './pages/SafetyPage'
import { TodayPage } from './pages/TodayPage'
import { useAppStore } from './store/appStore'

const MapPage = lazy(() => import('./pages/MapPage').then((module) => ({ default: module.MapPage })))

function FirstRunGate() {
  const hasChosenDestination = useAppStore((state) => state.settings.hasChosenDestination)

  return hasChosenDestination ? <Outlet /> : <Navigate to="/onboarding" replace />
}

function RouteContent() {
  const location = useLocation()
  const hasChosenDestination = useAppStore((state) => state.settings.hasChosenDestination)

  return (
      <Routes location={location} key={location.pathname}>
        <Route path="/onboarding" element={<DestinationStartPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route element={<FirstRunGate />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/matches" replace />} />
            <Route
              path="/map"
              element={
                <Suspense fallback={<div className="map-loading" role="status">Preparing your community map…</div>}>
                  <MapPage />
                </Suspense>
              }
            />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/safety" element={<SafetyPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={hasChosenDestination ? '/matches' : '/onboarding'} replace />} />
      </Routes>
  )
}

function App() {
  const theme = useAppStore((state) => state.settings.theme ?? 'light')

  return (
    <BrowserRouter>
      <div className="app-stage">
        <div className="device-frame" data-theme={theme}>
          <RouteContent />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
