import { myCart } from "./cartData.js";
import { getLoggedUser } from "./auth.js";

export function checkoutOrder(){
    const shipOrdersBtn = document.querySelector(".ship-orders");
    const popup = document.getElementById("orderPopup");
    const closeBtn = document.querySelector(".close-order-popup");
    const submitOrderBtn = document.querySelector(".submit-order-btn");
    const orderForm = document.querySelector("#orderForm");

    shipOrdersBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    orderForm.addEventListener("submit", (event) => {
        event.preventDefault();

        Swal.fire({
            title: 'Thank You!',
            text: 'Your order has been successfully checked out.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            orderForm.reset();
            myCart.clear();
            localStorage.removeItem(`cart_${getLoggedUser().id}`);
            window.location.reload();
        });
    });
}
