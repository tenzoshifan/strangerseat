import type { Destination } from '../lib/destinations'

export interface DailyWeather {
  temperature: number
  high: number
  low: number
  condition: string
  note: string
  icon: 'sun' | 'cloud' | 'rain'
}

export interface PlanStop {
  id: string
  time: string
  title: string
  neighbourhood: string
  note: string
  category: 'food' | 'walk' | 'culture' | 'rest'
}

export interface CommunityEvent {
  id: string
  title: string
  time: string
  venue: string
  neighbourhood: string
  description: string
  category: string
  goingTravellerIds: string[]
}

export const dailyWeather: Record<Destination, DailyWeather> = {
  Dubai: { temperature: 31, high: 33, low: 25, condition: 'Mostly sunny', note: 'Good exploring weather', icon: 'sun' },
  'Abu Dhabi': { temperature: 30, high: 33, low: 25, condition: 'Sunny with coastal breeze', note: 'A water break helps in the afternoon', icon: 'sun' },
  Sharjah: { temperature: 30, high: 33, low: 25, condition: 'Clear and warm', note: 'Plan outdoor walks for early or late in the day', icon: 'sun' },
  'Ras Al Khaimah': { temperature: 29, high: 32, low: 23, condition: 'Bright with mountain air', note: 'Check conditions before a mountain drive', icon: 'sun' },
  Ajman: { temperature: 30, high: 33, low: 25, condition: 'Mostly sunny by the coast', note: 'The corniche is cooler near sunset', icon: 'sun' },
  Fujairah: { temperature: 29, high: 32, low: 24, condition: 'Sunny with a coastal breeze', note: 'A light layer is useful after dusk', icon: 'sun' },
  Goa: { temperature: 29, high: 31, low: 25, condition: 'Warm with a passing shower', note: 'A light layer may come in handy', icon: 'rain' },
  Kochi: { temperature: 28, high: 30, low: 24, condition: 'Clouds and a little sun', note: 'Easy weather for a waterfront walk', icon: 'cloud' },
  Munnar: { temperature: 19, high: 22, low: 15, condition: 'Misty with brighter spells', note: 'Bring a light jacket for the hills', icon: 'cloud' },
}

export const destinationTimeZones: Record<Destination, string> = {
  Dubai: 'Asia/Dubai',
  'Abu Dhabi': 'Asia/Dubai',
  Sharjah: 'Asia/Dubai',
  'Ras Al Khaimah': 'Asia/Dubai',
  Ajman: 'Asia/Dubai',
  Fujairah: 'Asia/Dubai',
  Goa: 'Asia/Kolkata',
  Kochi: 'Asia/Kolkata',
  Munnar: 'Asia/Kolkata',
}

