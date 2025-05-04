"use client"

import { useEffect, useRef, useState } from 'react';

// Импортируем нужные компоненты из библиотеки @zxing/library
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScanner = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [result, setResult] = useState('');
  const [videoDevices, setVideoDevices] = useState([]);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    // Инициализация объекта BrowserMultiFormatReader
    codeReaderRef.current = new BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');

    // Получение списка доступных видеоустройств
    codeReaderRef.current.listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
          setVideoDevices(videoInputDevices);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const handleStart = () => {
    if (codeReaderRef.current && selectedDeviceId) {
      codeReaderRef.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
        if (result) {
          console.log(result);
          setResult(result.text);
        }
        if (err) {
          // Проверка типа ошибки
          if (err.name !== 'NotFoundException') {
            console.error(err);
            setResult(err.toString());
          }
        }
      });
      console.log(`Started continuous decode from camera with id ${selectedDeviceId}`);
    }
  };

  const handleReset = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      setResult('');
      console.log('Reset.');
    }
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  return (
    <>
      <main className="wrapper" style={{ paddingTop: '2em' }}>
        <section id="demo-content">
          <h1 className="title">Scan BarCode</h1>

          <p>
            <a className="button-small button-outline" href="../../index.html">HOME 🏡</a>
          </p>

          <div>
            <video 
              id="video" 
              ref={videoRef} 
              width="300" 
              height="200" 
              style={{ border: '1px solid gray' }}
            ></video>
          </div>

          <div>
            <button className="button" onClick={handleStart}>Start</button>
            <button className="button" onClick={handleReset}>Reset</button>
          </div>

          {videoDevices.length > 1 && (
            <div id="sourceSelectPanel">
              <label htmlFor="sourceSelect">Change video source:</label>
              <select 
                id="sourceSelect" 
                style={{ maxWidth: '400px' }}
                onChange={handleDeviceChange}
              >
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Device ${device.deviceId}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label>Result:</label>
          <pre><code id="result">{result}</code></pre>

        </section>
      </main>
    </>
  );
};

export default BarcodeScanner;
