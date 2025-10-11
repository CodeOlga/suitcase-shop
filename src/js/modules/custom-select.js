export function initCustomSelects() {
  const wraps = document.querySelectorAll(".custom-select[data-select]");
  if (!wraps.length) return;

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // ✅ 1) Проста надійна заміна на мобільних/тач
  if (isTouch) {
    wraps.forEach((wrap) => {
      const trigger = wrap.querySelector("[data-select-trigger]");
      const list = wrap.querySelector("[data-select-options]");
      const hidden = wrap.nextElementSibling; // ваш <input type="hidden" ...>
      if (!list || !hidden) return;

      // створюємо нативний select
      const select = document.createElement("select");
      select.className = "native-select";
      const labelId = trigger?.getAttribute("aria-labelledby") || "";
      if (labelId) select.setAttribute("aria-labelledby", labelId);

      // перша "порожня" опція (як "Choose option")
      const firstOpt = document.createElement("option");
      firstOpt.value = "";
      firstOpt.textContent = "Choose option";
      select.appendChild(firstOpt);

      // переносимо <li data-value="..."> в <option>
      [...list.querySelectorAll("li[data-value]")].forEach((li) => {
        const opt = document.createElement("option");
        opt.value = li.dataset.value ?? "";
        opt.textContent = li.textContent.trim();
        select.appendChild(opt);
      });

      // підміняємо .custom-select нативним <select>
      wrap.replaceWith(select);

      // синхронізуємо hidden input (щоб ваші фільтри НЕ міняти взагалі)
      select.addEventListener("change", () => {
        hidden.value = select.value;
        hidden.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    // ✅ показуємо селекти тільки після заміни
    document.body.classList.add("selects-ready");
    // важливо: на touch-девісах далі нічого не ініціалізуємо
    return;
  }

  const open = (wrap) => {
    wrap.classList.add("open");
    const t = wrap.querySelector("[data-select-trigger]");
    if (t) t.setAttribute("aria-expanded", "true");
  };

  const close = (wrap) => {
    wrap.classList.remove("open");
    const t = wrap.querySelector("[data-select-trigger]");
    if (t) t.setAttribute("aria-expanded", "false");
  };

  const closeAll = (except = null) => {
    wraps.forEach((w) => {
      if (w !== except) close(w);
    });
  };

  // document.addEventListener("click", (e) => {
  //   const host = e.target.closest(".custom-select[data-select]");
  //   if (!host) closeAll();
  // });
  document.addEventListener("click", (e) => {
    const host = e.target.closest(".custom-select[data-select]");
    if (!host) {
      closeAll();
    } else {
      // 💡 не закривай одразу після торкання, дай шанс опціям вибратись
      if (isTouch) e.stopPropagation();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  wraps.forEach((wrap) => {
    const trigger = wrap.querySelector("[data-select-trigger]");
    const list = wrap.querySelector("[data-select-options]");
    const hidden = wrap.nextElementSibling;
    if (!trigger || !list || !hidden) return;

    if (!trigger.hasAttribute("aria-expanded")) {
      trigger.setAttribute("aria-expanded", "false");
    }

    if (!isTouch) {
      wrap.addEventListener("mouseenter", () => open(wrap));
      wrap.addEventListener("mouseleave", () => close(wrap));
      trigger.addEventListener("focus", () => open(wrap));
      wrap.addEventListener("focusout", (e) => {
        if (!wrap.contains(e.relatedTarget)) close(wrap);
      });
    }

    // trigger.addEventListener("click", (e) => {
    //   if (!isTouch) return;
    //   e.preventDefault();
    //   e.stopPropagation();
    //   const willOpen = !wrap.classList.contains("open");
    //   closeAll();
    //   willOpen ? open(wrap) : close(wrap);
    // });

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const willOpen = !wrap.classList.contains("open");
      closeAll();

      if (willOpen) {
        open(wrap); // ✅ відкриває список
      } else {
        close(wrap); // ✅ закриває при повторному тапі
      }
    });

    const selectLi = (li) => {
      list.querySelectorAll("li").forEach((n) => {
        n.classList.toggle("active", n === li);
      });

      trigger.textContent = li.textContent.trim();
      hidden.value = li.dataset.value ?? "";
      hidden.dispatchEvent(new Event("change", { bubbles: true }));

      if (isTouch) close(wrap);
    };

    list.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-value]");
      if (li) selectLi(li);
    });

    const items = Array.from(list.querySelectorAll("li"));
    items.forEach((li, i) => {
      li.tabIndex = 0;
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectLi(li);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          (items[i + 1] || items[0]).focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          (items[i - 1] || items[items.length - 1]).focus();
        }
      });
    });
  });
}

export function fillCustomSelect(wrapper, options) {
  if (!wrapper) return;

  const trigger = wrapper.querySelector("[data-select-trigger]");
  const optionsList = wrapper.querySelector("[data-select-options]");
  const hiddenInput = wrapper.nextElementSibling;
  if (!trigger || !optionsList || !hiddenInput) return;

  let values = [];
  if (Array.isArray(options)) values = options;
  else if (options != null) values = [options];

  optionsList.innerHTML = "";

  values.forEach((opt) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.dataset.value = opt;
    li.tabIndex = 0;
    optionsList.appendChild(li);
  });

  const selectLi = (li) => {
    optionsList.querySelectorAll("li").forEach((n) => {
      n.classList.toggle("active", n === li);
    });
    trigger.textContent = li.textContent.trim();
    hiddenInput.value = li.dataset.value ?? "";
    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
    trigger.blur();
  };

  optionsList.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-value]");
    if (li) selectLi(li);
  });

  optionsList.querySelectorAll("li").forEach((li) => {
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectLi(li);
      }
    });
  });

  if (!trigger.hasAttribute("aria-expanded")) {
    trigger.setAttribute("aria-expanded", "false");
  }
}
