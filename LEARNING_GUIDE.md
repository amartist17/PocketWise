# React Native Learning Guide

This guide grows with the application. It explains the code in terms of concepts you already know from React on the web.

## 1. Architecture

The finished system will have three independently understandable layers:

```text
┌──────────────────────────┐
│ React Native App (Expo) │
└─────────────┬────────────┘
             │ HTTP / REST
             ▼
┌──────────────────────────┐
│ Node.js / Express API    │
└─────────────┬────────────┘
             │ Mongoose
             ▼
┌──────────────────────────┐
│ MongoDB                  │
└──────────────────────────┘
```

The mobile app owns presentation and interaction. The API owns business rules and authorization. MongoDB owns persisted application data.

## 2. Project File Tree

Current feature-oriented mobile structure:

```text
app/
├── (auth)/                 # login/register stack
├── (tabs)/                 # main bottom tabs
│   ├── index.tsx             # dashboard
│   ├── transactions.tsx
│   ├── analytics.tsx
│   └── profile.tsx
├── _layout.tsx             # providers + root stack
├── index.tsx               # entry redirect
└── transaction-form.tsx    # add/edit modal
assets/
└── images/
components/
├── ui/                     # button, input, card, screen
└── transactions/           # transaction row
constants/
└── theme.ts
contexts/
└── theme-context.tsx
data/
└── mock-transactions.ts
types/
└── index.ts
utils/
├── format.ts
└── transactions.ts
backend/
├── src/
│   ├── config/             # environment + MongoDB
│   ├── controllers/        # auth/transaction use cases
│   ├── middleware/         # JWT + errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # endpoint wiring
│   ├── validation/         # Zod request contracts
│   └── server.ts
├── .env.example
└── package.json
app.json
eslint.config.js
package.json
tsconfig.json
```

- `app/`: Expo Router route files. A screen file here becomes a navigable route; `_layout.tsx` configures the navigator around its sibling routes.
- `assets/`: Files bundled with the app, such as icons, splash images, and fonts. Add non-code media here.
- `components/`: Reusable UI pieces shared by screens. Add a component when a visual or interactive pattern is used more than once or deserves an isolated responsibility.
- `constants/`: Stable shared values such as colors and spacing. Add values here when multiple features need the same vocabulary.
- `hooks/`: Reusable React hooks. Add behavior here when stateful logic is shared without requiring shared UI.
- `scripts/`: Development utilities, not code shipped as an app screen.
- `app.json`: Expo's native/app configuration: display name, icons, scheme, platform behavior, and config plugins.
- `package.json`: Dependencies and developer commands, just like a web React project.
- `tsconfig.json`: TypeScript compiler rules. It extends Expo's tested defaults.

## 3. Screen Navigation Map

The finance app now has nested stacks, tabs, and a modal:

```text
Root Stack
├── Authentication Stack
│   ├── Login
│   └── Register
├── Main Tabs
│   ├── Home
│   ├── Transactions
│   ├── Analytics
│   └── Profile
└── Transaction Form (modal)
```

Parenthesized folders such as `(tabs)` are route groups. They organize/configure routes without adding that folder name to the URL.

## 4. Component Map

The dashboard composition is:

```text
HomeScreen
├── Screen (safe area + scrolling)
├── Balance Card
├── Income Card
├── Expense Card
├── Recent Activity Card
│   └── TransactionItem[]
└── Add Transaction action
```

The screen composes reusable children exactly as React web does. Props flow down; callbacks and state changes flow up. React Native changes the rendered primitives, not React's component model.

## 5. React Web vs React Native

| React Web | React Native | Project use |
| --- | --- | --- |
| `<div>` | `<View>` | Layout containers |
| `<p>`, headings, inline text | `<Text>` | Every text node must live inside `Text` |
| `<button>` | `<Pressable>` | Touch interaction with pressed-state feedback |
| `<input>` | `<TextInput>` | Mobile text entry and keyboard configuration |
| `<img>` | `<Image>` / `expo-image` | Bundled or remote images |
| CSS files | `StyleSheet.create()` | Validated JavaScript style objects |
| browser viewport | native screen | Device dimensions, safe areas, and keyboards matter |
| React Router routes | Expo Router files | File-based native stack/tab navigation |
| Vite/Webpack dev server | Metro bundler | Transforms and serves the JavaScript bundle |

