import React, { useState, useEffect } from 'react';
import './FileUpload.css'; // Import your CSS file

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully.');
        getFiles(); // Refresh the file list after a successful upload
      } else {
        alert('Error uploading file.');
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.data);
      } else {
        console.error('Error fetching files.');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  return (
    <div>
      <div>
        <h1>File Upload</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload File</button>
      </div>

      <div className='empid1431savedfiles'>
        <h1 className='empid1431sf'>Saved Files</h1>
        <table className="empid1431filetable">
          <thead className='empid1431thead'>
            <tr className='empid1431trow'>
              <th className='empid1431th1'>Serial Number</th>
              <th className='empid1431th1'>File Name</th>
              <th className='empid1431th1'>Uploaded Date</th>
              <th className='empid1431th1'>Time</th>
            </tr>
          </thead>

          <tbody className='empid1431tbody'>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.originalname}
                  </a>
                </td>
                <td>
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </td>
                <td>
                  {new Date(file.uploadedAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileUpload;
