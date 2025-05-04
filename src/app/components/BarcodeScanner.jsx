'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScanner = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [result, setResult] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    codeReader.listVideoInputDevices()
      .then((devices) => {
        setVideoDevices(devices);
        if (devices.length > 0) {
          setSelectedDeviceId(devices[0].deviceId);
        }
      })
      .catch((err) => {
        console.error('Error listing video devices', err);
        setResult('Ошибка доступа к камере');
      });

    return () => {
      codeReader.reset();
    };
  }, []);

  const handleStart = () => {
    if (codeReaderRef.current && selectedDeviceId && videoRef.current) {
      codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (res, err) => {
          if (res) {
            setResult(res.getText());
            console.log('Scanned result:', res.getText());
          }
          if (err && err.name !== 'NotFoundException') {
            console.error(err);
            setResult(err.message || 'Ошибка сканирования');
          }
        }
      );

      // Явный запуск видео (важно для Safari)
      const stream = videoRef.current.srcObject;
      if (videoRef.current && stream) {
        videoRef.current.play().catch((err) => {
          console.error('Video play error:', err);
        });
      }
    }
  };

  const handleReset = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setResult('');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Сканер штрихкодов</h1>

      <video
        ref={videoRef}
        width="300"
        height="200"
        autoPlay
        muted
        playsInline
        style={{ border: '1px solid gray', marginBottom: '1rem' }}
      />

      {videoDevices.length > 1 && (
        <select
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          style={{ marginBottom: '1rem' }}
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Камера ${device.deviceId}`}
            </option>
          ))}
        </select>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleStart}>Старт</button>
        <button onClick={handleReset} style={{ marginLeft: '1rem' }}>
          Сброс
        </button>
      </div>

      <div>
        <strong>Результат:</strong>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default BarcodeScanner;
