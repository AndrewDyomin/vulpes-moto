"use client"

import { useEffect, useRef, useState } from 'react';

const CameraScanner = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [codeReader, setCodeReader] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zxing/library@latest/umd/index.min.js';
    script.async = true;
    script.onload = () => {
      const reader = new ZXing.BrowserMultiFormatReader();
      setCodeReader(reader);

      reader.listVideoInputDevices()
        .then((videoInputDevices) => {
          if (videoInputDevices.length > 0) {
            setDevices(videoInputDevices);
            setSelectedDeviceId(videoInputDevices[0].deviceId);
          }
        })
        .catch((err) => {
          console.error('Error listing video devices: ', err);
          setError('Не удалось найти устройства камеры.');
        });
    };
    document.body.appendChild(script);

    return () => {
      if (scannerActive && videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
      document.body.removeChild(script);
    };
  }, [scannerActive]);

  const startScanning = () => {
    if (selectedDeviceId && codeReader) {
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          setResult(result.text);
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          setError(`Ошибка: ${err}`);
        }
      });
      setScannerActive(true);
    }
  };

  const resetScanner = () => {
    if (codeReader && videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    setResult(null);
    setError(null);
    setScannerActive(false);
  };

  return (
    <div>
      <h1>Scan barcode</h1>

      <div>
        <video ref={videoRef} width="300" height="200" style={{ border: '1px solid gray' }} muted autoPlay />
      </div>

      <div>
        <button onClick={startScanning} disabled={scannerActive}>Start</button>
        <button onClick={resetScanner}>Reset</button>
      </div>

      {devices.length > 1 && (
        <div id="sourceSelectPanel">
          <label htmlFor="sourceSelect">Change video source:</label>
          <select
            id="sourceSelect"
            style={{ maxWidth: '400px' }}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            value={selectedDeviceId}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Result:</label>
        <pre>{result ? result : error}</pre>
      </div>
    </div>
  );
};

export default CameraScanner;
