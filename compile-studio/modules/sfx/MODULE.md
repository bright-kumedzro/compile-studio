# Module: Sound effects and music (post-pass on the MP4)

Adds a measured sound pass to a rendered video: a cue list, a checked beat grid, cuts landed on the beat, one real sound effect per cue from a bundled CC0 library, music under it, and a mix at about -16 LUFS with true peak below -4 dBFS, measured on the exported MP4. It runs after `hyperframes` or `remotion` has produced a silent MP4.

Source: the `sound-effects` skill from Barty-Bart's motion-graphics repo (MIT). The bundled sounds are CC0. It's vendored in `upstream/` at a pinned commit, with small portability fixes listed in `upstream/MODIFIED.md`. Its method credits Vox (@Voxyz_ai); keep that credit.

## How to use it

1. **Read `upstream/UPSTREAM.md` in full.** It's the procedure. Follow its steps 0–7, with the adjustments below.
2. **Build `cues.json` from CONFIG, not from scene detection.** Every timed event is already in CONFIG, so read it rather than guess. For the default template:

   With `s2 = timing.scenes[1][0]` and `landed = 0.6 + (bars - 1) * stagger + drawOn`:

   | Moment | Time | Cue |
   |---|---|---|
   | each scene start | `timing.scenes[i][0]`, i > 0 | `scene_cut` |
   | a few bar landings | `s2 + 0.6 + i*stagger + drawOn` | `appear` (2–3, not all) |
   | the count-up | `t = s2 + landed`, `dur = countUp` | `build_up` (ends as the number lands) |
   | the hero number landing | `s2 + landed + countUp` | `reveal` |
   | closer flow items | `scenes[4][0] + 0.6 + i*0.35` | `hover_or_small_ui` |

   For the example page, that puts the reveal at 6.45 s, when the count reaches 38%, not at 5.25 s, when the bars finish and the count starts. Check the `checks/cue-XX.png` frames: the "after" frame should show the moment the sound describes.

   For `demo`, `one-take` and `hype`, use the cue suggestions in `references/styles.md`. Put cue times in CONFIG (`sound.cues`), so "move the whoosh later" stays a single edit.
3. **Set up** in a deletable folder inside the user's project:
   ```
   python -m venv .sound-effects
   # macOS/Linux:  .sound-effects/bin/pip install librosa soundfile numpy scipy matplotlib
   # Windows:      .sound-effects\Scripts\pip install librosa soundfile numpy scipy matplotlib
   ```
   If ffmpeg and ffprobe aren't on PATH, set `FFMPEG` and `FFPROBE` to their full paths.
4. **Run the pass:**
   ```
   .sound-effects/bin/python <skill>/modules/sfx/upstream/scripts/sound_pass.py \
     --video out/explainer.mp4 --cues cues.json --music track.mp3 \
     --manifest <skill>/modules/sfx/upstream/sfx/manifest.json --out out/sound \
     --use-case "LinkedIn and YouTube" --music-source "..." --music-license "..."
   ```
5. **Report exactly as upstream says:**
   - the licence check;
   - the beat-grid result;
   - cut-to-beat errors;
   - LUFS and true peak, in stereo and mono;
   - the 5 timestamps to check with headphones.

   Never claim it sounds good.

## Rules here

- **Music needs a real file:** the user's track, or one they pick from `upstream/MUSIC.md` (Mixkit, downloaded into their project at runtime, never committed). Ask where it's from. Without a confirmed licence, the run marks the music LICENCE NOT CONFIRMED; say so plainly.
- **Mixkit and other runtime downloads go into the user's project** (`<out>/sound-effects-cache/`), never into this skill folder or the compile-studio repo. Mixkit forbids redistribution inside a tool.
- **Only CC0 sounds may be added** to `upstream/sfx/`. Any new sound goes through `scripts/sync-upstream.sh` (upstream) or a separate local folder with its own manifest and licence notes.
- **Re-run after picture changes.** If CONFIG timing changes, re-render the silent MP4 first, then rebuild `cues.json` and re-run.
- **For a page rather than a video,** don't add sound unless asked. If asked, use an `<audio>` element started by the play button, with its `currentTime` set from `t` on scrub. Measure loudness on an exported MP4, not in the browser.
