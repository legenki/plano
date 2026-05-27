export function createUIManager(_p5) {
  function updateInterface_glyphEditorTools_state() {
  
    const editPathModeElement = document.getElementById("editPathMode");
    const editAnchorModeElement = document.getElementById("editAnchorMode");
    const editHandleModeElement = document.getElementById("editHandleMode");
    const drawPathModeElement = document.getElementById("drawPathMode");
  
    if (!editPathModeElement || !editAnchorModeElement || !editHandleModeElement || !drawPathModeElement) {
      return;
    }
  
    resetState(editPathModeElement);
    resetState(editAnchorModeElement);
    resetState(editHandleModeElement);
    resetState(drawPathModeElement);
  
    switch (_p5.env.glyphEditor.mode) {
      case 'editPath':
        setActive(editPathModeElement);
        break;
      case 'editAnchor':
        setActive(editAnchorModeElement);
        break;
      case 'editHandle':
        setActive(editHandleModeElement);
        break;
      case 'drawPath':
        setActive(drawPathModeElement);
        break;
    }
  }
  
  function updateInterface_glyphEditorContext_state() {
  
    const glyphEditorContextElement = document.getElementById("glyphEditorContext");
    const glyphEditorContextMainPathElement = document.getElementById("glyphEditorContextMainPath");
  
    // update state
    if (_p5.env.glyphEditor.contextMenu == true) {
  
      setDisplay(glyphEditorContextElement);
      glyphEditorContextElement.style.left = _p5.mouseX + 'px';
      glyphEditorContextElement.style.top = _p5.mouseY + 'px';
  
      if (_p5.env.glyphEditor.mode != 'drawPath') {
  
        const connectionToPrevElement = document.getElementById("connectionToPrev");
        const connectionToNextElement = document.getElementById("connectionToNext");
  
        if (_p5.env.glyphEditor.activePath.connectionToPrev == true) {
          setActive(connectionToPrevElement);
        } else {
          resetState(connectionToPrevElement);
        }
  
        if (_p5.env.glyphEditor.activePath.connectionToNext == true) {
          setActive(connectionToNextElement);
        } else {
          resetState(connectionToNextElement);
        }
  
        if(_p5.env.glyphEditor.activePath.index != 0) {
          setDisplay(glyphEditorContextMainPathElement);
        } else {
          setHidden(glyphEditorContextMainPathElement);
        }
  
      }
  
    } else {
      setHidden(glyphEditorContextElement);
    }
  }
  
  function updateInterface_glyphSet_boxes() {
    _p5.env.glyphSetElement.setAttribute("role", "listbox");
    _p5.env.glyphSetElement.setAttribute("aria-live", "polite");
  
    _p5.env.diffAndUpdateDOM(
      _p5.env.glyphSetElement,
      _p5.env.activeScript.glyphs,
      (glyph, idx) => {
        const box = document.createElement('div');
        box.className = 'glyphSet_box';
        box.setAttribute("role", "option");
        box.tabIndex = 0; // Make focusable
        
        const label = document.createElement('label');
        box.appendChild(label);
        
        box.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            _p5.env.setGlyph(box.id);
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (box.nextElementSibling) box.nextElementSibling.focus();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (box.previousElementSibling) box.previousElementSibling.focus();
          }
        });
        
        box.addEventListener('click', () => _p5.env.setGlyph(box.id));
        if (_p5.env.developerMode == true) {
          box.addEventListener('dblclick', () => showPrompt('setGlyphNamePrompt'));
        }
        return box;
      },
      (box, glyph, idx) => {
        const name = glyph.name;
        const char = (name.length > 1 && name.match(/\?/)) ? _p5.env.glyphSet_missingLink : name; 
        
        box.id = name;
        box.querySelector('label').textContent = char;
        box.setAttribute('aria-selected', _p5.env.glyphEditor && _p5.env.glyphEditor.activeGlyph === glyph);
      }
    );
  
    // update box fit
    const glyphSet_boxObjects = document.querySelectorAll('.glyphSet_box');
    if (glyphSet_boxObjects.length > 0) {
      const firstBox = glyphSet_boxObjects[0];
      const firstBoxRect = firstBox.getBoundingClientRect();
      let prevBox = null;
      let maxBottom = 0;
  
      glyphSet_boxObjects.forEach((box) => {
  
        if (prevBox != null) {
  
          const boxRect = box.getBoundingClientRect();
          const prevBoxRect = prevBox.getBoundingClientRect();
          maxBottom = Math.max(maxBottom, boxRect.bottom);
  
          if (boxRect.top > prevBoxRect.top) {
            prevBox.classList.add('glyphSet_last-box-in-_p5.line');
            box.classList.add('glyphSet_first-box-in-_p5.line');
          } else {
            prevBox.classList.remove('glyphSet_last-box-in-_p5.line');
            box.classList.remove('glyphSet_first-box-in-_p5.line')
          }
  
          if (boxRect.top == firstBoxRect.top) {
            box.classList.add('glyphSet_first-row-boxes');
          } else {
            box.classList.remove('glyphSet_first-row-boxes')
          }
        }
  
        prevBox = box;
      });
  
      glyphSet_boxObjects.forEach((box) => {
        const boxRect = box.getBoundingClientRect();
        if (boxRect.bottom == maxBottom) {
          box.classList.add('glyphSet_last-row-boxes');
        } else {
          box.classList.remove('glyphSet_last-row-boxes');
        }
      });
  
      firstBox.classList.add('glyphSet_first-box-in-_p5.line');
      firstBox.classList.add('glyphSet_first-row-boxes');
    }
  
    // update current state
    updateInterface_glyphSet_state();
  }
  
  function updateInterface_glyphSet_state() {
    const glyphSet_boxObjects = document.querySelectorAll('.glyphSet_box');
  
    if (glyphSet_boxObjects.length > 0) {
      glyphSet_boxObjects.forEach((box) => {
        let character = box.id;
        let glyph = _p5.env.activeScript.getGlyph(character);
        if (glyph == _p5.env.glyphEditor.activeGlyph) {
          setActive(box);
        } else if (glyph.paths.length == 0) {
          if (document.getElementById("textInput").value.includes(glyph.name)) {
            setMissing(box);
          } else {
            setEmpty(box);
          }
        } else {
          resetState(box);
        }
      });
    }
  }
  
  function updateInterface_scriptName() {
    const scriptNameElement = document.getElementById("scriptName");
    document.getElementById("scriptName").value = _p5.env.activeScript.name;
  }
  
  function updateInterface_scriptList_label() {
    const scriptListElement = document.getElementById("scriptList");
    if (!scriptListElement) return;
    
    scriptListElement.setAttribute("role", "listbox");
  
    _p5.env.diffAndUpdateDOM(
      scriptListElement,
      _p5.env.scripts,
      (script, index) => {
        const li = document.createElement('li');
        li.setAttribute("role", "option");
        li.tabIndex = 0; // Make focusable
        
        li.addEventListener('click', () => _p5.env.setScript(index));
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            _p5.env.setScript(index);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (li.nextElementSibling) li.nextElementSibling.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (li.previousElementSibling) li.previousElementSibling.focus();
          }
        });
        return li;
      },
      (li, script, index) => {
        li.textContent = script.name;
        li.setAttribute('aria-selected', index === _p5.env.activeScriptIndex);
      }
    );
   
    updateInterface_scriptList_state();
  }
  
  function updateInterface_scriptList_state() {
  
    const scriptList_elements = document.getElementById('scriptList').getElementsByTagName('li');
  
    // Convert to array and use forEach
    Array.from(scriptList_elements).forEach((element, index) => {
  
      if (index == _p5.env.activeScriptIndex) {
        setActive(element);
      } else {
        resetState(element);
      }
    });
  }
  
  function updateInterface_textBoxTools_state() {
    const textBoxDisplayInfoHideElement = document.getElementById("textBoxDisplayInfoHide");
    const textBoxDisplayInfoShowElement = document.getElementById("textBoxDisplayInfoShow");
  
    if (!textBoxDisplayInfoHideElement || !textBoxDisplayInfoShowElement) {
      return;
    }
  
    if(_p5.env.textBox.displayInfo == true) {
      setHidden(textBoxDisplayInfoShowElement);
      setDisplay(textBoxDisplayInfoHideElement);
    } else {
      setHidden(textBoxDisplayInfoHideElement);
      setDisplay(textBoxDisplayInfoShowElement);
    }
  
  }
  
  function updateInterface_textBoxSettings_state() {
    document.getElementById("textInput").value = _p5.env.arrayToText(_p5.env.textBox.textLines);
    
    // Sliders (0..100 _p5.map)
    document.getElementById("_p5.env.size").value = _p5.map(_p5.env.size, _p5.env.sizeMin, _p5.env.sizeMax, 0, 100);
    document.getElementById("_p5.env.scriptStrokeWeight").value = _p5.map(_p5.env.scriptStrokeWeight, _p5.env.scriptStrokeWeightMin, _p5.env.scriptStrokeWeightMax, 0, 100);
    document.getElementById("_p5.env.wordSpace").value = _p5.map(_p5.env.wordSpace, _p5.env.wordSpaceMin, _p5.env.wordSpaceMax, 0, 100);
    document.getElementById("_p5.env.letterSpace").value = _p5.map(_p5.env.letterSpace, _p5.env.letterSpaceMin, _p5.env.letterSpaceMax, 0, 100);
    document.getElementById("_p5.env.lineHeight").value = _p5.map(_p5.env.lineHeight, _p5.env.lineHeightMin, _p5.env.lineHeightMax, 0, 100);
    document.getElementById("_p5.env.letterWidth").value = _p5.map(_p5.env.letterWidth, _p5.env.letterWidthMin, _p5.env.letterWidthMax, 0, 100);
    document.getElementById("_p5.env.letterHeight").value = _p5.map(_p5.env.letterHeight, _p5.env.letterHeightMin, _p5.env.letterHeightMax, 0, 100);
    document.getElementById("_p5.env.slant").value = _p5.map(_p5.env.slant, _p5.env.slantMin, _p5.env.slantMax, 0, 100);
    
    document.getElementById("_p5.env.randomSize").value = _p5.map(_p5.env.randomSize, _p5.env.randomSizeMin, _p5.env.randomSizeMax, 0, 100);
    document.getElementById("_p5.env.randomLetterSpace").value = _p5.map(_p5.env.randomLetterSpace, _p5.env.randomLetterSpaceMin, _p5.env.randomLetterSpaceMax, 0, 100);
    document.getElementById("_p5.env.randomLetterWidth").value = _p5.map(_p5.env.randomLetterWidth, _p5.env.randomLetterWidthMin, _p5.env.randomLetterWidthMax, 0, 100);
    document.getElementById("_p5.env.randomLetterHeight").value = _p5.map(_p5.env.randomLetterHeight, _p5.env.randomLetterHeightMin, _p5.env.randomLetterHeightMax, 0, 100);
    document.getElementById("_p5.env.randomSlant").value = _p5.map(_p5.env.randomSlant, _p5.env.randomSlantMin, _p5.env.randomSlantMax, 0, 100);
    document.getElementById("_p5.env.randomBaselineOffset").value = _p5.map(_p5.env.randomBaselineOffset, _p5.env.randomBaselineOffsetMin, _p5.env.randomBaselineOffsetMax, 0, 100);
    document.getElementById("_p5.env.precision").value = _p5.map(_p5.env.precision, _p5.env.precisionMin, _p5.env.precisionMax, 0, 100);
    
    if (document.getElementById("_p5.env.rotateAll")) {
      document.getElementById("_p5.env.rotateAll").value = _p5.env.rotateAll;
    }
  
    // Sync Numeric Inputs
    document.getElementById("sizeNum").value = Math.round(_p5.env.size);
    document.getElementById("lineHeightNum").value = Math.round(_p5.env.lineHeight);
    document.getElementById("scriptStrokeWeightNum").value = parseFloat(_p5.env.scriptStrokeWeight.toFixed(1));
    document.getElementById("wordSpaceNum").value = Math.round((_p5.env.wordSpace + 1) * 100);
    document.getElementById("letterSpaceNum").value = Math.round((_p5.env.letterSpace + 1) * 100);
    document.getElementById("letterWidthNum").value = Math.round(_p5.env.letterWidth * 100);
    document.getElementById("letterHeightNum").value = Math.round(_p5.env.letterHeight * 100);
    document.getElementById("slantNum").value = Math.round(_p5.env.slant * 45); // convert to _p5.degrees approximately
  
    document.getElementById("randomSizeNum").value = Math.round(_p5.env.randomSize);
    document.getElementById("randomLetterSpaceNum").value = Math.round(_p5.env.randomLetterSpace * 100);
    document.getElementById("randomLetterWidthNum").value = Math.round(_p5.env.randomLetterWidth * 100);
    document.getElementById("randomLetterHeightNum").value = Math.round(_p5.env.randomLetterHeight * 100);
    document.getElementById("randomSlantNum").value = Math.round(_p5.env.randomSlant * 100);
    document.getElementById("randomBaselineOffsetNum").value = Math.round(_p5.env.randomBaselineOffset * 100);
    document.getElementById("precisionNum").value = Math.round(_p5.env.precision);
    
    if (document.getElementById("rotateAllNum")) {
      document.getElementById("rotateAllNum").value = _p5.env.rotateAll;
    }
  
    // Update Color Pickers
    if (document.getElementById("bgColorPicker") && typeof _p5.env.backgroundColor !== 'undefined') {
      let hex = _p5.env.colorToHex(_p5.env.backgroundColor);
      document.getElementById("bgColorPicker").value = hex;
      let lbl = document.getElementById('label-bg');
      if (lbl) lbl.innerText = hex.toUpperCase();
    }
    if (document.getElementById("textColorPicker") && typeof _p5.env.scriptColor !== 'undefined') {
      let hex = _p5.env.colorToHex(_p5.env.scriptColor);
      document.getElementById("textColorPicker").value = hex;
      let lbl = document.getElementById('label-text');
      if (lbl) lbl.innerText = hex.toUpperCase();
    }
  }
  
  function updateInterface_textBoxSettings_label() {
    // Legacy labels replaced by secuencia inputs, keep empty to avoid breaking calls
  }
  
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  
  function setHidden(element) {
    if (!element.dataset.originalDisplay) {
      element.dataset.originalDisplay = getComputedStyle(element).display;
    }
    // Store child styles
    element.querySelectorAll('*').forEach((child) => {
      if (!child.dataset.originalDisplay) {
        child.dataset.originalDisplay = getComputedStyle(child).display;
      }
    });
    element.style.display = 'none';
  }
  
  function setDisplay(element) {
    const originalDisplay = element.dataset.originalDisplay || 'block';
    element.style.display = originalDisplay;
    // Restore child styles
    element.querySelectorAll('*').forEach((child) => {
      if (child.dataset.originalDisplay) {
        child.style.display = child.dataset.originalDisplay;
      }
    });
  }
  
  function setActive(element) {
    // reset state and add active state
    resetState(element);
    element.classList.add('active');
  }
  
  
  function setEmpty(element) {
    // reset state and add empty state
    resetState(element);
    element.classList.add('empty');
  }
  
  function setMissing(element) {
    // reset state and add missing state
    resetState(element);
    element.classList.add('missing');
  }
  
  function resetState(element) {
    // reset to basic state by removing all additional states
    element.classList.remove('active', 'empty', 'missing');
  }
  
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  
  function showPrompt(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'flex';
      updateFileName();
    } else {
      console.warn(`showPrompt: Element with id "${id}" not found.`);
    }
  }
  
  function closePrompt(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    } else {
      console.warn(`closePrompt: Element with id "${id}" not found.`);
    }
  }
  
  function updateFileName() {
    document.getElementById('exportScriptFileName').value = _p5.env.activeScript.name;
    document.getElementById('exportTextBoxSettingsFileName').value = _p5.env.textBoxSettingsFileName;
    document.getElementById('exportGraphicFileName').value = _p5.env.graphicFileName;
  }
  
  function toggleDropDown(id) {
    const dropdownElement = document.getElementById(id);
    dropdownElement.classList.toggle('show');
  }
  
  function setHover(state, id) {
    let isHovering = state;
  
    // Automatisches Schließen, wenn der Cursor den Button und die Liste verlässt
    if (!isHovering) {
      setTimeout(() => {
        if (!isHovering) {
  
          const element = document.getElementById(id);
  
          element.classList.remove('show');
        }
      }, 0); // Kurzer Timeout, um ungewolltes Schließen zu verhindern
    }
  }
  
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  
  return {
    updateInterface_glyphEditorTools_state,
    updateInterface_glyphEditorContext_state,
    updateInterface_glyphSet_boxes,
    updateInterface_glyphSet_state,
    updateInterface_scriptName,
    updateInterface_scriptList_label,
    updateInterface_scriptList_state,
    updateInterface_textBoxTools_state,
    updateInterface_textBoxSettings_state,
    updateInterface_textBoxSettings_label,
    setHidden,
    setDisplay,
    setActive,
    setEmpty,
    setMissing,
    resetState,
    showPrompt,
    closePrompt,
    updateFileName,
    toggleDropDown,
    setHover,
  };
}