import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode';
import { TextField, Button, Typography, Alert, Box, Container, Paper } from '@mui/material'; // Import MUI components
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

    try {
      if (isEditing) {
        // Edit Mode: Update the existing link
        await axios.put(`http://localhost:5000/api/links/${id}`, formData);
        setAlert({ message: 'Changes saved successfully', type: 'success' });
      } else {
        // Create Mode: Create a new link
        const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const response = await axios.post('http://localhost:5000/api/links', {
          ...formData,
          created_at: formattedDate,
        });

        if (response.status === 201) {
          setAlert({ message: response.data.message, type: 'success' });
        } else {
          setAlert({ message: response.data.message, type: 'error' });
          return;
        }
      }

      // After successful operation, navigate to the homepage
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      console.log(error);
      setAlert({ message: isEditing ? 'Error saving data' : 'Url already exists, try another one!', type: 'error' });
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
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Paper elevation={3} sx={{ p: 2 }} >
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Manage Link' : 'Create Link'}
        </Typography>

        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Short URL Endpoint"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            placeholder='http://localhost:5000/'
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Destination URL"
            name="destinationUrl"
            value={formData.destinationUrl}
            onChange={handleChange}
            required
          />

          {isEditing && (
            <Box mt={3}>
              <Typography variant="body1">
                Created At: {new Date(formData.created_at).toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Clicks: {formData.clicks}</Typography>
                <Typography variant="body2">Scans: {formData.scans}</Typography>
              </Box>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={qrCodeImg} alt="QR Code" />
              </Box>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
          >
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ManageCreate;
