/*
 * Compile Studio timeline core
 * Pure helpers: every value is a function of time t. No clocks, no DOM events.
 * Safe to inline anywhere frames are rendered by seeking (browser playback,
 * HyperFrames, Remotion). The browser player in timeline.js builds on this.
 */
(function (global) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const prog = (t, start, dur) => (dur <= 0 ? (t >= start ? 1 : 0) : clamp((t - start) / dur));
  const ease = {
    linear: x => x,
    outCubic: x => 1 - Math.pow(1 - x, 3),
    outQuart: x => 1 - Math.pow(1 - x, 4),
    inCubic: x => x * x * x,
    inOutCubic: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    // CSS-style cubic-bezier, e.g. ease.bezier(0.4, 0, 0.2, 1) for a signature curve
    bezier: (x1, y1, x2, y2) => {
      const a = (p1, p2) => 1 - 3 * p2 + 3 * p1, b = (p1, p2) => 3 * p2 - 6 * p1, c = p1 => 3 * p1;
      const at = (s, p1, p2) => ((a(p1, p2) * s + b(p1, p2)) * s + c(p1)) * s;
      const slope = (s, p1, p2) => 3 * a(p1, p2) * s * s + 2 * b(p1, p2) * s + c(p1);
      return x => {
        if (x <= 0 || x >= 1) return clamp(x);
        let s = x;
        for (let i = 0; i < 8; i++) {            // Newton's method
          const d = slope(s, x1, x2);
          if (Math.abs(d) < 1e-6) break;
          s -= (at(s, x1, x2) - x) / d;
        }
        let lo = 0, hi = 1;                       // bisection fallback for flat slopes
        for (let i = 0; i < 20 && Math.abs(at(s, x1, x2) - x) > 1e-5; i++) {
          s = (lo + hi) / 2;
          at(s, x1, x2) < x ? (lo = s) : (hi = s);
        }
        return at(s, y1, y2);
      };
    }
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

  global.CompileTimeline = Object.assign(global.CompileTimeline || {}, { clamp, prog, ease, enter, sceneOpacity });
})(typeof window !== "undefined" ? window : globalThis);
