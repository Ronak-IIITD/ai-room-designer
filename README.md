# 🏠 AI Room Designer

> Transform your living space with the power of AI! Upload a photo of your room and get instant, AI-generated design suggestions.

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3-orange.svg)](https://firebase.google.com/)

## ✨ Features

- 🎨 **AI-Powered Design Analysis** - Get detailed room redesign suggestions using Google Gemini AI
- 📸 **Simple Upload** - Drag & drop or click to upload room photos (PNG, JPG, WEBP)
- 🔐 **Secure Authentication** - Google Sign-In and Email/Password via Firebase
- ⚡ **Lightning Fast** - Built with Vite and optimized for performance
- 🌙 **Dark Mode** - Beautiful dark theme for comfortable viewing
- 🎯 **Style Presets** - Quick-select from 10+ popular interior design styles
- 💾 **Smart Caching** - Optimized API usage with intelligent caching
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔒 **Secure Backend** - All API calls handled server-side via Firebase Functions
- 🛡️ **Rate Limiting** - Server-side rate limiting to prevent abuse

## 🚀 Tech Stack

### Frontend
- **React 18.2** with TypeScript for type-safe component development
- **Vite 5.0** for blazing-fast dev server and optimized builds
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons

### Backend
- **Firebase Functions** (Node.js 20) for serverless backend
- **Cloud Firestore** for user data and design history
- **Firebase Storage** for image storage
- **Firebase Auth** for secure authentication

### AI Integration
- **OpenRouter API** with Google Gemini 2.0 Flash model
- Server-side API calls for security
- Client-side caching for performance

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account ([Get started](https://firebase.google.com/))
- OpenRouter API key ([Get API key](https://openrouter.ai/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ronak-IIITD/ai-room-designer.git
   cd ai-room-designer
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install
   
   # Install Firebase Functions dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Firebase credentials:

   ```env
   # Firebase Configuration (get from Firebase Console)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   **Note:** The OpenRouter API key should be set in Firebase Functions config (see deployment guide), NOT in the client .env file.

4. **Configure Firebase**

   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase (select Functions, Firestore, Storage, Hosting)
   firebase init
   ```

   In Firebase Console:
   - Enable Authentication → Google and Email/Password sign-in methods
   - Create Cloud Firestore database
   - Enable Cloud Storage

5. **Set OpenRouter API key for Functions**

   ```bash
   firebase functions:config:set openrouter.apikey="YOUR_OPENROUTER_API_KEY"
   ```

6. **Deploy Firebase Security Rules and Functions**

   ```bash
   # Deploy Firestore and Storage security rules
   firebase deploy --only firestore:rules,storage:rules
   
   # Build and deploy Functions
   cd functions
   npm run build
   cd ..
   firebase deploy --only functions
   ```

7. **Run development server**

   ```bash
   # Start Firebase Emulators (optional but recommended for local dev)
   firebase emulators:start
   
   # In a separate terminal, start frontend dev server
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Type check without emitting
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Firebase Hosting

```bash
# Build the frontend
npm run build

# Deploy everything
firebase deploy
```

## 📁 Project Structure

```
.
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Footer component
│   │   ├── AuthModal.tsx   # Authentication modal
│   │   ├── ImageUploader.tsx # File upload component
│   │   ├── LandingPage.tsx # Landing page
│   │   └── ResultDisplay.tsx # Result display
│   ├── context/
│   │   └── AuthContext.tsx # Firebase auth context
│   ├── services/
│   │   ├── firebase.ts     # Firebase initialization
│   │   ├── geminiServices.tsx # AI service (calls Functions)
│   │   └── userData.ts     # Firestore data operations
│   ├── utils/
│   │   ├── apiUtils.ts     # API utilities (retry, caching)
│   │   ├── fileUtils.ts    # File handling
│   │   └── analytics.ts    # Analytics tracking
│   ├── App.tsx             # Main app component
│   └── main.tsx           # Entry point
├── functions/              # Firebase Functions (backend)
│   ├── src/
│   │   └── index.ts       # Cloud Functions
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
├── firebase.json          # Firebase configuration
├── .env.example           # Environment template
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
└── package.json

```

## 🎨 Usage

1. **Sign In** - Use Google Sign-In or create an account with email/password
2. **Upload Photo** - Click or drag & drop a room photo (max 10MB)
3. **Describe Vision** - Type your design preferences or select a preset style
4. **Generate** - Click "Generate Design" and wait for AI suggestions
5. **Review** - View detailed design recommendations and suggestions
6. **Save** - Your design history is automatically saved to your account

## 🔒 Security Features

✅ **Firebase Security Rules** - Firestore and Storage protected with user-level access control
✅ **Server-Side API Calls** - All AI API calls handled by Firebase Functions (API keys never exposed)
✅ **Rate Limiting** - 10 requests per user per day (configurable)
✅ **Input Validation** - Server-side input sanitization and validation
✅ **Authentication Required** - All features require user authentication
✅ **HTTPS Only** - All traffic encrypted via Firebase Hosting

## 🐛 Known Limitations

- **Text-Based Suggestions**: Currently provides design suggestions as text. Integration with actual image generation APIs (Stability AI, DALL-E) is planned.
- **Rate Limits**: Free tier has 10 requests per user per day
- **File Size**: Max 10MB per image upload

## 📈 Future Improvements

- [ ] Integrate actual image generation (Stability AI, DALL-E)
- [ ] Add comprehensive test coverage (Vitest, React Testing Library)
- [ ] Refactor large components
- [ ] Add Sentry for error tracking
- [ ] Implement PWA features for offline support
- [ ] Add more AI model options
- [ ] Social sharing features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ronak Anand**
- GitHub: [@Ronak-IIITD](https://github.com/Ronak-IIITD)

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [Firebase](https://firebase.google.com/) for backend infrastructure
- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling
- [React](https://react.dev/) community

---

<div align="center">
  Made with ❤️ by Ronak Anand
  <br />
  <br />
  ⭐ Star this repo if you find it helpful!
</div>
