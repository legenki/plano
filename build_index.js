const fs = require('fs');
const cheerio = require('cheerio');

// --- Helper to process an HTML file ---
function processHtml(filePath, prefix, specialIds) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Remove script tags
  $('script').remove();

  // Prefix IDs
  $('[id]').each((i, el) => {
    const id = $(el).attr('id');
    if (!id) return;

    if (specialIds[id]) {
      $(el).attr('id', specialIds[id]);
      return;
    }

    // Only prefix if it doesn't already have it
    if (!id.startsWith(prefix)) {
      $(el).attr('id', prefix + id);
    }
  });

  // Prefix 'for' attributes in labels matching the logic
  $('[for]').each((i, el) => {
    const f = $(el).attr('for');
    if (f && !f.startsWith(prefix)) {
      $(el).attr('for', prefix + f);
    }
  });

  return $('body').html();
}

// 1. Process Grafema
const grafemaContent = processHtml('grafema/index.html', 'g-', {
  'snackbar': 'grafema-snackbar',
  'canvas-container': 'grafema-canvas',
  'helpModal': 'g-helpModal',
  'app-container': 'g-app-container'
});

// 2. Process Vertice
const verticeContent = processHtml('vertice/index.html', 'v-', {
  'snackbar': 'vertice-snackbar',
  'canvas-container': 'vertice-canvas',
  'helpModal': 'v-helpModal',
  'app-container': 'v-app-container',
  'sidebar': 'v-sidebar',
  'export-filename': 'v-export-filename',
  'dom-layers-list': 'v-dom-layers-list'
});

// 3. Process Secuencia
const secuenciaContent = processHtml('secuencia/index.html', 's-', {
  'snackbar': 'secuencia-snackbar',
  'canvas-container': 'secuencia-canvas',
  'helpModal': 's-helpModal',
  'scriptEditor': 's-scriptEditor',
  'textBox': 's-textBox',
  'textBoxSettings': 's-textBoxSettings',
  'glyphEditorContext': 's-glyphEditorContext'
});


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
  <!-- SECUENCIA PRESETS -->
  <script src="secuencia/presets/script/01.js"></script>
  <script src="secuencia/presets/script/02.js"></script>
  <script src="secuencia/presets/script/03.js"></script>
  <script src="secuencia/presets/script/04.js"></script>
  <script src="secuencia/presets/script/05.js"></script>
  <script src="secuencia/presets/script/06.js"></script>
  <script src="secuencia/presets/script/07.js"></script>
  <script src="secuencia/presets/script/08.js"></script>
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
      ${secuenciaContent}
    </div>
    
  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('index.html', finalHtml);
console.log('index.html built successfully!');
