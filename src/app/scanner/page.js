
import BarcodeScanner from "../components/BarcodeScanner";
import { fetchProducts } from "../actions/fetchProducts";

export default async function Page() {

  const products = (await fetchProducts())?.products;

  return (
    <main>
      <h1>Сканер штрих-кодів</h1>
      <BarcodeScanner productsArray={products}/>
    </main>
  );
}