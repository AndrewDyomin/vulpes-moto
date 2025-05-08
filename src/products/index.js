

export default async function ProductsClient() {
  console.log("products start");
  let products

      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        console.log("Полученные товары:", data);
        products = data;
      } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
      }

  return (
    <div>
      <h1>Товары (клиент)</h1>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} — {p.price} {p.currencyId}
          </li>
        ))}
      </ul>
    </div>
  );
}
