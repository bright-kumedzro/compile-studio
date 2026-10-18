# Styles

A style is the art direction: structure, pacing, camera and look. It's separate from modules (which tools) and presets (which modules). Record it in CONFIG as `style`.

| Style | Length | For |
|---|---|---|
| `data` *(default)* | 10–20 s | One checked number, told as a story: the default template |
| `demo` | 45–90 s | A calm, premium product walkthrough |
| `one-take` | 10–30 s, loops | One hero object travels through a workflow on one canvas; the camera never cuts |
| `hype` | 12–20 s | A beat-locked launch sting with kinetic type |

`demo`, `one-take` and `hype` are adapted from Barty-Bart's explainer skills (github.com/Barty-Bart/motion-graphics, MIT). They're rewritten here to fit CONFIG and `render(t)`, and their sound now goes through the `sfx` module, using real recorded files instead of synthesised audio.

## Rules for every style

- **Never invent facts.** Show numbers only if the user or their source states them. Example content inside a UI (a file name, a prompt) is fine; claims about the product (user counts, ratings, "free") are not. A call to action uses only a URL or offer the user gave.
- **Logos** only when the user supplies the file. Otherwise set the name in the brand font. Third-party logos only if supplied; otherwise neutral rounded tiles with the name.
- **One brief message.** Ask for product, the one thing to remember, brand, format and length together, then work. For anything left blank, decide and say what you chose.
- **Positions, camera and physics are pure functions of `t`.** Anything that needs history (smoothed camera follow, springs) is computed once at load into a lookup table, then read by `t`.

## `data` (default)

The template's five scenes: claim → question and chart landing on the hero number → how it was built → where it lives → the line to remember. The house rules and `references/motion-rules.md` apply as written. Use this whenever the piece is about a number.

## `demo`: calm product walkthrough

**Feel:** restraint. A bright, airy canvas, one short line at a time, and the product's own interface rebuilt as clean vector UI and filmed up close while it's used. The camera does the storytelling.

**Structure** (60 s default):
1. **Open (0–5 s):** a small "Introducing" fades up, then dissolves into the name on a soft brand gradient.
2. **Problem or ask (≈5 s):** a line the viewer recognises, or straight to the product's empty input.
3. **Feature chapters (3–5, ≈8–15 s each).** Each has three parts:
   - a small title line that the camera pushes into until it spans about 75% of the width, with one phrase highlighted by a sweeping brand-tint box;
   - the UI moment, close up, with the camera riding the action (typing, steps ticking, rows filling);
   - a pull-back to show the whole screen for a beat.
4. **Proof (optional, real numbers only):** a count-up, highlighted.
5. **Integrations (optional):** supplied logos float in at different depths with parallax.
6. **Closer:** a sentence with a rotating highlighted word, then the tagline.
7. **End card (3 s).**

Budget: 45 s = 2–3 features; 60 s = 3–4; 90 s = 4–5.

**Rules:**
- One line of text or one UI element on screen, rarely both.
- No hard cuts: scenes change by camera move or a 0.3–0.4 s blur-dissolve.
- Camera eases take 0.6–1.2 s. Nothing bounces.
- Title lines hold about 2 s after landing. Typing runs at about 25 characters per second, with a 0.5 s pause after each result.
- The cursor moves on gentle curves, arrives a beat before it clicks, and dips slightly on press.

**Look:** canvas `#F7F7F8`, text `#111114`, secondary `#8A8A94`, white surfaces with `#E7E7EC` borders, one accent (default `#2E6BFF`; brand colour replaces it), highlight = accent at 15–20%. Inter or Geist, small and regular for title lines (the camera makes them big).

**Banned:** busy backgrounds behind UI, a second accent colour, bouncy easing, emoji, heavy shadows, invented metrics.

**Sound (`sfx` cues):** a gentle 100–110 BPM bed; `typing` under typing, `click` on clicks, `hover_or_small_ui` per completed step, `movement` on big camera moves, `success` on the end card.

## `one-take`: continuous-shot workflow loop

**Feel:** one hero object (a ball, a caret, a file tile, a message bubble) travels through the product's workflow, laid out as stations on one large canvas. Each station visibly reacts as the hero passes. The camera follows without cutting, pulls far out at the climax to reveal the whole course, then dives back to the start.

