import { updateProductItemForAll } from "./productRenderer.js";
import { updateProductItemForFilter } from "./productRenderer.js";
import { productCategoried } from "./main.js";
import { createElement } from "./ui.js";

// Safer DOM queries
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
  try {
    // Check if required elements exist
    if (
      !productsBtnsContainer ||
      !allBtn ||
      !productFilterBtn ||
      !openCategoryFilter ||
      !openPriceFilter
    ) {
      console.warn("One or more filter buttons are missing in the DOM.");
      return;
    }

    productsBtnsContainer.forEach((btn) => {
      btn.addEventListener("click", () => {
        try {
          productsBtnsContainer.forEach((bt) => {
            bt.classList.remove("active");
            openCategoryFilter.classList.remove("active");
            openPriceFilter.classList.remove("active");
          });

          btn.classList.add("active");

          if (btn === productFilterBtn) {
            openCategoryFilter.classList.add("active");
            openPriceFilter.classList.add("active");

            if (Array.isArray(productCategoried)) {
              updateProductItemForFilter(productCategoried);
            } else {
              console.warn("productCategoried is not a valid array.");
            }
          }

          if (btn === allBtn) {
            updateProductItemForAll();
          }
        } catch (err) {
          console.error("Error during button click handling:", err);
        }
      });
    });
  } catch (error) {
    console.error("Failed to initialize all/filter button handler:", error);
  }
}

// Container for checkboxes
const checkCategoryContainer = document.querySelector(
  ".products .open-category-filter .check-category-container"
);

export function createCheckCategories(categories) {
  try {
    if (!checkCategoryContainer) {
      console.warn("checkCategoryContainer element not found.");
      return;
    }

    if (!Array.isArray(categories)) {
      console.warn("createCheckCategories: 'categories' must be an array.");
      return;
    }

    checkCategoryContainer.innerHTML = "";

    categories.forEach((category) => {
      // Avoid invalid category values
      if (typeof category !== "string") {
        console.warn("Invalid category type:", category);
        return;
      }

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

  } catch (error) {
    console.error("Error in createCheckCategories:", error);
  }
}
