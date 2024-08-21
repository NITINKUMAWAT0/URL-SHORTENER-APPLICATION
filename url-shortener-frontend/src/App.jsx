import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../../shorten-frontend/src/Pages/Home/Home';
import NotFound from '../../shorten-frontend/src/Pages/NotFound/NotFound';
import Create from '../../shorten-frontend/src/Components/Create/Create';
import Manage from '../../shorten-frontend/src/Components/Manage/Manage';


function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/link_creation" element={<Create />} />
          <Route path='/manage' element={<Manage/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
