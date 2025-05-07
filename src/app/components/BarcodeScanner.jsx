// "use client";

// import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

// const BarcodeScanner = () => {
//   let selectedDeviceId;
//   const codeReader = new BrowserMultiFormatReader();
//   console.log("ZXing code reader initialized");
//   codeReader
//     .listVideoInputDevices()
//     .then((videoInputDevices) => {
//       const sourceSelect = document.getElementById("sourceSelect");
//       selectedDeviceId = videoInputDevices[0].deviceId;
//       if (videoInputDevices.length >= 1 && typeof window !== 'undefined') {
//         videoInputDevices.forEach((element) => {
//           const sourceOption = document.createElement("option");
//           sourceOption.text = element.label;
//           sourceOption.value = element.deviceId;
//           sourceSelect.appendChild(sourceOption);
//         });

//         sourceSelect.onchange = () => {
//           selectedDeviceId = sourceSelect.value;
//         };

//         const sourceSelectPanel = document.getElementById("sourceSelectPanel");
//         sourceSelectPanel.style.display = "block";
//       }

//       document.getElementById("startButton").addEventListener("click", () => {
//         codeReader.decodeFromVideoDevice(
//           selectedDeviceId,
//           "video",
//           (result, err) => {
//             if (result) {
//               console.log(result);
//               document.getElementById("result").textContent = result.text;
//             }
//             if (err && !(err instanceof NotFoundException)) {
//               console.error(err);
//               document.getElementById("result").textContent = err;
//             }
//           }
//         );
//         console.log(
//           `Started continous decode from camera with id ${selectedDeviceId}`
//         );
//       });

//       document.getElementById("resetButton").addEventListener("click", () => {
//         codeReader.reset();
//         document.getElementById("result").textContent = "";
//         console.log("Reset.");
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//     });

//   return (
//     <>
//       <main>
//         <section>
//           <div>
//             <video
//               id="video"
//               width="300"
//               height="200"
//             ></video>
//           </div>

//           <div>
//             <a className={"button"} id="startButton">
//               Start
//             </a>
//             <a className={"button"} id="resetButton">
//               Reset
//             </a>
//           </div>

//           <div id="sourceSelectPanel">
//             <label htmlFor="sourceSelect">Change video source:</label>
//             <select id="sourceSelect"></select>
//           </div>

//           <label>Result:</label>
//           <pre>
//             <code id="result"></code>
//           </pre>

//         </section>
//       </main>
//     </>
//   );
// };

// export default BarcodeScanner;


'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const selectRef = useRef(null);
  const resultRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const codeReaderRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    codeReader.listVideoInputDevices().then((videoInputDevices) => {
      setDevices(videoInputDevices);
      if (videoInputDevices.length > 0) {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
      }
    });

    return () => {
      codeReader.reset();
    };
  }, []);

  const handleStart = () => {
    const codeReader = codeReaderRef.current;

    if (selectedDeviceId && videoRef.current) {
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            console.log(result);
            resultRef.current.textContent = result.getText();
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            resultRef.current.textContent = err.message;
          }
        }
      );
    }
  };

  const handleReset = () => {
    codeReaderRef.current.reset();
    resultRef.current.textContent = '';
  };

  return (
    <main>
      <section>
        <div>
          <video
            ref={videoRef}
            id="video"
            width="300"
            height="200"
            autoPlay
            muted
            playsInline
          />
        </div>

        <div>
          <button onClick={handleStart}>Start</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        {devices.length > 1 && (
          <div>
            <label htmlFor="sourceSelect">Change video source:</label>
            <select
              ref={selectRef}
              id="sourceSelect"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || 'Unnamed device'}
                </option>
              ))}
            </select>
          </div>
        )}

        <label>Result:</label>
        <pre>
          <code ref={resultRef}></code>
        </pre>
      </section>
    </main>
  );
};

export default BarcodeScanner;
