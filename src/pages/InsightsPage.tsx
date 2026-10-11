import {
  ArrowLeft,
  ArrowUpRight,
  BadgeDollarSign,
  Clock3,
  Coffee,
  Compass,
  Lightbulb,
  MapPin,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { destinationInsights } from '../data/insights'
import { travellers } from '../data/travellers'
import { destinationDetails } from '../lib/destinations'
import { useAppStore } from '../store/appStore'

const chartTooltipStyle = {
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 10,
  background: 'rgba(18,25,33,.96)',
  color: '#e7eeee',
  fontSize: 10,
}

export function InsightsPage() {
  const navigate = useNavigate()
  const destination = useAppStore((state) => state.settings.destination)
  const insights = destinationInsights[destination]
  const details = destinationDetails[destination]
  const travellerCount = travellers.filter((traveller) => traveller.destination === destination).length
  const weeklyArrivals = insights.week.reduce((sum, day) => sum + day.travellers, 0)
  const busiestHour = insights.cafeHours.reduce((busiest, hour) => hour.visits > busiest.visits ? hour : busiest)

  return (
    <div className="page-content insights-page">
      <section className="insights-intro">
        <button className="insights-back-button" onClick={() => navigate('/today')} aria-label="Back to Today">
          <ArrowLeft size={16} />
        </button>
        <div className="insights-intro-copy">
          <span className="eyebrow">A READ ON YOUR COMMUNITY</span>
          <h2>{destination}, in good company.</h2>
          <p>Small signals from travellers sharing this trip, not a live headcount.</p>
        </div>
      </section>

      <section className="insights-summary-strip">
        <article><span className="insights-summary-icon"><UsersRound size={14} /></span><strong>{travellerCount}</strong><small>travellers nearby</small></article>
        <article><span className="insights-summary-icon violet"><ArrowUpRight size={14} /></span><strong>{weeklyArrivals}</strong><small>arrivals this week</small></article>
        <article><span className="insights-summary-icon amber"><Compass size={14} /></span><strong>{insights.trending.length}</strong><small>places trending</small></article>
      </section>

      <section className="insight-panel weekly-panel">
        <div className="insight-panel-heading">
          <span className="insight-panel-icon teal"><UsersRound size={15} /></span>
          <div><h3>Travellers this week</h3><p>People heading to {destination} each day</p></div>
          <span className="insight-data-chip">7 DAYS</span>
        </div>
        <div className="chart-frame weekly-chart" role="img" aria-label={`Weekly arrivals trend for ${destination}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insights.week} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.065)" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#839198', fontSize: 8 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#74828a', fontSize: 8 }} width={27} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value} travellers`, 'Arrivals']} />
              <Line type="monotone" dataKey="travellers" stroke="#2dd4bf" strokeWidth={2.5} dot={{ r: 3, fill: '#2dd4bf', stroke: '#12201f', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#e9dcff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-caption"><span><i className="legend-dot teal-dot" />Travellers sharing this destination</span><span>Mock community trend</span></div>
      </section>

      <section className="insight-panel trending-panel">
        <div className="insight-panel-heading">
          <span className="insight-panel-icon amber"><Sparkles size={15} /></span>
          <div><h3>Places being talked about</h3><p>Most mentioned in this trip community</p></div>
        </div>
        <div className="trending-list">
          {insights.trending.map((place, index) => (
            <article className="trending-row" key={place.name}>
              <span className={`trending-rank${index === 0 ? ' top-rank' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
              <span className={`trending-place-icon trending-place-${place.category.toLowerCase().replaceAll(' ', '-')}`}>
                {place.category === 'Cafe' ? <Coffee size={14} /> : place.category === 'Local tip' ? <Lightbulb size={14} /> : <MapPin size={14} />}
              </span>
              <span className="trending-place-copy"><strong>{place.name}</strong><small>{place.area} · {place.category}</small></span>
              <span className="trending-mentions">{place.mentions}<small>mentions</small></span>
              <span className="trending-change">{place.change}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="insight-panel cafe-panel">
        <div className="insight-panel-heading">
          <span className="insight-panel-icon violet"><Coffee size={15} /></span>
          <div><h3>Cafe rhythms</h3><p>When this community tends to stop for coffee</p></div>
        </div>
        <div className="chart-frame cafe-chart" role="img" aria-label={`Busiest cafe hours in ${destination}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.cafeHours} margin={{ top: 7, right: 2, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.06)" strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#839198', fontSize: 7 }} dy={7} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#74828a', fontSize: 8 }} width={27} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value} visits`, 'Cafe visits']} />
              <Bar dataKey="visits" radius={[5, 5, 1, 1]} maxBarSize={22}>
                {insights.cafeHours.map((hour) => (
                  <Cell key={hour.hour} fill={hour.hour === busiestHour.hour ? '#2dd4bf' : '#6f58aa'} fillOpacity={hour.hour === busiestHour.hour ? 0.95 : 0.72} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="busiest-hour-note"><span className="busiest-hour-icon"><Clock3 size={13} /></span><span><strong>{busiestHour.hour} is the busiest pause</strong><small>Try a quieter cafe stop outside the evening rush.</small></span></div>
      </section>

      <section className="insight-panel budget-panel">
        <div className="insight-panel-heading">
          <span className="insight-panel-icon amber"><BadgeDollarSign size={15} /></span>
          <div><h3>Community budget mix</h3><p>A rough guide to what travellers prefer</p></div>
        </div>
        <div className="budget-chart-layout">
          <div className="chart-frame budget-chart" role="img" aria-label={`Budget preferences among ${destination} travellers`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={insights.budgets} dataKey="share" nameKey="range" innerRadius="58%" outerRadius="82%" paddingAngle={3} stroke="none">
                  {insights.budgets.map((segment) => <Cell key={segment.range} fill={segment.colour} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Travellers']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="budget-chart-center"><BadgeDollarSign size={14} /><strong>100%</strong><small>community</small></div>
          </div>
          <div className="budget-legend">
            {insights.budgets.map((segment) => (
              <div className="budget-legend-row" key={segment.range}>
                <i style={{ backgroundColor: segment.colour }} />
                <span>{segment.range}</span>
                <strong>{segment.share}%</strong>
              </div>
            ))}
          </div>
        </div>
        <p className="insight-disclaimer">Shared as a broad planning signal—not a promise of individual spend.</p>
      </section>

      <section className="insight-panel interests-panel">
        <div className="insight-panel-heading">
          <span className="insight-panel-icon teal"><Compass size={15} /></span>
          <div><h3>What brings people here</h3><p>Popular shared travel interests</p></div>
        </div>
        <div className="chart-frame interests-chart" role="img" aria-label={`Popular travel interests in ${destination}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.interests} layout="vertical" margin={{ top: 2, right: 24, left: 2, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.055)" strokeDasharray="3 4" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={107} axisLine={false} tickLine={false} tick={{ fill: '#adb9bd', fontSize: 8 }} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value} travellers`, 'Interested travellers']} />
              <Bar dataKey="travellers" radius={[1, 5, 5, 1]} maxBarSize={12} fill="#8b5cf6" background={{ fill: 'rgba(255,255,255,.035)', radius: 5 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-caption"><span><i className="legend-dot violet-dot" />Traveller-selected interests</span><span>Mock community mix</span></div>
      </section>

      <section className="best-time-card">
        <span className="best-time-icon"><Lightbulb size={17} /></span>
        <div className="best-time-copy">
          <span className="eyebrow">A GOOD TIME TO GO</span>
          <h3>{insights.bestTime.time}</h3>
          <strong>{insights.bestTime.reason}</strong>
          <p>{insights.bestTime.detail}</p>
        </div>
        <span className="best-time-decoration"><Clock3 size={38} /></span>
      </section>

      <div className="insights-source-note">
        <span><UsersRound size={13} /> {travellerCount} mock travellers in {destination}</span>
        <span><MapPin size={13} /> {details.region}</span>
      </div>
      <p className="insights-privacy-note">Community signals are mocked for this preview. Individual travel choices stay private.</p>
    </div>
  )
}
