# The Stranger Seat

**A little less alone.** The Stranger Seat is a temporary travel community for people going to the same destination or event. It helps travellers exchange useful local tips and find potential companions through mutual opt-in—not likes, follower counts, or permanent social profiles. The default experience now uses a polished light theme, with a saved appearance switch in Profile.

## Screenshots

Add product screenshots here as the experience takes shape. A 390 × 844 mobile viewport is the primary design target; on desktop, the app is presented in a centered phone frame.

<!-- Example: ![The Stranger Seat map](./screenshots/map.png) -->

## Phase 1 foundation

- Mobile-first app shell with a responsive phone frame on desktop and a clean, professional light theme by default.
- Five route-backed tabs: Map, Today, Chats, Stories, and Profile.
- Shared layout components, animated page transitions, accessible navigation, and a reduced-motion fallback.
- Teal-to-violet accents, shared design tokens, and Tailwind CSS.
- Typed mock datasets for travellers, cafes, places, hotels, stories, and chats.
- Zustand store with localStorage persistence for quiz results and app settings.

## Phase 2 onboarding

- New travellers start by choosing a destination, then browse same-place matches, and continue to Chats after mutual opt-in.
- Single-select preferences and a multi-select activity question with skip and back controls.
- Seven scored travel archetypes with a shareable result card, trait chips, and a travel-vibe summary.
- The optional travel-vibe quiz is available from the Matches screen and Profile; its high-contrast light-theme typography helps make each question and option easy to read.
- Saved archetype appears on the profile and informs traveller match percentages.
- Quiz result and app settings persist locally in the browser.

## Phase 3 community map

- Interactive Leaflet map with CARTO dark/light basemaps when configured, an OpenStreetMap fallback, a light-map toggle, zoom controls, and approximate traveller pins.
- Destination switching for Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, Ajman, Fujairah, Goa, Kochi, and Munnar, with city-specific map pins and traveller mock data.
- Traveller search, cafes/tourist places/hotel filters, low-zoom traveller clusters, and gently moving mock pins.
- Traveller detail sheets show archetype, verification, vibe match, and approximate activity; chat and location requests remain pending until mutual opt-in.
- Privacy controls for the trip community, a chosen traveller list, and Ghost Mode; the current sharing choice persists locally.

## Phase 4 Today dashboard

- Destination-aware greeting, live local clock, and mocked weather and plans for all supported destinations.
- Flexible day-plan timeline with time-aware upcoming and completed stops.
- Arriving-traveller carousel with archetype and verification details.
- Public, community-led event cards with going travellers and a persisted join/leave state.
- Quick insights for travellers in town, public plans, and shared travel vibes.
- Public-place and opt-in reminders throughout the dashboard.

## Phase 5 destination insights

- Dedicated Insights screen, linked from Today without adding another bottom-navigation tab.
- Mock traveller-arrival trend, trending places, cafe visit hours, community budget mix, and shared interests, all visualized with Recharts.
- Destination-aware charts and planning tips for all supported destinations.
- Best-time-to-visit guidance and clear context that community signals are mock, aggregated planning hints.

## Phase 6 stories and highlights

- Destination-scoped traveller stories with location tags, practical local tips, and optional public meetup invitations.
- Full-screen story viewer with timed progress, tap navigation, press-and-hold pause, swipe-down dismissal, keyboard controls, and a reply field.
- Stories expire 24 hours after sharing; viewed state and saved tips persist locally.
- Traveller highlight collections keep selected trip notes available beyond the story window.
- Community-only visibility reminders keep the focus on the temporary destination community.

## Phase 7 discover and itinerary

- Destination-aware cafe, hotel, resort, and tourist-place recommendations for Dubai, Goa, Kochi, and Munnar.
- Cafe and stay cards include ratings, price guidance, neighbourhoods, vibe tags, approximate distance, and mock traveller-match signals.
- Three-day itinerary builder with persisted stops, day selection, drag-and-drop and keyboard-accessible reorder controls, and remove actions.
- Estimated plan costs and rough distance-based travel times between stops, with cost units explained by category.
- Similar mock traveller plans and user-initiated itinerary sharing; plans remain local until the traveller chooses to share them.

## Phase 8 secret chats

- Destination-scoped conversations with verified mock travellers and useful trip context.
- Private-style thread UI with local message persistence, quick replies, and a 24-hour message expiry.
- Expiry chips, privacy reminders, and a clear disclosure that the local demo is not end-to-end encrypted.
- Public-cafe meetup suggestions and user-initiated proposals; no exact location is shared.
- Report and block controls, plus private post-trip ratings and helpful/respectful/on-time feedback tags.
- Mock chat actions are device-local and do not contact a support service or another traveller.

## Phase 9 safety and trust

- A local-only mock phone OTP, ID-review, and selfie-check flow unlocks the Verified Traveller badge; no SMS is sent and no identity image is collected.
- Unverified users cannot open or request chats. Requests remain pending until both travellers opt in, and exact live location stays private.
- Privacy & safety settings offer community, selected-traveller, and Ghost Mode controls, plus profile reporting and blocking.
- Save a trusted contact on-device and deliberately share a city-level trip check-in; the app does not send continuous location updates.
- SOS options clearly distinguish copying a help message from choosing a direct emergency-call link. No emergency service is contacted automatically.
- Communities have a configurable end date and close automatically. Community discovery, chats, stories, and event joins pause after expiry; restarting creates a fresh community and clears old event joins and pending requests while personal itinerary data remains saved.
- Verification, reporting, contact details, and share settings are demo-only and persisted in local browser storage—not a real identity, moderation, encryption, or emergency service.

## Phase 10 travel profile

- Profile overview brings together the saved travel archetype and its traits, verification status, destination trip, saved travel tips, and trip history.
- Appearance can be switched between light and dark from Profile and is saved with the other local settings.
- A transparent local trust-setup score reflects only configured profile and safety signals; it is not a peer rating, safety guarantee, or judgment of a traveller.
- Location privacy modes and notification preferences are editable from Profile, with a direct route to the full Privacy & safety settings.
- Starting a new trip archives the previous community summary on-device, while saved personal itinerary stops remain available.
- Retake the travel-vibe quiz or revisit saved trip stories directly from the profile.

## Tech stack

- React 19, TypeScript, and Vite
- React Router and Framer Motion
- Tailwind CSS
- Zustand with persisted settings and quiz results
- Lucide icons
- React Leaflet and Leaflet with CARTO raster basemaps (optional API key) and an OpenStreetMap fallback

All current product content is local mock data in `src/data/`; there is no backend. To use CARTO's dark and Voyager raster basemaps, place your key in a local `.env.local` file:

```dotenv
VITE_CARTO_API_KEY=your_key_here
```

Restart the Vite server after adding the key. Keep `.env.local` untracked, and restrict the key to your app's allowed origins in the CARTO dashboard. Without a key, the map uses OpenStreetMap tiles with a CSS dark style.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To run the production build and lint checks:

```bash
npm run build
npm run lint
```

## Project structure

```text
src/
  components/  Shared app shell, navigation, and UI components
  data/        Typed local mock data
  hooks/       Reusable React hooks
  lib/         Shared app constants and helpers
  pages/       Route-level screens
  store/       Persisted application state
```
