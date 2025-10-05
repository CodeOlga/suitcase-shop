export function initFormValidation(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;
    let errors = [];

    form
      .querySelectorAll("input[required], textarea[required]")
      .forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          errors.push(`${field.name} is required`);
        }
        if (field.type === "email" && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            valid = false;
            errors.push("Please enter a valid email address");
          }
        }
      });

    const msg = form.querySelector(".form-msg");
    if (msg) {
      if (valid) {
        msg.textContent = "✅ Thank you! Your form was submitted successfully.";
        msg.style.color = "green";
        form.reset();
      } else {
        msg.textContent = "❌ " + errors.join(". ");
        msg.style.color = "red";
      }
    }
  });
}

export function initLoginModal() {
  const modal = document.getElementById("login-modal");
  if (!modal) return;

  const triggers = document.querySelectorAll(
    '.icon-btn[aria-label="Account"], [data-login-trigger]'
  );
  const overlay = modal.querySelector(".modal-overlay");
  const closeBtn = modal.querySelector(".modal-close");
  const form = modal.querySelector("#login-form");
  const emailInput = modal.querySelector('input[name="email"]');
  const passwordInput = modal.querySelector('input[name="password"]');
  const togglePassword = modal.querySelector(".toggle-password");
  const msg = form?.querySelector(".form-msg");

  let lastFocused = null;

  const pageSiblings = Array.from(document.body.children).filter(
    (el) => el !== modal
  );

  const setInert = (on) => {
    pageSiblings.forEach((el) => {
      if (on) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
    document.body.classList.toggle("modal-open", on);
  };

  const openModal = () => {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.classList.add("open");
    setInert(true);
    (emailInput || closeBtn || modal).focus();
  };

  const closeModal = () => {
    setInert(false);
    modal.classList.remove("open");
    modal.hidden = true;
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  };

  const closeMobileMenuIfOpen = () => {
    const burger = document.querySelector(".burger");
    const navBar = document.querySelector(".nav-bar");
    const menuOverlay = document.querySelector(".menu-overlay");
    if (navBar?.classList.contains("active")) {
      burger?.classList.remove("active");
      navBar.classList.remove("active", "nav-animate");
      menuOverlay?.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  };

  triggers.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMobileMenuIfOpen();
      openModal();
    })
  );

  closeBtn?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;

    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const focusables = modal.querySelectorAll(
        "a[href], area[href], button:not([disabled]), input:not([disabled]), " +
          "select:not([disabled]), textarea:not([disabled]), " +
          '[tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusables).filter(
        (el) => el.offsetParent !== null
      );
      if (!list.length) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  });

  modal.hidden = true;
  modal.classList.remove("open");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const useEl = togglePassword.querySelector("use");
      if (!useEl) return;

      const curr =
        useEl.getAttribute("href") || useEl.getAttribute("xlink:href") || "";
      const toOff = curr.replace(/(eye)(?!-off)/, "eye-off");
      const toEye = curr.replace(/eye-off/, "eye");

      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";

      const nextHref = isHidden ? toOff : toEye;
      useEl.setAttribute("href", nextHref);
      useEl.setAttribute("xlink:href", nextHref);
      togglePassword.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
    });
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!msg) return;

    msg.textContent = "";
    const email = form.email.value.trim();
    const password = passwordInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "red";
      return;
    }
    if (!password) {
      msg.textContent = "❌ Password is required.";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "✅ Logged in successfully!";
    msg.style.color = "green";
    setTimeout(closeModal, 1000);
    form.reset();
  });
}
