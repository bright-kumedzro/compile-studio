#!/usr/bin/env bash
# Refresh vendored upstream skills into compile-studio/modules/*/upstream.
# Pinned to exact commits so the skill never changes underneath you.
# To update: bump a SHA below, run this script, review the diff, commit.
#
# Only MIT-licensed upstreams are vendored (bundled sounds in sfx are CC0).
# licence file, so the remotion module links to it instead of copying it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODULES="$ROOT/compile-studio/modules"

TASTE_REPO="LottieFiles/motion-design-skill"
TASTE_SHA="f9a8a041b85185ee4881b3471d3415e939aac772"

GSAP_REPO="greensock/gsap-skills"
GSAP_SHA="aed9cfd3277740755f6bfc1155c7aa645403b760"

# Barty-Bart/motion-graphics: only the sound-effects skill (MIT; bundled sounds CC0)
SFX_REPO="Barty-Bart/motion-graphics"
SFX_SHA="3d83d987d658601d8a1269eb691622bdcd427335"

# vendor <repo> <sha> <path-in-repo> <dest-dir>
vendor() {
  local repo="$1" sha="$2" src="$3" dest="$4"
  local tmp
  tmp="$(mktemp -d)"
  curl -fsSL "https://codeload.github.com/$repo/tar.gz/$sha" | tar -xz -C "$tmp"
  local top="$tmp/$(ls "$tmp")"
  rm -rf "$dest"
  mkdir -p "$dest"
  cp -R "$top/$src/." "$dest/"
  cp "$top/LICENSE" "$dest/LICENSE"
  # One SKILL.md per skill: rename upstream ones so they load only via a module.
  find "$dest" -name SKILL.md -execdir mv SKILL.md UPSTREAM.md \;
  # gsap's llms.txt is an index of upstream paths that no longer exist here.
  rm -f "$dest/llms.txt"
  cat > "$dest/SOURCE.md" <<EOF
# Upstream source

Vendored from https://github.com/$repo at commit \`$sha\`
(path \`$src\`). Licence: MIT, see LICENSE in this folder.

Do not edit files here. Refresh with \`scripts/sync-upstream.sh\` in the
compile-studio repo: https://github.com/bright-kumedzro/compile-studio
EOF
  rm -rf "$tmp"
  echo "vendored $repo@${sha:0:7} -> ${dest#$ROOT/}"
}

vendor "$TASTE_REPO" "$TASTE_SHA" "skills/motion-design" "$MODULES/taste/upstream"
vendor "$GSAP_REPO"  "$GSAP_SHA"  "skills"               "$MODULES/gsap/upstream"
vendor "$SFX_REPO"   "$SFX_SHA"   "skills/sound-effects" "$MODULES/sfx/upstream"

# Local fixes to the sound-effects script, applied on every sync and listed in MODIFIED.md.
# Each edit asserts its target exists, so an upstream change fails loudly instead of silently.
python - "$MODULES/sfx/upstream" <<'PY'
import pathlib, sys
root = pathlib.Path(sys.argv[1])
def patch(rel, edits):
    p = root / rel; s = p.read_text(encoding="utf-8")
    for old, new in edits:
        assert s.count(old) == 1, f"{rel}: expected exactly one match for {old[:60]!r}"
        s = s.replace(old, new)
    p.write_text(s, encoding="utf-8", newline="\n")
patch("scripts/sound_pass.py", [
    # ffmpeg/ffprobe may not be on PATH (common on Windows): allow overrides
    ("run=lambda c:subprocess.run(c,capture_output=True,text=True)",
     "FFMPEG=os.environ.get('FFMPEG','ffmpeg'); FFPROBE=os.environ.get('FFPROBE','ffprobe')\n"
     "run=lambda c:subprocess.run([{'ffmpeg':FFMPEG,'ffprobe':FFPROBE}.get(c[0],c[0])]+c[1:],capture_output=True,text=True)"),
    # no eval() on tool output: parse the frame rate as a fraction
    ("fps=eval(run(", "from fractions import Fraction\nfps=float(Fraction(run("),
    ("'-of','csv=p=0',A.video]).stdout.strip())", "'-of','csv=p=0',A.video]).stdout.strip()))"),
    # no hard-coded /tmp: keep scratch files inside the output folder
    ("os.makedirs(f'{A.out}/checks',exist_ok=True)",
     "os.makedirs(f'{A.out}/checks',exist_ok=True); TMP=os.path.join(A.out,'checks','tmp'); os.makedirs(TMP,exist_ok=True)"),
    ("'/tmp/after_audio.wav']); au,_=librosa.load('/tmp/after_audio.wav'",
     "os.path.join(TMP,'after_audio.wav')]); au,_=librosa.load(os.path.join(TMP,'after_audio.wav')"),
    ("f'/tmp/cue{k}{tag}.png'])", "os.path.join(TMP,f'cue{k}{tag}.png')])"),
    ("plt.imread(f'/tmp/cue{k}{tag}.png')", "plt.imread(os.path.join(TMP,f'cue{k}{tag}.png'))"),
    # beat-grid check: offsets only mean something within half a beat, and only with enough kicks.
    # Without this, a track with 1-2 detected kicks shifted the grid by tens of seconds.
    ("o=offs(beats); med=float(np.median(o)) if o.size else 0.0",
     "o=offs(beats); o=((o+period/2)%period)-period/2 if o.size else o; med=float(np.median(o)) if kicks.size>=8 else 0.0\n"
     "if kicks.size<8: log.append(f'Only {kicks.size} kick(s) found below 120 Hz: beat grid not checked against kicks; verify beatgrid.png by eye.')"),
    # write text as UTF-8 regardless of the OS default encoding
    ("open(f'{A.out}/CREDITS.txt','w')", "open(f'{A.out}/CREDITS.txt','w',encoding='utf-8')"),
    ("open(f'{A.out}/SOUND.md','w')", "open(f'{A.out}/SOUND.md','w',encoding='utf-8')"),
])
patch("scripts/report.py", [
    ("open(os.path.join(out,'report.html'),'w')", "open(os.path.join(out,'report.html'),'w',encoding='utf-8')"),
])
(root / "MODIFIED.md").write_text("""# Local modifications

Applied by `scripts/sync-upstream.sh` on top of the pinned upstream commit (see SOURCE.md):

- `scripts/sound_pass.py`
  - `FFMPEG` / `FFPROBE` environment variables override the ffmpeg and ffprobe paths.
  - The frame rate is parsed with `fractions.Fraction` instead of `eval()`.
  - Scratch files go to `<out>/checks/tmp/` instead of a hard-coded `/tmp`, so it runs on Windows.
  - Beat-grid check: kick offsets are folded to within half a beat, and the grid is shifted only when at least 8 kicks are found (it used to shift by tens of seconds when only 1-2 kicks were detected).
  - `CREDITS.txt` and `SOUND.md` are written as UTF-8.
- `scripts/report.py`: `report.html` is written as UTF-8.

Everything else is unchanged from upstream.
""", encoding="utf-8", newline="\n")
print("patched sound-effects (see MODIFIED.md)")
PY
