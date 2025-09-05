import { myCart } from "./cartData.js";
import { getProductById } from "./api.js";
import { putItemsInSideCart } from "./cartUI.js";
import { getTotalPrice } from "./cartData.js";
import { updateCartBtnStyle } from "./ui.js";
import { cartCount } from "./cartData.js";
import { cartTopCartTitle } from "./cartData.js";
import { priceCartTotal } from "./cartData.js";
import { checkIfCartIsEmpty } from "./cartData.js";

export function saveCart(userId, cartMap) {
  try {
    const cartObj = Object.fromEntries(cartMap);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartObj));
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
}

export function loadCartFromLocalStorage(userId) {
  try {
    const savedCart = localStorage.getItem(`cart_${userId}`);
    if (!savedCart) {
      checkIfCartIsEmpty();
      return;
    }

    let parsedCart;
    try {
      parsedCart = JSON.parse(savedCart);
    } catch (parseErr) {
      console.error("Error parsing saved cart JSON:", parseErr);
      checkIfCartIsEmpty();
      return;
    }

    if (typeof parsedCart !== "object" || parsedCart === null) {
      console.warn("Parsed cart is not a valid object:", parsedCart);
      checkIfCartIsEmpty();
      return;
    }

    myCart.clear();
    for (const [k, v] of Object.entries(parsedCart)) {
      const keyNum = Number(k);
      const valueNum = Number(v);

      if (isNaN(keyNum) || isNaN(valueNum)) {
        console.warn(`Invalid cart entry key or value. Key: ${k}, Value: ${v}`);
        continue;
      }

      myCart.set(keyNum, valueNum);
    }

    checkIfCartIsEmpty();

    for (const [productId, quantity] of myCart.entries()) {
      getProductById(productId)
        .then(product => {
          if (!product) {
            console.warn(`Product with ID ${productId} not found.`);
            return;
          }

          // Inject product into cart UI as many times as quantity
          for (let i = 0; i < quantity; i++) {
            putItemsInSideCart(product);
          }

          const amountSpan = document.querySelector(`.item-cart[data-productid="${productId}"] .amount-span`);
          if (amountSpan) {
            amountSpan.setAttribute("data-amount", quantity);
            amountSpan.textContent = `Amount: ${quantity}`;
          }

          // Sync "Add to cart" buttons state with MutationObserver
          const observer = new MutationObserver(() => {
            const cardBtn = document.querySelector(`.item-add-btn[data-productid="${productId}"]`);
            const popupBtn = document.querySelector(`.popup-add-btn[data-productid="${productId}"]`);

            if (cardBtn || popupBtn) {
              [cardBtn, popupBtn].forEach(btn => {
                if (btn) updateCartBtnStyle(btn, true);
              });
              observer.disconnect(); // Stop observing once updated
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          cartCount.textContent = myCart.size;
          cartCount.dataset.cartcount = myCart.size;
          cartTopCartTitle.textContent = `(${myCart.size} item${myCart.size !== 1 ? 's' : ''} in cart)`;

          getTotalPrice()
            .then(total => {
              priceCartTotal.textContent = `${total}$`;
            })
            .catch(err => console.error("Error getting total price:", err));

        })
        .catch(err => {
          console.error(`Error fetching product with ID ${productId}:`, err);
        });
    }
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
  }
}
