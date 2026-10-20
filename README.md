# EdJohn Mobile App

EdJohn is a React Native mobile application built with Expo for student onboarding, authentication, course registration, academic access, and a general student dashboard experience.

## Overview

This app is designed around a student-facing workflow, including:

- login and sign-up flows
- forgot password flow
- dashboard landing screen
- course registration module
- profile and schedule screens
- integration with external backend APIs
- Expo-based mobile development for Android, iOS, and web

## Tech Stack

- React Native
- Expo SDK / Expo Router
- JavaScript and TypeScript support
- NativeWind
- React Navigation
- Axios for API calls
- AsyncStorage for local persistence
- React Native Toast for notifications
- Expo Linear Gradient and custom UI styling
- AppWrite support for document storage/search tracking

## Project Structure

```bash
.
├── app/
│   ├── (tabs)/
│   │   ├── _layout.jsx
│   │   ├── courses.jsx
│   │   ├── index.jsx
│   │   ├── profile.jsx
│   │   └── schedule.jsx
│   ├── auth/
│   │   ├── ForgotPassword.jsx
│   │   ├── login.jsx
│   │   └── signup.jsx
│   ├── courses/
│   │   └── CourseRegistration.jsx
│   ├── +not-found.tsx
│   ├── _layout.tsx
│   └── global.css
├── assets/
│   ├── fonts/
│   ├── images/
│   ├── avatar.png
│   ├── logo.png
│   └── solo.jpg
├── components/
│   ├── __tests__/
│   ├── ui/
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── HapticTab.tsx
│   ├── HelloWave.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── context/
│   └── AuthContext.js
├── hooks/
│   ├── useAuth.js
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── services/
│   ├── config/
│   │   └── edjohnConfig.ts
│   ├── api.ts
│   └── appwrite.ts
├── .eas/
├── .gitignore
├── app.json
├── babel.config.js
├── eas.json
├── installation.txt
├── metro.config.js
├── naivewind-env.d.ts
├── nativewind-env.d.ts
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── LICENSE
```

## Features

### Authentication
- student login screen
- registration / sign-up flow
- forgot-password screen
- secure local session persistence using AsyncStorage

### Student Dashboard
- welcome header with user details
- quick actions and dashboard cards
- course registration access
- schedule and profile navigation

### Academic Management
- course registration screen
- department and course fetching from backend APIs
- semester-specific academic data handling

### API Integration
- backend calls via Axios
- environment-based base URL configuration
- support for AppWrite integration for search tracking

## Prerequisites

- Node.js 18+ or newer
- npm or yarn
- Expo CLI
- Android Studio / Xcode for native running if needed

## Installation

```bash
git clone https://github.com/solomonojox/edjohn_mobile_app.git
cd edjohn_mobile_app
npm install
```

## Environment Variables

This project reads runtime values from environment variables. Create a `.env` file in the project root if needed, for example:

```bash
EXPO_PUBLIC_BASE_URL=https://your-api-base-url
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
```

The app uses these values in:

- `services/config/edjohnConfig.ts`
- `services/appwrite.ts`
- `app/auth/login.jsx`

## Running the App

### Start Metro Bundler

```bash
npm start
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

## Production Build / Expo

This project is configured for Expo and EAS workflows.

```bash
npx expo export
```

Or use EAS build commands:

```bash
npx eas build --platform android
npx eas build --platform ios
```

## Testing

```bash
npm test
```

## Linting

```bash
npx expo lint
```

## Notes

- The app is configured as a mobile-first educational application for students.
- It includes navigation tabs for home, courses, profile, and schedule.
- Local auth state is stored in AsyncStorage and used to restore the session.
- Course-related backend endpoints are expected to be exposed through the configured base URL.

## License

This project currently includes an MIT license in the repository structure, but the repository metadata does not explicitly list a license in the GitHub UI. Please check the repository files or package metadata for the exact licensing status if you intend to redistribute or publish it externally.
