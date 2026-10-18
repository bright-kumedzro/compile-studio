# Workflow detail

## 1. Reference → spec
Ask for a reference rather than a description. Break it down into:
- Total length and number of scenes
- When the first motion lands (usually within 0.3s)
- Entrance order and stagger between elements
- The payoff moment and how long it holds
- Easing character (snappy, smooth, springy)
Write this as a 5–8 line spec and confirm it before building.

## 2. Data first
- Get the figure, its source, filters and date range.
- Find the single number the piece is about. Most good data explainers have one.
- If the data is mocked, set `source: "Sample data"` in CONFIG.

## 3. Story before motion
One sentence per scene. If a scene has no clear point, cut it. Default structure:
1. Title: the claim
2. Data: the question and the chart, landing on the hero number
3. Motion: how it was built or why it matters (optional)
4. Edit: where it lives (slide, doc, post)
5. Close: the one line to remember

## 4. Build
See SKILL.md, "Building the page".

## 5. Direct in words
Map requests to CONFIG keys:
| Request | Change |
|---|---|
| "Hold the number longer" | extend the data scene's end in `timing.scenes` and shift later scenes |
| "Draw the bars slower" | increase `timing.drawOn` |
| "Bars one after another" | increase `timing.stagger` |
| "Highlight another bar" | change `highlight` |
| "Change the wording" | edit the copy keys |
| "Different colour" | change `--signal` (light and dark) in `:root` |
State which values changed in your reply.

## 6. Ship
Publish as a page, or deliver the HTML file. The page is the source of truth; screenshots or screen recordings can be taken from it.
