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
- 2026-03-01: Added Vonage SMS integration, "Send Message" button on New contact cards, sent state tracking
- 2026-03-01: Added Privacy screen with Privacy Policy, DMCA notice, and copyright agent contact info

## User Preferences
- Two theme options: Orange (#E8762D primary) and Blue Orange (#00068E primary, #66AAE3 accents, #E49716 highlights)
- Theme selection persisted in AsyncStorage under '@bram_theme' key
- Inter font family throughout
- Manual Twilio API key setup (not connector OAuth)
- Manual Vonage API key setup for SMS

## Project Architecture
- **Frontend**: Expo Router with file-based routing, React Context for contacts & auth state, AsyncStorage for persistence
- **Backend**: Express on port 5000 with Twilio and Vonage SMS endpoints
- **Auth**: Simple email/password login stored in AsyncStorage, auth gate in root layout
- **Tabs**: Receiver page (index), Trends (dashboard), Settings
- **Modals**: add-contact, send-message
- **Stack**: contact-detail, appearance, notifications, account, privacy, help-support (all with swipe-back gesture)
- **Auth Screen**: login.tsx (rendered directly by AuthGate, not via router)

### Key Files
- `lib/theme-context.tsx` - Theme system with Orange & Blue Orange palettes, useColors() hook, AsyncStorage persistence
- `lib/auth-context.tsx` - Authentication state management with AsyncStorage
- `lib/contacts-context.tsx` - Contact state management with AsyncStorage
- `app/login.tsx` - Login screen (Figma design: logo, tagline, email/password, Face ID)
- `app/(tabs)/index.tsx` - Receiver page (formerly Contacts) with search & filter
- `app/(tabs)/dashboard.tsx` - Analytics dashboard with charts
- `app/(tabs)/settings.tsx` - User profile & settings with navigation to Account, Notifications, Appearance
- `app/appearance.tsx` - Theme selection screen with toggle switches
- `app/notifications.tsx` - Notification preferences (Allow, Email, SMS toggles) with AsyncStorage persistence
- `app/account.tsx` - Account info display (email, name, member since)
- `app/privacy.tsx` - Privacy Policy & DMCA notice (links to iubenda policy, copyright agent info)
- `app/help-support.tsx` - Help & Support with Designated Copyright Agent contact info
- `app/add-contact.tsx` - Add new contact modal
- `app/contact-detail.tsx` - Contact detail view with notes editing
- `app/send-message.tsx` - SMS message composer with templates
- `server/routes.ts` - Twilio and Vonage SMS API endpoints
- `constants/colors.ts` - Static color definitions (legacy, all screens now use useColors() from theme-context)

### Theming System
All screens use `useColors()` hook from `lib/theme-context.tsx` for dynamic colors. Two themes available:

**Orange Theme (default):**
- Primary: #E8762D, Primary Dark: #2D1408, Background: #FDF6F0
- Categories: New #E8762D, Contacted #D4956A, Qualified #3B82F6 (blue), Unknown #A69279

**Blue Orange Theme:**
- Primary: #00068E (navy), Primary Dark: #000347, Background: #F0F4FA
- Accent blue: #66AAE3, Golden highlight: #E49716
- Categories: New #00068E, Contacted #66AAE3, Qualified #3B82F6 (blue), Unknown #8B9DC3

- Logo: assets/images/bram-logo.png (warm orange with circle motif)

### Twilio Setup
Requires env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
Messages are queued if Twilio is not configured.

### Vonage SMS Setup
Requires env vars: VONAGE_API_KEY, VONAGE_API_SECRET, VONAGE_FROM_NUMBER
Send-message screen uses Vonage by default. Messages are queued if Vonage is not configured.
Contact cards for "New" clients show a "Send Message" button; after sending, the button becomes disabled ("Sent").
Contact model tracks `messageSent` boolean for this state.
