export async function fetchProducts() {
  const res = await fetch("https://api.escuelajs.co/api/v1/products");
  const data = await res.json();
  return data.slice(0, 10);
}