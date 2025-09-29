// базовий шлях до кореня сайту
// (щоб коректно працювали посилання на сторінках у підпапках)
export const BASE = window.location.pathname.includes("/pages/") ? ".." : ".";

// шаблонна підстановка
export function fillTemplate(tpl, map) {
  let out = tpl;
  Object.entries(map).forEach(([k, v]) => {
    out = out.replaceAll(`{{${k}}}`, String(v));
  });
  return out;
}

// рендер карток у контейнер
export function renderProducts(products, container, tpl, addToCart) {
  products.forEach((p) => {
    const html = fillTemplate(tpl, {
      id: p.id,
      name: p.name,
      price: p.price,
      img1x: `${BASE}/${p.imageUrl}`,
      img2x: `${BASE}/${(p.imageUrl || "").replace("@1x", "@2x")}`,
      badge: p.salesStatus ? `<span class="badge">SALE</span>` : "",
    });

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    const card = wrapper.firstElementChild;

    // клік по картці → перехід у деталі
    card.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart")) return;
      window.location.href = `${BASE}/pages/product-details-template.html?id=${p.id}`;
    });

    // кнопка "Add To Cart"
    card.querySelector(".add-to-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p, 1);
    });

    container.appendChild(card);
  });
}

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