export const dailyPlans: Record<Destination, PlanStop[]> = {
  Dubai: [
    { id: 'dxb-breakfast', time: '09:00', title: 'Breakfast in a courtyard', neighbourhood: 'Al Fahidi', note: 'Try a luqaimat and karak at Arabian Tea House.', category: 'food' },
    { id: 'dxb-creek', time: '11:00', title: 'Wander down to the creek', neighbourhood: 'Al Seef', note: 'Take the shaded lane past the old wind towers.', category: 'walk' },
    { id: 'dxb-gallery', time: '15:30', title: 'A little art and architecture', neighbourhood: 'Alserkal Avenue', note: 'Independent galleries are easy to browse at your own pace.', category: 'culture' },
    { id: 'dxb-sunset', time: '18:00', title: 'Catch the softer light', neighbourhood: 'Dubai Water Canal', note: 'An unhurried walk is a lovely way to end the day.', category: 'rest' },
  ],
  'Abu Dhabi': [
    { id: 'auh-coffee', time: '09:00', title: 'Start with coffee by the water', neighbourhood: 'Al Mina', note: 'Take a relaxed breakfast before the city warms up.', category: 'food' },
    { id: 'auh-hosn', time: '10:30', title: 'Explore the city’s old fort', neighbourhood: 'Al Hosn', note: 'Allow time for the cultural spaces around Qasr Al Hosn.', category: 'culture' },
    { id: 'auh-corniche', time: '16:30', title: 'Walk a stretch of the Corniche', neighbourhood: 'Abu Dhabi Corniche', note: 'Choose a public section and enjoy the waterfront breeze.', category: 'walk' },
  ],
  Sharjah: [
    { id: 'shj-coffee', time: '09:00', title: 'A quiet cafe start', neighbourhood: 'Al Majaz', note: 'Ease into the day near the lagoon promenade.', category: 'food' },
    { id: 'shj-museum', time: '11:00', title: 'Spend an hour with local art', neighbourhood: 'Al Shuwaiheen', note: 'Check gallery hours before setting out.', category: 'culture' },
    { id: 'shj-waterfront', time: '17:00', title: 'Take the lagoon-side route', neighbourhood: 'Al Majaz Waterfront', note: 'A public, easy-paced walk as the light softens.', category: 'walk' },
  ],
  'Ras Al Khaimah': [
    { id: 'rak-breakfast', time: '08:30', title: 'Fuel up before the drive', neighbourhood: 'RAK city', note: 'Plan water and a morning start if heading toward the mountains.', category: 'food' },
    { id: 'rak-fort', time: '11:00', title: 'Visit a hilltop fort', neighbourhood: 'Dhayah', note: 'Wear comfortable shoes and take the steps at your own pace.', category: 'culture' },
    { id: 'rak-evening', time: '17:00', title: 'Unwind by the waterfront', neighbourhood: 'Al Qawasim Corniche', note: 'Keep the evening plan flexible after a day outdoors.', category: 'rest' },
  ],
  Ajman: [
    { id: 'ajm-breakfast', time: '09:00', title: 'Breakfast near the old town', neighbourhood: 'Ajman Old Town', note: 'Leave time for a slow walk through the heritage area.', category: 'food' },
    { id: 'ajm-museum', time: '11:00', title: 'Step inside Ajman Museum', neighbourhood: 'Ajman Old Town', note: 'A compact stop for local history and architecture.', category: 'culture' },
    { id: 'ajm-corniche', time: '17:00', title: 'Catch the evening sea breeze', neighbourhood: 'Ajman Corniche', note: 'Use the public promenade and take an easy pace.', category: 'walk' },
  ],
  Fujairah: [
    { id: 'fuj-coffee', time: '09:00', title: 'Take a relaxed coffee break', neighbourhood: 'Fujairah city', note: 'Start close to town before exploring the coast.', category: 'food' },
    { id: 'fuj-fort', time: '11:00', title: 'Explore Fujairah Fort', neighbourhood: 'Old Fujairah', note: 'Pair the fort with the nearby heritage village.', category: 'culture' },
    { id: 'fuj-coast', time: '16:30', title: 'Pause along the shoreline', neighbourhood: 'Fujairah Corniche', note: 'The coast makes a calm end to a day of exploring.', category: 'rest' },
  ],
  Goa: [
    { id: 'goa-coffee', time: '09:00', title: 'Coffee in Fontainhas', neighbourhood: 'Panaji', note: 'Start slowly among the colourful old lanes.', category: 'food' },
    { id: 'goa-lanes', time: '10:30', title: 'Explore the Latin Quarter', neighbourhood: 'Fontainhas', note: 'Look for hand-painted signs and quiet verandas.', category: 'walk' },
    { id: 'goa-lunch', time: '13:00', title: 'A local lunch break', neighbourhood: 'Panaji', note: 'Ask what is fresh before choosing from the menu.', category: 'food' },
    { id: 'goa-river', time: '17:00', title: 'A riverside pause', neighbourhood: 'Mandovi waterfront', note: 'The promenade is especially calm in the late afternoon.', category: 'rest' },
  ],
  Kochi: [
    { id: 'kochi-breakfast', time: '08:30', title: 'Breakfast near the water', neighbourhood: 'Fort Kochi', note: 'Find appam and stew before the lanes get busier.', category: 'food' },
    { id: 'kochi-art', time: '10:30', title: 'Walk the art trail', neighbourhood: 'Fort Kochi', note: 'Small galleries are tucked between the old homes.', category: 'culture' },
    { id: 'kochi-ferry', time: '15:00', title: 'Take the short ferry ride', neighbourhood: 'Fort Kochi jetty', note: 'A simple way to see the harbour from the water.', category: 'walk' },
    { id: 'kochi-sunset', time: '17:30', title: 'Watch the fishing nets', neighbourhood: 'Fort Kochi waterfront', note: 'Arrive before dusk and leave room for a tea stop.', category: 'rest' },
  ],
  Munnar: [
    { id: 'munnar-tea', time: '08:30', title: 'A warm cup and a view', neighbourhood: 'Munnar town', note: 'Start early while the hills are still wrapped in mist.', category: 'food' },
    { id: 'munnar-museum', time: '10:00', title: 'A little tea history', neighbourhood: 'Nallathanni Estate', note: 'Learn how the region’s tea gardens grew.', category: 'culture' },
    { id: 'munnar-path', time: '14:00', title: 'Take the garden path', neighbourhood: 'Tea country', note: 'Keep to marked paths and take it at an easy pace.', category: 'walk' },
    { id: 'munnar-evening', time: '17:00', title: 'Settle in before the mist', neighbourhood: 'Munnar town', note: 'Find a warm drink and let the evening slow down.', category: 'rest' },
  ],
}

