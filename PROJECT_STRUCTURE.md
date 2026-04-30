# Premium Astrology App - Project Directory Structure

## Overview
This document outlines the complete directory structure for the Premium Astrology Web Application (MERN Stack).

## Backend Structure (`backend/src/`)

```
backend/src/
├── config/                 # Configuration files
│   ├── database.ts        # MongoDB connection configuration
│   └── environment.ts     # Environment variables
├── controllers/           # Request handlers for API endpoints
│   └── .gitkeep
├── middleware/            # Express middleware (auth, validation, error handling)
│   └── .gitkeep
├── models/                # Mongoose schemas and database models
│   └── .gitkeep
├── routes/                # API route definitions
│   └── .gitkeep
├── utils/                 # Utility functions and helpers
│   └── .gitkeep
└── index.ts              # Application entry point
```

### Backend Subdirectories

- **config/**: Contains configuration files for database connections and environment variables
- **controllers/**: Business logic for handling API requests and responses
- **middleware/**: Custom Express middleware for authentication, validation, and error handling
- **models/**: Mongoose schemas for User, Kundali, and Horoscope data
- **routes/**: API endpoint definitions (e.g., /api/users, /api/kundali, /api/horoscope)
- **utils/**: Helper functions for validation, date formatting, and other utilities

## Frontend Structure (`frontend/src/`)

```
frontend/src/
├── __tests__/             # Test files
│   ├── hooks/            # Hook tests
│   ├── redux/            # Redux tests
│   └── utils/            # Utility tests
├── components/            # Reusable UI components
│   └── .gitkeep
├── hooks/                 # Custom React hooks
│   ├── index.ts
│   ├── useGSAPAnimation.ts
│   ├── useResponsiveAnimation.ts
│   └── useScrollTrigger.ts
├── pages/                 # Page components (Landing, Kundali, Horoscope)
│   └── .gitkeep
├── redux/                 # Redux state management
│   ├── middleware/
│   │   └── persistenceMiddleware.ts
│   ├── slices/
│   │   ├── horoscopeSlice.ts
│   │   ├── kundaliSlice.ts
│   │   ├── uiSlice.ts
│   │   └── userSlice.ts
│   ├── hooks.ts
│   ├── index.ts
│   ├── store.ts
│   └── README.md
├── styles/                # Global styles and CSS modules
│   └── .gitkeep
├── utils/                 # Utility functions
│   └── gsapConfig.ts
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```

### Frontend Subdirectories

- **__tests__/**: Test files organized by feature (hooks, redux, utils)
- **components/**: Reusable UI components (Hero, Cards, Modal, Button, etc.)
- **hooks/**: Custom React hooks for GSAP animations, scroll detection, and responsive behavior
- **pages/**: Full page components (Landing, Kundali, Horoscope)
- **redux/**: Redux Toolkit store configuration and slices
  - **middleware/**: Custom Redux middleware (persistence)
  - **slices/**: Redux slices for user, UI, kundali, and horoscope state
- **styles/**: Global CSS and Tailwind configuration
- **utils/**: Utility functions (GSAP config, validation, formatting)

## Key Features of the Structure

### Backend Organization
- **Separation of Concerns**: Controllers handle business logic, models define data structure, routes define endpoints
- **Middleware Layer**: Centralized authentication, validation, and error handling
- **Configuration Management**: Environment-specific configuration in dedicated config directory
- **Utilities**: Reusable helper functions for common operations

### Frontend Organization
- **Component-Based**: Modular, reusable components for UI consistency
- **State Management**: Redux Toolkit for centralized state with persistence
- **Custom Hooks**: Reusable logic for animations and responsive behavior
- **Test Organization**: Tests co-located with features for easy maintenance
- **Styling**: Global styles with Tailwind CSS and component-specific styles

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Frontend
- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **Testing**: Vitest with React Testing Library

## Next Steps

1. Implement models in `backend/src/models/`
2. Create controllers in `backend/src/controllers/`
3. Define routes in `backend/src/routes/`
4. Build components in `frontend/src/components/`
5. Create pages in `frontend/src/pages/`
6. Add tests in `frontend/src/__tests__/`

## Notes

- All directories include `.gitkeep` files to ensure they're tracked by Git
- The structure follows MERN best practices for scalability and maintainability
- Redux slices and middleware are already initialized for state management
- Custom hooks for GSAP animations are pre-configured for performance optimization
