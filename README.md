# PocketWise — Personal Finance Tracker

A polished full-stack mobile expense tracker built to demonstrate practical React Native, Expo Router, TypeScript, Express, MongoDB, and JWT authentication.

## Live deployment

- Web app: https://pocketwise-app-seven.vercel.app
- API health: https://pocketwise-api-six.vercel.app/api/health
- Hosting: Vercel with automatic deployments from `main`

## Features

- Register, sign in, persisted sessions, protected routes, and secure token storage
- Email-code password recovery, authenticated password changes, and permanent account deletion
- In-app privacy policy, terms, data-retention, and support information
- Balance, income, expense, recent-activity, and monthly overview dashboard
- Create, edit, delete, search, filter, and pull-to-refresh transactions
- Category spending and income-vs-expense analytics
- System, light, and dark appearance preferences
- Form validation, loading, empty, API error, and network failure states
- User-scoped backend authorization and production-minded HTTP protections
- Equal expense splitting with exact paise allocation, participant names, and the native share sheet (including WhatsApp when installed)
- Money Tools destination with a privacy-focused QR Assist “Coming soon” preview
- Reduced-motion-aware button feedback and refreshed dashboard visuals

## Architecture

```text
┌────────────────────────┐       HTTPS / JSON       ┌──────────────────────┐       Mongoose       ┌─────────────┐
│ React Native + Expo  │ ◀────── REST API ─────▶ │ Node.js + Express    │ ◀──────────────▶ │   MongoDB   │
│ Expo Router + TS     │                       │ JWT + Zod + bcrypt   │                      │             │
└────────────────────────┘                        └──────────────────────┘                      └─────────────┘
```

The mobile client stores its bearer token in SecureStore and attaches it through an Axios interceptor. Express verifies the JWT and adds its user ID to every transaction query, preventing cross-user access.

## Tech stack

**Mobile:** React Native 0.86, Expo SDK 57, Expo Router 57, React 19.2, TypeScript, Axios, SecureStore, Linear Gradient, AsyncStorage

**Backend:** Node.js, Express 5, TypeScript, MongoDB, Mongoose, Zod, JWT, bcrypt, Helmet
**Quality:** ESLint, strict TypeScript, Node test runner, Metro Android export verification

## Project structure

```text
app/              Expo Router screens and layouts
components/       reusable native UI and transaction components
contexts/         auth, transactions, and theme state
services/         Axios API, authentication, transactions, secure token storage
constants/        design tokens
types/            shared mobile TypeScript contracts
utils/            pure formatting and calculation logic
backend/src/
  config/         validated environment and database setup
  controllers/    HTTP use cases
  middleware/     JWT, 404, and error handling
  models/         Mongoose schemas
  routes/         endpoint maps
  validation/     Zod request schemas
```

## Local setup

Requirements: Node.js 22.13+ (or another SDK 57-supported release), npm, MongoDB, and Expo Go on an Android phone.

```bash
git clone <your-repository-url>
cd <repository-folder>
npm install
cd backend && npm install
```

Copy `backend/.env.example` to `backend/.env`, replace `JWT_SECRET`, and set your MongoDB connection. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL`.

For a physical phone, use your computer's LAN IP—not `localhost`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:4000/api
```

The phone and computer must be on the same network, and Windows Firewall must allow the backend's port.

## Run locally

Start the API and Expo together from the repository root:

```bash
npm run dev
```

The backend runs as a PowerShell background job while Expo remains interactive in the foreground, so its QR code and keyboard shortcuts remain visible. Press `Ctrl+C` once to stop both processes.

To run them separately, use Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2, from the repository root:

```bash
npm start
```

Scan the QR code with Expo Go. Android Emulator uses `http://10.0.2.2:4000/api`; a physical device needs `EXPO_PUBLIC_API_URL` as described above.

## API

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Service health |
| POST | `/api/auth/register` | No | Create account and token |
| POST | `/api/auth/login` | No | Sign in and token |
| POST | `/api/auth/forgot-password` | No | Request a time-limited reset code |
| POST | `/api/auth/reset-password` | No | Reset password with a valid code |
| GET | `/api/auth/me` | Bearer | Restore current user |
| PATCH | `/api/auth/password` | Bearer | Change current password |
| DELETE | `/api/auth/me` | Bearer | Permanently delete account and transactions |
| GET/POST | `/api/transactions` | Bearer | List/create own transactions |
| GET/PUT/DELETE | `/api/transactions/:id` | Bearer | Read/update/delete own transaction |

## Quality checks

```bash
npx tsc --noEmit
npm test
npm run lint
cd backend
npm run typecheck
npm test
npm run build
```

## Android builds

- Expo Go: fastest JavaScript iteration inside Expo's shared native shell.
- Development build: your own debug app with custom native modules.
- APK: directly installable Android package, useful for testers.
- AAB: Play Store upload format; Google Play creates optimized APKs for devices.

### Install PocketWise 1.0.0

- Signed Android APK: https://expo.dev/accounts/amartist17/projects/finance-tracker/builds/b344a7e2-67f4-439d-b2e2-880dc4f25c91
- Application ID: `com.pocketwise.expensetracker`
- Version code: `1`
- Size: `102.81 MB`
- SHA-256: `8A0BAC2B9294720F82CB8C6385B27AE6FEC9DA98607913B291B68E81AE3A7C7A`

The downloaded artifact is stored locally at `releases/PocketWise-1.0.0.apk`. APK binaries are intentionally ignored by Git; the Expo build page is the canonical installer link.

The `preview` profile produces an installable APK connected to the production API. To create a later build:

```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
```

Vercel deploys the web app and API automatically from `main`. EAS builds remain an explicit release action.

## Production configuration

The web app is built with `EXPO_PUBLIC_API_URL`. The API requires `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `NODE_ENV=production`. Password recovery additionally requires `RESEND_API_KEY` and a verified `EMAIL_FROM` sender. Secrets belong in Vercel environment settings and must never be committed.

The public legal page is available at https://pocketwise-app-seven.vercel.app/legal. Users can delete their account and associated transactions from Profile.

## Screenshots

Compact 430 × 932 previews generated from the Expo web renderer with representative showcase data. Native store captures should be regenerated on the target Android device before publishing.

With the API and Expo web preview running, regenerate them with `npm run capture:screenshots`. Set `POCKETWISE_PREVIEW_URL` when Expo is not using port 8081. The script refreshes the dedicated showcase account before capture; never point it at a production API.

| Dashboard | Analytics |
| --- | --- |
| ![PocketWise dashboard](./docs/screenshots/home-light.png) | ![PocketWise analytics](./docs/screenshots/analytics-light.png) |

| Money tools | Split an expense |
| --- | --- |
| ![PocketWise money tools](./docs/screenshots/tools-dark.png) | ![PocketWise expense split](./docs/screenshots/split-dark.png) |

## What I learned

React Native native primitives and mobile layout, Expo/Metro development, file-based native navigation, safe areas and keyboard UX, secure persistence, device-to-localhost networking, authenticated REST integration, user-scoped MongoDB CRUD, and Android build preparation.

For a code-guided walkthrough see [LEARNING_GUIDE.md](./LEARNING_GUIDE.md). For security decisions see [SECURITY.md](./SECURITY.md).
