import type { Destination } from '../lib/destinations'

export interface TravelStory {
  id: string
  authorId: string
  author: string
  initials: string
  destination: Destination
  location: string
  tip: string
  sharedAt: string
  expiresAt: string
  companionInvite?: string
  scene: 'creek' | 'cafe' | 'coast' | 'lanes' | 'waterfront' | 'garden' | 'tea'
}

export interface TravelHighlight {
  id: string
  ownerId: string
  owner: string
  initials: string
  destination: Destination
  title: string
  storyIds: string[]
}

function storyTime(hoursAgo: number) {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
}

function createStory(
  story: Omit<TravelStory, 'sharedAt' | 'expiresAt'> & { hoursAgo: number },
): TravelStory {
  const { hoursAgo, ...details } = story
  const sharedAt = storyTime(hoursAgo)

  return {
    ...details,
    sharedAt,
    expiresAt: new Date(new Date(sharedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

export const stories: TravelStory[] = [
  createStory({
    id: 'maya-creek-abra',
    authorId: 'maya-chen',
    author: 'Maya Chen',
    initials: 'MC',
    destination: 'Dubai',
    location: 'Dubai Creek',
    tip: 'Take the abra just before golden hour. The five-minute crossing is the part I keep thinking about.',
    hoursAgo: 2,
    scene: 'creek',
  }),
  createStory({
    id: 'maya-karak-stop',
    authorId: 'maya-chen',
    author: 'Maya Chen',
    initials: 'MC',
    destination: 'Dubai',
    location: 'Al Fahidi',
    tip: 'The little karak counter beside the textile souk is quiet before 10. Bring cash and take your time.',
    hoursAgo: 3,
    scene: 'cafe',
  }),
  createStory({
    id: 'rafi-creek-crossing',
    authorId: 'rafi-khan',
    author: 'Rafi Khan',
    initials: 'RK',
    destination: 'Dubai',
    location: 'Bur Dubai abra station',
    tip: 'Use the Bur Dubai side for the creek crossing; the queue moves quickly and the old lanes are a short walk away.',
    hoursAgo: 5,
    companionInvite: 'A few of us are walking the creek after 5. Public route, easy pace.',
    scene: 'lanes',
  }),
  createStory({
    id: 'sam-canal-light',
    authorId: 'sam-lee',
    author: 'Sam Lee',
    initials: 'SL',
    destination: 'Dubai',
    location: 'Dubai Water Canal',
    tip: 'For a calmer skyline view, follow the canal path just before sunset. The Business Bay stretch is lovely.',
    hoursAgo: 4,
    scene: 'waterfront',
  }),
  createStory({
    id: 'dev-panaji-breakfast',
    authorId: 'dev-menon',
    author: 'Dev Menon',
    initials: 'DM',
    destination: 'Goa',
    location: 'Fontainhas, Panaji',
    tip: 'The bakery on the quieter lane opens early. Pick up a poi and walk the colourful streets before the heat.',
    hoursAgo: 1,
    scene: 'cafe',
  }),
  createStory({
    id: 'tara-fontainhas-walk',
    authorId: 'tara-dsouza',
    author: 'Tara D’Souza',
    initials: 'TD',
    destination: 'Goa',
    location: 'Fontainhas',
    tip: 'Take the side streets uphill for painted balconies and much less foot traffic. Please keep doorways clear.',
    hoursAgo: 7,
    scene: 'lanes',
  }),
  createStory({
    id: 'meera-fort-kochi',
    authorId: 'meera-varghese',
    author: 'Meera Varghese',
    initials: 'MV',
    destination: 'Kochi',
    location: 'Fort Kochi waterfront',
    tip: 'The waterfront is gentler in the late afternoon. Check the ferry board before you set off for Vypin.',
    hoursAgo: 2,
    scene: 'waterfront',
  }),
  createStory({
    id: 'nikhil-kochi-cafe',
    authorId: 'nikhil-rao',
    author: 'Nikhil Rao',
    initials: 'NR',
    destination: 'Kochi',
    location: 'Princess Street',
    tip: 'A small cafe just off the main street has a shaded courtyard. It gets busy after the ferry crowds arrive.',
    hoursAgo: 9,
    scene: 'cafe',
  }),
  createStory({
    id: 'ishaan-munnar-morning',
    authorId: 'ishaan-thapa',
    author: 'Ishaan Thapa',
    initials: 'IT',
    destination: 'Munnar',
    location: 'Old Munnar tea path',
    tip: 'Start before 8 for clearer hill views. The path is uneven in places, so good walking shoes help.',
    hoursAgo: 3,
    scene: 'tea',
  }),
  createStory({
    id: 'anaya-viewpoint',
    authorId: 'anaya-joseph',
    author: 'Anaya Joseph',
    initials: 'AJ',
    destination: 'Munnar',
    location: 'Tea garden viewpoint',
    tip: 'The lower viewpoint is quieter and the walk is easier. Mist can roll in quickly, so check the sky on the way up.',
    hoursAgo: 6,
    scene: 'garden',
  }),
]

export const travelHighlights: TravelHighlight[] = [
  { id: 'maya-food-notes', ownerId: 'maya-chen', owner: 'Maya Chen', initials: 'MC', destination: 'Dubai', title: 'Small bites', storyIds: ['maya-karak-stop', 'maya-creek-abra'] },
  { id: 'sam-slower-dubai', ownerId: 'sam-lee', owner: 'Sam Lee', initials: 'SL', destination: 'Dubai', title: 'A slower Dubai', storyIds: ['sam-canal-light'] },
  { id: 'dev-goa-mornings', ownerId: 'dev-menon', owner: 'Dev Menon', initials: 'DM', destination: 'Goa', title: 'Panaji mornings', storyIds: ['dev-panaji-breakfast'] },
  { id: 'tara-colourful-lanes', ownerId: 'tara-dsouza', owner: 'Tara D’Souza', initials: 'TD', destination: 'Goa', title: 'Colourful lanes', storyIds: ['tara-fontainhas-walk'] },
  { id: 'meera-waterfront', ownerId: 'meera-varghese', owner: 'Meera Varghese', initials: 'MV', destination: 'Kochi', title: 'By the water', storyIds: ['meera-fort-kochi'] },
  { id: 'nikhil-cafe-stops', ownerId: 'nikhil-rao', owner: 'Nikhil Rao', initials: 'NR', destination: 'Kochi', title: 'Cafe corners', storyIds: ['nikhil-kochi-cafe'] },
  { id: 'ishaan-tea-trails', ownerId: 'ishaan-thapa', owner: 'Ishaan Thapa', initials: 'IT', destination: 'Munnar', title: 'Tea garden walks', storyIds: ['ishaan-munnar-morning'] },
  { id: 'anaya-hill-views', ownerId: 'anaya-joseph', owner: 'Anaya Joseph', initials: 'AJ', destination: 'Munnar', title: 'Hill views', storyIds: ['anaya-viewpoint'] },
]
