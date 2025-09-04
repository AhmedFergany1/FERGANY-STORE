import { myCart } from "./cartData.js";

export function createElement(tag, classes = [], attributes = {}) {
  const el = document.createElement(tag);
  classes.forEach(cls => el.classList.add(cls));
  Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

export function updateCartBtnStyle(btn, isInCart) {
  btn.textContent = isInCart ? "Delete Item from Cart" : "Add to Cart";
  btn.style.backgroundColor = isInCart ? "red" : "#ce9345";
  btn.classList.toggle("red-btn", isInCart);
  btn.classList.toggle("yellow-btn", !isInCart);
}

export function addOrDeleteBtn(btn){
  let btnProduct = btn.dataset.productid;
  (myCart.has(btnProduct)) ? updateCartBtnStyle(btn,true) : updateCartBtnStyle(btn,false);
}