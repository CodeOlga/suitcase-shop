// LocalStorage
const CART_KEY = "cart";

export function getCart() {
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

  return cart.map((item) => ({
    ...item,
    qty: item.qty || 1,
  }));
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function addToCart(product, qty = 1) {
  const cart = getCart();

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

  document.querySelectorAll(".cart-counter").forEach((el) => {
    if (totalQty > 0) {
      el.textContent = String(totalQty);
      el.style.display = "inline-flex";
    } else {
      el.textContent = "";
      el.style.display = "none";
    }
  });
}
