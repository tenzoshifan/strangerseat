import type { Destination } from '../lib/destinations'

export interface TravellerWeek {
  day: string
  travellers: number
}

export interface CafeHour {
  hour: string
  visits: number
}

export interface BudgetSegment {
  range: string
  share: number
  colour: string
}

export interface InterestInsight {
  name: string
  travellers: number
}

export interface TrendingPlace {
  name: string
  area: string
  mentions: number
  change: string
  category: string
}

export interface DestinationInsights {
  week: TravellerWeek[]
  cafeHours: CafeHour[]
  budgets: BudgetSegment[]
  interests: InterestInsight[]
  trending: TrendingPlace[]
  bestTime: { time: string; reason: string; detail: string }
}

const uaeInsights: DestinationInsights = {
  week: [
    { day: 'Mon', travellers: 14 }, { day: 'Tue', travellers: 18 }, { day: 'Wed', travellers: 21 },
    { day: 'Thu', travellers: 27 }, { day: 'Fri', travellers: 35 }, { day: 'Sat', travellers: 42 },
    { day: 'Sun', travellers: 32 },
  ],
  cafeHours: [
    { hour: '8 AM', visits: 17 }, { hour: '10 AM', visits: 29 }, { hour: '12 PM', visits: 22 },
    { hour: '2 PM', visits: 15 }, { hour: '4 PM', visits: 31 }, { hour: '6 PM', visits: 39 },
    { hour: '8 PM', visits: 26 },
  ],
  budgets: [
    { range: 'Under AED 150', share: 30, colour: '#2dd4bf' },
    { range: 'AED 150–400', share: 40, colour: '#8b5cf6' },
    { range: 'AED 400–800', share: 22, colour: '#f59e0b' },
    { range: 'AED 800+', share: 8, colour: '#5f7d95' },
  ],
  interests: [
    { name: 'Local food & cafes', travellers: 32 }, { name: 'Neighbourhood walks', travellers: 28 },
    { name: 'Arts & culture', travellers: 24 }, { name: 'Waterfront time', travellers: 20 },
    { name: 'History & heritage', travellers: 16 },
  ],
  trending: [],
  bestTime: { time: '4:30–6:00 PM', reason: 'For a comfortable neighbourhood walk', detail: 'Late afternoon is generally a more comfortable time to explore outdoors. Check local conditions on the day.' },
}

