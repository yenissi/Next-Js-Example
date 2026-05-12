export async function fetchProducts() {
  const res = await fetch(
    "https://api.escuelajs.co/api/v1/products"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  return data.slice(0, 10);
}