export function createAppController(_p5, {
  env,
  Glyph,
  Corner,
  history,
  UIManager
}) {
  const document = window.document;
  function createInitialDemoScene() {
    const g = new Glyph();
    const c1 = new Corner({
      x: -150,
      y: -50
    }, 60, g);
    const c2 = new Corner({
      x: 150,
      y: 50
    }, 30, g);
    const c3 = new Corner({
      x: 0,
      y: 100
    }, 45, g);
    g.addCorner(c1);
    g.addCorner(c2);
    g.addCorner(c3);
    g.connectCorners(c1, c2);
    g.connectCorners(c2, c3);
    env.scene_glyphs.push(g);
    env.selected_corner = c1;
    c1.setActive(true);
  }
  function handleKeyDown(e) {
    const view = document.getElementById('app-vertice');
    if (!view || !view.classList.contains('active')) return;
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
    const key = e.key.toLowerCase();
    if (key === '1') {
      setAppMode('corner');
      e.preventDefault();
      return;
    }
    if (key === '2') {
      setAppMode('glyph');
      e.preventDefault();
      return;
    }
    if (key === '3') {
      setAppMode('scene');
      e.preventDefault();
      return;
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (env.activeMode === "corner" && env.selected_corner) deleteSelectedVertex();else if (env.activeMode === "glyph" && env.selected_glyph) deleteSelectedGlyph();else if (env.activeMode === "scene") appClearScene();
      e.preventDefault();
      return;
    }
    if (key === 'x' || key === 'ч') {
      env.pattern_visibility = !env.pattern_visibility;
      if (env.DOM.checkPatternVisible) env.DOM.checkPatternVisible.checked = env.pattern_visibility;
      UIManager.showSnackbar(`Grid Pattern: ${env.pattern_visibility ? "ON" : "OFF"}`);
      e.preventDefault();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'я') && !e.shiftKey) {
      e.preventDefault();
      appUndo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'я') && e.shiftKey) {
      e.preventDefault();
      appRedo();
      return;
    }
  }

  // --- UI ACTIONS ---

  // --- UI ACTIONS ---

  // --- HISTORY (UNDO / REDO) ---

  // --- EXPORT & PROJECT ---

  // --- THEME & UTILS ---
  function clearSelection() {
    env.selected_corner = null;
    env.selected_glyph = null;
    env.scene_glyphs.forEach(glyph => {
      glyph.setActive(false);
      glyph.corners.forEach(corner => corner.setActive(false));
    });
    env.firstCornerToConnect = null;
  }
  function setAppMode(mode, silent = false) {
    env.activeMode = mode;
    [env.DOM.btnModeCorner, env.DOM.btnModeGlyph, env.DOM.btnModeScene].forEach(btn => {
      if (btn) btn.classList.remove("active");
    });
    if (mode === "corner" && env.DOM.btnModeCorner) env.DOM.btnModeCorner.classList.add("active");
    if (mode === "glyph" && env.DOM.btnModeGlyph) env.DOM.btnModeGlyph.classList.add("active");
    if (mode === "scene" && env.DOM.btnModeScene) env.DOM.btnModeScene.classList.add("active");
    if (mode === "scene") clearSelection();
    if (!silent) UIManager.showSnackbar(`Mode: ${mode === "corner" ? "Vertices" : mode === "glyph" ? "Glyphs" : "Scene"}`);
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
  }
  function updateSelectedVertexFromUI() {
    if (!env.selected_corner) return;
    const nx = parseFloat(env.DOM.inputVertexX.value);
    const ny = parseFloat(env.DOM.inputVertexY.value);
    const nr = parseFloat(env.DOM.slideVertexRadius.value);
    if (!isNaN(nx)) env.selected_corner.center.x = nx;
    if (!isNaN(ny)) env.selected_corner.center.y = ny;
    env.selected_corner.radians = nr;
    if (env.DOM.valVertexRadius) env.DOM.valVertexRadius.innerText = Math.round(nr);
    UIManager.updateLayersUI();
  }
  function deleteSelectedVertex() {
    if (!env.selected_corner) return;
    const parentGlyph = env.selected_corner.glyph;
    parentGlyph.removeCorner(env.selected_corner);
    if (parentGlyph.corners.length === 0) {
      env.scene_glyphs = env.scene_glyphs.filter(g => g !== parentGlyph);
    }
    clearSelection();
    saveHistoryState();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
    UIManager.showSnackbar("Vertex deleted");
  }
  function disconnectSelectedVertex() {
    if (!env.selected_corner) return;
    const parentGlyph = env.selected_corner.glyph;
    const newGlyph = parentGlyph.spliceAtCorner(env.selected_corner);
    if (newGlyph) {
      env.scene_glyphs.push(newGlyph);
      UIManager.showSnackbar("Glyph split successfully");
    } else {
      UIManager.showSnackbar("To split, the vertex must have exactly 2 links!");
    }
    clearSelection();
    saveHistoryState();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
  }
  function deleteSelectedGlyph() {
    if (!env.selected_glyph) return;
    env.scene_glyphs = env.scene_glyphs.filter(g => g !== env.selected_glyph);
    clearSelection();
    saveHistoryState();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
    UIManager.showSnackbar("Glyph deleted");
  }
  function updatePatternFromUI() {
    env.pattern_xOffset = parseFloat(env.DOM.slidePatternXOffset.value);
    if (env.DOM.valPatternXOffset) env.DOM.valPatternXOffset.innerText = Math.round(env.pattern_xOffset);
    env.pattern_yOffset = parseFloat(env.DOM.slidePatternYOffset.value);
    if (env.DOM.valPatternYOffset) env.DOM.valPatternYOffset.innerText = Math.round(env.pattern_yOffset);
    const rotDeg = parseFloat(env.DOM.slidePatternRotation.value);
    env.pattern_rotation = _p5.radians(rotDeg);
    if (env.DOM.valPatternRotation) env.DOM.valPatternRotation.innerText = `${rotDeg}°`;
    env.pattern_alpha = parseFloat(env.DOM.slidePatternAlpha.value);
    if (env.DOM.valPatternAlpha) env.DOM.valPatternAlpha.innerText = Math.round(env.pattern_alpha);
  }

  // --- HISTORY (UNDO / REDO) ---

  // --- HISTORY (UNDO / REDO) ---

  function saveHistoryState() {
    const snapshot = env.scene_glyphs.map(g => g.serialize());
    history.save(snapshot);
    localStorage.setItem('vertice_autosave', JSON.stringify(snapshot));
  }
  function appUndo() {
    const snapshot = history.undo();
    if (!snapshot) {
      UIManager.showSnackbar("History is empty!");
      return;
    }
    env.scene_glyphs = snapshot.map(data => Glyph.deserialize(data));
    clearSelection();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
    UIManager.showSnackbar("Undo");
    _p5.redraw();
  }
  function appRedo() {
    const snapshot = history.redo();
    if (!snapshot) {
      UIManager.showSnackbar("Nothing to redo!");
      return;
    }
    env.scene_glyphs = snapshot.map(data => Glyph.deserialize(data));
    clearSelection();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
    UIManager.showSnackbar("Redo");
    _p5.redraw();
  }
  function appClearScene() {
    clearSelection();
    env.scene_glyphs = [];
    env.globalRotationValue = 0;
    if (env.DOM.slideGlobalRotation) env.DOM.slideGlobalRotation.value = 0;
    if (env.DOM.valGlobalRotation) env.DOM.valGlobalRotation.innerText = "0°";
    saveHistoryState();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
    UIManager.showSnackbar("Scene cleared");
  }

  // --- EXPORT & PROJECT ---

  // --- EXPORT & PROJECT ---

  function exportAsFormat(format) {
    const filename = env.DOM.exportFilename && env.DOM.exportFilename.value.trim() || "myGraphic";
    env.exportActive = true;
    if (format === "SVG") {
      env.exportSVGActive = true;
      // p5.svg doesn't natively support instance mode seamlessly in some older versions,
      // but assuming window global SVG or _p5.SVG exists:
      env.svgCanvas = _p5.createGraphics(_p5.width, _p5.height, _p5.SVG || _p5.window.SVG || 'svg');
      env.svgCanvas.background(env.backgroundColor);
      if (env.pattern_visibility) {
        const copiesX = 3,
          copiesY = 3;
        for (let x = -copiesX; x <= copiesX; x++) {
          for (let y = -copiesY; y <= copiesY; y++) {
            if (x === 0 && y === 0) continue;
            env.svgCanvas.push();
            const offset = _p5.createVector(x * env.pattern_xOffset, y * env.pattern_yOffset);
            offset.rotate(env.pattern_rotation);
            env.svgCanvas.translate(env.scene_center.x + offset.x, env.scene_center.y + offset.y);
            env.svgCanvas.scale(env.scene_scale);
            env.svgCanvas.rotate(env.scene_rotation);
            const c = _p5.color(env.shapeColor);
            c.setAlpha(env.pattern_alpha);
            const orig = env.shapeColor;
            env.shapeColor = c;
            env.scene_glyphs.forEach(glyph => env.GlyphRenderer.drawScene(glyph, env.shapeColor, env.strokeCapRounded, env.svgCanvas));
            env.shapeColor = orig;
            env.svgCanvas.pop();
          }
        }
      }
      env.svgCanvas.push();
      env.svgCanvas.translate(env.scene_center.x, env.scene_center.y);
      env.svgCanvas.scale(env.scene_scale);
      env.svgCanvas.rotate(env.scene_rotation);
      env.scene_glyphs.forEach(glyph => env.GlyphRenderer.drawScene(glyph, env.shapeColor, env.strokeCapRounded, env.svgCanvas));
      env.svgCanvas.pop();
      env.svgCanvas.save(`${filename}.svg`);
      env.exportSVGActive = false;
      env.svgCanvas = null;
      UIManager.showSnackbar("Vector SVG exported!");
    } else if (format === "PNG") {
      _p5.redraw();
      _p5.saveCanvas(`${filename}`, 'png');
      UIManager.showSnackbar("Raster PNG exported!");
    }
    env.exportActive = false;
  }

  // --- THEME & UTILS ---

  // --- INITIALIZATION ---

  function translateSelectedGlyph(dx, dy) {
    if (!env.selected_glyph) return;
    env.selected_glyph.translate(parseFloat(dx || 0), parseFloat(dy || 0));
    saveHistoryState();
    UIManager.updateLayersUI();
  }
  function scaleSelectedGlyph(factor) {
    if (!env.selected_glyph || env.selected_glyph.corners.length === 0) return;

    // Use the first corner of the glyph as the pivot point
    const pivot = env.selected_glyph.corners[0];
    env.selected_glyph.scale(factor, pivot);
    saveHistoryState();
  }
  function rotateSelectedGlyphFromUI(angleDegrees) {
    if (!env.selected_glyph || env.selected_glyph.corners.length === 0) return;
    const angle = _p5.radians(parseFloat(angleDegrees));
    const pivot = env.selected_glyph.corners[0];

    // Apply rotation as a delta from the previous slider value
    if (env.DOM.valGlyphRotation) env.DOM.valGlyphRotation.innerText = `${angleDegrees}°`;

    // Rotate incrementally from the glyph's pivot for smooth slider control
    env.selected_glyph.rotate(_p5.radians(angleDegrees - (env.selected_glyph.lastRotationSliderVal || 0)), pivot);
    env.selected_glyph.lastRotationSliderVal = angleDegrees;
  }
  function rotateAllGlyphsFromUI(angleDegrees) {
    const targetAngle = parseFloat(angleDegrees);
    const deltaDegrees = targetAngle - env.globalRotationValue;
    const deltaRad = _p5.radians(deltaDegrees);
    env.scene_glyphs.forEach(glyph => {
      if (glyph.corners.length > 0) {
        // Each glyph rotates around its own first corner (local center)
        const pivot = glyph.corners[0];
        glyph.rotate(deltaRad, pivot);
      }
    });
    env.globalRotationValue = targetAngle;
    if (env.DOM.valGlobalRotation) env.DOM.valGlobalRotation.innerText = `${targetAngle}°`;
  }
  function createNewGlyphFromUI() {
    const newGlyph = new Glyph();

    // Place the initial corner at the current visible center of the canvas
    const centerOfCanvas = _p5.createVector(_p5.width / 2 - env.scene_center.x, _p5.height / 2 - env.scene_center.y);
    centerOfCanvas.div(env.scene_scale);
    centerOfCanvas.rotate(-env.scene_rotation);
    const newCorner = new Corner(centerOfCanvas, 40, newGlyph);
    newGlyph.addCorner(newCorner);
    env.scene_glyphs.push(newGlyph);
    clearSelection();
    env.selected_glyph = newGlyph;
    env.selected_glyph.setActive(true);
    env.selected_corner = newCorner;
    env.selected_corner.setActive(true);
    setAppMode("corner"); // Switch to corner editing mode for the new glyph

    saveHistoryState();
    UIManager.updateUISidebarVisibility();
    UIManager.updateLayersUI();
    UIManager.showSnackbar("New glyph created at center");
  }
  function saveProjectJSON() {
    const filename = (env.DOM.exportFilename.value.trim() || "project") + ".json";
    const projectData = {
      version: "1.0",
      backgroundColor: env.backgroundColor,
      shapeColor: env.shapeColor,
      strokeCapRounded: env.strokeCapRounded,
      pattern: {
        visibility: env.pattern_visibility,
        alpha: env.pattern_alpha,
        xOffset: env.pattern_xOffset,
        yOffset: env.pattern_yOffset,
        rotation: env.pattern_rotation
      },
      glyphs: env.scene_glyphs.map(glyph => {
        // Save corners
        const cornersData = glyph.corners.map(corner => ({
          x: corner.center.x,
          y: corner.center.y,
          radians: corner.radians,
          scale: corner.scale
        }));

        // Save connection indices
        const connectionsData = [];
        glyph.connections.forEach((neighbors, corner) => {
          const cIndex = glyph.corners.indexOf(corner);
          const nIndices = neighbors.map(n => glyph.corners.indexOf(n));
          connectionsData.push({
            cornerIndex: cIndex,
            neighborIndices: nIndices
          });
        });
        return {
          corners: cornersData,
          connections: connectionsData
        };
      })
    };

    // Trigger file download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    UIManager.showSnackbar("Project saved!");
  }
  function loadProjectJSON() {
    document.getElementById("import-json-file").click();
  }
  function handleImportJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);

        // Restore global style settings
        if (data.backgroundColor) env.backgroundColor = data.backgroundColor;
        if (data.shapeColor) env.shapeColor = data.shapeColor;
        if (data.strokeCapRounded !== undefined) env.strokeCapRounded = data.strokeCapRounded;
        if (data.pattern) {
          env.pattern_visibility = data.pattern.visibility;
          env.pattern_alpha = data.pattern.alpha;
          env.pattern_xOffset = data.pattern.xOffset;
          env.pattern_yOffset = data.pattern.yOffset;
          env.pattern_rotation = data.pattern.rotation;
        }

        // Reconstruct glyphs
        const loadedGlyphs = [];
        data.glyphs.forEach(glyphData => {
          const glyph = new Glyph();

          // Reconstruct corners
          glyphData.corners.forEach(cData => {
            const corner = new Corner(_p5.createVector(cData.x, cData.y), cData.radians, glyph);
            corner.scale = cData.scale;
            glyph.addCorner(corner);
          });

          // Reconstruct connections
          glyphData.connections.forEach(conn => {
            const mainCorner = glyph.corners[conn.cornerIndex];
            conn.neighborIndices.forEach(nIndex => {
              const neighborCorner = glyph.corners[nIndex];
              // Connections are bidirectional — check before adding to avoid duplicates
              if (!glyph.isConnected(mainCorner, neighborCorner)) {
                glyph.connectCorners(mainCorner, neighborCorner);
              }
            });
          });
          loadedGlyphs.push(glyph);
        });

        // Replace the current scene
        env.scene_glyphs = loadedGlyphs;
        clearSelection();

        // Reset history to the newly loaded state
        history.clear();
        saveHistoryState();

        // Reset global rotation to 0 since a fresh scene is being imported
        env.globalRotationValue = 0;
        if (env.DOM.slideGlobalRotation) env.DOM.slideGlobalRotation.value = 0;
        if (env.DOM.valGlobalRotation) env.DOM.valGlobalRotation.innerText = "0°";

        // Sync UI elements
        UIManager.updateUIColors();
        updateColorsFromUI();
        UIManager.syncPatternToUI();
        if (env.DOM.checkPatternVisible) env.DOM.checkPatternVisible.checked = env.pattern_visibility;
        if (env.DOM.checkStrokeRounded) env.DOM.checkStrokeRounded.checked = env.strokeCapRounded;
        if (env.DOM.slidePatternAlpha) env.DOM.slidePatternAlpha.value = env.pattern_alpha;
        UIManager.updateUISidebarVisibility();
        UIManager.updateLayersUI();
        UIManager.showSnackbar("Project imported successfully!");
      } catch (err) {
        UIManager.showSnackbar("Error reading JSON project file!");
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Clear the input value so the same file can be loaded again
    event.target.value = "";
  }
  function handleBgImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      _p5.loadImage(dataUrl, img => {
        env.bgImage = img;

        // Show the remove button
        if (env.DOM.btnRemoveBgImage) env.DOM.btnRemoveBgImage.style.display = "block";
        UIManager.showSnackbar("Background image loaded successfully!");
        _p5.redraw();
      }, () => {
        UIManager.showSnackbar("Failed to load image!");
      });
    };
    reader.readAsDataURL(file);

    // Clear the input so the same file can be re-uploaded
    input.value = "";
  }
  function updateBgImageSettingsFromUI() {
    if (env.DOM.slideBgOpacity) {
      env.bgImageOpacity = parseFloat(env.DOM.slideBgOpacity.value);
      if (env.DOM.valBgOpacity) env.DOM.valBgOpacity.innerText = env.bgImageOpacity + "%";
    }
    if (env.DOM.slideBgScale) {
      env.bgImageScale = parseFloat(env.DOM.slideBgScale.value);
      if (env.DOM.valBgScale) env.DOM.valBgScale.innerText = env.bgImageScale + "%";
    }
    if (env.DOM.slideBgRotation) {
      env.bgImageRotation = parseFloat(env.DOM.slideBgRotation.value);
      if (env.DOM.valBgRotation) env.DOM.valBgRotation.innerText = env.bgImageRotation + "°";
    }
    if (env.DOM.inputBgX) {
      env.bgImageX = parseFloat(env.DOM.inputBgX.value) || 0;
    }
    if (env.DOM.inputBgY) {
      env.bgImageY = parseFloat(env.DOM.inputBgY.value) || 0;
    }
    _p5.redraw();
  }
  function removeBgImage() {
    env.bgImage = null;

    // Reset state values
    env.bgImageOpacity = 50;
    env.bgImageScale = 100;
    env.bgImageRotation = 0;
    env.bgImageX = 0;
    env.bgImageY = 0;

    // Sync UI
    if (env.DOM.slideBgOpacity) env.DOM.slideBgOpacity.value = 50;
    if (env.DOM.valBgOpacity) env.DOM.valBgOpacity.innerText = "50%";
    if (env.DOM.slideBgScale) env.DOM.slideBgScale.value = 100;
    if (env.DOM.valBgScale) env.DOM.valBgScale.innerText = "100%";
    if (env.DOM.slideBgRotation) env.DOM.slideBgRotation.value = 0;
    if (env.DOM.valBgRotation) env.DOM.valBgRotation.innerText = "0°";
    if (env.DOM.inputBgX) env.DOM.inputBgX.value = 0;
    if (env.DOM.inputBgY) env.DOM.inputBgY.value = 0;

    // Hide the remove button
    if (env.DOM.btnRemoveBgImage) env.DOM.btnRemoveBgImage.style.display = "none";
    UIManager.showSnackbar("Background image removed.");
    _p5.redraw();
  }
  function togglePatternVisible(visible) {
    env.pattern_visibility = visible;
  }
  function toggleStrokeCapRounded(rounded) {
    env.strokeCapRounded = rounded;
  }
  function updateColorsFromUI() {
    env.backgroundColor = env.DOM.pickerBgColor.value;
    env.shapeColor = env.DOM.pickerStrokeColor.value;

    // Force-update the canvas container background color
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.backgroundColor = env.backgroundColor;
    }
  }
  function setupEventListeners() {
    // Collapsible sections
    document.querySelectorAll('#app-vertice .panel-section h2.section-title').forEach(h => {
      h.addEventListener('click', () => h.closest('.panel-section').classList.toggle('collapsed'));
    });
    if (env.DOM.btnModeCorner) env.DOM.btnModeCorner.addEventListener('click', () => setAppMode('corner'));
    if (env.DOM.btnModeGlyph) env.DOM.btnModeGlyph.addEventListener('click', () => setAppMode('glyph'));
    if (env.DOM.btnModeScene) env.DOM.btnModeScene.addEventListener('click', () => setAppMode('scene'));

    // Vertex inputs
    if (env.DOM.inputVertexX) env.DOM.inputVertexX.addEventListener('input', updateSelectedVertexFromUI);
    if (env.DOM.inputVertexY) env.DOM.inputVertexY.addEventListener('input', updateSelectedVertexFromUI);
    if (env.DOM.slideVertexRadius) env.DOM.slideVertexRadius.addEventListener('input', updateSelectedVertexFromUI);
    const btnDelVert = document.getElementById("v-btn-delete-vertex");
    if (btnDelVert) btnDelVert.addEventListener('click', deleteSelectedVertex);
    const btnSplitVert = document.getElementById("v-btn-disconnect-vertex");
    if (btnSplitVert) btnSplitVert.addEventListener('click', disconnectSelectedVertex);

    // Pattern inputs
    if (env.DOM.checkPatternVisible) env.DOM.checkPatternVisible.addEventListener('change', e => togglePatternVisible(e.target.checked));
    if (env.DOM.slidePatternXOffset) env.DOM.slidePatternXOffset.addEventListener('input', updatePatternFromUI);
    if (env.DOM.slidePatternYOffset) env.DOM.slidePatternYOffset.addEventListener('input', updatePatternFromUI);
    if (env.DOM.slidePatternRotation) env.DOM.slidePatternRotation.addEventListener('input', updatePatternFromUI);
    if (env.DOM.slidePatternAlpha) env.DOM.slidePatternAlpha.addEventListener('input', updatePatternFromUI);

    // Style inputs
    if (env.DOM.checkStrokeRounded) env.DOM.checkStrokeRounded.addEventListener('change', e => {
      env.strokeCapRounded = e.target.checked;
    });
    if (env.DOM.pickerBgColor) env.DOM.pickerBgColor.addEventListener('input', () => {
      env.backgroundColor = env.DOM.pickerBgColor.value;
      if (env.DOM.labelBg) env.DOM.labelBg.innerText = env.backgroundColor.toUpperCase();
    });
    if (env.DOM.pickerStrokeColor) env.DOM.pickerStrokeColor.addEventListener('input', () => {
      env.shapeColor = env.DOM.pickerStrokeColor.value;
      if (env.DOM.labelStroke) env.DOM.labelStroke.innerText = env.shapeColor.toUpperCase();
    });

    // Top menu
    document.getElementById("v-btn-export-svg")?.addEventListener('click', () => exportAsFormat("SVG"));
    document.getElementById("v-btn-export-png")?.addEventListener('click', () => exportAsFormat("PNG"));
    document.getElementById("v-btn-reset")?.addEventListener('click', () => {
      if (confirm("Reset scene?")) appClearScene();
    });

    // Keyboard
    window.addEventListener('keydown', handleKeyDown);
  }

  // Expose UI functions to global window for inline HTML handlers

  return {
    createInitialDemoScene,
    handleKeyDown,
    clearSelection,
    setAppMode,
    updateSelectedVertexFromUI,
    deleteSelectedVertex,
    disconnectSelectedVertex,
    deleteSelectedGlyph,
    updatePatternFromUI,
    saveHistoryState,
    appUndo,
    appRedo,
    appClearScene,
    exportAsFormat,
    translateSelectedGlyph,
    scaleSelectedGlyph,
    rotateSelectedGlyphFromUI,
    rotateAllGlyphsFromUI,
    createNewGlyphFromUI,
    saveProjectJSON,
    loadProjectJSON,
    handleImportJSON,
    handleBgImageUpload,
    updateBgImageSettingsFromUI,
    removeBgImage,
    togglePatternVisible,
    toggleStrokeCapRounded,
    updateColorsFromUI,
    setupEventListeners
  };
}