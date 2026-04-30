import fc from 'fast-check';
import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setBirthData } from '../../redux/slices/userSlice';
import uiReducer, { setSelectedZodiac } from '../../redux/slices/uiSlice';
import kundaliReducer from '../../redux/slices/kundaliSlice';
import horoscopeReducer from '../../redux/slices/horoscopeSlice';

/**
 * Property-Based Tests for Redux State Management
 * Feature: premium-astrology-app
 * Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5
 */

describe('Feature: premium-astrology-app, Property 37: Redux Birth Data Management', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
        ui: uiReducer,
        kundali: kundaliReducer,
        horoscope: horoscopeReducer,
      },
    });
  });

  it('should store valid birth data in Redux state', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.date({ max: new Date() }),
          fc.tuple(
            fc.integer({ min: 0, max: 23 }),
            fc.integer({ min: 0, max: 59 })
          ),
          fc.string({ minLength: 2 })
        ),
        ([date, [hours, minutes], place]) => {
          const dateString = date.toISOString().split('T')[0];
          const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

          store.dispatch(
            setBirthData({
              dateOfBirth: dateString,
              timeOfBirth: timeString,
              placeOfBirth: place,
            })
          );

          const state = store.getState();
          expect(state.user.userData?.dateOfBirth).toBe(dateString);
          expect(state.user.userData?.timeOfBirth).toBe(timeString);
          expect(state.user.userData?.placeOfBirth).toBe(place);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should retrieve stored birth data from Redux state', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.date({ max: new Date() }),
          fc.tuple(
            fc.integer({ min: 0, max: 23 }),
            fc.integer({ min: 0, max: 59 })
          ),
          fc.string({ minLength: 2 })
        ),
        ([date, [hours, minutes], place]) => {
          const dateString = date.toISOString().split('T')[0];
          const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

          store.dispatch(
            setBirthData({
              dateOfBirth: dateString,
              timeOfBirth: timeString,
              placeOfBirth: place,
            })
          );

          const state = store.getState();
          const userData = state.user.userData;

          expect(userData).not.toBeNull();
          expect(userData?.dateOfBirth).toBe(dateString);
          expect(userData?.timeOfBirth).toBe(timeString);
          expect(userData?.placeOfBirth).toBe(place);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should update birth data when new data is dispatched', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.date({ max: new Date() }),
          fc.date({ max: new Date() })
        ),
        ([date1, date2]) => {
          const dateString1 = date1.toISOString().split('T')[0];
          const dateString2 = date2.toISOString().split('T')[0];

          // First dispatch
          store.dispatch(
            setBirthData({
              dateOfBirth: dateString1,
              timeOfBirth: '12:00',
              placeOfBirth: 'City1',
            })
          );

          let state = store.getState();
          expect(state.user.userData?.dateOfBirth).toBe(dateString1);

          // Second dispatch should update
          store.dispatch(
            setBirthData({
              dateOfBirth: dateString2,
              timeOfBirth: '14:30',
              placeOfBirth: 'City2',
            })
          );

          state = store.getState();
          expect(state.user.userData?.dateOfBirth).toBe(dateString2);
          expect(state.user.userData?.timeOfBirth).toBe('14:30');
          expect(state.user.userData?.placeOfBirth).toBe('City2');
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: premium-astrology-app, Property 38: Redux Zodiac Selection Management', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
        ui: uiReducer,
        kundali: kundaliReducer,
        horoscope: horoscopeReducer,
      },
    });
  });

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  it('should store selected zodiac sign in Redux state', () => {
    fc.assert(
      fc.property(
        fc.sample(fc.constantFrom(...zodiacSigns), 1)[0],
        (zodiacSign) => {
          store.dispatch(setSelectedZodiac(zodiacSign));

          const state = store.getState();
          expect(state.ui.selectedZodiac).toBe(zodiacSign);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should update zodiac selection when new sign is selected', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom(...zodiacSigns),
          fc.constantFrom(...zodiacSigns)
        ),
        ([sign1, sign2]) => {
          // First selection
          store.dispatch(setSelectedZodiac(sign1));
          let state = store.getState();
          expect(state.ui.selectedZodiac).toBe(sign1);

          // Second selection should update
          store.dispatch(setSelectedZodiac(sign2));
          state = store.getState();
          expect(state.ui.selectedZodiac).toBe(sign2);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: premium-astrology-app, Property 40: Redux Component Update Propagation', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
        ui: uiReducer,
        kundali: kundaliReducer,
        horoscope: horoscopeReducer,
      },
    });
  });

  it('should propagate state changes to all subscribers', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.date({ max: new Date() }),
          fc.tuple(
            fc.integer({ min: 0, max: 23 }),
            fc.integer({ min: 0, max: 59 })
          ),
          fc.string({ minLength: 2 })
        ),
        ([date, [hours, minutes], place]) => {
          const dateString = date.toISOString().split('T')[0];
          const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

          let stateChanges = 0;
          const unsubscribe = store.subscribe(() => {
            stateChanges++;
          });

          store.dispatch(
            setBirthData({
              dateOfBirth: dateString,
              timeOfBirth: timeString,
              placeOfBirth: place,
            })
          );

          expect(stateChanges).toBeGreaterThan(0);
          unsubscribe();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain state consistency across multiple dispatches', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.date({ max: new Date() }),
            fc.string({ minLength: 2 })
          ),
          { minLength: 1, maxLength: 10 }
        ),
        (dataArray) => {
          dataArray.forEach(([date, place]) => {
            const dateString = date.toISOString().split('T')[0];
            store.dispatch(
              setBirthData({
                dateOfBirth: dateString,
                timeOfBirth: '12:00',
                placeOfBirth: place,
              })
            );
          });

          const state = store.getState();
          const lastData = dataArray[dataArray.length - 1];
          const lastDateString = lastData[0].toISOString().split('T')[0];
          const lastPlace = lastData[1];

          expect(state.user.userData?.dateOfBirth).toBe(lastDateString);
          expect(state.user.userData?.placeOfBirth).toBe(lastPlace);
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Feature: premium-astrology-app, Property 41: Redux LocalStorage Hydration', () => {
  it('should initialize with empty state when localStorage is empty', () => {
    const store = configureStore({
      reducer: {
        user: userReducer,
        ui: uiReducer,
        kundali: kundaliReducer,
        horoscope: horoscopeReducer,
      },
    });

    const state = store.getState();
    expect(state.user.userData).toBeNull();
  });

  it('should maintain state structure across store creation', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.date({ max: new Date() }),
          fc.string({ minLength: 2 })
        ),
        ([date, place]) => {
          const store = configureStore({
            reducer: {
              user: userReducer,
              ui: uiReducer,
              kundali: kundaliReducer,
              horoscope: horoscopeReducer,
            },
          });

          const dateString = date.toISOString().split('T')[0];
          store.dispatch(
            setBirthData({
              dateOfBirth: dateString,
              timeOfBirth: '12:00',
              placeOfBirth: place,
            })
          );

          const state = store.getState();
          expect(state).toHaveProperty('user');
          expect(state).toHaveProperty('ui');
          expect(state).toHaveProperty('kundali');
          expect(state).toHaveProperty('horoscope');
        }
      ),
      { numRuns: 50 }
    );
  });
});
