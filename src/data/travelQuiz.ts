import type { TravellerArchetype } from './travellers'

export type QuizQuestionId = 'interests' | 'companion' | 'budget' | 'activities' | 'meeting'

export interface QuizOption {
  id: string
  label: string
  detail: string
  archetype: TravellerArchetype
}

export interface QuizQuestion {
  id: QuizQuestionId
  prompt: string
  helper: string
  multiple?: boolean
  options: QuizOption[]
}

export const travelQuiz: QuizQuestion[] = [
  {
    id: 'interests',
    prompt: 'What do you enjoy most in a new place?',
    helper: 'Pick the thing you find yourself looking for first.',
    options: [
      { id: 'landmarks', label: 'Famous sights', detail: 'The places everyone should see once', archetype: 'The Explorer' },
      { id: 'hidden', label: 'Local discoveries', detail: 'Quiet corners and places with a story', archetype: 'The Local Seeker' },
      { id: 'food', label: 'Food and cafes', detail: 'A good meal is a way into a place', archetype: 'The Foodie Wanderer' },
      { id: 'people', label: 'Meeting people', detail: 'The best memories are often shared', archetype: 'The Social Butterfly' },
      { id: 'nature', label: 'Being outdoors', detail: 'Beaches, green spaces, and fresh air', archetype: 'The Explorer' },
      { id: 'learning', label: 'Learning something', detail: 'Museums, technology, and new ideas', archetype: 'The Curious Mind' },
    ],
  },
  {
    id: 'companion',
    prompt: 'What kind of travel companion feels right?',
    helper: 'There is no wrong way to travel.',
    options: [
      { id: 'same-interests', label: 'A shared set of interests', detail: 'We can be excited about the same things', archetype: 'The Curious Mind' },
      { id: 'explorer', label: 'Someone up for exploring', detail: 'Let’s see where the day takes us', archetype: 'The Explorer' },
      { id: 'easygoing', label: 'Calm and easygoing', detail: 'No rush, no pressure, just a good day', archetype: 'The Calm Companion' },
      { id: 'social', label: 'Someone who enjoys people', detail: 'Conversation comes naturally', archetype: 'The Social Butterfly' },
      { id: 'independent', label: 'Independent, but in touch', detail: 'Swap useful tips without meeting up', archetype: 'The Solo Sharer' },
    ],
  },
  {
    id: 'budget',
    prompt: 'What feels like your kind of travel budget?',
    helper: 'We use this to make more relevant connections.',
    options: [
      { id: 'budget', label: 'Thoughtful and budget-friendly', detail: 'The best things needn’t cost much', archetype: 'The Local Seeker' },
      { id: 'moderate', label: 'A comfortable middle ground', detail: 'A little of this, a little of that', archetype: 'The Calm Companion' },
      { id: 'premium', label: 'Comfortable or premium', detail: 'I like to make an occasion of it', archetype: 'The Foodie Wanderer' },
      { id: 'activity', label: 'It depends on the experience', detail: 'I’ll spend where it matters to me', archetype: 'The Explorer' },
    ],
  },
  {
    id: 'activities',
    prompt: 'What would you enjoy doing with other travellers?',
    helper: 'Choose as many as you like.',
    multiple: true,
    options: [
      { id: 'city', label: 'Explore the city', detail: 'A walk and a few unplanned turns', archetype: 'The Explorer' },
      { id: 'cafes', label: 'Find local food and cafes', detail: 'One good spot leads to another', archetype: 'The Foodie Wanderer' },
      { id: 'events', label: 'Go to an event or workshop', detail: 'Something memorable to learn together', archetype: 'The Social Butterfly' },
      { id: 'photography', label: 'Take photos and see the sights', detail: 'Notice the details along the way', archetype: 'The Curious Mind' },
      { id: 'adventure', label: 'Try an outdoor adventure', detail: 'A little fresh air and a new story', archetype: 'The Explorer' },
      { id: 'tips', label: 'Swap tips without meeting', detail: 'Helpful information, no pressure', archetype: 'The Solo Sharer' },
    ],
  },
  {
    id: 'meeting',
    prompt: 'How do you feel about meeting people on a trip?',
    helper: 'Your boundaries are yours to set.',
    options: [
      { id: 'enjoy', label: 'I enjoy meeting new people', detail: 'A shared table can make a trip', archetype: 'The Social Butterfly' },
      { id: 'interests', label: 'If we have something in common', detail: 'A good shared interest is a great start', archetype: 'The Curious Mind' },
      { id: 'online-first', label: 'I like to chat online first', detail: 'A little conversation helps me feel at ease', archetype: 'The Calm Companion' },
      { id: 'info-only', label: 'I prefer to exchange useful tips', detail: 'I’m happy exploring on my own', archetype: 'The Solo Sharer' },
      { id: 'public-only', label: 'In public, after we both feel comfortable', detail: 'A familiar cafe is a good place to start', archetype: 'The Calm Companion' },
    ],
  },
]

export const archetypeDetails: Record<
  TravellerArchetype,
  { traits: [string, string, string]; summary: string; icon: string }
> = {
  'The Explorer': {
    traits: ['Curious', 'Outdoorsy', 'Open to plans'],
    summary: 'You like a destination best when you can get out and find your own way around it. A new route, a memorable view, and a bit of fresh air are your kind of travel.',
    icon: 'compass',
  },
  'The Foodie Wanderer': {
    traits: ['Food-led', 'Thoughtful', 'Local flavours'],
    summary: 'For you, getting to know a place often starts at the table. You seek out the local favourite, take your time over a good coffee, and remember what you tasted.',
    icon: 'utensils',
  },
  'The Local Seeker': {
    traits: ['Observant', 'Grounded', 'Off the map'],
    summary: 'You’re drawn to the everyday details that give a place its character. You’d rather find a neighbourhood favourite than follow a crowd.',
    icon: 'map-pin',
  },
  'The Social Butterfly': {
    traits: ['Welcoming', 'Shared moments', 'Good company'],
    summary: 'You enjoy the energy that comes from discovering somewhere with other people. A conversation, an event, or a shared table can become the best part of the trip.',
    icon: 'users',
  },
  'The Calm Companion': {
    traits: ['Easygoing', 'Considerate', 'No rush'],
    summary: 'You believe good travel leaves room to breathe. You value considerate company, clear plans, and the freedom to take a day at your own pace.',
    icon: 'wind',
  },
  'The Curious Mind': {
    traits: ['Inquisitive', 'Open-minded', 'Detail finder'],
    summary: 'You travel to understand a place a little better. Museums, interesting conversations, and small details can all turn into something worth remembering.',
    icon: 'sparkles',
  },
  'The Solo Sharer': {
    traits: ['Independent', 'Helpful', 'Low-pressure'],
    summary: 'You’re happy finding your own rhythm, and you know a useful local tip can still make someone’s day. Connection is best when it comes with no expectations.',
    icon: 'send',
  },
}

export function getTravelArchetype(answers: Partial<Record<QuizQuestionId, string[]>>): TravellerArchetype {
  const scores: Partial<Record<TravellerArchetype, number>> = {}

  for (const question of travelQuiz) {
    const selected = answers[question.id] ?? []
    for (const option of question.options) {
      if (selected.includes(option.id)) {
        scores[option.archetype] = (scores[option.archetype] ?? 0) + 1
      }
    }
  }

  const archetypes = Object.keys(archetypeDetails) as TravellerArchetype[]
  return archetypes.reduce((winner, archetype) =>
    (scores[archetype] ?? 0) > (scores[winner] ?? 0) ? archetype : winner,
  'The Solo Sharer')
}
