// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function setupCanvas() {

  secuenciaCanvas = createCanvas(canvasWidth, canvasHeight, P2D);
  this.canvas.id = 'secuencia';
  updateCanvas_dimensions();
}

function windowResized() {
  updateCanvas_dimensions();
}

function updateCanvas_dimensions() {
  // canvasWidth = windowWidth;
  // canvasHeight = windowHeight;
  canvasWidth = document.body.getBoundingClientRect().width;
  canvasHeight = document.body.getBoundingClientRect().height;

  updateCanvas_layout();
  resizeCanvas(canvasWidth, canvasHeight);
  pixelDensity(2);
}

function updateCanvas_layout() {

  // set height of glyph editor based on canvas height
  glyphEditor_height = round(min(glyphEditor_heightMax, canvasHeight * 0.6) / 100) * 100;
  glyphEditor_height = constrain(glyphEditor_height, glyphEditor_heightMin, glyphEditor_heightMax);

  // set dimensios of container
  document.documentElement.style.setProperty('--toolbar_buttonSize', toolbar_buttonSize + 'px');
  document.documentElement.style.setProperty('--textBoxSettings_width', textBoxSettings_width + 'px');
  document.documentElement.style.setProperty('--glyphEditor_width', glyphEditor_width + 'px');
  document.documentElement.style.setProperty('--glyphEditor_height', glyphEditor_height + 'px');
  document.documentElement.style.setProperty('--logo_size', textBoxSettings_width * 0.66 + 'px');

  // rearrange glyphSetBoxes based on glyphset dimensions
  let glyphSet_boxesPerRow = round(glyphEditor_width / glyphSet_boxSize);
  let glyphSet_boxSizeFit = (glyphEditor_width / glyphSet_boxesPerRow) + ((glyphSet_boxesPerRow - 1) * 0.1);
  document.documentElement.style.setProperty('--glyphSet_boxSize', glyphSet_boxSizeFit + 'px');

  // reposition glyphEditor
  if (glyphEditor != null) {
    let glyphEditor_xPosition = glyphEditorElement.getBoundingClientRect().left;
    let glyphEditor_yPosition = glyphEditorElement.getBoundingClientRect().top;
    glyphEditor.setDimensions(glyphEditor_xPosition, glyphEditor_yPosition, glyphEditor_width, glyphEditor_height);
  }

  // reposition textBox
  let textBox_xPosition = glyphEditor_width + (interfaceMargin * 2);
  let textBox_yPosition = interfaceMargin;
  let textBox_width = canvasWidth - glyphEditor_width - textBoxSettings_width - interfaceMargin * 4;
  let textBox_height = canvasHeight - interfaceMargin * 2;
  if (textBox != null) {
    textBox.setDimensions(textBox_xPosition, textBox_yPosition, textBox_width, textBox_height, interfaceMargin);
  }
  document.documentElement.style.setProperty('--textBox_width', textBox_width + 'px');
  document.documentElement.style.setProperty('--textBox_height', textBox_height + 'px');
  document.getElementById('textBox').style.left = textBox_xPosition + 'px'; 
  document.getElementById('textBox').style.top = textBox_yPosition + 'px';
}

