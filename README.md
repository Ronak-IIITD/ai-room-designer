# AI Room Designer

An AI-powered room design tool that uses Google's Gemini AI to transform room photos into new design concepts.

## Features

- Upload room photos (PNG, JPG, WEBP)
- Describe your design vision with text prompts
- AI-generated room redesigns using Gemini AI
- Secure Google sign-in to personalize the experience
- Automatic storage of redesign history in Firebase
- Dark/light theme toggle
- Responsive design with Tailwind CSS

## Setup Instructions

1. **Clone/Download** the project files

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy `.env.example` to `.env` and fill in the required keys:
   
   ```bash
   cp .env.example .env
   ```
   
   Required values:
   
   - `VITE_API_KEY` — Google Gemini API key (image generation)
   - `VITE_FIREBASE_*` — Firebase config for Authentication, Firestore, and Storage

   Both key sets are needed for login and saving user redesigns.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

## Configuring Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable **Authentication → Sign-in method → Google**
3. Provision **Cloud Firestore** (in production mode or locked-down test mode)
4. Enable **Cloud Storage**
5. Copy the web app credentials (API key, Auth domain, Project ID, etc.) into your `.env`

User redesigns are saved under `users/{uid}/generations` and reference files uploaded to Storage.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer component
│   ├── Icons.tsx       # SVG icon components
│   ├── ImageUploader.tsx # File upload component
│   ├── LandingPage.tsx # Landing page component
│   ├── Loader.tsx      # Loading spinner
│   └── ResultDisplay.tsx # Result display component
├── context/
│   └── AuthContext.tsx   # Google authentication provider
├── services/
│   ├── firebase.ts       # Firebase initialization
│   ├── geminiServices.tsx # Gemini AI service
│   └── userData.ts       # Firestore/Storage persistence helpers
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── vite-env.d.ts      # TypeScript environment types
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI
- Firebase Authentication, Firestore, and Storage
- React DOM

## License

All Rights Reserved © 2025 AI Room Designer