import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ setIsAuthenticated, setUserType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const validateForm = () => {
    const newErrors = {};

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
      // TODO: Implement API call to authenticate user
      console.log('Sign in data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful login here
      alert('Sign in successful!');
      setIsAuthenticated(true);
      setUserType('user'); // Default to user since we removed the selection
      // Redirect to user dashboard
      navigate('/user/reservations');
      
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={styles.authHeader}>
          <h2 style={styles.authHeaderH2}>Sign In</h2>
          <p style={styles.authHeaderP}>Welcome back! Please sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.authForm}>
          {errors.general && (
            <div style={{...styles.errorMessage, ...styles.generalError}}>
              {errors.general}
            </div>
          )}

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
                borderColor: errors.email ? '#e74c3c' : '#e1e1e1',
                outline: 'none'
              }}
              placeholder="Enter your email"
              required
              onFocus={(e) => e.target.style.borderColor = '#0074D5'}
              onBlur={(e) => e.target.style.borderColor = errors.email ? '#e74c3c' : '#e1e1e1'}
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
                borderColor: errors.password ? '#e74c3c' : '#e1e1e1',
                outline: 'none'
              }}
              placeholder="Enter your password"
              required
              onFocus={(e) => e.target.style.borderColor = '#0074D5'}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#e74c3c' : '#e1e1e1'}
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
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#005bb5')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#0074D5')}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.authFooter}>
          <p style={styles.authFooterP}>
            Don't have an account?{' '}
            <button 
              style={styles.linkButton}
              onClick={() => navigate('/signup')}
              type="button"
              onMouseEnter={(e) => e.target.style.color = '#005bb5'}
              onMouseLeave={(e) => e.target.style.color = '#0074D5'}
            >
              Sign Up
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
    maxWidth: '400px',
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

export default SignIn;
