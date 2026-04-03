import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import type { ErrorLike } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from '../../graphql/mutations';

interface ResetPasswordResponse {
  resetPassword: {
    success: boolean;
    message: string;
  };
}

const getFriendlyError = (error: ErrorLike): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('econnrefused')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  if (error.message.includes('expired')) {
    return 'This reset link has expired. Please request a new one.';
  }
  if (error.message.includes('Invalid')) {
    return 'This reset link is invalid. Please request a new one.';
  }
  return error.message || 'Something went wrong. Please try again.';
};

const SetNewPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [resetPassword, { loading }] = useMutation<ResetPasswordResponse>(RESET_PASSWORD_MUTATION, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (err) => {
      setError(getFriendlyError(err));
    },
  });

  const validate = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[0-9!@#$%^&*]/.test(password)) {
      errors.password = 'Password must include at least one number or special character';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    resetPassword({ variables: { token: token ?? '', newPassword: password } });
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <p className="text-red-600 mb-4">Invalid reset link.</p>
          <Link to="/reset-password" className="text-primary font-semibold hover:underline">
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Set new password</h1>

        {success ? (
          <div className="text-center mt-4">
            <div className="mx-auto mb-4 w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">Password updated!</p>
            <p className="text-gray-500 text-sm">Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 text-sm mb-6">
              Choose a strong new password for your account.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}{' '}
                {(error.includes('expired') || error.includes('invalid')) && (
                  <Link to="/reset-password" className="underline font-medium">
                    Request a new link
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors({}); setError(''); }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors({}); setError(''); }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Saving...' : 'Set new password'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-gray-600 mt-6 text-sm">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
