# BRAM - Marketing CRM

## Overview
BRAM is a marketing CRM mobile application built with Expo (React Native) and Express backend. It helps manage contacts with categorization, messaging frequency controls, and Twilio SMS integration.

## Recent Changes
- 2026-02-20: Initial build - all screens, contact management, Twilio SMS backend
- 2026-02-20: Applied Coolors teal accent palette as accents (badges, charts, secondary text)
- 2026-02-20: Added login screen (Figma design), auth context, logout flow
- 2026-02-20: Renamed "Contacts" tab to "Receiver page", moved + button to header next to title
- 2026-02-22: Replaced contact card call/email buttons with message frequency scroller chips
- 2026-02-22: Revised logo and theme colors to warm orange/red palette matching new Bram logo
- 2026-02-22: Added theme system with Orange and Blue Orange themes, Appearance page, dynamic theming across all screens
- 2026-02-24: Added Notifications and Account sub-pages in Settings, swipe-back gesture on all settings screens
- 2026-03-01: Added "Send Message" button on New contact cards, sent state tracking
- 2026-03-01: Added Privacy screen with Privacy Policy, DMCA notice, and copyright agent contact info
- 2026-03-01: Added QR code scanner (expo-camera) with scan button on Receiver page header
- 2026-03-01: Added QR code download/save button on contact detail (expo-file-system + expo-sharing)
- 2026-03-01: QR code payload included in SMS messages; QR preview shown on send-message screen
- 2026-03-01: QR scanner redirects to Receiver page on successful scan
- 2026-03-02: Added Google Sign-In via expo-auth-session (alongside email/password login)
- 2026-03-05: Added Supabase client connection (server/supabaseClient.ts) with test endpoint

## User Preferences
- Two theme options: Orange (#E8762D primary) and Blue Orange (#00068E primary, #66AAE3 accents, #E49716 highlights)
- Theme selection persisted in AsyncStorage under '@bram_theme' key
- Inter font family throughout
- Manual Twilio API key setup (not connector OAuth)

## Project Architecture
- **Frontend**: Expo Router with file-based routing, React Context for contacts & auth state, AsyncStorage for persistence
- **Backend**: Express on port 5000 with Twilio SMS endpoints
- **Auth**: Email/password + Google OAuth login stored in AsyncStorage, auth gate in root layout
- **Tabs**: Receiver page (index), Trends (dashboard), Settings
- **Modals**: add-contact, send-message
- **Stack**: contact-detail, appearance, notifications, account, privacy, help-support, qr-scanner (all with swipe-back gesture)
- **Auth Screen**: login.tsx (rendered directly by AuthGate, not via router)

### Key Files
- `lib/theme-context.tsx` - Theme system with Orange & Blue Orange palettes, useColors() hook, AsyncStorage persistence
- `lib/auth-context.tsx` - Authentication state management with AsyncStorage (email/password + Google OAuth, stores userName/userPhoto)
- `lib/contacts-context.tsx` - Contact state management with AsyncStorage
- `app/login.tsx` - Login screen (logo, tagline, email/password, Google Sign-In, Face ID)
- `app/(tabs)/index.tsx` - Receiver page (shows time-based greeting: Good morning/afternoon/evening) with search & filter
- `app/(tabs)/dashboard.tsx` - Analytics dashboard with charts
- `app/(tabs)/settings.tsx` - User profile & settings with navigation to Account, Notifications, Appearance
- `app/appearance.tsx` - Theme selection screen with toggle switches
- `app/notifications.tsx` - Notification preferences (Allow, Email, SMS toggles) with AsyncStorage persistence
- `app/account.tsx` - Account info display (email, name, member since; shows Google profile photo if signed in via Google)
- `app/privacy.tsx` - Privacy Policy & DMCA notice (links to iubenda policy, copyright agent info)
- `app/help-support.tsx` - Help & Support with Designated Copyright Agent contact info
- `app/qr-scanner.tsx` - QR code scanner using expo-camera with permission handling
- `app/add-contact.tsx` - Add new contact modal
- `app/contact-detail.tsx` - Contact detail view with notes editing, QR code with save/download button
- `app/send-message.tsx` - SMS message composer with templates, QR code preview and payload included in SMS
- `server/routes.ts` - Twilio SMS API endpoints
- `constants/colors.ts` - Static color definitions (legacy, all screens now use useColors() from theme-context)

### Theming System
All screens use `useColors()` hook from `lib/theme-context.tsx` for dynamic colors. Two themes available:

**Orange Theme (default):**
- Primary: #E8762D, Primary Dark: #2D1408, Background: #FDF6F0
- Categories: New #E8762D, Contacted #D4956A, Qualified #3B82F6 (blue), Outreached #22C55E (green), Unknown #A69279

**Blue Orange Theme:**
- Primary: #00068E (navy), Primary Dark: #000347, Background: #F0F4FA
- Accent blue: #66AAE3, Golden highlight: #E49716
- Categories: New #00068E, Contacted #66AAE3, Qualified #3B82F6 (blue), Outreached #22C55E (green), Unknown #8B9DC3

- Logo: assets/images/bram-logo.png (warm orange with circle motif)

### Supabase Setup
Requires secrets: SUPABASE_URL, SUPABASE_KEY
Client file: `server/supabaseClient.ts` — exports a singleton `supabase` instance
Test endpoint: GET `/api/supabase-test` — verifies connection is live

### Supabase Endpoints
- GET `/api/supabase-test` — verifies connection to `namesz` table
- POST `/api/save-contact` — saves a new contact to `namesz` table (body: `{name, phone, email?, category?, frequency?, notes?}`)

### Twilio Setup
Requires env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
Uses official `twilio` SDK for SMS sending. Messages are queued if Twilio is not configured.
Endpoints:
- POST `/api/send-message` — send SMS to a single contact (used by send-message screen)
- POST `/api/send-sms-to-all` — fetch all contacts from Supabase `namesz` table and send SMS to each (body: `{messageBody: "..."}`)


Contact cards for "New" clients show a "Send Message" button; after sending, the button becomes disabled ("Sent").
Contact model tracks `messageSent` boolean for this state.
