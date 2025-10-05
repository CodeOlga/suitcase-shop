export function initCustomSelects() {
  const wraps = document.querySelectorAll(".custom-select[data-select]");
  if (!wraps.length) return;

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const closeAll = () => {
    wraps.forEach((w) => {
      w.classList.remove("open");
      const t = w.querySelector("[data-select-trigger]");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  };

  if (isTouch) {
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".custom-select[data-select]")) closeAll();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  }

  wraps.forEach((wrap) => {
    const trigger = wrap.querySelector("[data-select-trigger]");
    const list = wrap.querySelector("[data-select-options]");
    const hidden = wrap.nextElementSibling;
    if (!trigger || !list || !hidden) return;

    list.setAttribute("role", "listbox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    if (isTouch) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !wrap.classList.contains("open");
        closeAll();
        wrap.classList.toggle("open", willOpen);
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    }

    list.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-value]");
      if (!li) return;

      list.querySelectorAll("li").forEach((n) => {
        const active = n === li;
        n.classList.toggle("active", active);
        n.setAttribute("aria-selected", active ? "true" : "false");
      });

      trigger.textContent = li.textContent.trim();
      hidden.value = li.dataset.value ?? "";
      hidden.dispatchEvent(new Event("change", { bubbles: true }));

      if (isTouch) {
        wrap.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        trigger.blur();
      }
    });

    list.querySelectorAll("li").forEach((li) => {
      li.setAttribute("role", "option");
      li.tabIndex = 0;
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          li.click();
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

  const values = Array.isArray(options) ? options : options ? [options] : [];
  optionsList.innerHTML = "";

  values.forEach((opt) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.dataset.value = opt;
    li.setAttribute("role", "option");
    li.tabIndex = 0;
    optionsList.appendChild(li);
  });

  optionsList.setAttribute("role", "listbox");

  const selectLi = (li) => {
    optionsList.querySelectorAll("li").forEach((n) => {
      const active = n === li;
      n.classList.toggle("active", active);
      n.setAttribute("aria-selected", active ? "true" : "false");
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
}
