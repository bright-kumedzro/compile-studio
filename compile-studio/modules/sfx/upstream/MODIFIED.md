# Local modifications

Applied by `scripts/sync-upstream.sh` on top of the pinned upstream commit (see SOURCE.md):

- `scripts/sound_pass.py`
  - `FFMPEG` / `FFPROBE` environment variables override the ffmpeg and ffprobe paths.
  - The frame rate is parsed with `fractions.Fraction` instead of `eval()`.
  - Scratch files go to `<out>/checks/tmp/` instead of a hard-coded `/tmp`, so it runs on Windows.
  - Beat-grid check: kick offsets are folded to within half a beat, and the grid is shifted only when at least 8 kicks are found (it used to shift by tens of seconds when only 1-2 kicks were detected).
  - `CREDITS.txt` and `SOUND.md` are written as UTF-8.
- `scripts/report.py`: `report.html` is written as UTF-8.

Everything else is unchanged from upstream.
