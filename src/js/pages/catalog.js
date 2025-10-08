import { renderProducts, BASE } from "../utils/utils.js";
import { addToCart, updateCartCounter } from "../modules/cart.js";

let allProducts = [];
let filtered = [];
let currentPage = 1;
const perPage = 12;
let cardTpl = "";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function getValue(sel, fallback = "") {
  const el = $(sel);
  if (!el) return fallback;
  return el.value ?? fallback;
}

function applyFilters() {
  const category = getValue("#filter-category");
  const color = getValue("#filter-color");
  const size = getValue("#filter-size");
  const sale = getValue("#filter-sale");

  filtered = allProducts.filter((p) => {
    if (category && p.category !== category) return false;

    const colors = Array.isArray(p.colors)
      ? p.colors
      : [p.color].filter(Boolean);
    const sizes = Array.isArray(p.sizes) ? p.sizes : [p.size].filter(Boolean);

    if (color && !colors.includes(color)) return false;
    if (size && !sizes.includes(size)) return false;

    if (sale) {
      if (sale === "true" && !p.salesStatus) return false;
      if (sale === "false" && p.salesStatus) return false;
    }
    return true;
  });

  applySort();
}

function applySort() {
  const sort = getValue("#sort", "default");

  const by = {
    "price-asc": (a, b) => (a.price ?? 0) - (b.price ?? 0),
    "price-desc": (a, b) => (b.price ?? 0) - (a.price ?? 0),
    popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
    rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  };

  if (by[sort]) {
    filtered = [...filtered].sort(by[sort]);
  }
  renderPage(1);
}

function renderPage(page) {
  currentPage = page;

  const grid = $("#catalog-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = filtered.slice(start, end);

  renderProducts(items, grid, cardTpl, addToCart);
  updateResultsCount();
  updatePagination();
}

function updateResultsCount() {
  const info = $("#results-count");
  if (!info) return;

  const total = filtered.length;
  const start = total ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, total);

  info.textContent = total
    ? `Showing ${start}–${end} of ${total} results`
    : "No results found";
  info.classList.toggle("no-results", !total);
}

function updatePagination() {
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageInfo = $("#page-info");
  if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  const prev = $("#prev-page");
  const next = $("#next-page");
  if (prev) prev.disabled = currentPage === 1;
  if (next) next.disabled = currentPage === totalPages;
}

function initSearch() {
  const input = $("#search");
  if (!input) return;

  const openProduct = (q) => {
    const query = String(q || "")
      .trim()
      .toLowerCase();
    if (!query) return;

    const found =
      allProducts.find((p) => (p.name || "").toLowerCase() === query) ||
      allProducts.find((p) => (p.name || "").toLowerCase().includes(query));

    if (found) {
      window.location.href = `${BASE}/pages/product-details-template.html?id=${found.id}`;
    } else {
      showPopup("Product not found");
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openProduct(input.value);
  });
}

function renderBestSets() {
  const box = $("#best-sets-grid");
  if (!box) return;

  const sets = allProducts.filter((p) => p.category === "luggage sets");
  if (!sets.length) return;

  const pick = [...sets].sort(() => Math.random() - 0.5);
  box.innerHTML = pick
    .map(
      (p) => `
    <div class="best-set-item">
      <a href="${BASE}/pages/product-details-template.html?id=${encodeURIComponent(
        p.id
      )}" class="best-set-link">
        <img src="${BASE}/${p.imageUrl}" alt="${p.name}" loading="lazy">
      </a>
      <div class="best-set-info">
        <a href="${BASE}/pages/product-details-template.html?id=${encodeURIComponent(
        p.id
      )}" class="best-set-name">
          ${p.name}
        </a>
        <div class="best-set-rating">
          ${Array.from({ length: 5 })
            .map((_, i) =>
              i < (p.rating || 0)
                ? `<svg class="star star-yellow"><use href="${BASE}/assets/sprite/sprite.svg#icon-star-yellow"></use></svg>`
                : `<svg class="star star-grey"><use href="${BASE}/assets/sprite/sprite.svg#icon-star-grey"></use></svg>`
            )
            .join("")}
        </div>
        <p class="best-set-price">$${p.price}</p>
      </div>
    </div>
  `
    )
    .join("");
}

