"use server"

import BarcodeScanner from "../components/BarcodeScanner";

export default async function Page() {

  return (
    <main>
      <h1>Сканер штрих-кодів</h1>
      <BarcodeScanner/>
    </main>
  );
}