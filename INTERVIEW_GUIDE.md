# Interview Guide

## What is React Native?

It is a React renderer for native platforms. I write components and state in React, but primitives such as `View` and `Text` become native Android/iOS views rather than DOM nodes.

## React vs React Native?

React supplies the component, state, and reconciliation model. React DOM renders that model to HTML; React Native renders it to native platform UI and uses native styling primitives.

## What is Expo?

Expo is a React Native framework and toolchain. It coordinates compatible native modules, development tooling, app configuration, routing, updates, and cloud builds.

## What is Expo Router?

It is file-based routing for Expo apps. Route files become screens, while `_layout.tsx` files configure native stacks, tabs, and providers around them.

## What is Metro?

Metro is React Native's bundler and development server. It resolves imports, transforms TypeScript/JSX, and serves a platform-specific JavaScript bundle to the app.

## View vs div?

Both are layout containers, but `View` maps to a native platform view and has no browser DOM or CSS cascade. Raw text must be inside a `Text` component.

## FlatList vs ScrollView?

ScrollView mounts all children and suits short content. FlatList virtualizes long data, renders rows lazily, and provides list-oriented APIs such as refresh and empty states.

## AsyncStorage vs SecureStore?

AsyncStorage is persistent key-value storage for non-sensitive preferences. SecureStore uses platform-protected credential storage, so I use it for the JWT.

## How does navigation work?

The root stack contains an auth group, a protected tabs group, and a transaction-form modal. Authentication state decides which route group is reachable, while nested tab layout controls the four main sections.

## How does the app communicate with Node.js?

An Axios instance calls the REST API as JSON. A request interceptor reads the JWT from SecureStore and sends it as a Bearer token. Services keep HTTP details out of screens.

## How does JWT authentication work?

After checking a bcrypt password hash, the API signs a short-lived token whose subject is the user ID. The app stores it in SecureStore. Middleware verifies the signature/expiry and exposes the user ID to protected controllers.

## How are protected routes handled?

Auth Context restores the token and calls `/auth/me` during startup. While that asynchronous bootstrap runs, the app shows a loading state; afterward, route-group layouts redirect authenticated and anonymous users appropriately.

## How do you prevent users accessing another user's transactions?

Every protected transaction query includes `userId` from the verified token. Updates and deletes query by both `_id` and `userId`, so a valid foreign document ID is insufficient.

## How do you handle Android/iOS differences?

I prefer cross-platform Expo/React Native APIs and use `Platform` only when behavior differs—for example, iOS keyboard avoidance and date-picker presentation. I also account for safe areas and Android edge-to-edge layout.

## What is an APK?

An APK is an installable Android application package, useful for direct testing and internal distribution.

## What is an AAB?

An Android App Bundle is the Play Store publishing format. Google Play generates optimized APKs for each device from the bundle.

## How would you deploy it?

I would deploy the Express API with HTTPS and managed environment secrets, use a managed MongoDB database with restricted network access, point `EXPO_PUBLIC_API_URL` at that API, then use an EAS production build to create an AAB for Play Console submission.

## Why no Redux or chart library?

The app has a small number of low-frequency global concerns, so Context is enough. Analytics are simple proportional bars that native Views render well; avoiding a chart dependency reduces bundle and compatibility cost.

## When would useMemo or useCallback matter?

I use them where reference stability or a non-trivial derived calculation affects child rendering or effect dependencies. I do not add them to every function because memoization itself has cost and complexity.
