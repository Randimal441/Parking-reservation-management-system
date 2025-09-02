import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    nicNumber: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateNIC = (nic) => {
    // Basic NIC validation for Sri Lankan NIC numbers
    // Old format: 9 digits + V (e.g., 123456789V)
    // New format: 12 digits (e.g., 123456789012)
    const oldFormat = /^[0-9]{9}[vVxX]$/;
    const newFormat = /^[0-9]{12}$/;
    return oldFormat.test(nic) || newFormat.test(nic);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.nicNumber.trim()) {
      newErrors.nicNumber = 'NIC number is required';
    } else if (!validateNIC(formData.nicNumber.trim())) {
      newErrors.nicNumber = 'Please enter a valid NIC number (e.g., 123456789V or 123456789012)';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement API call to register user
      console.log('Sign up data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful registration here
      alert('Account created successfully! Please sign in.');
      
      // Reset form
      setFormData({
        fullName: '',
        nicNumber: '',
        email: '',
        password: ''
      });
      
      // Navigate to sign in page
      navigate('/signin');
      
    } catch (error) {
      console.error('Sign up error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={styles.authHeader}>
          <h2 style={styles.authHeaderH2}>Sign Up</h2>
          <p style={styles.authHeaderP}>Create your account to get started with parking reservations.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.authForm}>
          {errors.general && (
            <div style={styles.generalError}>
              {errors.general}
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.formGroupLabel}>Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                ...styles.formGroupInput,
                borderColor: errors.fullName ? '#e74c3c' : '#e1e1e1'
              }}
              placeholder="Enter your full name"
              required
            />
            {errors.fullName && (
              <span style={styles.errorMessage}>{errors.fullName}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="nicNumber" style={styles.formGroupLabel}>NIC Number</label>
            <input
              type="text"
              id="nicNumber"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleChange}
              style={{
                ...styles.formGroupInput,
                borderColor: errors.nicNumber ? '#e74c3c' : '#e1e1e1'
              }}
              placeholder="Enter your NIC number (e.g., 123456789V)"
              required
            />
            {errors.nicNumber && (
              <span style={styles.errorMessage}>{errors.nicNumber}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.formGroupLabel}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.formGroupInput,
                borderColor: errors.email ? '#e74c3c' : '#e1e1e1'
              }}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <span style={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.formGroupLabel}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.formGroupInput,
                borderColor: errors.password ? '#e74c3c' : '#e1e1e1'
              }}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <span style={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.authButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.authFooter}>
          <p style={styles.authFooterP}>
            Already have an account?{' '}
            <button 
              style={styles.linkButton}
              onClick={() => navigate('/signin')}
              type="button"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem',
  },
  authCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: '3rem',
    width: '100%',
    maxWidth: '450px',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  authHeaderH2: {
    color: '#333',
    fontSize: '2rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  authHeaderP: {
    color: '#666',
    fontSize: '1rem',
    margin: '0',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroupLabel: {
    color: '#333',
    fontWeight: '500',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
  },
  formGroupInput: {
    padding: '0.75rem',
    border: '2px solid #e1e1e1',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
  },
  generalError: {
    backgroundColor: '#ffe6e6',
    padding: '0.75rem',
    borderRadius: '6px',
    borderLeft: '4px solid #e74c3c',
    marginBottom: '1rem',
    color: '#e74c3c',
    fontSize: '0.85rem',
  },
  authButton: {
    padding: '0.875rem',
    fontSize: '1rem',
    fontWeight: '500',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    backgroundColor: '#0074D5',
    color: 'white',
    border: 'none',
  },
  authFooter: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e1e1e1',
  },
  authFooterP: {
    color: '#666',
    margin: '0',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#0074D5',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default SignUp;
