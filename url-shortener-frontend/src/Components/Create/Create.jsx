// import './Create.scss';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Create = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     url: '',
//     destinationUrl: ''
//   });
//   const [alert, setAlert] = useState({ message: '', type: '' }); // State for alert message
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Convert ISO string to MySQL DATETIME format
//     const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
//     try {
//       const response = await axios.post('http://localhost:5000/api/links', {
//         name: formData.name,
//         description: formData.description,
//         alias: formData.url,
//         destinationUrl: formData.destinationUrl,
//         created_at: formattedDate,  
//         scans: 0,
//         clicks: 0,
//       });
//       if (response.status === 201) {
//         setAlert({ message: response.data.message, type: 'success' });
//         setTimeout(() => navigate('/', { state: { message: 'New link created successfully!' } }), 2000);
//       } else {
//         setAlert({ message: response.data.message, type: 'error' });
//       }
//     } catch (error) {
//       console.log(error)
//       setAlert({ message: 'Url already exits, try another one!', type: 'error' });
//     }
//   };
  
//   return (
//     <div>
//       <div className="nav">
//         <h1 className="nav-title">Create Link</h1>
//       </div>

//       {alert.message && (
//         <div className={`alert-bar ${alert.type}`}>
//           {alert.message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="url">Short URL Endpoint:</label>
//           <input
//             type="text"
//             id="url"
//             name="url"
//             value={formData.url}
//             onChange={handleChange}
//             placeholder='http://localhost:5000/'
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="destinationUrl">Destination URL:</label>
//           <input
//             type="url"
//             id="destinationUrl"
//             name="destinationUrl"
//             value={formData.destinationUrl}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button className="save-btn" type="submit">Save</button>
//       </form>
//     </div>
//   );
// };

// export default Create;
