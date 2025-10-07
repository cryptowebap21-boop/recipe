# AI Detector & Humanizer

A modern full-stack web application that detects AI-generated text and humanizes content using DeepSeek v3 via Router API. Features a beautiful Gen-Z style UI with glassmorphism design, smooth animations, and responsive layout.

## Features

### 🔍 AI Detector
- Analyze text to determine AI probability (0-100%)
- Confidence level indicator (Very confident/Maybe/Not confident)
- Detailed reasoning breakdown
- Animated circular progress display

### ✨ Text Humanizer  
- Humanize AI-generated text while preserving meaning
- Support for 5000+ word documents
- Side-by-side comparison view
- Diff highlighting to show changes
- Copy and download functionality

### 🎨 Modern UI/UX
- Gen-Z style design with glassmorphism effects
- Gradient backgrounds and neon accents
- Framer Motion animations and micro-interactions
- Responsive design for all devices
- Dark theme optimized

## Tech Stack

**Frontend:**
- React 18 with Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- TanStack Query
- shadcn/ui components

**Backend:**
- Node.js with Express
- TypeScript
- CORS and rate limiting
- 50MB request size limit
- Zod validation

**Integration:**
- DeepSeek v3 via Router API
- Environment-based configuration
- Dev mode with mock responses

## Quick Start

### 1. Installation

```bash
# Clone and install dependencies
npm install
