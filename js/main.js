(function () {
  "use strict";

  var SITE = window.SITE || {};
  var WORKS = window.WORKS || [];
  var PLACEHOLDER_FRAMES = 6;

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
          '<button class="frame" type="button" data-slug="' + work.slug + '" style="' + frameStyle(work) + '" ' +
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

  function open(slug, trigger) {
    var hit = find(slug);
    if (!hit) return;
    var work = hit.work;
    lastTrigger = trigger || null;

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

    if (!loupe.open) loupe.showModal();
    loupe.scrollTop = 0;
    if (location.hash !== "#" + slug) history.pushState(null, "", "#" + slug);
  }

  function close() {
    if (loupe.open) loupe.close();
  }

  loupe.addEventListener("close", function () {
    $("#loupe-screen").innerHTML = ""; // stops playback
    if (find(location.hash.slice(1))) history.replaceState(null, "", "#works");
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });
  $("#loupe-close").addEventListener("click", close);

  function syncWithHash() {
    var slug = location.hash.slice(1);
    if (find(slug)) {
      var roll = document.getElementById("roll-" + slug);
      open(slug, roll && roll.querySelector(".roll__title"));
    } else {
      close();
    }
  }
  window.addEventListener("popstate", syncWithHash);

  /* ---------- Timecode tied to scroll (24 fps) ---------- */
  function initTimecode() {
    var tc = $("#timecode");
    var ticking = false;
    function draw() {
      var f = Math.floor(window.scrollY / 3);
      var fr = f % 24, s = Math.floor(f / 24);
      tc.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60) + ":" + pad(fr);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    }, { passive: true });
    draw();
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
  initTimecode();
  initEmail();
  initForm();
  initConfig();
  syncWithHash();
})();
