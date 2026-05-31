import { useState } from 'react';
import { authAPI } from '../utils/authAPI';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (isSignUp) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        if (isSignUp) {
          await authAPI.signup(formData.username, formData.email, formData.password);
          setSuccessMessage('Sign up successful! Welcome to Zentry!');
        } else {
          await authAPI.signin(formData.username, formData.password);
          setSuccessMessage('Sign in successful! Welcome back!');
        }

        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Clear success message after 3 seconds and optionally redirect
        setTimeout(() => {
          setSuccessMessage('');
          // You can redirect to a dashboard or home page here
          // window.location.href = '/dashboard';
        }, 3000);
      } catch (error) {
        setErrors({
          submit: error.message || 'An error occurred. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  return (
    <section id="auth" className="relative w-full py-20 px-4 bg-black">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl bg-gradient-to-b from-gray-900 to-black p-8 border border-gray-700 shadow-2xl">
          {/* Title */}
          <h2 className="mb-2 text-3xl font-bold text-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="mb-6 text-gray-400 text-sm">
            {isSignUp
              ? 'Join us to get started'
              : 'Welcome back! Sign in to continue'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 rounded-lg bg-green-900/30 border border-green-600 text-green-400 text-sm">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 rounded-lg bg-red-900/30 border border-red-600 text-red-400 text-sm">
                {errors.submit}
              </div>
            )}
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 border border-gray-700 focus:border-violet-500 focus:outline-none transition"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 border border-gray-700 focus:border-violet-500 focus:outline-none transition"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 border border-gray-700 focus:border-violet-500 focus:outline-none transition"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 border border-gray-700 focus:border-violet-500 focus:outline-none transition"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 transition transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-violet-400 hover:text-violet-300 font-semibold transition"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
