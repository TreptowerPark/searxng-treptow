(() => {
  "use strict";

  if (window.__treptowCodeblocksStarted) return;
  window.__treptowCodeblocksStarted = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  console.info("[treptow-codeblocks] script loaded", {
    reducedMotion: reducedMotion.matches,
    readyState: document.readyState
  });

  const timers = new Set();

  function later(fn, ms) {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  }

  function clearTimers() {
    for (const id of timers) window.clearTimeout(id);
    timers.clear();
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function gauss(mean, stddev) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  const noisePool = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン．：＊";

  const linePool = [
    "def search(query):",
    "    query = normalize(query)",
    "    return aggregate(results)",
    "async def fetch(url):",
    "    async with session.get(url) as r:",
    "        return await r.text()",
    "engines = ['brave', 'duckduckgo', 'wikipedia']",
    "for engine in enabled_engines:",
    "    result.score += rank(engine)",
    "hash.update(window)",
    "fingerprint = h.digest()",
    "robots = 'noarchive'",
    "no logs. no tracking.",
    "privacy = True",
    "local node online",
    "searxng.query.normalize()",
    "result.url = proxify(result.url)",
    "cache = None",
    "session.cookies.clear()",
    "headers.pop('Referer', None)",
    "safe_search = 0",
    "autocomplete = ''",
    "GET /search?q=treptow",
    "POST /search",
    "rank = bm25(term, document)",
    "tokenize(query)",
    "dedupe(results)",
    "merge(sorted_streams)",
    "yield result",
    "if timeout: suspend(engine)",
    "except Captcha: retry = False",
    "def onion_route(packet):",
    "    return hop(next_node)",
    "let privacy = true;",
    "const q = input.value.trim();",
    "const node = 'treptow';",
    "window.__searxng = 'private';",
    "fetch('/search?q=' + encode(q))",
    "result.score += freshness",
    "normalize_unicode(query)",
    "strip_tracking_params(url)",
    "utm_source = null",
    "referrer_policy = 'no-referrer'",
    "content_security_policy",
    "X-Robots-Tag: noindex",
    "permissions_policy = minimal",
    "GET /preferences",
    "theme = 'treptow'",
    "simple_style = 'black'",
    "meta.search.local",
    "zero telemetry",
    "local first",
    "public engines, private query",
    "node.status = online",
    "index shard ready",
    "response_time_ms < 900",
    "rate.limit.ok",
    "valkey optional",
    "granian worker online",
    "uwsgi spool idle",
    "query_in_title = false",
    "image_proxy = true",
    "results_on_new_tab = false"
  ];

  for (let i = 0; i < 34; i++) {
    const len = 4 + Math.floor(Math.random() * 11);
    linePool.push(Array(len).fill(0).map(() => noisePool[Math.floor(Math.random() * noisePool.length)]).join(""));
  }

  function ensureHost() {
    let host = document.getElementById("codeblocks-bg");
    if (!host) {
      host = document.createElement("div");
      host.id = "codeblocks-bg";
      host.setAttribute("aria-hidden", "true");
      document.body.insertBefore(host, document.body.firstChild);
    }
    return host;
  }

  function desiredColumnCount() {
    const width = window.innerWidth || 1200;
    if (width < 520) return 14 + Math.floor(Math.random() * 6);
    if (width < 900) return 24 + Math.floor(Math.random() * 8);
    return 44 + Math.floor(Math.random() * 14);
  }

  function spawnColumn(host, delay, forceVisible = false) {
    if (!host || !host.isConnected) return;

    if (document.hidden) {
      later(() => spawnColumn(host, rand(500, 1800), forceVisible), 1800);
      return;
    }

    const el = document.createElement("pre");
    const isBright = Math.random() < 0.24;
    const colorRoll = Math.random();
    const hasDrift = !forceVisible && Math.random() < 0.68;
    const depthRoll = Math.random();
    const depth = depthRoll < 0.28 ? " depth-far" : depthRoll < 0.64 ? " depth-mid" : " depth-close";
    const color =
      colorRoll < 0.25 ? " python" :
      colorRoll < 0.52 ? " rust" :
      colorRoll < 0.72 ? " cyan" :
      "";

    el.className = "code-col" + depth + (hasDrift ? " drift-vert" : "") + color + (isBright ? " bright" : "");
    el.style.setProperty("--left", rand(forceVisible ? 5 : -3, forceVisible ? 88 : 96).toFixed(1) + "%");

    if (forceVisible) {
      el.style.setProperty("--top", rand(8, 68).toFixed(1) + "%");
    } else if (hasDrift) {
      el.style.setProperty("--top", rand(-36, 24).toFixed(1) + "%");
      el.style.setProperty("--drift-dur", Math.max(38, gauss(78, 26)).toFixed(1) + "s");
    } else {
      el.style.setProperty("--top", rand(3, 78).toFixed(1) + "%");
    }

    el.style.setProperty("--op", rand(0.74, 1.00).toFixed(2));
    el.style.setProperty("--fs", rand(11, 17).toFixed(1) + "px");
    el.style.setProperty("--lh", rand(1.15, 1.45).toFixed(2));

    const textNode = document.createTextNode("");
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "▌";

    el.appendChild(textNode);
    el.appendChild(cursor);
    host.appendChild(el);

    startTyping(host, el, textNode, cursor, delay);
  }

  function pickLine() {
    return linePool[Math.floor(Math.random() * linePool.length)];
  }

  function startTyping(host, el, textNode, cursor, delay) {
    let typed = "";
    let currentLine = pickLine();
    let lineIdx = 0;
    let linesDone = 0;
    const maxLines = 6 + Math.floor(Math.random() * 13);
    const baseSpeed = rand(35, 95);

    function chooseNextLine() {
      currentLine = pickLine();
      lineIdx = 0;
    }

    if (reducedMotion.matches) {
      const lines = [];
      for (let i = 0; i < maxLines; i += 1) lines.push(pickLine());
      textNode.textContent = lines.join("\n");
      cursor.remove();
      return;
    }

    function typeForward() {
      if (!el.isConnected) return;

      if (document.hidden) {
        later(typeForward, 1000);
        return;
      }

      if (lineIdx < currentLine.length) {
        typed += currentLine[lineIdx];
        textNode.textContent = typed;
        lineIdx += 1;

        if (Math.random() < 0.026) {
          const back = 2 + Math.floor(Math.random() * 7);
          const actual = Math.min(back, typed.length, lineIdx);
          cursor.style.opacity = "0";
          later(() => typeHesitate(actual), rand(140, 460));
          return;
        }

        const ch = currentLine[lineIdx - 1];
        const pause = ch === " " ? baseSpeed * rand(0.75, 1.20) : baseSpeed * rand(0.62, 1.22);
        later(typeForward, pause);
        return;
      }

      typed += "\n";
      textNode.textContent = typed;
      linesDone += 1;

      if (linesDone >= maxLines || Math.random() < 0.12) {
        cursor.style.animation = "none";
        cursor.style.opacity = "0";
        later(typeBackward, rand(520, 1400));
      } else {
        chooseNextLine();
        later(typeForward, baseSpeed * rand(1.35, 2.7));
      }
    }

    function typeHesitate(backCount) {
      if (!el.isConnected) return;

      if (backCount > 0 && typed.length > 0 && lineIdx > 0) {
        typed = typed.slice(0, -1);
        textNode.textContent = typed;
        lineIdx = Math.max(0, lineIdx - 1);
        later(() => typeHesitate(backCount - 1), baseSpeed * rand(0.14, 0.34));
      } else {
        cursor.style.opacity = "";
        if (Math.random() < 0.25) chooseNextLine();
        later(typeForward, baseSpeed * rand(2.4, 6.2));
      }
    }

    function typeBackward() {
      if (!el.isConnected) return;

      if (document.hidden) {
        later(typeBackward, 1000);
        return;
      }

      if (typed.length > 0) {
        const last = typed[typed.length - 1];
        typed = typed.slice(0, -1);
        textNode.textContent = typed;
        const pause = last === "\n" ? baseSpeed * rand(0.48, 1.05) : baseSpeed * rand(0.18, 0.42);
        later(typeBackward, pause);
      } else {
        el.style.animation = "codeblocks-type-fade-out 1s ease forwards";
        later(() => {
          el.remove();
          spawnColumn(host, rand(420, 1600));
        }, 520);
      }
    }

    chooseNextLine();
    later(typeForward, delay);
  }

  function start() {
    const host = ensureHost();
    host.textContent = "";
    host.dataset.codeblocksReady = "true";

    const count = desiredColumnCount();
    console.info("[treptow-codeblocks] start", { count });

    for (let i = 0; i < count; i += 1) {
      spawnColumn(host, i < 14 ? i * 45 : i * rand(55, 140), i < 14);
    }
  }

  function restart() {
    clearTimers();
    const host = ensureHost();
    host.textContent = "";
    start();
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(restart, 600);
  }, { passive: true });

  reducedMotion.addEventListener?.("change", event => {
    if (event.matches) {
      clearTimers();
      const host = document.getElementById("codeblocks-bg");
      if (host) host.textContent = "";
    } else {
      restart();
    }
  });

  window.addEventListener("pagehide", clearTimers);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();