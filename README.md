# HumanizeAI

A production-ready full-stack web application for AI text detection and humanization, powered by DeepSeek v3 through Router API.

## 🚀 Features

- **AI Detector**: Analyze text to determine if it was written by AI with confidence levels and detailed reasoning
- **Text Humanizer**: Transform AI-generated text into natural, human-like content while preserving 97%+ of the original meaning
- **Long Text Support**: Automatic chunking and processing for texts over 2000 words with progress indicators
- **Real-time Progress**: Visual feedback with animated loaders and cancel operations
- **History Tracking**: Save and revisit previous analyses and humanizations
- **Responsive Design**: Beautiful Gen-Z aesthetic with glassmorphism effects that works on all devices
- **Accessibility**: ARIA labels, focus states, and reduced motion support

## 🛠 Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- Framer Motion for animations
- TanStack Query for state management
- shadcn/ui component library
- Wouter for routing

**Backend:**
- Node.js + Express + TypeScript
- Zod for validation
- DeepSeek v3 AI via Router API
- 100MB request size limit for large documents
- 120s timeout per request

## 📋 Prerequisites

- Node.js 18+ installed
- Router API key for DeepSeek v3 access

## 🔧 Installation

**Install dependencies:**
```bash
npm install
```

**Set up environment variables:**

Create a `.env` file in the root directory (or use Replit Secrets):

```env
# Required: Router API credentials
ROUTER_API_KEY=your_router_api_key_here
ROUTER_API_URL=https://your-router-api-url.com/v1/completions

# Optional: Custom port (defaults to 5000)
PORT=5000
```

**Getting API Keys:**
- Contact your Router API provider to obtain `ROUTER_API_KEY` and `ROUTER_API_URL`
- In development mode without an API key, the app will use mock responses for testing

## 🚀 Running Locally

**Development mode:**
```bash
npm run dev
```

This starts both the Express backend and Vite frontend dev server on port 5000. Open `http://localhost:5000` in your browser.

**Production build:**
```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploying to Replit

1. **Import your project to Replit**
2. **Set Secrets:**
   - Go to the "Secrets" tab in Replit
   - Add `ROUTER_API_KEY` with your API key value
   - Add `ROUTER_API_URL` with your Router API endpoint
3. **Click "Run"** - Replit will automatically install dependencies and start the server

### Deploying to Google Cloud / Other Hosting

1. **Build the project:**
```bash
npm run build
```

2. **Set environment variables** on your hosting platform:
   - `ROUTER_API_KEY`
   - `ROUTER_API_URL`
   - `NODE_ENV=production`

3. **Start the server:**
```bash
npm start
```

4. **Configure HTTPS** - Ensure your hosting platform serves the app over HTTPS for security

## 📁 Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── ai-detector.tsx
│   │   │   ├── humanizer.tsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── home.tsx
│   │   │   ├── privacy.tsx
│   │   │   └── not-found.tsx
│   │   ├── lib/             # Utilities and helpers
│   │   └── App.tsx          # Main app component
│   └── index.html
├── server/                   # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route handlers
│   ├── scripts.ts          # AI prompts and scripts
│   └── storage.ts          # In-memory storage interface
├── shared/                  # Shared types and schemas
│   └── schema.ts
└── package.json
```

## 🎨 Features Breakdown

### AI Detector
- Analyzes text for AI-generated probability (0-100%)
- Provides confidence levels: "Very confident", "Maybe", "Not confident"
- Detailed reasoning for the assessment
- Circular progress visualization with animations
- Copy and download results
- Cancel operations anytime

### Text Humanizer
- Humanizes AI-generated text to sound natural
- Supports texts up to 5000+ words with automatic chunking
- Side-by-side comparison view
- Diff highlighting to show changes
- Progress indicator for long texts
- Copy and download humanized text
- Cancel operations anytime

### UI/UX Enhancements
- Gradient background (dark ocean theme: #0f2027 → #203a43 → #2c5364)
- Glassmorphism card effects with backdrop blur
- Smooth Framer Motion animations
- Animated dot loaders during processing
- Cancel button for ongoing operations
- Live word count display
- Reduced motion support for accessibility
- ARIA labels and live regions for screen readers

## 🔒 Privacy & Security

- No permanent storage of user inputs
- All API communications secured via HTTPS
- Text processing is ephemeral - discarded after results are generated
- Optional local storage for session history (clearable by user)
- See [Privacy Policy](/privacy) for details

## 🧪 Development Mode

When `ROUTER_API_KEY` is not configured, the app runs in development mode with mock responses:
- AI Detector returns random probability scores
- Humanizer performs simple text transformations
- Allows testing without API access

## 📝 API Endpoints

- `POST /api/check` - Analyze text for AI detection
- `POST /api/humanize` - Humanize AI-generated text
- `GET /api/health` - Health check endpoint

## 🤝 Contributing

This is a production-ready application. Feel free to customize and extend it for your needs.

## 📄 License

MIT License - feel free to use this project for commercial or personal purposes.

## 📧 Support

For questions or issues, contact: support@humanizeai.io

---

Built with ❤️ using modern web technologies and AI innovation
