import { updateProductItemForAll } from "./productRenderer.js";
import { updateProductItemForFilter } from "./productRenderer.js";
import { productCategoried } from "./main.js";

import { createElement } from "./ui.js";

const productsBtnsContainer = document.querySelectorAll(
  ".products .products-btns-container button"
);
const allBtn = document.querySelector(".products .all");
const productFilterBtn = document.querySelector(".products .product-filter");

const openCategoryFilter = document.querySelector(
  ".products .open-category-filter"
);
const openPriceFilter = document.querySelector(".products .open-price-filter");

export function allAndFilterBtnHandle() {
  productsBtnsContainer.forEach((btn) => {
    btn.addEventListener("click", () => {
      productsBtnsContainer.forEach((bt) => {
        bt.classList.remove("active");
        openCategoryFilter.classList.remove("active");
        openPriceFilter.classList.remove("active");
      });

      btn.classList.add("active");

      if (btn === productFilterBtn) {
        openPriceFilter.classList.add("active");
        openCategoryFilter.classList.add("active");
        updateProductItemForFilter(productCategoried); // Assuming this uses internal state like `productCategoried`
      }

      if (btn === allBtn) {
        updateProductItemForAll();
      }
    });
  });
}

const checkCategoryContainer = document.querySelector(
  ".products .open-category-filter .check-category-container"
);

export function createCheckCategories(categories) {
  checkCategoryContainer.innerHTML = "";

  categories.forEach((category) => {
    const checkCategory = createElement("div", ["check-category"], {});

    const inputCheck = createElement("input", [], {
      type: "checkbox",
      id: category,
      class: category,
      value: category,
    });

    const labelCheck = createElement("label", [], {
      for: category,
      class: category,
    });
    labelCheck.textContent = category;

    checkCategory.appendChild(inputCheck);
    checkCategory.appendChild(labelCheck);

    checkCategoryContainer.appendChild(checkCategory);
  });
}
