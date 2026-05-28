export function createAppController(_p5, {
  env,
  Glyph,
  history,
  UIManager
}) {
  const document = window.document;

  // --- GLYPHS & LAYERS MANAGEMENT ---

  // --- HISTORY (UNDO / REDO) ---

  // --- THEME ---
  function addGlyph(x, y) {
    const g = new Glyph(x, y);
    env.glyphs.push(g);
    setActiveGlyph(g);
    UIManager.updateLayersList();
    saveHistoryState();
  }
  function deleteGlyph(index) {
    if (env.glyphs.length === 0) return;
    env.glyphs.splice(index, 1);
    if (env.glyphs.length > 0) {
      setActiveGlyph(env.glyphs[env.glyphs.length - 1]);
    } else {
      setActiveGlyph(null);
    }
    UIManager.updateLayersList();
    saveHistoryState();
  }
  function duplicateGlyph() {
    if (env.activeGlyph === null) return;
    const offset = 40;
    const clone = new Glyph(env.activeGlyph.position.x + offset, env.activeGlyph.position.y + offset);
    clone.rotation = env.activeGlyph.rotation;
    clone.size = env.activeGlyph.size;
    clone.par1 = env.activeGlyph.par1;
    clone.par2 = env.activeGlyph.par2;
    clone.par3 = env.activeGlyph.par3;
    clone.par4 = env.activeGlyph.par4;
    const ch = getGlyphChar(env.activeGlyph);
    clone.setLetter(ch);
    env.glyphs.push(clone);
    setActiveGlyph(clone);
    UIManager.updateLayersList();
    saveHistoryState();
  }
  function setActiveGlyph(glyph) {
    if (glyph === null) {
      if (env.activeGlyph !== null) {
        env.activeGlyph.active = false;
        env.activeGlyph.focus = false;
      }
      env.activeGlyph = null;
      if (env.DOM.noActiveGlyphMessage) env.DOM.noActiveGlyphMessage.classList.remove('hidden');
      if (env.DOM.activeGlyphControls) env.DOM.activeGlyphControls.classList.add('hidden');
      if (env.DOM.statsActiveLetter) env.DOM.statsActiveLetter.innerText = 'Active: None';
    } else {
      env.glyphs.forEach(g => {
        g.active = false;
        g.focus = false;
      });
      env.activeGlyph = glyph;
      env.activeGlyph.active = true;
      if (env.DOM.noActiveGlyphMessage) env.DOM.noActiveGlyphMessage.classList.add('hidden');
      if (env.DOM.activeGlyphControls) env.DOM.activeGlyphControls.classList.remove('hidden');
      if (env.DOM.statsActiveLetter) env.DOM.statsActiveLetter.innerText = `Active: ${getGlyphChar(glyph)}`;
      UIManager.syncSidebarInputs();
    }
    UIManager.updateLayersActiveState();
  }
  function resetCanvas() {
    env.glyphs = [];
    env.activeGlyph = null;
    env.glyphWeight = env.GLYPH_WEIGHT_DEFAULT;
    if (env.DOM.glyphWeight) env.DOM.glyphWeight.value = env.glyphWeight;
    if (env.DOM.glyphWeightNum) env.DOM.glyphWeightNum.value = env.glyphWeight;
    addGlyph(_p5.width / 2, _p5.height / 2);
    UIManager.updateLayersList();
    history.clear();
    saveHistoryState();
  }
  function getGlyphChar(glyph) {
    if (!glyph) return 'A';
    return glyph.myLetterChar || 'A';
  }

  // --- HISTORY (UNDO / REDO) ---

  // --- HISTORY (UNDO / REDO) ---

  function saveHistoryState() {
    const snapshot = env.glyphs.map(g => g.serialize());
    history.save(snapshot);
    localStorage.setItem('grafema_autosave', JSON.stringify(snapshot));
  }
  function appUndo() {
    const snapshot = history.undo();
    if (!snapshot) {
      UIManager.showSnackbar("History is empty!");
      return;
    }
    env.glyphs = snapshot.map(data => Glyph.deserialize(data));
    env.activeGlyph = null;
    setActiveGlyph(null);
    UIManager.updateLayersList();
    UIManager.showSnackbar("Undo");
    _p5.redraw();
  }
  function appRedo() {
    const snapshot = history.redo();
    if (!snapshot) {
      UIManager.showSnackbar("Nothing to redo!");
      return;
    }
    env.glyphs = snapshot.map(data => Glyph.deserialize(data));
    env.activeGlyph = null;
    setActiveGlyph(null);
    UIManager.updateLayersList();
    UIManager.showSnackbar("Redo");
    _p5.redraw();
  }

  // --- THEME ---

  // --- BACKGROUND REFERENCE IMAGE ---

  // --- INTERFACE BUILD ---

  // --- DOM CACHE ---

  // --- EVENT LISTENERS ---
  function handleBgImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      _p5.loadImage(e.target.result, img => {
        env.bgImage = img;
        if (env.DOM.btnRemoveBgImage) env.DOM.btnRemoveBgImage.style.display = 'block';
        UIManager.showSnackbar("Background image loaded successfully");
      }, () => {
        UIManager.showSnackbar("Failed to load image");
      });
    };
    reader.readAsDataURL(file);
  }
  function removeBgImage() {
    env.bgImage = null;
    if (env.DOM.inputBgImage) env.DOM.inputBgImage.value = '';
    if (env.DOM.btnRemoveBgImage) env.DOM.btnRemoveBgImage.style.display = 'none';
    UIManager.showSnackbar("Background image removed");
  }
  function updateBgImageSettingsFromUI() {
    env.bgImageOpacity = parseFloat(env.DOM.slideBgOpacity.value);
    const valOpEl = document.getElementById('g-val-bg-opacity');
    if (valOpEl) valOpEl.innerText = `${env.bgImageOpacity}%`;
    env.bgImageScale = parseFloat(env.DOM.slideBgScale.value);
    const valScEl = document.getElementById('g-val-bg-scale');
    if (valScEl) valScEl.innerText = `${env.bgImageScale}%`;
    env.bgImageRotation = parseFloat(env.DOM.slideBgRotation.value);
    const valRotEl = document.getElementById('g-val-bg-rotation');
    if (valRotEl) valRotEl.innerText = `${env.bgImageRotation}°`;
    env.bgImageX = parseFloat(env.DOM.inputBgX.value) || 0;
    env.bgImageY = parseFloat(env.DOM.inputBgY.value) || 0;
  }

  // --- INTERFACE BUILD ---

  // --- EVENT LISTENERS ---

  function setupEventListeners() {
    // Collapsible sections
    document.querySelectorAll('#app-grafema .panel-section h2.section-title').forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.panel-section').classList.toggle('collapsed');
      });
    });

    // Glyph parameter inputs — helper to bind slider + number input pairs
    function bindParamPair(slider, numInput, getter, setter, min, max, scale) {
      if (slider) slider.addEventListener('input', e => {
        if (env.activeGlyph !== null) {
          setter(parseFloat(e.target.value));
          if (numInput) numInput.value = Math.round(getter() * (scale || 1));
        }
      });
      if (numInput) numInput.addEventListener('input', e => {
        if (env.activeGlyph !== null) {
          let val = parseFloat(e.target.value);
          if (!isNaN(val)) {
            val = _p5.constrain(val, min, max);
            setter(scale ? val / scale : val);
            if (slider) slider.value = scale ? val / scale : val;
          }
        }
      });
    }
    bindParamPair(env.DOM.size, env.DOM.sizeNum, () => env.activeGlyph.size, v => {
      env.activeGlyph.size = v;
    }, 100, 500, 1);
    bindParamPair(env.DOM.rotation, env.DOM.rotationNum, () => env.activeGlyph.rotation, v => {
      env.activeGlyph.rotation = v;
    }, 0, 360, 1);
    bindParamPair(env.DOM.posX, env.DOM.posXNum, () => env.activeGlyph.position.x, v => {
      env.activeGlyph.position.x = v;
    }, 0, 5000, 1);
    bindParamPair(env.DOM.posY, env.DOM.posYNum, () => env.activeGlyph.position.y, v => {
      env.activeGlyph.position.y = v;
    }, 0, 5000, 1);
    bindParamPair(env.DOM.par1, env.DOM.par1Num, () => env.activeGlyph.par1, v => {
      env.activeGlyph.par1 = v;
    }, 0, 100, 100);
    bindParamPair(env.DOM.par2, env.DOM.par2Num, () => env.activeGlyph.par2, v => {
      env.activeGlyph.par2 = v;
    }, 0, 100, 100);
    bindParamPair(env.DOM.par3, env.DOM.par3Num, () => env.activeGlyph.par3, v => {
      env.activeGlyph.par3 = v;
    }, 0, 100, 100);
    bindParamPair(env.DOM.par4, env.DOM.par4Num, () => env.activeGlyph.par4, v => {
      env.activeGlyph.par4 = v;
    }, 0, 100, 100);

    // Glyph weight
    bindParamPair(env.DOM.glyphWeight, env.DOM.glyphWeightNum, () => env.glyphWeight, v => {
      env.glyphWeight = v;
    }, 1, 50, 1);

    // Grid toggle
    if (env.DOM.toggleGrid) env.DOM.toggleGrid.addEventListener('change', e => {
      env.interactionState.showGrid = e.target.checked;
    });

    // Color pickers
    if (env.DOM.colorBg) env.DOM.colorBg.addEventListener('input', e => {
      env.bgColor = _p5.color(e.target.value);
      if (env.DOM.labelBg) env.DOM.labelBg.innerText = e.target.value.toUpperCase();
    });
    if (env.DOM.colorText) env.DOM.colorText.addEventListener('input', e => {
      env.textColor = _p5.color(e.target.value);
      if (env.DOM.labelText) env.DOM.labelText.innerText = e.target.value.toUpperCase();
    });

    // Sidebar action buttons
    if (env.DOM.btnAddGlyph) env.DOM.btnAddGlyph.addEventListener('click', () => addGlyph(_p5.width / 2, _p5.height / 2));
    if (env.DOM.btnDuplicateGlyph) env.DOM.btnDuplicateGlyph.addEventListener('click', duplicateGlyph);
    if (env.DOM.btnDeleteGlyph) env.DOM.btnDeleteGlyph.addEventListener('click', () => {
      if (env.activeGlyph !== null) deleteGlyph(env.glyphs.indexOf(env.activeGlyph));
    });
    if (env.DOM.btnSave) env.DOM.btnSave.addEventListener('click', () => {
      const tempActive = env.activeGlyph;
      setActiveGlyph(null);
      _p5.redraw();
      const filename = `TouchType_${_p5.year()}-${_p5.month()}-${_p5.day()}_${_p5.hour()}-${_p5.minute()}-${_p5.second()}.png`;
      _p5.saveCanvas(filename, 'png');
      setActiveGlyph(tempActive);
      UIManager.showSnackbar("Canvas exported as PNG");
    });
    if (env.DOM.btnReset) env.DOM.btnReset.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the entire composition?')) {
        resetCanvas();
        UIManager.showSnackbar("Composition reset");
      }
    });
    if (env.DOM.btnHelp) env.DOM.btnHelp.addEventListener('click', UIManager.toggleHelpModal);
    if (env.DOM.btnCloseModal) env.DOM.btnCloseModal.addEventListener('click', UIManager.toggleHelpModal);

    // Background image controls
    if (env.DOM.inputBgImage) env.DOM.inputBgImage.addEventListener('change', e => handleBgImageUpload(e.target));
    if (env.DOM.btnRemoveBgImage) env.DOM.btnRemoveBgImage.addEventListener('click', removeBgImage);
    if (env.DOM.slideBgOpacity) env.DOM.slideBgOpacity.addEventListener('input', updateBgImageSettingsFromUI);
    if (env.DOM.slideBgScale) env.DOM.slideBgScale.addEventListener('input', updateBgImageSettingsFromUI);
    if (env.DOM.slideBgRotation) env.DOM.slideBgRotation.addEventListener('input', updateBgImageSettingsFromUI);
    if (env.DOM.inputBgX) env.DOM.inputBgX.addEventListener('input', updateBgImageSettingsFromUI);
    if (env.DOM.inputBgY) env.DOM.inputBgY.addEventListener('input', updateBgImageSettingsFromUI);

    // Keyboard shortcuts (scoped to window, but check active app)
    window.addEventListener('keydown', handleKeyDown);
  }
  function handleKeyDown(e) {
    // Only handle if Grafema app is visible
    const grafemaView = document.getElementById('app-grafema');
    if (!grafemaView || !grafemaView.classList.contains('active')) return;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT' || document.activeElement.tagName === 'TEXTAREA') return;
    const key = e.key.toUpperCase();

    // Undo (Ctrl/Cmd+Z)
    if ((e.ctrlKey || e.metaKey) && key === 'Z' && !e.shiftKey) {
      e.preventDefault();
      appUndo();
      return;
    }
    // Redo (Ctrl/Cmd+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && key === 'Z' && e.shiftKey) {
      e.preventDefault();
      appRedo();
      return;
    }

    // Quick character assignment (A-Z / .)
    if (env.activeGlyph !== null && key.length === 1 && (key >= 'A' && key <= 'Z' || key === '.')) {
      env.activeGlyph.setLetter(key);
      UIManager.syncSidebarInputs();
      UIManager.updateLayersList();
      saveHistoryState();
      e.preventDefault();
      return;
    }

    // Arrow key nudges
    if (env.activeGlyph !== null) {
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp') {
        env.activeGlyph.position.y -= step;
        UIManager.syncSidebarInputs();
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        env.activeGlyph.position.y += step;
        UIManager.syncSidebarInputs();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        env.activeGlyph.position.x -= step;
        UIManager.syncSidebarInputs();
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        env.activeGlyph.position.x += step;
        UIManager.syncSidebarInputs();
        e.preventDefault();
      }
    }

    // Delete
    if ((e.key === 'Delete' || e.key === 'Backspace') && env.activeGlyph !== null) {
      deleteGlyph(env.glyphs.indexOf(env.activeGlyph));
      e.preventDefault();
    }

    // Duplicate (Ctrl+D)
    if (key === 'D' && (e.ctrlKey || e.metaKey)) {
      if (env.activeGlyph !== null) {
        duplicateGlyph();
        e.preventDefault();
      }
    }

    // Deselect on Escape
    if (e.key === 'Escape') {
      setActiveGlyph(null);
      e.preventDefault();
    }

    // Create glyph on Spacebar
    if (e.key === ' ') {
      addGlyph(_p5.width / 2, _p5.height / 2);
      e.preventDefault();
    }

    // Toggle help modal
    if (e.key === '?') {
      UIManager.toggleHelpModal();
      e.preventDefault();
    }
  }
  return {
    addGlyph,
    deleteGlyph,
    duplicateGlyph,
    setActiveGlyph,
    resetCanvas,
    getGlyphChar,
    saveHistoryState,
    appUndo,
    appRedo,
    handleBgImageUpload,
    removeBgImage,
    updateBgImageSettingsFromUI,
    setupEventListeners,
    handleKeyDown
  };
}