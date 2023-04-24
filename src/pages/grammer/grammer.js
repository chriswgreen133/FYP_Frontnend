import React, { useState } from 'react';
import axios from "../../Util/axios"
import './grammer.css';

const UploadAudio = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audio', file);

    axios.get("http://localhost:8080/grammer/transcribe", {'audio': formData})
    // .then(response => response.text())
    .then(response => console.log(response))
    .then(data => setResponse(data))
    .catch(error => console.log(error));

    // fetch('/api/upload-audio', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(response => response.text())
    //   .then(data => setResponse(data))
    //   .catch(error => console.log(error));
  };

  return (
    <div className="upload-audio-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="audio-file">Select audio file:</label>
        <input type="file" id="audio-file" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>Upload</button>
      </form>
      <div className="response-container">
        <h2>Server Response:</h2>
        <textarea value={response} />
      </div>
    </div>
  );
};

export default UploadAudio;
