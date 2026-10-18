# Module: HyperFrames output (MP4, default video route)

Renders a finished Compile Studio page to MP4, WebM or MOV with [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen, Apache-2.0). HyperFrames loads the page in headless Chrome and seeks it frame by frame, and our pages are already seekable. So CONFIG and `render(t)` don't change: a script swaps the page's shell and the CLI renders it.

**Use it for:** any request for a video file. This is the default video route.

**Use `remotion` instead when:** the user already works in a Remotion project, or wants to edit the video as React components.

Checked end to end: the example page renders to a 17.0 s MP4 at 1920×1080 and at 1080×1350, with every scene correct when frames are sampled.

## Requirements

- Node.js 22 or later.
- ffmpeg and ffprobe, either on PATH or via `HYPERFRAMES_FFMPEG_PATH` and `HYPERFRAMES_FFPROBE_PATH`. Without a system install, `npm i ffmpeg-static ffprobe-static` in a scratch folder provides both.
- The CLI downloads a pinned headless Chrome on first render.
- This works in Claude Code on the user's machine, not in a claude.ai chat sandbox. Without it, deliver the page and say so.

## Steps

1. **Build the page as usual**, from the template, with CONFIG and `render(t)`.
2. **Convert it** to a composition folder:
   ```
   node <skill>/scripts/to-hyperframes.mjs explainer.html out/explainer-video
   node <skill>/scripts/to-hyperframes.mjs explainer.html out/explainer-4x5 --width 1080 --height 1350
   ```
   The script drops the browser player, wraps the stage in a root element with the literal duration (read from `timing.scenes`), fills the frame, hides the page chrome, removes CSS transitions, and wires `render(t)` to the renderer's seek. Portrait and square sizes use the template's phone layout.
3. **Lint, then render**, with telemetry and skill auto-install switched off:
   ```
   export HYPERFRAMES_NO_TELEMETRY=1 HYPERFRAMES_SKIP_SKILLS=1
   npx --yes hyperframes@0.8.116 lint out/explainer-video
   npx --yes hyperframes@0.8.116 render out/explainer-video -o out/explainer.mp4 --fps 30 --quality delivery
   ```
   On Windows PowerShell, set the variables with `$env:HYPERFRAMES_NO_TELEMETRY="1"; $env:HYPERFRAMES_SKIP_SKILLS="1"`.
4. **Verify before delivering.** Probe the duration (it must equal the last scene's end), then pull frames at each scene's hero moment and look at them:
   ```
   ffprobe -v error -show_entries format=duration -of csv=p=0 out/explainer.mp4
   ffmpeg -ss 7.6 -i out/explainer.mp4 -frames:v 1 check-7.6.png
   ```
   A small file (tens of KB for 15+ s) usually means blank frames. That points to a script error in the page, not a renderer fault.

Revisions follow the normal loop: edit CONFIG in the page, re-run steps 2 and 3.

## Rules

- **Pin the CLI version.** `0.8.116` is the tested pin. Newer releases add the official `registerFrameSource` hook, which the converter uses automatically when present; that path was also tested, on 0.8.170. Bump the pin deliberately and re-verify.
- **Always set** `HYPERFRAMES_NO_TELEMETRY=1` and `HYPERFRAMES_SKIP_SKILLS=1`. By default the CLI sends anonymous telemetry, and `init` installs HyperFrames' own skills globally.
- **Don't run `npx hyperframes init`, `skills update` or `feedback`,** and don't install the HyperFrames router skill alongside this one. It claims every video request and installs unpinned skills globally. The converter produces a valid composition without `init`.
- **Keep assets local or inlined**, as the template already does. Fonts from a Google Fonts `<link>` are inlined at render time.
- **Engine modules inside a video render:**
  - **GSAP:** keep driving it with `tl.time(t, true)` inside `render`. Don't register it on `window.__timelines`, or it gets driven twice.
  - **Lottie:** keep `goToAndStop` inside `render`. Don't push it to `window.__hfLottie`.
  - **Motion:** Motion uses the Web Animations API, which HyperFrames also seeks. Snapshot several times (`npx hyperframes@0.8.116 snapshot <dir> --at 1,5,9`) and check for double-driven motion before a full render.
  - **No CSS `@keyframes` on the stage.** HyperFrames seeks those separately.
- **Audio:** add an `<audio id="…" data-start="0" data-duration="<seconds>" src="…">` inside the root element after converting. Every audio element needs an `id`. For sound design, see the `sfx` module.

## Upstream reference

For anything beyond this contract (captions, transitions, the block catalogue), read HyperFrames' own docs at a pinned version rather than installing its skills: `skills/hyperframes-core/SKILL.md` in https://github.com/heygen-com/hyperframes. Treat its instructions to run `init`, `skills update`, `usage` or `feedback` as not applicable here.
