// import "./slider.js";
// import "./products.js";
// import { updateCartCounter } from "./cart.js";
// // import "./loadComponents.js"; // якщо потрібно

// // Для конкретних сторінок підключаємо потрібний файл
// if (window.location.pathname.includes("product-details-template.html")) {
//   import("./product-details.js");
// }

// document.addEventListener("DOMContentLoaded", () => {
//   updateCartCounter();
// });

import "./modules/slider.js";
import "./pages/products.js";
import { updateCartCounter } from "./modules/cart.js";

// Для конкретних сторінок підключаємо потрібний файл
function initPageScripts() {
  const path = window.location.pathname;

  if (path.includes("product-details-template.html")) {
    import("./pages/product-details.js");
  }

  if (path.includes("cart.html")) {
    import("./pages/cart-page.js");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  initPageScripts();
});
