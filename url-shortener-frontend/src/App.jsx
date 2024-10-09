import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import Create_and_manage from './Components/Create_and_Manage/Create_and_manage';
import Login from './Pages/Login';
import { useState } from 'react'; // Import useState

function App() {
  const [user, setUser] = useState(null); // Declare user state

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/login' element={<Login setUser={setUser} />} /> {/* Pass setUser to Login */}
          <Route path="/" element={<Home user={user} setUser={setUser} />} /> {/* Pass user and setUser to Home */}
          <Route path="create" element={<Create_and_manage />} />
          <Route path='manage' element={<Create_and_manage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
