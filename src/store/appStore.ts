import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ChatMessage, ChatReport, PartnerReview } from '../data/chats'
import type { TravellerArchetype } from '../data/travellers'
import { defaultDestination, type Destination } from '../lib/destinations'

export type PrivacyMode = 'community' | 'selected' | 'ghost'
export type VerificationStatus = 'unverified' | 'phone' | 'verified'
export type AppTheme = 'light' | 'dark'

const defaultTripStartedAt = new Date().toISOString()
const defaultTripEnd = new Date(Date.parse(defaultTripStartedAt) + 7 * 24 * 60 * 60 * 1000).toISOString()

export interface QuizResult {
  archetype: TravellerArchetype
  traits: [string, string, string]
  summary: string
  completedAt: string
}

export interface ItineraryStop {
  id: string
  placeId: string
  destination: Destination
  day: number
  order: number
  addedAt: string
}

export interface TripRecord {
  id: string
  destination: Destination
  startedAt: string
  endedAt: string
  itineraryStopCount: number
  joinedEventCount: number
}

interface AppSettings {
  destination: Destination
  hasChosenDestination: boolean
  theme: AppTheme
  privacyMode: PrivacyMode
  selectedTravellerIds: string[]
  joinedEventIds: string[]
  viewedStoryIds: string[]
  savedStoryIds: string[]
  itineraryStops: ItineraryStop[]
  chatMessages: ChatMessage[]
  blockedTravellerIds: string[]
  partnerReviews: PartnerReview[]
  chatReports: ChatReport[]
  verificationStatus: VerificationStatus
  tripGeneration: number
  tripStartedAt: string
  tripEndsAt: string
  tripHistory: TripRecord[]
  trustedContactName: string
  trustedContactPhone: string
  tripSharingEnabled: boolean
  pendingChatRequestIds: string[]
  pendingLocationRequestIds: string[]
  notificationsEnabled: boolean
}

interface AppState {
  quizResult: QuizResult | null
  settings: AppSettings
  saveQuizResult: (result: QuizResult) => void
  updateSettings: (settings: Partial<AppSettings>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      quizResult: null,
      settings: {
        destination: defaultDestination,
        hasChosenDestination: false,
        theme: 'light',
        privacyMode: 'community',
        selectedTravellerIds: [],
        joinedEventIds: [],
        viewedStoryIds: [],
        savedStoryIds: [],
        itineraryStops: [],
        chatMessages: [],
        blockedTravellerIds: [],
        partnerReviews: [],
        chatReports: [],
        verificationStatus: 'unverified',
        tripGeneration: 0,
        tripStartedAt: defaultTripStartedAt,
        tripEndsAt: defaultTripEnd,
        tripHistory: [],
        trustedContactName: '',
        trustedContactPhone: '',
        tripSharingEnabled: false,
        pendingChatRequestIds: [],
        pendingLocationRequestIds: [],
        notificationsEnabled: true,
      },
      saveQuizResult: (quizResult) => set({ quizResult }),
      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
    }),
    {
      name: 'stranger-seat',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        quizResult: state.quizResult,
        settings: state.settings,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>
        return {
          ...currentState,
          ...persisted,
          settings: {
            ...currentState.settings,
            ...persisted.settings,
            hasChosenDestination: persisted.settings?.hasChosenDestination ?? Boolean(persisted.quizResult),
          },
        }
      },
    },
  ),
)
