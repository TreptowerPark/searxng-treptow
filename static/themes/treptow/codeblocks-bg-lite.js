(() => {
  "use strict";

  if (window.__treptowCodeblocksLiteStarted) return;
  window.__treptowCodeblocksLiteStarted = true;

  // If the old script is accidentally loaded too, prevent its high-frequency loop.
  window.__treptowCodeblocksStarted = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const snippets = [
    "def search(query):",
    "    query = normalize(query)",
    "    return results",
    "async def request(url):",
    "    return await response.text()",
    "for engine in engines:",
    "    score += rank(engine)",
    "local node online",
    "merge(sorted_streams)",
    "yield result",
    "const q = input.value.trim();",
    "theme = 'treptow'",
    "simple_style = 'black'",
    "index shard ready",
    "response_time_ms < 900",
    "image_proxy = true",
    "GET /search",
    "POST /search",
    "dedupe(results)",
    "tokenize(query)"
  ];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick() {
    return snippets[Math.floor(Math.random() * snippets.length)];
  }

  function hostNode() {
    let host = document.getElementById("codeblocks-bg");
    if (!host) {
      host = document.createElement("div");
      host.id = "codeblocks-bg";
      host.setAttribute("aria-hidden", "true");
      document.body.insertBefore(host, document.body.firstChild);
    }
    return host;
  }

  function columnCount() {
    const width = window.innerWidth || 1200;
    if (width < 520) return 5;
    if (width < 900) return 8;
    return 12;
  }

  function textBlock() {
    const count = 5 + Math.floor(Math.random() * 7);
    const lines = [];
    for (let i = 0; i < count; i += 1) lines.push(pick());
    return lines.join("\n");
  }

  function makeColumn(index, count) {
    const el = document.createElement("pre");

    const colorRoll = Math.random();
    const depthRoll = Math.random();
    const depth = depthRoll < 0.30 ? " depth-far" : depthRoll < 0.72 ? " depth-mid" : " depth-close";
    const color = colorRoll < 0.25 ? " python" : colorRoll < 0.50 ? " rust" : colorRoll < 0.66 ? " cyan" : "";
    const bright = Math.random() < 0.10 ? " bright" : "";
    const drift = !reducedMotion.matches && Math.random() < 0.35 ? " drift-vert" : "";

    const slotWidth = 94 / Math.max(1, count);
    const slotLeft = 3 + index * slotWidth;

    el.className = "code-col" + depth + color + bright + drift;
    el.style.setProperty("--left", Math.min(92, rand(slotLeft, slotLeft + slotWidth * 0.8)).toFixed(1) + "%");
    el.style.setProperty("--top", rand(-6, 82).toFixed(1) + "%");
    el.style.setProperty("--op", rand(0.28, 0.52).toFixed(2));
    el.style.setProperty("--fs", rand(8.5, 11.5).toFixed(1) + "px");
    el.style.setProperty("--lh", rand(1.22, 1.40).toFixed(2));
    el.style.setProperty("--drift-dur", rand(95, 160).toFixed(1) + "s");
    el.textContent = textBlock();

    return el;
  }

  function render() {
    const host = hostNode();
    const count = columnCount();
    const fragment = document.createDocumentFragment();

    host.textContent = "";
    host.dataset.codeblocksReady = "lite";
    host.dataset.codeblocksCount = String(count);

    for (let i = 0; i < count; i += 1) {
      fragment.appendChild(makeColumn(i, count));
    }

    host.appendChild(fragment);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, 400);
  }, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
