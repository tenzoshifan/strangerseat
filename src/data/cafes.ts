export interface Cafe {
  id: string
  name: string
  neighbourhood: string
  priceLevel: 1 | 2 | 3 | 4
  rating: number
  tags: string[]
}

export const cafes: Cafe[] = [
  { id: 'arabian-tea-house', name: 'Arabian Tea House', neighbourhood: 'Al Fahidi', priceLevel: 2, rating: 4.7, tags: ['Emirati', 'Courtyard'] },
  { id: 'nightjar-coffee', name: 'Nightjar Coffee', neighbourhood: 'Alserkal Avenue', priceLevel: 2, rating: 4.6, tags: ['Specialty coffee', 'Creative'] },
  { id: 'kulture-house', name: 'Kulture House', neighbourhood: 'Jumeirah', priceLevel: 3, rating: 4.5, tags: ['Artful', 'Brunch'] },
]
