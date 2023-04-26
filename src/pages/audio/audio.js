import React, { useState } from 'react';
import RecordRTC from 'recordrtc';
import './audio.css';

let recorder;

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        // mimeType: 'audio/webm',
      });
      recorder.startRecording();
      setRecording(true);
    }).catch(error => {
      console.log('Error:', error);
    });
  };

  const stopRecording = () => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      setAudioBlobs([...audioBlobs, blob]);
      setRecording(false);
    });
  };

  const downloadAudio = blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.wav';
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="audio-recorder">
      <div className="audio-recorder__buttons">
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
      </div>
      <div className="audio-recorder__list">
        {audioBlobs.map((blob, index) => (
          <div key={index} className="audio-recorder__list-item">
            <span>Recording {index + 1}</span>
            <button onClick={() => downloadAudio(blob)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioRecorder;
