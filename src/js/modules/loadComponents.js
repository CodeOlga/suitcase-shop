// якщо робити дінамічно - додати active class на поточну та підключити його в main.js

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#header", "/components/header.html");
  loadComponent("#footer", "/components/footer.html");
});

function loadComponent(selector, url) {
  fetch(url)
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch((error) => console.error("Error loading component:", error));
}