## 6. Important React Native Concepts

### Expo

Expo is a React Native framework and toolchain. React Native supplies the component/runtime model; Expo supplies a coordinated SDK, development server, routing setup, native configuration, and build services. This project uses Expo SDK 57 with React Native 0.86 and React 19.2 to match the current Expo Go application.

SDK 57 makes the New Architecture and Android edge-to-edge behavior standard rather than opt-in config flags. It also requires Node.js 22.13 or another explicitly supported runtime; the project records this requirement in `package.json`.

### Expo Go

Expo Go is a prebuilt native shell on your phone. It downloads the JavaScript bundle from Metro and already contains many Expo native modules. It is excellent for learning and fast iteration; later, a development build gives us control over custom native modules.

### Metro

Metro plays the role that Vite or Webpack's dev server plays on the web. It starts from `expo-router/entry`, resolves imports, transforms TypeScript/JSX, and serves a platform-specific JavaScript bundle to Expo Go.

### View and Text

`View` is the closest equivalent to `div`, but it maps to a native platform view rather than HTML. `Text` maps to native text; unlike the web, raw strings cannot be placed directly inside a `View`.

### StyleSheet

`StyleSheet.create()` groups native style objects. Property names are JavaScript-style (`backgroundColor`), values are usually device-independent numbers, and Flexbox is the primary layout model. There is no CSS cascade.

### Safe areas and keyboard handling

`SafeAreaView` prevents content from sitting under notches and system bars. `KeyboardAvoidingView` moves form content when the software keyboard opens. Browsers normally resize/scroll form fields for you; mobile layouts need this intent expressed explicitly.

### ScrollView vs FlatList

`ScrollView` renders all children and fits short forms or dashboards. `FlatList` renders list rows lazily and is the correct default for transaction history that can grow. It also provides refresh and empty-state hooks.

### Pressable and TextInput

`Pressable` is the flexible native equivalent of an interactive button: it exposes pressed state and accessibility roles. `TextInput` is the native input and lets us request mobile keyboards such as email or decimal entry.

### Local, global, and server state

- Local state (`useState`) holds temporary form values and filters used by one screen.
- Global client state (Context) holds cross-screen concerns such as theme and, next, authentication.
- Server state is data owned by the API, such as transactions. It will be loaded through a service rather than duplicated permanently in Context.

Theme preference is non-sensitive, so it is persisted with AsyncStorage. JWTs will use SecureStore because AsyncStorage is not an encrypted credentials vault.

## 7. Data Flow

The current startup flow is:

```text
npm start
   ↓
Expo CLI starts Metro
   ↓
Expo Go scans the QR code / opens the dev URL
   ↓
Metro serves the JavaScript bundle
   ↓
expo-router/entry discovers route files
   ↓
app/_layout.tsx mounts the root navigator
   ↓
app/(tabs)/index.tsx renders the initial screen
   ↓
React Native creates Android native views
```

React does reconciliation as usual. Instead of updating a browser DOM, React Native coordinates updates to native Android views.

For daily development, `npm run dev` starts the backend as a PowerShell background job and keeps Expo interactive in the foreground. This matters because Expo needs an interactive terminal to draw its QR code and accept shortcuts. One `Ctrl+C` stops both processes. The narrower `npm start` command still starts only Expo.

The real authentication flow is:

```text
Press Sign in
    ↓
LoginScreen.submit()
    ↓
AuthContext.login()
    ↓
authService → Axios → POST /api/auth/login
                         ↓
              Express route/controller
                         ↓
                 MongoDB user lookup
                         ↓
               bcrypt password check
                         ↓
                    signed JWT
                         ↓
SecureStore ← AuthContext → protected tabs
```

On restart, Auth Context reads SecureStore and calls `/api/auth/me` before navigation decides whether to show auth or protected routes.

## 8. API Map

