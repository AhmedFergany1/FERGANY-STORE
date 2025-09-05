import { myCart } from "./cartData.js";

export function createElement(tag, classes = [], attributes = {}) {
  try {
    const el = document.createElement(tag);
    classes.forEach(cls => el.classList.add(cls));
    Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  } catch (err) {
    console.error("Error creating element:", err);
    return null;
  }
}

export function addOrDeleteBtn(btn){
  try {
    if (!btn || !btn.dataset) throw new Error("Invalid button element");

    let btnProduct = btn.dataset.productid;
    // myCart keys might be numbers or strings, so ensure same type
    const isInCart = myCart.has(typeof btnProduct === "string" && !isNaN(btnProduct) ? Number(btnProduct) : btnProduct);
    updateCartBtnStyle(btn, isInCart);
  } catch (err) {
    console.error("Error updating add/delete button:", err);
  }
}

// 
export function updateCartBtnStyle(btn, isInCart) {
  try {
    if (!btn) throw new Error("Button element is null or undefined");

    btn.textContent = isInCart ? "✔️ Added to Cart" : "Add to Cart";
    btn.style.backgroundColor = isInCart ? "#4caf50" : "#ce9345";
    btn.classList.toggle("green-btn", isInCart);
    btn.classList.toggle("yellow-btn", !isInCart);
  } catch (err) {
    console.error("Error updating cart button style:", err);
  }
}

export function sweetAlertWhenAddItemToCart(){
  try {
    Swal.fire({
      title: 'Added to Cart!',
      text: 'The item has been successfully added to your cart.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (err) {
    console.error("Error showing success alert for add item:", err);
  }
}

export function sweetAlertWhenItemAlreadyAdded(productName){
  try {
    Swal.fire({
      title: 'Already Added',
      html: `The item <strong>${productName}</strong> is already in your cart.`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  } catch (err) {
    console.error("Error showing info alert for already added item:", err);
  }
}

export function sweetAlertWhenRemoveFromCart(productName){
  try {
    Swal.fire({
      title: 'Item Removed',
      html: `The item <strong>${productName}</strong> was removed from your cart.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (err) {
    console.error("Error showing success alert for remove item:", err);
  }
}
