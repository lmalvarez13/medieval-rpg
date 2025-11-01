const { useEffect, useMemo } = React;

/** ================= Defaults & URL overrides =================
 * THEME: 'medieval' (default) | 'cozy' | 'scifi' | 'aurora' | 'embers' | 'retro'
 * SHOW_CONTROLS: true/false (default false)
 * ASPECT_MODE: '16:9' (default) | 'auto'
 */
const THEME = new URLSearchParams(location.search).get("theme") || "aurora";
const SHOW_CONTROLS =
  (new URLSearchParams(location.search).get("controls") ?? "false") === "true";
const ASPECT_MODE =
  new URLSearchParams(location.search).get("aspect") || "16:9"; // default changed to 16:9

function applyTheme(theme) {
  const map = {
    medieval: "theme-medieval",
    cozy: "theme-cozy",
    scifi: "theme-scifi",
    aurora: "theme-aurora",
    embers: "theme-embers",
    retro: "theme-retro",
  };
  const cls = map[theme] || map.aurora;
  document.body.classList.remove(
    "theme-medieval",
    "theme-cozy",
    "theme-scifi",
    "theme-aurora",
    "theme-embers",
    "theme-retro"
  );
  document.body.classList.add(cls);
}

function BackButton() {
  return (
    <a
      className="btn"
      href="https://lmalvarez13.github.io/"
      aria-label="Go back"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
      <span>Go back</span>
    </a>
  );
}

function RepoButton() {
  return (
    <a
      className="btn repoBtn"
      href="https://github.com/lmalvarez13"
      target="_blank"
      rel="noopener"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.02 1.53 1.02 .9 1.54 2.36 1.1 2.94.84 .09-.65.35-1.1.63-1.35 -2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.99 1.02-2.69 -.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02 .55 1.38.2 2.4.1 2.65 .63.7 1.02 1.6 1.02 2.69 0 3.83-2.35 4.67-4.58 4.92 .36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.58.69.48A10 10 0 0 0 12 2z"
        />
      </svg>
      <span>See this game's repository!</span>
    </a>
  );
}

function Header() {
  return (
    <div className="header">
      <BackButton />
      <div></div>
    </div>
  );
}

