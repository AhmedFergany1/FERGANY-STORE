import { createElement, updateCartBtnStyle } from "./ui.js";
import { addOrDeleteBtn } from "./ui.js";
import { myCart } from "./cartData.js";
import { openPopup } from "./popup.js";
import { itemAddedToCard } from "./cartData.js";
import {
  sweetAlertWhenAddItemToCart,
  sweetAlertWhenItemAlreadyAdded
} from "./ui.js";

export function createProductList(products, container) {
  try {
    if (!Array.isArray(products)) {
      console.error("'products' must be an array.");
      return;
    }

    if (!container || !(container instanceof HTMLElement)) {
      console.error("Invalid container element.");
      return;
    }

    container.innerHTML = "";

    products.forEach((product) => {
      if (!product || typeof product !== "object" || !product.id) {
        console.warn("Skipping invalid product:", product);
        return;
      }

      const productItem = createElement("div", ["products__item"], {
        "data-productid": product.id,
      });

      productItem.addEventListener("click", (event) => {
        event.stopPropagation();
        try {
          openPopup(product);
        } catch (popupErr) {
          console.error("Failed to open popup:", popupErr);
        }
      });

      const overlay = createElement("div", ["overlay"], {});
      overlay.textContent = "Show Details";
      productItem.appendChild(overlay);

      const imgProductContainer = createElement("div", ["img-product-container"], {});
      const imgProduct = createElement("img", [], { src: product.image || "" });

      imgProductContainer.appendChild(imgProduct);
      productItem.appendChild(imgProductContainer);

      const productsItemDetails = createElement("div", ["products__item-details"], {});
      const productsItemTitle = createElement("p", ["products__item-title"], {});
      productsItemTitle.textContent = product.title || "Unknown";

      const productsItemHeadPrice = createElement("p", ["products__item-head-price"], {});
      const productsItemPrice = createElement("span", ["products__item-price"], {});
      productsItemPrice.textContent = `${product.price ?? "0"}$`;

      productsItemHeadPrice.append("Price: ", productsItemPrice);

      const productsItemAddToCart = createElement("button", ["add-to-cart", "item-add-btn"], {
        "data-productid": product.id,
      });

      addOrDeleteBtn(productsItemAddToCart);

      // Hover design
      productsItemAddToCart.addEventListener("mouseenter", () => {
        productsItemAddToCart.closest(".products__item")?.classList.add("no-hover");
      });

      productsItemAddToCart.addEventListener("mouseleave", () => {
        productsItemAddToCart.closest(".products__item")?.classList.remove("no-hover");
      });

      // Click to add to cart
      productsItemAddToCart.addEventListener("click", (event) => {
        event.stopPropagation();
        try {
          if (myCart.has(product.id)) {
            sweetAlertWhenItemAlreadyAdded(product.title);
          } else {
            itemAddedToCard(productsItemAddToCart, product);
            sweetAlertWhenAddItemToCart();
          }
        } catch (err) {
          console.error("Failed to add item to cart:", err);
        }
      });

      productsItemDetails.appendChild(productsItemTitle);
      productsItemDetails.appendChild(productsItemHeadPrice);
      productsItemDetails.appendChild(productsItemAddToCart);

      productItem.appendChild(productsItemDetails);

      container.appendChild(productItem);
    });
  } catch (err) {
    console.error("Error in createProductList:", err);
  }
}
