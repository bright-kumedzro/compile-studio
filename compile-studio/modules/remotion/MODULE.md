# Module: Remotion output (MP4)

Use this module when the deliverable must be a video file and the user works in Remotion or wants the video as React components. Otherwise prefer `hyperframes`, which renders the page itself with no port and no company licence. It turns the same CONFIG and the same timing maths into a [Remotion](https://www.remotion.dev) composition that renders frame by frame.

**Use it for:** social clips, video with audio or captions, batches of variants from one CONFIG.

**Skip it for:** anything a published page or a screen recording covers. The page is faster to iterate on and needs no toolchain.

## Before you start: two checks

1. **Environment.** Remotion needs Node.js and downloads a headless Chrome to render. That works in Claude Code on the user's machine. It doesn't work in a claude.ai chat sandbox. If it isn't available, deliver the page and say so.
2. **Licence.** Remotion isn't MIT. It's free for individuals, non-profits, for-profit organisations with up to 3 employees, and for evaluation. Larger for-profit organisations need a Remotion Company License for real use. Tell the user once, before setting up, if they're working for a company. Terms: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md

## Upstream skill (installed, not vendored)

Remotion's official skills (`remotion-dev/skills`) have no open-source licence file, so they aren't bundled here. If they're installed, read `remotion-best-practices` before building. If not, suggest installing them:

```
npx skills add remotion-dev/skills
```

## Scaffold

```
npx create-video@latest          # choose the Blank template
cd <project> && npm i
```

## Port the page to a composition

The engine's core helpers are pure functions of time, so they port as-is. Copy `assets/timeline-core.js` into the project, or copy `prog`, `ease`, `clamp` and `sceneOpacity` from it into `src/compile.ts`. Then set `t = frame / fps`.

```tsx
// src/Explainer.tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { prog, ease, sceneOpacity } from "./compile";
import type { Config } from "./config";

export const Explainer: React.FC<Config> = (C) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;                         // same t the page uses
  const T = C.timing;
  const s2 = T.scenes[1][0];
  const landed = 0.6 + (C.values.length - 1) * T.stagger + T.drawOn;
  const hero = C.values[C.highlight];

  return (
    <AbsoluteFill style={{ background: "#F7F9FB", fontFamily: "IBM Plex Sans" }}>
      <AbsoluteFill style={{ opacity: sceneOpacity(t, s2, T.scenes[1][1], T.fade, false) }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 480 }}>
          {C.values.map((v, i) => (
            <div key={i} style={{
              flex: 1, height: `${(v / Math.max(...C.values)) * 100}%`, transformOrigin: "bottom",
              transform: `scaleY(${ease.outQuart(prog(t - s2, 0.6 + i * T.stagger, T.drawOn))})`,
              background: i === C.highlight && t - s2 > landed ? "#E8A400" : "#B9C6D3",
            }} />
          ))}
        </div>
        <div style={{ fontSize: 220, fontWeight: 800 }}>
          {Math.round(ease.outCubic(prog(t - s2, landed, T.countUp)) * hero)}{C.unit}
        </div>
      </AbsoluteFill>
      {/* ...other scenes follow the same pattern */}
    </AbsoluteFill>
  );
};
```

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { Explainer } from "./Explainer";
import { CONFIG } from "./config";               // the same CONFIG object as the page

const fps = 30;
const total = CONFIG.timing.scenes.at(-1)![1];

export const RemotionRoot = () => (
  <Composition id="Explainer" component={Explainer} defaultProps={CONFIG}
    fps={fps} durationInFrames={Math.ceil(total * fps)} width={1920} height={1080} />
);
```

Render it:

```
npx remotion studio                                   # preview and scrub
npx remotion render Explainer out/explainer.mp4       # 16:9
```

For a 4:5 social cut, add a second `<Composition>` at 1080×1350 with the same component.

## Rules

- CONFIG stays the single source of truth. Keep it in `src/config.ts` and import it into the page build and the composition alike, so revisions land in both.
- Remotion already requires determinism. Never use `Math.random()`; use Remotion's `random(seed)` if you need noise.
- No CSS transitions or animations. Every animated value comes from `t`.
- Fonts: load them with `@remotion/google-fonts` so frames don't render before the font arrives.
- Audio and captions: follow the upstream skill (`remotion-captions`, `<Audio>`) and keep cue times in CONFIG.
- To use GSAP or Lottie inside Remotion, seek them from `t` exactly as the GSAP and Lottie modules describe (`tl.time(t)`, `goToAndStop(frame)`).
