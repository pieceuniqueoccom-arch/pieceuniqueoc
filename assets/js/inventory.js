/* PIECE UNIQUE OC — inventory
   ------------------------------------------------------------------
   Watches and handbags live in content/inventory.json and are edited
   through
   the admin panel at app.pagescms.org — you should not need to touch
   this file. See section 3 of the README.

   This script fetches that JSON and renders the Shop grid and the
   home page "Current Selection" row. If the fetch fails (for example
   when opening index.html straight off your desktop rather than over
   the web), it falls back to a small built-in sample so the page
   still looks right.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var PLACEHOLDER = "/assets/img/watch-placeholder.svg";
  var BAG_PLACEHOLDER = "/assets/img/bag-placeholder.svg";

  var FALLBACK = [
    { category: "Watches", brand: "Rolex", name: "Cosmograph Daytona",
      ref: "Ref. 000000 — Oystersteel, White Dial", price: "$00,000",
      tag: "New Arrival", image: PLACEHOLDER, featured: true },
    { category: "Watches", brand: "Patek Philippe", name: "Nautilus",
      ref: "Ref. 0000/0A — Stainless Steel", price: "Inquire",
      tag: "Consignment", image: PLACEHOLDER, featured: true },
    { category: "Handbags", brand: "Hermès", name: "Birkin 25",
      ref: "Togo Leather, Gold Hardware", price: "$00,000",
      tag: "New Arrival", image: BAG_PLACEHOLDER, featured: true },
    { category: "Handbags", brand: "Chanel", name: "Classic Flap, Medium",
      ref: "Caviar Leather, Gold Hardware", price: "$00,000",
      tag: "None", image: BAG_PLACEHOLDER, featured: true }
  ];


  var featuredEl = document.getElementById("featuredGrid");
  var shopEl = document.getElementById("shopGrid");
  if (!featuredEl && !shopEl) return;

  /* ---------------- helpers ---------------- */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardHTML(item) {
    var tag = item.tag && item.tag !== "None"
      ? '<span class="card__tag' + (item.tag === "New Arrival" ? " card__tag--gold" : "") +
        '">' + esc(item.tag) + "</span>"
      : "";
    var img = item.image || PLACEHOLDER;
    return (
      '<article class="card">' +
        '<div class="card__media">' + tag +
          '<img src="' + esc(img) + '" alt="' + esc(item.brand + " " + item.name) + '" loading="lazy">' +
        "</div>" +
        '<p class="card__brand">' + esc(item.brand) + "</p>" +
        '<h3 class="card__name">' + esc(item.name) + "</h3>" +
        '<p class="card__ref">' + esc(item.ref) + "</p>" +
        '<div class="card__foot">' +
          '<span class="card__price">' + esc(item.price) + "</span>" +
          '<a class="card__cta" href="/appointment.html">Inquire</a>' +
        "</div>" +
      "</article>"
    );
  }

  /* ---------------- render ---------------- */

  function render(data) {
    var all = (data || []).filter(function (d) { return d && d.brand && d.name; });

    /* ---- home page: featured row ---- */
    if (featuredEl) {
      var feat = all.filter(function (d) { return d.featured; }).slice(0, 4);
      featuredEl.innerHTML = feat.length
        ? feat.map(cardHTML).join("")
        : '<p class="empty">New arrivals are being photographed. Ask us what is in the case.</p>';
    }

    if (!shopEl) return;

    /* ---- shop / bags page ---- */
    var fixed = shopEl.getAttribute("data-category");      /* bags.html pins this */
    var tabsEl = document.getElementById("categoryTabs");
    var filterBar = document.getElementById("shopFilters");
    var count = document.getElementById("shopCount");

    var scope = fixed
      ? all.filter(function (d) { return d.category === fixed; })
      : all;

    var state = { category: "All", brand: "All" };

    function uniq(list, key) {
      return list.map(function (d) { return d[key]; })
                 .filter(function (v, i, a) { return v && a.indexOf(v) === i; })
                 .sort();
    }

    /* Category tabs — only on the full Shop page */
    if (tabsEl && !fixed) {
      /* Watches lead, then handbags, then anything added later */
      var ORDER = ["Watches", "Handbags"];
      var found = uniq(all, "category").sort(function (a, b) {
        var ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
      var cats = ["All"].concat(found);
      if (cats.length <= 2) {
        tabsEl.hidden = true;
      } else {
        tabsEl.innerHTML = cats.map(function (c, i) {
          return '<button type="button" class="tab' + (i === 0 ? " is-active" : "") +
                 '" data-cat="' + esc(c) + '">' + esc(c === "All" ? "Everything" : c) + "</button>";
        }).join("");
        tabsEl.addEventListener("click", function (e) {
          var btn = e.target.closest(".tab");
          if (!btn) return;
          tabsEl.querySelectorAll(".tab").forEach(function (t) {
            t.classList.toggle("is-active", t === btn);
          });
          state.category = btn.dataset.cat;
          state.brand = "All";
          buildBrands();
          draw();
        });
      }
    }

    function inCategory() {
      return state.category === "All"
        ? scope
        : scope.filter(function (d) { return d.category === state.category; });
    }

    function buildBrands() {
      if (!filterBar) return;
      var brands = ["All"].concat(uniq(inCategory(), "brand"));
      filterBar.innerHTML = brands.map(function (b) {
        return '<button type="button" class="filter' + (b === state.brand ? " is-active" : "") +
               '" data-brand="' + esc(b) + '">' + esc(b) + "</button>";
      }).join("");
    }

    if (filterBar) {
      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter");
        if (!btn) return;
        state.brand = btn.dataset.brand;
        filterBar.querySelectorAll(".filter").forEach(function (f) {
          f.classList.toggle("is-active", f === btn);
        });
        draw();
      });
    }

    function draw() {
      var shown = inCategory();
      if (state.brand !== "All") {
        shown = shown.filter(function (d) { return d.brand === state.brand; });
      }

      shopEl.innerHTML = shown.length
        ? shown.map(cardHTML).join("")
        : '<p class="empty">Nothing here right now — tell us what you are looking for and we will source it.</p>';

      if (count) count.textContent = shown.length + (shown.length === 1 ? " piece" : " pieces");
    }

    buildBrands();
    draw();
  }

  /* ---------------- load ---------------- */

  fetch("/content/inventory.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (json) {
      render(Array.isArray(json) ? json : (json && json.watches) || []);
    })
    .catch(function () {
      render(FALLBACK);
    });
})();
