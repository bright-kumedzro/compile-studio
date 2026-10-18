/*
 * Compile Studio browser player
 * Play, pause, scrub and time readout for a page. Requires timeline-core.js first.
 * Usage:
 *   const tl = CompileTimeline.create({ duration, render, controls: { play, scrub, time } });
 *   render(t) is called with the current time in seconds.
 * Not used in video renders: there, the renderer seeks render(t) directly.
 */
(function (global) {
  const { clamp } = global.CompileTimeline;

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

  global.CompileTimeline.create = create;
})(window);
