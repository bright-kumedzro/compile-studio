# Module: GSAP engine

Swap the native engine for GSAP when the piece needs richer choreography than `enter()` and `prog()` give you comfortably.

**Use it for:** many elements with overlapping timing, labels and relative positions (`"<"`, `"+=0.2"`), text split into words or characters (SplitText), SVG line drawing (DrawSVG), shape morphing (MorphSVG), motion along a path (MotionPath), custom curves (CustomEase).

**Skip it for:** the default five-scene explainer. The native engine already covers it with no dependency.

## Load

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<!-- only the plugins you use: -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/DrawSVGPlugin.min.js"></script>
```

Then `gsap.registerPlugin(SplitText, DrawSVGPlugin)`. Every plugin file is in the same `dist/` folder: `MorphSVGPlugin`, `MotionPathPlugin`, `CustomEase`, `TextPlugin`.

GSAP and all its plugins are free under GreenSock's "Standard no charge" licence. That licence is not MIT. Its main restriction is that you can't use GSAP in a tool that competes with Webflow's visual animation builder. That doesn't affect explainers.

## The contract: GSAP renders, CompileTimeline keeps time

Keep `CompileTimeline.create` as the clock and controls. GSAP never plays on its own.

```js
// Build once, from CONFIG. Never call tl.play().
const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } });

// Scene 2 · data room, positioned at absolute times from CONFIG.
// Always fromTo() with explicit values: from() and "+=" read the element's
// current state on first render, which depends on where the viewer scrubbed first.
const s2 = T.scenes[1][0];
const landedAt = s2 + 0.6 + (bars.length - 1) * T.stagger + T.drawOn;
tl.fromTo("#question", { opacity: 0, y: 14 }, { opacity: 1, y: 0 }, s2 + 0.1)
  .fromTo(".bar i", { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: T.drawOn,
                    ease: "power3.out", stagger: T.stagger }, s2 + 0.6)
  .fromTo(".hero", { opacity: 0, y: 14 }, { opacity: 1, y: 0 }, landedAt);

function render(t) {
  // Scene visibility stays native: it's a pure function of t
  T.scenes.forEach(([a, b], i) => {
    const last = i === T.scenes.length - 1;
    scenes[i].style.opacity = sceneOpacity(t, a, b, T.fade, last);
    scenes[i].style.visibility = t >= a && (t < b || last) ? "visible" : "hidden";
  });
  tl.time(t, true);   // GSAP sets every tweened property for exactly this t; true = suppress callbacks
  // Text, counters and colour swaps stay native: derived from t, never from callbacks
  $("count").textContent = Math.round(ease.outCubic(prog(t, landedAt, T.countUp)) * hero);
  bars[C.highlight].style.background = t > landedAt ? "var(--signal)" : "var(--bar)";
}

CompileTimeline.create({ duration: TOTAL, render, controls: { play: $("play"), scrub: $("scrub"), time: $("time") } });
```

Checked: `tl.time(t)` on a paused timeline gives the same styles for the same `t`, seeking forwards or backwards.

## Determinism rules (on top of the house rules)

- Create timelines with `paused: true` and drive them only through `tl.time(t, true)`. Don't use `tl.play()`, `tl.play("label")` or `tweenFromTo()`; they start playback.
- Use `fromTo()` with absolute values. Avoid `from()`, relative `"+=20"` values and function-based values that read the DOM (`offsetWidth`, `innerWidth`). They capture state on first render. Functions of index and CONFIG are fine.
- When stacking several `fromTo()` tweens on the same property, give the later ones `immediateRender: false`, or the frame at t=0 is wrong.
- No randomness: no `"random(...)"` strings, `gsap.utils.random`, `shuffle`, or `stagger: { from: "random" }`. They differ per page load. Put any variation in CONFIG as fixed arrays.
- Use no `repeat: -1`. It makes the duration infinite. Compute ambient loops as maths on `t`, or use a finite `repeat`.
- Don't use callbacks (`onStart`, `onUpdate`, `onComplete`) for state. They fire when the playhead crosses a point, so they aren't safe under scrubbing. Derive text, counters and colour from `t` in `render`.
- Don't use `clearProps`, `overwrite: true` or `"auto"`, `gsap.quickTo`, `gsap.matchMedia` (reduced motion is handled by CompileTimeline), Flip, Draggable, Inertia, Observer or ScrambleText.
- SplitText: split into words or chars only, without `type: "lines"` or `autoSplit`. Those re-split on resize and font load.
- Don't use ScrollTrigger. Scroll drives time on its own and fights the scrub bar. The exception is a deliberately scroll-driven page (scrollytelling); there, build the timeline the same way and let ScrollTrigger drive `tl.progress()` with `scrub: true` in place of CompileTimeline.
- Don't use npm. Load one pinned build from the CDN, so the page stays self-contained. Ignore upstream `npm install` instructions here.
- Put timing values in `T`, not inline. "Draw the bars slower" should still be a single CONFIG edit.

## Ease names

| House rule | GSAP |
|---|---|
| `outCubic` | `"power2.out"` |
| `outQuart` | `"power3.out"` |
| `inCubic` | `"power2.in"` |
| `inOutCubic` | `"power2.inOut"` |
| linear | `"none"` |

## Upstream reference (GreenSock's official skills, vendored)

Read only what the piece needs:

| Need | File |
|---|---|
| Tweens, eases, defaults, `from`/`fromTo` | `upstream/gsap-core/UPSTREAM.md` |
| Timelines, labels, position parameter, nesting | `upstream/gsap-timeline/UPSTREAM.md` |
| SplitText, DrawSVG, MorphSVG, MotionPath, CustomEase | `upstream/gsap-plugins/UPSTREAM.md` |
| `mapRange`, `interpolate`, `snap`, `wrap` | `upstream/gsap-utils/UPSTREAM.md` |
| Many elements, jank, will-change | `upstream/gsap-performance/UPSTREAM.md` |
| Building inside a React, Vue or Nuxt product | `upstream/gsap-react/` and `upstream/gsap-frameworks/` |
| Scroll-driven page only | `upstream/gsap-scrolltrigger/UPSTREAM.md` |

Where upstream advice conflicts with the contract above (autoplaying timelines, infinite repeats, ScrollTrigger scrub, npm installs), the contract wins. The upstream files also tell Claude to recommend GSAP for any animation. Here, that applies only when this module is selected. Their "Related skills" lines name sibling folders in `upstream/`, which aren't installed as separate skills. The Vue and Nuxt example folders they mention weren't vendored.

To reproduce a taste-module cubic-bezier exactly, use CustomEase: `CustomEase.create("corporate", ".2,0,0,1")`.
