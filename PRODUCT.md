# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Users

PocketWise serves young adults and families who want a clear, approachable way to track everyday money. A future QR Assist concept may support a trusted helper sharing a payment QR and amount with a younger person who cannot use their own UPI account.

## Product Purpose

PocketWise combines personal income and expense tracking with lightweight social money utilities. Success means users can understand their financial position, divide a shared expense clearly, and safely communicate a payment request without PocketWise moving money.

## Positioning

The product pairs a calm personal-finance dashboard with a privacy-first Split flow. Split prepares a clear message and hands it to Android's native sharing system rather than becoming a payment processor or social network. QR Assist is currently only a documented, in-app “Coming soon” concept.

## Operating Context

Users operate the app primarily on Android phones, often one-handed and while handling a shared bill or receipt. Split messages are shared through installed apps such as WhatsApp.

## Capabilities and Constraints

- Expo SDK 57, React Native, TypeScript, and Expo Router.
- Personal dashboard, transaction CRUD, analytics, authentication, and themes remain core capabilities.
- Split calculates equal or custom shares and prepares a shareable summary.
- QR Assist is not implemented in this iteration; the Tools screen describes it as a future helper.
- The app does not initiate, authorize, or confirm payments.
- Participant names and QR data are not uploaded or retained by the backend.
- No APK or AAB build is requested during this iteration.

## Brand Commitments

The product name is PocketWise. Its language should feel calm, encouraging, financially responsible, and understandable to people learning to manage money. It must not imply that a shared message is a completed or verified payment.

## Evidence on Hand

The repository contains a working Expo application, an Express/MongoDB API, finance screens, theme tokens, and a custom PocketWise app mark. It has no testimonials, usage claims, or payment-provider partnership.

## Product Principles

1. Make money information legible before making it decorative.
2. Keep sensitive social utilities local and explicit.
3. Separate requesting or sharing from paying or confirming.
4. Use progressive disclosure so everyday tracking stays simple.
5. Make every important action understandable and reversible where possible.

## Accessibility & Inclusion

Use readable type, strong contrast, generous touch targets, accessible labels, reduced-motion-aware animation, and plain language. Camera access must not be a prerequisite for the core finance tracker.