function useUnity() {
  useEffect(() => {
    applyTheme(THEME);
    // Classic UnityLoader.js
    if (window.UnityLoader && !window.gameInstance) {
      try {
        window.gameInstance = UnityLoader.instantiate(
          "gameContainer",
          "Build/WebGL.json",
          { onProgress: window.UnityProgress }
        );
      } catch (e) {
        console.warn("UnityLoader failed", e);
      }
    }
    // New loader snippet available if needed.
  }, []);
}
function ParticleLayer() {
  const css = getComputedStyle(document.body);
  const enabled =
    (css.getPropertyValue("--particles-enabled") || "1").trim() !== "0";

  if (!enabled) return <div className="ambient-glow" aria-hidden="true"></div>;

  const sparksCount = parseInt(css.getPropertyValue("--sparks-count")) || 70;
  const smokeCount = parseInt(css.getPropertyValue("--smoke-count")) || 24;

  const sizeMin = parseFloat(css.getPropertyValue("--particle-size-min")) || 2;
  const sizeMax = parseFloat(css.getPropertyValue("--particle-size-max")) || 4;
  const durMin =
    parseFloat(css.getPropertyValue("--particle-duration-min")) || 3.5;
  const durMax =
    parseFloat(css.getPropertyValue("--particle-duration-max")) || 7.5;

  const mode = (css.getPropertyValue("--particle-mode") || "rise").trim();
  const animationName =
    mode === "down"
      ? "fallDown"
      : mode === "drift"
      ? "driftSide"
      : mode === "orbit"
      ? "orbit"
      : "riseGeneric";

  const colors = [
    (css.getPropertyValue("--p-color-1") || "#5eead4").trim(),
    (css.getPropertyValue("--p-color-2") || "#a78bfa").trim(),
    (css.getPropertyValue("--p-color-3") || "#34d399").trim(),
  ];

  const rand = (a, b) => Math.random() * (b - a) + a;
  const randPx = (a, b) => rand(a, b).toFixed(1) + "px";
  const randSec = (a, b) => rand(a, b).toFixed(2) + "s";
  const randVw = (a, b) => rand(a, b).toFixed(2) + "vw";
  const pct = () => (Math.random() * 100).toFixed(2) + "%";

  const sparks = Array.from({ length: sparksCount }).map((_, i) => {
    const size = randPx(sizeMin, sizeMax);
    const color = colors[i % 3];
    const driftX = randVw(-25, 25);
    const driftY = randVw(-8, 8); // used for orbit mode
    return {
      left: pct(),
      width: size,
      height: size,
      animationName,
      animationDuration: randSec(durMin, durMax),
      animationDelay: (-Math.random() * durMax).toFixed(2) + "s",
      "--sx": driftX,
      "--sy": driftY,
      background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`,
      boxShadow: `0 0 14px ${color}`,
    };
  });

  const smokes = Array.from({ length: smokeCount }).map(() => {
    const size = randPx(sizeMin + 4, sizeMax + 10);
    const driftX = randVw(-15, 15);
    const driftY = randVw(-10, 10);
    return {
      left: pct(),
      width: size,
      height: size,
      animationName,
      animationDuration: randSec(durMin + 2, durMax + 4),
      animationDelay: (-Math.random() * durMax).toFixed(2) + "s",
      "--sx": driftX,
      "--sy": driftY,
      background:
        "radial-gradient(circle, rgba(215,225,235,.25) 0%, rgba(160,170,180,.10) 60%, rgba(120,130,140,0) 70%)",
      filter: "blur(2px)",
    };
  });

  return (
    <>
      <div className="layer">
        {sparks.map((style, idx) => (
          <div key={"s" + idx} className="p" style={style} />
        ))}
      </div>
      <div className="layer">
        {smokes.map((style, idx) => (
          <div key={"m" + idx} className="p" style={style} />
        ))}
      </div>
      <div className="ambient-glow" aria-hidden="true"></div>
    </>
  );
}

function ControlsPanel() {
  return (
    <aside
      className="controls-fixed"
      role="complementary"
      aria-label="Controls"
    >
      <h3>Controls</h3>
      <div className="row">
        <span className="k">WASD</span> Move
      </div>
      <div className="row">
        <span className="k">Mouse</span> Look / Aim
      </div>
      <div className="row">
        <span className="k">Space</span> Jump / Interact
      </div>
      <div className="row">
        <span className="k">F</span> Fullscreen
      </div>
    </aside>
  );
}

function App() {
  useUnity();

  const goFullscreen = () => {
    const gi = window.gameInstance;
    if (gi && gi.SetFullscreen) gi.SetFullscreen(1);
    else {
      const el = document.documentElement;
      (
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen ||
        el.mozRequestFullScreen
      )?.call(el);
    }
  };

  const playClass = "play " + (ASPECT_MODE === "16:9" ? "fixed169" : "auto");

  return (
    <>
      <Header />
      <RepoButton />
      <ParticleLayer />
      {(new URLSearchParams(location.search).get("controls") ?? "false") ===
      "true" ? (
        <ControlsPanel />
      ) : null}

      <div className="wrap">
        <section className="frame" aria-label="Game frame">
          <div className={playClass}>
            <div className="stage">
              <div
                id="gameContainer"
                tabIndex={0}
                aria-label="Unity WebGL Canvas"
              ></div>
              <button
                className="fsBtn"
                title="Fullscreen"
                onClick={goFullscreen}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M7 14H5v5h5v-2H7v-3zm12 0h-2v3h-3v2h5v-5zM7 7h3V5H5v5h2V7zm7-2v2h3v3h2V5h-5z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="title" id="game-title">
            Medieval RPG | Unity Engine
          </div>
        </section>
      </div>
    </>
  );
}

//const root = ReactDOM.createRoot(document.getElementById("root"));
//root.render(<App/>);
applyTheme(THEME); // apply ASAP so URL override wins deterministically
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
