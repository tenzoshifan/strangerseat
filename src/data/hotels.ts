export interface Hotel {
  id: string
  name: string
  neighbourhood: string
  pricePerNight: number
  rating: number
  style: string
}

export const hotels: Hotel[] = [
  { id: 'xva-art-hotel', name: 'XVA Art Hotel', neighbourhood: 'Al Fahidi', pricePerNight: 520, rating: 4.5, style: 'Heritage courtyard' },
  { id: 'rove-downtown', name: 'Rove Downtown', neighbourhood: 'Downtown Dubai', pricePerNight: 610, rating: 4.6, style: 'Easy-going city stay' },
  { id: 'vida-creek-harbour', name: 'Vida Creek Harbour', neighbourhood: 'Dubai Creek Harbour', pricePerNight: 940, rating: 4.7, style: 'Waterfront retreat' },
]
