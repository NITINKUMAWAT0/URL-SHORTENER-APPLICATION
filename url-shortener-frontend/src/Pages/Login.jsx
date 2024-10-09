import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user); // Set user state upon successful login
      navigate('/'); // Redirect to home page using navigate
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setMessage('Registration successful! Please check your email to verify your account.');

      // On successful registration, set the user state and redirect
      const user = { id: response.data.user.id, name, email }; // Assuming your response has user data
      setUser(user); // Set user state to reflect registration
      navigate('/'); // Redirect to home page using navigate
    } catch (err) {
      setMessage('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
      </button>
    </div>
  );
};

// PropTypes validation
Auth.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Auth;
