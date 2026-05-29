import { RasterPoint } from './RasterPoint.js';

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
    activeMode: 'brush'
  };

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
    }
  };

  function display() {
    p.image(imgDrawing, p.width/2, p.height/2);
    updateRasterPoints();
    p.background(bgColor);
    displayRasterPoints();
  }

  p.mousePressed = (e) => {
    if (isMouseValid(e)) {
      lastX = p.mouseX;
      lastY = p.mouseY;
      drawImg(p.mouseX, p.mouseY, p.mouseX, p.mouseY);
      p.redraw();
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
    if (state.activeMode === 'brush') {
      imgDrawing.stroke(255); // White for binary mask (draws shapes)
    } else {
      imgDrawing.stroke(0);   // Black for binary mask (erases shapes)
    }
    imgDrawing.strokeWeight(state.gridSize);
    imgDrawing.noFill();
    imgDrawing.line(x, y, px, py);
    
    // We only push to lines for brush mode. If we export SVG later we may ignore eraser logic, 
    // but right now lines array is disabled in SVG so we just keep it for consistency.
    if (state.activeMode === 'brush') {
      lines.push({
        x1: px,
        y1: py,
        x2: x,
        y2: y,
        stroke: state.brushColor.toString(),
        strokeWeight: state.gridSize
      });
    }
  }

  function setGridSize(val) {
    state.gridSize = val;
    createRasterPoints();
  }

  function createRasterPoints() {
    rasterPoints = [];
    gridXElements = p.floor(p.width / state.gridSize) + 2;
    gridYElements = p.floor(p.height / state.gridSize) + 2;
    for (let x = 0; x < gridXElements; x++) {
      rasterPoints[x] = [];
      for (let y = 0; y < gridYElements; y++) {
        let xPos = x * state.gridSize + ((p.width - (state.gridSize * gridXElements)) / 2) + (state.gridSize / 2);
        let yPos = y * state.gridSize + ((p.height - (state.gridSize * gridYElements)) / 2) + (state.gridSize / 2);
        rasterPoints[x][y] = new RasterPoint(p, xPos, yPos, state);
      }
    }
  }

  function updateRasterPoints() {
    let tempScreen = p.get(0, 0, p.width, p.height);
    tempScreen.resize(p.int(p.width / state.gridSize) * 4, (p.height / state.gridSize) * 4);
    let factor = p.width / tempScreen.width;

    for (let x = 0; x < gridXElements; x++) {
      for (let y = 0; y < gridYElements; y++) {
        rasterPoints[x][y].update(tempScreen, factor);
      }
    }
  }

  function displayRasterPoints() {
    for (let x = 0; x < gridXElements; x++) {
      for (let y = 0; y < gridYElements; y++) {
        rasterPoints[x][y].display();
      }
    }
  }

  function reset() {
    imgDrawing = null;
    resizeImages();
    lines = [];
    p.redraw();
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

    for (let x = 0; x < gridXElements; x++) {
      for (let y = 0; y < gridYElements; y++) {
        let point = rasterPoints[x][y];
        let posX = point.position.x;
        let posY = point.position.y;
        let elementSize = point.elementSize;

        if (Array.isArray(point.shapes)) {
          for (let shape of point.shapes) {
            let rotation = shape.rotation;
            let transform = `transform="translate(${posX}, ${posY}) rotate(${rotation})"`;
            let fillColor = state.gridElementColor.toString();

            if (shape.type === "rect") {
              svgContent += `  <rect x="0" y="0" width="${elementSize}" height="${elementSize}" fill="${fillColor}" stroke="${fillColor}" stroke-width="2" ${transform} />\n`;
            } else if (shape.type === "curve") {
              svgContent += `  <path d="M0,0 L${elementSize},0 C${elementSize},${elementSize * state.magicNr} ${elementSize * state.magicNr},${elementSize} 0,${elementSize} Z" fill="${fillColor}" stroke="${fillColor}" stroke-width="2" ${transform} />\n`;
            } else if (shape.type === "curve2") {
              svgContent += `  <path d="M${elementSize},0 C${elementSize},${elementSize * state.magicNr} ${elementSize * state.magicNr},${elementSize} 0,${elementSize} L${elementSize},${elementSize} Z" fill="${fillColor}" stroke="${fillColor}" stroke-width="2" ${transform} />\n`;
            }
          }
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
    });

    const brushPicker = document.getElementById('r-color-brush');
    const brushLabel = document.getElementById('r-label-brush');
    if (brushPicker) brushPicker.addEventListener('input', (e) => {
      state.brushColor = p.color(e.target.value);
      state.gridElementColor = p.color(e.target.value);
      if (brushLabel) brushLabel.innerText = e.target.value.toUpperCase();
      p.redraw();
    });

    const gridSizeNum = document.getElementById('r-input-grid-size-num');
    const gridSizeSlide = document.getElementById('r-slide-grid-size');
    if (gridSizeNum && gridSizeSlide) {
      gridSizeNum.addEventListener('input', (e) => {
        gridSizeSlide.value = e.target.value;
        setGridSize(parseInt(e.target.value));
        p.redraw();
      });
      gridSizeSlide.addEventListener('input', (e) => {
        gridSizeNum.value = e.target.value;
        setGridSize(parseInt(e.target.value));
        p.redraw();
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
  }
}
