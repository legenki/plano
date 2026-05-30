import { RasterPoint } from './RasterPoint.js';
import { HistoryManager } from '../../js/HistoryManager.js';

export function reticulaSketch(p) {
  let bgColor;
  let lines = [];
  let imgDrawing;
  let rasterPoints = [];
  let gridXElements;
  let gridYElements;
  
  const state = {
    gridSize: 75,
    gridElementColor: null,
    brushColor: null,
    magicNr: 0.553,
    activeMode: 'brush',
    // Brush
    brushSize: 75,              // stroke weight of the drawing brush
    brushAngle: 0,              // flat brush angle in degrees (0 = horizontal)
    strokeWeight: 2,            // stroke weight of grid elements
    // Shape
    shapeType: 'metaball',      // metaball | circle | rect | cross | custom
    customShapePath: '',        // SVG path string, use 's' as half-size token
    // Mask behaviour
    sizeMapping: 'fixed',       // fixed | brightness | inverse
    strokeFill: 'fill',         // fill | stroke | both
    densityThreshold: 50,       // 0–100
    // Grid
    gridType: 'rect',           // rect | hex | brick | diagonal | radial
    dropout: 0,                 // 0–80 % — random point removal
  };

  const history = new HistoryManager(50);

  let canvasContainer;
  let lastX = null;
  let lastY = null;

  p.setup = () => {
    canvasContainer = document.getElementById('reticula-canvas');
    if (!canvasContainer) return;
    
    let w = canvasContainer.clientWidth;
    let h = canvasContainer.clientHeight;
    // Fallback if hidden during initialization
    if (w === 0 || h === 0) {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    
    p.createCanvas(w, h);
    p.pixelDensity(2);
    
    bgColor = p.color('#ffffff');
    state.gridElementColor = p.color('#000000');
    state.brushColor = p.color('#000000');
    
    p.imageMode(p.CENTER);
    reset();
    loadState();
    history.save([...lines]); // initial snapshot after load
    bindUI();
  };

  p.draw = () => {
    display();
  };

  p.windowResized = () => {
    if (!canvasContainer) return;
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;
    if (w > 0 && h > 0) {
      p.resizeCanvas(w, h);
      resizeImages();
      p.redraw();
      saveState();
    }
  };

  function display() {
    // Draw imgDrawing onto canvas so updateRasterPoints can sample it via p.get()
    p.image(imgDrawing, p.width / 2, p.height / 2);
    updateRasterPoints();
    // Now clear and redraw with the background + raster shapes on top
    p.background(bgColor);
    displayRasterPoints();
  }

  p.mousePressed = (e) => {
    if (isMouseValid(e)) {
      // Save snapshot before starting a new stroke
      history.save([...lines]);
      lastX = p.mouseX;
      lastY = p.mouseY;
      drawImg(p.mouseX, p.mouseY, p.mouseX, p.mouseY);
      p.redraw();
      saveState();
    } else {
      lastX = null;
      lastY = null;
    }
  };

  p.mouseDragged = (e) => {
    if (isMouseValid(e)) {
      const prevX = lastX ?? p.mouseX;
      const prevY = lastY ?? p.mouseY;
      drawImg(p.mouseX, p.mouseY, prevX, prevY);
      lastX = p.mouseX;
      lastY = p.mouseY;
      p.redraw();
      saveState();
    }
  };

  p.mouseReleased = () => {
    lastX = null;
    lastY = null;
  };

  function isMouseValid(e) {
    if (!document.getElementById('app-reticula').classList.contains('active')) return false;
    let evt = e || window.event;
    if (evt && evt.target && evt.target.tagName !== "CANVAS") return false;
    if (!evt) {
        // Fallback for missing event object in p5
        const hovered = document.elementFromPoint(p.mouseX + (p.canvas.getBoundingClientRect().left || 0), p.mouseY + (p.canvas.getBoundingClientRect().top || 0));
        if (hovered && hovered.tagName !== "CANVAS") return false;
    }
    const sidebar = document.querySelector('#app-reticula .sidebar');
    if (sidebar && p.mouseX > p.width - sidebar.clientWidth) return false;
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return false;
    return true;
  }

  function drawImg(x, y, px, py) {
    const col = state.activeMode === 'brush' ? 255 : 0;
    const brushAngleRad = (state.brushAngle ?? 0) * Math.PI / 180;
    const w = state.brushSize;
    const h = Math.max(2, w * 0.15); // flat brush thickness

    imgDrawing.noStroke();
    imgDrawing.fill(col);
    imgDrawing.rectMode(imgDrawing.CENTER);

    // Stamp flat rect at end point
    imgDrawing.push();
    imgDrawing.translate(x, y);
    imgDrawing.rotate(brushAngleRad);
    imgDrawing.rect(0, 0, w, h);
    imgDrawing.pop();

    // Fill the gap between prev and current point with interpolated stamps
    const dx = x - px;
    const dy = y - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(dist / (h * 0.5)); // overlap stamps to avoid gaps
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const ix = px + dx * t;
      const iy = py + dy * t;
      imgDrawing.push();
      imgDrawing.translate(ix, iy);
      imgDrawing.rotate(brushAngleRad);
      imgDrawing.rect(0, 0, w, h);
      imgDrawing.pop();
    }
    
    lines.push({
      mode: state.activeMode,
      x1: px,
      y1: py,
      x2: x,
      y2: y,
      strokeWeight: state.gridSize
    });
  }

  function restoreLines(snapshot) {
    lines = [...snapshot];
    imgDrawing.background(0);
    for (const line of lines) {
      imgDrawing.noStroke();
      imgDrawing.fill(line.mode === 'brush' ? 255 : 0);
      imgDrawing.rectMode(imgDrawing.CENTER);
      const brushAngleRad = (state.brushAngle ?? 0) * Math.PI / 180;
      const w = line.strokeWeight;
      const h = Math.max(2, w * 0.15);
      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(dist / (h * 0.5)));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const ix = line.x1 + dx * t;
        const iy = line.y1 + dy * t;
        imgDrawing.push();
        imgDrawing.translate(ix, iy);
        imgDrawing.rotate(brushAngleRad);
        imgDrawing.rect(0, 0, w, h);
        imgDrawing.pop();
      }
    }
    p.redraw();
    saveState();
  }

  function handleUndo() {
    const snapshot = history.undo();
    if (snapshot) restoreLines(snapshot);
  }

  function handleRedo() {
    const snapshot = history.redo();
    if (snapshot) restoreLines(snapshot);
  }

  function setGridSize(val) {
    state.gridSize = val;
    createRasterPoints();
  }

  function createRasterPoints() {
    rasterPoints = [];
    const gridType  = state.gridType      ?? 'rect';
    const gs        = state.gridSize;
    const cx        = p.width  / 2;
    const cy        = p.height / 2;
    const dropout   = (state.dropout ?? 0) / 100;

    // Helper: push a point (with dropout)
    function addPoint(x, y) {
      if (dropout > 0 && p.random() < dropout) return;
      rasterPoints.push(new RasterPoint(p, x, y, state));
    }

    if (gridType === 'radial') {
      // Concentric rings
      const maxR = Math.sqrt(cx ** 2 + cy ** 2) + gs;
      const rings = Math.ceil(maxR / gs);
      // Center point
      addPoint(cx, cy);
      for (let ring = 1; ring <= rings; ring++) {
        const r = ring * gs;
        const circumference = 2 * Math.PI * r;
        const count = Math.max(6, Math.round(circumference / gs));
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          addPoint(
            cx + Math.cos(angle) * r,
            cy + Math.sin(angle) * r
          );
        }
      }
      gridXElements = 1;
      gridYElements = rasterPoints.length;

    } else {
      // All grid types that use rows × cols
      const rowHeight = gridType === 'hex'
        ? gs * (Math.sqrt(3) / 2)
        : gs;

      gridXElements = p.floor(p.width  / gs) + 4;
      gridYElements = p.floor(p.height / rowHeight) + 4;

      // Extra margin for rotated grids
      const margin = gridType === 'rect' || gridType === 'brick' || gridType === 'hex' ? 0 : 2;

      const xOrigin = (p.width  - gs        * gridXElements) / 2 + gs        / 2;
      const yOrigin = (p.height - rowHeight * gridYElements) / 2 + rowHeight / 2;

      for (let xi = -margin; xi < gridXElements + margin; xi++) {
        for (let yi = -margin; yi < gridYElements + margin; yi++) {
          let xPos = xi * gs        + xOrigin;
          let yPos = yi * rowHeight + yOrigin;

          // Diagonal: shift every column down by half a cell
          if (gridType === 'diagonal' && xi % 2 === 1) {
            yPos += gs / 2;
          }

          // Hex / brick: offset odd rows
          if ((gridType === 'hex' || gridType === 'brick') && yi % 2 === 1) {
            xPos += gs / 2;
          }

          addPoint(xPos, yPos);
        }
      }
    }
  }

  function updateRasterPoints() {
    let tempScreen = p.get(0, 0, p.width, p.height);
    tempScreen.resize(p.int(p.width / state.gridSize) * 4, p.int(p.height / state.gridSize) * 4);
    let factor = p.width / tempScreen.width;
    for (const pt of rasterPoints) {
      pt.update(tempScreen, factor);
    }
  }

  function displayRasterPoints() {
    for (const pt of rasterPoints) {
      pt.display();
    }
  }

  function reset() {
    imgDrawing = null;
    resizeImages();
    lines = [];
    history.clear();
    history.save([]);
    p.redraw();
    saveState();
  }

  function resizeImages() {
    if (imgDrawing) {
      let imgDrawingTemp = p.createGraphics(p.width, p.height);
      let factor;
      if (p.width > imgDrawing.width || p.height > imgDrawing.height) {
        factor = p.max([(p.width/imgDrawing.width), (p.height/imgDrawing.height)]);
      } else {
        factor = p.min([(p.width/imgDrawing.width), (p.height/imgDrawing.height)]);
      }
      
      imgDrawingTemp.background(0); // Mask background is always black
      imgDrawingTemp.imageMode(p.CENTER);
      imgDrawingTemp.image(imgDrawing, imgDrawingTemp.width/2, imgDrawingTemp.height/2, imgDrawing.width*factor, imgDrawing.height*factor);
      imgDrawingTemp.imageMode(p.CORNER);
      imgDrawing = imgDrawingTemp;
    } else {
      imgDrawing = p.createGraphics(p.width, p.height);
      imgDrawing.background(0);
    }
    createRasterPoints();
  }

  function saveState() {
    // Debounce save
    if (saveState.timeout) clearTimeout(saveState.timeout);
    saveState.timeout = setTimeout(() => {
      const data = {
        state: {
          gridSize: state.gridSize,
          gridElementColor: state.gridElementColor ? state.gridElementColor.toString() : '#000000',
          brushColor: state.brushColor ? state.brushColor.toString() : '#000000',
          bgColor: bgColor ? bgColor.toString() : '#ffffff',
          brushSize: state.brushSize,
          brushAngle: state.brushAngle,
          strokeWeight: state.strokeWeight,
          shapeType: state.shapeType,
          customShapePath: state.customShapePath,
          sizeMapping: state.sizeMapping,
          strokeFill: state.strokeFill,
          densityThreshold: state.densityThreshold,
          gridType: state.gridType,
          dropout: state.dropout,
        },
        lines: lines
      };
      localStorage.setItem('reticula_autosave', JSON.stringify(data));
    }, 500);
  }

  function loadState() {
    const saved = localStorage.getItem('reticula_autosave');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.state) {
          state.gridSize          = data.state.gridSize          ?? 75;
          state.brushSize         = data.state.brushSize         ?? 75;
          state.brushAngle        = data.state.brushAngle        ?? 0;
          state.strokeWeight      = data.state.strokeWeight      ?? 2;
          state.shapeType         = data.state.shapeType         ?? 'metaball';
          state.customShapePath   = data.state.customShapePath   ?? '';
          state.sizeMapping       = data.state.sizeMapping       ?? 'fixed';
          state.strokeFill        = data.state.strokeFill        ?? 'fill';
          state.densityThreshold  = data.state.densityThreshold  ?? 50;
          state.gridType          = data.state.gridType          ?? 'rect';
          state.dropout           = data.state.dropout           ?? 0;
          state.gridElementColor  = p.color(data.state.gridElementColor || '#000000');
          state.brushColor        = p.color(data.state.brushColor       || '#000000');
          bgColor                 = p.color(data.state.bgColor          || '#ffffff');

          // Sync UI controls
          const sync = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
          const syncText = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
          sync('r-color-bg',             data.state.bgColor    || '#ffffff');
          sync('r-color-brush',          data.state.brushColor || '#000000');
          sync('r-input-grid-size-num',  state.gridSize);
          sync('r-slide-grid-size',      state.gridSize);
          sync('r-input-brush-size-num',      state.brushSize);
          sync('r-slide-brush-size',          state.brushSize);
          sync('r-input-brush-angle-num',     state.brushAngle);
          sync('r-slide-brush-angle',         state.brushAngle);
          sync('r-input-stroke-weight-num',   state.strokeWeight);
          sync('r-slide-stroke-weight',       state.strokeWeight);
          sync('r-select-shape',            state.shapeType);
          const pathEl = document.getElementById('r-custom-shape-path');
          if (pathEl) pathEl.value = state.customShapePath;
          const customRow = document.getElementById('r-custom-shape-row');
          if (customRow) customRow.style.display = state.shapeType === 'custom' ? 'block' : 'none';
          sync('r-select-size-mapping',     state.sizeMapping);
          sync('r-select-stroke-fill',      state.strokeFill);
          sync('r-input-threshold-num',  state.densityThreshold);
          sync('r-slide-threshold',      state.densityThreshold);
          sync('r-select-grid-type',        state.gridType);
          sync('r-input-dropout-num',       state.dropout);
          sync('r-slide-dropout',           state.dropout);
          syncText('r-label-bg',    (data.state.bgColor    || '#ffffff').toUpperCase());
          syncText('r-label-brush', (data.state.brushColor || '#000000').toUpperCase());
        }
        
        if (data.lines && Array.isArray(data.lines)) {
          lines = data.lines;
          // Re-draw all lines on imgDrawing
          if (imgDrawing) {
            imgDrawing.background(0);
            for (const line of lines) {
              if (line.mode === 'brush') {
                imgDrawing.stroke(255);
              } else {
                imgDrawing.stroke(0);
              }
              imgDrawing.strokeWeight(line.strokeWeight || state.gridSize);
              imgDrawing.noFill();
              imgDrawing.line(line.x2, line.y2, line.x1, line.y1);
            }
          }
        }
      } catch (e) {
        console.error("Auto-save load failed:", e);
      }
    }
  }

  p.applyTheme = function (theme) {
    if (theme === 'dark') {
      bgColor = p.color('#1e1e1e');
      state.gridElementColor = p.color('#ffffff');
      state.brushColor = p.color('#ffffff');
    } else {
      bgColor = p.color('#ffffff');
      state.gridElementColor = p.color('#000000');
      state.brushColor = p.color('#000000');
    }
    
    const bgPicker = document.getElementById('r-color-bg');
    const brushPicker = document.getElementById('r-color-brush');
    if (bgPicker) bgPicker.value = theme === 'dark' ? '#1e1e1e' : '#ffffff';
    if (brushPicker) brushPicker.value = theme === 'dark' ? '#ffffff' : '#000000';
    
    const bgLabel = document.getElementById('r-label-bg');
    const brushLabel = document.getElementById('r-label-brush');
    if (bgLabel) bgLabel.innerText = bgPicker.value.toUpperCase();
    if (brushLabel) brushLabel.innerText = brushPicker.value.toUpperCase();

    p.redraw();
    saveState();
  };

  // Save functions
  function savePNG() {
    let filename = "RETICULA_" + p.year() + '-' + p.month() + '-' + p.day() + '_' + p.hour() + '-' + p.minute() + '-' + p.second() + ".png";
    display();
    p.saveCanvas(filename, 'png');
  }

  function saveSVG() {
    displayRasterPoints();
    let svgContent = `<svg width="${p.width}" height="${p.height}" xmlns="http://www.w3.org/2000/svg" shape-rendering="auto">\n`;

    // Background rect to match visual output
    svgContent += `  <rect x="0" y="0" width="${p.width}" height="${p.height}" fill="${bgColor.toString()}" />\n`;

    const sw = state.strokeWeight ?? 2;
    for (const point of rasterPoints) {
      const posX = point.position.x;
      const posY = point.position.y;
      const s    = point.elementSize;
      const mn   = state.magicNr;

      if (!Array.isArray(point.shapes)) continue;
      for (const shape of point.shapes) {
        const rot       = shape.rotation ?? 0;
        const transform = `transform="translate(${posX}, ${posY}) rotate(${rot})"`;
        const fillColor = state.gridElementColor.toString();
        const strokeFill = state.strokeFill ?? 'fill';
        const fill   = strokeFill !== 'stroke' ? `fill="${fillColor}"` : 'fill="none"';
        const stroke = strokeFill !== 'fill'   ? `stroke="${fillColor}" stroke-width="${sw}"` : 'stroke="none"';

        if (shape.type === 'rect') {
          svgContent += `  <rect x="0" y="0" width="${s}" height="${s}" ${fill} ${stroke} ${transform} />\n`;
        } else if (shape.type === 'curve') {
          svgContent += `  <path d="M0,0 L${s},0 C${s},${s*mn} ${s*mn},${s} 0,${s} Z" ${fill} ${stroke} ${transform} />\n`;
        } else if (shape.type === 'curve2') {
          svgContent += `  <path d="M${s},0 C${s},${s*mn} ${s*mn},${s} 0,${s} L${s},${s} Z" ${fill} ${stroke} ${transform} />\n`;
        } else if (shape.type === 'circle') {
          svgContent += `  <circle cx="0" cy="0" r="${s}" ${fill} ${stroke} ${transform} />\n`;
        } else if (shape.type === 'rect-simple') {
          svgContent += `  <rect x="${-s}" y="${-s}" width="${s*2}" height="${s*2}" ${fill} ${stroke} ${transform} />\n`;
        } else if (shape.type === 'cross') {
          const w = s * 0.35;
          svgContent += `  <rect x="${-s}" y="${-w}" width="${s*2}" height="${w*2}" ${fill} ${stroke} ${transform} />\n`;
          svgContent += `  <rect x="${-w}" y="${-s}" width="${w*2}" height="${s*2}" ${fill} ${stroke} ${transform} />\n`;
        } else if (shape.type === 'custom' && shape.d) {
          svgContent += `  <path d="${shape.d}" ${fill} ${stroke} ${transform} />\n`;
        }
      }
    }
    svgContent += `</svg>`;
    let blob = new Blob([svgContent], { type: "image/svg+xml" });
    let url = URL.createObjectURL(blob);
    let filename = "RETICULA_" + p.year() + '-' + p.month() + '-' + p.day() + '_' + p.hour() + '-' + p.minute() + '-' + p.second() + ".svg";
    let link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // --- UI Binding ---
  function bindUI() {
    const modeTabs = document.querySelectorAll('#r-mode-tabs .switcher-tab');
    if (modeTabs) {
      modeTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          modeTabs.forEach(t => t.classList.remove('active'));
          e.target.classList.add('active');
          state.activeMode = e.target.dataset.mode;
        });
      });
    }

    const bgPicker = document.getElementById('r-color-bg');
    const bgLabel = document.getElementById('r-label-bg');
    if (bgPicker) bgPicker.addEventListener('input', (e) => {
      bgColor = p.color(e.target.value);
      if (bgLabel) bgLabel.innerText = e.target.value.toUpperCase();
      p.redraw();
      saveState();
    });

    const brushPicker = document.getElementById('r-color-brush');
    const brushLabel = document.getElementById('r-label-brush');
    if (brushPicker) brushPicker.addEventListener('input', (e) => {
      state.brushColor = p.color(e.target.value);
      state.gridElementColor = p.color(e.target.value);
      if (brushLabel) brushLabel.innerText = e.target.value.toUpperCase();
      p.redraw();
      saveState();
    });

    const gridSizeNum = document.getElementById('r-input-grid-size-num');
    const gridSizeSlide = document.getElementById('r-slide-grid-size');
    if (gridSizeNum && gridSizeSlide) {
      gridSizeNum.addEventListener('input', (e) => {
        gridSizeSlide.value = e.target.value;
        setGridSize(parseInt(e.target.value));
        p.redraw();
        saveState();
      });
      gridSizeSlide.addEventListener('input', (e) => {
        gridSizeNum.value = e.target.value;
        setGridSize(parseInt(e.target.value));
        p.redraw();
        saveState();
      });
    }

    // --- Brush size ---
    const brushSizeNum   = document.getElementById('r-input-brush-size-num');
    const brushSizeSlide = document.getElementById('r-slide-brush-size');
    if (brushSizeNum && brushSizeSlide) {
      brushSizeNum.addEventListener('input', (e) => {
        brushSizeSlide.value = e.target.value;
        state.brushSize = parseInt(e.target.value);
        saveState();
      });
      brushSizeSlide.addEventListener('input', (e) => {
        brushSizeNum.value = e.target.value;
        state.brushSize = parseInt(e.target.value);
        saveState();
      });
    }

    // --- Brush angle ---
    const brushAngleNum   = document.getElementById('r-input-brush-angle-num');
    const brushAngleSlide = document.getElementById('r-slide-brush-angle');
    if (brushAngleNum && brushAngleSlide) {
      brushAngleNum.addEventListener('input', (e) => {
        brushAngleSlide.value = e.target.value;
        state.brushAngle = parseInt(e.target.value);
        saveState();
      });
      brushAngleSlide.addEventListener('input', (e) => {
        brushAngleNum.value = e.target.value;
        state.brushAngle = parseInt(e.target.value);
        saveState();
      });
    }

    // --- Stroke weight ---
    const strokeWeightNum   = document.getElementById('r-input-stroke-weight-num');
    const strokeWeightSlide = document.getElementById('r-slide-stroke-weight');
    if (strokeWeightNum && strokeWeightSlide) {
      strokeWeightNum.addEventListener('input', (e) => {
        strokeWeightSlide.value = e.target.value;
        state.strokeWeight = parseFloat(e.target.value);
        p.redraw(); saveState();
      });
      strokeWeightSlide.addEventListener('input', (e) => {
        strokeWeightNum.value = e.target.value;
        state.strokeWeight = parseFloat(e.target.value);
        p.redraw(); saveState();
      });
    }

    // --- Shape ---
    const customShapeRow = document.getElementById('r-custom-shape-row');
    const shapeSelect = document.getElementById('r-select-shape');
    if (shapeSelect) shapeSelect.addEventListener('change', (e) => {
      state.shapeType = e.target.value;
      if (customShapeRow) customShapeRow.style.display = e.target.value === 'custom' ? 'block' : 'none';
      p.redraw(); saveState();
    });

    // --- Custom SVG path ---
    const customPathInput = document.getElementById('r-custom-shape-path');
    if (customPathInput) customPathInput.addEventListener('input', (e) => {
      state.customShapePath = e.target.value;
      p.redraw(); saveState();
    });

    // --- Size mapping ---
    const sizeMappingSelect = document.getElementById('r-select-size-mapping');
    if (sizeMappingSelect) sizeMappingSelect.addEventListener('change', (e) => {
      state.sizeMapping = e.target.value;
      p.redraw(); saveState();
    });

    // --- Stroke / Fill ---
    const strokeFillSelect = document.getElementById('r-select-stroke-fill');
    if (strokeFillSelect) strokeFillSelect.addEventListener('change', (e) => {
      state.strokeFill = e.target.value;
      p.redraw(); saveState();
    });

    // --- Density threshold ---
    const thresholdNum   = document.getElementById('r-input-threshold-num');
    const thresholdSlide = document.getElementById('r-slide-threshold');
    if (thresholdNum && thresholdSlide) {
      thresholdNum.addEventListener('input', (e) => {
        thresholdSlide.value = e.target.value;
        state.densityThreshold = parseInt(e.target.value);
        p.redraw(); saveState();
      });
      thresholdSlide.addEventListener('input', (e) => {
        thresholdNum.value = e.target.value;
        state.densityThreshold = parseInt(e.target.value);
        p.redraw(); saveState();
      });
    }

    // --- Grid type ---
    const gridTypeSelect = document.getElementById('r-select-grid-type');
    if (gridTypeSelect) gridTypeSelect.addEventListener('change', (e) => {
      state.gridType = e.target.value;
      createRasterPoints();
      p.redraw(); saveState();
    });

    // --- Dropout ---
    const dropoutNum   = document.getElementById('r-input-dropout-num');
    const dropoutSlide = document.getElementById('r-slide-dropout');
    if (dropoutNum && dropoutSlide) {
      dropoutNum.addEventListener('input', (e) => {
        dropoutSlide.value = e.target.value;
        state.dropout = parseFloat(e.target.value);
        createRasterPoints(); p.redraw(); saveState();
      });
      dropoutSlide.addEventListener('input', (e) => {
        dropoutNum.value = e.target.value;
        state.dropout = parseFloat(e.target.value);
        createRasterPoints(); p.redraw(); saveState();
      });
    }

    const btnReset = document.getElementById('r-btn-reset');
    if (btnReset) btnReset.addEventListener('click', () => {
      reset();
    });

    const btnSavePng = document.getElementById('r-btn-save-png');
    if (btnSavePng) btnSavePng.addEventListener('click', () => {
      savePNG();
    });

    const btnSaveSvg = document.getElementById('r-btn-save-svg');
    if (btnSaveSvg) btnSaveSvg.addEventListener('click', () => {
      saveSVG();
    });

    // --- Undo / Redo ---
    document.addEventListener('keydown', (e) => {
      if (!document.getElementById('app-reticula').classList.contains('active')) return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    });
  }
}
