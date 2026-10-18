#!/usr/bin/env bash
# Rebuild the example page from the template + engine, then package the skill.
#   examples/compile-dont-generate.html  template with timeline-core.js + timeline.js inlined
#   compile-studio.skill                 zip of compile-studio/ for claude.ai upload (git-ignored)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python - <<'EOF'
import pathlib, zipfile
root = pathlib.Path(".")
skill = root / "compile-studio"

tpl = (skill / "assets/template.html").read_text(encoding="utf-8")
# Pages get the pure core plus the browser player; video builds inline the core only.
engine = "\n".join((skill / f"assets/{f}").read_text(encoding="utf-8").rstrip("\n")
                   for f in ("timeline-core.js", "timeline.js"))
assert "/*@@TIMELINE@@*/" in tpl, "template is missing the /*@@TIMELINE@@*/ marker"
(root / "examples/compile-dont-generate.html").write_text(
    tpl.replace("/*@@TIMELINE@@*/", engine), encoding="utf-8", newline="\n")
print("built examples/compile-dont-generate.html")

out = root / "compile-studio.skill"
files = sorted(p for p in skill.rglob("*") if p.is_file() and p.name != ".DS_Store" and "__pycache__" not in p.parts)
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for p in files:
        z.write(p, p.relative_to(root).as_posix())
print(f"packaged {out} ({len(files)} files, {out.stat().st_size // 1024} KB)")
EOF
