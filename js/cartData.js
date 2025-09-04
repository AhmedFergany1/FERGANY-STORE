import { putItemsInSideCart, removeItemsInSideCart } from "./cartUI.js";
import { updateCartBtnStyle } from "./ui.js";
import { getLoggedUser } from "./auth.js";
import { saveCart } from "./storage.js";
import { getProductById } from "./api.js";

export let myCart = new Map();

export const cartTopCartTitle = document.querySelector(
  ".cart .cart__top-cart-title span"
);
export const priceCartTotal = document.querySelector(".bottom-cart .price-cart-total");

export async function getTotalPrice() {
  let totalPrice = 0;

  for (const [productId, quantity] of myCart.entries()) {
    try {
      const product = await getProductById(productId);
      totalPrice += product.price * quantity;
    } catch (err) {
      console.error(err);
    }
  }

  return totalPrice.toFixed(2);
}

// Add item to cart
export const cartCount = document.querySelector(".header .header__icon-cart .cart-count");
export function itemAddedToCard(cartbtn, product) {
  updateCartBtnStyle(cartbtn, true);

  cartCount.textContent = ++cartCount.dataset.cartcount;
  cartTopCartTitle.textContent = `(${cartCount.dataset.cartcount} item in cart)`;

  myCart.set(product["id"], 1);

  getTotalPrice()
    .then((totalPrice) => {
      priceCartTotal.textContent = `${totalPrice}$`;
    })
    .catch(console.log);

  putItemsInSideCart(product);

  saveCart(getLoggedUser().id, myCart);
}

// Remove item from cart
export function itemdeletedFromCard(cartbtn, product) {
  updateCartBtnStyle(cartbtn, false);

  cartCount.textContent = --cartCount.dataset.cartcount;
  cartTopCartTitle.textContent = `(${cartCount.dataset.cartcount} item in cart)`;

  myCart.delete(product["id"]);

  getTotalPrice()
    .then((totalPrice) => {
      priceCartTotal.textContent = `${totalPrice}$`;
    })
    .catch(console.log);

  removeItemsInSideCart(product);

  saveCart(getLoggedUser().id, myCart);
}
