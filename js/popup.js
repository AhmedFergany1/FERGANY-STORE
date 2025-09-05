import { updateCartBtnStyle } from './ui.js';
import { itemAddedToCard } from './cartData.js';
import { myCart } from './cartData.js';

import {
  sweetAlertWhenAddItemToCart,
  sweetAlertWhenItemAlreadyAdded,
} from './ui.js';

// DOM Elements (check they exist)
const popup = document.querySelector(".products .popup");
const popupImg = document.querySelector(".products .popup .img-container img");
const popupName = document.querySelector(".products .popup__product-name span");
const popupDesc = document.querySelector(".products .popup__product-desc span");
const popupCat = document.querySelector(".products .popup__product-cat span");
const popupPrice = document.querySelector(".products .popup__product-price span");
const popupPur = document.querySelector(".products .popup__product-pur span");
const popupRat = document.querySelector(".products .popup__product-rat span");
const popupClose = document.querySelector(".products .popup__close");

export function openPopup(product) {
  try {
    if (!popup || !popupImg || !popupName || !popupDesc || !popupCat || !popupPrice || !popupPur || !popupRat || !popupClose) {
      console.warn("Popup elements not fully loaded.");
      return;
    }

    popup.classList.add("active");

    // Safe assignments with optional chaining + fallback
    popupImg.setAttribute("src", product?.image || "");
    popupName.textContent = product?.title || "No Title";
    popupDesc.textContent = product?.description || "No Description";
    popupCat.textContent = product?.category || "Unknown";
    popupPrice.textContent = `${product?.price ?? "0"}$`;
    popupPur.textContent = product?.rating?.count ?? "0";
    popupRat.textContent = `${product?.rating?.rate ?? "0"} of 5`;

    // Avoid multiple event listeners stacking on close button
    popupClose.removeEventListener("click", closePopup); // Remove first to prevent duplicates
    popupClose.addEventListener("click", closePopup);

    // Add to Cart Button Logic
    const oldBtn = document.querySelector(".popup-add-btn");

    if (!oldBtn) {
      console.warn(".popup-add-btn not found.");
      return;
    }

    // Clone to remove old event listeners
    const newBtn = oldBtn.cloneNode(true);
    newBtn.dataset.productid = product?.id;

    // Update add-to-cart button style based on cart status
    if (myCart.has(product?.id)) {
      updateCartBtnStyle(newBtn, true);
    } else {
      updateCartBtnStyle(newBtn, false);
    }

    // Attach Click Handler
    newBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      try {
        const productId = Number(newBtn.dataset.productid);
        const popupWithMatch = document.querySelector(`.item-add-btn[data-productid="${productId}"]`);

        if (myCart.has(productId)) {
          sweetAlertWhenItemAlreadyAdded(product?.title || "Product");
        } else {
          itemAddedToCard(newBtn, product);
          if (popupWithMatch) updateCartBtnStyle(popupWithMatch, true);
          sweetAlertWhenAddItemToCart();
        }
      } catch (err) {
        console.error("Error adding item to cart:", err);
      }
    });

    // Replace old button with new one (removes previous listeners)
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  } catch (err) {
    console.error("Failed to open product popup:", err);
  }
}

export function closePopup() {
  try {
    if (popup) popup.classList.remove("active");
  } catch (err) {
    console.error("Error closing popup:", err);
  }
}
