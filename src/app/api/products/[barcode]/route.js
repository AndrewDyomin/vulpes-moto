import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const barcode = params.barcode;

    const product = await db.collection('products').findOne({ barcode });
    console.log(barcode)

    if (!product) {
      return NextResponse.json({ message: 'Товар не найден' }, { status: 204 });
    }

    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name || '',
      article: product.article || '',
      barcode: product.barcode || '',
    }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при поиске по штрихкоду:', error);
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 });
  }
}