(function () {
  var d = document;
  var CA = "4ujTfspNEs62PLE6eFXDctX4ixkZiHC8cE43PMe1pump";

  var progBar = d.querySelector(".x-prog");
  if (progBar) {
    var raf = 0;
    var updateScroll = function () {
      raf = 0;
      var h = d.documentElement.scrollHeight - window.innerHeight;
      progBar.style.setProperty("--sp", h > 0 ? (window.scrollY / h).toFixed(4) : "0");
    };
    window.addEventListener("scroll", function () {
      if (!raf) raf = requestAnimationFrame(updateScroll);
    }, { passive: true });
    updateScroll();
  }

  var toast = d.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  d.querySelectorAll("[data-copy-ca]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-copy-ca") || CA;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(function () {
          showToast("COPIED OFFICIAL CA: " + val.slice(0, 6) + "..." + val.slice(-6));
        });
      } else {
        var ta = d.createElement("textarea");
        ta.value = val;
        d.body.appendChild(ta);
        ta.select();
        d.execCommand("copy");
        d.body.removeChild(ta);
        showToast("COPIED OFFICIAL CA: " + val.slice(0, 6) + "..." + val.slice(-6));
      }
      var orig = btn.textContent;
      btn.textContent = "COPIED ✓";
      setTimeout(function () { btn.textContent = orig; }, 1800);
    });
  });

  d.querySelectorAll(".ba").forEach(function (ba) {
    var r = ba.querySelector(".ba-range");
    if (!r) return;
    var sync = function () { ba.style.setProperty("--pos", r.value + "%"); };
    r.addEventListener("input", sync);
    sync();
  });
  var MODES = [
    { min: 0, max: 19, alt: "1,965 FT", mach: "145 KTS · CRUISE", status: "GOLDEN HOUR COASTAL PATROL", img: "assets/media/reference_lean.png", title: "1,965 FT · Côte d'Azur Dusk Cruise", sub: "71 years old. Cream flight jacket, silk scarf, white pompadour, steady hands on the yoke." },
    { min: 20, max: 39, alt: "12,500 FT", mach: "220 KTS · AVIATOR", status: "SHADES ON CAP · ZERO TURBULENCE", img: "assets/media/shades.png", title: "12,500 FT · Sunset Aviator Shades", sub: "Above the marine layer. Unbothered by red candles, weak hands, or cockpit noise." },
    { min: 40, max: 59, alt: "35,000 FT", mach: "MACH 0.88 · JETSTREAM", status: "GOLD BULLION EMBLEM LOCKED", img: "assets/media/coin.png", title: "35,000 FT · Pure 24K $AEROPAPI Emblem", sub: "Official Solana token minted on Pump.fun. Mint & Freeze revoked." },
    { min: 60, max: 84, alt: "71,000 FT", mach: "MACH 3.2 · SUPERSONIC", status: "LASER RADAR LOCKED ON TARGET", img: "assets/media/laser.png", title: "71,000 FT · Stratosphere Laser Lock", sub: "High-altitude conviction. Laser eyes locked on PumpSwap graduation." },
    { min: 85, max: 100, alt: "384,400 KM", mach: "ESCAPE VELOCITY", status: "ORBITAL MOON LANDING CONFIRMED", img: "assets/media/moon.png", title: "384,400 KM · Lunar Orbit Achieved", sub: "The 1965 Piper touches down on the lunar surface. Full mission completion." }
  ];

  var altSlider = d.getElementById("alt-slider");
  var gAlt = d.getElementById("gauge-alt");
  var gMach = d.getElementById("gauge-mach");
  var gStatus = d.getElementById("gauge-status");
  var cImg = d.getElementById("cockpit-img");
  var cTitle = d.getElementById("cockpit-title");
  var cSub = d.getElementById("cockpit-sub");
  var presetBtns = d.querySelectorAll("[data-alt-preset]");

  function updateAltimeter(val) {
    var v = parseInt(val, 10) || 0;
    var m = MODES[0];
    for (var i = 0; i < MODES.length; i++) {
      if (v >= MODES[i].min && v <= MODES[i].max) { m = MODES[i]; break; }
    }
    if (gAlt) gAlt.textContent = m.alt;
    if (gMach) gMach.textContent = m.mach;
    if (gStatus) gStatus.textContent = m.status;
    if (cImg && cImg.getAttribute("src") !== m.img) cImg.setAttribute("src", m.img);
    if (cTitle) cTitle.textContent = m.title;
    if (cSub) cSub.textContent = m.sub;
    presetBtns.forEach(function (b) {
      var pv = parseInt(b.getAttribute("data-alt-preset"), 10);
      b.classList.toggle("active", pv >= m.min && pv <= m.max);
    });
  }

  if (altSlider) {
    altSlider.addEventListener("input", function () { updateAltimeter(altSlider.value); });
    presetBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var pv = b.getAttribute("data-alt-preset");
        altSlider.value = pv;
        updateAltimeter(pv);
      });
    });
    updateAltimeter(altSlider.value);
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    d.querySelectorAll(".btn-primary, .btn-gold").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        b.style.setProperty("--mx", (x * 8).toFixed(1) + "px");
        b.style.setProperty("--my", (y * 6).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", function () {
        b.style.removeProperty("--mx");
        b.style.removeProperty("--my");
      });
    });
  }

  // Hero 3D Emblem Switcher & Interactive Tilt
  var heroImg = d.getElementById("hero-showcase-img");
  var heroLabel = d.getElementById("hero-hud-label");
  var heroBtns = d.querySelectorAll("[data-hero-img]");
  var radarStage = d.getElementById("hero-radar-stage");
  var tiltFrame = d.getElementById("hero-tilt-frame");

  heroBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-hero-img");
      var lbl = btn.getAttribute("data-hero-label");
      if (heroImg && src) heroImg.setAttribute("src", src);
      if (heroLabel && lbl) heroLabel.textContent = lbl;
      heroBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
    });
  });

  if (radarStage && tiltFrame && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    radarStage.addEventListener("pointermove", function (e) {
      var r = radarStage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tiltFrame.style.setProperty("--ry", (x * 18).toFixed(1) + "deg");
      tiltFrame.style.setProperty("--rx", (-y * 18).toFixed(1) + "deg");
    });
    radarStage.addEventListener("pointerleave", function () {
      tiltFrame.style.setProperty("--ry", "0deg");
      tiltFrame.style.setProperty("--rx", "0deg");
    });
  }

  fetch("https://api.dexscreener.com/latest/dex/tokens/" + CA)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var p = (data && data.pairs && data.pairs[0]) || null;
      if (!p) return;
      var priceEl = d.getElementById("live-price");
      var mcapEl = d.getElementById("live-mcap");
      var dexEl = d.getElementById("live-dex");
      if (priceEl && p.priceUsd) priceEl.textContent = "$" + p.priceUsd;
      if (mcapEl && (p.marketCap || p.fdv)) {
        var mc = p.marketCap || p.fdv;
        mcapEl.textContent = "$" + Number(mc).toLocaleString("en-US", { maximumFractionDigits: 0 });
      }
      if (dexEl && p.dexId) dexEl.textContent = p.dexId.toUpperCase() + " · LIVE";
    })
    .catch(function () {});
})();

