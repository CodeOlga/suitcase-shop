import {
  updateCartCounter,
  getCart,
  saveCart,
  clearCart,
} from "../modules/cart.js";
import { BASE } from "../utils/utils.js";

const $ = (sel, root = document) => root.querySelector(sel);

// шаблон одного товару
function getCartItemHTML(item) {
  return `
    <div class="cart-item-info">
      <img src="${BASE}/${item.imageUrl}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>Size: ${item.size || "-"}</p>
        <p>Color: ${item.color || "-"}</p>
        <p class="price">$${item.price}</p>
      </div>
    </div>
    <div class="cart-item-actions">
      <button class="qty-btn decrease">-</button>
      <input type="number" class="qty-input" value="${item.qty}" min="1" />
      <button class="qty-btn increase">+</button>
      <button class="remove-btn">Remove</button>
    </div>
  `;
}

// рендер всіх товарів у корзині
function renderCart() {
  const cart = getCart();
  const container = $("#cart-items");
  const totalEl = $("#cart-total");
  const emptyMsg = $("#cart-empty");

  container.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    totalEl.textContent = "$0";
    updateCartCounter();
    return;
  }

  emptyMsg.style.display = "none";
  let total = 0;

  cart.forEach((item, idx) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = getCartItemHTML(item);

    // кнопка -
    itemEl.querySelector(".decrease").addEventListener("click", () => {
      if (item.qty > 1) item.qty--;
      saveCart(cart);
      renderCart();
    });

    // кнопка +
    itemEl.querySelector(".increase").addEventListener("click", () => {
      item.qty++;
      saveCart(cart);
      renderCart();
    });

    // зміна вручну
    itemEl.querySelector(".qty-input").addEventListener("change", (e) => {
      const val = Math.max(1, parseInt(e.target.value, 10) || 1);
      item.qty = val;
      saveCart(cart);
      renderCart();
    });

    // видалення товару
    itemEl.querySelector(".remove-btn").addEventListener("click", () => {
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    });

    container.appendChild(itemEl);
    total += item.price * item.qty;
  });

  // знижка 10% якщо > 3000$
  if (total > 3000) {
    total *= 0.9;
    $("#discount-msg").style.display = "block";
  } else {
    $("#discount-msg").style.display = "none";
  }

  totalEl.textContent = `$${total.toFixed(2)}`;
  updateCartCounter();
}

// ініціалізація
function initCartPage() {
  renderCart();

  // очистити корзину
  $("#clear-cart").addEventListener("click", () => {
    clearCart();
    renderCart();
  });

  // оформити замовлення
  $("#checkout").addEventListener("click", () => {
    clearCart();
    $("#cart-items").innerHTML = "";
    $("#cart-empty").textContent = "Thank you for your purchase.";
    $("#cart-empty").style.display = "block";
    updateCartCounter();
  });
}

document.addEventListener("DOMContentLoaded", initCartPage);
