# Module: Full promo pipelines (linked, not bundled)

For a "make me a trailer" job with transitions, camera moves, music-synced cuts and an original or licensed soundtrack, beyond what the `hype` style plus the `sfx` module covers. Two complete, independent pipelines exist. Compile Studio points to them rather than bundling them: each is its own system, actively maintained, with a far larger executable surface than an explainer needs.

Try `style: "hype"` with `hyperframes` and `sfx` first. Reach for these only when that isn't enough.

## The pipelines

| Pipeline | What it adds | Licence |
|---|---|---|
| **Claude Motion Design** by howseen-ai: https://github.com/howseen-ai/claude-motion-design (article #10) | HTML → Playwright → ffmpeg render with sub-frame motion blur that never blends across cuts; song-drop detection to land the key frame on the drop; SFX placed by measured peak; two-pass loudness; loop-seam and pop/flash checks | MIT |
| **Motion Graphics Skills** by Mort1d: https://github.com/Mort1d/motion-graphics-skills (the article's "start here" link; it's a full skill, not an index) | Brief → brand kit from a URL → direction → original synthesised score on a shared beat grid → render → QA; nine look cards; kinetic captions; timeline export to Remotion or HyperFrames | MIT, fonts OFL |

## Before using them: tell the user

**howseen-ai.** Don't install its `SKILL.md` as-is. It's the author's personal playbook. Beyond hardcoded paths that don't exist on other machines, it instructs the agent to:
- strip watermarks from downloaded images;
- spoof user agents to get past Cloudflare;
- work around YouTube's download checks;
- clone a third party's launch video frame by frame ("remake mode").

Use it as a reference for its render, audio and song-analysis scripts (`render_template.py`, `audio_template.py`, `analyze_song.py`). Read those, and don't follow the scraping or remake guidance. Its 21st.dev client reads an API key from `~/.config/21st.key`.

**Mort1d.** Safe posture: it labels scraped text as data, not instructions, refuses private-network fetches, and asks before installing anything. But it scrapes the brand site in headless Chrome, and it can fetch reference posts through third-party services (FxEmbed, X syndication, Telegram). Pass `--no-third-party` to avoid those. It needs Node 22.4+ and ffmpeg.

## How it fits with Compile Studio

- Data moments stay in Compile Studio (checked numbers in CONFIG), rendered via `hyperframes` and dropped into the promo as clips.
- Mort1d can export its timeline as JSON for HyperFrames. That's the cleanest hand-off if the promo is built there.
