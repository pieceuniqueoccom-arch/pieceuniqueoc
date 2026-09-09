/* PIECE UNIQUE OC — shared behaviour
   ------------------------------------------------------------------
   1. Sticky header state
   2. Mobile navigation
   3. Reveal-on-scroll
   4. Current year in footer
   5. Front-end form handling (see README for wiring a real endpoint)
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  /* 1. Header ------------------------------------------------------ */
  var header = document.getElementById("siteHeader");
  if (header) {
    var solidify = function () {
      header.classList.toggle("is-solid", window.scrollY > 40);
    };
    solidify();
    window.addEventListener("scroll", solidify, { passive: true });
  }

  /* 2. Mobile nav -------------------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.click();
      }
    });
  }

  /* 3. Reveal ------------------------------------------------------ */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
        io.observe(el);
      });
    }
  }

  /* 3b. Contact details from content/site.json --------------------- */
  /* Phone, email, address and Instagram are edited in the admin panel.
     The values written in the HTML act as the fallback if this fails. */
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  var stillPlaceholder = function (v) {
    return /000-0000|^0000 |instagram\.com\/$/.test(String(v || ""));
  };
  var flag = ' <span class="placeholder-flag">Placeholder</span>';

  fetch("/content/site.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (s) {
      document.querySelectorAll("[data-site]").forEach(function (el) {
        switch (el.getAttribute("data-site")) {
          case "phone":
            if (s.phone_link) el.href = "tel:" + s.phone_link;
            if (s.phone_display) el.textContent = s.phone_display;
            break;
          case "phone-cta":
            if (s.phone_link) el.href = "tel:" + s.phone_link;
            if (s.phone_display) el.textContent = "Call " + s.phone_display;
            break;
          case "email":
            if (s.email) { el.href = "mailto:" + s.email; el.textContent = s.email; }
            break;
          case "instagram":
            if (s.instagram_url) el.href = s.instagram_url;
            if (s.instagram_handle) el.textContent = s.instagram_handle;
            break;
          case "address":
            el.innerHTML = esc(s.address_line1) + "<br>" + esc(s.address_line2) +
              (stillPlaceholder(s.address_line1) ? flag : "");
            break;
        }
      });
      /* Keep the "Placeholder" badge visible on the contact page until
         the real phone number is filled in. */
      var pf = document.querySelector('[data-site-flag="phone"]');
      if (pf && !stillPlaceholder(s.phone_display)) pf.remove();
    })
    .catch(function () { /* HTML fallback values stay in place */ });

  /* 4. Year -------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* 5. Forms ------------------------------------------------------- */
  /* Forms post to the `action` on each <form>. Until a real endpoint is
     set (see README), the placeholder action is "#", and we show an
     inline confirmation instead of navigating away. */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action");
      if (action && action !== "#") return; /* real endpoint — let it post */

      e.preventDefault();
      if (!form.reportValidity()) return;

      var shell = form.closest(".form-shell") || form;
      shell.innerHTML =
        '<span class="eyebrow">Received</span>' +
        '<h3 style="margin-bottom:14px">Thank you — your inquiry is in.</h3>' +
        '<p class="lede">A specialist will follow up within one business day. ' +
        'For anything time-sensitive, call us directly.</p>' +
        '<p style="margin-top:26px"><a class="tlink" href="contact.html">Contact details' +
        '<svg viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M0 4.5h12M8.5 1L12 4.5 8.5 8" stroke="currentColor"/></svg>' +
        '</a></p>' +
        '<p class="form-note"><strong>Developer note:</strong> this is the placeholder ' +
        'confirmation. Set a real <code>action</code> on the form to deliver submissions.</p>';
      shell.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
})();
