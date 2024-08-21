import "./Dashboard.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:5000/api/links")
        .then(response =>{
          setData(response.data)
        })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLinkClick = async (alias) => {
    try {
      await axios.put(
        `http://localhost:5000/api/links/${encodeURIComponent(alias)}/click`
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.alias === alias ? { ...item, clicks: item.clicks + 1 } : item
        )
      );
    } catch (error) {
      console.error(
        "Error updating click count:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async (alias) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/links/${encodeURIComponent(alias)}`
      );
      setData((prevData) => prevData.filter((item) => item.alias !== alias));
    } catch (error) {
      console.error(
        "Error deleting link:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="dashboard-container">
      <table>
        <thead>
          <tr>
            <th>Alias</th>
            <th>Name</th>
            <th>Created at</th>
            <th>Scans</th>
            <th>Clicks</th>
            <th>Manage</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.alias}>
              <td>
                {'http://localhost:5000/api/links/'+item.alias}
                <a
                  href={'http://localhost:5000/api/links/'+item.alias}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(item.alias)}
                >
                  <OpenInNewIcon className="open-link" fontSize="small" />
                </a>
              </td>
              <td>{item.name}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>{item.scans}</td>
              <td>{item.clicks}</td>
              <td>
                <Link to="/manage" className="manage" state={{id: item.id}}>
                    <EditIcon className="manage-icon"/>
                </Link>
              </td>
              <td>
                <DeleteOutlineIcon
                  className="delete-icon"
                  onClick={() => handleDelete(item.alias)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
