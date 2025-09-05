export function minAndMaxProductPrice(products) {
  try {
    if (!Array.isArray(products) || products.length === 0) {
      console.warn("minAndMaxProductPrice: Invalid or empty products array.");
      return [0, 0];
    }

    let min = Number(products[0]?.price) || 0;
    let max = Number(products[0]?.price) || 0;

    for (const product of products) {
      const price = Number(product?.price);
      if (!isNaN(price)) {
        if (price < min) min = price;
        if (price > max) max = price;
      }
    }

    return [min, max];
  } catch (error) {
    console.error("Error in minAndMaxProductPrice:", error);
    return [0, 0];
  }
}

export function applyPrice(products, min, max) {
  try {
    if (!Array.isArray(products)) {
      console.warn("applyPrice: products is not an array.");
      return [];
    }

    min = Number(min);
    max = Number(max);
    if (isNaN(min) || isNaN(max)) {
      console.warn("applyPrice: Invalid min or max value.");
      return products;
    }

    return products.filter(product => {
      const price = Number(product?.price);
      return !isNaN(price) && price >= min && price <= max;
    });

  } catch (error) {
    console.error("Error in applyPrice:", error);
    return products;
  }
}

export function applyCategories(products, selectedCategories) {
  try {
    if (!Array.isArray(products)) {
      console.warn("applyCategories: products is not an array.");
      return [];
    }

    if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) {
      return products;
    }

    return products.filter(product =>
      selectedCategories.includes(product?.category)
    );
  } catch (error) {
    console.error("Error in applyCategories:", error);
    return products;
  }
}
