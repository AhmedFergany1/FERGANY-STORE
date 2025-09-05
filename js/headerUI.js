import { logOut } from "./auth.js";

export function initHeaderUI() {
  try {
    const logoutBtn = document.querySelector(".logout");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        try {
          logOut();
        } catch (err) {
          console.error("Error during logout:", err);
          alert("Failed to log out. Please try again.");
        }
      });
    }

    const headerElement = document.querySelector(".header");
    const dropListElement = document.querySelector(".header__drop-down");
    const navLinkElement = document.querySelector(".header__nav-links");
    const topArrow = document.querySelector(".top-arrow");
    const logOutBtn = document.querySelector(".header .header__nav-item .logout");

    if (
      !headerElement ||
      !dropListElement ||
      !navLinkElement ||
      !topArrow ||
      !logOutBtn
    ) {
      console.warn("One or more header UI elements are missing.");
      return;
    }

    // Toggle dropdown menu
    window.addEventListener("click", (ev) => {
      try {
        ev.stopPropagation();
        if (ev.target === dropListElement) {
          navLinkElement.classList.toggle("active");
        } else {
          navLinkElement.classList.remove("active");
        }
      } catch (err) {
        console.error("Error handling dropdown click:", err);
      }
    });

    // Sticky header and top-arrow visibility
    window.addEventListener("scroll", () => {
      try {
        if (window.scrollY >= 500) {
          headerElement.classList.add("fixed-bar");
          topArrow.style.display = "block";
        } else {
          headerElement.classList.remove("fixed-bar");
          topArrow.style.display = "none";
        }
      } catch (err) {
        console.error("Error handling scroll event:", err);
      }
    });

    // Scroll to top when top-arrow is clicked
    topArrow.addEventListener("click", (event) => {
      try {
        event.stopPropagation();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (err) {
        console.error("Error scrolling to top:", err);
      }
    });

  } catch (error) {
    console.error("initHeaderUI failed:", error);
  }
}