| Method | Endpoint | Called by |
| --- | --- | --- |
| `GET` | `/api/health` | deployment/health checks |
| `POST` | `/api/auth/register` | Register screen via Auth Context |
| `POST` | `/api/auth/login` | Login screen via Auth Context |
| `GET` | `/api/auth/me` | Auth startup/session restore |
| `GET` | `/api/transactions` | Home, Transactions, Analytics via Transaction Context |
| `POST` | `/api/transactions` | Add Transaction form |
| `GET` | `/api/transactions/:id` | available for transaction detail clients |
| `PUT` | `/api/transactions/:id` | Edit Transaction form |
| `DELETE` | `/api/transactions/:id` | Edit Transaction delete action |

For a physical Android phone, `localhost` means the phone itself. Set `EXPO_PUBLIC_API_URL=http://<computer-LAN-IP>:4000/api`, keep both devices on the same network, and allow the port through Windows Firewall. The Android Emulator's host alias is `10.0.2.2`.

## 9. Progress Tracker

- [x] Phase 0: Inspect environment
- [x] Phase 1: React Native + Expo setup
- [x] Phase 2: Understand the default project
- [x] Phase 3: Clean project structure
- [x] Phase 4: App navigation
- [x] Phase 5: Design system
- [x] Phase 6: Static screens
- [x] Phase 7: React Native core components
- [x] Phase 8: State management
- [x] Phase 9: Backend setup
- [x] Phase 10: Database design
- [x] Phase 11: Authentication backend
- [x] Phase 12: Mobile authentication
- [x] Phase 13: Networking
- [x] Phase 14: Transaction API
- [x] Phase 15: Connect transactions UI
- [x] Phase 16: Add transaction experience
- [x] Phase 17: Dashboard
- [x] Phase 18: Analytics
- [x] Phase 19: Profile and settings
- [x] Phase 20: Error handling
- [x] Phase 21: Security
- [x] Phase 22: Performance
- [x] Phase 23: Refactor
- [x] Phase 24: Automated foundation tests
- [ ] Phase 25: Physical Android UI verification
- [x] Phase 26: App icon and splash configuration (placeholder assets)
- [x] Phase 27: Android build preparation
- [x] Phase 28: README
- [x] Phase 29: Portfolio preparation
- [x] Phase 30: Interview preparation

## 10. Things I Should Be Able To Explain In An Interview

**Q: What is Expo?**  
Expo is a framework and toolchain around React Native. It gives the project compatible native modules, development tooling, routing, configuration, and cloud build options while the UI still runs as React Native native views.

**Q: React Native vs Expo?**  
React Native is the renderer and component model for building native interfaces with React. Expo is a framework built around it that standardizes common native capabilities and the development/build workflow.

**Q: What is Metro?**  
Metro is React Native's JavaScript bundler and development server. It resolves the module graph, transforms TypeScript and JSX, and serves the bundle to the running native app.

**Q: Why can the project run without Android Studio initially?**  
Expo Go is already a compiled Android application. During development it loads our JavaScript bundle, so we do not need to compile native Android code until we need a custom development build or release artifact.

**Q: How is Expo Router different from React Router?**  
Both map locations to screens, but Expo Router creates routes from files and integrates with native stacks and tabs. React Router primarily manages browser history and web-rendered pages.

**Q: Why use FlatList instead of mapping inside ScrollView?**  
FlatList virtualizes rows, so long histories do not mount every item at once. It also provides native-friendly refresh, separator, and empty-state APIs.

**Q: Why Context rather than Redux?**  
The app currently has only a few low-frequency global concerns. Context keeps those explicit without adding a larger state framework; API-owned transaction data remains server state.

**Q: AsyncStorage vs SecureStore?**  
AsyncStorage is appropriate for non-sensitive preferences such as theme. SecureStore uses platform-protected storage and is the correct place for the JWT.

**Q: How does the backend enforce ownership?**  
JWT middleware verifies the token and places its subject on the request. Every transaction read, update, and delete includes that user ID in its MongoDB filter.

**Q: Why reference User from Transaction?**  
It models one user owning many transactions without embedding an ever-growing array in the user document. It also supports indexed, user-scoped history queries.

**Q: How are API failures handled?**  
Axios errors are converted to human-readable messages. Screens expose loading, retry/refresh, validation, empty, and network-error states; invalid startup sessions are removed from SecureStore.

**Q: APK vs AAB?**  
An APK installs directly on Android. An AAB is uploaded to Google Play, which generates device-optimized APKs from it.
