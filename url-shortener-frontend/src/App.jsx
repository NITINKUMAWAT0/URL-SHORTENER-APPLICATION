import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
// import Create from './Components/Create/Create';
// import Manage from './Components/Manage/Manage';
import Create_and_manage from './Components/Create_and_Manage/Create_and_manage';


function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="create" element={<Create_and_manage />} />
          <Route path='manage' element={<Create_and_manage/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
