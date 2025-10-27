#!/bin/bash

# ================================
# Firebase Setup Helper Script
# ================================
# This script helps you configure your .env file with Firebase credentials
# Run: bash setup-firebase.sh

echo "================================"
echo "🔥 Firebase Setup Helper"
echo "================================"
echo ""
echo "This script will help you configure your Firebase credentials."
echo "Make sure you have:"
echo "  1. Created a Firebase project at https://console.firebase.google.com"
echo "  2. Enabled Google Sign-In and Email/Password authentication"
echo "  3. Set up Firestore Database"
echo "  4. Set up Storage"
echo ""
echo "See FIREBASE_SETUP_GUIDE.md for detailed instructions."
echo ""
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env file from template..."
    cat > .env << 'EOF'
# Google Gemini AI API Key
VITE_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdefghijklmnopqrstuvwxyz
EOF
    echo "✅ .env file created!"
    echo ""
fi

echo "Current .env configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat .env | grep -v "^#" | grep -v "^$"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for placeholder values
PLACEHOLDER_COUNT=$(grep -c "your_" .env)

if [ $PLACEHOLDER_COUNT -gt 0 ]; then
    echo "⚠️  Found $PLACEHOLDER_COUNT placeholder values in .env"
    echo ""
    echo "You need to replace these placeholders with your actual Firebase credentials."
    echo ""
    echo "📖 Follow these steps:"
    echo ""
    echo "1️⃣  Open Firebase Console:"
    echo "    → https://console.firebase.google.com"
    echo ""
    echo "2️⃣  Select your project (or create a new one)"
    echo ""
    echo "3️⃣  Get your Firebase config:"
    echo "    → Click ⚙️  (Settings) → Project settings"
    echo "    → Scroll to 'Your apps' section"
    echo "    → Click </> (Web icon) or view existing app"
    echo "    → Copy the firebaseConfig values"
    echo ""
    echo "4️⃣  Get your Gemini API key:"
    echo "    → https://aistudio.google.com/app/apikey"
    echo "    → Click 'Create API Key'"
    echo "    → Copy the key"
    echo ""
    echo "5️⃣  Edit the .env file:"
    echo "    → nano .env"
    echo "    OR"
    echo "    → code .env (if using VS Code)"
    echo ""
    echo "6️⃣  Replace ALL placeholder values with your actual credentials"
    echo ""
    echo "7️⃣  Save the file and restart the dev server:"
    echo "    → Press Ctrl+C to stop the server"
    echo "    → Run: npm run dev"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📚 For detailed instructions, read:"
    echo "   → FIREBASE_SETUP_GUIDE.md"
    echo ""
else
    echo "✅ No placeholder values found!"
    echo ""
    echo "Your .env appears to be configured."
    echo "If authentication still doesn't work:"
    echo ""
    echo "1. Verify the values are correct in Firebase Console"
    echo "2. Check that authentication methods are enabled:"
    echo "   → Firebase Console → Authentication → Sign-in method"
    echo "   → Enable 'Google' and 'Email/Password'"
    echo ""
    echo "3. Restart your development server:"
    echo "   → Press Ctrl+C"
    echo "   → Run: npm run dev"
    echo ""
fi

echo "================================"
echo ""

# Offer to open .env file
read -p "Would you like to edit the .env file now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        echo "Opening in VS Code..."
        code .env
    elif command -v nano &> /dev/null; then
        echo "Opening in nano..."
        nano .env
    elif command -v vim &> /dev/null; then
        echo "Opening in vim..."
        vim .env
    else
        echo "No suitable editor found. Please edit .env manually."
    fi
else
    echo "You can edit .env later with: code .env or nano .env"
fi

echo ""
echo "================================"
echo "🎉 Setup complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Firebase credentials"
echo "2. Restart dev server: npm run dev"
echo "3. Test authentication at http://localhost:3000"
echo ""
