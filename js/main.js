(function () {
  "use strict";

  var SITE = window.SITE || {};
  var WORKS = window.WORKS || [];
  var PHOTOS = window.PHOTOS || [];
  var PLACEHOLDER_FRAMES = 6;
  // set in <head>; off when the visitor prefers reduced motion
  var MOTION = document.documentElement.classList.contains("motion");

  var $ = function (sel) { return document.querySelector(sel); };
  var pad = function (n) { return String(n).padStart(2, "0"); };

  function frameSources(work) {
    if (work.frames && work.frames.length) return work.frames;
    return new Array(PLACEHOLDER_FRAMES).fill(null);
  }

  function frameStyle(work) {
    return "--tone:" + work.tone + ";--ar:" + (work.aspect || "16 / 9");
  }

  // Once a still loads, size its frame to the still's real shape (mixed 4:3 / 16:9).
  function fitToImage(e) {
    var img = e.target;
    if (img.tagName === "IMG" && img.naturalWidth) {
      img.parentNode.style.setProperty("--ar", img.naturalWidth + " / " + img.naturalHeight);
    }
  }

  function frameInner(src, n) {
    if (src) return '<img src="' + src + '" alt="" loading="lazy" decoding="async">';
    return '<span class="frame__ph mono">Placeholder &middot; ' + pad(n) + "</span>";
  }

  /* ---------- Contact sheet ---------- */
  function renderSheet() {
    var sheet = $("#sheet");
    sheet.innerHTML = WORKS.map(function (work, i) {
      var rollNo = pad(i + 1);
      var frames = frameSources(work).map(function (src, j) {
        var n = j + 1;
        return (
          '<button class="frame" type="button" data-slug="' + work.slug + '" style="' + frameStyle(work) + ";--i:" + j + '" ' +
          'aria-label="' + work.title + ", frame " + n + ', open project">' +
          frameInner(src, n) +
          '<span class="frame__no">' + n + "A</span>" +
          "</button>"
        );
      }).join("");

      return (
        '<article class="roll" id="roll-' + work.slug + '">' +
        '<div class="roll__label">' +
        '<span class="roll__no mono">Roll ' + rollNo + "</span>" +
        '<button class="roll__title" type="button" data-slug="' + work.slug + '">' + work.title + "</button>" +
        '<span class="roll__meta mono">' + work.year + " &middot; " + work.short + "</span>" +
        "</div>" +
        '<div class="strip"><div class="strip__track">' + frames + "</div></div>" +
        "</article>"
      );
    }).join("");

    $("#roll-count").textContent = WORKS.length;

    sheet.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-slug]");
      if (btn) open(btn.dataset.slug, btn);
    });
  }

  /* ---------- Loupe (project view) ---------- */
  var loupe = $("#loupe");
  var lastTrigger = null;
  // load events don't bubble, so listen in the capture phase
  $("#sheet").addEventListener("load", fitToImage, true);
  $("#loupe-frames").addEventListener("load", fitToImage, true);

  function find(slug) {
    for (var i = 0; i < WORKS.length; i++) if (WORKS[i].slug === slug) return { work: WORKS[i], index: i };
    return null;
  }

  function credit(label, value) {
    return "<div><dt>" + label + '</dt><span class="leader"></span><dd>' + value + "</dd></div>";
  }

  /* A still flies from the sheet into the screen, and back on close */
  var FLY_MS = 480;

  function box(el) {
    var r = el.getBoundingClientRect();
    return { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" };
  }

  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }

  // the trigger's image, if the trigger is a loaded still (or print) we can fly
  function flyable(trigger) {
    if (!MOTION || !trigger || !Element.prototype.animate) return null;
    if (!trigger.classList.contains("frame") && !trigger.classList.contains("print")) return null;
    var img = trigger.querySelector("img");
    return img && img.complete && img.naturalWidth && inView(trigger) ? img : null;
  }

  // `host` is the open dialog the flying copy sits in (dialogs live in the top layer)
  function fly(host, still, from, to, done) {
    var img = document.createElement("img");
    img.className = "loupe__fly";
    img.alt = "";
    img.src = still.currentSrc || still.src;
    host.appendChild(img);
    img.animate([from, to], { duration: FLY_MS, easing: "cubic-bezier(.2, .7, .1, 1)", fill: "forwards" })
      .onfinish = function () { done(img); };
  }

  function open(slug, trigger) {
    var hit = find(slug);
    if (!hit) return;
    var work = hit.work;
    lastTrigger = trigger || null;
    var opening = !loupe.open;
    var still = opening && flyable(trigger);
    var from = still && box(trigger);

    $("#loupe-roll").textContent = "Roll " + pad(hit.index + 1) + " · " + work.type;
    $("#loupe-title").textContent = work.title;
    $("#loupe-blurb").textContent = work.blurb;
    $("#loupe-credits").innerHTML =
      credit("Role", work.roles.join(", ")) +
      credit("Year", work.year) +
      credit("Camera", work.kit) +
      credit("Programme", work.programme);

    $("#loupe-screen").innerHTML = work.youtubeId
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + work.youtubeId +
        '?rel=0" title="' + work.title + '" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'
      : '<p class="mono">Film coming soon &mdash; YouTube link not added yet</p>';

    $("#loupe-frames").innerHTML = frameSources(work).map(function (src, j) {
      return '<figure style="' + frameStyle(work) + '">' + frameInner(src, j + 1) +
        "<figcaption>" + (j + 1) + "A</figcaption></figure>";
    }).join("");

    loupe.classList.toggle("is-flying", !!still);
    if (opening) loupe.showModal();
    loupe.scrollTop = 0;
    if (still) {
      fly(loupe, still, from, box($("#loupe-screen")), function (img) {
        img.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" })
          .onfinish = function () { img.remove(); };
      });
    }
    if (location.hash !== "#" + slug) history.pushState(null, "", "#" + slug);
  }

  var closing = false;
  function close() {
    if (!loupe.open || closing) return;
    var still = flyable(lastTrigger);
    var screen = $("#loupe-screen");
    if (!still || !inView(screen)) { loupe.close(); return; }
    closing = true;
    loupe.classList.add("is-leaving");
    fly(loupe, still, box(screen), box(lastTrigger), function (img) {
      loupe.close();
      img.remove();
      closing = false;
    });
  }

  // Esc goes through close() so it gets the same flight back
  loupe.addEventListener("cancel", function (e) {
    e.preventDefault();
    close();
  });

  loupe.addEventListener("close", function () {
    loupe.classList.remove("is-flying", "is-leaving");
    $("#loupe-screen").innerHTML = ""; // stops playback
    if (find(location.hash.slice(1))) history.replaceState(null, "", "#works");
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });
  $("#loupe-close").addEventListener("click", close);

  /* ---------- Prints: three category stacks -> album view -> enlarger ---------- */
  var album = $("#album");
  var enlarger = $("#enlarger");
  var albumCat = "";     // category open in the album view
  var printAt = -1;      // which print the enlarger shows

  var attr = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  };
  function printHash(i) { return "#print-" + pad(i + 1); }
  function printIndex(hash) {
    var m = /^print-(\d+)$/.exec(hash);
    var i = m ? parseInt(m[1], 10) - 1 : -1;
    return i >= 0 && i < PHOTOS.length && categoryLabel(PHOTOS[i].category) ? i : -1;
  }
  function printTile(i) { return $('#album-wall [data-i="' + i + '"]'); }
  function printCaption(p) {
    return [p.caption, p.client, p.place, p.year, p.kit].filter(Boolean).join(" · ");
  }
  function printFace(p, i) {
    return p.src
      ? '<img src="' + attr(p.src) + '" alt="" loading="lazy" decoding="async">'
      : '<span class="frame__ph mono">Placeholder &middot; ' + pad(i + 1) + "</span>";
  }

  // only categories that have photos are shown
  var CATEGORIES = (window.PHOTO_CATEGORIES || []).filter(function (c) {
    return PHOTOS.some(function (p) { return p.category === c.id; });
  });
  function categoryLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    return "";
  }
  // indices of the photos in a category, in order
  function inCategory(id) {
    var list = [];
    for (var i = 0; i < PHOTOS.length; i++) if (PHOTOS[i].category === id) list.push(i);
    return list;
  }
  // "prints/corporate" -> "corporate", "prints" -> "", anything else -> null
  function categoryFromHash(hash) {
    if (hash === "prints") return "";
    var m = /^prints\/([\w-]+)$/.exec(hash);
    return m && categoryLabel(m[1]) ? m[1] : null;
  }

  /* The section: one stack of up to three prints per category */
  function renderPrints() {
    if (!CATEGORIES.length) return;
    $("#albums").innerHTML = CATEGORIES.map(function (c, k) {
      var list = inCategory(c.id);
      // the first photo ends up on top of the pile
      var cards = list.slice(0, 3).reverse().map(function (i) {
        return '<span class="album__card"><span class="print__img">' + printFace(PHOTOS[i], i) + "</span></span>";
      }).join("");
      return (
        '<a class="album" href="#prints/' + c.id + '" data-cat="' + c.id + '" style="--d:' + k * 120 + 'ms;--n:' + Math.min(list.length, 3) + '">' +
        '<span class="album__stack" aria-hidden="true">' + cards + "</span>" +
        '<span class="album__label">' +
        '<span class="album__title">' + attr(c.label) + "</span>" +
        '<span class="album__count mono">' + pad(list.length) + (list.length === 1 ? " frame" : " frames") + " &rarr;</span>" +
        "</span></a>"
      );
    }).join("");
    $("#album-count").textContent = CATEGORIES.length;
    $("#prints").hidden = false;

    // the link changes the hash; syncWithHash opens the album
    $("#albums").addEventListener("click", function (e) {
      var a = e.target.closest(".album");
      if (!a) return;
      e.preventDefault();
      history.pushState(null, "", "#prints/" + a.dataset.cat);
      openAlbum(a.dataset.cat);
    });

    var wall = $("#album-wall");
    // keep each photo's real shape once it loads
    wall.addEventListener("load", function (e) {
      var img = e.target;
      if (img.tagName === "IMG" && img.naturalWidth) {
        img.closest(".print").style.setProperty("--r", (img.naturalWidth / img.naturalHeight).toFixed(4));
      }
    }, true);
    wall.addEventListener("click", function (e) {
      var tile = e.target.closest(".print");
      if (tile) openPrint(Number(tile.dataset.i), tile);
    });
  }

  /* Album view: one category, full screen */
  function openAlbum(id) {
    if (album.open && albumCat === id) return;
    albumCat = id;
    var list = inCategory(id);
    $("#album-roll").textContent = "Prints · " + pad(list.length) + (list.length === 1 ? " frame" : " frames");
    $("#album-title").textContent = categoryLabel(id);
    $("#album-wall").innerHTML = list.map(function (i, n) {
      var p = PHOTOS[i];
      var label = (printCaption(p) || "Photograph") + ", enlarge";
      return (
        '<button class="print" type="button" data-i="' + i + '" ' +
        'style="--r:' + (p.aspect || 1.5) + ";--d:" + Math.min(n, 8) * 50 + 'ms" aria-label="' + attr(label) + '">' +
        '<span class="print__img">' + printFace(p, i) + "</span>" +
        '<span class="print__no mono">' + pad(n + 1) + "</span>" +
        "</button>"
      );
    }).join("");
    if (!album.open) album.showModal();
    album.scrollTop = 0;
  }

  function closeAlbum() {
    if (album.open) album.close();
  }

  album.addEventListener("close", function () {
    if (categoryFromHash(location.hash.slice(1))) history.replaceState(null, "", "#prints");
    var stack = $('#albums [data-cat="' + albumCat + '"]');
    if (stack) stack.focus({ preventScroll: true });
    albumCat = "";
  });
  $("#album-close").addEventListener("click", closeAlbum);

  /* Enlarger: one print, on top of the album */
  function showPrint(i) {
    printAt = i;
    var p = PHOTOS[i];
    var cap = printCaption(p);
    var list = inCategory(p.category);
    $("#enl-count").textContent = categoryLabel(p.category) + " " + pad(list.indexOf(i) + 1) + " / " + pad(list.length);
    $("#enl-cap").textContent = cap;
    $("#enl-easel").innerHTML = p.src
      ? '<img src="' + attr(p.src) + '" alt="' + attr(cap || "Photograph " + (i + 1)) + '" decoding="async">'
      : '<span class="enlarger__ph mono" style="--r:' + (p.aspect || 1.5) + '">Placeholder &middot; ' + pad(i + 1) + "</span>";
  }

  function openPrint(i, trigger) {
    if (enlarger.open) {
      if (i !== printAt) goTo(i);
      return;
    }
    var still = flyable(trigger);
    var from = still && box(still);
    showPrint(i);
    enlarger.classList.toggle("is-flying", !!still);
    enlarger.showModal();
    var img = $("#enl-easel img");
    if (still && img && img.complete && img.naturalWidth) {
      fly(enlarger, still, from, box(img), function (f) {
        f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" })
          .onfinish = function () { f.remove(); };
      });
    } else {
      enlarger.classList.remove("is-flying");
    }
    if (location.hash !== printHash(i)) history.pushState(null, "", printHash(i));
  }

  // swap the print, keeping one history entry for the whole visit
  function goTo(i) {
    showPrint(i);
    history.replaceState(null, "", printHash(i));
  }
  // prev / next stay inside the category
  function stepBy(d) {
    var list = inCategory(PHOTOS[printAt].category);
    var pos = list.indexOf(printAt);
    goTo(list[(pos + d + list.length) % list.length]);
  }

  var printClosing = false;
  function closePrint() {
    if (!enlarger.open || printClosing) return;
    var tile = printTile(printAt);
    // after browsing ahead, bring the print you ended on back into view
    if (tile && !inView(tile)) tile.scrollIntoView({ block: "center", behavior: "instant" });
    var still = flyable(tile);
    var img = $("#enl-easel img");
    if (!still || !img || !img.naturalWidth || !inView(img)) { enlarger.close(); return; }
    printClosing = true;
    enlarger.classList.add("is-leaving");
    img.style.visibility = "hidden";
    fly(enlarger, img, box(img), box(still), function (f) {
      enlarger.close();
      f.remove();
      printClosing = false;
    });
  }

  enlarger.addEventListener("cancel", function (e) {
    e.preventDefault();
    closePrint();
  });
  enlarger.addEventListener("close", function () {
    enlarger.classList.remove("is-flying", "is-leaving");
    if (printIndex(location.hash.slice(1)) >= 0) {
      history.replaceState(null, "", albumCat ? "#prints/" + albumCat : "#prints");
    }
    var tile = printTile(printAt);
    if (tile) tile.focus({ preventScroll: true });
    printAt = -1;
  });
  $("#enl-close").addEventListener("click", closePrint);
  $("#enl-prev").addEventListener("click", function () { stepBy(-1); });
  $("#enl-next").addEventListener("click", function () { stepBy(1); });
  enlarger.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
  });

  // swipe left / right on the photo
  var swipe = null;
  $("#enl-easel").addEventListener("pointerdown", function (e) { swipe = { x: e.clientX, y: e.clientY }; });
  $("#enl-easel").addEventListener("pointerup", function (e) {
    if (!swipe) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) stepBy(dx < 0 ? 1 : -1);
  });
  $("#enl-easel").addEventListener("pointercancel", function () { swipe = null; });

  function syncWithHash() {
    var hash = location.hash.slice(1);
    var p = printIndex(hash);
    var cat = CATEGORIES.length ? categoryFromHash(hash) : null;
    var wasInPrints = album.open;
    if (find(hash)) {
      closePrint();
      closeAlbum();
      var roll = document.getElementById("roll-" + hash);
      open(hash, roll && roll.querySelector(".roll__title"));
      return;
    }
    close();
    if (p >= 0) {
      // a link to one photo: open its category underneath, so closing lands there
      openAlbum(PHOTOS[p].category);
      openPrint(p, printTile(p));
    } else if (cat) {
      closePrint();
      openAlbum(cat);
    } else {
      closePrint();
      closeAlbum();
    }
    // arriving from a link: put the stacks behind the album, so closing it lands on them
    if ((p >= 0 || cat) && !wasInPrints) $("#prints").scrollIntoView({ behavior: "instant" });
  }
  window.addEventListener("popstate", syncWithHash);
  window.addEventListener("hashchange", syncWithHash);

  /* ---------- Scroll: timecode (24 fps) and hero depth ---------- */
  function initScroll() {
    var tc = $("#timecode");
    var bg = MOTION && $(".hero__bg img");
    var ticking = false;
    function draw() {
      var y = window.scrollY;
      var f = Math.floor(y / 3);
      var fr = f % 24, s = Math.floor(f / 24);
      tc.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(fr);
      // the photo trails the page, so the type seems to sit in front of it
      if (bg && y < window.innerHeight * 1.2) bg.style.translate = "0 " + (y * 0.3).toFixed(1) + "px";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    }, { passive: true });
    draw();
  }

  /* ---------- Slate: which scene you're in ---------- */
  function initSlate() {
    var slate = $("#slate");
    var scenes = [[".hero", "00", "Titles"], ["#works", "01", "Works"], ["#prints", "02", "Prints"], ["#about", "03", "About"], ["#contact", "04", "Contact"]];
    if (!("IntersectionObserver" in window)) return;

    function show(scene) {
      var text = "Sc " + scene[1] + " \u00b7 " + scene[2];
      if (slate.textContent === text) return;
      slate.textContent = text;
      document.querySelectorAll(".bar__nav a").forEach(function (a) {
        a.classList.toggle("is-current", a.getAttribute("href") === scene[0]);
      });
      if (MOTION) {
        slate.classList.remove("is-flip");
        void slate.offsetWidth; // restart the flip
        slate.classList.add("is-flip");
      }
    }

    // a thin line across the middle of the screen decides the scene
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) show(entry.target.scene);
      });
    }, { rootMargin: "-45% 0px -54% 0px" });
    scenes.forEach(function (scene) {
      var el = $(scene[0]);
      el.scene = scene;
      io.observe(el);
    });
  }

  /* ---------- Rolls and section titles feed in on scroll ---------- */
  function initReveals() {
    if (!MOTION || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    document.querySelectorAll(".roll, .section-head, .album").forEach(function (el) {
      el.classList.add("pending");
      io.observe(el);
    });
  }

  /* ---------- Opening titles ---------- */
  function initTitles() {
    var root = document.documentElement;
    // drop the masks once the titles have played
    if (root.classList.contains("intro")) setTimeout(function () { root.classList.remove("intro"); }, 2200);
  }

  /* ---------- Email copy ---------- */
  function initEmail() {
    var btn = $("#email");
    var hint = $("#email-hint");
    $(".email__addr").textContent = SITE.email;
    btn.addEventListener("click", function () {
      if (!navigator.clipboard) { location.href = "mailto:" + SITE.email; return; }
      navigator.clipboard.writeText(SITE.email).then(function () {
        btn.classList.add("is-copied");
        hint.textContent = "✓ Copied — that's a wrap";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          hint.textContent = "Click to copy";
        }, 2400);
      }, function () { location.href = "mailto:" + SITE.email; });
    });
  }

  /* ---------- Contact form (Formspree) ---------- */
  function initForm() {
    var form = $("#form");
    var status = $("#form-status");
    var submit = form.querySelector('[type="submit"]');

    function say(msg, kind) {
      status.textContent = msg;
      status.className = "form__status mono" + (kind ? " is-" + kind : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var invalid = false;
      form.querySelectorAll("[required]").forEach(function (field) {
        var bad = !field.checkValidity();
        field.setAttribute("aria-invalid", bad);
        invalid = invalid || bad;
      });
      if (invalid) { say("Missing a name, a valid email or a message.", "err"); return; }

      // Honeypot filled: a bot. Pretend it worked.
      if (form._gotcha.value) { form.reset(); say("Thanks — message received.", "ok"); return; }

      if (!SITE.formspreeId) {
        say("Form isn't connected yet — please email me at " + SITE.email + ".", "err");
        return;
      }

      submit.disabled = true;
      say("Sending…");
      fetch("https://formspree.io/f/" + SITE.formspreeId, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say("Thanks — I'll get back to you soon.", "ok");
      }).catch(function () {
        say("Couldn't send. Please email me at " + SITE.email + ".", "err");
      }).then(function () { submit.disabled = false; });
    });
  }

  /* ---------- Config-driven bits ---------- */
  function initConfig() {
    $("#year").textContent = new Date().getFullYear();
    if (SITE.cv) $("#cv-link").href = SITE.cv;
    if (SITE.instagram) $("#ig").href = "https://instagram.com/" + SITE.instagram;
    if (SITE.linkedin) document.querySelectorAll(".li-link").forEach(function (a) { a.href = SITE.linkedin; });
    if (SITE.portrait) {
      $(".portrait__img").innerHTML = '<img src="' + SITE.portrait + '" alt="Portrait of Xander Lee" loading="lazy">';
    }
    if (SITE.showreelId) {
      var reel = $("#reel");
      reel.querySelector(".reel__frame").innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + SITE.showreelId +
        '?rel=0" title="Showreel" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      reel.hidden = false;
    }
  }

  renderSheet();
  renderPrints();
  initTitles();
  initReveals();
  initScroll();
  initSlate();
  initEmail();
  initForm();
  initConfig();
  syncWithHash();
})();