**Structure** (12 s default, seamless loop):
1. **Stations:** 3–6 workflow steps, each a compact real UI element the hero physically interacts with:

   | Station | The hero… | The station… |
   |---|---|---|
   | toggle | is the knob | switches on |
   | slider | rolls as the thumb | counts up |
   | notification stack | bounces down the cards | pops each card in |
   | keyboard | hops key to key | types the word |
   | chart | is the leading dot | draws the line |
   | send button | gets launched by it | shows the toast |

2. **Layout:** stations sit on a canvas about 3× the frame, in visiting order, in a zig-zag that makes gravity sense. Add a faint dot grid that moves with the camera, so camera motion reads.
3. **Path:** built from contact points on beats.
   - Hops are parabolas with one gravity constant for the whole piece, solved to land on the next beat.
   - On contact, squash (1.25 × 0.8 for about 60 ms); in flight, stretch along the velocity.
4. **Launch and reveal:** the last station fires the hero back toward the start in one long, time-warped arc, slowest at the apex. The camera eases out to frame the whole course with a slight 3D tilt, holds about 1 s, then dives to the first station as the hero lands. Stations reset in reverse during the hold.
5. **Seam:** `render(duration)` must equal `render(0)`.

**Camera:**
- Target = a blend of the hero position (with about 0.15 s of velocity lead) and the current station's anchor, smoothed by a critically damped spring. The smoothing needs history, so bake it into a lookup table at load.
- Weight toward the anchor: 0.7 during interactions, 0.15 in flight.
- The hero stays 50–70 px on screen at 1080p and inside the middle half of the frame.

**Look:** dark by default: canvas `#0C0C0E`, grid `#1E1E22`, surfaces `#1C1C1F`/`#2C2C2E`, text `#F2F2F7`, accent `#0A84FF`, hero white and always the brightest thing on screen. A light variant (hero = accent) is fine for light brands.

**Banned:** cuts, fades to black, explanatory overlays (the stations' own labels are the only text), floaty physics.

**Sound (`sfx` cues):** each contact is a cue (`click` or `pop`, rising as the story advances), `typing` on keys, `movement` on the launch and the dive. Every sound lands on its visual contact.

## `hype`: beat-locked launch sting

**Feel:** a showreel. Something lands on every half-beat, but it never feels like random cuts, because a shape carries the eye across every transition: a spark becomes a line, the line floods into the next background, a full stop detaches and grows into the next scene.

**Structure** (15 s at 128 BPM default; 6–8 scenes of 1.5–3 s). Pick the scenes that fit:
1. **Spark open:** an accent mark on near-black stretches into a line, then floods the frame.
2. **Brand slam:** the name in a heavy grotesk, letters masked in on 1/16 notes, with a mono kicker above and an italic serif line below.
3. **Kinetic triplet:** the value in three words, two beats each, each word on its own background and treatment.
4. **Signature visual:** one "how did they make that" moment (rippling cube field, particles condensing into a ring, or a liquid morph), matched to the product's idea.
5. **Product micro-moment:** one real interaction on a tilted floating card.
6. **Proof:** real numbers only; otherwise skip.
7. **Morph bridge:** the shape collapses to a dot, the dot becomes the logo's dot.
8. **End card (2 s hold).**

**Rules:**
- Transitions are objects, not cuts. A hard cut only on a downbeat, at most twice.
- Big changes on beats, typography on 1/8 or 1/16 notes. Slight overshoot on impacts. (This is the one style where overshoot is house-approved; still never on a data value.)
- **HUD on every scene,** small and about 50% opacity:
  - corner brackets;
  - `SCENE 02 / 07`;
  - a mono category label;
  - a running timecode.
- **Texture:**
  - a soft vignette;
  - seeded film grain (pre-generate a few tiles at load and cycle them by `t`);
  - motion blur in the video render.

**Look:** ink `#0B0B10`, accent `#FF4F1A`, cream `#EDEBE4`, electric blue `#2F47FF`, white. The brand's first colour replaces the accent and its second replaces the blue. Type: a heavy grotesk for slams, an italic serif for the human line, a mono for the HUD.

**Banned:** template looks, glows everywhere, emoji, more than 3 colours in a scene (black and white excepted), any scene without motion.

**Sound (`sfx` cues):** 128 BPM bed; `build_up` into the slam and the end card, `reveal` on each flood, `appear` on typed words, `scene_cut` on every carried transition.
