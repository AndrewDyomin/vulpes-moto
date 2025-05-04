'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function ZxingScanner() {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const resultRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    const loadZXing = async () => {
      const ZXing = await import('@zxing/library');
      const codeReader = new ZXing.BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;
      console.log('ZXing code reader initialized');

      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadZXing();
  }, []);

  const handleStart = () => {
    if (!codeReaderRef.current || !selectedDeviceId) return;
  
    codeReaderRef.current.decodeFromVideoDevice(
      selectedDeviceId,
      videoRef.current,
      (result, err) => {
        if (result) {
          console.log(result);
          resultRef.current.textContent = result.text;
        }
  
        // НЕ выводим NotFoundException
        if (err && err.name !== 'NotFoundException') {
          console.error(err);
          resultRef.current.textContent = err.message;
        }
      }
    );
  };
  
  

  const handleReset = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      resultRef.current.textContent = '';
      console.log('Reset.');
    }
  };

  return (
    <>
      <main style={{ paddingTop: '2em' }}>
        <section>
          <h1 className="title">Scan from Camera</h1>

          <div>
            <video ref={videoRef} width="300" height="200" style={{ border: '1px solid gray' }} />
          </div>

          <div>
            <button className="button" onClick={handleStart}>Start</button>
            <button className="button" onClick={handleReset}>Reset</button>
          </div>

          {devices.length > 1 && (
            <div id="sourceSelectPanel">
              <label htmlFor="sourceSelect">Change video source:</label>
              <select
                id="sourceSelect"
                style={{ maxWidth: '400px' }}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                {devices.map((device, index) => (
                  <option key={index} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label>Result:</label>
          <pre><code ref={resultRef}></code></pre>

        </section>
      </main>
    </>
  );
}
