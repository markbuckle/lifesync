import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import type { ErrorLike } from '@apollo/client';
import { REQUEST_PASSWORD_RESET_MUTATION } from '../../graphql/mutations';

interface RequestPasswordResetResponse {
  requestPasswordReset: {
    success: boolean;
    message: string;
  };
}

const getFriendlyError = (error: ErrorLike): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('econnrefused')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  return 'Something went wrong. Please try again.';
};

const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [requestReset, { loading }] = useMutation<RequestPasswordResetResponse>(
    REQUEST_PASSWORD_RESET_MUTATION,
    {
      onCompleted: () => {
        setSubmitted(true);
      },
      onError: (err) => {
        setError(getFriendlyError(err));
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    requestReset({ variables: { email } });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Reset password</h1>

        {!submitted ? (
          <>
            <p className="text-center text-gray-600 text-sm mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                />
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
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-700 mb-1 font-medium">Check your inbox</p>
            <p className="text-gray-500 text-sm mb-6">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>, you'll receive a reset link shortly.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="text-sm text-primary hover:underline"
            >
              Try a different email
            </button>
          </div>
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

export default PasswordResetPage;
