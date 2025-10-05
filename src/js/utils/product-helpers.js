import { BASE } from "./utils.js";
import { addToCart } from "../modules/cart.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function getProductId() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

export function renderStars(container, rating = 0) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.round(r);
  const empty = 5 - full;
  container.innerHTML = "";

  for (let i = 0; i < full; i++) {
    container.innerHTML += `
      <svg class="star star-full" width="20" height="20" aria-hidden="true">
        <use href="${BASE}/assets/sprite/sprite.svg#icon-star-yellow"></use>
      </svg>`;
  }

  for (let i = 0; i < empty; i++) {
    container.innerHTML += `
      <svg class="star star-empty" width="20" height="20" aria-hidden="true">
        <use href="${BASE}/assets/sprite/sprite.svg#icon-star-grey"></use>
      </svg>`;
  }
}

export async function loadTemplate() {
  const res = await fetch(`${BASE}/components/product-card.html`);
  return res.text();
}

export function fillSelect(selectEl, items) {
  if (!selectEl) return;
  if (!items) return;

  if (typeof items === "string") items = [items];
  if (!Array.isArray(items) || items.length === 0) return;

  const frag = document.createDocumentFragment();
  items.forEach((val) => {
    const opt = document.createElement("option");
    opt.value = String(val);
    opt.textContent = String(val);
    frag.appendChild(opt);
  });
  selectEl.appendChild(frag);
}

export function setThumbs(images, mainImgEl) {
  const box = $("#product-thumbs");
  box.innerHTML = "";

  (images || []).slice(0, 4).forEach((src, i) => {
    const btn = document.createElement("button");
    if (i === 0) btn.classList.add("active");
    btn.innerHTML = `<img src="${BASE}/${src}" alt="thumbnail ${i + 1}" />`;

    btn.addEventListener("click", () => {
      $$(".thumbs button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mainImgEl.src = `${BASE}/${src}`;
    });

    box.appendChild(btn);
  });
}

export function initQuantityControls(product) {
  const qtyInput = $("#quantity");

  $("#decrease").addEventListener("click", () => {
    const cur = Math.max(1, parseInt(qtyInput.value || "1", 10) - 1);
    qtyInput.value = String(cur);
  });

  $("#increase").addEventListener("click", () => {
    const cur = Math.max(1, parseInt(qtyInput.value || "1", 10) + 1);
    qtyInput.value = String(cur);
  });

  $("#add-to-cart").addEventListener("click", () => {
    const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
    addToCart(product, qty);
  });
}

export function initTabs() {
  const tabs = $$(".tabs li");
  const contents = $$(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      $(`#tab-${tab.dataset.tab}`).classList.add("active");
    });
  });
}
