/* Intro sequence. Runs after script.js and reuses its globals (setT, play, SQ). */
(function () {
  var boot = document.getElementById('boot'), imp = document.getElementById('imp'),
      hint = document.getElementById('hint'), skip = document.getElementById('skip'),
      A = document.querySelector('.app'), T = [], done = false;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function at(ms, f) { T.push(setTimeout(f, ms)); }
  if (matchMedia('(max-width:800px)').matches) hint.textContent = 'Drag the playhead to scrub \u00b7 Tap play \u00b7 Try the Import and Export tabs';

  // Clicking the brand name in the menu bar replays the intro.
  var brand = A.querySelector('.menu b');
  brand.style.cursor = 'pointer';
  brand.onclick = function () { try { sessionStorage.removeItem('xl_intro'); } catch (e) {} location.reload(); };

  function release() {
    done = true;
    A.classList.remove('booting'); A.classList.add('live');
    $$('.hid', A).forEach(function (e) { e.classList.remove('hid'); });
    imp.classList.remove('on'); skip.remove();
  }
  function finish() {
    if (done) return;
    T.forEach(clearTimeout); play(false); release(); boot.remove(); setT(0);
  }

  var seen = 0;
  try { seen = sessionStorage.getItem('xl_intro'); } catch (e) {}
  if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
  try { sessionStorage.setItem('xl_intro', 1); } catch (e) {}
  skip.onclick = finish;
  addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });

  // macOS clock
  $$('.mbar span').pop().textContent = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  // ---- Stage 1: macOS desktop, cursor clicks the Premiere Pro dock icon ----
  var cur = document.getElementById('cur'), pr = document.getElementById('dpr'),
      sp = boot.querySelector('.splash'), st = sp.querySelector('.sst'), bar = sp.querySelector('.sbar i');
  function mv(x, y, ms) {
    cur.style.transition = 'transform ' + ms + 'ms cubic-bezier(.45,0,.2,1)';
    cur.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  mv(innerWidth * .62, innerHeight * .3, 0);
  at(400, function () { var r = pr.getBoundingClientRect(); mv(r.left + r.width / 2 - 3, r.top + r.height / 2 - 2, 1000); });
  at(1300, function () { pr.classList.add('hv'); });
  at(1550, function () { pr.classList.remove('hv'); pr.classList.add('bn', 'run'); });

  // ---- Stage 2: splash screen with launch status messages ----
  var L = ['Initializing application…', 'Loading preferences…', 'Scanning plug-ins…', 'Initializing playback engine…',
           'Loading color tools…', 'Starting link service…', 'Opening XANDER_LEE_Portfolio.xlproj…', 'Restoring workspace: Editing'];
  at(1900, function () { sp.classList.add('on'); });
  L.forEach(function (s, i) {
    at(2100 + i * 330, function () { st.textContent = s; bar.style.width = (i + 1) / L.length * 100 + '%'; });
  });

  // ---- Stage 3: workspace appears, media imports, timeline assembles ----
  var R = 4800,
      rows = $$('.tree>div', A), clips = $$('.tracks .clip', A),
      files = ['REUNION.mp4'],
      iname = imp.querySelector('span'), ibar = imp.querySelector('.bar i'), icount = imp.querySelector('em');
  rows.concat(clips).forEach(function (e) { e.classList.add('hid'); });
  function rv(i, ms) { at(R + ms, function () { A.children[i].classList.add('rv'); }); }

  at(R - 100, function () { boot.classList.add('out'); });
  at(R + 600, function () { boot.remove(); });
  rv(0, 0); rv(1, 150); rv(2, 400);
  at(R + 500, function () { imp.classList.add('on'); });
  rows.forEach(function (r, i) {
    at(R + 700 + i * 75, function () {
      r.classList.remove('hid');
      iname.textContent = files[i % files.length];
      icount.textContent = (i + 1) + ' of ' + rows.length;
      ibar.style.width = (i + 1) / rows.length * 100 + '%';
    });
  });
  rv(3, 1100); rv(4, 1300); rv(5, 1500);
  at(R + 1150, function () { setT(0); });
  var t = R + 1900;
  clips.forEach(function (c, i) {
    at(t, function () { c.classList.remove('hid'); });
    t += i < 6 ? 240 : 170;
  });
  // Hand control to the visitor and play the first few seconds.
  at(t + 300, function () {
    A.classList.add('live'); release();
    hint.classList.add('on');
    play(true);
  });
  at(t + 300 + 4500, function () { if (pl) play(false); });
  at(t + 300 + 7500, function () { hint.classList.remove('on'); });
})();
