import { updateCartBtnStyle } from './ui.js'
import { itemAddedToCard } from './cartData.js';
import { itemdeletedFromCard } from './cartData.js';
import { myCart } from './cartData.js';

// open popup 
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

  popup.classList.add("active");

  popupImg.setAttribute("src", product["image"]);
  popupName.textContent = product["title"];
  popupDesc.textContent = product["description"];
  popupCat.textContent = product["category"];
  popupPrice.textContent = `${product["price"]}$`;
  popupPur.textContent = product["rating"]["count"];
  popupRat.textContent = `${product["rating"]["rate"]} of 5`;

  popupClose.addEventListener("click",closePopup);

  const oldBtn = document.querySelector(".popup-add-btn");

  // ✅ Clone to remove old event listeners
  const newBtn = oldBtn.cloneNode(true);
  newBtn.dataset.productid = product["id"];

  myCart.has(product["id"])
    ? updateCartBtnStyle(newBtn, true)
    : updateCartBtnStyle(newBtn, false);

  newBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    // to match between popup and item btn
    let popupWithMatch = document.querySelector(
      `.item-add-btn[data-productid="${product["id"]}"]`
    );

    if (myCart.has(Number(newBtn.dataset.productid))) {
      itemdeletedFromCard(newBtn, product);
      updateCartBtnStyle(popupWithMatch, false);
    } else {
      itemAddedToCard(newBtn, product);
      updateCartBtnStyle(popupWithMatch, true);
    }
  });

  oldBtn.parentNode.replaceChild(newBtn, oldBtn);
}

export function closePopup() {
  popup.classList.remove("active");
}


