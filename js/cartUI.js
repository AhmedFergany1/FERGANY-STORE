import { createElement } from "./ui.js";
import { getTotalPrice } from "./cartData.js"
import { myCart } from "./cartData.js";
import { getLoggedUser } from "./auth.js";
import { saveCart } from "./storage.js";
import { priceCartTotal } from "./cartData.js";
import { checkoutOrder } from "./checkout.js";

export function initCartUI() {
  const cartElement = document.querySelector(".cart");
  const cartIcon = document.querySelector(".header__icon-cart .cart-icon");
  const closeCartIcon = document.querySelector(".close-cart");

  if (!cartElement || !cartIcon || !closeCartIcon) return;

  cartIcon.addEventListener("click", openMyCart);

  closeCartIcon.addEventListener("click", () => {
    cartElement.style.opacity = 0;
    cartElement.style.right = "-400px";

    setTimeout(() => {
      cartElement.style.display = "none";
    }, 500);
  });

  const mycartFooter = document.querySelector(".mycart-footer");
  mycartFooter.addEventListener("click", openMyCart)

  function openMyCart(){
    cartElement.style.display = "flex";
      setTimeout(() => {
        cartElement.style.opacity = 1;
        cartElement.style.right = 0;
      }, 20);

   checkoutOrder();

  }
}


export function putItemsInSideCart(product) {
  createItemForCart(product);
}


// Remove a cart item from DOM
export function removeItemsInSideCart(product) {
  const itemCart = document.querySelector(`.cart .cart-items .item-cart[data-productid="${product.id}"]`);
  if (itemCart) {
    itemCart.remove();
  }
}


const cartItems = document.querySelector(".cart .cart-items");

export function createItemForCart(product) {
  const stockCount = Math.floor(product["rating"]["count"] / 10);

  const itemCart = createElement("div", ["item-cart"], {
    "data-productid": product["id"],
    "data-stock": stockCount,
  });

  const cartImgContainer = createElement("div", ["cart__img-container"], {});

  const cartProductImg = createElement("img", ["cart__product-img"], {
    src: product["image"],
  });

  cartImgContainer.appendChild(cartProductImg);
  itemCart.appendChild(cartImgContainer);

  const contentItemCart = createElement("div", ["content-item-cart"], {});

  const itemCartTitle = createElement("h4", ["item-cart-title"], {});
  itemCartTitle.textContent = product["title"].slice(0, 25);

  const priceAmountContainer = createElement(
    "div",
    ["price-amount-container"],
    {}
  );

  const priceItemCart = createElement("p", ["price-item-cart"], {});
  priceItemCart.textContent = `${product["price"]}$`;

  const amountItemPara = createElement("p", ["amount-item-para"], {});

  const minusIcon = createElement(
    "i",
    ["bi", "bi-dash-circle-fill", "minus"],
    {}
  );
  minusIcon.addEventListener("click", (event) => {
    plusIcon.style.disabled = false;
    plusIcon.style.color = "black";
    const myQuantity = myCart.get(product["id"]);

    if (!myQuantity || myQuantity <= 1) {
      const addCarts = document.querySelector(
        `.add-to-cart[data-productid="${product.id}"]`
      );
      if (addCarts) addCarts.dispatchEvent(new Event("click"));
      return;
    }

    const newQuantity = myQuantity - 1;
    myCart.set(product["id"], newQuantity);

    amountSpan.dataset.amount = newQuantity;
    amountSpan.textContent = `Amount: ${newQuantity}`;

    getTotalPrice().then((totalPrice) => {
      priceCartTotal.textContent = `${totalPrice}$`;
    });

    saveCart(getLoggedUser().id, myCart);
  });

  const currentAmount = myCart.get(product["id"]) || 1;
  const amountSpan = createElement("span", ["amount-span"], {
    "data-amount": currentAmount,
  });
  amountSpan.textContent = `Amount: ${currentAmount}`;

  const plusIcon = createElement(
    "i",
    ["bi", "bi-plus-circle-fill", "plus"],
    {}
  );
  plusIcon.addEventListener("click", (event) => {
    if (amountSpan.dataset.amount == stockCount) {
      plusIcon.style.disabled = true;
      plusIcon.style.color = "#0000006b";
    } else {
      const id = product["id"];
      myCart.set(id, (myCart.get(id) || 0) + 1);

      amountSpan.dataset.amount = ++amountSpan.dataset.amount;
      amountSpan.textContent = `Amount: ${amountSpan.dataset.amount}`;

      getTotalPrice().then((totalPrice) => {
        priceCartTotal.textContent = `${totalPrice}$`;
      });

      saveCart(getLoggedUser().id, myCart);
    }
  });

  amountItemPara.append(minusIcon, amountSpan, plusIcon);
  // priceAmountContainer.append(priceItemCart, amountItemPara);

  const deleteItem = createElement("button", ["delete-item"], {});

  const removeIcon = createElement(
    "i",
    ["fa-solid", "fa-trash-can", "remove-icon"],
    {}
  );

  removeIcon.addEventListener("click", () => {
    const addCarts = document.querySelector(
      `.add-to-cart[data-productid="${product.id}"]`
    );
    addCarts.dispatchEvent(new Event("click")); // dispatch add-to-cart to match deleting
  });

  deleteItem.appendChild(removeIcon);
  priceAmountContainer.append(priceItemCart, amountItemPara, deleteItem);

  const stockCart = createElement("p", ["stock-cart"], {});
  stockCart.textContent = `stock: ${stockCount}`;

  contentItemCart.append(itemCartTitle, priceAmountContainer, stockCart);

  itemCart.append(contentItemCart);

  cartItems.appendChild(itemCart);
}
