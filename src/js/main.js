import { updateCartCounter } from "./modules/cart.js";
import { initCustomSelects } from "./modules/custom-select.js";
import { initFormValidation, initLoginModal } from "./utils/form-helpers.js";

import "./modules/slider.js";
import "./modules/header-menu.js";
import "./pages/products.js";

function initPageScripts() {
  const path = window.location.pathname;

  if (path.includes("catalog")) {
    import("./pages/catalog.js").then(() => {
      initCustomSelects();
    });
  }

  if (path.includes("product-details-template")) {
    import("./pages/product-details.js").then(() => {
      initCustomSelects();
    });
    initFormValidation("#review-form");
  }

  if (path.includes("cart")) {
    import("./pages/cart-page.js").then(({ initCartPage }) => {
      initCartPage();
    });
  }

  if (path.includes("contact")) {
    initFormValidation(".contact-form form");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  initPageScripts();
  initLoginModal();

  document.querySelectorAll("use[href]").forEach((use) => {
    const val = use.getAttribute("href");
    use.setAttribute("xlink:href", val);
  });
});
