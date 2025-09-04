export function updateProductItemForAll() {
  const productsItem = document.querySelectorAll(".products__item");
  productsItem.forEach((product) => {
    product.style.display = "flex";
  });
}

export function updateProductItemForFilter(filterProducts) {
  const productsItem = document.querySelectorAll(".products__item");
  const filterProductsIDs = filterProducts.map((p) => p["id"]);

  productsItem.forEach((product) => {
    const productId = Number(product.dataset.productid);
    product.style.display = filterProductsIDs.includes(productId) ? "flex" : "none";
  });
}
