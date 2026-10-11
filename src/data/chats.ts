import type { Destination } from '../lib/destinations'

export interface TravelChat {
  id: string
  travellerId: string
  destination: Destination
  lastMessage: string
  updatedAt: string
  unreadCount: number
  expiresInHours: number
  tripFinished?: boolean
  publicMeetupCafeId?: string
}

export interface ChatMessage {
  id: string
  chatId: string
  sender: 'you' | 'traveller'
  text: string
  sentAt: string
  expiresAt: string
}

export interface PartnerReview {
  chatId: string
  travellerId: string
  rating: number
  tags: string[]
  submittedAt: string
}

export interface ChatReport {
  chatId: string
  travellerId: string
  reason: string
  submittedAt: string
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function createMessage(chatId: string, sender: ChatMessage['sender'], text: string, hours: number): ChatMessage {
  const sentAt = hoursAgo(hours)
  return {
    id: `${chatId}-${sender}-${hours}`,
    chatId,
    sender,
    text,
    sentAt,
    expiresAt: new Date(new Date(sentAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  }
}

export const chats: TravelChat[] = [
  {
    id: 'maya-route-chat',
    travellerId: 'maya-chen',
    destination: 'Dubai',
    lastMessage: 'The abra pier is easiest to reach from the textile souk side.',
    updatedAt: '10 min ago',
    unreadCount: 1,
    expiresInHours: 36,
    tripFinished: true,
    publicMeetupCafeId: 'arabian-tea-house',
  },
  {
    id: 'dev-fontainhas-chat',
    travellerId: 'dev-menon',
    destination: 'Goa',
    lastMessage: 'Cafe Bodega is a nice shaded stop after the walk.',
    updatedAt: '32 min ago',
    unreadCount: 0,
    expiresInHours: 28,
    publicMeetupCafeId: 'cafe-bodega',
  },
  {
    id: 'meera-ferry-chat',
    travellerId: 'meera-varghese',
    destination: 'Kochi',
    lastMessage: 'The ferry board has the updated Vypin times.',
    updatedAt: '1h ago',
    unreadCount: 0,
    expiresInHours: 20,
    publicMeetupCafeId: 'loafers-corner',
  },
  {
    id: 'ishaan-tea-chat',
    travellerId: 'ishaan-thapa',
    destination: 'Munnar',
    lastMessage: 'The lower tea path is clearer before the mist rolls in.',
    updatedAt: '18 min ago',
    unreadCount: 0,
    expiresInHours: 42,
    publicMeetupCafeId: 'tea-tales-cafe',
  },
]

export const chatMessages: ChatMessage[] = [
  createMessage('maya-route-chat', 'traveller', 'The abra pier is easiest to reach from the textile souk side.', 0.2),
  createMessage('maya-route-chat', 'you', 'That helps, thank you. Is there a good time to go?', 0.35),
  createMessage('maya-route-chat', 'traveller', 'Just before sunset is lovely. The public path by the creek is easy to follow.', 0.5),
  createMessage('maya-route-chat', 'you', 'Great tip. I’ll keep the route public and check the ferry times.', 0.65),
  createMessage('dev-fontainhas-chat', 'traveller', 'Cafe Bodega is a nice shaded stop after the walk.', 0.55),
  createMessage('dev-fontainhas-chat', 'you', 'Lovely, is it usually busy around lunch?', 0.8),
  createMessage('dev-fontainhas-chat', 'traveller', 'A little. Earlier is calmer, and the garden seating is pleasant.', 1.1),
  createMessage('meera-ferry-chat', 'traveller', 'The ferry board has the updated Vypin times.', 1.2),
  createMessage('meera-ferry-chat', 'you', 'Thanks, I’ll check at the jetty before heading over.', 1.45),
  createMessage('ishaan-tea-chat', 'traveller', 'The lower tea path is clearer before the mist rolls in.', 0.3),
  createMessage('ishaan-tea-chat', 'you', 'Would you recommend walking shoes for it?', 0.55),
  createMessage('ishaan-tea-chat', 'traveller', 'Yes, the path can be uneven in places.', 0.75),
]

export const quickReplies = [
  'Which route to the venue?',
  'Want to share a cab?',
  'Thanks for the local tip!',
]

export const reviewTags = ['Helpful', 'Respectful', 'On time', 'Easygoing', 'Good local tips']
