// Shared behaviour for the "Apex for …" pages: weighted scroll, the menu, and the day playing out.
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

  // ---- A day with Apex ----
  // Each moment rises in the first time it's on screen, then Apex's steps play out once, in order.
  // In a screen, data-s="n" appears from step n, data-h="n" leaves at step n, data-hl="n" is picked out at step n.
  var STEP = 1400; // ms between steps
  Array.prototype.forEach.call(document.querySelectorAll(".moment"), function (moment) {
    var scene = moment.querySelector(".scene");
    var n = scene ? +scene.dataset.steps || 1 : 1;

    function show(k) {
      if (!scene) return;
      Array.prototype.forEach.call(scene.querySelectorAll("[data-s], [data-h]"), function (el) {
        var s = el.dataset.s === undefined ? 0 : +el.dataset.s;
        var h = el.dataset.h === undefined ? Infinity : +el.dataset.h;
        el.classList.toggle("in", k >= s && k < h);
      });
      Array.prototype.forEach.call(scene.querySelectorAll("[data-hl]"), function (el) {
        el.classList.toggle("hl", el.dataset.hl.split(" ").indexOf(String(k)) > -1);
      });
    }

    if (reduce) { moment.classList.add("shown"); show(n - 1); return; }
    show(0);
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        moment.classList.add("shown");
        for (var k = 1; k < n; k++) {
          (function (k) { setTimeout(function () { show(k); }, 900 + (k - 1) * STEP); })(k);
        }
      });
    }, { threshold: 0.35 }).observe(moment);
  });
})();
