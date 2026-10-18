# Module: Your own footage (linked, not bundled)

For when the user has recorded themselves (a talking head, a screen recording, a long take) and wants it edited: dead pauses and stumbles cut, captions added, a reel assembled, motion-graphics cutaways placed on cue under the words they say.

Compile Studio doesn't edit footage itself. This module points to two specialist skills from the source article and says what to watch for. Neither is bundled, for the reasons below.

## The skills

| Need | Skill | Licence |
|---|---|---|
| Cut silences and mistakes from a transcript, captions, reels and Shorts structure | **Herk Edit Kit** by Nate Herk: https://github.com/nateherkai/herk-edit-kit (formerly `hyperframes-student-kit`) | MIT for kit material, plus a custom pipeline-use permission. Some brand assets inside are **not** licensed for reuse. |
| Motion-graphics cutaways and transparent panels timed to the speaker's words, from an SRT/VTT | **motion-broll** in Barty-Bart's repo: https://github.com/Barty-Bart/motion-graphics (`skills/motion-broll`) | MIT, fonts OFL |

Install them from source following each repo's README, at a pinned commit, into the project that holds the footage.

## Before installing: tell the user

**Herk Edit Kit**
- Its default transcription uploads the footage's audio to ElevenLabs. Its showreel tools upload images to a third-party host for paid Kie.ai generation. Both need API keys and cost money.
- Local transcription is available (`npx hyperframes transcribe`). Prefer it for anything confidential.
- Two of its scripts look for a `.env` file in up to 8 parent folders. Keep API keys in the project's own `.env`, and don't run it from inside a folder tree that holds other credentials.
- It's about 422 MB. Some assets inside can't be redistributed: the AIS brand files, Anthropic webfonts in an example project, and a music file of unknown origin. Don't copy them into other work.
- Its `npm ci` runs install scripts for several packages, and `hyperframes add` pulls unpinned blocks from GitHub.

**motion-broll**
- Its setup script installs `numpy` with a `--break-system-packages` fallback. Use a virtual environment instead.
- Word timings are estimated per character (about ±0.2 s) unless `faster-whisper` is installed.
- The bundled Lucide icon paths need the ISC notice if redistributed.

## How it fits with Compile Studio

- Use Compile Studio for the data and motion moments (a chart reveal, a hero number), rendered via the `hyperframes` module to a transparent or full-frame clip. Then place those clips as cutaways in the footage edit.
- Keep the numbers checked in CONFIG. The cutaway inherits them, and a revision is still one CONFIG edit plus a re-render.
- For sound on the final edit, run the `sfx` module's pass on the exported cut.
