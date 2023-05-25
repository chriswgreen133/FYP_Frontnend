import React, { useState } from 'react';
import axios from "../../Util/axios"
import { TextArea } from '@thumbtack/thumbprint-react';
import { BeatLoader } from 'react-spinners';
import { css } from '@emotion/core';
import './grammer.css';

const override = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const UploadAudio = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [grammerResponse, setGrammerResponse] = useState('');
  const [transcription, setTranscription] = useState('');
  const [grammerTranscription, setGrammerTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('audioFile', file);

    setLoading(true)

    axios.post("http://16.170.194.209:8080/grammer/transcribe", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => response.data)
    // .then(response => console.log(response))
    .then((data) => {
      setResponse(data);
      setLoading(false);
    })
    // .then(data => console.log(data))
    .catch(error => console.log(error));
  };

  const handleSubmitGrammer = e => {
    // e.preventDefault();
    // const formData = new FormData();
    // formData.append('audioFile', file);

    console.log('======== transcription =========')
    console.log(response)

    setLoading(true)

    axios.post("http://16.170.194.209:8080/grammer/analysis", {response})
    .then(response => response.data)
    // .then(response => console.log(response))
    .then(data => {
      setGrammerResponse(data);
      setLoading(false);
    })
    // .then(data => console.log(data))
    .catch(error => console.log(error));
  };

  // console.log(`response => ${response}`)

  return (
    // <div className="upload-audio-container">
    <div className={`upload-audio-container ${loading ? "loading" : ""}`}>
      <BeatLoader
          className="loading-spinner"
          css={override}
          size={20}
          color={"#123abc"}
          loading={loading}
      />
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="audio-file">Select audio file:</label>
        <input type="file" id="audio-file" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>Upload</button>
      </form>
      <div className="response-container">
        <h2>Transcription:</h2>
        {/* <textarea value={response} /> */}
        {/* <textarea value={response} placeholder='Upload a file to Transcribe'>{response}</textarea> */}
        {/* <TextArea
            value={response}
            isReadOnly={false}
            placeholder="Upload a file to Transcribe"
            onChange={v => setTranscription(v)}
        /> */}
        <textarea
          value={response}
          readOnly={false}
          placeholder="Upload a file to Transcribe"
          onChange={v => setTranscription(v)}
          style={{ width: "100%", height: "200px"}}
        />
      </div>
      <div className='grammer_btn'>
          <button type="button" disabled={!response} onClick={handleSubmitGrammer}>Grammer Analysis</button>
      </div>
      <div className="grammer-response-container">
        <h2>Grammar Analysis:</h2>
        {/* <TextArea
            value={grammerResponse}
            isReadOnly={false}
            placeholder="Waiting for your Transcription..."
            onChange={v => setGrammerTranscription(v)}
        /> */}
        <textarea
          value={grammerResponse}
          isReadOnly={false}
          placeholder="Waiting for your Transcription..."
          onChange={v => setGrammerTranscription(v)}
          style={{ width: "100%", height: "400px"}}
        />
      </div>
    </div>
  );
};

export default UploadAudio;
