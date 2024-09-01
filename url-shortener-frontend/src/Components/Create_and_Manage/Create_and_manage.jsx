import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode';
import './Create_and_manage.scss'; // Combine styles into one file

const ManageCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {}; // Get the ID from location.state if editing
  const isEditing = !!id; // Determine if we are editing based on the presence of id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    alias: '',
    destinationUrl: '',
    created_at: '', // Only needed for edit mode
    scans: 0, // Only needed for edit mode
    clicks: 0, // Only needed for edit mode
  });
  const [qrCodeImg, setQrCodeImg] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [alertTimeout, setAlertTimeout] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/links/id/${id}`);
          setFormData(response.data);
          const qrCodeSrc = await QRCode.toDataURL(`http://localhost:5000/api/links/scan/${response.data.alias}`);
          setQrCodeImg(qrCodeSrc);
        } catch (error) {
          console.log(error);
          setAlert({ message: 'Error fetching data', type: 'error' });
        }
      };

      fetchData();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // Edit Mode: Update the existing link
      try {
        await axios.put(`http://localhost:5000/api/links/${id}`, formData);
        setAlert({ message: 'Changes saved successfully', type: 'success' });
        setEditingAlertTimeout();
      } catch (error) {
        console.log(error);
        setAlert({ message: 'Error saving data', type: 'error' });
        setEditingAlertTimeout();
      }
    } else {
      // Create Mode: Create a new link
      try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const response = await axios.post('http://localhost:5000/api/links', {
          ...formData,
          created_at: formattedDate,
        });
        if (response.status === 201) {
          setAlert({ message: response.data.message, type: 'success' });
          setTimeout(() => navigate('/', { state: { message: 'New link created successfully!' } }), 2000);
        } else {
          setAlert({ message: response.data.message, type: 'error' });
        }
      } catch (error) {
        console.log(error);
        setAlert({ message: 'Url already exists, try another one!', type: 'error' });
      }
    }
  };

  const setEditingAlertTimeout = () => {
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }
    const timeout = setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 3000);
    setAlertTimeout(timeout);
  };

  return (
    <div className="manage-create-container">
      <header className="manage-create-header">
        <h1>{isEditing ? 'Edit Link' : 'Create Link'}</h1>
      </header>

      {alert.message && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="alias">Short URL Endpoint:</label>
          <input
            type="text"
            id="alias"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            placeholder='http://localhost:5000/'
            required
          />
        </div>
        <div>
          <label htmlFor="destinationUrl">Destination URL:</label>
          <input
            type="url"
            id="destinationUrl"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleChange}
            required
          />
        </div>

        {isEditing && (
          <>
            <div className="info-row">
              <label>Created At:</label>
              <p>{new Date(formData.created_at).toLocaleString()}</p>
            </div>
            <div className="info-row stats">
              <p>Clicks: {formData.clicks}</p>
              <p>Scans: {formData.scans}</p>
            </div>
            <div className="qr-code">
              <img src={qrCodeImg} alt="QR Code" />
            </div>
          </>
        )}

        <button className="save-btn" type="submit">
          {isEditing ? 'Save' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default ManageCreate;
