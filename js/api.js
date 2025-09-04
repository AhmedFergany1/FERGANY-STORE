export async function getProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  return await res.json();
}

export async function getProductById(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  return await res.json();
}

export async function getProductCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  return await res.json();
}