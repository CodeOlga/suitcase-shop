// export function initCustomSelects() {
//   const wraps = document.querySelectorAll(".custom-select[data-select]");
//   if (!wraps.length) return;

//   const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

//   const open = (wrap) => {
//     wrap.classList.add("open");
//     const t = wrap.querySelector("[data-select-trigger]");
//     if (t) t.setAttribute("aria-expanded", "true");
//   };

//   const close = (wrap) => {
//     wrap.classList.remove("open");
//     const t = wrap.querySelector("[data-select-trigger]");
//     if (t) t.setAttribute("aria-expanded", "false");
//   };

//   const closeAll = (except = null) => {
//     wraps.forEach((w) => {
//       if (w !== except) close(w);
//     });
//   };

//   // document.addEventListener("click", (e) => {
//   //   const host = e.target.closest(".custom-select[data-select]");
//   //   if (!host) closeAll();
//   // });
//   document.addEventListener("click", (e) => {
//     const host = e.target.closest(".custom-select[data-select]");
//     if (!host) {
//       closeAll();
//     } else {
//       // 💡 не закривай одразу після торкання, дай шанс опціям вибратись
//       if (isTouch) e.stopPropagation();
//     }
//   });

//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") closeAll();
//   });

//   wraps.forEach((wrap) => {
//     const trigger = wrap.querySelector("[data-select-trigger]");
//     const list = wrap.querySelector("[data-select-options]");
//     const hidden = wrap.nextElementSibling;
//     if (!trigger || !list || !hidden) return;

//     if (!trigger.hasAttribute("aria-expanded")) {
//       trigger.setAttribute("aria-expanded", "false");
//     }

//     if (!isTouch) {
//       wrap.addEventListener("mouseenter", () => open(wrap));
//       wrap.addEventListener("mouseleave", () => close(wrap));
//       trigger.addEventListener("focus", () => open(wrap));
//       wrap.addEventListener("focusout", (e) => {
//         if (!wrap.contains(e.relatedTarget)) close(wrap);
//       });
//     }

//     // trigger.addEventListener("click", (e) => {
//     //   if (!isTouch) return;
//     //   e.preventDefault();
//     //   e.stopPropagation();
//     //   const willOpen = !wrap.classList.contains("open");
//     //   closeAll();
//     //   willOpen ? open(wrap) : close(wrap);
//     // });

//     trigger.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();

//       const willOpen = !wrap.classList.contains("open");
//       closeAll();

//       if (willOpen) {
//         open(wrap); // ✅ відкриває список
//       } else {
//         close(wrap); // ✅ закриває при повторному тапі
//       }
//     });

//     const selectLi = (li) => {
//       list.querySelectorAll("li").forEach((n) => {
//         n.classList.toggle("active", n === li);
//       });

//       trigger.textContent = li.textContent.trim();
//       hidden.value = li.dataset.value ?? "";
//       hidden.dispatchEvent(new Event("change", { bubbles: true }));

//       if (isTouch) close(wrap);
//     };

//     list.addEventListener("click", (e) => {
//       const li = e.target.closest("li[data-value]");
//       if (li) selectLi(li);
//     });

//     const items = Array.from(list.querySelectorAll("li"));
//     items.forEach((li, i) => {
//       li.tabIndex = 0;
//       li.addEventListener("keydown", (e) => {
//         if (e.key === "Enter" || e.key === " ") {
//           e.preventDefault();
//           selectLi(li);
//         } else if (e.key === "ArrowDown") {
//           e.preventDefault();
//           (items[i + 1] || items[0]).focus();
//         } else if (e.key === "ArrowUp") {
//           e.preventDefault();
//           (items[i - 1] || items[items.length - 1]).focus();
//         }
//       });
//     });
//   });
// }

export function initCustomSelects() {
  const selects = document.querySelectorAll(".custom-select[data-select]");
  if (!selects.length) return;

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  selects.forEach((select) => {
    const trigger = select.querySelector("[data-select-trigger]");
    const list = select.querySelector("[data-select-options]");
    const hidden = select.nextElementSibling;
    if (!trigger || !list || !hidden) return;

    // Закрити інші відкриті селекти
    const closeAll = (except = null) => {
      selects.forEach((s) => {
        if (s !== except) s.classList.remove("open");
        const t = s.querySelector("[data-select-trigger]");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    };

    // Клік поза селектом закриває список
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".custom-select[data-select]")) closeAll();
    });

    // Відкриття / закриття при кліку
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = select.classList.contains("open");
      closeAll();

      if (!isOpen) {
        select.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      } else {
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    // Вибір пункту
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-value]");
      if (!li) return;

      list.querySelectorAll("li").forEach((n) => n.classList.remove("active"));
      li.classList.add("active");

      trigger.textContent = li.textContent.trim();
      hidden.value = li.dataset.value ?? "";
      hidden.dispatchEvent(new Event("change", { bubbles: true }));

      select.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    });

    // Додатково: клавіша Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });

    // На десктопі можна залишити hover-ефект (нічого не ламає)
    if (!isTouch) {
      select.addEventListener("mouseenter", () => {
        trigger.setAttribute("aria-expanded", "true");
      });
      select.addEventListener("mouseleave", () => {
        trigger.setAttribute("aria-expanded", "false");
      });
    }
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