export const communityEvents: Record<Destination, CommunityEvent[]> = {
  Dubai: [
    { id: 'dxb-creek-walk', title: 'Old Dubai, at walking pace', time: 'Today · 4:30 PM', venue: 'Al Fahidi roundabout', neighbourhood: 'Bur Dubai', description: 'A small-group wander through the lanes, finishing by the creek. Join only if it feels right.', category: 'Neighbourhood walk', goingTravellerIds: ['maya-chen', 'rafi-khan', 'amira-nair'] },
    { id: 'dxb-gallery-hour', title: 'An easy gallery hour', time: 'Today · 6:00 PM', venue: 'Alserkal Avenue entrance', neighbourhood: 'Al Quoz', description: 'Browse a couple of independent galleries, then decide together if you want to stay longer.', category: 'Arts & culture', goingTravellerIds: ['noor-haddad', 'sam-lee'] },
  ],
  'Abu Dhabi': [
    { id: 'auh-heritage-walk', title: 'A short heritage walk', time: 'Today · 4:30 PM', venue: 'Qasr Al Hosn entrance', neighbourhood: 'Al Hosn', description: 'A small public walk around the cultural district; join only if the timing suits.', category: 'Heritage walk', goingTravellerIds: ['layla-almansoori'] },
  ],
  Sharjah: [
    { id: 'shj-art-afternoon', title: 'An easy gallery afternoon', time: 'Today · 3:30 PM', venue: 'Sharjah Art Museum entrance', neighbourhood: 'Al Shuwaiheen', description: 'Meet at the public entrance and browse at an unhurried pace.', category: 'Arts & culture', goingTravellerIds: ['omar-rahman'] },
  ],
  'Ras Al Khaimah': [
    { id: 'rak-mountain-view', title: 'Mountain viewpoints, early start', time: 'Today · 7:30 AM', venue: 'Jebel Jais visitor area', neighbourhood: 'Jebel Jais', description: 'A weather-dependent outing. Check road and activity guidance before travelling.', category: 'Outdoors', goingTravellerIds: ['hana-yousef'] },
  ],
  Ajman: [
    { id: 'ajm-heritage-afternoon', title: 'A relaxed heritage afternoon', time: 'Today · 4:00 PM', venue: 'Ajman Museum entrance', neighbourhood: 'Ajman Old Town', description: 'A small public walk around the museum district. Join only if it suits your plans.', category: 'Heritage walk', goingTravellerIds: ['sara-ali'] },
  ],
  Fujairah: [
    { id: 'fuj-fort-loop', title: 'Old Fujairah heritage loop', time: 'Today · 4:00 PM', venue: 'Fujairah Fort entrance', neighbourhood: 'Old Fujairah', description: 'A short public walk around the fort and nearby heritage village.', category: 'Heritage walk', goingTravellerIds: ['zayd-khalid'] },
  ],
  Goa: [
    { id: 'goa-fontainhas-walk', title: 'Colour and coffee in Fontainhas', time: 'Today · 4:00 PM', venue: 'Panaji post office steps', neighbourhood: 'Panaji', description: 'A relaxed lane-by-lane walk with time for a cafe stop.', category: 'Neighbourhood walk', goingTravellerIds: ['dev-menon', 'tara-dsouza'] },
    { id: 'goa-sunset-promenade', title: 'A quiet Mandovi sunset', time: 'Today · 5:45 PM', venue: 'Campal promenade', neighbourhood: 'Panaji', description: 'Meet in a public spot and share the riverside view before dinner.', category: 'Outdoors', goingTravellerIds: ['arjun-pai', 'tara-dsouza'] },
  ],
  Kochi: [
    { id: 'kochi-art-stroll', title: 'Fort Kochi art and old lanes', time: 'Today · 3:30 PM', venue: 'Santa Cruz Basilica gate', neighbourhood: 'Fort Kochi', description: 'A gentle public walking route with a gallery stop along the way.', category: 'Arts & culture', goingTravellerIds: ['meera-varghese', 'nikhil-rao'] },
    { id: 'kochi-tea-break', title: 'Tea after the waterfront', time: 'Today · 5:00 PM', venue: 'Fort Kochi ferry entrance', neighbourhood: 'Fort Kochi', description: 'Swap local tips over chai before the evening ferry.', category: 'Cafe stop', goingTravellerIds: ['sana-kurup', 'meera-varghese'] },
  ],
  Munnar: [
    { id: 'munnar-tea-walk', title: 'A short walk through tea country', time: 'Today · 3:00 PM', venue: 'Tea Museum entrance', neighbourhood: 'Nallathanni Estate', description: 'Stay on marked paths and enjoy the hillside views together.', category: 'Outdoors', goingTravellerIds: ['ishaan-thapa', 'anaya-joseph'] },
    { id: 'munnar-warm-drink', title: 'Warm drinks before the mist', time: 'Today · 5:15 PM', venue: 'Munnar town market', neighbourhood: 'Munnar town', description: 'A low-key, public cafe stop after the afternoon walk.', category: 'Cafe stop', goingTravellerIds: ['rohan-kapoor', 'ishaan-thapa'] },
  ],
}

