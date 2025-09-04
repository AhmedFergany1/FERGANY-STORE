import { createElement } from "./ui.js";
import { addOrDeleteBtn } from "./ui.js";
import { myCart } from "./cartData.js";
import { openPopup } from "./popup.js";
import { itemAddedToCard, itemdeletedFromCard } from "./cartData.js";

export function createProductList(products, container) {
  container.innerHTML = "";

  products.forEach(product => {

    const productItem = createElement("div", ["products__item"], {
      "data-productid": product.id
    });

    productItem.addEventListener("click", (event)=> {
        event.stopPropagation();
        openPopup(product);
    })

    const overlay = createElement("div", ["overlay"], {});
    overlay.textContent = "Show Details";
    productItem.appendChild(overlay);

    // img-product-container
    const imgProductContainer = createElement("div", ["img-product-container"], {});

    const imgProduct = createElement("img", [], {"src": product["image"]});

    imgProductContainer.appendChild(imgProduct);
    productItem.appendChild(imgProductContainer);


    // products__item-details
    const productsItemDetails = createElement("div", ["products__item-details"], {});

    const productsItemTitle = createElement("p", ["products__item-title"], {});
    productsItemTitle.textContent = product["title"];

    const productsItemHeadPrice = createElement("p", ["products__item-head-price"], {});

    const productsItemPrice = createElement("span", ["products__item-price"], {});
    productsItemPrice.textContent = `${product["price"]}$`;
    productsItemHeadPrice.append("Price: ", productsItemPrice);

    const productsItemAddToCart = createElement("button", ["add-to-cart", "item-add-btn"], {"data-productid":product["id"]});
    addOrDeleteBtn(productsItemAddToCart);
    productsItemAddToCart.addEventListener("click", (event) => {
      event.stopPropagation();

      if(myCart.has(product["id"])){
        itemdeletedFromCard(productsItemAddToCart, product);
      }else {
        itemAddedToCard(productsItemAddToCart, product);
      }
    })

    productsItemDetails.appendChild(productsItemTitle);
    productsItemDetails.appendChild(productsItemHeadPrice);
    productsItemDetails.appendChild(productsItemAddToCart);

    productItem.appendChild(productsItemDetails);

    container.appendChild(productItem);
  });
}

