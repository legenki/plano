// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function mousePressed() {

  if (mouseButton == "right" || event.ctrlKey) {
    if (glyphEditor.isHovered == true) {
      glyphEditor.handleRightClick();
    }
  }

}

function mouseDragged() {
  glyphEditor.handleDrag();
}

function mouseReleased() {

}

function mouseClicked() {
  if (glyphEditor.isHovered == true && event.ctrlKey == false) {
    glyphEditor.handleClick();
  }
}

function doubleClicked() {
  if (glyphEditor.isHovered == true) {
    glyphEditor.handleDoubleClick();
  }
}

// –––––––––––––––––––––––––––––––––––

function keyPressed() {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if (key == 'Alt') {
    if (glyphEditor) glyphEditor.handleAlt('pressed');
  }

  // Vector editing mode keyboard hotkeys
  if (key === 'v' || key === 'V') {
    switchMode('editPath');
  } else if (key === 'a' || key === 'A') {
    switchMode('editAnchor');
  } else if (key === 'h' || key === 'H') {
    switchMode('editHandle');
  } else if (key === 'p' || key === 'P') {
    switchMode('drawPath');
  }
}

function keyReleased() {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if (key == 'Backspace') {
    if (glyphEditor) glyphEditor.handleDelete();
  } else if (key == 'Escape') {
    if (glyphEditor) glyphEditor.handleEscape();
  } else if (key == 'Alt') {
    if (glyphEditor) glyphEditor.handleAlt('released');
  }
}

