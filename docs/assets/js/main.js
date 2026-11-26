/* Nihongo Academy — static landing page interactions (no dependencies). */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------- Mobile navigation ------------------------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu");
      }
    });
  }

  /* ------------------------- Active nav section ------------------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var tracked = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && tracked.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + visible.target.id);
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] });
    tracked.forEach(function (section) { navObserver.observe(section); });
  }

  /* ------------------------------ Reveal ------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------- Sakura petals --------------------------- */
  function addPetals(containerId, count) {
    var container = document.getElementById(containerId);
    if (!container || reduceMotion) return;
    for (var i = 0; i < count; i += 1) {
      var petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = ((i * 37 + 7) % 100) + "%";
      petal.style.width = 9 + (i % 4) * 3 + "px";
      petal.style.height = petal.style.width;
      petal.style.animationDuration = 10 + (i % 6) * 2.5 + "s";
      petal.style.animationDelay = ((i * 1.7) % 12) + "s";
      petal.style.setProperty("--drift", (((i % 5) - 2) * 55) + "px");
      container.appendChild(petal);
    }
  }
  addPetals("petals", 12);
  addPetals("petals-cta", 9);

  var softPetals = document.querySelector(".petals-soft");
  if (softPetals && !reduceMotion) {
    softPetals.dataset.enabled = "true";
    for (var j = 0; j < 7; j += 1) {
      var p = document.createElement("span");
      p.className = "petal";
      p.style.left = ((j * 43 + 3) % 100) + "%";
      p.style.width = 10 + (j % 3) * 3 + "px";
      p.style.height = p.style.width;
      p.style.animationDuration = 11 + (j % 5) * 2 + "s";
      p.style.animationDelay = ((j * 1.3) % 9) + "s";
      p.style.setProperty("--drift", (((j % 4) - 2) * 45) + "px");
      softPetals.appendChild(p);
    }
  }

  /* ---------------------------- Info dialog ----------------------------- */
  var dialog = document.getElementById("info-dialog");
  var dialogTitle = document.getElementById("dialog-title");
  var dialogBody = document.getElementById("dialog-body");
  var dialogLevel = document.getElementById("dialog-level");
  var dialogLink = document.getElementById("dialog-link");

  function closeDialog() {
    if (dialog && typeof dialog.close === "function") dialog.close();
  }

  document.querySelectorAll("[data-dialog-title]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!dialog) return;
      dialogTitle.textContent = button.dataset.dialogTitle || "";
      dialogBody.textContent = button.dataset.dialogBody || "";
      dialogLevel.textContent = button.dataset.dialogLevel || "";

      var href = button.dataset.dialogLink;
      if (href) {
        dialogLink.textContent = button.dataset.dialogLinkLabel || "Informasi";
        dialogLink.setAttribute("href", href);
        if (/^https?:/.test(href)) {
          dialogLink.setAttribute("target", "_blank");
          dialogLink.setAttribute("rel", "noopener noreferrer");
        } else {
          dialogLink.removeAttribute("target");
          dialogLink.removeAttribute("rel");
        }
        dialogLink.hidden = false;
      } else {
        dialogLink.hidden = true;
      }

      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  });

  var closeButton = document.getElementById("dialog-close");
  var okButton = document.getElementById("dialog-ok");
  if (closeButton) closeButton.addEventListener("click", closeDialog);
  if (okButton) okButton.addEventListener("click", closeDialog);
  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeDialog();
    });
    dialogLink.addEventListener("click", function (event) {
      var href = dialogLink.getAttribute("href") || "";
      if (href.charAt(0) === "#") {
        event.preventDefault();
        closeDialog();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }

  /* ------------------------------- Footer ------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
