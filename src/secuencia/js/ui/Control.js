/**
 * SECUENCIA — Control Layer
 * Event bindings, keyboard handlers, and UI control functions.
 */

export function createControlFunctions(_p5) {

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

_p5.mousePressed = function() {

  if (_p5.mouseButton == "right" || event.ctrlKey) {
    if (_p5.env.glyphEditor.isHovered == true) {
      _p5.env.glyphEditor.handleRightClick();
    }
  }

}

_p5.mouseDragged = function() {
  _p5.env.glyphEditor.handleDrag();
}

_p5.mouseReleased = function() {

}

// --- TOUCH HANDLERS ---
_p5.touchStarted = function() {
  _p5.mousePressed();
  if (_p5.mouseX >= 0 && _p5.mouseX <= _p5.width && _p5.mouseY >= 0 && _p5.mouseY <= _p5.height) return false;
};

_p5.touchMoved = function() {
  _p5.mouseDragged();
  if (_p5.mouseX >= 0 && _p5.mouseX <= _p5.width && _p5.mouseY >= 0 && _p5.mouseY <= _p5.height) return false;
};

_p5.touchEnded = function() {
  _p5.mouseReleased();
  if (_p5.mouseX >= 0 && _p5.mouseX <= _p5.width && _p5.mouseY >= 0 && _p5.mouseY <= _p5.height) return false;
};

_p5.mouseClicked = function() {
  if (_p5.env.glyphEditor.isHovered == true && event.ctrlKey == false) {
    _p5.env.glyphEditor.handleClick();
  }
}

function doubleClicked() {
  if (_p5.env.glyphEditor.isHovered == true) {
    _p5.env.glyphEditor.handleDoubleClick();
  }
}

// –––––––––––––––––––––––––––––––––––

_p5.keyPressed = function() {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if (_p5.key == 'Alt') {
    if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleAlt('pressed');
  }

  // Vector editing mode keyboard hotkeys
  if (_p5.key === 'v' || _p5.key === 'V') {
    switchMode('editPath');
  } else if (_p5.key === 'a' || _p5.key === 'A') {
    switchMode('editAnchor');
  } else if (_p5.key === 'h' || _p5.key === 'H') {
    switchMode('editHandle');
  } else if (_p5.key === 'p' || _p5.key === 'P') {
    switchMode('drawPath');
  }
}

_p5.keyReleased = function() {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if (_p5.key == 'Backspace') {
    if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleDelete();
  } else if (_p5.key == 'Escape') {
    if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleEscape();
  } else if (_p5.key == 'Alt') {
    if (_p5.env.glyphEditor) _p5.env.glyphEditor.handleAlt('released');
  }
}

document.addEventListener('keydown', (event) => {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if ((event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    _p5.env.glyphEditor.handleCmdZ();
  }
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorTools

function switchMode(value) {
  _p5.env.glyphEditor.setMode(value);
  updateInterface_glyphEditorTools_state();
}

function switchGlyphEditorDisplayInfo() {
  _p5.env.glyphEditor.displayInfo = !_p5.env.glyphEditor.displayInfo;
  updateInterface_glyphEditorTools_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorContext

function switchConnectionToPrev() {
  _p5.env.glyphEditor.switchConnectionToPrev();
  updateInterface_glyphEditorContext_state();
}

function switchConnectionToNext() {
  _p5.env.glyphEditor.switchConnectionToNext();
  updateInterface_glyphEditorContext_state();
}

function switchMainPath() {
  _p5.env.glyphEditor.switchMainPath();
  updateInterface_glyphEditorContext_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// _p5.env.glyphEditor

function setGlyph(char) {
  _p5.env.glyphEditor.setActiveGlyph(char);
  updateInterface_glyphSet_state();
}

function setGlyphName() {

  var value = document.Id("setGlyphName").value;
  var char = glyphSet_missingLink;

  if (value.length > 0 && value != '') {
    char = value;
  }

  _p5.env.glyphEditor.setActiveGlyphName(char);
  updateInterface_glyphSet_state();

  closePrompt('setGlyphNamePrompt');
}

function clearGlyph() {
  _p5.env.glyphEditor.clearActiveGlyph();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// script

function setScript(value) {
  activeScriptIndex = value;
  activeScript = scripts[activeScriptIndex];
  if (_p5.env.glyphEditor == null) return;
  _p5.env.glyphEditor.reloadActiveGlyph();
  _p5.env.glyphEditor.repositionGuides();
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
  if (_p5.env.glyphEditor != null) {
    _p5.env.glyphEditor.reloadActiveGlyph();
    _p5.env.glyphEditor.repositionGuides();
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
  lineHeight = _p5.map(value, 0, 100, lineHeightMin, lineHeightMax);
  updateInterface_textBoxSettings_label();
}

function setScriptStrokeWeight(value) {
  scriptStrokeWeight = _p5.map(value, 0, 100, scriptStrokeWeightMin, scriptStrokeWeightMax);
  updateInterface_textBoxSettings_label();
}

function setSize(value) {
  size = _p5.map(value, 0, 100, sizeMin, sizeMax);
  updateInterface_textBoxSettings_label();
}

function setWordSpace(value) { // direct translation
  wordSpace = _p5.map(value, 0, 100, wordSpaceMin, wordSpaceMax);
  updateInterface_textBoxSettings_label();
}

// function setWordSpace(value) { // animation value
//   animations.push({
//     variable: new AnimatedVariable(wordSpace, _p5.map(value, 0, 100, wordSpaceMin, wordSpaceMax)),
//     complete: false,
//     update: function() {
//       wordSpace = this.variable.update();
//       updateInterface_textBoxSettings_state();
//       updateInterface_textBoxSettings_label();
//       this.complete = this.variable.complete;
//     }
//   });
// }

function setLetterSpace(value) {
  letterSpace = _p5.map(value, 0, 100, letterSpaceMin, letterSpaceMax);
  updateInterface_textBoxSettings_label();
}

function setLetterWidth(value) {
  letterWidth = _p5.map(value, 0, 100, letterWidthMin, letterWidthMax);
  updateInterface_textBoxSettings_label();
}

function setLetterHeight(value) {
  letterHeight = _p5.map(value, 0, 100, letterHeightMin, letterHeightMax);
  updateInterface_textBoxSettings_label();
}

function setSlant(value) {
  slant = _p5.map(value, 0, 100, slantMin, slantMax);
  updateInterface_textBoxSettings_label();
}

function setRandomSize(value) {
  randomSize = _p5.map(value, 0, 100, randomSizeMin, randomSizeMax);
  updateInterface_textBoxSettings_label();
}

function setRandomLetterSpace(value) {
  randomLetterSpace = _p5.map(value, 0, 100, randomLetterSpaceMin, randomLetterSpaceMax);
  updateInterface_textBoxSettings_label();
}

function setRandomLetterWidth(value) {
  randomLetterWidth = _p5.map(value, 0, 100, randomLetterWidthMin, randomLetterWidthMax);
  updateInterface_textBoxSettings_label();
}

function setRandomLetterHeight(value) {
  randomLetterHeight = _p5.map(value, 0, 100, randomLetterHeightMin, randomLetterHeightMax);
  updateInterface_textBoxSettings_label();
}

function setRandomSlant(value) {
  randomSlant = _p5.map(value, 0, 100, randomSlantMin, randomSlantMax);
  updateInterface_textBoxSettings_label();
}

function setRandomBaselineOffset(value) {
  randomBaselineOffset = _p5.map(value, 0, 100, randomBaselineOffsetMin, randomBaselineOffsetMax);
  updateInterface_textBoxSettings_label();
}

function setPrecision(value) {
  precision = _p5.map(value, 0, 100, precisionMin, precisionMax);
  updateInterface_textBoxSettings_label();
}

function randomTextBoxSettings() {
  setupAnimation_textBoxSettings("_p5.random");
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

}
