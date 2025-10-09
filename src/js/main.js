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
});

// Safari SVG fix: тільки додати xlink:href, НЕ змінюючи шлях
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("use").forEach((use) => {
    const val =
      use.getAttribute("href") ||
      use.getAttributeNS("http://www.w3.org/1999/xlink", "href");
    if (!val) return;
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", val);
  });
});
