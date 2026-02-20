# BRAM - Marketing CRM

## Overview
BRAM is a marketing CRM mobile application built with Expo (React Native) and Express backend. It helps manage contacts with categorization, messaging frequency controls, and Twilio SMS integration.

## Recent Changes
- 2026-02-20: Initial build - all screens, contact management, Twilio SMS backend
- 2026-02-20: Applied Coolors teal accent palette as accents (badges, charts, secondary text)

## User Preferences
- Dark navy/blue primary color scheme (#0A1628, #1A56DB)
- Teal/green accent palette from Coolors for badges, charts, secondary text
- Inter font family throughout
- Manual Twilio API key setup (not connector OAuth)

## Project Architecture
- **Frontend**: Expo Router with file-based routing, React Context for contacts state, AsyncStorage for persistence
- **Backend**: Express on port 5000 with Twilio SMS endpoint
- **Tabs**: Contacts (index), Trends (dashboard), Settings
- **Modals**: add-contact, send-message
- **Stack**: contact-detail

### Key Files
- `lib/contacts-context.tsx` - Contact state management with AsyncStorage
- `app/(tabs)/index.tsx` - Contacts list with search & filter
- `app/(tabs)/dashboard.tsx` - Analytics dashboard with charts
- `app/(tabs)/settings.tsx` - User profile & settings
- `app/add-contact.tsx` - Add new contact modal
- `app/contact-detail.tsx` - Contact detail view with notes editing
- `app/send-message.tsx` - SMS message composer with templates
- `server/routes.ts` - Twilio SMS API endpoint
- `constants/colors.ts` - Color system

### Color Scheme
- Primary: #1A56DB (blue) - headers, FAB, tab active, main CTA
- Primary Dark: #0A1628 (navy) - gradient backgrounds
- Accent Palette (Coolors teal):
  - Granite #5C6F68 - secondary text
  - Grey Olive #738982 - tertiary text, tab inactive
  - Muted Teal #8AA39B - Contacted badge
  - Muted Teal Light #90BEAF - chart bars (calls)
  - Pearl Aqua #95D9C3 - Qualified badge, success states
  - Aquamarine #A4F9C8 - highlights
  - Soft Cyan #A7FFF6 - accent glow
- Categories: New (blue #1A56DB), Contacted (muted teal #8AA39B), Qualified (pearl aqua #95D9C3), Unknown (grey olive #738982)

### Twilio Setup
Requires env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
Messages are queued if Twilio is not configured.
