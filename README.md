# 🏠 AI Room Designer# AI Room Designer



> Transform your living space with the power of AI! Upload a photo of your room and get instant, AI-generated redesign suggestions.An AI-powered room design tool that uses Google's Gemini AI to transform room photos into new design concepts.



[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)## Features

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)- Upload room photos (PNG, JPG, WEBP)

[![Firebase](https://img.shields.io/badge/Firebase-12.3-orange.svg)](https://firebase.google.com/)- Describe your design vision with text prompts

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)- AI-generated room redesigns using Gemini AI

- Secure Google sign-in to personalize the experience

## ✨ Features- Automatic storage of redesign history in Firebase

- Dark/light theme toggle

- 🎨 **AI-Powered Design** - Generate stunning room redesigns using advanced AI models- Responsive design with Tailwind CSS

- 📸 **Simple Upload** - Drag & drop or click to upload room photos

- 🔐 **Secure Authentication** - Google Sign-In and Email/Password authentication via Firebase## Setup Instructions

- ⚡ **Lightning Fast** - Built with Vite for optimal performance

- 🌙 **Dark Mode** - Beautiful dark theme for comfortable viewing1. **Clone/Download** the project files

- 🎯 **Style Presets** - Quick-select from 10+ popular interior design styles

- 💾 **Smart Caching** - Optimized API usage with intelligent caching2. **Install dependencies:**

- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile   ```bash

   npm install

## 🚀 Tech Stack   ```



- **Frontend:** React 18.3, TypeScript, Tailwind CSS3. **Set up environment variables:**

- **Build Tool:** Vite 5.4   

- **Authentication:** Firebase Auth (Google & Email/Password)   Copy `.env.example` to `.env` and fill in the required keys:

- **AI Integration:** OpenRouter API (supports multiple AI models)   

- **Database:** Cloud Firestore   ```bash

- **Storage:** Firebase Cloud Storage   cp .env.example .env

- **Styling:** Tailwind CSS with custom components   ```

- **Icons:** Lucide React   

   Required values:

## 📦 Getting Started   

   - `VITE_API_KEY` — Google Gemini API key (image generation)

### Prerequisites   - `VITE_FIREBASE_*` — Firebase config for Authentication, Firestore, and Storage



- Node.js 18+ and npm/yarn   Both key sets are needed for login and saving user redesigns.

- Firebase account ([Get started](https://firebase.google.com/))

- OpenRouter API key ([Get API key](https://openrouter.ai/))4. **Run the development server:**

   ```bash

### Installation   npm run dev

   ```

1. **Clone the repository**

   ```bash5. **Build for production:**

   git clone https://github.com/Ronak-IIITD/ai-room-designer.git   ```bash

   cd ai-room-designer   npm run build

   ```   ```



2. **Install dependencies**## Getting a Gemini API Key

   ```bash

   npm install1. Go to [Google AI Studio](https://aistudio.google.com/)

   ```2. Sign in with your Google account

3. Create a new API key

3. **Set up environment variables**4. Copy the key and paste it in your `.env` file

   

   Copy `.env.example` to `.env`:## Configuring Firebase

   ```bash

   cp .env.example .env1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)

   ```2. Enable **Authentication → Sign-in method → Google**

3. Provision **Cloud Firestore** (in production mode or locked-down test mode)

   Then edit `.env` with your credentials:4. Enable **Cloud Storage**

   ```env5. Copy the web app credentials (API key, Auth domain, Project ID, etc.) into your `.env`

   # OpenRouter API Key (or other AI provider)

   VITE_API_KEY=your_openrouter_api_key_hereUser redesigns are saved under `users/{uid}/generations` and reference files uploaded to Storage.

   

   # Firebase Configuration## Project Structure

   VITE_FIREBASE_API_KEY=your_firebase_api_key

   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com```

   VITE_FIREBASE_PROJECT_ID=your_project_idsrc/

   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com├── components/          # React components

   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id│   ├── Header.tsx      # Navigation header

   VITE_FIREBASE_APP_ID=your_app_id│   ├── Footer.tsx      # Footer component

   ```│   ├── Icons.tsx       # SVG icon components

│   ├── ImageUploader.tsx # File upload component

4. **Configure Firebase**│   ├── LandingPage.tsx # Landing page component

   - Go to [Firebase Console](https://console.firebase.google.com/)│   ├── Loader.tsx      # Loading spinner

   - Create a new project│   └── ResultDisplay.tsx # Result display component

   - Enable Authentication → Sign-in methods → Enable Google and Email/Password├── context/

   - Enable Cloud Firestore (Database)│   └── AuthContext.tsx   # Google authentication provider

   - Enable Cloud Storage├── services/

   - Copy your config values to `.env`│   ├── firebase.ts       # Firebase initialization

│   ├── geminiServices.tsx # Gemini AI service

5. **Run development server**│   └── userData.ts       # Firestore/Storage persistence helpers

   ```bash├── App.tsx             # Main app component

   npm run dev├── main.tsx           # Entry point

   ```└── vite-env.d.ts      # TypeScript environment types

```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

## 🔧 Available Scripts

- React 18

```bash- TypeScript

npm run dev          # Start development server- Vite

npm run build        # Build for production- Tailwind CSS

npm run preview      # Preview production build- Google Gemini AI

npm run lint         # Run ESLint- Firebase Authentication, Firestore, and Storage

```- React DOM



## 🌐 Deployment## License



### Deploy to Vercel (Recommended)All Rights Reserved © 2025 AI Room Designer

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🎨 Usage

1. **Sign In** - Use Google Sign-In or create an account with email/password
2. **Upload Photo** - Click or drag & drop a room photo
3. **Describe Vision** - Describe your desired design style or select a preset
4. **Generate** - Click "Generate Design" and wait for AI magic!
5. **Download** - Save your redesigned room image

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with theme toggle
│   ├── Footer.tsx      # Footer component
│   ├── AuthModal.tsx   # Authentication modal
│   ├── ImageUploader.tsx # Image upload component
│   ├── LandingPage.tsx # Main landing page
│   ├── ResultDisplay.tsx # Result display
│   └── ...
├── context/
│   └── AuthContext.tsx # Firebase auth context
├── services/
│   ├── firebase.ts     # Firebase initialization
│   ├── geminiServices.tsx # AI integration (OpenRouter)
│   └── userData.ts     # User data management
├── utils/
│   ├── apiUtils.ts     # API utilities (caching, retry)
│   ├── fileUtils.ts    # File handling utilities
│   └── analytics.ts    # Analytics tracking
├── App.tsx             # Main app component
└── main.tsx           # Entry point
```

## 🔒 Security

- ⚠️ **Never commit your `.env` file** - It contains sensitive API keys
- 🔐 All authentication is handled securely through Firebase
- 🛡️ API keys are validated and rate-limited
- 🔑 User data is protected with Firebase security rules
- 📝 The `.gitignore` file is configured to exclude sensitive files

## 🐛 Known Issues

- Free tier OpenRouter models may have temporary rate limits during high usage
- Image generation requires valid API credits

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍💻 Author

**Ronak Anand**
- GitHub: [@Ronak-IIITD](https://github.com/Ronak-IIITD)

## 🙏 Acknowledgments

- OpenRouter for AI model access
- Firebase for authentication and storage
- Google Gemini AI for image generation capabilities
- Tailwind CSS for beautiful styling
- React and Vite communities

---

<div align="center">
  Made with ❤️ by Ronak Anand
</div>
