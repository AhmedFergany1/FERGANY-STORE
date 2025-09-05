import {
  applyPrice,
  applyCategories,
  minAndMaxProductPrice,
} from "./filters.js";
import {
  getProducts,
  getProductById,
  getProductCategories,
} from "./api.js";
import { getLoggedUser } from "./auth.js";
import { loadCartFromLocalStorage } from "./storage.js";
import { createProductList } from "./products.js";
import { initHeaderUI } from "./headerUI.js";
import { updateProductItemForFilter } from "./productRenderer.js";
import {
  allAndFilterBtnHandle,
  createCheckCategories,
} from "./filtersUI.js";
import { initCartUI } from "./cartUI.js";
import { initSlider } from "./slider.js";
import { initContactUs } from "./contactUs.js";

// ========== USER AUTHENTICATION ==========
const user = getLoggedUser();
if (!user || !user.id) {
  console.warn("User not found or session expired.");
  window.location.href = "../index.html";
}

// ========== GLOBAL VARIABLES ==========
let mainProducts = [];
export let productCategoried = [];


// ========== PRELOADER ==========
const preloader = document.querySelector(".preloader");
window.onload = () => {
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = 0;
      preloader.style.transition = "opacity 300ms";

      setTimeout(() => {
        preloader.style.display = "none";
      }, 40);
    }, 1500);
  }
};


// ========== INITIALIZATION ==========
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const ownCartName = document.querySelector(".own-cart-name");
    if (ownCartName) {
      ownCartName.textContent = user.userName || "User";
    }

    initHeaderUI();
    initCartUI();
    initSlider();
    initContactUs();

    loadCartFromLocalStorage(user.id);

    // Fetch Products
    try {
      const products = await getProducts();
      if (!Array.isArray(products)) throw new Error("Products not in array format");
      mainProducts = products;
      productCategoried = [...products];

      const container = document.querySelector(".products__row");
      if (container) {
        createProductList(products, container);
      } else {
        console.warn("Product container not found");
      }
    } catch (productErr) {
      console.error("Failed to fetch products:", productErr);
      alert("Unable to load products. Please try again later.");
    }

    // Fetch Categories
    try {
      const categories = await getProductCategories();
      if (Array.isArray(categories)) {
        createCheckCategories(categories);
      }
    } catch (categoryErr) {
      console.error("Failed to fetch categories:", categoryErr);
    }

    allAndFilterBtnHandle();
  } catch (initErr) {
    console.error("App initialization failed:", initErr);
  }
});


// ========== FILTERING ==========
const applyFilter = document.querySelector(
  ".products .open-category-filter .apply-filter"
);

if (applyFilter) {
  applyFilter.addEventListener("click", () => {
    try {
      if (!mainProducts || mainProducts.length === 0) {
        console.warn("No products to filter.");
        return;
      }

      const fromInputValue = parseFloat(
        document.getElementById("fromInput")?.value.trim() || ""
      );
      const toInputValue = parseFloat(
        document.getElementById("toInput")?.value.trim() || ""
      );

      const [min, max] = minAndMaxProductPrice(mainProducts);

      const minValue = isNaN(fromInputValue) ? min : fromInputValue;
      const maxValue = isNaN(toInputValue) ? max : toInputValue;

      const priceFiltered = applyPrice(mainProducts, minValue, maxValue);

      const checkedBoxes = document.querySelectorAll(
        ".open-category-filter .check-category input:checked"
      );

      const selectedCategories = Array.from(checkedBoxes).map(
        (input) => input.value
      );

      const categoryFiltered = applyCategories(priceFiltered, selectedCategories);

      updateProductItemForFilter(categoryFiltered);
    } catch (filterErr) {
      console.error("Error applying filters:", filterErr);
      alert("An error occurred while filtering products.");
    }
  });
} else {
  console.warn("Apply filter button not found.");
}
