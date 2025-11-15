# Deployment Guide

## Security Improvements Implemented

### ✅ Completed

1. **Firebase Security Rules** - Firestore and Storage now have proper access controls
2. **Backend API Calls** - All AI API calls moved to Firebase Functions (server-side)
3. **Environment Variables** - Proper .env.example created, .env excluded from git
4. **Configuration Hardening**:
   - TypeScript strict mode with path aliases
   - ESLint with React and accessibility rules
   - Vite config secured (no sourcemaps in production, localhost-only dev server)
5. **Dependency Cleanup** - Removed unused @google/genai package
6. **Security Audit** - Fixed 1 of 3 vulnerabilities (2 remaining require breaking changes)

## Deployment Steps

### 1. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `VITE_FIREBASE_*` - Get from Firebase Console
- OpenRouter API key should be set in Firebase Functions config (not in client .env)

### 2. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 3. Configure Firebase

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting
# - Storage
```

### 4. Set Firebase Functions Environment Config

```bash
# Set the OpenRouter API key for Firebase Functions
firebase functions:config:set openrouter.apikey="YOUR_OPENROUTER_API_KEY"
```

### 5. Deploy Firebase Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 6. Deploy Firebase Functions

```bash
# Build and deploy functions
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 7. Build and Deploy Frontend

```bash
# Build the frontend
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Testing Locally

### Run Firebase Emulators

```bash
# Start all emulators (auth, functions, firestore, storage)
firebase emulators:start
```

### Run Development Server

```bash
# In a separate terminal
npm run dev
```

The app will connect to local emulators for testing.

## Environment-Specific Configuration

### Development
- Uses Firebase Emulators
- Connects to localhost:5001 for Functions
- No API costs during development

### Production
- Uses live Firebase services
- Server-side rate limiting (10 requests/day per user)
- Proper authentication required

## Security Checklist

- [ ] .env file never committed to git
- [ ] Firebase security rules deployed
- [ ] API keys stored in Firebase Functions config (server-side only)
- [ ] OpenRouter API key never exposed to client
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting active
- [ ] Input validation enabled

## Monitoring

Consider adding:
1. **Sentry** for error tracking
2. **Google Analytics** or **Plausible** for usage analytics
3. **Firebase Performance Monitoring**
4. **Cloud Functions logs** via Firebase Console

## Cost Management

### Current Setup:
- **Firestore**: Generous free tier (50k reads, 20k writes per day)
- **Storage**: 5GB free
- **Functions**: 2M invocations per month free
- **Hosting**: 10GB bandwidth per month free
- **OpenRouter**: Varies by model (using free tier: gemini-2.0-flash-exp:free)

### Rate Limits:
- 10 AI generations per user per day (configurable in functions/src/index.ts)

## Troubleshooting

### Common Issues:

**1. "Unauthenticated" error**
- Ensure user is signed in before generating designs
- Check Firebase Auth is properly configured

**2. "Resource exhausted" error**
- User has hit daily generation limit
- Limit resets every 24 hours

**3. Functions not deploying**
- Ensure you've set the OpenRouter API key: `firebase functions:config:set openrouter.apikey="KEY"`
- Check functions/src/index.ts compiles: `cd functions && npm run build`

**4. CORS errors**
- Update CORS configuration in functions/src/index.ts
- Replace `origin: true` with your actual domain in production

## Next Steps

### Recommended Improvements:

1. **Add Testing** - Set up Vitest and React Testing Library
2. **Actual Image Generation** - Integrate Stability AI or DALL-E for real image generation
3. **Refactor App.tsx** - Break down the 507-line component
4. **Add Sentry** - For error tracking
5. **Performance Monitoring** - Track Web Vitals
6. **PWA Support** - Add offline capabilities

## Support

For issues or questions:
- Check Firebase Console logs
- Review Cloud Functions logs
- Check browser console for client-side errors
