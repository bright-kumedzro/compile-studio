---
name: compile-studio
description: Build short, code-driven animated explainers (data stories, product walkthroughs, launch teasers, chart reveals) as a single self-contained HTML page with a scrubbable timeline, where every number, word and timing lives in one CONFIG object. Optional modules add LottieFiles motion-design taste rules, GSAP or Motion as the animation engine, Lottie animations, MP4 rendering (HyperFrames or Remotion), a measured sound-effects and music pass, and pointers to footage-editing and full promo pipelines. Styles cover data explainers, product demos, one-take loops and hype stings. Use this skill whenever the user asks for an animated explainer, motion graphic, animated chart, "make this number move", a teaser or intro animation, a data story, or wants to turn a report, metric or slide into motion or video — even if they don't say "Compile Studio". Also use it when the user asks to revise one of these animations ("hold the number longer", "draw the bars slower", "swap the colour", "make it an MP4").
---

# Compile Studio

Animation as code, not generation. You compile a short explainer from checked data, a clear story and a reference, into one HTML page where every value is editable.

## The rule that matters most

All content and timing lives in `CONFIG`. `render(t)` only reads from it. A revision request ("hold the 38% longer", "slower bars") should become a change to CONFIG, not to render logic. If a request can't be expressed in CONFIG, extend CONFIG first, then read the new key in render.

Every frame is a pure function of `t`. This holds for every module and engine.

## Modules

The core (this file, `references/`, `assets/`) always applies. Modules are optional; read a module's `MODULE.md` only when it's selected.

| Module | Role | Adds | Read |
|---|---|---|---|
| `taste` | Rules | LottieFiles' motion-design rulebook: personality, choreography, timing tables, quality checklist | `modules/taste/MODULE.md` |
| `gsap` | Engine | GSAP timeline in place of the native engine: labels, SplitText, DrawSVG, MorphSVG, MotionPath | `modules/gsap/MODULE.md` |
| `motion` | Engine | Motion (motion.dev) sequence in place of the native engine: springs, product-matched feel | `modules/motion/MODULE.md` |
| `lottie` | Layer | Lottie animations placed in scenes and scrubbed in sync | `modules/lottie/MODULE.md` |
| `hyperframes` | Output | MP4/WebM/MOV by rendering the page itself (default video route) | `modules/hyperframes/MODULE.md` |
| `remotion` | Output | MP4 via a React port of the page, for Remotion projects | `modules/remotion/MODULE.md` |
| `sfx` | Sound | Measured sound-effects and music pass on the rendered MP4 (bundled CC0 library) | `modules/sfx/MODULE.md` |
| `footage` | Pointer | Editing the user's own recordings: cuts, captions, cutaways (linked skills) | `modules/footage/MODULE.md` |
| `promo` | Pointer | Full trailer pipelines with music-synced cuts (linked skills) | `modules/promo/MODULE.md` |

### Choosing modules

1. **The user names them.** "Use taste and GSAP", "motion and taste only", "just the core": use exactly those.
2. **The user names a preset:**

| Preset | Modules | For |
|---|---|---|
| `core` | none (native engine) | Fastest turnaround, smallest page |
| `studio` *(default)* | taste | Most explainers |
| `web` | taste + gsap | Rich choreography, text and SVG effects on a page |
| `video` | taste + hyperframes + sfx | A video file is the deliverable |
| `full` | taste + gsap + lottie + hyperframes + sfx | Everything: page and MP4 with sound, illustrated moments |

3. **The request implies one:** "MP4", "video file", "for Instagram" → add `hyperframes` (or `remotion` if they work in Remotion). "Sound", "music", "SFX" → `sfx`. "My recording", "cut my video", "captions" → `footage`. "Trailer", "cut to the music" → `promo`. "Spring", "bouncy", "match our React app" → `motion`. "Split the headline", "draw the line", "morph" → `gsap`. A Lottie file or "illustrated character" → `lottie`.
4. **Otherwise** use `studio`.

Constraints:

- **One engine per piece:** native, `gsap` or `motion`. If both engine modules are requested, use GSAP for the page and say why.
- **One video route per piece:** `hyperframes` (default) or `remotion`.
- `lottie`, the video routes and `sfx` combine with any engine. `sfx` needs a rendered MP4, so it implies a video route.
- `footage` and `promo` are pointers to external skills. Read the module's warnings to the user before suggesting an install.
- Record the selection in CONFIG as `modules: ["taste", "gsap"]` and state it in your reply, so the user can change it ("drop GSAP", "add an MP4").

### Styles

Art direction is separate from modules: `data` (default), `demo`, `one-take` and `hype`. Read `references/styles.md` when the user asks for a product demo, a looping one-take, a hype or launch sting, or names a style. Record it in CONFIG as `style`.

## Workflow

Follow these in order. Read `references/workflow.md` for detail on each step.

1. **Reference.** If the user shares a reference clip or screenshot, break down its pacing, entrance order, payoff moment and hold times into a short spec before building. If none, ask once what feeling they want, or proceed with the defaults (the house rules, plus the taste module's personality if it's selected).
2. **Data.** Confirm the one number the piece is about, its source and its date range. Never animate a number you haven't confirmed. Label sample or mocked data on screen.
3. **Story.** Write the scenes as one sentence each before touching code. Five scenes or fewer; 10–20 seconds total. With `taste`, set emotion and personality here.
4. **Build.** Assemble the page (see "Building the page"), applying the selected modules.
5. **Direct.** Apply revisions as CONFIG edits. Report which values changed.
6. **Ship.** Deliver as a published page or file. With a video route, also render and verify the MP4; with `sfx`, run the sound pass on it.

## Building the page

1. Read `assets/timeline-core.js` (pure helpers), `assets/timeline.js` (the browser player) and `assets/template.html` (the default explainer).
2. Copy the template, then replace the `/*@@TIMELINE@@*/` marker with the full contents of `timeline-core.js` followed by `timeline.js`, so the page is self-contained. (Video routes convert the page later and keep only the core.)
3. Fill in `CONFIG` with the user's copy, data and timing. Keep the default five-scene structure (title, data, motion, edit, close) unless the story needs fewer; remove a scene by deleting its `<section>`, its entry in `timing.scenes`, and its block in `render`.
4. If an engine module is selected, replace the body of `render(t)` as that module shows. `CompileTimeline` stays the clock and controls whichever engine renders.
5. Keep `render(t)` deterministic: no `Math.random`, no CSS transitions on animated properties, no state carried between frames. Scrubbing must show the same frame every time.
6. Before delivering, check against `references/motion-rules.md`, plus each selected module's checks.

The engine (`CompileTimeline`) provides `prog`, `ease` (including `ease.bezier(x1, y1, x2, y2)`), `enter` and `sceneOpacity` from the core, and `create` from the player. It handles play, pause, scrub, the time readout and `prefers-reduced-motion` (jumps to a meaningful still frame instead of playing).

## Quality bar

- One hero moment per scene; everything else supports it.
- Key numbers hold on screen for at least 1.5 seconds after they land.
- Text stays on screen long enough to read (see reading-time rule in motion-rules).
- Works in light and dark mode, and at phone width (stage switches to 4:5).
- Sample data is labelled on screen.

## Limits

- Without a video route, output is an interactive web page, not a video file.
- `hyperframes`, `remotion` and `sfx` need Node.js or Python, ffmpeg and a headless browser. They work in Claude Code on the user's machine, not in a claude.ai chat sandbox. `remotion` also has company licence terms; see its module.
- Keep it short. Past ~30 seconds, a deck or a doc usually serves the story better.