export const destinationInsights: Record<Destination, DestinationInsights> = {
  Dubai: {
    week: [
      { day: 'Mon', travellers: 28 },
      { day: 'Tue', travellers: 34 },
      { day: 'Wed', travellers: 31 },
      { day: 'Thu', travellers: 43 },
      { day: 'Fri', travellers: 52 },
      { day: 'Sat', travellers: 61 },
      { day: 'Sun', travellers: 47 },
    ],
    cafeHours: [
      { hour: '8 AM', visits: 18 },
      { hour: '10 AM', visits: 32 },
      { hour: '12 PM', visits: 21 },
      { hour: '2 PM', visits: 16 },
      { hour: '4 PM', visits: 37 },
      { hour: '6 PM', visits: 45 },
      { hour: '8 PM', visits: 29 },
    ],
    budgets: [
      { range: 'Under AED 150', share: 28, colour: '#2dd4bf' },
      { range: 'AED 150–400', share: 42, colour: '#8b5cf6' },
      { range: 'AED 400–800', share: 21, colour: '#f59e0b' },
      { range: 'AED 800+', share: 9, colour: '#5f7d95' },
    ],
    interests: [
      { name: 'Local food & cafes', travellers: 42 },
      { name: 'Neighbourhood walks', travellers: 35 },
      { name: 'Arts & culture', travellers: 28 },
      { name: 'Architecture', travellers: 23 },
      { name: 'Outdoor time', travellers: 17 },
    ],
    trending: [
      { name: 'Al Fahidi lanes', area: 'Bur Dubai', mentions: 38, change: '+18%', category: 'Neighbourhood' },
      { name: 'Arabian Tea House', area: 'Al Fahidi', mentions: 31, change: '+12%', category: 'Cafe' },
      { name: 'Dubai Creek abra', area: 'Al Seef', mentions: 24, change: '+9%', category: 'Local tip' },
    ],
    bestTime: { time: '4:30–6:00 PM', reason: 'For a walk through Old Dubai', detail: 'The afternoon heat eases, the lanes get a softer light, and the creek is especially pleasant.' },
  },
  'Abu Dhabi': {
    ...uaeInsights,
    trending: [
      { name: 'Qasr Al Hosn district', area: 'Al Hosn', mentions: 22, change: '+12%', category: 'Heritage' },
      { name: 'Saadiyat cultural district', area: 'Saadiyat Island', mentions: 19, change: '+10%', category: 'Arts & culture' },
      { name: 'Corniche promenade', area: 'Abu Dhabi Corniche', mentions: 16, change: '+7%', category: 'Local tip' },
    ],
    bestTime: { time: '4:30–6:00 PM', reason: 'For the Corniche', detail: 'The waterfront is more comfortable later in the day; check the forecast and local conditions before a long walk.' },
  },
  Sharjah: {
    ...uaeInsights,
    trending: [
      { name: 'Al Majaz Waterfront', area: 'Al Majaz', mentions: 20, change: '+13%', category: 'Waterfront' },
      { name: 'Sharjah Art Museum', area: 'Al Shuwaiheen', mentions: 17, change: '+9%', category: 'Arts & culture' },
      { name: 'Heart of Sharjah', area: 'Al Mareija', mentions: 14, change: '+8%', category: 'Heritage' },
    ],
    bestTime: { time: '4:00–5:30 PM', reason: 'For the Al Majaz lagoon', detail: 'A late-afternoon visit leaves time for the galleries and an easy public waterfront walk.' },
  },
  'Ras Al Khaimah': {
    ...uaeInsights,
    trending: [
      { name: 'Jebel Jais viewpoints', area: 'Jebel Jais', mentions: 23, change: '+16%', category: 'Outdoors' },
      { name: 'Dhayah Fort', area: 'Dhayah', mentions: 16, change: '+11%', category: 'Heritage' },
      { name: 'Al Qawasim Corniche', area: 'RAK city', mentions: 13, change: '+6%', category: 'Local tip' },
    ],
    bestTime: { time: '7:00–9:00 AM', reason: 'For a mountain outing', detail: 'Set out early, check mountain road conditions, and follow official guidance for activities and viewpoints.' },
  },
  Ajman: {
    ...uaeInsights,
    trending: [
      { name: 'Ajman Museum', area: 'Ajman Old Town', mentions: 16, change: '+10%', category: 'Heritage' },
      { name: 'Ajman Corniche', area: 'Ajman Corniche', mentions: 15, change: '+8%', category: 'Waterfront' },
      { name: 'Al Zorah Mangroves', area: 'Al Zorah', mentions: 12, change: '+7%', category: 'Outdoors' },
    ],
    bestTime: { time: '4:30–6:00 PM', reason: 'For a coastal stroll', detail: 'The public corniche is a relaxed option later in the day; keep outdoor plans weather-aware.' },
  },
  Fujairah: {
    ...uaeInsights,
    trending: [
      { name: 'Fujairah Fort', area: 'Old Fujairah', mentions: 18, change: '+11%', category: 'Heritage' },
      { name: 'Al Bidya Mosque', area: 'Al Bidya', mentions: 14, change: '+9%', category: 'Culture' },
      { name: 'Fujairah Corniche', area: 'Fujairah city', mentions: 12, change: '+6%', category: 'Local tip' },
    ],
    bestTime: { time: '4:00–5:30 PM', reason: 'For the old town', detail: 'Pair the fort and nearby heritage village in the cooler part of the day, with time to pause.' },
  },
  Goa: {
    week: [
      { day: 'Mon', travellers: 19 },
      { day: 'Tue', travellers: 23 },
      { day: 'Wed', travellers: 27 },
      { day: 'Thu', travellers: 35 },
      { day: 'Fri', travellers: 42 },
      { day: 'Sat', travellers: 53 },
      { day: 'Sun', travellers: 45 },
    ],
    cafeHours: [
      { hour: '8 AM', visits: 23 },
      { hour: '10 AM', visits: 39 },
      { hour: '12 PM', visits: 26 },
      { hour: '2 PM', visits: 19 },
      { hour: '4 PM', visits: 31 },
      { hour: '6 PM', visits: 42 },
      { hour: '8 PM', visits: 34 },
    ],
    budgets: [
      { range: 'Under ₹1,500', share: 37, colour: '#2dd4bf' },
      { range: '₹1,500–3,500', share: 38, colour: '#8b5cf6' },
      { range: '₹3,500–7,000', share: 18, colour: '#f59e0b' },
      { range: '₹7,000+', share: 7, colour: '#5f7d95' },
    ],
    interests: [
      { name: 'Local food & cafes', travellers: 39 },
      { name: 'Neighbourhood walks', travellers: 33 },
      { name: 'Beaches & outdoors', travellers: 30 },
      { name: 'Arts & culture', travellers: 21 },
      { name: 'Slow mornings', travellers: 18 },
    ],
    trending: [
      { name: 'Fontainhas lanes', area: 'Panaji', mentions: 34, change: '+16%', category: 'Neighbourhood' },
      { name: 'Cafe Bodega', area: 'Panaji', mentions: 27, change: '+11%', category: 'Cafe' },
      { name: 'Mandovi promenade', area: 'Campal', mentions: 19, change: '+8%', category: 'Local tip' },
    ],
    bestTime: { time: '4:00–5:30 PM', reason: 'For the Fontainhas quarter', detail: 'It is cooler in the old lanes, and the late light brings out the colour of the houses.' },
  },
  Kochi: {
    week: [
      { day: 'Mon', travellers: 16 },
      { day: 'Tue', travellers: 22 },
      { day: 'Wed', travellers: 25 },
      { day: 'Thu', travellers: 32 },
      { day: 'Fri', travellers: 39 },
      { day: 'Sat', travellers: 48 },
      { day: 'Sun', travellers: 41 },
    ],
    cafeHours: [
      { hour: '8 AM', visits: 21 },
      { hour: '10 AM', visits: 35 },
      { hour: '12 PM', visits: 27 },
      { hour: '2 PM', visits: 19 },
      { hour: '4 PM', visits: 33 },
      { hour: '6 PM', visits: 40 },
      { hour: '8 PM', visits: 26 },
    ],
    budgets: [
      { range: 'Under ₹1,500', share: 34, colour: '#2dd4bf' },
      { range: '₹1,500–3,500', share: 41, colour: '#8b5cf6' },
      { range: '₹3,500–7,000', share: 19, colour: '#f59e0b' },
      { range: '₹7,000+', share: 6, colour: '#5f7d95' },
    ],
    interests: [
      { name: 'Local food & cafes', travellers: 37 },
      { name: 'Arts & culture', travellers: 32 },
      { name: 'Neighbourhood walks', travellers: 29 },
      { name: 'Waterfront time', travellers: 23 },
      { name: 'History & heritage', travellers: 18 },
    ],
    trending: [
      { name: 'Fort Kochi waterfront', area: 'Fort Kochi', mentions: 29, change: '+15%', category: 'Neighbourhood' },
      { name: 'Loafers Corner Cafe', area: 'Fort Kochi', mentions: 25, change: '+12%', category: 'Cafe' },
      { name: 'Ferry to Vypin', area: 'Fort Kochi Jetty', mentions: 18, change: '+7%', category: 'Local tip' },
    ],
    bestTime: { time: '5:00–6:15 PM', reason: 'For the waterfront and fishing nets', detail: 'A cooler breeze comes off the water and the fishing nets make a lovely backdrop at dusk.' },
  },
  Munnar: {
    week: [
      { day: 'Mon', travellers: 13 },
      { day: 'Tue', travellers: 18 },
      { day: 'Wed', travellers: 21 },
      { day: 'Thu', travellers: 28 },
      { day: 'Fri', travellers: 36 },
      { day: 'Sat', travellers: 44 },
      { day: 'Sun', travellers: 38 },
    ],
    cafeHours: [
      { hour: '8 AM', visits: 32 },
      { hour: '10 AM', visits: 37 },
      { hour: '12 PM', visits: 25 },
      { hour: '2 PM', visits: 17 },
      { hour: '4 PM', visits: 28 },
      { hour: '6 PM', visits: 35 },
      { hour: '8 PM', visits: 22 },
    ],
    budgets: [
      { range: 'Under ₹1,500', share: 31, colour: '#2dd4bf' },
      { range: '₹1,500–3,500', share: 40, colour: '#8b5cf6' },
      { range: '₹3,500–7,000', share: 22, colour: '#f59e0b' },
      { range: '₹7,000+', share: 7, colour: '#5f7d95' },
    ],
    interests: [
      { name: 'Tea gardens & walks', travellers: 40 },
      { name: 'Nature & outdoors', travellers: 36 },
      { name: 'Local food & cafes', travellers: 27 },
      { name: 'Slow mornings', travellers: 22 },
      { name: 'History & heritage', travellers: 15 },
    ],
    trending: [
      { name: 'Tea Museum trail', area: 'Nallathanni Estate', mentions: 27, change: '+17%', category: 'Neighbourhood' },
      { name: 'Tea Tales Cafe', area: 'Munnar town', mentions: 22, change: '+10%', category: 'Cafe' },
      { name: 'Tea garden viewpoint', area: 'Old Munnar', mentions: 18, change: '+8%', category: 'Local tip' },
    ],
    bestTime: { time: '7:30–9:00 AM', reason: 'For the tea garden paths', detail: 'Start early for clearer hill views, cooler air, and a better chance of walking before the mist rolls in.' },
  },
}
