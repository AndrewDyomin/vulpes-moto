"use client";

import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import css from "./BarcodeScanner.module.css";

const BarcodeScanner = ({ productsArray }) => {
  let product = null;
  let selectedDeviceId;
  const codeReader = new BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById("sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;
      if (videoInputDevices.length >= 1 && typeof window !== "undefined") {
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
      }

      document.getElementById("startButton").addEventListener("click", () => {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          async (result, err) => {
            if (result) {
              console.log(result.text);
              try {
                const res = await fetch(`/api/products/${result.text}`);
                const contentType = res.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                  const data = await res.json();

                  if (res.status === 200) {
                    const product = data;

                    const nameP = document.createElement("p");
                    nameP.textContent = `Название: ${data.name}`;

                    const articleP = document.createElement("p");
                    articleP.textContent = `Артикул: ${data.article}`;

                    const barcodeP = document.createElement("p");
                    barcodeP.textContent = `Штрихкод: ${data.barcode}`;

                    const resultEl = document.getElementById("result");
                    resultEl.innerHTML = "";
                    resultEl.appendChild(nameP);
                    resultEl.appendChild(articleP);
                    resultEl.appendChild(barcodeP);
                  } else {
                    document.getElementById("result").textContent =
                      data.message;
                  }

                  // document.getElementById("result").textContent =
                  //   res.status === 200
                  //     ? `${data.name} (${data.article})`
                  //     : data.message;
                } else {
                  const text = await res.text();
                  console.error("Сервер вернул не JSON:", text);
                }
              } catch (error) {
                document.getElementById(
                  "result"
                ).textContent = `Ошибка запроса к серверу ${error}`;
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
        <section className={css.scanSection}>
          <div className={`${css.scanBlock}`}>
            <video id="video" className={css.videoArea}></video>
          </div>
          <div className={`${css.scanBlock}${css.buttonsBlock}`}>
            <a className={css.button} id="startButton">
              Start
            </a>
            <a className={css.button} id="resetButton">
              Reset
            </a>
          </div>
          <div id="sourceSelectPanel" className={`${css.scanBlock}`}>
            <label htmlFor="sourceSelect">Change video source:</label>
            <select id="sourceSelect"></select>
          </div>
          <div id="result" className={`${css.scanBlock}`}>
            <label>Result:</label>
          </div>
        </section>
      </main>
    </>
  );
};

export default BarcodeScanner;