export const travellerArrivals: Record<Destination, { travellerId: string; arrival: string }[]> = {
  Dubai: [
    { travellerId: 'maya-chen', arrival: 'Landed 8:20 AM' },
    { travellerId: 'rafi-khan', arrival: 'Arriving around 11 AM' },
    { travellerId: 'amira-nair', arrival: 'In town this morning' },
    { travellerId: 'jonah-park', arrival: 'Checking in at 2 PM' },
  ],
  'Abu Dhabi': [{ travellerId: 'layla-almansoori', arrival: 'In the city today' }],
  Sharjah: [{ travellerId: 'omar-rahman', arrival: 'Arrived this morning' }],
  'Ras Al Khaimah': [{ travellerId: 'hana-yousef', arrival: 'Checking in today' }],
  Ajman: [{ travellerId: 'sara-ali', arrival: 'In Ajman today' }],
  Fujairah: [{ travellerId: 'zayd-khalid', arrival: 'In Fujairah today' }],
  Goa: [
    { travellerId: 'dev-menon', arrival: 'Landed 9:10 AM' },
    { travellerId: 'tara-dsouza', arrival: 'In Panaji today' },
    { travellerId: 'arjun-pai', arrival: 'Arriving around 1 PM' },
  ],
  Kochi: [
    { travellerId: 'meera-varghese', arrival: 'Landed 7:45 AM' },
    { travellerId: 'nikhil-rao', arrival: 'Arriving around 10 AM' },
    { travellerId: 'sana-kurup', arrival: 'In Fort Kochi today' },
  ],
  Munnar: [
    { travellerId: 'ishaan-thapa', arrival: 'Arrived this morning' },
    { travellerId: 'anaya-joseph', arrival: 'Checking in around noon' },
    { travellerId: 'rohan-kapoor', arrival: 'In Munnar today' },
  ],
}
