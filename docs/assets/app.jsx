
const { useEffect } = React;

function ParticleLayer({ count = 80 }) {
  useEffect(() => {
    const container = document.getElementById("root");
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDelay = Math.random() * 5 + "s";
      p.style.opacity = Math.random();
      container.appendChild(p);
    }
  }, [count]);
  return null;
}

function App() {
  useEffect(() => {
    UnityLoader.instantiate("gameContainer", "Build/WebGL.json", {
      onProgress: UnityProgress,
    });
  }, []);

  return (
    <div className="frame-container">
      <div id="gameContainer" className="play auto-aspect"></div>
      <div className="controls-panel">
        <strong>Controls</strong><br/>
        - Arrow Keys<br/>
        - Z to Jump<br/>
        - X to Attack
      </div>
      <a className="btn backBtn" href="https://lmalvarez13.github.io/">← Go back</a>
      <a className="btn repoBtn" href="https://github.com/lmalvarez13">See this game's repository</a>
      <button className="btn fullscreenBtn" onClick={() => {
        const game = document.getElementById('gameContainer').children[0];
        if (game && game.SetFullscreen) game.SetFullscreen(1);
      }} />
      <ParticleLayer count={60} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
