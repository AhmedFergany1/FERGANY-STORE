import { myCart } from "./cartData.js";
import { getLoggedUser } from "./auth.js";

export function checkoutOrder() {
  try {
    const shipOrdersBtn = document.querySelector(".ship-orders");
    const orderPopup = document.getElementById("orderPopup");
    const closeBtn = document.querySelector(".close-order-popup");
    const submitOrderBtn = document.querySelector(".submit-order-btn");
    const orderForm = document.querySelector("#orderForm");

    // Check for required DOM elements
    if (!shipOrdersBtn || !orderPopup || !closeBtn || !submitOrderBtn || !orderForm) {
      console.warn("One or more checkout elements are missing from the DOM.");
      return;
    }

    // Handle open order popup
    shipOrdersBtn.addEventListener("click", () => {
      try {
        if (myCart.size === 0) {
          if (typeof Swal !== "undefined") {
            Swal.fire({
              title: "Cart is Empty!",
              text: "Let's fill your cart up first!",
              icon: "warning",
              confirmButtonText: "OK",
            });
          } else {
            alert("Cart is empty! Add items before checking out.");
          }
        } else {
          orderPopup.style.display = "flex";
        }
      } catch (err) {
        console.error("Error handling shipOrdersBtn click:", err);
      }
    });

    // Handle close popup
    closeBtn.addEventListener("click", () => {
      try {
        orderPopup.style.display = "none";
      } catch (err) {
        console.error("Error closing order popup:", err);
      }
    });

    // Handle form submit
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        if (typeof Swal !== "undefined") {
          Swal.fire({
            title: "Thank You!",
            text: "Your order has been successfully checked out.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            try {
              orderForm.reset();
              myCart.clear();

              const user = getLoggedUser();
              if (user && user.id) {
                localStorage.removeItem(`cart_${user.id}`);
              } else {
                console.warn("No logged-in user found. Cart not removed.");
              }

              window.location.reload();
            } catch (innerErr) {
              console.error("Error during order confirmation cleanup:", innerErr);
            }
          });
        } else {
          alert("Order submitted. Thank you!");
        }
      } catch (err) {
        console.error("Error handling order form submit:", err);
      }
    });

  } catch (error) {
    console.error("Failed to initialize checkout order logic:", error);
  }
}
