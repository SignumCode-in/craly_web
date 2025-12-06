# Craly - AI Tools Directory & Discovery Platform

A comprehensive web application for discovering and managing AI tools, built with React, Firebase, and Tailwind CSS.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion
- **Backend/Database:** Firebase v9 (Authentication & Firestore)
- **Routing:** React Router DOM
- **Icons:** Lucide-React
- **Fonts:** Inter (Google Fonts)

## Features

### Public Landing Page
- Hero section with animated logo
- Problem/Solution sections
- Features showcase
- AI Packs (Workflows) section
- Mobile app preview
- Download section
- FAQ accordion
- Footer

### Admin Portal
- Firebase Email/Password authentication
- Protected routes
- Dashboard with statistics
- **Tools Manager:** Full CRUD for AI tools
- **Categories Manager:** Full CRUD for categories
- **Workflows Manager:** Full CRUD for AI Packs with dynamic journey steps
- **Posts Manager:** Full CRUD for blog posts

## Getting Started

### Prerequisites

- Node.js 24+ (use `nvm use 24` before running commands)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin portal components
│   │   ├── Sidebar.jsx
│   │   ├── DashboardHome.jsx
│   │   ├── ToolsManager.jsx
│   │   ├── CategoriesManager.jsx
│   │   ├── WorkflowsManager.jsx
│   │   └── PostsManager.jsx
│   ├── landing/        # Landing page components
│   │   ├── Hero.jsx
│   │   ├── ProblemSection.jsx
│   │   ├── SolutionSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── AIPacksSection.jsx
│   │   ├── MobilePreview.jsx
│   │   ├── DownloadSection.jsx
│   │   ├── FAQSection.jsx
│   │   └── Footer.jsx
│   └── ProtectedRoute.jsx
├── firebase/
│   └── config.js       # Firebase configuration
├── pages/
│   ├── LandingPage.jsx
│   └── admin/
│       ├── AdminAuth.jsx
│       └── AdminDashboard.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Firebase Setup

The Firebase configuration is already set up in `src/firebase/config.js` with:
- Project ID: `craly-ai`
- Authentication enabled
- Firestore database
- Storage bucket

### Firestore Collections

1. **tools** - AI tools directory
2. **categories** - Tool categories
3. **workflows** - AI Packs/Workflows
4. **posts** - Blog posts

## Routes

- `/` - Public landing page
- `/admin/auth` - Admin authentication
- `/admin` - Admin dashboard (protected)

## Data Schemas

### Tools
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "shortDescription": "string",
  "longDescription": "string",
  "url": "string",
  "logoUrl": "string",
  "pricing": "Freemium|Paid|Free",
  "tags": ["array"],
  "isTrending": boolean,
  "likesCount": number
}
```

### Categories
```json
{
  "id": "string",
  "name": "string",
  "iconName": "string",
  "toolCount": number,
  "description": "string"
}
```

### Workflows (AI Packs)
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "iconName": "string",
  "duration": "string",
  "steps": number,
  "journey": [
    {
      "title": "string",
      "description": "string",
      "toolId": "string"
    }
  ]
}
```

### Posts
```json
{
  "postId": "string",
  "title": "string",
  "body": "string",
  "tool": {
    "toolId": "string",
    "categoryId": "string"
  },
  "imageUrl": "string",
  "tags": ["array"],
  "likes": number,
  "timestamp": number
}
```

## Design System

- **Background:** Dark (#0F0F0F)
- **Primary Color:** Blue (#4A90E2)
- **Accent:** Purple (#A66BFF)
- **Text:** White (#FFFFFF) and Soft Grey (#B8B8B8)

## License

© 2025 Craly Technologies. All rights reserved.
