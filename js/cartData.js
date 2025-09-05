import { putItemsInSideCart, removeItemsInSideCart } from "./cartUI.js";
import { updateCartBtnStyle } from "./ui.js";
import { getLoggedUser } from "./auth.js";
import { saveCart } from "./storage.js";
import { getProductById } from "./api.js";

export let myCart = new Map();

export const cartTopCartTitle = document.querySelector(".cart .cart__top-cart-title span");
export const priceCartTotal = document.querySelector(".bottom-cart .price-cart-total");
export const cartCount = document.querySelector(".header .header__icon-cart .cart-count");

function safelyUpdateTextContent(el, text) {
  if (el) {
    el.textContent = text;
  } else {
    console.warn("DOM element not found while updating text content");
  }
}

export async function getTotalPrice() {
  let totalPrice = 0;

  for (const [productId, quantity] of myCart.entries()) {
    try {
      const product = await getProductById(productId);
      if (product && typeof product.price === "number") {
        totalPrice += product.price * quantity;
      } else {
        console.warn(`Invalid product data for ID: ${productId}`, product);
      }
    } catch (err) {
      console.error(`Failed to get product ${productId}:`, err);
    }
  }

  return totalPrice.toFixed(3);
}

export function itemAddedToCard(cartbtn, product) {
  try {
    updateCartBtnStyle(cartbtn, true);

    // Safely parse and increment cart count
    const currentCount = parseInt(cartCount?.dataset.cartcount || "0", 10);
    const newCount = currentCount + 1;

    if (cartCount) {
      cartCount.dataset.cartcount = newCount;
      cartCount.textContent = newCount;
    }

    safelyUpdateTextContent(cartTopCartTitle, `(${newCount} item in cart)`);

    myCart.set(product["id"], 1);

    getTotalPrice()
      .then((totalPrice) => {
        safelyUpdateTextContent(priceCartTotal, `${totalPrice}$`);
      })
      .catch((err) => console.error("Error updating total price:", err));

    putItemsInSideCart(product);

    checkIfCartIsEmpty();

    const user = getLoggedUser();
    if (user && user.id) {
      saveCart(user.id, myCart);
    } else {
      console.warn("No logged-in user found. Cart not saved.");
    }
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
}

export function itemdeletedFromCard(cartbtn, product) {
  try {
    updateCartBtnStyle(cartbtn, false);

    const currentCount = parseInt(cartCount?.dataset.cartcount || "1", 10);
    const newCount = Math.max(currentCount - 1, 0);

    if (cartCount) {
      cartCount.dataset.cartcount = newCount;
      cartCount.textContent = newCount;
    }

    safelyUpdateTextContent(cartTopCartTitle, `(${newCount} item in cart)`);

    myCart.delete(product["id"]);

    getTotalPrice()
      .then((totalPrice) => {
        safelyUpdateTextContent(priceCartTotal, `${totalPrice}$`);
      })
      .catch((err) => console.error("Error updating total price:", err));

    removeItemsInSideCart(product);

    checkIfCartIsEmpty();

    const user = getLoggedUser();
    if (user && user.id) {
      saveCart(user.id, myCart);
    } else {
      console.warn("No logged-in user found. Cart not saved.");
    }
  } catch (error) {
    console.error("Failed to delete item from cart:", error);
  }
}

export function checkIfCartIsEmpty() {
  try {
    const emptyCartTxt = document.querySelector(".emptycart");
    if (!emptyCartTxt) {
      console.warn("Empty cart text element not found.");
      return;
    }

    emptyCartTxt.style.display = myCart.size === 0 ? "block" : "none";
  } catch (error) {
    console.error("Failed to check if cart is empty:", error);
  }
}
