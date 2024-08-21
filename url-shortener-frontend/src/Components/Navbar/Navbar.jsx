import './Navbar.scss';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <h1 className='nav-title'>Short Links</h1>
      <Link to="/link_creation" className="create">
        <span>Create<AddIcon className='add-icon' fontSize='10' /></span>
      </Link>
    </div>
  );
}

export default Navbar;
