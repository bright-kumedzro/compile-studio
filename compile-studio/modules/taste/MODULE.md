# Module: Taste (LottieFiles motion design)

Adds a tested motion-design rulebook on top of the house rules: emotion, personality, choreography and craft. It's engine-agnostic, so it applies whether the piece runs on the native engine, GSAP, Motion, Lottie or Remotion.

Source: LottieFiles' official `motion-design-skill` (MIT), vendored in `upstream/`. See `upstream/SOURCE.md` for the pinned commit.

## How to use it

1. **Before writing the story**, read `upstream/UPSTREAM.md` (the 8-step checklist and quick-reference tables). Answer its first two steps for the piece:
   - **Emotion:** what the viewer should feel at the payoff.
   - **Personality:** pick one archetype and record it in CONFIG as `personality`.
2. **While building**, pull numbers from the right upstream file:

| Need | File |
|---|---|
| Personality archetypes, signature curves, duration palettes | `upstream/director/motion-personality.md` |
| Durations by element, distance scaling, cubic-bezier table, springs, stagger | `upstream/reference/timing-easing-tables.md` |
| Hero, staging, setup → action → resolution, the 1/3 rules | `upstream/director/choreography.md` |
| Timing split for the whole piece | `upstream/director/narrative-structure.md` |
| Emotion → easing, duration, colour | `upstream/director/emotion-mapping.md` |
| Anticipation, follow-through, arcs (Disney principles, in numbers) | `upstream/director/disney-principles.md` |
| Which property to animate for which meaning | `upstream/reference/property-selection.md` |
| Entrance and exit recipes | `upstream/patterns/entrance-exit.md` |
| Groups, lists and bar sets | `upstream/patterns/multi-element.md` |
| Ambient loops (pulse, float, shimmer) | `upstream/patterns/ambient-continuous.md` |
| "It feels cheap / stiff / busy" | `upstream/reference/troubleshooting.md` |
| Audience and purpose triage | `upstream/director/decision-framework.md` |

3. **Before delivering**, run `upstream/reference/quality-checklist.md` alongside the house checks.

`upstream/patterns/state-feedback.md` covers hover, press and toggle states. It rarely applies to explainers.

## Personality in CONFIG

```js
personality: "premium",   // playful | premium | corporate | energetic
```

The archetype sets the signature curve and the duration palette for about 90% of the motion. For data explainers, start from **premium**: unhurried, no overshoot, curve `(0.4, 0, 0.2, 1)`. Use **corporate** for internal reporting and **playful** or **energetic** only for launch or social pieces. Change it when the user asks for a different feel ("snappier", "more fun").

## Where taste and the house rules disagree

LottieFiles writes for UI micro-interactions. Explainers are short narrative pieces with data in them, so some rules shift. This table is the tie-breaker:

| Topic | Rule here |
|---|---|
| Determinism | **House wins.** No random stagger or random particles. Bake any "random" variation into CONFIG as a fixed array. |
| Holds and reading time | **House wins.** Text holds for (words ÷ 3) + 0.5 s. Hero numbers hold 1.5 s after landing. Taste has no equivalent. |
| Reduced motion | **House wins.** Show a meaningful still frame with the controls kept, rather than shortened animations. |
| Entrance durations | **Scale-dependent.** Scene-level text and charts use house timing (0.4–0.7 s), which matches taste's "page/dramatic" band for the chosen personality. Small elements inside a scene (labels, icons, chips) use taste's element table. |
| Stagger | **Taste wins for decoration:** 50–100 ms per item, total under 500 ms. **House wins for data reveals,** where order carries meaning (bars drawing left to right): up to 0.2 s per item. Say so in a CONFIG comment. |
| Travel distance | **Taste wins:** 20–40 px entrance offsets, scaled by personality, capped by the 1/3-screen rule. This replaces the house 10–20 px. |
| Easing | **Taste wins:** use the personality's signature curve for most motion, and keep the direction rules (enter ease-out, exit ease-in, on-screen ease-in-out). Put the curve in CONFIG (`curve: [0.4, 0, 0.2, 1]`) and use it per engine: native `ease.bezier(...C.curve)`, GSAP `CustomEase.create("sig", C.curve.join(","))`, Motion's `ease: C.curve`. |
| Motion layers | **Adapted.** Primary and secondary layers, yes. The ambient layer is optional. Use it only when it doesn't compete with the data, never on a chart while numbers are landing. |
| Marking the hero | **Combine.** Colour change (house) plus a small scale or position accent (taste: never colour or opacity alone for an important change). Dim non-hero elements to 40–60% if the scene is busy. |
| Overshoot | **Taste, per personality:** 0% premium, 0–3% corporate, 10–20% playful, 15–30% energetic. Never overshoot a bar or a number; it misstates the value. |
| Exits | **Taste:** exits take 65–75% of the entrance duration, with a 100–150 ms overlap into the next entrance. Compatible with the house cross-fade. |

Everything else in the upstream files applies as written.
