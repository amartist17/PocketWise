# Security

## Protections in place

- Passwords are hashed with bcrypt (cost factor 12); plaintext passwords are never stored.
- JWTs are signed with a server-only secret, expire, and are required through Bearer authentication middleware.
- The mobile token is stored with Expo SecureStore, not AsyncStorage.
- Every transaction query includes the authenticated `userId`; knowing another document ID is not enough to read or mutate it.
- Zod validates authentication, query, and transaction input before database operations.
- Helmet supplies defensive HTTP headers, JSON bodies are size-limited, Express's signature is disabled, and auth routes are rate-limited.
- Environment variables keep the MongoDB connection string and JWT secret out of source control.
- CORS is configurable through `CLIENT_ORIGIN`. Mobile native requests do not rely on browser CORS, but a future web build does.

## Production checklist

- Generate a unique high-entropy `JWT_SECRET` and store it in the deployment provider's secret manager.
- Set a specific `CLIENT_ORIGIN` for a deployed web client.
- Use TLS/HTTPS for all production traffic; never send a bearer token over plaintext internet connections.
- Use a restricted MongoDB database user, enable backups, and restrict network access.
- Review dependency alerts regularly; do not apply forced audit upgrades without compatibility testing.
- Rotate credentials after suspected exposure and invalidate sessions by changing the signing key or adding server-side token revocation.

## Data storage decision

AsyncStorage holds only the theme preference. SecureStore holds the access token using Android Keystore/iOS Keychain-backed storage. SecureStore protects storage at rest, but an unlocked compromised device still requires a broader mobile threat model.
