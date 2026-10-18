---
name: compile-studio
description: Build short, code-driven animated explainers (data stories, product walkthroughs, launch teasers, chart reveals) as a single self-contained HTML page with a scrubbable timeline, where every number, word and timing lives in one CONFIG object. Use this skill whenever the user asks for an animated explainer, motion graphic, animated chart, "make this number move", a teaser or intro animation, a data story, or wants to turn a report, metric or slide into motion — even if they don't say "Compile Studio". Also use it when the user asks to revise one of these animations ("hold the number longer", "draw the bars slower", "swap the colour").
---

# Compile Studio

Animation as code, not generation. You compile a short explainer from checked data, a clear story and a reference, into one HTML page where every value is editable.

## The rule that matters most

All content and timing lives in `CONFIG`. `render(t)` only reads from it. A revision request ("hold the 38% longer", "slower bars") should become a change to CONFIG, not to render logic. If a request can't be expressed in CONFIG, extend CONFIG first, then read the new key in render.

## Workflow

Follow these in order. Read `references/workflow.md` for detail on each step.

1. **Reference.** If the user shares a reference clip or screenshot, break down its pacing, entrance order, payoff moment and hold times into a short spec before building. If none, ask once what feeling they want, or proceed with the defaults in `references/motion-rules.md`.
2. **Data.** Confirm the one number the piece is about, its source and its date range. Never animate a number you haven't confirmed. Label sample or mocked data on screen.
3. **Story.** Write the scenes as one sentence each before touching code. Five scenes or fewer; 10–20 seconds total.
4. **Build.** Assemble the page (see "Building the page").
5. **Direct.** Apply revisions as CONFIG edits. Report which values changed.
6. **Ship.** Deliver as a published page or file. For MP4, see "Limits".

## Building the page

1. Read `assets/timeline.js` (the engine) and `assets/template.html` (the default explainer).
2. Copy the template, then replace the `/*@@TIMELINE@@*/` marker with the full contents of `timeline.js`, so the page is self-contained.
3. Fill in `CONFIG` with the user's copy, data and timing. Keep the default five-scene structure (title, data, motion, edit, close) unless the story needs fewer; remove a scene by deleting its `<section>`, its entry in `timing.scenes`, and its block in `render`.
4. Keep `render(t)` deterministic: no `Math.random`, no CSS transitions on animated properties, no state carried between frames. Scrubbing must show the same frame every time.
5. Before delivering, check against `references/motion-rules.md` (timing, easing, holds, accessibility).

The engine (`CompileTimeline`) provides `create`, `prog`, `ease`, `enter` and `sceneOpacity`. It handles play, pause, scrub, the time readout and `prefers-reduced-motion` (jumps to a meaningful still frame instead of playing).

## Quality bar

- One hero moment per scene; everything else supports it.
- Key numbers hold on screen for at least 1.5 seconds after they land.
- Text stays on screen long enough to read (see reading-time rule in motion-rules).
- Works in light and dark mode, and at phone width (stage switches to 4:5).
- Sample data is labelled on screen.

## Limits

- Output is an interactive web page, not a rendered video file. For MP4, the same CONFIG can drive a Remotion project, which needs a Node environment with a headless browser; tell the user if that isn't available.
- Keep it short. Past ~30 seconds, a deck or a doc usually serves the story better.
