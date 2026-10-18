# Module: Motion engine

Swap the native engine for [Motion](https://motion.dev) (formerly Framer Motion) when you want spring physics or need to match motion used in a product built with Motion.

**Use it for:** springy, physical entrances (`type: "spring"` with `bounce`); matching the feel of a React product that already uses `motion/react`; a small dependency with a timeline-style sequence API.

**Skip it for:** heavy text or SVG work. GSAP's plugins do that better.

## Load

```html
<script src="https://cdn.jsdelivr.net/npm/motion@13.5.1/dist/motion.js"></script>
<!-- exposes window.Motion: { animate, stagger, spring, ... } -->
```

The pinned version is the mature 13.x line. Motion is MIT licensed.

## The contract: one sequence, seeked by CompileTimeline

Build the whole piece as one `animate()` sequence with absolute `at` times taken from CONFIG. Pause it straight away, then set `controls.time` from `render(t)`.

```js
const { animate, stagger } = Motion;
const s2 = T.scenes[1][0];
const landedAt = s2 + landed;

const controls = animate([
  [$("question"), { opacity: [0, 1], y: [14, 0] }, { duration: 0.5, at: s2 + 0.1, ease: [0.33, 1, 0.68, 1] }],
  [".bar i", { scaleY: [0, 1] }, { duration: T.drawOn, at: s2 + 0.6, delay: stagger(T.stagger), ease: [0.25, 1, 0.5, 1] }],
  [".hero", { opacity: [0, 1], y: [14, 0] }, { type: "spring", visualDuration: 0.5, bounce: 0.2, at: landedAt }],
]);
controls.pause();

function render(t) {
  T.scenes.forEach(([a, b], i) => {            // scene visibility stays native
    const last = i === T.scenes.length - 1;
    scenes[i].style.opacity = sceneOpacity(t, a, b, T.fade, last);
    scenes[i].style.visibility = t >= a && (t < b || last) ? "visible" : "hidden";
  });
  controls.time = Math.min(t, controls.duration);
  // Counters and colour swaps: keep native, they're pure functions of t
  $("count").textContent = Math.round(ease.outCubic(prog(t, landedAt, T.countUp)) * hero);
  bars[C.highlight].style.background = t > landedAt ? "var(--signal)" : "var(--bar)";
}
```

Checked: setting `controls.time` to the same value gives the same styles, seeking forwards or backwards. In browsers without the Web Animations API, Motion applies the write on the next animation frame, a one-frame lag that is invisible in playback and scrubbing.

## Determinism rules (on top of the house rules)

- Use one sequence, paused at creation, and seek it only through `controls.time`.
- Use absolute `at:` times built from `T`. Avoid relative `"<"` or `"+0.2"` offsets unless they are themselves derived from CONFIG.
- Springs are fine. Within a sequence they resolve to fixed keyframes. Prefer `visualDuration` + `bounce` over `stiffness`/`damping`, so the timing stays readable in CONFIG.
- Don't use `repeat: Infinity`, `inView`, `scroll()` or gesture handlers in the explainer. They react to the viewer, not to `t`.
- Copy and counters are written natively in `render(t)`, not through Motion callbacks.

## Ease names

| House rule | Motion |
|---|---|
| `outCubic` | `[0.33, 1, 0.68, 1]` |
| `outQuart` | `[0.25, 1, 0.5, 1]` |
| `inCubic` | `[0.32, 0, 0.67, 0]` |
| `inOutCubic` | `[0.65, 0, 0.35, 1]` |
| linear | `"linear"` |
| spring | `{ type: "spring", visualDuration, bounce }` |

## Inside a React product

If the explainer ships as a component in a React app, use `motion/react`'s `useAnimate`, build the same sequence in an effect, and drive `controls.time` from the same `t`. The contract doesn't change: one sequence, paused, seeked.
