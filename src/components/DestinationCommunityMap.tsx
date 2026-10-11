import { divIcon } from 'leaflet'
import { MapPin, UsersRound } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import { places } from '../data/places'
import { travellers } from '../data/travellers'
import { destinationDetails, type Destination } from '../lib/destinations'

const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY?.trim()
const mapTileUrl = cartoApiKey
  ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoApiKey)}`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const mapAttribution = cartoApiKey
  ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions/">CARTO</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function approximateCoordinates(id: string, coordinates: [number, number]): [number, number] {
  const seed = id.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return [
    coordinates[0] + Math.sin(seed) * 0.00115,
    coordinates[1] + Math.cos(seed) * 0.00115,
  ]
}

export function DestinationCommunityMap({ destination }: { destination: Destination }) {
  const destinationTravellers = travellers.filter((traveller) => traveller.destination === destination)
  const destinationPlaces = places.filter((place) => place.destination === destination)
  const destinationInfo = destinationDetails[destination]

  return (
    <section className="discovery-map-section" aria-labelledby="discovery-map-title">
      <div className="discovery-section-heading">
        <div>
          <span className="eyebrow">SAME-PLACE COMMUNITY</span>
          <h3 id="discovery-map-title">Explore {destination}</h3>
        </div>
        <span className="discovery-map-count"><UsersRound size={12} /> {destinationTravellers.length} · <MapPin size={12} /> {destinationPlaces.length}</span>
      </div>
      <div className={`discovery-map-card light-map${cartoApiKey ? ' carto-map' : ''}`} aria-label={`Map of ${destination} travellers and places`}>
        <MapContainer
          key={destination}
          center={destinationInfo.coordinates}
          zoom={destinationInfo.zoom}
          zoomControl={false}
          scrollWheelZoom
          className="discovery-leaflet-map"
          aria-label={`Interactive map of ${destination}`}
        >
          <TileLayer attribution={mapAttribution} url={mapTileUrl} />
          <ZoomControl position="bottomright" />
          {destinationTravellers.map((traveller) => {
            const icon = divIcon({
              className: `traveller-marker${traveller.activeRecently ? ' traveller-marker-active' : ''}`,
              html: `<span class="traveller-marker-inner">${traveller.initials}</span>`,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            })
            return (
              <Marker key={traveller.id} position={approximateCoordinates(traveller.id, traveller.coordinates)} icon={icon} title={`${traveller.name} · ${traveller.archetype}`}>
                <Popup>
                  <strong>{traveller.name}</strong><br />
                  {traveller.archetype}<br />
                  {traveller.verified ? 'Verified traveller' : 'Not verified'} · {traveller.status}
                </Popup>
              </Marker>
            )
          })}
          {destinationPlaces.map((place) => {
            const icon = divIcon({
              className: `place-marker${place.category === 'Cafe' ? ' place-marker-cafe' : place.category === 'Hotel' ? ' place-marker-hotel' : ''}`,
              html: `<span class="place-marker-icon">${place.category === 'Cafe' ? 'C' : place.category === 'Hotel' ? 'H' : 'P'}</span>`,
              iconSize: [29, 29],
              iconAnchor: [14, 14],
            })
            return (
              <Marker key={place.id} position={place.coordinates} icon={icon} title={`${place.name} · ${place.category}`}>
                <Popup>
                  <strong>{place.name}</strong><br />
                  {place.category} · {place.neighbourhood}<br />
                  {place.note}
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
        <div className="discovery-map-legend">
          <span><i className="legend-person">A</i> Travellers</span>
          <span><i className="legend-place">P</i> Places</span>
          <span>Approximate activity areas</span>
        </div>
      </div>
      <div className="discovery-place-list">
        <h4>Places in {destination}</h4>
        {destinationPlaces.length ? destinationPlaces.map((place) => (
          <article className="discovery-place-row" key={place.id}>
            <span className={`discovery-place-icon${place.category === 'Cafe' ? ' cafe' : place.category === 'Hotel' ? ' hotel' : ''}`}><MapPin size={14} /></span>
            <span><strong>{place.name}</strong><small>{place.category} · {place.neighbourhood}</small><small>{place.note}</small></span>
          </article>
        )) : <p className="discovery-no-places">No place recommendations are listed for this destination yet.</p>}
      </div>
    </section>
  )
}
