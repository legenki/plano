const fs = require('fs');

// Read grafema
let grafemaHtml = fs.readFileSync('grafema/index.html', 'utf8');
const grafemaBodyMatch = grafemaHtml.match(/<body>([\s\S]*?)<\/body>/);
let grafemaContent = grafemaBodyMatch[1];
// Prefix IDs
grafemaContent = grafemaContent.replace(/id="([^"]+)"/g, (match, p1) => {
  if (p1 === "app-container" || p1 === "snackbar" || p1 === "helpModal" || p1.startsWith("btn-") || p1.startsWith("input-") || p1.startsWith("slide-") || p1.startsWith("val-") || p1.startsWith("color-") || p1.startsWith("label-") || p1.startsWith("stats-") || p1.startsWith("active-") || p1.startsWith("no-active-") || p1.startsWith("layers-") || p1.startsWith("letter-") || p1 === "toggle-grid") {
    if (!p1.startsWith("g-")) return `id="g-${p1}"`;
  }
  if (p1 === "snackbar") return `id="grafema-snackbar"`;
  if (p1 === "canvas-container") return `id="grafema-canvas"`;
  return match;
});
// Replace for attribute in labels
grafemaContent = grafemaContent.replace(/for="([^"]+)"/g, (match, p1) => {
  if (p1.startsWith("color-")) return `for="g-${p1}"`;
  return match;
});

// Remove script tags from grafemaContent
grafemaContent = grafemaContent.replace(/<script[\s\S]*?<\/script>/g, '');


// Read vertice
let verticeHtml = fs.readFileSync('vertice/index.html', 'utf8');
const verticeBodyMatch = verticeHtml.match(/<body>([\s\S]*?)<\/body>/);
let verticeContent = verticeBodyMatch[1];
// Prefix IDs
verticeContent = verticeContent.replace(/id="([^"]+)"/g, (match, p1) => {
  if (p1 === "sidebar" || p1.startsWith("card-") || p1.startsWith("btn-") || p1.startsWith("input-") || p1.startsWith("slide-") || p1.startsWith("val-") || p1.startsWith("picker-") || p1.startsWith("label-") || p1.startsWith("check-") || p1 === "export-filename" || p1 === "dom-layers-list") {
    if (!p1.startsWith("v-")) return `id="v-${p1}"`;
  }
  if (p1 === "snackbar") return `id="vertice-snackbar"`;
  if (p1 === "canvas-container") return `id="vertice-canvas"`;
  if (p1 === "app-container") return `id="v-app-container"`;
  if (p1 === "helpModal") return `id="v-helpModal"`;
  return match;
});
// Replace for attribute in labels
verticeContent = verticeContent.replace(/for="([^"]+)"/g, (match, p1) => {
  if (p1.startsWith("picker-")) return `for="v-${p1}"`;
  return match;
});

// Remove script tags from verticeContent
verticeContent = verticeContent.replace(/<script[\s\S]*?<\/script>/g, '');

// Clean up some inner HTML issues (like duplicate snackbar/modals)
grafemaContent = grafemaContent.replace('id="g-snackbar"', 'id="grafema-snackbar"');
verticeContent = verticeContent.replace('id="v-snackbar"', 'id="vertice-snackbar"');

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plano</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="css/style.css">
  
  <!-- LIBRARIES -->
  <script src="lib/p5.min.js"></script>
  <script src="lib/p5.svg.js"></script>
</head>
<body class="theme-light">

  <!-- Top-Center Tab Switcher Capsule -->
  <div class="app-switcher-container" style="display: flex; gap: 8px; align-items: center;">
    <div class="app-switcher">
      <button id="tab-grafema" class="switcher-tab active" data-target="grafema">GRAFEMA</button>
      <button id="tab-vertice" class="switcher-tab" data-target="vertice">VERTICE</button>
      <button id="tab-secuencia" class="switcher-tab" data-target="secuencia">SECUENCIA</button>
    </div>
    <div class="app-switcher" style="padding: 3px;">
      <button id="btn-global-theme" class="switcher-tab" style="padding: 8px; display: flex; align-items: center; justify-content: center;" title="Toggle Theme">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  </div>

  <div class="apps-container" style="width:100vw; height:100vh; position:absolute; top:0; left:0; z-index:0; overflow:hidden;">
    
    <!-- Grafema -->
    <div id="app-grafema" class="app-view active" style="width:100%; height:100%;">
      ${grafemaContent}
    </div>
    
    <!-- Vertice -->
    <div id="app-vertice" class="app-view" style="width:100%; height:100%; display:none;">
      ${verticeContent}
    </div>
    
    <!-- Secuencia -->
    <div id="app-secuencia" class="app-view" style="width:100%; height:100%; display:none;">
      <iframe id="iframe-secuencia" src="secuencia/index.html" class="app-iframe" style="width:100%; height:100%; border:none;"></iframe>
    </div>
    
  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('index.html', finalHtml);
console.log('index.html built successfully!');
