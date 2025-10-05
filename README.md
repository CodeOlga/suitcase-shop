# Suitcase E-Shop

## 📖 Project Overview

This is a responsive multi-page e-commerce website for selling travel suitcases.  
The project is built with **HTML, SCSS, and Vanilla JavaScript** (no frameworks).  
Design is based on the provided Figma template.

**Key features:**

- Homepage with product carousel and featured categories
- Catalog page with filtering, sorting, search, and pagination
- Product details page with reviews and related items
- About Us and Contact pages
- Shopping cart with LocalStorage persistence and discounts

## ⚙️ Prerequisites

Before you start, make sure you have installed:

- Node.js (version 16 or higher)
- npm (comes with Node.js)

## 🚀 Setup & Installation

**Clone the repository:**

```bash
git clone <repository-url>
cd project-template-ua
```

**Install dependencies:**

```bash
npm install
```

**Compile SCSS into CSS (watch mode):**

```bash
npm run sass
```

The compiled CSS will be placed in `dist/css/main.css`.

> **CSS paths (Live Server)**
> SCSS compiles into `dist/css`. With the current Live Server setup (opening files from `src/`), the paths are already configured — **no changes needed**:
>
> - `src/index.html` includes CSS as:
>   `<link rel="stylesheet" href="../dist/css/main.css">`
> - pages in `src/pages/*.html` include CSS as:
>   `<link rel="stylesheet" href="../../dist/css/main.css">`
>
> You may switch to a single path `/dist/css/main.css` later if you run Live Server from the project root. This is **optional**.

**Open the project in browser:**

Open src/index.html in your browser
(recommended: use Live Server in VS Code for local development)

## 🧹 Code Quality

**Run linters:**

For JavaScript:

```bash
npm run lint:js
```

For SCSS:

```bash
npm run lint:css
```

## 📂 Project Structure

```text
src/
├── assets/
├── js/
├── scss/
├── pages/
│   ├── about.html
│   ├── cart.html
│   ├── catalog.html
│   ├── contact.html
│   └── product.html
└── index.html

dist/
├── css/
```

## 📝 Notes

Cart data and user actions are stored in LocalStorage.

Discounts apply automatically when order total exceeds $3,000.

The project is tested in Chrome and Firefox for cross-browser compatibility.

## 📌 Project Stages

### Stage 1. Setup

Clone the template repository.

Install dependencies (npm install).

Set up Sass compilation (npm run sass).

Configure ESLint and Stylelint.

Create minimal README.md.

### Stage 2. Layout (HTML + SCSS)

Build semantic HTML for all pages.

Implement global styles and reusable components in SCSS.

Use Flexbox / Grid for layouts.

Keep design consistent with Figma template.

### Stage 3. Responsive Design

Add breakpoints: 768px, 1024px, 1440px.

Ensure no horizontal scroll.

Make fonts and spacing readable on all devices.

Adapt navigation for mobile (hamburger menu).

### Stage 4. Interactivity & Functionality (JavaScript)

Header/footer navigation and account/cart icons.

Homepage: carousel, featured/new products from JSON, Add to Cart.

Catalog: filtering, sorting, search, pagination.

Product details: dynamic loading, quantity selector, reviews, “You May Also Like”.

About & Contact pages: content, form validation, submission messages.

Cart page: add/update/remove items, clear cart, apply discounts, LocalStorage persistence.

### Stage 5. Compilation, Verification & Submission

Run linters and fix issues.

Test full functionality across browsers/devices.

Push all changes to the remote repository.

Ensure project meets requirements before submission.
