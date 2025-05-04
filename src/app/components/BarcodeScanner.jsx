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
        if (err && !(err instanceof codeReaderRef.current.NotFoundException)) {
          console.error(err);
          resultRef.current.textContent = err.toString();
        }
      }
    );
    console.log(`Started continuous decode from camera with id ${selectedDeviceId}`);
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
      <Head>
        <title>ZXing TypeScript | Decoding from camera stream</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="ZXing for JS" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/normalize.css@8.0.0/normalize.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/milligram@1.3.0/dist/milligram.min.css"
        />
      </Head>

      <main className="wrapper" style={{ paddingTop: '2em' }}>
        <section className="container">
          <h1 className="title">Scan 1D/2D Code from Video Camera</h1>

          <p>
            <a className="button-small button-outline" href="/">HOME 🏡</a>
          </p>

          <p>
            This example shows how to scan any supported 1D/2D code with ZXing
            JavaScript library from the device video camera. If more than one video
            input device is available, a select input allows switching between them.
          </p>

          <div>
            <button className="button" onClick={handleStart}>Start</button>
            <button className="button" onClick={handleReset}>Reset</button>
          </div>

          <div>
            <video ref={videoRef} width="300" height="200" style={{ border: '1px solid gray' }} />
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

          <p>
            See the <a href="https://github.com/zxing-js/library/tree/master/docs/examples/multi-camera/">source code</a> for this example.
          </p>
        </section>

        <footer className="footer">
          <section className="container">
            <p>
              ZXing TypeScript Demo. Licensed under the{' '}
              <a target="_blank" href="https://github.com/zxing-js/library#license" rel="noopener noreferrer" title="MIT">
                MIT
              </a>.
            </p>
          </section>
        </footer>
      </main>
    </>
  );
}
