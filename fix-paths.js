import fs from "fs";

const cssPath = "./src/css/main.css";
let css = fs.readFileSync(cssPath, "utf8");

// замінюємо тільки для деплою
css = css.replaceAll("../../src/assets", "/assets");

fs.writeFileSync(cssPath, css, "utf8");
console.log("✅ Paths fixed for Netlify deploy");