function resetFiltersUI() {
  const DEFAULT_TEXT = "Choose option";

  ["#filter-size", "#filter-color", "#filter-category", "#filter-sale"].forEach(
    (sel) => {
      const el = $(sel);
      if (!el) return;
      el.value = "";
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  );

  const sortEl = $("#sort");
  if (sortEl) {
    sortEl.value = "default";
    sortEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  $$(
    ".filters-top .custom-select[data-select], .sort-box .custom-select[data-select]"
  ).forEach((wrap) => {
    const trigger = wrap.querySelector("[data-select-trigger]");
    const list = wrap.querySelector("[data-select-options]");
    const isSort = wrap.closest(".sort-box") != null;

    if (trigger) {
      trigger.textContent = isSort ? "Default Sorting" : DEFAULT_TEXT;
      trigger.setAttribute("aria-expanded", "false");
    }
    if (list) {
      list.querySelectorAll("li").forEach((li) => {
        const shouldBeActive = isSort ? li.dataset.value === "default" : false;
        li.classList.toggle("active", shouldBeActive);
        if (shouldBeActive) li.setAttribute("aria-selected", "true");
        else li.removeAttribute("aria-selected");
      });
    }
    wrap.classList.remove("open");
  });
}

(function initCatalog() {
  updateCartCounter();

  fetch(`${BASE}/assets/data.json`)
    // const dataUrl = window.location.hostname.includes("netlify.app")
    //   ? "/src/assets/data.json"
    //   : `${BASE}/assets/data.json`;

    // fetch(dataUrl)
    .then((r) => r.json())
    .then((data) => {
      allProducts = Array.isArray(data) ? data : data.data;

      const tplEl = document.querySelector("#product-card-tpl");
      cardTpl = tplEl ? tplEl.innerHTML : "";

      filtered = allProducts;
      applySort();

      [
        "#filter-size",
        "#filter-color",
        "#filter-category",
        "#filter-sale",
      ].forEach((sel) => {
        const el = $(sel);
        if (el) el.addEventListener("change", applyFilters);
      });

      const sortEl = $("#sort");
      if (sortEl) sortEl.addEventListener("change", applySort);

      const prev = $("#prev-page");
      const next = $("#next-page");
      if (prev)
        prev.addEventListener(
          "click",
          () => currentPage > 1 && renderPage(currentPage - 1)
        );
      if (next)
        next.addEventListener("click", () => {
          const totalPages = Math.ceil(filtered.length / perPage) || 1;
          if (currentPage < totalPages) renderPage(currentPage + 1);
        });

      const resetBtn = $("#reset-filters");
      if (resetBtn)
        resetBtn.addEventListener("click", () => {
          resetFiltersUI();
          filtered = allProducts;
          applySort();
        });

      initSearch();
      renderBestSets();

      const hideBtn = $("#hide-filters");
      const filtersTop = document.querySelector(".filters-top");
      if (hideBtn && filtersTop) {
        hideBtn.addEventListener("click", () => {
          filtersTop.classList.toggle("collapsed");
          hideBtn.textContent = filtersTop.classList.contains("collapsed")
            ? "Show Filters"
            : "Hide Filters";
        });
      }
    });
})();

function showPopup(message) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  const closeBtn = document.getElementById("popup-close");
  if (!popup || !msg || !closeBtn) return;

  msg.textContent = message;
  popup.classList.add("show");
  popup.setAttribute("aria-hidden", "false");

  closeBtn.onclick = () => {
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
  };

  popup.onclick = (e) => {
    if (e.target === popup) {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
    }
  };
}
