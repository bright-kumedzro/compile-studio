# Module: Lottie layer

Lottie isn't an engine here. It's a layer: a Lottie animation (an icon, illustration, character or logo sting) placed inside a scene and scrubbed in sync with `t`. It works alongside any engine: native, GSAP or Motion.

**Use it for:** illustrated or character motion that would be painful to build from DOM elements, such as a designer's After Effects export, a LottieFiles asset or an animated brand mark.

**Skip it for:** charts, numbers and text. Those must stay live DOM driven by CONFIG, so the data stays checkable and editable.

## Where the animation comes from

1. **A designer's export** (After Effects → Bodymovin or LottieFiles plugin). This is the best quality.
2. **A LottieFiles asset.** Check the licence on the asset page before using it.
3. **Hand-written JSON from Claude.** Only for simple shapes: a check mark, a pulse, a progress ring. Complex character work should come from 1 or 2.

## Load

For `.json` Lottie (default):
```html
<script src="https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_svg.min.js"></script>
```
For `.lottie` files (zipped, smaller), use dotLottie's canvas player:
```html
<script type="module">
  import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.80.0/+esm";
</script>
```
Both are MIT licensed.

## Keep the page self-contained

Inline the animation JSON in the page. `fetch()` fails when the page is opened from a file:

```html
<script type="application/json" id="lottie-check">{ "v": "5.7.4", "fr": 30, ... }</script>
```

## CONFIG

```js
lottie: [
  // id: element id; data: <script> id; scene: index; at: seconds into that scene; speed: 1 = native
  { id: "checkAnim", data: "lottie-check", scene: 3, at: 0.6, speed: 1 }
]
```

## Sync to t

```js
const lotties = C.lottie.map(L => {
  const anim = lottie.loadAnimation({
    container: $(L.id), renderer: "svg", loop: false, autoplay: false,
    animationData: JSON.parse($(L.data).textContent)
  });
  return { L, anim };
});

// inside render(t):
lotties.forEach(({ L, anim }) => {
  const u = t - T.scenes[L.scene][0] - L.at;
  const frame = Math.max(0, Math.min(anim.totalFrames - 1, u * anim.frameRate * L.speed));
  anim.goToAndStop(frame, true);   // true = frame number, not milliseconds
});
```

For dotLottie, use `dotLottie.setFrame(frame)` with the same frame maths, and call `setUseFrameInterpolation(true)` for smooth scrubbing.

Checked: `goToAndStop(frame, true)` gives the same frame for the same `t`, seeking forwards or backwards.

## Rules

- Never `play()` a Lottie animation. Seek it in `render(t)` like everything else.
- Timing lives in CONFIG (`at`, `speed`), so "start the tick a beat later" is a single edit.
- Lottie colours don't follow the page's CSS tokens. Pick assets that read in both light and dark mode, or supply a dark-mode variant and swap `data` on `prefers-color-scheme`.
- Keep it decorative or supporting. If the Lottie carries meaning, the final frame must still carry it (house accessibility rule).
- The taste module applies to Lottie motion too: if you write or adjust the JSON, its easing and timing tables still hold.
