
export function minAndMaxProductPrice(products){
  let min = products[0]?.price || 0;
  let max = products[0]?.price || 0;

  products.forEach((product) => {
    if (product.price > max) max = product.price;
    if (product.price < min) min = product.price;
  });

  return [min, max];
}

export function applyPrice(products, min, max){
  return products.filter(product =>
    product.price >= min && product.price <= max
  );
}

export function applyCategories(products, selectedCategories){
  if (!selectedCategories || selectedCategories.length === 0) return products;

  return products.filter(product =>
    selectedCategories.includes(product.category)
  );
}
