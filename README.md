# Kairoo - Social Intelligence for Everyone

**Kairoo** is a privacy-first web application designed to help people navigate social messages with confidence. Built specifically for neurodivergent individuals, those dealing with social anxiety, or anyone who finds social communication challenging.

## 🌟 What Kairoo Does

- **Analyze Message Tone**: Get insights into emotional warmth, manipulation risk, and passive-aggressiveness
- **Suggest Responses**: Receive personalized reply suggestions in Direct, Diplomatic, and Assertive tones
- **Build Confidence**: Learn to recognize patterns and trust your instincts in social situations
- **Reality Check**: Understand whether you're overthinking normal interactions or if concerns are valid

## 🛡️ Privacy-First Design

- **Optional Authentication**: Use anonymously or create an account for personalized experience
- **No Message Storage**: All content is analyzed and immediately discarded
- **Secure User Data**: User profiles stored securely with Firebase
- **Secure Processing**: All analysis happens through encrypted connections

## 🎯 Our Mission

We believe social intelligence tools should be accessible to everyone. Kairoo is completely free to use because we're not here to monetize struggles or profit from difficult moments. This is about care, understanding, and empathy—not commerce.

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Authentication**: Firebase Auth with email/password and Google OAuth
- **Database**: Firestore for user profiles and preferences
- **AI Integration**: OpenAI GPT-4 for intelligent message analysis
- **Architecture**: Pages Router with API routes
- **Deployment**: Optimized for Vercel

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ and npm 8+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Firebase project ([Create one here](https://console.firebase.google.com/))

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kyroo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env.local file with your API keys
   # See FIREBASE_SETUP.md for Firebase configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Add Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your API key
   - Add Firebase configuration variables (see FIREBASE_SETUP.md)
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-project-name.vercel.app`

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
kyroo/
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── UserProfile.tsx    # User profile management
│   │   └── dashboard/         # Dashboard components
│   ├── contexts/
│   │   └── AuthContext.tsx    # Firebase authentication context
│   ├── lib/
│   │   └── firebase.ts        # Firebase configuration
│   ├── pages/
│   │   ├── index.tsx          # Landing page with authentication
│   │   ├── signup.tsx         # User registration page
│   │   ├── login.tsx          # User login page
│   │   ├── forgot-password.tsx # Password reset page
│   │   ├── dashboard.tsx      # Protected dashboard
│   │   ├── app.tsx            # Main application with message analysis
│   │   ├── _app.tsx           # Next.js app wrapper with AuthProvider
│   │   ├── _document.tsx      # Custom document
│   │   └── api/
│   │       ├── analyze.ts     # OpenAI integration for message analysis
│   │       └── logEvent.ts    # Privacy-safe anonymous logging
│   └── styles/
│       └── globals.css        # Global styles with Tailwind
├── public/                    # Static assets
├── vercel.json               # Vercel deployment configuration
├── FIREBASE_SETUP.md         # Firebase setup instructions
└── SETUP.md                  # OpenAI API setup instructions
```

## 🎨 Features

### Authentication System
- **Email/Password Registration**: Secure account creation with validation
- **Google OAuth Integration**: One-click sign-in with Google
- **Password Reset**: Secure password recovery via email
- **User Profile Management**: Edit display name and view account details
- **Protected Routes**: Secure access to dashboard and user-specific features
- **Session Persistence**: Automatic login state management

### Landing Page
- **Warm, Supportive Messaging**: Designed for people in vulnerable situations
- **Clear Value Proposition**: Explains how Kairoo helps with social navigation
- **Privacy Assurance**: Detailed explanation of privacy protections
- **Mission Statement**: Care-focused, not profit-driven approach
- **Authentication Integration**: Seamless sign-up and sign-in flow

### Main Application
- **Message Analysis**: Real-time AI-powered analysis using GPT-4
- **Three Analysis Metrics**: 
  - Emotional Warmth (0-100)
  - Manipulation Risk (0-100) 
  - Passive-Aggressiveness (0-100)
- **Response Suggestions**: Three different communication styles
- **Always-Visible Preview**: Shows what analysis will look like before use
- **Settings Page**: Placeholder for future customization options

### Technical Features
- **Production-Ready**: Optimized build with proper error handling
- **TypeScript**: Full type safety for reliable development
- **Responsive Design**: Works seamlessly on all device sizes
- **Accessibility**: Built with inclusive design principles

## 🔧 API Configuration

The app requires an OpenAI API key to function. See `SETUP.md` for detailed configuration instructions.

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key (required)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain (required)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID (required)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket (required)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID (required)
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID (required)

See `FIREBASE_SETUP.md` for detailed Firebase configuration instructions.

## 🤝 Contributing

We welcome contributions that align with our mission of making social communication tools accessible and supportive. Please ensure any changes maintain the app's privacy-first, care-focused approach.

## 📄 License

This project is built with the intention of helping people navigate social situations with dignity and confidence. Please use responsibly and in alignment with our mission of accessibility and care.

---

**Built with care for anyone who finds social communication challenging.**
*Free to use, private by design.*
