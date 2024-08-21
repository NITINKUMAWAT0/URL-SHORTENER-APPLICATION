import { useLocation } from 'react-router-dom';
import './Manage.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';

const Manage = () => {
  const location = useLocation();
  const { id } = location.state || {};

  const [editableData, setEditableData] = useState({});
  const [qrCodeImg, setQrCodeImg] = useState('');
  const [isEditing, setEditing] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [alertTimeout, setAlertTimeout] = useState(null); // State to keep track of timeout

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/links/id/${id}`);
        setEditableData(response.data);
        const qrCodeSrc = await QRCode.toDataURL(`http://localhost:5000/api/links/scan/${response.data.alias}`);
        setQrCodeImg(qrCodeSrc);
      } catch (error) {
        console.log(error)
        setAlert({ message: 'Error fetching data', type: 'error' });
      }
    };

    fetchData();
  }, [id]);

  const handleEditChange = () => {
    setEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/links/${id}`, editableData);
      setAlert({ message: 'Changes saved successfully', type: 'success' });

      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
      const timeout = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);

      setAlertTimeout(timeout);
      setEditing(false);
    } catch (error) {
      console.log(error)
      setAlert({ message: 'Error saving data', type: 'error' });

      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
      const timeout = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);

      setAlertTimeout(timeout);
    }
  };

  return (
    <div className="manage-container">
      <header className="manage-header">
        <h1>View Link</h1>
        <button className="edit-button" onClick={handleEditChange}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </header>

      <div className="details-card">
        <div className="details-info">
          <div className="info-row">
            <label>Name:</label>
            {isEditing ? (
              <input
                className="input-field"
                type="text"
                name="name"
                value={editableData.name}
                onChange={handleInputChange}
              />
            ) : (
              <p>{editableData.name}</p>
            )}
          </div>

          <div className="info-row">
            <label>Description:</label>
            {isEditing ? (
              <input
                className="input-field"
                type="text"
                name="description"
                value={editableData.description}
                onChange={handleInputChange}
              />
            ) : (
              <p>{editableData.description}</p>
            )}
          </div>

          <div className="info-row">
            <label>Created At:</label>
            <p>{new Date(editableData.created_at).toLocaleString()}</p>
          </div>

          <div className="info-row">
            <label>Short URL:</label>
            {isEditing ? (
              <input
                className="input-field"
                type="text"
                name="alias"
                value={editableData.alias}
                onChange={handleInputChange}
              />
            ) : (
              <a href={'http://localhost:5000/api/links/'+editableData.alias}>{'http://localhost:5000/api/links/'+editableData.alias}</a>
            )}
          </div>

          <div className="info-row">
            <label>Destination URL:</label>
            {isEditing ? (
              <input
                className="input-field"
                type="text"
                name="destinationUrl"
                value={editableData.destinationUrl}
                onChange={handleInputChange}
              />
            ) : (
              <a href={editableData.destinationUrl}>{editableData.destinationUrl}</a>
            )}
          </div>

          <div className="info-row stats">
            <p>Clicks: {editableData.clicks}</p>
            <p>Scans: {editableData.scans}</p>
          </div>
        </div>

        <div className="qr-code">
          <img src={qrCodeImg} alt="QR Code" />
        </div>

        {alert.message && (
          <div className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        )}
      </div>

      {isEditing && (
        <button className="save-button" onClick={handleSave}>Save</button>
      )}
    </div>
  );
};

export default Manage;
