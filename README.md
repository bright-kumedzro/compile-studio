# Compile Studio

Code-driven animated explainers. Turn checked data and a clear story into a short, scrubbable animation where every number, word and timing lives in one config object.

You're not generating video. You're compiling it.

## What's in here

```
compile-studio/                 The Claude Skill (this folder is what gets installed)
  SKILL.md                      Workflow, rules and module router
  assets/timeline-core.js       Pure time helpers (prog, ease, enter, sceneOpacity)
  assets/timeline.js            Browser player: play, pause, scrub
  assets/template.html          Default five-scene explainer, config-driven
  scripts/to-hyperframes.mjs    Converts a built page into a HyperFrames composition
  references/workflow.md        Reference → data → story → build → direct → ship
  references/motion-rules.md    House timing, easing, accessibility and honesty rules
  references/styles.md          Art direction: data, demo, one-take, hype
  modules/
    taste/                      LottieFiles motion-design rules (vendored, MIT)
    gsap/                       GSAP engine adapter + GreenSock's official skills (vendored, MIT)
    motion/                     Motion (motion.dev) engine adapter
    lottie/                     Lottie layer, scrubbed in sync
    hyperframes/                MP4 by rendering the page itself (default video route)
    remotion/                   MP4 via Remotion (links to the official skills)
    sfx/                        Measured sound pass + CC0 library (vendored from Barty-Bart, MIT)
    footage/                    Pointer: editing your own recordings (linked skills)
    promo/                      Pointer: full trailer pipelines (linked skills)
examples/
  compile-dont-generate.html    A built example; open it in any browser
scripts/
  build.sh                      Rebuild the example and package compile-studio.skill
  sync-upstream.sh              Refresh vendored upstream skills at pinned commits
```

## Modules and presets

The core always applies. Add modules by name ("use taste and GSAP") or by preset:

| Preset | Modules | For |
|---|---|---|
| `core` | none | Fastest, smallest page |
| `studio` (default) | taste | Most explainers |
| `web` | taste + gsap | Rich choreography, text and SVG effects |
| `video` | taste + hyperframes + sfx | A video file is the deliverable |
| `full` | taste + gsap + lottie + hyperframes + sfx | Everything |

Styles set the art direction separately: `data` (default), `demo`, `one-take`, `hype`.

Examples: "Make a data explainer for this chart, preset web." "Motion and taste only, I want it springy." "Full studio, I need an MP4 for LinkedIn too." "A 15-second hype sting for our launch, video preset."

## Sources

Built from the stack in Francesco's "Build Your Own AI Production Studio With Claude" (X, 10 Oct 2026). Every repo it lists, and what Compile Studio does with it:

| # | Article repo | In Compile Studio | How |
|---|---|---|---|
| 1 | [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | `remotion` | Port guide. Remotion's licence needs a company licence above 3 employees. |
| 2 | [remotion-dev/skills](https://github.com/remotion-dev/skills) | `remotion` | Linked: no licence file, so not redistributable |
| 3 | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | `hyperframes` | Own contract + converter, pinned CLI `0.8.116`, tested end to end. Its skills aren't installed (global unpinned installs). |
| 4 | [nateherkai/hyperframes-student-kit](https://github.com/nateherkai/herk-edit-kit) (now herk-edit-kit) | `footage` | Linked with warnings: cloud uploads, non-redistributable assets inside |
| 5 | [motiondivision/motion](https://github.com/motiondivision/motion) 13.5.1 | `motion` | Adapter written here, tested; no official skill exists |
| 6 | [airbnb/lottie-web](https://github.com/airbnb/lottie-web) 5.13.0 | `lottie` | Adapter written here, tested; no official skill exists |
| 7 | [greensock/GSAP](https://github.com/greensock/GSAP) 3.15.0 | `gsap` | Adapter + GreenSock's official [gsap-skills](https://github.com/greensock/gsap-skills) @ `aed9cfd`, vendored (MIT) |
| 8 | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) @ `f9a8a04` | `taste` | Vendored (MIT) |
| 9 | [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) @ `3d83d98` | `sfx`, `styles`, `footage` | sound-effects vendored (MIT, CC0 sounds, fixes in `MODIFIED.md`); explainer styles adapted; motion-broll linked |
| 10 | [howseen-ai/claude-motion-design](https://github.com/howseen-ai/claude-motion-design) | `promo` | Linked as reference; its playbook includes scraping and watermark-removal steps not to follow |
| — | [Mort1d/motion-graphics-skills](https://github.com/Mort1d/motion-graphics-skills) | `promo` | Linked; a full promo pipeline rather than the index the article describes |

Every vendored file was read in full and reviewed for prompt injection, network calls and install steps before inclusion.

## Install

### Claude Code: available in every repo (personal)

Link the skill folder into your personal skills directory. A link (not a copy) means `git pull` here updates the installed skill.

Windows (PowerShell):
```powershell
cmd /c mklink /J "$env:USERPROFILE\.claude\skills\compile-studio" "<path-to-this-repo>\compile-studio"
```
macOS / Linux:
```bash
ln -s "<path-to-this-repo>/compile-studio" ~/.claude/skills/compile-studio
```

Then, in any repo, just ask: "make an animated explainer of our signup funnel". Claude writes the HTML into that repo.

### Claude Code: inside one project (shared with that repo's collaborators)

Copy just the skill folder into the project's `.claude/skills/` and commit it. Anyone who clones the project gets the skill. Run from the project root:
```bash
npx degit bright-kumedzro/compile-studio/compile-studio .claude/skills/compile-studio --force
```
Re-run the same command to update the project's copy to the latest version.

### claude.ai (web, desktop, mobile)

Run `scripts/build.sh` to produce `compile-studio.skill`, then upload it under Settings → Capabilities → Skills. The video and sound modules need Node, Python and ffmpeg, so in claude.ai chats they fall back to delivering the page.

### Requirements for video and sound

Node.js 22+, ffmpeg/ffprobe (on PATH, or `npm i ffmpeg-static ffprobe-static` and point `HYPERFRAMES_FFMPEG_PATH`/`FFMPEG` at them), and Python 3.10+ for `sfx`. HyperFrames downloads its own headless Chrome on first render.

## Use it without Claude

Open `examples/compile-dont-generate.html` and edit the `CONFIG` object near the bottom. Nothing to install; no build step.

## Maintaining

- **Engine or template change:** edit `compile-studio/assets/`, then run `scripts/build.sh` to refresh the example and the `.skill` package. Re-test a video render (`modules/hyperframes/MODULE.md`, steps 2–4).
- **Upstream update:** bump the SHA in `scripts/sync-upstream.sh`, run it, review the diff, commit.

## Principles

- **Data first.** Never animate a number you haven't checked.
- **Story before motion.** One sentence per scene.
- **One source of truth.** Revisions change `CONFIG`, not render logic.
- **Deterministic.** Every frame is a pure function of time, in every engine.
- **Accessible by default.** Reduced motion, light and dark mode, phone width.
