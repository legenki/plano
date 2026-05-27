import { grafemaSketch } from '../grafema/js/app.js';
import { verticeSketch } from '../vertice/js/app.js';

let currentApp = 'grafema';
let currentTheme = 'light';
const apps = ['grafema', 'vertice', 'secuencia'];

// Store instances if we need to call methods on them
let grafemaInstance = null;
let verticeInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize p5 instances
  const grafemaContainer = document.getElementById('grafema-canvas');
  if (grafemaContainer) {
    grafemaInstance = new p5(grafemaSketch, grafemaContainer);
  }

  const verticeContainer = document.getElementById('vertice-canvas');
  if (verticeContainer) {
    verticeInstance = new p5(verticeSketch, verticeContainer);
  }

  // 2. Setup tab switching
  apps.forEach(app => {
    const tabBtn = document.getElementById(`tab-${app}`);
    if (tabBtn) {
      tabBtn.addEventListener('click', () => switchApp(app));
    }
  });

  // 3. Setup global theme toggle
  const themeBtn = document.getElementById('btn-global-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleGlobalTheme);
  }

  // 4. Keyboard shortcuts
  window.addEventListener('keydown', handleGlobalKeys);
  
  // 5. Listen to messages from Secuencia iframe
  window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'KEYDOWN_EVENT') {
      // Re-dispatch global keys coming from iframe
      handleGlobalKeys({
        altKey: event.data.altKey,
        key: event.data.key,
        preventDefault: () => {}
      });
    }
  });
});

function switchApp(appName) {
  if (!apps.includes(appName)) return;
  currentApp = appName;

  apps.forEach(app => {
    const btn = document.getElementById(`tab-${app}`);
    const view = document.getElementById(`app-${app}`);
    
    if (app === appName) {
      if (btn) btn.classList.add('active');
      if (view) {
        view.style.display = 'block';
        view.classList.add('active');
        
        // If it's an iframe, try to focus it
        if (app === 'secuencia') {
          const iframe = document.getElementById('iframe-secuencia');
          if (iframe) iframe.focus();
        }
      }
    } else {
      if (btn) btn.classList.remove('active');
      if (view) {
        view.style.display = 'none';
        view.classList.remove('active');
      }
    }
  });

  // Trigger resize to fix p5.js canvas dimensions if it was hidden during initialization
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 10);
}

function toggleGlobalTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light');
  } else {
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  }
  
  // Update Grafema instance
  if (grafemaInstance && typeof grafemaInstance.applyTheme === 'function') {
    grafemaInstance.applyTheme(currentTheme);
  }
  
  // Update Vertice instance
  if (verticeInstance && typeof verticeInstance.applyTheme === 'function') {
    verticeInstance.applyTheme(currentTheme);
  }

  // Forward theme to Secuencia iframe
  const iframe = document.getElementById('iframe-secuencia');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'SYNC_THEME', theme: currentTheme }, '*');
  }
}

function handleGlobalKeys(e) {
  if (e.altKey) {
    const key = (e.key || '').toLowerCase();
    if (key === 'g' || key === 'п') {
      if (e.preventDefault) e.preventDefault();
      switchApp('grafema');
    } else if (key === 'v' || key === 'м') {
      if (e.preventDefault) e.preventDefault();
      switchApp('vertice');
    } else if (key === 's' || key === 'ы') {
      if (e.preventDefault) e.preventDefault();
      switchApp('secuencia');
    }
  }
}
