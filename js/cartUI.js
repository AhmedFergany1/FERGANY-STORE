import { createElement } from "./ui.js";
import { getTotalPrice } from "./cartData.js"
import { myCart } from "./cartData.js";
import { getLoggedUser } from "./auth.js";
import { saveCart } from "./storage.js";
import { priceCartTotal } from "./cartData.js";
import { checkoutOrder } from "./checkout.js";

import { itemdeletedFromCard } from "./cartData.js";
import { sweetAlertWhenRemoveFromCart } from "./ui.js";

export function initCartUI() {
  try {
    const cartElement = document.querySelector(".cart");
    const cartIcon = document.querySelector(".header__icon-cart .cart-icon");
    const closeCartIcon = document.querySelector(".close-cart");

    if (!cartElement || !cartIcon || !closeCartIcon) {
      console.warn("Cart UI elements missing");
      return;
    }

    cartIcon.addEventListener("click", openMyCart);

    closeCartIcon.addEventListener("click", () => {
      cartElement.style.opacity = 0;
      cartElement.style.right = "-400px";

      setTimeout(() => {
        cartElement.style.display = "none";
      }, 500);
    });

    const mycartFooter = document.querySelector(".mycart-footer");
    if (mycartFooter) {
      mycartFooter.addEventListener("click", openMyCart);
    } else {
      console.warn(".mycart-footer element not found");
    }

    function openMyCart() {
      try {
        cartElement.style.display = "flex";
        setTimeout(() => {
          cartElement.style.opacity = 1;
          cartElement.style.right = 0;
        }, 20);

        checkoutOrder();
      } catch (e) {
        console.error("Failed to open cart UI:", e);
      }
    }
  } catch (e) {
    console.error("Failed to initialize cart UI:", e);
  }
}

export function putItemsInSideCart(product) {
  try {
    createItemForCart(product);
  } catch (e) {
    console.error("Failed to put item in side cart:", e, product);
  }
}

export function removeItemsInSideCart(product) {
  try {
    const itemCart = document.querySelector(`.cart .cart-items .item-cart[data-productid="${product.id}"]`);
    if (itemCart) {
      itemCart.classList.add("removing");
      itemCart.addEventListener('transitionend', () => {
        itemCart.remove();
      }, { once: true });
    } else {
      console.warn("Cart item to remove not found for product:", product.id);
    }
  } catch (e) {
    console.error("Failed to remove item from side cart:", e);
  }
}

const cartItems = document.querySelector(".cart .cart-items");

export function createItemForCart(product) {
  try {
    if (!cartItems) {
      console.warn("Cart items container not found");
      return;
    }

    const ratingCount = product?.rating?.count;
    if (typeof ratingCount !== "number") {
      console.warn("Product rating count invalid", product);
    }
    const stockCount = Math.floor(ratingCount / 10) || 0;

    const itemCart = createElement("div", ["item-cart"], {
      "data-productid": product["id"],
      "data-stock": stockCount,
    });

    const cartImgContainer = createElement("div", ["cart__img-container"], {});
    const cartProductImg = createElement("img", ["cart__product-img"], {
      src: product["image"] || "",
      alt: product["title"] || "product image",
    });
    cartImgContainer.appendChild(cartProductImg);
    itemCart.appendChild(cartImgContainer);

    const contentItemCart = createElement("div", ["content-item-cart"], {});

    const itemCartTitle = createElement("h4", ["item-cart-title"], {});
    itemCartTitle.textContent = product["title"] ? product["title"].slice(0, 25) : "No Title";

    const priceAmountContainer = createElement("div", ["price-amount-container"], {});

    const priceItemCart = createElement("p", ["price-item-cart"], {});
    priceItemCart.textContent = (typeof product["price"] === "number") ? `${product["price"]}$` : "Price N/A";

    const amountItemPara = createElement("p", ["amount-item-para"], {});

    const minusIcon = createElement("i", ["bi", "bi-dash-circle-fill", "minus"], {});
    minusIcon.addEventListener("click", () => {
      try {
        plusIcon.style.disabled = false;
        plusIcon.style.color = "black";

        const myQuantity = myCart.get(product["id"]);

        if (!myQuantity || myQuantity <= 1) {
          const addCartBtn = document.querySelector(`.add-to-cart[data-productid="${product.id}"]`);
          if (addCartBtn) itemdeletedFromCard(addCartBtn, product);
          sweetAlertWhenRemoveFromCart(product["title"]);
          return;
        }

        const newQuantity = myQuantity - 1;
        myCart.set(product["id"], newQuantity);

        amountSpan.dataset.amount = newQuantity;
        amountSpan.textContent = `Amount: ${newQuantity}`;

        getTotalPrice()
          .then((totalPrice) => {
            if (priceCartTotal) priceCartTotal.textContent = `${totalPrice}$`;
          })
          .catch((err) => console.error("Error getting total price:", err));

        const user = getLoggedUser();
        if (user && user.id) {
          saveCart(user.id, myCart);
        }
      } catch (e) {
        console.error("Error in minusIcon click handler:", e);
      }
    });

    const currentAmount = myCart.get(product["id"]) || 1;
    const amountSpan = createElement("span", ["amount-span"], {
      "data-amount": currentAmount,
    });
    amountSpan.textContent = `Amount: ${currentAmount}`;

    const plusIcon = createElement("i", ["bi", "bi-plus-circle-fill", "plus"], {});
    plusIcon.addEventListener("click", () => {
      try {
        if (parseInt(amountSpan.dataset.amount) === stockCount) {
          plusIcon.style.disabled = true;
          plusIcon.style.color = "#0000006b";
        } else {
          const id = product["id"];
          myCart.set(id, (myCart.get(id) || 0) + 1);

          amountSpan.dataset.amount = String(parseInt(amountSpan.dataset.amount) + 1);
          amountSpan.textContent = `Amount: ${amountSpan.dataset.amount}`;

          getTotalPrice()
            .then((totalPrice) => {
              if (priceCartTotal) priceCartTotal.textContent = `${totalPrice}$`;
            })
            .catch((err) => console.error("Error getting total price:", err));

          const user = getLoggedUser();
          if (user && user.id) {
            saveCart(user.id, myCart);
          }
        }
      } catch (e) {
        console.error("Error in plusIcon click handler:", e);
      }
    });

    amountItemPara.append(minusIcon, amountSpan, plusIcon);

    const deleteItem = createElement("button", ["delete-item"], {});
    const removeIcon = createElement("i", ["fa-solid", "fa-trash-can", "remove-icon"], {});
    removeIcon.addEventListener("click", () => {
      try {
        const addCartBtn = document.querySelector(`.add-to-cart[data-productid="${product.id}"]`);
        if (addCartBtn) {
          itemdeletedFromCard(addCartBtn, product);
        }
        sweetAlertWhenRemoveFromCart(product["title"]);
      } catch (e) {
        console.error("Error removing item on trash icon click:", e);
      }
    });

    deleteItem.appendChild(removeIcon);

    priceAmountContainer.append(priceItemCart, amountItemPara, deleteItem);

    const stockCart = createElement("p", ["stock-cart"], {});
    stockCart.textContent = `stock: ${stockCount}`;

    contentItemCart.append(itemCartTitle, priceAmountContainer, stockCart);

    itemCart.append(contentItemCart);

    cartItems.appendChild(itemCart);
  } catch (e) {
    console.error("Failed to create item for cart:", e, product);
  }
}
