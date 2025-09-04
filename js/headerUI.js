import { logOut } from "./auth.js";

export function initHeaderUI() {
  const logoutBtn = document.querySelector(".logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logOut);
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
    console.warn("Header elements not found");
    return;
  }

  // Toggle dropdown menu
  window.addEventListener("click", (ev) => {
    ev.stopPropagation();
    if (ev.target === dropListElement) {
      navLinkElement.classList.toggle("active");
    } else {
      navLinkElement.classList.remove("active");
    }
  });

  // Sticky header + Top arrow show/hide
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 500) {
      headerElement.classList.add("fixed-bar");
      topArrow.style.display = "block";
    } else {
      headerElement.classList.remove("fixed-bar");
      topArrow.style.display = "none";
    }
  });

  // Scroll to top
  topArrow.addEventListener("click", function (event) {
    event.stopPropagation();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
