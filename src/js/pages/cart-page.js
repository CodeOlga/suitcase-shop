import {
  updateCartCounter,
  getCart,
  saveCart,
  clearCart,
} from "../modules/cart.js";
import { BASE } from "../utils/utils.js";

const $ = (sel, root = document) => root.querySelector(sel);

function showCartAlert(
  variant,
  text,
  { persist = false, assertive = false } = {}
) {
  const el = document.querySelector("#cart-alert");
  if (!el) return;

  el.className = "cart-alert";
  if (variant) el.classList.add(`alert-${variant}`);
  el.hidden = !text;

  el.textContent = text || "";

  el.setAttribute("aria-live", assertive ? "assertive" : "polite");

  clearTimeout(el._hideTimer);
  if (!persist && text) {
    el._hideTimer = setTimeout(() => (el.hidden = true), 4500);
  }
}

function hideCartAlert() {
  const el = document.querySelector("#cart-alert");
  if (!el) return;
  el.hidden = true;
  el.textContent = "";
  el.className = "cart-alert";
  clearTimeout(el._hideTimer);
}

function itemHTML(item) {
  return `
    <a href="./product-details-template.html?id=${
      item.id
    }" class="cart-item-link">
      <img src="${BASE}/${item.imageUrl.replace(/^\.\//, "")}" alt="${
    item.name
  }" />
    </a>
    <div class="item-info">
      <h3>
        <a href="./product.html?id=${item.id}" class="product-link">${
    item.name
  }</a>
      </h3>
      <p>Size: ${item.size || "-"}</p>
      <p>Color: ${item.color || "-"}</p>
    </div>
    <p class="price">$${item.price}</p>
    <div class="cart-qty">
      <button class="qty-btn decrease" aria-label="Decrease quantity">-</button>
      <input type="number" class="qty-input" value="${
        item.qty
      }" min="1" inputmode="numeric" />
      <button class="qty-btn increase" aria-label="Increase quantity">+</button>
    </div>
    <p class="item-total">$${(item.price * item.qty).toFixed(2)}</p>
    <button class="remove-btn" aria-label="Remove item">
      <svg width="16" height="16">
        <use href="${BASE}/assets/sprite/sprite.svg#icon-trash"></use>
      </svg>
    </button>
  `;
}

function renderCart() {
  const cart = getCart();
  const list = $("#cart-items");
  const subtotalEl = $("#cart-subtotal");
  const shippingEl = $("#cart-shipping");
  const totalEl = $("#cart-total");

  list.innerHTML = "";

  if (cart.length === 0) {
    subtotalEl.textContent = "$0";
    shippingEl.textContent = "$0";
    totalEl.textContent = "$0";
    showCartAlert(
      "info",
      "Your cart is empty. Use the catalog to add new items.",
      { persist: true }
    );
    updateCartCounter();
    return;
  }

  hideCartAlert();

  let subtotal = 0;

  cart.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = itemHTML(item);

    row.querySelector(".decrease").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
        saveCart(cart);
        renderCart();
      }
    });

    row.querySelector(".increase").addEventListener("click", () => {
      item.qty++;
      saveCart(cart);
      renderCart();
    });

    row.querySelector(".qty-input").addEventListener("change", (e) => {
      const val = Math.max(1, parseInt(e.target.value, 10) || 1);
      item.qty = val;
      saveCart(cart);
      renderCart();
    });

    row.querySelector(".remove-btn").addEventListener("click", () => {
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    });

    list.appendChild(row);
    subtotal += item.price * (item.qty || 1);
  });

  let discountApplied = false;
  if (subtotal > 3000) {
    subtotal *= 0.9;
    discountApplied = true;
  }

  const shipping = cart.length > 0 ? 30 : 0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  if (discountApplied) {
    showCartAlert(
      "success",
      "🎉 You received a 10% discount for orders over $3000!"
    );
  } else {
    hideCartAlert();
  }

  updateCartCounter();
}

export function initCartPage() {
  renderCart();

  $("#clear-cart").addEventListener("click", () => {
    clearCart();
    renderCart();
  });

  $("#checkout").addEventListener("click", () => {
    clearCart();
    renderCart();
    showCartAlert(
      "primary",
      "Thank you for your purchase! Your order has been placed successfully. ✨"
    );
  });
}
