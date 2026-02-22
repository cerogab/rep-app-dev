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

## User Preferences
- Warm orange/red color scheme matching Bram logo (#E8762D primary, #2D1408 dark)
- Warm accent palette for badges, charts, secondary text
- Inter font family throughout
- Manual Twilio API key setup (not connector OAuth)

## Project Architecture
- **Frontend**: Expo Router with file-based routing, React Context for contacts & auth state, AsyncStorage for persistence
- **Backend**: Express on port 5000 with Twilio SMS endpoint
- **Auth**: Simple email/password login stored in AsyncStorage, auth gate in root layout
- **Tabs**: Receiver page (index), Trends (dashboard), Settings
- **Modals**: add-contact, send-message
- **Stack**: contact-detail
- **Auth Screen**: login.tsx (rendered directly by AuthGate, not via router)

### Key Files
- `lib/auth-context.tsx` - Authentication state management with AsyncStorage
- `lib/contacts-context.tsx` - Contact state management with AsyncStorage
- `app/login.tsx` - Login screen (Figma design: logo, tagline, email/password, Face ID)
- `app/(tabs)/index.tsx` - Receiver page (formerly Contacts) with search & filter
- `app/(tabs)/dashboard.tsx` - Analytics dashboard with charts
- `app/(tabs)/settings.tsx` - User profile & settings
- `app/add-contact.tsx` - Add new contact modal
- `app/contact-detail.tsx` - Contact detail view with notes editing
- `app/send-message.tsx` - SMS message composer with templates
- `server/routes.ts` - Twilio SMS API endpoint
- `constants/colors.ts` - Color system

### Color Scheme
- Primary: #E8762D (warm orange) - headers, buttons, tab active, main CTA
- Primary Dark: #2D1408 (deep brown) - gradient backgrounds
- Accent: #D04525 (red-orange) - error states, destructive actions
- Background: #FDF6F0 (warm off-white)
- Warm Accent Palette:
  - Text Secondary #8B6F55 - secondary text
  - Text Tertiary #A69279 - tertiary text, tab inactive
  - Contacted #D4956A - warm tan badge
  - Chart Bars #E8B87A - warm gold
  - Qualified #E8A84C - amber badge, success states
  - Highlight #F0C060 - warm gold highlights
  - Soft Glow #F5D080 - accent glow
- Categories: New (orange #E8762D), Contacted (warm tan #D4956A), Qualified (amber #E8A84C), Unknown (warm grey #A69279)
- Logo: assets/images/bram-logo.png (warm orange with circle motif)

### Twilio Setup
Requires env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
Messages are queued if Twilio is not configured.
