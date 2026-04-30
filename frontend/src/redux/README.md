# Redux Store Setup

This directory contains the Redux Toolkit store configuration and slices for the Premium Astrology Web Application.

## Overview

The Redux store manages the following state slices:

- **user**: User birth data and authentication state
- **ui**: UI state (theme, modals, zodiac selection)
- **kundali**: Birth chart data and loading state
- **horoscope**: Horoscope data and loading state

## Store Structure

```
redux/
├── store.ts                    # Redux store configuration
├── hooks.ts                    # Pre-typed Redux hooks
├── index.ts                    # Barrel export file
├── slices/
│   ├── userSlice.ts           # User state and actions
│   ├── uiSlice.ts             # UI state and actions
│   ├── kundaliSlice.ts         # Kundali state and actions
│   └── horoscopeSlice.ts       # Horoscope state and actions
└── middleware/
    └── persistenceMiddleware.ts # localStorage persistence
```

## Usage

### Accessing State

Use the pre-typed `useAppSelector` hook:

```typescript
import { useAppSelector } from '@/redux';

function MyComponent() {
  const userData = useAppSelector((state) => state.user.userData);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  
  return <div>{userData?.zodiacSign}</div>;
}
```

### Dispatching Actions

Use the pre-typed `useAppDispatch` hook:

```typescript
import { useAppDispatch, setUserData } from '@/redux';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const handleSubmit = (data) => {
    dispatch(setUserData(data));
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## State Slices

### User Slice

Manages user birth data and authentication state.

**State:**
```typescript
{
  isAuthenticated: boolean;
  userData: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    zodiacSign: string;
  } | null;
  error: string | null;
}
```

**Actions:**
- `setUserData(userData)` - Set user birth data
- `setAuthenticated(isAuthenticated)` - Set authentication state
- `setUserError(error)` - Set error message
- `clearUserData()` - Clear all user data
- `updateZodiacSign(zodiacSign)` - Update zodiac sign

### UI Slice

Manages UI state including theme, modals, and zodiac selection.

**State:**
```typescript
{
  theme: 'dark';
  modalOpen: boolean;
  selectedZodiac: string | null;
  loading: boolean;
}
```

**Actions:**
- `setModalOpen(isOpen)` - Toggle modal visibility
- `setSelectedZodiac(zodiacSign)` - Set selected zodiac sign
- `setLoading(isLoading)` - Set loading state
- `setTheme(theme)` - Set theme (currently only 'dark')

### Kundali Slice

Manages birth chart data and loading state.

**State:**
```typescript
{
  data: {
    planets: Planet[];
    houses: House[];
    ascendant: string;
    moonSign: string;
  } | null;
  loading: boolean;
  error: string | null;
  animationComplete: boolean;
}
```

**Actions:**
- `setKundaliData(data)` - Set birth chart data
- `setKundaliLoading(isLoading)` - Set loading state
- `setKundaliError(error)` - Set error message
- `setAnimationComplete(isComplete)` - Mark animation as complete
- `clearKundaliData()` - Clear all kundali data

### Horoscope Slice

Manages horoscope data and loading state.

**State:**
```typescript
{
  data: {
    zodiacSign: string;
    date: string;
    timeframe: 'today' | 'tomorrow' | 'weekly';
    content: string;
  } | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setHoroscopeData(data)` - Set horoscope data
- `setHoroscopeLoading(isLoading)` - Set loading state
- `setHoroscopeError(error)` - Set error message
- `clearHoroscopeData()` - Clear all horoscope data

## Persistence Middleware

The Redux store automatically persists the `user` and `ui` slices to localStorage for offline support.

### Features

- **Automatic Persistence**: State is saved to localStorage after every action
- **Hydration**: State is restored from localStorage on app load
- **Error Handling**: Gracefully handles localStorage errors
- **Selective Persistence**: Only persists user and ui slices

### Functions

- `loadPersistedState()` - Load state from localStorage
- `clearPersistedState()` - Clear persisted state from localStorage

### Usage

```typescript
import { clearPersistedState } from '@/redux';

// Clear persisted state on logout
function handleLogout() {
  dispatch(clearUserData());
  clearPersistedState();
}
```

## Testing

All Redux slices and middleware have comprehensive unit tests:

- `src/__tests__/redux/userSlice.test.ts`
- `src/__tests__/redux/uiSlice.test.ts`
- `src/__tests__/redux/kundaliSlice.test.ts`
- `src/__tests__/redux/horoscopeSlice.test.ts`
- `src/__tests__/redux/persistenceMiddleware.test.ts`

Run tests with:
```bash
npm run test:run
```

## Best Practices

1. **Use Pre-typed Hooks**: Always use `useAppDispatch` and `useAppSelector` instead of plain Redux hooks
2. **Import from Index**: Import actions and types from `@/redux` barrel export
3. **Avoid Direct State Mutation**: Redux Toolkit uses Immer, but always use actions
4. **Handle Loading States**: Always set loading state before async operations
5. **Clear Sensitive Data**: Clear user data on logout using `clearUserData()` and `clearPersistedState()`

## Requirements Validation

This Redux setup validates the following requirements:

- **Requirement 14.1**: Redux store manages user birth data
- **Requirement 14.2**: Redux store manages zodiac sign selection
- **Requirement 14.3**: Redux store manages authentication state
- **Requirement 14.4**: Redux state updates propagate to connected components
- **Requirement 14.5**: Redux state hydrates from localStorage on app load
- **Requirement 17.1**: Birth data stored in Redux immediately
- **Requirement 17.2**: Birth data persisted to MongoDB on authentication
- **Requirement 17.3**: Sensitive data cleared on logout
- **Requirement 17.4**: Birth data retrieved from MongoDB on login
- **Requirement 17.5**: Data stored in localStorage for unauthenticated users
