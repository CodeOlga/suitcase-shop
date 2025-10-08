import fs from "fs";

const cssPath = "./src/css/main.css";
let css = fs.readFileSync(cssPath, "utf8");

// замінює всі "../../src/assets" на "/assets" для Netlify
css = css.replaceAll("../../src/assets", "/assets");

fs.writeFileSync(cssPath, css, "utf8");
console.log("✅ Paths fixed for Netlify deploy");
