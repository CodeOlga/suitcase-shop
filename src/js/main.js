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

// 🩵 Safari SVG fix (absolute path + xlink support)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("use[href]").forEach((el) => {
    const href = el.getAttribute("href");
    if (!href) return;

    // робимо абсолютний шлях
    const absHref = href.startsWith("http")
      ? href
      : window.location.origin + href.replace(/^(\.)?/, "");

    // додаємо xlink:href для Safari
    el.setAttribute("xlink:href", absHref);
  });
});
