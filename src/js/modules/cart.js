// вся логіка LocalStorage
const CART_KEY = "cart";

export function getCart() {
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

  // fallback для старих даних (quantity → qty)
  cart = cart.map((item) => {
    if (item.quantity && !item.qty) {
      item.qty = item.quantity;
      delete item.quantity;
    }
    return item;
  });

  return cart;
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function addToCart(product, qty = 1) {
  const cart = getCart();

  // шукаємо дубль за id + size + color
  const existing = cart.find(
    (item) =>
      item.id === product.id &&
      item.size === product.size &&
      item.color === product.color
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  saveCart(cart);
  updateCartCounter();
}

export function updateCartCounter() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, i) => sum + (i.qty || 0), 0);

  const counterEl = document.querySelector(".cart-counter");
  if (counterEl) {
    counterEl.textContent = totalQty > 0 ? totalQty : "";
  }
}
