import { updateCartCounter } from "./modules/cart.js";
import { initCustomSelects } from "./modules/custom-select.js";
import { initFormValidation, initLoginModal } from "./utils/form-helpers.js";

import "./modules/slider.js";
import "./modules/header-menu.js";
import "./pages/products.js";

function initPageScripts() {
  const path = window.location.pathname;

  if (path.includes("catalog.html")) {
    import("./pages/catalog.js").then(() => {
      initCustomSelects();
    });
  }

  if (path.includes("product-details-template.html")) {
    import("./pages/product-details.js").then(() => {
      initCustomSelects();
    });
    initFormValidation("#review-form");
  }

  if (path.includes("cart.html")) {
    import("./pages/cart-page.js").then(({ initCartPage }) => {
      initCartPage();
    });
  }

  if (path.includes("contact.html")) {
    initFormValidation(".contact-form form");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  initPageScripts();
  initLoginModal();
});
