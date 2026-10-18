# Motion rules

Defaults for explainer-style motion. Override when a reference says otherwise.

## Timing
- Entrances: 0.4–0.7s. Small UI elements: 0.15–0.3s.
- Stagger between related items: 0.08–0.2s.
- First motion lands within 0.3s of a scene starting.
- Scene cross-fade: 0.3–0.5s.
- Reading time: hold text for at least (word count ÷ 3) + 0.5 seconds.
- Hero numbers: hold at least 1.5s after the count-up finishes.

## Easing
- Entrances use ease-out (`outCubic`, `outQuart`): fast start, gentle landing.
- Exits use ease-in (`inCubic`): leave quickly.
- Moves between two on-screen positions use `inOutCubic`.
- Avoid linear except for counters or progress that should feel mechanical.

## Order and focus
- Context first, then the data, then the payoff.
- One thing moves at a time when it carries meaning; group the rest.
- Use colour change, not extra motion, to mark the hero element.
- Small travel distances (10–20px) read as polish; large ones read as distraction.

## Accessibility
- Respect `prefers-reduced-motion`: show a meaningful still frame, keep controls.
- Give the stage an `aria-label` that states the takeaway.
- Maintain text contrast in both light and dark themes.
- Never encode meaning in motion alone; the final frame must carry the message.

## Honesty
- Never animate an unconfirmed number.
- Label sample data on screen.
- Bars start from zero.
