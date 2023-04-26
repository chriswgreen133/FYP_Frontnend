import React, { useState } from 'react';
import axios from "../../Util/axios"
import { TextArea } from '@thumbtack/thumbprint-react';
import './grammer.css';

const UploadAudio = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [grammerResponse, setGrammerResponse] = useState('');
  const [transcription, setTranscription] = useState('');
  const [grammerTranscription, setGrammerTranscription] = useState('');

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audioFile', file);

    axios.post("http://localhost:8080/grammer/transcribe", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => response.data)
    // .then(response => console.log(response))
    .then(data => setResponse(data))
    // .then(data => console.log(data))
    .catch(error => console.log(error));
  };

  const handleSubmitGrammer = e => {
    // e.preventDefault();
    // const formData = new FormData();
    // formData.append('audioFile', file);

    console.log('======== transcription =========')
    console.log(response)

    axios.post("http://localhost:8080/grammer/analysis", {response})
    .then(response => response.data)
    // .then(response => console.log(response))
    .then(data => setGrammerResponse(data))
    // .then(data => console.log(data))
    .catch(error => console.log(error));
  };

  // console.log(`response => ${response}`)

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
        {/* <textarea value={response} placeholder='Upload a file to Transcribe'>{response}</textarea> */}
        <TextArea
            value={response}
            isReadOnly={false}
            placeholder="Upload a file to Transcribe"
            onChange={v => setTranscription(v)}
        />
      </div>
      <div className='grammer_btn'>
          <button type="button" disabled={!response} onClick={handleSubmitGrammer}>Grammer Analysis</button>
      </div>
      <div className="grammer-response-container">
        <h2>Grammer Analysis:</h2>
        <TextArea
            value={grammerResponse}
            isReadOnly={false}
            placeholder="Waiting for your Transcription..."
            onChange={v => setGrammerTranscription(v)}
        />
      </div>
    </div>
  );
};

export default UploadAudio;