document.addEventListener('keydown', (event) => {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if ((event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    glyphEditor.handleCmdZ();
  }
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorTools

function switchMode(value) {
  glyphEditor.setMode(value);
  updateInterface_glyphEditorTools_state();
}

function switchGlyphEditorDisplayInfo() {
  glyphEditor.displayInfo = !glyphEditor.displayInfo;
  updateInterface_glyphEditorTools_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorContext

function switchConnectionToPrev() {
  glyphEditor.switchConnectionToPrev();
  updateInterface_glyphEditorContext_state();
}

function switchConnectionToNext() {
  glyphEditor.switchConnectionToNext();
  updateInterface_glyphEditorContext_state();
}

function switchMainPath() {
  glyphEditor.switchMainPath();
  updateInterface_glyphEditorContext_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditor

function setGlyph(char) {
  glyphEditor.setActiveGlyph(char);
  updateInterface_glyphSet_state();
}

function setGlyphName() {

  var value = document.Id("setGlyphName").value;
  var char = glyphSet_missingLink;

  if (value.length > 0 && value != '') {
    char = value;
  }

  glyphEditor.setActiveGlyphName(char);
  updateInterface_glyphSet_state();

  closePrompt('setGlyphNamePrompt');
}

function clearGlyph() {
  glyphEditor.clearActiveGlyph();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// script

function setScript(value) {
  activeScriptIndex = value;
  activeScript = scripts[activeScriptIndex];
  if (glyphEditor == null) return;
  glyphEditor.reloadActiveGlyph();
  glyphEditor.repositionGuides();
  updateInterface_scriptName();
  updateInterface_glyphSet_boxes();
  updateInterface_scriptList_state();
  updateInterface_scriptList_label();
}

function nextScript() {
  activeScriptIndex = (activeScriptIndex + 1 + scripts.length) % scripts.length;
  setScript(activeScriptIndex);
}

function prevScript() {
  activeScriptIndex = (activeScriptIndex - 1 + scripts.length) % scripts.length;
  setScript(activeScriptIndex);
}

function resetScript() {
  if (activeScriptIndex < defaultScriptFiles.length) {
    // Restore the default preset script from the original loaded data
    scripts[activeScriptIndex] = new Script(defaultScriptFiles[activeScriptIndex]);
    activeScript = scripts[activeScriptIndex];
  } else {
    // For custom created or imported scripts, perform a clean reset
    activeScript.reset();
  }

  // Fully update the interface and the glyph editor to reflect the changes
  if (glyphEditor != null) {
    glyphEditor.reloadActiveGlyph();
    glyphEditor.repositionGuides();
  }
  updateInterface_scriptName();
  updateInterface_glyphSet_boxes();
  updateInterface_scriptList_state();
  updateInterface_scriptList_label();
}

function addNewScript() {
  scripts.push(new Script());
  activeScriptIndex = scripts.length - 1;
  setScript(activeScriptIndex);
}

function setScriptName(value) {
  activeScript.name = value;
  updateInterface_scriptName();
  updateInterface_scriptList_label();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBox

function switchTextBoxDisplayInfo() {
  textBox.displayInfo = !textBox.displayInfo;
  updateInterface_textBoxTools_state();
}

function setTextBoxDisplayInfo(value) {
  
  if (value == 'hide') {
    textBox.displayInfo = false;
  } else {
    textBox.displayInfo = true;
  }

  updateInterface_textBoxTools_state();
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBoxSettings

function setText() {
  var textInput = document.getElementById("textInput").value;
  textBox.setText(textToArray(textInput));
  updateInterface_glyphSet_state();
}

function setLineHeight(value) {
  lineHeight = map(value, 0, 100, lineHeightMin, lineHeightMax);
  updateInterface_textBoxSettings_label();
}

function setScriptStrokeWeight(value) {
  scriptStrokeWeight = map(value, 0, 100, scriptStrokeWeightMin, scriptStrokeWeightMax);
  updateInterface_textBoxSettings_label();
}

function setSize(value) {
  size = map(value, 0, 100, sizeMin, sizeMax);
  updateInterface_textBoxSettings_label();
}

function setWordSpace(value) { // direct translation
  wordSpace = map(value, 0, 100, wordSpaceMin, wordSpaceMax);
  updateInterface_textBoxSettings_label();
}

// function setWordSpace(value) { // animation value
//   animations.push({
//     variable: new AnimatedVariable(wordSpace, map(value, 0, 100, wordSpaceMin, wordSpaceMax)),
//     complete: false,
//     update: function () {
//       wordSpace = this.variable.update();
//       updateInterface_textBoxSettings_state();
//       updateInterface_textBoxSettings_label();
//       this.complete = this.variable.complete;
//     }
//   });
// }

function setLetterSpace(value) {
  letterSpace = map(value, 0, 100, letterSpaceMin, letterSpaceMax);
  updateInterface_textBoxSettings_label();
}

function setLetterWidth(value) {
  letterWidth = map(value, 0, 100, letterWidthMin, letterWidthMax);
  updateInterface_textBoxSettings_label();
}

function setLetterHeight(value) {
  letterHeight = map(value, 0, 100, letterHeightMin, letterHeightMax);
  updateInterface_textBoxSettings_label();
}

function setSlant(value) {
  slant = map(value, 0, 100, slantMin, slantMax);
  updateInterface_textBoxSettings_label();
}

function setRandomSize(value) {
  randomSize = map(value, 0, 100, randomSizeMin, randomSizeMax);
  updateInterface_textBoxSettings_label();
}

function setRandomLetterSpace(value) {
  randomLetterSpace = map(value, 0, 100, randomLetterSpaceMin, randomLetterSpaceMax);
  updateInterface_textBoxSettings_label();
}

function setRandomLetterWidth(value) {
  randomLetterWidth = map(value, 0, 100, randomLetterWidthMin, randomLetterWidthMax);
  updateInterface_textBoxSettings_label();
}

function setRandomLetterHeight(value) {
  randomLetterHeight = map(value, 0, 100, randomLetterHeightMin, randomLetterHeightMax);
  updateInterface_textBoxSettings_label();
}

function setRandomSlant(value) {
  randomSlant = map(value, 0, 100, randomSlantMin, randomSlantMax);
  updateInterface_textBoxSettings_label();
}

function setRandomBaselineOffset(value) {
  randomBaselineOffset = map(value, 0, 100, randomBaselineOffsetMin, randomBaselineOffsetMax);
  updateInterface_textBoxSettings_label();
}

function setPrecision(value) {
  precision = map(value, 0, 100, precisionMin, precisionMax);
  updateInterface_textBoxSettings_label();
}

function randomTextBoxSettings() {
  setupAnimation_textBoxSettings("random");
}

function resetTextBoxSettings() {
  setupAnimation_textBoxSettings("default");
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// touch device methods for blocking default pinch gestures 
// prevent zoom gesture in safari

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
  document.body.style.zoom = 0.999999999;
}
);

document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
  document.body.style.zoom = 0.999999999;
}
);

document.addEventListener('gestureend', function (e) {
  e.preventDefault();
  document.body.style.zoom = 1.0;
}
);