const axios = require('axios');
const xml2js = require('xml2js');

// import Image from 'next/image';

// export default function ProductsPage({ products }) {
//   return (
//     <div>
//       <h1>Список товаров из YML</h1>
//       <ul>
//         {products.map((item) => (
//           <li key={item.$.id}>
//             <h3>{item.name}</h3>
//             <p>Цена: {item.price} {item.currencyId}</p>
//             {item.picture && (
//               <Image
//                 src={item.picture}
//                 alt={item.name}
//                 width={150}
//                 height={150}
//               />
//             )}
//             <p>{item.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export const fetchProducts = async() => {
  
  const ymlUrl = process.env.PRODUCTS_URI;

  try {
    const response = await axios.get(ymlUrl);
    const xml = response.data;

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);

    const offers = result?.yml_catalog?.shop?.offers?.offer || [];

    const products = Array.isArray(offers) ? offers : [offers];
    console.log(products)

    return {
      props: { products },
    };
  } catch (error) {
    console.error('Ошибка загрузки YML:', error.message);
    return {
      props: { products: [] },
    };
  }
}
