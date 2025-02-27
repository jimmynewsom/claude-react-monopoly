import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (error) {
      setError('Failed to login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await loginAsGuest(guestName);
      navigate('/home');
    } catch (error) {
      setError('Failed to login as guest');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleGuestForm = () => {
    setShowGuestForm(!showGuestForm);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-3">Monopoly Online</h1>
          <p className="text-xl text-gray-600">The classic property trading game</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {!showGuestForm ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-700 text-lg font-semibold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 font-bold text-lg"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>
              </form>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 text-lg">OR</span>
                </div>
              </div>
              
              <div>
                <button
                  onClick={toggleGuestForm}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 font-bold text-lg"
                >
                  Play as Guest
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleGuestSubmit} className="space-y-6">
                <div>
                  <label htmlFor="guestName" className="block text-gray-700 text-lg font-semibold mb-2">
                    Guest Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter a name or leave blank for random"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 font-bold text-lg"
                    disabled={loading}
                  >
                    {loading ? 'Entering as Guest...' : 'Continue as Guest'}
                  </button>
                </div>
              </form>
              
              <div className="mt-6">
                <button
                  onClick={toggleGuestForm}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-200 font-semibold text-lg"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
          
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;