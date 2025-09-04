import {
  applyPrice,
  applyCategories,
  minAndMaxProductPrice,
} from "./filters.js";
import { getProducts, getProductById, getProductCategories } from "./api.js";
import { getLoggedUser } from "./auth.js";
import { loadCartFromLocalStorage } from "./storage.js";
import { createProductList } from "./products.js";
import { initHeaderUI } from "./headerUI.js";
import { updateProductItemForFilter } from "./productRenderer.js";
import { allAndFilterBtnHandle, createCheckCategories } from "./filtersUI.js";
import { initCartUI } from "./cartUI.js";
import { initSlider } from "./slider.js";

const user = getLoggedUser();
if (!user) window.location.href = "../index.html";

// const cart = loadCart(user.id);

let mainProducts;
export let productCategoried;


const preloader = document.querySelector(".preloader");
window.onload = ()=> {

   setTimeout(function(){
        preloader.style.opacity = 0;
        preloader.style.transition = "opacity 300ms";

        setTimeout(()=> {
            preloader.style.display = "none";
        }, 40);

    }, 1500)
}

window.addEventListener("DOMContentLoaded", () => {

  const ownCartName = document.querySelector(".own-cart-name");
  ownCartName.textContent = user.userName;

  initHeaderUI();

  initCartUI();

  initSlider();

  loadCartFromLocalStorage(user.id);


  getProducts().then((products) => {
    mainProducts = products;
    productCategoried = products;
    const container = document.querySelector(".products__row");
    createProductList(products, container);
  });

  getProductCategories().then((categories) => {
    createCheckCategories(categories);
  });

  allAndFilterBtnHandle();
});

const applyFilter = document.querySelector(
  ".products .open-category-filter .apply-filter"
);

applyFilter.addEventListener("click", () => {
  const fromInputValue = parseFloat(
    document.getElementById("fromInput").value.trim()
  );
  const toInputValue = parseFloat(
    document.getElementById("toInput").value.trim()
  );

  let [min, max] = minAndMaxProductPrice(mainProducts);

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
});
