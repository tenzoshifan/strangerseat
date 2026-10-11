export const destinations = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ras Al Khaimah',
  'Ajman',
  'Fujairah',
  'Goa',
  'Kochi',
  'Munnar',
] as const

export type Destination = (typeof destinations)[number]

export const defaultDestination: Destination = 'Dubai'

export const destinationDetails: Record<
  Destination,
  { coordinates: [number, number]; zoom: number; code: string; region: string }
> = {
  Dubai: { coordinates: [25.226, 55.281], zoom: 12, code: 'DXB', region: 'United Arab Emirates' },
  'Abu Dhabi': { coordinates: [24.4539, 54.3773], zoom: 12, code: 'AUH', region: 'United Arab Emirates' },
  Sharjah: { coordinates: [25.3463, 55.4209], zoom: 13, code: 'SHJ', region: 'United Arab Emirates' },
  'Ras Al Khaimah': { coordinates: [25.7895, 55.9432], zoom: 12, code: 'RKT', region: 'United Arab Emirates' },
  Ajman: { coordinates: [25.4052, 55.5136], zoom: 13, code: 'AJM', region: 'United Arab Emirates' },
  Fujairah: { coordinates: [25.1288, 56.3265], zoom: 12, code: 'FJR', region: 'United Arab Emirates' },
  Goa: { coordinates: [15.499, 73.827], zoom: 13, code: 'GOI', region: 'India' },
  Kochi: { coordinates: [9.966, 76.243], zoom: 14, code: 'COK', region: 'India' },
  Munnar: { coordinates: [10.088, 77.061], zoom: 13, code: 'MUN', region: 'India' },
}
