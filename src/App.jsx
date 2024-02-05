import React, { useState, useRef } from 'react';

const CameraApp = () => {
  const videoRef = useRef(null);
  const imageTagRef = useRef(null);
  const [theStream, setTheStream] = useState(null);

  const getUserMedia = (options, successCallback, failureCallback) => {
    const api =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    if (api) {
      return api.bind(navigator)(options, successCallback, failureCallback);
    }
  };

  const getStream = () => {
    if (!navigator.getUserMedia && !navigator.webkitGetUserMedia && !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
      alert('User Media API not supported.');
      return;
    }

    const constraints = {
      video: true,
    };

    getUserMedia(
      constraints,
      (stream) => {
        const mediaControl = videoRef.current;
        if ('srcObject' in mediaControl) {
          mediaControl.srcObject = stream;
        } else if (navigator.mozGetUserMedia) {
          mediaControl.mozSrcObject = stream;
        } else {
          mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
        }
        setTheStream(stream);
      },
      (err) => {
        alert('Error: ' + err);
      }
    );
  };

  const takePhoto = () => {
    if (!('ImageCapture' in window)) {
      alert('ImageCapture is not available');
      return;
    }

    if (!theStream) {
      alert('Grab the video stream first!');
      return;
    }

    const theImageCapturer = new ImageCapture(theStream.getVideoTracks()[0]);

    theImageCapturer
      .takePhoto()
      .then((blob) => {
        const theImageTag = imageTagRef.current;
        theImageTag.src = URL.createObjectURL(blob);
      })
      .catch((err) => alert('Error: ' + err));
  };

  return (
    <div>
      <p>
        <button onClick={getStream}>Grab video</button>
      </p>
      <p>
        <video ref={videoRef} autoPlay style={{ height: '180px', width: '240px' }}></video>
      </p>
      <p>
        <button onClick={takePhoto}>Take Photo!</button>
      </p>
      <p>
        <img ref={imageTagRef} id="imageTag" width="240" height="180" alt="Captured"></img>
      </p>
      <p>
        <small>Demo by <a href="http://www.mcasas.tk/" target="_blank" rel="noopener">Miguel Casas-Sanchez</a>.</small>
      </p>
    </div>
  );
};

export default CameraApp;
