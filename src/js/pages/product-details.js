import { addToCart, updateCartCounter } from "../modules/cart.js";
import { fillCustomSelect } from "../modules/custom-select.js";
import { BASE, renderProducts, shuffle } from "../utils/utils.js";
import {
  getProductId,
  renderStars,
  loadTemplate,
  setThumbs,
  initQuantityControls,
  initTabs,
} from "../utils/product-helpers.js";

const $ = (sel, root = document) => root.querySelector(sel);

(async function init() {
  updateCartCounter();

  const res = await fetch(`${BASE}/assets/data.json`);
  const data = await res.json();

  const productId = getProductId();
  const product = data.data.find((p) => p.id === productId);

  if (!product) {
    $("main").innerHTML = "<p>Product not found</p>";
    return;
  }

  $("#product-image").src = `${BASE}/${product.imageUrl}`;
  $("#product-image").alt = product.name;
  $("#product-title").textContent = product.name;

  const priceText =
    product.priceMin && product.priceMax
      ? `$${product.priceMin}–$${product.priceMax}`
      : `$${product.price}`;
  $("#product-price").textContent = priceText;

  $("#product-desc").textContent = product.description || "";
  renderStars($("#product-rating"), product.rating);

  fillCustomSelect($("#size-wrapper"), product.sizes || product.size || []);
  fillCustomSelect($("#color-wrapper"), product.colors || product.color || []);
  fillCustomSelect(
    $("#category-wrapper"),
    product.categories || (product.category ? [product.category] : [])
  );

  const imgs =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : Array(4).fill(product.imageUrl);
  setThumbs(imgs, $("#product-image"));

  initQuantityControls(product);

  initTabs();

  const tpl = await loadTemplate();
  const relatedWrap = $("#related-products");
  const candidates = shuffle(data.data.filter((p) => p.id !== productId)).slice(
    0,
    4
  );
  renderProducts(candidates, relatedWrap, tpl, addToCart);
})();
