import './Home.scss';
import Dashboard from '../../Components/dashboard/Dashboard';
import Navbar from '../../Components/Navbar/Navbar';
import Auth from '../Login'; // Make sure to import Auth component
import { useState } from 'react';

const Home = () => {
  const [user, setUser] = useState(null); // Manage user state

  return (
    <div>
      <Navbar />
      {user ? (
        <Dashboard user={user} /> // Pass user to Dashboard if logged in
      ) : (
        <Auth setUser={setUser} /> // Show Auth component if not logged in
      )}
    </div>
  );
};

export default Home;
