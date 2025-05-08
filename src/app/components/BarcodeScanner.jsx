"use client";

import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const BarcodeScanner = ({ productsArray }) => {
  
  let selectedDeviceId;
  const codeReader = new BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById("sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;
      if (videoInputDevices.length >= 1 && typeof window !== 'undefined') {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement("option");
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });

        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };

        const sourceSelectPanel = document.getElementById("sourceSelectPanel");
        sourceSelectPanel.style.display = "block";
      }

      document.getElementById("startButton").addEventListener("click", () => {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          async (result, err) => {
            if (result) {
              try {
                const res = await fetch(`/api/products/barcode/${result.text}`);
                const data = await res.json();

                document.getElementById("result").textContent =
                  res.status === 200
                    ? `${data.name} (${data.article})`
                    : data.message;
              } catch (error) {
                document.getElementById("result").textContent =
                  `Ошибка запроса к серверу ${error}`;
                console.error(error);
              }
            }
          }
        );
        console.log(
          `Started continous decode from camera with id ${selectedDeviceId}`
        );
      });

      document.getElementById("resetButton").addEventListener("click", () => {
        codeReader.reset();
        document.getElementById("result").textContent = "";
        console.log("Reset.");
      });
    })
    .catch((err) => {
      console.error(err);
    });

  return (
    <>
      <main>
        <section>
          <div>
            <video
              id="video"
              width="300"
              height="200"
            ></video>
          </div>

          <div>
            <a className={"button"} id="startButton">
              Start
            </a>
            <a className={"button"} id="resetButton">
              Reset
            </a>
          </div>

          <div id="sourceSelectPanel">
            <label htmlFor="sourceSelect">Change video source:</label>
            <select id="sourceSelect"></select>
          </div>

          <label>Result:</label>
          <pre>
            <code id="result"></code>
          </pre>

        </section>
      </main>
    </>
  );
};

export default BarcodeScanner;