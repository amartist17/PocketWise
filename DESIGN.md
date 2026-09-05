# PocketWise design system

## Direction

PocketWise uses a calm, capable Material 3-inspired Android interface. Financial information leads; decoration supports comprehension. The primary green suggests stability without resembling a bank or payment provider, while warm amber is reserved for future or cautionary states.

## Foundations

- Color roles live in `constants/theme.ts` and support light and dark appearance.
- Green is the primary action and positive brand color. Red is reserved for expenses and destructive actions.
- Surfaces use subtle borders instead of stacked shadows. Large green fields are reserved for high-value summaries and focal actions.
- Type follows a compact display/title/heading/body/label/caption scale. Sentence case is preferred over decorative uppercase labels.
- Spacing follows a 4-point base with 16–24 point content rhythm and 48 point minimum interactive targets.
- Corners range from 10 to 24 points; pills are limited to compact badges and floating actions.

## Components and patterns

- Bottom navigation contains five top-level destinations: Home, Transactions, Analytics, Tools, and Profile.
- A single prominent balance field anchors Home. Supporting metrics and activity remain visually quieter.
- Tools use one strong feature block for Split and an outlined, non-interactive treatment for QR Assist.
- Buttons provide short scale and haptic feedback. Balance updates and recalculated split totals settle with a restrained scale transition; participant rows use layout continuity when added or removed. System reduced-motion preference disables spatial animation.
- Forms use persistent field labels, explicit helper text, and native keyboards.
- Split participant names are entered manually and remain local to the current session.

## Content rules

- Say “share” or “request,” never “pay,” “sent,” or “confirmed” for Split actions.
- QR Assist must remain labeled “Coming soon” until its safety and camera flows are implemented and tested.
- Every sharing flow states that PocketWise does not move money.
