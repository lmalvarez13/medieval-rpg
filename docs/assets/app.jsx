const { useEffect, useMemo } = React;

function BackButton(){
  return (
    <a className="btn" href="https://lmalvarez13.github.io/" aria-label="Go back">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      <span>Go back</span>
    </a>
  );
}

function RepoButton(){
  return (
    <a className="btn repoBtn" href="https://github.com/lmalvarez13" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.02 1.53 1.02 .9 1.54 2.36 1.1 2.94.84 .09-.65.35-1.1.63-1.35 -2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.99 1.02-2.69 -.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02 .55 1.38.2 2.4.1 2.65 .63.7 1.02 1.6 1.02 2.69 0 3.83-2.35 4.67-4.58 4.92 .36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
      <span>See this game's repository!</span>
    </a>
  );
}

function Header(){
  return (
    <div className="header">
      <BackButton/>
      <div></div>
    </div>
  );
}

function FullscreenButton({ onClick }){
  return (
    <button className="fsBtn" title="Fullscreen" onClick={onClick}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm12 0h-2v3h-3v2h5v-5zM7 7h3V5H5v5h2V7zm7-2v2h3v3h2V5h-5z"/>
      </svg>
    </button>
  );
}

function useUnity(){
  useEffect(() => {
    if (window.UnityLoader && !window.gameInstance) {
      try {
        window.gameInstance = UnityLoader.instantiate("gameContainer", "Build/WebGL.json", { onProgress: window.UnityProgress });
      } catch(e){ console.warn("UnityLoader failed", e); }
    }
    // Newer createUnityInstance flow available below if needed.
  }, []);
}

function FireField({ sparks=70, smoke=28 }){
  const sparkEls = useMemo(() => Array.from({length:sparks}), [sparks]);
  const smokeEls = useMemo(() => Array.from({length:smoke}), [smoke]);
  const rand = (min, max) => Math.random() * (max - min) + min;

  return (
    <>
      <div className="fireField">
        {sparkEls.map((_, i) => {
          const left = rand(0, 100).toFixed(2) + "%";
          const dur = rand(3.5, 7.5).toFixed(2) + "s";
          const delay = (-rand(0, 7)).toFixed(2) + "s";
          const drift = rand(-25, 25).toFixed(2) + "vw";
          const style = { left, animationDuration: dur, animationDelay: delay, animationName: "rise", "--sx": drift };
          return <div key={"s"+i} className="spark" style={style}/>;
        })}
      </div>
      <div className="smokeField">
        {smokeEls.map((_, i) => {
          const left = rand(0, 100).toFixed(2) + "%";
          const size = rand(8, 18).toFixed(1) + "px";
          const dur = rand(6, 11).toFixed(2) + "s";
          const delay = (-rand(0, 10)).toFixed(2) + "s";
          const drift = rand(-15, 15).toFixed(2) + "vw";
          const style = { left, width:size, height:size, animationDuration: dur, animationDelay: delay, animationName:"driftUp", "--sx": drift };
          return <div key={"m"+i} className="smoke" style={style}/>;
        })}
      </div>
      <div className="fire-glow" aria-hidden="true"></div>
    </>
  );
}

function App(){
  useUnity();

  const goFullscreen = () => {
    const gi = window.gameInstance;
    if (gi && gi.SetFullscreen) gi.SetFullscreen(1);
    else {
      const el = document.documentElement;
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen)?.call(el);
    }
  };

  return (
    <>
      <Header/>
      <RepoButton/>
      <FireField/>
      <div className="wrap">
        <section className="frame" aria-label="Game frame">
          <div className="play">
            <div className="stage">
              <div id="gameContainer" tabIndex={0} aria-label="Unity WebGL Canvas"></div>
              <FullscreenButton onClick={goFullscreen}/>
            </div>
          </div>
          <div className="title" id="game-title">Your Game Title — Unity WebGL</div>
        </section>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
