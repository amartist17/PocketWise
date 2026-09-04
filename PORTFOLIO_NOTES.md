# Portfolio Notes

## Project title

PocketWise — Personal Finance Tracker

## One-line description

A full-stack React Native expense tracker with secure JWT sessions, user-scoped transaction CRUD, analytics, and adaptive theming.

## Short description

PocketWise helps users record income and expenses, understand their balance and category spending, and manage transaction history from a polished Android-first interface. The Expo client communicates with a modular Express/MongoDB API and protects persisted sessions with platform secure storage.

## Tech stack

React Native, Expo, Expo Router, TypeScript, React Context, Axios, SecureStore, AsyncStorage, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Zod, Helmet, ESLint.

## Best features

- Protected native navigation with persisted SecureStore sessions
- User-owned transaction CRUD with search, filtering, refresh, validation, and clear state feedback
- Derived financial summaries and lightweight category visualizations without a large chart dependency
- System-aware light/dark design system and reusable native components
- Backend input validation, rate limiting, security headers, and ownership enforcement

## Technical challenges

- A phone's `localhost` refers to the phone, so the API URL must use the development computer's LAN IP.
- Authentication startup must restore SecureStore asynchronously before choosing the public or protected route tree.
- Transaction authorization must scope every database query by both document ID and authenticated user ID.
- Mobile forms require explicit keyboard, safe-area, touch-target, and native date-picker handling.

## What I learned

How React concepts map to native UI primitives, how Expo and Metro deliver a bundle to Android, how file-based routing produces native stacks/tabs, how to separate local/global/server state, and how to connect secure mobile authentication to a REST backend.

## Resume bullets

- Built an Android-ready personal finance app with React Native, Expo Router, and TypeScript, including protected navigation, adaptive theming, transaction workflows, and category analytics.
- Designed and integrated a Node.js/Express/MongoDB REST API with JWT authentication, bcrypt password hashing, Zod validation, and user-scoped transaction authorization.
- Implemented secure session persistence with Expo SecureStore, Axios request middleware, mobile loading/error/empty states, pull-to-refresh, and strict TypeScript/ESLint checks.

## Suggested GitHub description

Full-stack React Native + Expo personal finance tracker with secure JWT auth, MongoDB transaction CRUD, analytics, and dark mode.
