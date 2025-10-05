document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const navBar = document.querySelector(".nav-bar");
  const overlay = document.querySelector(".menu-overlay");
  if (!burger || !navBar || !overlay) return;

  const toggle = () => {
    burger.classList.toggle("active");
    navBar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  };

  burger.addEventListener("click", toggle);
  overlay.addEventListener("click", toggle);
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.addEventListener("click", toggle));
});
