# BRAM - Marketing CRM

## Overview
BRAM is a marketing CRM mobile application built with Expo (React Native) and Express backend. It helps manage contacts with categorization, messaging frequency controls, and Twilio SMS integration.

## Recent Changes
- 2026-02-20: Initial build - all screens, contact management, Twilio SMS backend

## User Preferences
- Dark navy/blue color scheme (#0A1628, #1A56DB)
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
- Primary: #1A56DB (blue)
- Primary Dark: #0A1628 (navy)
- Categories: New (blue), Contacted (orange), Qualified (green), Unknown (gray)

### Twilio Setup
Requires env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
Messages are queued if Twilio is not configured.
