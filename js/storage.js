import { myCart } from "./cartData.js";
import { getProductById } from "./api.js";
import { putItemsInSideCart } from "./cartUI.js";
import { getTotalPrice } from "./cartData.js";
import { updateCartBtnStyle } from "./ui.js";
import { cartCount } from "./cartData.js";
import { cartTopCartTitle } from "./cartData.js";
import { priceCartTotal } from "./cartData.js";

export function saveCart(userId, cartMap) {
  const cartObj = Object.fromEntries(cartMap);
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cartObj));
}

export function loadCartFromLocalStorage(userId) {
  const savedCart = localStorage.getItem(`cart_${userId}`);
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart); // It's an object

    myCart.clear();
    for (const [k, v] of Object.entries(parsedCart)) {
      myCart.set(Number(k), Number(v));
    }

    // Re-render cart UI
    for (const [productId, quantity] of myCart.entries()) {
      getProductById(productId).then(product => {
        // Inject multiple copies if quantity > 1
        putItemsInSideCart(product);
        const amountSpan = document.querySelector(`.item-cart[data-productid="${productId}"] .amount-span`);
        if (amountSpan) {
          amountSpan.setAttribute("data-amount", quantity);
          amountSpan.textContent = `Amount: ${quantity}`;
        }

        // Sync "Add to cart" buttons state
        const observer = new MutationObserver(() => {
          const cardBtn = document.querySelector(`.item-add-btn[data-productid="${productId}"]`);
          const popupBtn = document.querySelector(`.popup-add-btn[data-productid="${productId}"]`);

          if (cardBtn || popupBtn) {
            [cardBtn, popupBtn].forEach(btn => {
              if (btn) updateCartBtnStyle(btn, true);
            });
            observer.disconnect(); // stop observing once found
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        cartCount.textContent = myCart.size;
        cartCount.dataset.cartcount = myCart.size;
        cartTopCartTitle.textContent = `(${myCart.size} item in cart)`;

        getTotalPrice().then(total => {
          priceCartTotal.textContent = `${total}$`;
        });

      });
    }
  }
}