#!/usr/bin/env node
// Turn a built Compile Studio page into a HyperFrames composition folder.
//   node to-hyperframes.mjs <page.html> <out-dir> [--width 1920 --height 1080 --duration 17]
// Keeps CONFIG and render(t) untouched. Changes only the shell:
//   - drops the browser player (HyperFrames owns the clock), keeps the pure core
//   - wraps the page in a root element carrying the literal duration and size
//   - makes the stage fill the frame and hides page chrome (title, controls)
//   - replaces CompileTimeline.create(...) with a seek hook that calls render(t)
// No network, no dependencies.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [, , input, outDir, ...rest] = process.argv;
if (!input || !outDir) {
  console.error("usage: node to-hyperframes.mjs <page.html> <out-dir> [--width W --height H --duration S]");
  process.exit(1);
}
const opt = {};
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, "")] = Number(rest[i + 1]);
const width = opt.width || 1920, height = opt.height || 1080;

let src = readFileSync(input, "utf8");
const fail = msg => { console.error("to-hyperframes: " + msg); process.exit(1); };

// Duration: last scene end in CONFIG.timing.scenes, unless given
let duration = opt.duration;
if (!duration) {
  const m = src.match(/scenes\s*:\s*(\[\s*\[[\s\S]*?\]\s*\])/);
  if (!m) fail("couldn't find timing.scenes in CONFIG; pass --duration <seconds>");
  const scenes = JSON.parse(m[1]);
  duration = scenes[scenes.length - 1][1];
}
if (!(duration > 0)) fail("duration must be a positive number");

// 1. Drop the browser player block (keeps timeline-core)
const playerStart = src.indexOf("/*\n * Compile Studio browser player");
if (playerStart < 0) fail("browser player block not found; was the page built from the template?");
const playerEnd = src.indexOf("})(window);", playerStart);
if (playerEnd < 0) fail("end of browser player block not found");
src = src.slice(0, playerStart) + src.slice(playerEnd + "})(window);".length);

// 2. Replace CompileTimeline.create({...}); with the seek hook
const create = src.match(/CompileTimeline\.create\(\{[\s\S]*?\}\);/);
if (!create) fail("CompileTimeline.create({...}); not found");
const hook = `// Video mode: HyperFrames owns the clock and seeks render(t) once per frame.
const __dur = ${duration};
const __render = t => render(Math.min(Math.max(t, 0), __dur));
if (window.__hyperframes && window.__hyperframes.registerFrameSource) {
  window.__hyperframes.registerFrameSource({          // HyperFrames >= 0.8.140
    element: document.getElementById("hf-root"),
    ready: document.fonts ? document.fonts.ready : Promise.resolve(),
    render: __render
  });
} else {
  addEventListener("hf-seek", e => __render(e.detail.time));   // earlier releases
}
__render(window.__hfThreeTime || 0);`;
src = src.replace(create[0], hook);

// 3. Root element with literal size and duration (HyperFrames reads these before scripts run)
const main = src.indexOf('<main class="wrap">');
if (main < 0) fail('<main class="wrap"> not found');
src = src.slice(0, main) +
  `<div id="hf-root" data-composition-id="explainer" data-start="0" data-width="${width}" data-height="${height}" data-duration="${duration}" data-no-timeline>\n` +
  src.slice(main);
src = src.replace("</main>", "</main>\n</div>");

// 4. Frame-filling stage, hidden chrome, no CSS transitions (they run on the wall clock).
// Portrait and square frames lay the stage out at 600px wide so the template's
// phone layout (container queries at <=620px) applies, then scale it to the frame.
const layoutW = width > height ? width : 600;
const layoutH = Math.round(layoutW * height / width);
const scale = width / layoutW;
src = src.replace(/transition\s*:[^;}"]*;?/g, "");
src = src.replace("</style>", `
/* video mode */
html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}
#hf-root{position:relative;width:${width}px;height:${height}px;overflow:hidden}
#hf-root .wrap{max-width:none;padding:0;margin:0;width:${layoutW}px;height:${layoutH}px;transform:scale(${scale});transform-origin:0 0}
#hf-root .stage{width:${layoutW}px;height:${layoutH}px;aspect-ratio:auto;border-radius:0;border:0}
#hf-root .wrap > :not(.stage){display:none}
</style>`);

if (src.includes("requestAnimationFrame")) fail("page still uses requestAnimationFrame; remove it from render code");

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), src);
console.log(`wrote ${join(outDir, "index.html")} (${width}x${height}, ${duration}s)`);
