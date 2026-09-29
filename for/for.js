// Shared behaviour for the "Apex for …" pages: weighted scroll, the menu, and the example playing out.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // A refresh always starts at the top.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  addEventListener("pageshow", function () { scrollTo(0, 0); });

  // Smooth, weighted scrolling, as on the home page.
  var lenis = null;
  if (!reduce && window.Lenis) lenis = new Lenis({ autoRaf: true, lerp: 0.075, wheelMultiplier: 0.9, anchors: true });

  // Menu button: opens the full-screen menu; the page stops scrolling while it's open.
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function set(open) {
    document.body.classList.toggle("menu-open", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger.addEventListener("click", function () { set(!document.body.classList.contains("menu-open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });

  // Top bar: hide on the way down, fade back in on the way up.
  var head = document.querySelector(".site-head"), lastY = scrollY, headTick = false;
  addEventListener("scroll", function () {
    if (headTick) return;
    headTick = true;
    requestAnimationFrame(function () {
      headTick = false;
      var y = scrollY;
      if (y < 80) { head.classList.remove("away", "solid"); }
      else if (y > lastY + 4) { head.classList.add("away"); }
      else if (y < lastY - 4) { head.classList.remove("away"); head.classList.add("solid"); }
      lastY = y;
    });
  }, { passive: true });

  // The identity shift plays out once it's on screen.
  document.querySelectorAll(".shift").forEach(function (el) {
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) { if (e.isIntersecting) { el.classList.add("play"); io.disconnect(); } });
    }, { threshold: 0.35 }).observe(el);
  });

  // ---- A day with Apex ----
  // One tall section with a pinned screen. Scrolling moves between scenes. Inside a scene the steps
  // play on their own like a short clip, and scrolling further through the scene also moves them on,
  // so a fast scroll never skips what Apex did. Elements marked data-s="n" appear from step n,
  // data-h="n" leave from step n, and data-hl="n" are picked out at step n.
  var demo = document.querySelector(".demo");
  if (demo) {
    var scenes = Array.prototype.slice.call(demo.querySelectorAll(".scene"));
    var beats = Array.prototype.slice.call(demo.querySelectorAll(".beats li"));
    var url = demo.querySelector(".win-bar .url");
    var PER = 150;   // vh of scrolling per scene
    var STEP = 1100; // ms between steps when the clip plays on its own
    demo.style.height = (scenes.length * PER + 100) + "vh";

    var current = -1, played = 0, shown = -1, timers = [];

    function show(si, k) {
      if (k === shown) return;
      shown = k;
      var sc = scenes[si];
      Array.prototype.forEach.call(sc.querySelectorAll("[data-s], [data-h]"), function (el) {
        var s = el.dataset.s === undefined ? 0 : +el.dataset.s;
        var h = el.dataset.h === undefined ? Infinity : +el.dataset.h;
        el.classList.toggle("in", k >= s && k < h);
      });
      Array.prototype.forEach.call(sc.querySelectorAll("[data-hl]"), function (el) {
        el.classList.toggle("hl", el.dataset.hl.split(" ").indexOf(String(k)) > -1);
      });
      Array.prototype.forEach.call(beats[si].querySelectorAll(".cap"), function (c) {
        c.classList.toggle("in", +c.dataset.at === k);
      });
    }

    function enter(si) {
      current = si;
      played = 0;
      shown = -1;
      timers.forEach(clearTimeout);
      timers = [];
      scenes.forEach(function (sc, i) { sc.classList.toggle("on", i === si); });
      beats.forEach(function (b, i) { b.classList.toggle("on", i === si); b.classList.toggle("done", i < si); });
      url.textContent = scenes[si].dataset.url;
      var n = +scenes[si].dataset.steps;
      for (var k = 1; k < n; k++) {
        (function (k) {
          timers.push(setTimeout(function () { played = k; render(); }, reduce ? 0 : 500 + (k - 1) * STEP));
        })(k);
      }
    }

    function render() {
      var r = demo.getBoundingClientRect();
      var p = Math.min(0.9999, Math.max(0, -r.top / (r.height - innerHeight)));
      var at = p * scenes.length, si = Math.floor(at);
      if (si !== current) enter(si);
      // Steps reached by scrolling: spread over the first 70% of the scene, the rest is a pause.
      var n = +scenes[si].dataset.steps;
      var byScroll = Math.min(n - 1, Math.floor((at - si) / 0.7 * n));
      show(si, Math.max(played, byScroll));
    }
    var ticking = false;
    addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; render(); }); }
    }, { passive: true });
    render();
  }
})();
