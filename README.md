# Plano

**Plano** is a unified typography and geometry design studio that merges three creative workspaces (**Grafema**, **Vertice**, and **Secuencia**) into a single, cohesive web application.

---

## 🚀 Creative Workspaces

1. **GRAFEMA** *(formerly Touch Type)*
   - A generative typography parameterizer that lets you control character width, height, stroke weight, details, and rotation across active layers.

2. **VERTICE** *(formerly Tangents Studio)*
   - A vertex and glyph editor focused on geometric connections, custom grids, and interactive path compositions.

3. **SECUENCIA** *(formerly ScriptScript Studio)*
   - An interactive text layout engine allowing you to compose complex typographic lines with random variations (size, slant, baseline) and reference background overlays.

---

## 🎨 Unified UX/UI

- **Unified Colors & Tokens**: All apps share a centralized CSS design system (`css/style.css`) using Figma-inspired light/dark theme variables, input states, badges, and button styling.
- **Floating Right-Side Inspector**: Sub-app sidebars are floated on the right side with a `20px` viewport padding, matching the visual weight of **Secuencia**.
- **Aesthetic Capsule Switcher**: Swapping apps is done using a sleek, top-center capsule switcher tab bar.
- **Responsive Layout**: Sidebar panels automatically shrink to fit the viewport height and enable vertical scrolling on smaller screen sizes.

---

## ⌨️ Keyboard Shortcuts

You can switch between work modes instantly at any time:
* 🌐 `Alt + G` (or `Option + G`) — Switch to **Grafema**
* 🌐 `Alt + V` (or `Option + V`) — Switch to **Vertice**
* 🌐 `Alt + S` (or `Option + S`) — Switch to **Secuencia**

*(Works globally, even when keyboard focus is captured inside any child canvas).*

---

## ⚙️ Architecture

- **Iframe Isolation**: Because all three original editors rely on global p5.js scope instances, conflicting listeners, and custom coordinate tracking, they are embedded inside isolated `<iframe>` containers.
- **State Preservation**: Tabs are hidden/shown via CSS `visibility` and `opacity` toggles instead of `display: none` to prevent p5.js canvases from collapsing, losing undo/redo history, or resetting scale/zoom.
- **Window Messaging**: Cross-document messaging (`window.postMessage`) synchronizes Alt-shortcuts and theme changes (dark/light mode toggles) automatically across all parent/child contexts.
- **Local Compatibility**: Presets are preloaded via `<script>` files in `index.html` to bypass browser-specific CORS request blocks, making Plano fully runnable directly from local disk storage (`file://` protocol).

---

## 💻 How to Run

### Method 1: Local Disk (No Server)
Just open [index.html](index.html) directly in any web browser.

### Method 2: Local Web Server
To serve Plano using a local server, navigate to the folder and run:

```bash
# Python 3
python3 -m http.server 8000

# Node.js static server (e.g. npx)
npx serve .
```
Then navigate to `http://localhost:8000/` or the corresponding address.
