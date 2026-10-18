/*
 * Compile Studio timeline engine
 * Deterministic, scrubbable animation: every frame is a pure function of time t.
 * Usage:
 *   const tl = CompileTimeline.create({ duration, render, controls: { play, scrub, time } });
 *   render(t) is called with the current time in seconds.
 */
(function (global) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const prog = (t, start, dur) => (dur <= 0 ? (t >= start ? 1 : 0) : clamp((t - start) / dur));
  const ease = {
    linear: x => x,
    outCubic: x => 1 - Math.pow(1 - x, 3),
    outQuart: x => 1 - Math.pow(1 - x, 4),
    inCubic: x => x * x * x,
    inOutCubic: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
  };
  // Fade + rise entrance driven by progress p (0..1)
  const enter = (el, p, dist = 14, fn = ease.outCubic) => {
    if (!el) return;
    const e = fn(clamp(p));
    el.style.opacity = e;
    el.style.transform = `translateY(${(1 - e) * dist}px)`;
  };
  // Scene opacity with fade in/out; the last scene holds at the end
  const sceneOpacity = (t, start, end, fade, isLast) => {
    const fin = prog(t, start, fade);
    const fout = isLast ? 1 : 1 - prog(t, end - fade, fade);
    return Math.min(fin, fout);
  };

  function create({ duration, render, controls = {}, reducedMotionAt = null }) {
    const { play: playBtn, scrub, time: timeEl } = controls;
    let t = 0, playing = false, last = null;

    const draw = () => {
      render(t);
      if (scrub) scrub.value = Math.round((t / duration) * 1000);
      if (timeEl) timeEl.textContent = t.toFixed(1) + "s";
    };
    const tick = now => {
      if (!playing) { last = null; return; }
      if (last !== null) t += (now - last) / 1000;
      last = now;
      if (t >= duration) { t = duration; playing = false; if (playBtn) playBtn.textContent = "Replay"; draw(); return; }
      draw();
      requestAnimationFrame(tick);
    };
    const play = () => { if (t >= duration) t = 0; playing = true; last = null; if (playBtn) playBtn.textContent = "Pause"; requestAnimationFrame(tick); };
    const pause = () => { playing = false; if (playBtn) playBtn.textContent = "Play"; };
    const seek = s => { t = clamp(s, 0, duration); draw(); };

    if (playBtn) playBtn.addEventListener("click", () => (playing ? pause() : play()));
    if (scrub) scrub.addEventListener("input", () => { pause(); seek((scrub.value / 1000) * duration); });

    const reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { seek(reducedMotionAt ?? duration); pause(); }
    else { seek(0); play(); }

    return { play, pause, seek, get time() { return t; } };
  }

  global.CompileTimeline = { create, clamp, prog, ease, enter, sceneOpacity };
})(window);
