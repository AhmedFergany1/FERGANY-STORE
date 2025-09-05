export async function getProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    throw error; // Rethrow so the caller can handle it if needed
  }
}

export async function getProductById(id) {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error("Invalid product ID");
    }

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error.message);
    throw error;
  }
}

export async function getProductCategories() {
  try {
    const res = await fetch("https://fakestoreapi.com/products/categories");

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch product categories:", error.message);
    throw error;
  }
}
