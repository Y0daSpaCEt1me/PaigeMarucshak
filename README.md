# PaigeMaruschak

A static, scroll-driven portfolio story, beginning with PAIGE on a black marble stage and moving through particles, laser fusion, electricity, company development, financial models, and quantum computing. It ends in the original pastel particle résumé background.

## Run

Serve `dist/` with any static HTTP server, for example `python3 -m http.server 8000 --directory dist`. No installation or build is needed.

## Edit

- `dist/scenes.js`: approved image sequence, captions, timeline steps, and scroll pacing. Units are viewport heights, not seconds.
- `dist/style.css`: responsive layout, native timeline marker style, captions, and transitions.
- `dist/app.js`: scroll renderer, chapter links, image preloading, accessibility behavior.
- `dist/particles.js`: preserved original particle engine, with a pause API.
- `dist/assets.json`: image dimensions and optimized asset paths.

Images with baked-in timelines are displayed through an SVG viewport that excludes the old footer, allowing consistent HTML timelines. Original image pixels are retained in the optimized WebP assets. Captions are HTML text for responsive readability. The story uses reversible opacity transitions, without scroll hijacking or timed playback.

The current résumé copy is an initial short introduction based on Paige's stated interests; it is not a complete CV. The previous saved prototype contained the particle engine but no complete résumé content. Replace or expand this section with Paige's approved résumé.

Financial models, companies, development paths, and scientific imagery are illustrative. Development steps have no promised dates. The financial assumptions are scenarios, not forecasts.

## Hosting and source

The `dist` directory can be deployed on static hosting, GitHub Pages, or Vercel. The `.openai/hosting.json` file is only used for the private Sites preview deployment.

The connected GitHub repository is `Y0daSpaCEt1me/PaigeMarucshak` (the repository currently spells the surname differently from the requested Site title, `PaigeMaruschak`). The local `github` remote targets that existing private repository. Sites publication continues through the Sites source repository and deployment workflow; a GitHub push alone does not deploy to Sites.

## Approved direction pending final résumé

The final résumé has not been supplied. Keep the existing introduction provisional and do not invent qualifications, jobs, dates, or accomplishments. When the approved résumé arrives, place all résumé content in semitransparent white 3D blocks over the existing pastel particle background. The current introduction, interest cards, research card, and footer establish that treatment with translucent white surfaces, highlights, shallow extruded edges, and soft shadows.

Proposed optional addition: a “Beyond the résumé” puzzle gallery after research and before the footer, with twelve different twisty puzzles on individual translucent plinths. Use a 4-column desktop, 2-column tablet, and 1-column mobile layout. Each could offer a name, photo or interactive model, and a short personal note. Confirm the twelve actual puzzle types and imagery before implementing; do not imply ownership, solve times, or achievements that have not been provided. Keep rotation opt-in and respect reduced motion. This is a proposal, not a published gallery.
