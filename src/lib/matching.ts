import type { TravellerArchetype } from '../data/travellers'

const complementaryArchetypes: Record<TravellerArchetype, TravellerArchetype[]> = {
  'The Explorer': ['The Local Seeker', 'The Curious Mind'],
  'The Foodie Wanderer': ['The Local Seeker', 'The Social Butterfly'],
  'The Local Seeker': ['The Foodie Wanderer', 'The Explorer'],
  'The Social Butterfly': ['The Foodie Wanderer', 'The Calm Companion'],
  'The Calm Companion': ['The Social Butterfly', 'The Solo Sharer'],
  'The Curious Mind': ['The Explorer', 'The Solo Sharer'],
  'The Solo Sharer': ['The Calm Companion', 'The Curious Mind'],
}

export function calculateMatchPercent(
  travellerArchetype: TravellerArchetype,
  yourArchetype: TravellerArchetype,
): number {
  if (travellerArchetype === yourArchetype) return 96
  if (complementaryArchetypes[yourArchetype].includes(travellerArchetype)) return 84
  return 71
}
