export interface Place {
  id: string
  name: string
  neighbourhood: string
  category: string
  note: string
  destination: string
  coordinates: [number, number]
}

export const places: Place[] = [
  { id: 'al-fahidi', name: 'Al Fahidi Historical Neighbourhood', neighbourhood: 'Bur Dubai', category: 'Tourist place', note: 'Wind towers, art spaces, and tucked-away courtyards.', destination: 'Dubai', coordinates: [25.2638, 55.2972] },
  { id: 'abu-dhabi-louvre', name: 'Louvre Abu Dhabi', neighbourhood: 'Saadiyat Island', category: 'Tourist place', note: 'A striking waterfront museum with galleries beneath its patterned dome.', destination: 'Abu Dhabi', coordinates: [24.5337, 54.3981] },
  { id: 'abu-dhabi-qasr', name: 'Qasr Al Hosn', neighbourhood: 'Al Hosn', category: 'Tourist place', note: 'A restored fort and cultural landmark at the heart of the city.', destination: 'Abu Dhabi', coordinates: [24.4783, 54.3705] },
  { id: 'sharjah-art-museum', name: 'Sharjah Art Museum', neighbourhood: 'Al Shuwaiheen', category: 'Tourist place', note: 'A welcoming place to explore regional art and rotating exhibitions.', destination: 'Sharjah', coordinates: [25.3572, 55.3847] },
  { id: 'sharjah-al-majaz', name: 'Al Majaz Waterfront', neighbourhood: 'Al Majaz', category: 'Tourist place', note: 'A public lagoon promenade with open views and an easy evening route.', destination: 'Sharjah', coordinates: [25.3374, 55.3865] },
  { id: 'rak-jebel-jais', name: 'Jebel Jais viewpoint', neighbourhood: 'Jebel Jais', category: 'Tourist place', note: 'Mountain scenery and marked viewpoints; check road conditions before setting out.', destination: 'Ras Al Khaimah', coordinates: [25.9546, 56.1344] },
  { id: 'rak-dhayah-fort', name: 'Dhayah Fort', neighbourhood: 'Dhayah', category: 'Tourist place', note: 'A hilltop heritage site with broad views across the northern landscape.', destination: 'Ras Al Khaimah', coordinates: [25.9392, 56.0604] },
  { id: 'ajman-museum', name: 'Ajman Museum', neighbourhood: 'Ajman Old Town', category: 'Tourist place', note: 'A compact fort museum that offers a thoughtful introduction to local history.', destination: 'Ajman', coordinates: [25.4052, 55.5136] },
  { id: 'ajman-corniche', name: 'Ajman Corniche', neighbourhood: 'Ajman Corniche', category: 'Tourist place', note: 'A public shoreline walk with plenty of places to pause by the water.', destination: 'Ajman', coordinates: [25.4174, 55.4352] },
  { id: 'fujairah-fort', name: 'Fujairah Fort', neighbourhood: 'Old Fujairah', category: 'Tourist place', note: 'A restored hilltop fort above the old town and heritage village.', destination: 'Fujairah', coordinates: [25.1288, 56.3265] },
  { id: 'fujairah-al-bidya', name: 'Al Bidya Mosque', neighbourhood: 'Al Bidya', category: 'Tourist place', note: 'A historic mosque in a quiet coastal setting north of the city.', destination: 'Fujairah', coordinates: [25.4388, 56.3543] },
  { id: 'creek-promenade', name: 'Dubai Creek promenade', neighbourhood: 'Al Seef', category: 'Tourist place', note: 'An easy waterside stroll, especially near sunset.', destination: 'Dubai', coordinates: [25.2647, 55.2912] },
  { id: 'ras-al-khor', name: 'Ras Al Khor Wildlife Sanctuary', neighbourhood: 'Ras Al Khor', category: 'Tourist place', note: 'A surprising quiet spot to see flamingos.', destination: 'Dubai', coordinates: [25.1832, 55.3306] },
  { id: 'arabian-tea-house', name: 'Arabian Tea House', neighbourhood: 'Al Fahidi', category: 'Cafe', note: 'A shaded courtyard for Emirati breakfast and karak.', destination: 'Dubai', coordinates: [25.2633, 55.2979] },
  { id: 'nightjar-coffee', name: 'Nightjar Coffee', neighbourhood: 'Alserkal Avenue', category: 'Cafe', note: 'Thoughtful coffee and a creative neighbourhood feel.', destination: 'Dubai', coordinates: [25.1412, 55.2272] },
  { id: 'xva-art-hotel', name: 'XVA Art Hotel', neighbourhood: 'Al Fahidi', category: 'Hotel', note: 'A small heritage stay tucked into a quiet courtyard.', destination: 'Dubai', coordinates: [25.2635, 55.2973] },
  { id: 'rove-downtown', name: 'Rove Downtown', neighbourhood: 'Downtown Dubai', category: 'Hotel', note: 'An easy-going base close to the city centre.', destination: 'Dubai', coordinates: [25.1972, 55.2796] },
  { id: 'fontainhas', name: 'Fontainhas Latin Quarter', neighbourhood: 'Panaji', category: 'Tourist place', note: 'Colourful old lanes with bakeries and Portuguese-era homes.', destination: 'Goa', coordinates: [15.4997, 73.8287] },
  { id: 'cafe-bodega', name: 'Cafe Bodega', neighbourhood: 'Panaji', category: 'Cafe', note: 'A relaxed stop for coffee between neighbourhood walks.', destination: 'Goa', coordinates: [15.5012, 73.8299] },
  { id: 'casa-fontainhas', name: 'Casa Fontainhas', neighbourhood: 'Panaji', category: 'Hotel', note: 'A welcoming heritage guesthouse in the old quarter.', destination: 'Goa', coordinates: [15.4995, 73.8302] },
  { id: 'fort-kochi', name: 'Fort Kochi waterfront', neighbourhood: 'Fort Kochi', category: 'Tourist place', note: 'Watch the old fishing nets along the water at dusk.', destination: 'Kochi', coordinates: [9.9667, 76.2425] },
  { id: 'loafers-corner', name: 'Loafers Corner Cafe', neighbourhood: 'Fort Kochi', category: 'Cafe', note: 'A leafy place to pause after the art trail.', destination: 'Kochi', coordinates: [9.9641, 76.2421] },
  { id: 'fort-house', name: 'The Fort House', neighbourhood: 'Fort Kochi', category: 'Hotel', note: 'A calm waterfront stay near the old ferry.', destination: 'Kochi', coordinates: [9.9668, 76.2448] },
  { id: 'tea-museum', name: 'Tea Museum', neighbourhood: 'Nallathanni Estate', category: 'Tourist place', note: 'A small museum about Munnar’s tea-growing history.', destination: 'Munnar', coordinates: [10.0801, 77.0607] },
  { id: 'tea-tales', name: 'Tea Tales Cafe', neighbourhood: 'Munnar town', category: 'Cafe', note: 'A cosy tea stop with views toward the hills.', destination: 'Munnar', coordinates: [10.0898, 77.0602] },
  { id: 'windermere-estate', name: 'Windermere Estate', neighbourhood: 'Bison Valley Road', category: 'Hotel', note: 'A quiet hillside retreat surrounded by tea country.', destination: 'Munnar', coordinates: [10.0747, 77.0469] },
]
