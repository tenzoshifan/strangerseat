import { ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { destinationDetails, destinations, type Destination } from '../lib/destinations'
import { useAppStore } from '../store/appStore'

export function DestinationStartPage() {
  const navigate = useNavigate()
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const [destination, setDestination] = useState<Destination>(settings.destination)

  function findTravellers() {
    updateSettings({ destination, hasChosenDestination: true })
    navigate('/matches')
  }

  return (
    <div className="page-content journey-page">
      <JourneySteps current={1} />
      <section className="journey-intro">
        <span className="journey-icon"><MapPin size={20} /></span>
        <span className="eyebrow">STEP 1 · YOUR DESTINATION</span>
        <h2>Where are you going?</h2>
        <p>Choose the place you have in mind. We’ll find travellers heading there too.</p>
      </section>
      <div className="destination-card-list" role="radiogroup" aria-label="Choose your destination">
        {destinations.map((place) => {
          const selected = destination === place
          return (
            <button
              key={place}
              className={`journey-destination-card${selected ? ' selected' : ''}`}
              role="radio"
              aria-checked={selected}
              onClick={() => setDestination(place)}
            >
              <span><strong>{place}</strong><small>{destinationDetails[place].region}</small></span>
              <span className="destination-code">{destinationDetails[place].code}</span>
            </button>
          )
        })}
      </div>
      <button className="journey-primary" onClick={findTravellers}>
        Find travellers going to {destination}<ArrowRight size={16} />
      </button>
      <p className="journey-privacy-note">Your exact location is never shared. Destination choice stays on this device.</p>
    </div>
  )
}

export function JourneySteps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Choose place', 'Find matches', 'Connect & chat']
  return (
    <ol className="journey-steps" aria-label="Your travel connection steps">
      {steps.map((label, index) => {
        const step = index + 1
        return (
          <li className={step === current ? 'current' : step < current ? 'complete' : ''} key={label} aria-current={step === current ? 'step' : undefined}>
            <span>{step < current ? '✓' : step}</span><small>{label}</small>
          </li>
        )
      })}
    </ol>
  )
}
