# Compile Studio

Code-driven animated explainers. Turn checked data and a clear story into a short, scrubbable animation where every number, word and timing lives in one config object.

You're not generating video. You're compiling it.

## What's in here

```
compile-studio/            The Claude Skill (upload this folder)
  SKILL.md                 Workflow and rules Claude follows
  assets/timeline.js       Deterministic, scrubbable timeline engine
  assets/template.html     Default five-scene explainer, config-driven
  references/workflow.md   Reference → data → story → build → direct → ship
  references/motion-rules.md  Timing, easing, accessibility and honesty rules
examples/
  compile-dont-generate.html  A built example; open it in any browser
```

## Use it with Claude

1. Zip the `compile-studio/` folder (or use the `.skill` file from a release).
2. Add it as a skill in Claude.
3. Ask for an animated explainer, chart reveal or data story. Then direct revisions in plain language, like "hold the number longer" or "draw the bars slower".

## Use it without Claude

Open `examples/compile-dont-generate.html` and edit the `CONFIG` object near the bottom. Nothing to install; no build step.

To start a new piece from the template, copy `assets/template.html` and replace `/*@@TIMELINE@@*/` with the contents of `assets/timeline.js`.

## Principles

- **Data first.** Never animate a number you haven't checked.
- **Story before motion.** One sentence per scene.
- **One source of truth.** Revisions change `CONFIG`, not render logic.
- **Accessible by default.** Reduced motion, light and dark mode, phone width.
