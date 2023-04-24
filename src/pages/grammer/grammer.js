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

    // axios.get("http://localhost:8080/grammer/transcribe", {'audio': formData})
    axios.post("http://localhost:8080/grammer/transcribe", formData)
    .then(response => response.data)
    // .then(response => console.log(response))
    .then(data => setResponse(data))
    // .then(data => console.log(data))
    .catch(error => console.log(error));
  };

  console.log(`response => ${response}`)

  return (
    <div className="upload-audio-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="audio-file">Select audio file:</label>
        <input type="file" id="audio-file" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>Upload</button>
      </form>
      <div className="response-container">
        <h2>Transcription:</h2>
        {/* <textarea value={response} /> */}
        <textarea value={response} placeholder='Upload a file to Transcribe'>{response}</textarea>
      </div>
    </div>
  );
};

export default UploadAudio;
