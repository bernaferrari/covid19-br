# Portal COVID-19 Paraná

Portal COVID-19 Paraná is a Next.js + TypeScript data visualization platform that consolidates COVID-19 indicators for Brazil with a dedicated focus on the state of Paraná. Conceived in early 2020, the site combines interactive D3 dashboards, curated news, and context produced by a multidisciplinary team from UFPR and collaborators.

> ⚠️ **Historical archive:** This repository is frozen as documentation of the collective COVID-19 response during 2020–2021. External services are no longer polled, and the data bundled under `public/` reflects intermediate caches from that period rather than end-of-pandemic totals.

- Preserves the collaborative work between UFPR departments and Insper-SP researchers during the first pandemic years.
- Built with React 19, Next.js 15, Chakra UI 3, Emotion, and Observable notebooks for rich exploratory charts.
- Interactive dashboards highlight the historical focus on Paraná municipalities alongside national views.
- Historically relied on Brasil.IO and covid19api.com; the Johns Hopkins endpoint is retired and the pipeline now short-circuits, leaving the mid-pandemic CSVs untouched.
- Underpins the research article “[Systemic view of human-data interaction: analyzing a COVID-19 data visualization platform](https://dl.acm.org/doi/abs/10.1145/3424953.3426655)” (also available on [ResearchGate](https://www.researchgate.net/publication/347919062_Systemic_view_of_human-data_interaction_analyzing_a_COVID-19_data_visualization_platform)).
- Presentation slides shared at HCI 2020: [Analysis of a COVID-19 data visualization platform](https://www.figma.com/community/file/898618771515892178/hci-2020-analyis-of-a-covid-19-data-visualization-plataform).

## Table of Contents
- [Archival Status](#archival-status)
- [Project Highlights](#project-highlights)
- [Getting Started](#getting-started)
- [Data Pipeline](#data-pipeline)
- [Repository Layout](#repository-layout)
- [Development Tips](#development-tips)
- [Research & Credits](#research--credits)
- [License](#license)

## Archival Status
- The live site is no longer deployed; this repository serves as a historical record of the platform as it operated during the early pandemic response.
- CSV and JSON files under `public/` capture intermediate dataset caches saved while the project was active. They should not be interpreted as definitive or final statistics.
- Automation scripts remain for documentation but depend on third-party services that may no longer respond—run them only if you are studying the original workflow.
- New issues and pull requests are not being accepted; feel free to fork if you need to experiment or adapt the code for research.

## Project Highlights
- **Interactive dashboards:** Municipal heatmaps, state-level timelines, and growth tables driven by Observable notebooks (`from_observablehq/**`) embedded with `@observablehq/runtime`.
- **Focus on Paraná:** Dedicated views for Paraná municipalities, including top-growing cities and time-lapse maps powered by preprocessed CSV batches.
- **Complementary insights:** National/global summaries, curated COVID-19 news, and footer resources assembled by the research collective.
- **Static hosting friendly:** Pre-rendered via `next export` to the `out/` directory with SEO metadata generated through the `next-seo/pages` helpers.
- **Accessible styling:** Chakra UI aids in rapid iteration, theming, and responsive layouts without custom CSS frameworks.

## Getting Started
Although the project is archived, you can still run the application locally to explore the preserved dashboards and the mid-pandemic data snapshots.

### Prerequisites
- Node.js ≥ 18.18.0 and [pnpm](https://pnpm.io/) (matching the requirements for Next.js 15 and React 19).
- Python 3.9+ with `pip` for the optional data-refresh scripts. The scripts rely on `pandas`, `numpy`, `requests`, and `gzip`/`shutil` from the standard library.

### Install dependencies
```bash
pnpm install
```

### Run the development server
```bash
pnpm dev
```
Then open `http://localhost:3000` in your browser. Hot-module reloading is enabled by default.

### Production build & start
```bash
pnpm build
pnpm start
```
The production server listens on port `3000` unless `PORT` is provided.

### Static export
```bash
pnpm export
```
The fully static site is emitted into `out/` and can be deployed to any static host (e.g., Netlify, GitHub Pages, S3 + CloudFront).

## Data Pipeline
The repository already includes the cached CSV/JSON extracts under `public/`. The steps below document the original refresh routine; run them only if you are recreating the historical workflow (some endpoints are now offline and the results will differ from the historical cache):

```bash
cd scripts
uv pip install -r requirements.txt            # install/update pinned dependencies
python3 download_from_source.py               # fetches caso_full.csv from Brasil.IO
python3 generate_shrink.py                    # produces public/caso_shrink.csv (state-level snapshot)
python3 data_for_cities.py                    # creates municipal timeseries under public/data/
python3 getJHU.py                             # updates global/Brazil summaries and history CSVs
```
> **Note:** `getJHU.py` now exits gracefully if `api.covid19api.com` is unreachable (the service has been sunset). When that happens, the previously generated `current_*.csv` and `history_*.csv` files are left untouched.

For convenience, `scripts/update.sh` chains the Brasil.IO download and post-processing in one command:

```bash
cd scripts
./update.sh
```

Additional tooling:
- `pegaJHU.py` at the repository root mirrors `getJHU.py` when run from the project root.
- `public/municipios.csv`, `map_br.json`, and `map_pr.json` feed the maps rendered in the Observable notebooks.
- `assets/` and `public/figs/` host static imagery used on the About page.
- `scripts/requirements.in` captures the high-level Python dependencies; re-run `uv pip compile scripts/requirements.in --output-file scripts/requirements.txt` after edits to keep pins current.

## Repository Layout
- `pages/` – Next.js routes (`index.tsx`, `about.tsx`, `evolution.tsx`) composed with Chakra UI.
- `components/` – Presentation components, Observable embeds (`components/d3/**`), layout helpers, and the data-loading guard (`GetCovidDataComp`).
- `from_observablehq/` – Bundled Observable notebooks that power the interactive visualizations.
- `public/` – Static assets, CSV/JSON data exports, and animation imagery consumed at runtime.
- `scripts/` – Python utilities for data acquisition and preprocessing (Brasil.IO + covid19api.com).
- `utils/` – Client-side helpers (e.g., `fetcher.ts` caches map and city metadata).
- `out/` – Static export output (generated).
- `seo.config.js` – Default SEO metadata passed to `next-seo/pages`.

## Development Tips
- Treat the project as read-only documentation unless you are explicitly reproducing experiments; the bundled datasets mirror the historical cache and are not authoritative totals.
- Run `pnpm lint` for ESLint checks and `pnpm format` to verify formatting via Prettier.
- Observable modules are loaded dynamically; ensure data paths under `public/` remain in sync when restructuring assets.
- When adding new datasets, expose them via `public/` so Next.js can serve them statically without custom API routes.
- Chakra UI theming can be extended via the custom `ThemeProvider` in `components/Header.tsx`. Keep components functional and typed (TypeScript) for consistency.

## Research & Credits
- Research publication: “[Systemic view of human-data interaction: analyzing a COVID-19 data visualization platform](https://dl.acm.org/doi/abs/10.1145/3424953.3426655)” ([ResearchGate preprint](https://www.researchgate.net/publication/347919062_Systemic_view_of_human-data_interaction_analyzing_a_COVID-19_data_visualization_platform)).
- Data sources: [Brasil.IO COVID-19 dataset](https://brasil.io/dataset/covid19/) and [covid19api.com](https://covid19api.com/).
- Visualization & analysis team: Departments of Statistics, Informatics, Physics, Mathematics, Design, and Health at UFPR, with collaborators from Insper-SP and support from UFPR SCEX.

## License
This project is released under the [MIT License](LICENSE).
