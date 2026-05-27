import { grafemaSketch } from '../grafema/js/app.js';
import { verticeSketch } from '../vertice/js/app.js';
import { secuenciaSketch } from '../secuencia/js/app.js';

let currentApp = 'grafema';
let currentTheme = 'light';
const apps = ['grafema', 'vertice', 'secuencia'];

// Store instances if we need to call methods on them
let grafemaInstance = null;
let verticeInstance = null;
let secuenciaInstance = null;

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

  const secuenciaContainer = document.getElementById('app-secuencia');
  if (secuenciaContainer) {
    secuenciaInstance = new p5(secuenciaSketch, secuenciaContainer);
  }

  // Initial pause for non-active apps (grafema is active by default)
  if (verticeInstance) verticeInstance.noLoop();
  if (secuenciaInstance) secuenciaInstance.noLoop();

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
  
  // Listen to messages
  // Window event listeners are already connected locally since no iframe

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
        
        // Resume loop for the active p5 instance
        if (app === 'grafema' && grafemaInstance) grafemaInstance.loop();
        if (app === 'vertice' && verticeInstance) verticeInstance.loop();
        if (app === 'secuencia' && secuenciaInstance) secuenciaInstance.loop();
      }
    } else {
      if (btn) btn.classList.remove('active');
      if (view) {
        view.style.display = 'none';
        view.classList.remove('active');

        // Pause loop for inactive p5 instances
        if (app === 'grafema' && grafemaInstance) grafemaInstance.noLoop();
        if (app === 'vertice' && verticeInstance) verticeInstance.noLoop();
        if (app === 'secuencia' && secuenciaInstance) secuenciaInstance.noLoop();
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

  // Update Secuencia instance
  if (secuenciaInstance && typeof secuenciaInstance.applyTheme === 'function') {
    secuenciaInstance.applyTheme(currentTheme);
  } else {
    // Manually pass a message like the iframe expected
    const simulatedEvent = new MessageEvent('message', {
      data: { type: 'SYNC_THEME', theme: currentTheme }
    });
    window.dispatchEvent(simulatedEvent);
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
