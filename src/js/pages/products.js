import { addToCart, updateCartCounter } from "../modules/cart.js";
import { BASE, renderProducts } from "../utils/utils.js";

Promise.all([
  // fetch(`${BASE}/assets/data.json`).then((r) => r.json()),
  // fetch(`${BASE}/components/product-card.html`).then((r) => r.text()),
  fetch("/assets/data.json", { cache: "no-store" }).then((r) => r.json()),
  fetch(`${BASE}/components/product-card.html`).then((r) => r.text()),
])
  .then(([data, cardTpl]) => {
    const selectedContainer = document.querySelector(".selected-products-grid");
    if (selectedContainer) {
      const selected = data.data.filter((p) =>
        p.blocks.includes("Selected Products")
      );
      renderProducts(selected, selectedContainer, cardTpl, addToCart);
    }

    const newContainer = document.querySelector(".new-products-grid");
    if (newContainer) {
      const arrivals = data.data.filter((p) =>
        p.blocks.includes("New Products Arrival")
      );
      renderProducts(arrivals, newContainer, cardTpl, addToCart);
    }

    updateCartCounter();
  })
  .catch((err) => console.error("Load products error:", err));
