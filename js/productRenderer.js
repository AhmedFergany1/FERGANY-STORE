// Show all product items
export function updateProductItemForAll() {
  try {
    const productsItem = document.querySelectorAll(".products__item");

    if (!productsItem || productsItem.length === 0) {
      console.warn("No products found in DOM.");
      return;
    }

    productsItem.forEach((product) => {
      if (product?.style) {
        product.style.display = "flex";
      }
    });
  } catch (error) {
    console.error("Failed to update products (All):", error);
  }
}

// Show only filtered product items
export function updateProductItemForFilter(filterProducts) {
  try {
    const productsItem = document.querySelectorAll(".products__item");

    if (!productsItem || productsItem.length === 0) {
      console.warn("No products found in DOM.");
      return;
    }

    if (!Array.isArray(filterProducts)) {
      console.error("Invalid filterProducts: must be an array.");
      return;
    }

    const filterProductsIDs = filterProducts
      .map((p) => p?.id)
      .filter((id) => typeof id === "number"); // Ensure only numeric IDs

    productsItem.forEach((product) => {
      const productId = Number(product?.dataset?.productid);
      const isValidId = !isNaN(productId);

      if (isValidId && product?.style) {
        product.style.display = filterProductsIDs.includes(productId)
          ? "flex"
          : "none";
      }
    });
  } catch (error) {
    console.error("Failed to update products (Filter):", error);
  }
}
