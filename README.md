# SARAS Lab

Our own 3D robotics lab: a fully interactive, animated 3D workbench where we design, build, wire, check and test robot designs, starting with SARAS (Smart Autonomous Robotic AI System, from Tech With Anant's videos). Also: an extensible hardware library, design versions with side-by-side 3D compare, a lab notebook for test runs, and the complete build tutorial.

**Plan and status: [PLAN.md](./PLAN.md).** Milestone M1 (foundation + 3D core) is built; M2 (editing, designs, chassis sliders, STL import) is next.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (vitest)
npm run build      # production build in dist/
```

Deploys to GitHub Pages from `main` via `.github/workflows/pages.yml`.

## Where things live

| Path | What |
|---|---|
| `src/ui/` | design tokens (beige theme), buttons, cards |
| `src/app/` | router, header, footer, command palette |
| `src/catalog/` | part schema (Zod) and the built-in parts as JSON |
| `src/designs/` | design types, the SARAS v1 preset, store, BOM |
| `src/chassis/` | parametric chassis generator |
| `src/workbench/` | persistent canvas, viewports, camera rig, procedural part bodies, scene |
| `src/pages/` | Lab, Workbench, Designs, Parts, Tutorial, Docs, About |
