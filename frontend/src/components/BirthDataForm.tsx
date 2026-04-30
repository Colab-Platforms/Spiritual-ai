import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generateKundali, clearError } from '../redux/slices/kundaliSlice';
import { RootState, AppDispatch } from '../redux/store';

export const BirthDataForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state: RootState) => state.kundali);

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    latitude: 0,
    longitude: 0,
    timezone: 5.5, // IST default
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      if (birthDate > new Date()) {
        errors.dateOfBirth = 'Birth date cannot be in the future';
      }
    }

    if (!formData.timeOfBirth) {
      errors.timeOfBirth = 'Time of birth is required';
    } else {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.timeOfBirth)) {
        errors.timeOfBirth = 'Please enter time in HH:MM format';
      }
    }

    if (!formData.placeOfBirth.trim()) {
      errors.placeOfBirth = 'Place of birth is required';
    }

    if (formData.latitude === 0 && formData.longitude === 0) {
      errors.location = 'Please enter valid latitude and longitude';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(
        generateKundali({
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: formData.timezone,
        })
      );

      if (result.type === generateKundali.fulfilled.type) {
        // Navigate to Kundali page after successful generation
        setTimeout(() => {
          navigate('/kundali');
        }, 500);
      }
    } catch (err) {
      console.error('Error generating Kundali:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' || name === 'timezone' 
        ? parseFloat(value) || 0 
        : value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="dateOfBirth" className="block text-cosmic-text font-poppins font-semibold">
          Date of Birth
        </label>
        <input
          id="dateOfBirth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-cosmic-dark border rounded-lg text-cosmic-text font-inter transition ${
            validationErrors.dateOfBirth
              ? 'border-red-500 focus:border-red-500'
              : 'border-cosmic-orange/30 focus:border-cosmic-orange'
          } focus:outline-none`}
        />
        {validationErrors.dateOfBirth && (
          <p className="text-red-500 text-sm font-inter">{validationErrors.dateOfBirth}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="timeOfBirth" className="block text-cosmic-text font-poppins font-semibold">
          Time of Birth (HH:MM)
        </label>
        <input
          id="timeOfBirth"
          type="time"
          name="timeOfBirth"
          value={formData.timeOfBirth}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-cosmic-dark border rounded-lg text-cosmic-text font-inter transition ${
            validationErrors.timeOfBirth
              ? 'border-red-500 focus:border-red-500'
              : 'border-cosmic-orange/30 focus:border-cosmic-orange'
          } focus:outline-none`}
        />
        {validationErrors.timeOfBirth && (
          <p className="text-red-500 text-sm font-inter">{validationErrors.timeOfBirth}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="placeOfBirth" className="block text-cosmic-text font-poppins font-semibold">
          Place of Birth
        </label>
        <input
          id="placeOfBirth"
          type="text"
          name="placeOfBirth"
          placeholder="City, Country"
          value={formData.placeOfBirth}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-cosmic-dark border rounded-lg text-cosmic-text font-inter placeholder-cosmic-text-muted transition ${
            validationErrors.placeOfBirth
              ? 'border-red-500 focus:border-red-500'
              : 'border-cosmic-orange/30 focus:border-cosmic-orange'
          } focus:outline-none`}
        />
        {validationErrors.placeOfBirth && (
          <p className="text-red-500 text-sm font-inter">{validationErrors.placeOfBirth}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="latitude" className="block text-cosmic-text font-poppins font-semibold text-sm">
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            name="latitude"
            step="0.0001"
            placeholder="e.g., 19.0760"
            value={formData.latitude || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-cosmic-dark border rounded-lg text-cosmic-text font-inter placeholder-cosmic-text-muted transition ${
              validationErrors.location
                ? 'border-red-500 focus:border-red-500'
                : 'border-cosmic-orange/30 focus:border-cosmic-orange'
            } focus:outline-none`}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="longitude" className="block text-cosmic-text font-poppins font-semibold text-sm">
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            name="longitude"
            step="0.0001"
            placeholder="e.g., 72.8777"
            value={formData.longitude || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-cosmic-dark border rounded-lg text-cosmic-text font-inter placeholder-cosmic-text-muted transition ${
              validationErrors.location
                ? 'border-red-500 focus:border-red-500'
                : 'border-cosmic-orange/30 focus:border-cosmic-orange'
            } focus:outline-none`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="timezone" className="block text-cosmic-text font-poppins font-semibold">
          Timezone (UTC offset)
        </label>
        <input
          id="timezone"
          type="number"
          name="timezone"
          step="0.5"
          placeholder="e.g., 5.5 for IST"
          value={formData.timezone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-cosmic-dark border border-cosmic-orange/30 rounded-lg text-cosmic-text font-inter placeholder-cosmic-text-muted focus:border-cosmic-orange focus:outline-none transition"
        />
      </div>

      {validationErrors.location && (
        <p className="text-red-500 text-sm font-inter">{validationErrors.location}</p>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-500 text-sm font-inter">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-500 text-sm font-inter">Kundali generated successfully! Redirecting...</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-cosmic-orange text-cosmic-black font-poppins font-bold rounded-full hover:bg-cosmic-orange-light disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-cosmic-black border-t-transparent rounded-full animate-spin" />
            Generating Kundali...
          </span>
        ) : (
          'Generate My Kundali'
        )}
      </button>

      <p className="text-cosmic-text-muted text-xs font-inter text-center">
        Your birth data will be securely stored and used to generate your personalized Kundali.
      </p>
    </form>
  );
};

export default BirthDataForm;
