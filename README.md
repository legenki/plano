# Plano

**Plano** is a unified typography and geometry design studio with four creative workspaces built on p5.js and Vite.

Live: [legenki.github.io/plano](https://legenki.github.io/plano/)

---

## Workspaces

### GRAFEMA
Generative typography parameterizer. Control character width, height, stroke weight, detail level, and rotation across active glyph layers.

### VERTICE
Vertex and glyph editor focused on geometric connections, custom grids, and interactive path compositions with corner-based curves.

### SECUENCIA
Interactive text layout engine. Compose typographic lines with Hershey / SCM vector fonts, randomized size, slant, baseline offset, and reference overlays.

### RETICULA
Raster grid drawing tool. Paint a mask with a flat brush and render it through a configurable grid of shapes — metaballs, circles, rectangles, crosses, or custom SVG paths. Supports hex, brick, diagonal, and radial grid layouts with per-element size mapping, stroke/fill modes, and SVG export.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Alt + G` | Switch to Grafema |
| `Alt + V` | Switch to Vertice |
| `Alt + S` | Switch to Secuencia |
| `Alt + R` | Switch to Reticula |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `☾` button | Toggle dark / light theme |

---

## Architecture

- **ES modules + p5.js instance mode** — each workspace runs as an isolated p5 sketch (`createSketch(p)`) with no global scope pollution
- **Vite** — dev server and build tool, outputs to `dist/` with `base: '/plano/'` for GitHub Pages
- **Shared design system** — unified CSS variables, tokens, and component styles in `src/css/style.css`
- **localStorage autosave** — each workspace saves and restores state automatically
- **HistoryManager** — shared memento-pattern undo/redo used across workspaces

---

## Development

```bash
npm install
npm run dev       # localhost:3000
npm run build     # outputs to dist/
```

---

## Deploy

Pushing to `main` triggers GitHub Actions → builds with Vite → deploys to GitHub Pages automatically.
