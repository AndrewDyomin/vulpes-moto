// const axios = require('axios');
// const xml2js = require('xml2js');

// export const fetchProducts = async() => {
  
//   const ymlUrl = process.env.PRODUCTS_URI;

//   try {
//     const response = await axios.get(ymlUrl);
//     const xml = response.data;

//     const parser = new xml2js.Parser({ explicitArray: false });
//     const result = await parser.parseStringPromise(xml);

//     const offers = result?.yml_catalog?.shop?.offers?.offer || [];

//     const products = Array.isArray(offers) ? offers : [offers];

//     return { products };
//   } catch (error) {
//     console.error('Ошибка загрузки YML:', error.message);
//     return {
//       props: { products: [] },
//     };
//   }
// }

// import axios from 'axios';
// import xml2js from 'xml2js';
// import { connectToDatabase } from '@/lib/mongo/index';

// export default async function handler(req, res) {

//   const ymlUrl = process.env.PRODUCTS_URI;

//   try {
//     const { db } = await connectToDatabase();

//     const response = await axios.get(ymlUrl);
//     const xml = response.data;

//     const parser = new xml2js.Parser({ explicitArray: false });
//     const result = await parser.parseStringPromise(xml);

//     const offers = result?.yml_catalog?.shop?.offers?.offer || [];
//     const products = Array.isArray(offers) ? offers : [offers];

//     await db.collection('products').deleteMany({});
//     await db.collection('products').insertMany(products);

//     console.log(`Загружено ${products.length} товаров`);
//   } catch (error) {
//     console.error('Ошибка при обновлении:', error);
//   }
// }