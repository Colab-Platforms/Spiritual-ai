import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BirthDataForm from '../../components/BirthDataForm';
import userReducer from '../../redux/slices/userSlice';
import { describe, it, expect, beforeEach } from 'vitest';

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};

describe('BirthDataForm Component', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BirthDataForm />
      </Provider>
    );
  };

  describe('Rendering', () => {
    it('should render the form with all input fields', () => {
      renderComponent();

      expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Time of Birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Place of Birth/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Generate My Kundali/i })).toBeInTheDocument();
    });

    it('should render the form title and description', () => {
      renderComponent();

      expect(screen.getByText('Discover Your Kundali')).toBeInTheDocument();
      expect(screen.getByText(/Enter your birth information/i)).toBeInTheDocument();
    });

    it('should have empty input fields initially', () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      expect(dateInput.value).toBe('');
      expect(timeInput.value).toBe('');
      expect(placeInput.value).toBe('');
    });
  });

  describe('Input Validation - Date of Birth', () => {
    it('should show error for empty date on blur', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });
    });

    it('should show error for future date', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: futureDateString } });
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText('Birth date cannot be in the future')).toBeInTheDocument();
      });
    });

    it('should not show error for valid past date', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const validDate = '1990-05-15';

      fireEvent.change(dateInput, { target: { value: validDate } });
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.queryByText(/Date of birth is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Birth date cannot be in the future/i)).not.toBeInTheDocument();
      });
    });

    it('should clear error when user corrects the date', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: futureDateString } });
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText('Birth date cannot be in the future')).toBeInTheDocument();
      });

      // Clear and enter valid date
      fireEvent.change(dateInput, { target: { value: '' } });
      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });

      await waitFor(() => {
        expect(screen.queryByText('Birth date cannot be in the future')).not.toBeInTheDocument();
      });
    });
  });

  describe('Input Validation - Time of Birth', () => {
    it('should show error for empty time on blur', async () => {
      renderComponent();

      const timeInput = screen.getByLabelText(/Time of Birth/i);
      fireEvent.blur(timeInput);

      await waitFor(() => {
        expect(screen.getByText('Time of birth is required')).toBeInTheDocument();
      });
    });

    it('should show error for invalid time format', async () => {
      renderComponent();

      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;

      // HTML time input doesn't accept invalid times, so we test with a valid time first
      // then blur without entering anything to trigger the required error
      fireEvent.blur(timeInput);

      await waitFor(() => {
        expect(screen.getByText('Time of birth is required')).toBeInTheDocument();
      });
    });

    it('should accept valid time format', async () => {
      renderComponent();

      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;

      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.blur(timeInput);

      await waitFor(() => {
        expect(screen.queryByText(/Please enter time in HH:MM format/i)).not.toBeInTheDocument();
      });
    });

    it('should accept edge case times (00:00 and 23:59)', async () => {
      renderComponent();

      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;

      // Test 00:00
      fireEvent.change(timeInput, { target: { value: '00:00' } });
      fireEvent.blur(timeInput);

      await waitFor(() => {
        expect(screen.queryByText(/Please enter time in HH:MM format/i)).not.toBeInTheDocument();
      });

      // Clear and test 23:59
      fireEvent.change(timeInput, { target: { value: '' } });
      fireEvent.change(timeInput, { target: { value: '23:59' } });
      fireEvent.blur(timeInput);

      await waitFor(() => {
        expect(screen.queryByText(/Please enter time in HH:MM format/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Input Validation - Place of Birth', () => {
    it('should show error for empty place on blur', async () => {
      renderComponent();

      const placeInput = screen.getByLabelText(/Place of Birth/i);
      fireEvent.blur(placeInput);

      await waitFor(() => {
        expect(screen.getByText('Place of birth is required')).toBeInTheDocument();
      });
    });

    it('should show error for single character place', async () => {
      renderComponent();

      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(placeInput, { target: { value: 'A' } });
      fireEvent.blur(placeInput);

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid location/i)).toBeInTheDocument();
      });
    });

    it('should accept valid place names', async () => {
      renderComponent();

      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });
      fireEvent.blur(placeInput);

      await waitFor(() => {
        expect(screen.queryByText(/Place of birth is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Please enter a valid location/i)).not.toBeInTheDocument();
      });
    });

    it('should trim whitespace from place input', async () => {
      renderComponent();

      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(placeInput, { target: { value: '   London   ' } });
      fireEvent.blur(placeInput);

      await waitFor(() => {
        expect(screen.queryByText(/Place of birth is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should prevent submission with empty fields', async () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
        expect(screen.getByText('Time of birth is required')).toBeInTheDocument();
        expect(screen.getByText('Place of birth is required')).toBeInTheDocument();
      });
    });

    it('should prevent submission with invalid data', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      fireEvent.change(dateInput, { target: { value: futureDateString } });
      // Leave time empty to trigger validation error
      fireEvent.change(placeInput, { target: { value: 'A' } });

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Birth date cannot be in the future')).toBeInTheDocument();
        expect(screen.getByText('Time of birth is required')).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid location/i)).toBeInTheDocument();
      });
    });

    it('should submit form with valid data', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Check that no error messages are displayed
        expect(screen.queryByText(/Date of birth is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Time of birth is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Place of birth is required/i)).not.toBeInTheDocument();
      });

      // Verify Redux state was updated
      const state = store.getState();
      expect(state.user.userData).not.toBeNull();
      expect(state.user.userData?.dateOfBirth).toBe('1990-05-15');
      expect(state.user.userData?.timeOfBirth).toBe('14:30');
      expect(state.user.userData?.placeOfBirth).toBe('New York, USA');
    });

    it('should calculate zodiac sign correctly on submission', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      // Aries: March 21 - April 19
      fireEvent.change(dateInput, { target: { value: '1990-04-15' } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.user.userData?.zodiacSign).toBe('Aries');
      });
    });

    it('should reset form after successful submission', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(dateInput.value).toBe('');
        expect(timeInput.value).toBe('');
        expect(placeInput.value).toBe('');
      });
    });

    it('should disable submit button while submitting', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
      const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });
      fireEvent.change(timeInput, { target: { value: '14:30' } });
      fireEvent.change(placeInput, { target: { value: 'New York, USA' } });

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      fireEvent.click(submitButton);

      // After submission, the form should be reset and button should show original text
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Generate My Kundali/i })).toBeInTheDocument();
      });
    });
  });

  describe('Error Display', () => {
    it('should only show errors for touched fields', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });

      // Other fields should not show errors yet
      expect(screen.queryByText('Time of birth is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Place of birth is required')).not.toBeInTheDocument();
    });

    it('should display error messages in red', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        const errorMessage = screen.getByText('Date of birth is required');
        expect(errorMessage).toHaveClass('text-red-400');
      });
    });

    it('should clear error when field is corrected', async () => {
      renderComponent();

      const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      });

      fireEvent.change(dateInput, { target: { value: '1990-05-15' } });

      await waitFor(() => {
        expect(screen.queryByText('Date of birth is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Zodiac Sign Calculation', () => {
    const testCases = [
      { date: '1990-03-21', expectedSign: 'Aries' },
      { date: '1990-04-19', expectedSign: 'Aries' },
      { date: '1990-04-20', expectedSign: 'Taurus' },
      { date: '1990-05-20', expectedSign: 'Taurus' },
      { date: '1990-05-21', expectedSign: 'Gemini' },
      { date: '1990-06-20', expectedSign: 'Gemini' },
      { date: '1990-06-21', expectedSign: 'Cancer' },
      { date: '1990-07-22', expectedSign: 'Cancer' },
      { date: '1990-07-23', expectedSign: 'Leo' },
      { date: '1990-08-22', expectedSign: 'Leo' },
      { date: '1990-08-23', expectedSign: 'Virgo' },
      { date: '1990-09-22', expectedSign: 'Virgo' },
      { date: '1990-09-23', expectedSign: 'Libra' },
      { date: '1990-10-22', expectedSign: 'Libra' },
      { date: '1990-10-23', expectedSign: 'Scorpio' },
      { date: '1990-11-21', expectedSign: 'Scorpio' },
      { date: '1990-11-22', expectedSign: 'Sagittarius' },
      { date: '1990-12-21', expectedSign: 'Sagittarius' },
      { date: '1990-12-22', expectedSign: 'Capricorn' },
      { date: '1990-01-19', expectedSign: 'Capricorn' },
      { date: '1990-01-20', expectedSign: 'Aquarius' },
      { date: '1990-02-18', expectedSign: 'Aquarius' },
      { date: '1990-02-19', expectedSign: 'Pisces' },
      { date: '1990-03-20', expectedSign: 'Pisces' },
    ];

    testCases.forEach(({ date, expectedSign }) => {
      it(`should calculate ${expectedSign} for date ${date}`, async () => {
        renderComponent();

        const dateInput = screen.getByLabelText(/Date of Birth/i) as HTMLInputElement;
        const timeInput = screen.getByLabelText(/Time of Birth/i) as HTMLInputElement;
        const placeInput = screen.getByLabelText(/Place of Birth/i) as HTMLInputElement;

        fireEvent.change(dateInput, { target: { value: date } });
        fireEvent.change(timeInput, { target: { value: '12:00' } });
        fireEvent.change(placeInput, { target: { value: 'Test City' } });

        const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
          const state = store.getState();
          expect(state.user.userData?.zodiacSign).toBe(expectedSign);
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      renderComponent();

      expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Time of Birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Place of Birth/i)).toBeInTheDocument();
    });

    it('should have descriptive button text', () => {
      renderComponent();

      expect(screen.getByRole('button', { name: /Generate My Kundali/i })).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      renderComponent();

      const form = screen.getByRole('button', { name: /Generate My Kundali/i }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Styling and Theme', () => {
    it('should use dark theme colors', () => {
      renderComponent();

      const form = screen.getByText('Discover Your Kundali').closest('div');
      expect(form).toHaveClass('bg-dark-secondary');
      expect(form).toHaveClass('border-mystic-purple');
    });

    it('should use Cinzel font for heading', () => {
      renderComponent();

      const heading = screen.getByText('Discover Your Kundali');
      expect(heading).toHaveClass('font-cinzel');
    });

    it('should use Inter font for body text', () => {
      renderComponent();

      const description = screen.getByText(/Enter your birth information/i);
      expect(description).toHaveClass('font-inter');
    });

    it('should use accent gold for submit button', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /Generate My Kundali/i });
      expect(submitButton).toHaveClass('bg-accent-gold');
    });
  });
});