function updateCanvas_parameter() {
  document.documentElement.style.setProperty('--backgroundColor', backgroundColor);
  document.documentElement.style.setProperty('--textColor', scriptColor);
  document.documentElement.style.setProperty('--textColorRGB', red(scriptColor) + ', ' + green(scriptColor) + ', ' + blue(scriptColor));
  document.documentElement.style.setProperty('--hoverColor', hoverColor);
  document.documentElement.style.setProperty('--activeColor', activeColor);
  document.documentElement.style.setProperty('--emptyColor', emptyColor);
  document.documentElement.style.setProperty('--missingColor', missingColor);
  document.documentElement.style.setProperty('--logoColor', emptyColor);
  document.documentElement.style.setProperty('--logoColorHover', missingColor);
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function setupInterface() {
  updateCanvas_parameter();
  updateCanvas_layout();

  updateInterface_glyphSet_boxes();
  updateInterface_textBoxSettings_state();
  updateInterface_textBoxSettings_label();
  updateInterface_glyphEditorTools_state();
  updateInterface_glyphEditorContext_state();
  updateInterface_glyphSet_state();
  updateInterface_scriptName();
  updateInterface_scriptList_label();
  updateInterface_scriptList_state();
  updateInterface_textBoxTools_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

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

  switch (glyphEditor.mode) {
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
  if (glyphEditor.contextMenu == true) {

    setDisplay(glyphEditorContextElement);
    glyphEditorContextElement.style.left = mouseX + 'px';
    glyphEditorContextElement.style.top = mouseY + 'px';

    if (glyphEditor.mode != 'drawPath') {

      const connectionToPrevElement = document.getElementById("connectionToPrev");
      const connectionToNextElement = document.getElementById("connectionToNext");

      if (glyphEditor.activePath.connectionToPrev == true) {
        setActive(connectionToPrevElement);
      } else {
        resetState(connectionToPrevElement);
      }

      if (glyphEditor.activePath.connectionToNext == true) {
        setActive(connectionToNextElement);
      } else {
        resetState(connectionToNextElement);
      }

      if(glyphEditor.activePath.index != 0) {
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

  // clean up current glyphSet elements
  while (glyphSetElement.firstChild) {
    glyphSetElement.removeChild(glyphSetElement.firstChild);
  }

  // add element for each character of activeScript
  activeScript.glyphs.forEach(glyph => {
    // Create a new div element for each character
    const name = glyph.name;
    const char = (name.length > 1 && name.match(/\?/)) ? glyphSet_missingLink : name; 
    // const char = name; 
    const glyphSet_box = document.createElement('div');
    glyphSet_box.className = 'glyphSet_box';
    glyphSet_box.id = name;
    glyphSet_box.setAttribute("onclick", `setGlyph(${JSON.stringify(name)})`);
    if (developerMode == true) {
      glyphSet_box.setAttribute("ondblclick", `showPrompt('setGlyphNamePrompt')`);
    }

    // Create a label and set its text
    const label = document.createElement('label');
    label.textContent = char;

    // Append the label to the glyphSetBox
    glyphSet_box.appendChild(label);

    // Append the glyphSetBox to the container
    glyphSetElement.appendChild(glyphSet_box);
  });

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
          prevBox.classList.add('glyphSet_last-box-in-line');
          box.classList.add('glyphSet_first-box-in-line');
        } else {
          prevBox.classList.remove('glyphSet_last-box-in-line');
          box.classList.remove('glyphSet_first-box-in-line')
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

    firstBox.classList.add('glyphSet_first-box-in-line');
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
      let glyph = activeScript.getGlyph(character);
      if (glyph == glyphEditor.activeGlyph) {
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
  scriptName.value = activeScript.name;
}

function updateInterface_scriptList_label() {

  // clear list
  scriptListElement.innerHTML = '';

  // add list elements
  scripts.forEach((script, index) => {
    const li = document.createElement('li');
    li.textContent = script.name; // Set the visible text
    li.setAttribute('onclick', `setScript('${index}')`); // Set the onclick functionality
    scriptList.appendChild(li); // Add the <li> to the list
  });
 
  updateInterface_scriptList_state();
}

function updateInterface_scriptList_state() {

  const scriptList_elements = document.getElementById('scriptList').getElementsByTagName('li');

  // Convert to array and use forEach
  Array.from(scriptList_elements).forEach((element, index) => {

    if (index == activeScriptIndex) {
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

  if(textBox.displayInfo == true) {
    setHidden(textBoxDisplayInfoShowElement);
    setDisplay(textBoxDisplayInfoHideElement);
  } else {
    setHidden(textBoxDisplayInfoHideElement);
    setDisplay(textBoxDisplayInfoShowElement);
  }

}

function updateInterface_textBoxSettings_state() {
  document.getElementById("textInput").value = arrayToText(textBox.textLines);
  
  // Sliders (0..100 map)
  document.getElementById("size").value = map(size, sizeMin, sizeMax, 0, 100);
  document.getElementById("scriptStrokeWeight").value = map(scriptStrokeWeight, scriptStrokeWeightMin, scriptStrokeWeightMax, 0, 100);
  document.getElementById("wordSpace").value = map(wordSpace, wordSpaceMin, wordSpaceMax, 0, 100);
  document.getElementById("letterSpace").value = map(letterSpace, letterSpaceMin, letterSpaceMax, 0, 100);
  document.getElementById("lineHeight").value = map(lineHeight, lineHeightMin, lineHeightMax, 0, 100);
  document.getElementById("letterWidth").value = map(letterWidth, letterWidthMin, letterWidthMax, 0, 100);
  document.getElementById("letterHeight").value = map(letterHeight, letterHeightMin, letterHeightMax, 0, 100);
  document.getElementById("slant").value = map(slant, slantMin, slantMax, 0, 100);
  
  document.getElementById("randomSize").value = map(randomSize, randomSizeMin, randomSizeMax, 0, 100);
  document.getElementById("randomLetterSpace").value = map(randomLetterSpace, randomLetterSpaceMin, randomLetterSpaceMax, 0, 100);
  document.getElementById("randomLetterWidth").value = map(randomLetterWidth, randomLetterWidthMin, randomLetterWidthMax, 0, 100);
  document.getElementById("randomLetterHeight").value = map(randomLetterHeight, randomLetterHeightMin, randomLetterHeightMax, 0, 100);
  document.getElementById("randomSlant").value = map(randomSlant, randomSlantMin, randomSlantMax, 0, 100);
  document.getElementById("randomBaselineOffset").value = map(randomBaselineOffset, randomBaselineOffsetMin, randomBaselineOffsetMax, 0, 100);
  document.getElementById("precision").value = map(precision, precisionMin, precisionMax, 0, 100);
  
  if (document.getElementById("rotateAll")) {
    document.getElementById("rotateAll").value = rotateAll;
  }

  // Sync Numeric Inputs
  document.getElementById("sizeNum").value = Math.round(size);
  document.getElementById("lineHeightNum").value = Math.round(lineHeight);
  document.getElementById("scriptStrokeWeightNum").value = parseFloat(scriptStrokeWeight.toFixed(1));
  document.getElementById("wordSpaceNum").value = Math.round((wordSpace + 1) * 100);
  document.getElementById("letterSpaceNum").value = Math.round((letterSpace + 1) * 100);
  document.getElementById("letterWidthNum").value = Math.round(letterWidth * 100);
  document.getElementById("letterHeightNum").value = Math.round(letterHeight * 100);
  document.getElementById("slantNum").value = Math.round(slant * 45); // convert to degrees approximately

  document.getElementById("randomSizeNum").value = Math.round(randomSize);
  document.getElementById("randomLetterSpaceNum").value = Math.round(randomLetterSpace * 100);
  document.getElementById("randomLetterWidthNum").value = Math.round(randomLetterWidth * 100);
  document.getElementById("randomLetterHeightNum").value = Math.round(randomLetterHeight * 100);
  document.getElementById("randomSlantNum").value = Math.round(randomSlant * 100);
  document.getElementById("randomBaselineOffsetNum").value = Math.round(randomBaselineOffset * 100);
  document.getElementById("precisionNum").value = Math.round(precision);
  
  if (document.getElementById("rotateAllNum")) {
    document.getElementById("rotateAllNum").value = rotateAll;
  }

  // Update Color Pickers
  if (document.getElementById("bgColorPicker") && typeof backgroundColor !== 'undefined') {
    let hex = colorToHex(backgroundColor);
    document.getElementById("bgColorPicker").value = hex;
    let lbl = document.getElementById('label-bg');
    if (lbl) lbl.innerText = hex.toUpperCase();
  }
  if (document.getElementById("textColorPicker") && typeof scriptColor !== 'undefined') {
    let hex = colorToHex(scriptColor);
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
  document.getElementById('exportScriptFileName').value = activeScript.name;
  document.getElementById('exportTextBoxSettingsFileName').value = textBoxSettingsFileName;
  document.getElementById('exportGraphicFileName').value = graphicFileName;
}

function toggleDropDown(id) {
  const dropdownElement = document.getElementById(id);
  dropdownElement.classList.toggle('show');
}

function setHover(state, id) {
  isHovering = state;

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

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}