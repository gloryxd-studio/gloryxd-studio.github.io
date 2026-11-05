(() => {
  "use strict";

  const config = window.GLORYXD;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const dialog = document.querySelector("#project-dialog");
  let returnFocus = null;

  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  };

  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuButton.focus();
    }
  });
  const desktop = window.matchMedia("(min-width: 801px)");
  desktop.addEventListener("change", (event) => { if (event.matches) setMenu(false); });

  document.querySelector("#year").textContent = new Date().getFullYear();
  if (config?.email) {
    document.querySelectorAll("[data-email-text]").forEach((element) => { element.textContent = config.email; });
    document.querySelectorAll("[data-email-link]").forEach((element) => { element.href = `mailto:${config.email}`; });
    document.querySelectorAll("[data-inquiry-link]").forEach((element) => {
      element.href = `mailto:${config.email}?subject=${encodeURIComponent("Let’s talk — GloryXD")}`;
    });
  }

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = config?.projects[button.dataset.project];
      if (!project) return;
      returnFocus = button;
      document.querySelector("#dialog-title").textContent = project.title;
      document.querySelector("#dialog-category").textContent = project.category;
      document.querySelector("#dialog-description").textContent = project.description;
      const image = document.querySelector("#dialog-image");
      image.src = project.image;
      image.alt = project.alt;
      const tags = document.querySelector("#dialog-tags");
      tags.replaceChildren(...project.themes.map((theme) => {
        const item = document.createElement("li");
        item.textContent = theme;
        return item;
      }));
      document.querySelector("#dialog-inquiry").href = `mailto:${config.email}?subject=${encodeURIComponent(`Let’s talk about ${project.title} — GloryXD`)}`;
      dialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });
  document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    returnFocus?.focus({ preventScroll: true });
  });

  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll("a").forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }
})();
