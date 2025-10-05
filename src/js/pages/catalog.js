import { renderProducts, BASE } from "../utils/utils.js";
import { addToCart, updateCartCounter } from "../modules/cart.js";

let allProducts = [];
let filtered = [];
let currentPage = 1;
const perPage = 12;
let cardTpl = "";

function applyFilters() {
  const category = document.querySelector("#filter-category").value;
  const color = document.querySelector("#filter-color").value;
  const size = document.querySelector("#filter-size").value;
  const sale = document.querySelector("#filter-sale").value;

  filtered = allProducts.filter((p) => {
    let ok = true;

    if (category && p.category !== category) ok = false;

    const colors = Array.isArray(p.colors)
      ? p.colors
      : [p.color].filter(Boolean);
    const sizes = Array.isArray(p.sizes) ? p.sizes : [p.size].filter(Boolean);

    if (color && !colors.includes(color)) ok = false;
    if (size && !sizes.includes(size)) ok = false;

    if (sale) {
      if (sale === "true" && !p.salesStatus) ok = false;
      if (sale === "false" && p.salesStatus) ok = false;
    }

    return ok;
  });

  applySort();
}

function applySort() {
  const sort = document.querySelector("#sort").value;

  const by = {
    "price-asc": (a, b) => (a.price ?? 0) - (b.price ?? 0),
    "price-desc": (a, b) => (b.price ?? 0) - (a.price ?? 0),
    popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
    rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  };

  if (by[sort]) filtered.sort(by[sort]);

  renderPage(1);
}

function renderPage(page) {
  currentPage = page;

  const grid = document.querySelector("#catalog-grid");
  grid.innerHTML = "";

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = filtered.slice(start, end);

  renderProducts(items, grid, cardTpl, addToCart);
  updateResultsCount();
  updatePagination();
}

function updateResultsCount() {
  const info = document.querySelector("#results-count");
  const total = filtered.length;
  const start = total ? (currentPage - 1) * perPage + 1 : 0;
  const end = Math.min(currentPage * perPage, total);

  if (total) {
    info.textContent = `Showing ${start}–${end} of ${total} results`;
    info.classList.remove("no-results");
  } else {
    info.textContent = "No results found";
    info.classList.add("no-results");
  }
}

function updatePagination() {
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  document.querySelector(
    "#page-info"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
  document.querySelector("#prev-page").disabled = currentPage === 1;
  document.querySelector("#next-page").disabled = currentPage === totalPages;
}

function initSearch() {
  const input = document.querySelector("#search");
  if (!input) return;

  const openProduct = (q) => {
    const query = String(q || "")
      .trim()
      .toLowerCase();
    if (!query) return;

    let found =
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
  const box = document.querySelector("#best-sets-grid");
  if (!box) return;

  const sets = allProducts.filter((p) => p.category === "luggage sets");
  if (sets.length === 0) return;

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

  box.querySelectorAll(".best-set-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-id");
      window.location.href = `${BASE}/pages/product-details-template.html?id=${id}`;
    });
  });
}

(async function initCatalog() {
  updateCartCounter();

  const data = await fetch(`${BASE}/assets/data.json`).then((r) => r.json());

  allProducts = Array.isArray(data) ? data : data.data;

  const tplEl = document.querySelector("#product-card-tpl");
  cardTpl = tplEl ? tplEl.innerHTML : "";

  filtered = allProducts;
  applySort();

  document
    .querySelectorAll(
      "#filter-size, #filter-color, #filter-category, #filter-sale"
    )
    .forEach((input) => {
      input.addEventListener("change", applyFilters);
    });

  document.querySelector("#reset-filters").addEventListener("click", () => {
    document
      .querySelectorAll(".filters-top input[type=hidden]")
      .forEach((inp) => {
        inp.value = "";
      });

    document
      .querySelectorAll(".filters-top [data-select-trigger]")
      .forEach((btn) => {
        btn.textContent = "Choose option";
      });

    filtered = allProducts;
    applySort();
  });

  document.querySelector("#sort").addEventListener("change", applySort);

  document.querySelector("#prev-page").addEventListener("click", () => {
    if (currentPage > 1) renderPage(currentPage - 1);
  });

  document.querySelector("#next-page").addEventListener("click", () => {
    const totalPages = Math.ceil(filtered.length / perPage);
    if (currentPage < totalPages) renderPage(currentPage + 1);
  });

  initSearch();

  renderBestSets();

  const hideBtn = document.getElementById("hide-filters");
  const filtersTop = document.querySelector(".filters-top");

  if (hideBtn && filtersTop) {
    hideBtn.addEventListener("click", () => {
      filtersTop.classList.toggle("collapsed");

      if (filtersTop.classList.contains("collapsed")) {
        hideBtn.textContent = "Show Filters";
      } else {
        hideBtn.textContent = "Hide Filters";
      }
    });
  }
})();

function showPopup(message) {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  const closeBtn = document.getElementById("popup-close");

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
