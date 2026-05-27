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
  _p5.env.updateInterface_glyphEditorTools_state();
}

function switchGlyphEditorDisplayInfo() {
  _p5.env.glyphEditor.displayInfo = !_p5.env.glyphEditor.displayInfo;
  _p5.env.updateInterface_glyphEditorTools_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorContext

function switchConnectionToPrev() {
  _p5.env.glyphEditor.switchConnectionToPrev();
  _p5.env.updateInterface_glyphEditorContext_state();
}

function switchConnectionToNext() {
  _p5.env.glyphEditor.switchConnectionToNext();
  _p5.env.updateInterface_glyphEditorContext_state();
}

function switchMainPath() {
  _p5.env.glyphEditor.switchMainPath();
  _p5.env.updateInterface_glyphEditorContext_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// _p5.env.glyphEditor

function setGlyph(char) {
  _p5.env.glyphEditor.setActiveGlyph(char);
  _p5.env.updateInterface_glyphSet_state();
}

function setGlyphName() {

  var value = document.Id("setGlyphName").value;
  var char = _p5.env.glyphSet_missingLink;

  if (value.length > 0 && value != '') {
    char = value;
  }

  _p5.env.glyphEditor.setActiveGlyphName(char);
  _p5.env.updateInterface_glyphSet_state();

  _p5.env.closePrompt('setGlyphNamePrompt');
}

function clearGlyph() {
  _p5.env.glyphEditor.clearActiveGlyph();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// script

function setScript(value) {
  _p5.env.activeScriptIndex = value;
  _p5.env.activeScript = _p5.env.scripts[_p5.env.activeScriptIndex];
  if (_p5.env.glyphEditor == null) return;
  _p5.env.glyphEditor.reloadActiveGlyph();
  _p5.env.glyphEditor.repositionGuides();
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_glyphSet_boxes();
  _p5.env.updateInterface_scriptList_state();
  _p5.env.updateInterface_scriptList_label();
}

function nextScript() {
  _p5.env.activeScriptIndex = (_p5.env.activeScriptIndex + 1 + _p5.env.scripts.length) % _p5.env.scripts.length;
  _p5.env.setScript(_p5.env.activeScriptIndex);
}

function prevScript() {
  _p5.env.activeScriptIndex = (_p5.env.activeScriptIndex - 1 + _p5.env.scripts.length) % _p5.env.scripts.length;
  _p5.env.setScript(_p5.env.activeScriptIndex);
}

function resetScript() {
  if (_p5.env.activeScriptIndex < _p5.env.defaultScriptFiles.length) {
    // Restore the default preset script from the original loaded data
    _p5.env.scripts[_p5.env.activeScriptIndex] = new _p5.env.Script(_p5.env.defaultScriptFiles[_p5.env.activeScriptIndex]);
    _p5.env.activeScript = _p5.env.scripts[_p5.env.activeScriptIndex];
  } else {
    // For custom created or imported _p5.env.scripts, perform a clean reset
    _p5.env.activeScript.reset();
  }

  // Fully update the interface and the glyph editor to reflect the changes
  if (_p5.env.glyphEditor != null) {
    _p5.env.glyphEditor.reloadActiveGlyph();
    _p5.env.glyphEditor.repositionGuides();
  }
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_glyphSet_boxes();
  _p5.env.updateInterface_scriptList_state();
  _p5.env.updateInterface_scriptList_label();
}

function addNewScript() {
  _p5.env.scripts.push(new _p5.env.Script());
  _p5.env.activeScriptIndex = _p5.env.scripts.length - 1;
  _p5.env.setScript(_p5.env.activeScriptIndex);
}

function setScriptName(value) {
  _p5.env.activeScript.name = value;
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_scriptList_label();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// _p5.env.textBox

function switchTextBoxDisplayInfo() {
  _p5.env.textBox.displayInfo = !_p5.env.textBox.displayInfo;
  _p5.env.updateInterface_textBoxTools_state();
}

function setTextBoxDisplayInfo(value) {
  
  if (value == 'hide') {
    _p5.env.textBox.displayInfo = false;
  } else {
    _p5.env.textBox.displayInfo = true;
  }

  _p5.env.updateInterface_textBoxTools_state();
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBoxSettings

function setText() {
  var textInput = document.getElementById("textInput").value;
  _p5.env.textBox.setText(_p5.env.textToArray(textInput));
  _p5.env.updateInterface_glyphSet_state();
}

function setLineHeight(value) {
  _p5.env.lineHeight = _p5.map(value, 0, 100, _p5.env.lineHeightMin, _p5.env.lineHeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setScriptStrokeWeight(value) {
  _p5.env.scriptStrokeWeight = _p5.map(value, 0, 100, _p5.env.scriptStrokeWeightMin, _p5.env.scriptStrokeWeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setSize(value) {
  _p5.env.size = _p5.map(value, 0, 100, _p5.env.sizeMin, _p5.env.sizeMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setWordSpace(value) { // direct translation
  _p5.env.wordSpace = _p5.map(value, 0, 100, _p5.env.wordSpaceMin, _p5.env.wordSpaceMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

// function setWordSpace(value) { // animation value
//   _p5.env.animations.push({
//     variable: new AnimatedVariable(_p5.env.wordSpace, _p5.map(value, 0, 100, _p5.env.wordSpaceMin, _p5.env.wordSpaceMax)),
//     complete: false,
//     update: function() {
//       _p5.env.wordSpace = this.variable.update();
//       updateInterface_textBoxSettings_state();
//       _p5.env.updateInterface_textBoxSettings_label();
//       this.complete = this.variable.complete;
//     }
//   });
// }

function setLetterSpace(value) {
  _p5.env.letterSpace = _p5.map(value, 0, 100, _p5.env.letterSpaceMin, _p5.env.letterSpaceMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setLetterWidth(value) {
  _p5.env.letterWidth = _p5.map(value, 0, 100, _p5.env.letterWidthMin, _p5.env.letterWidthMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setLetterHeight(value) {
  _p5.env.letterHeight = _p5.map(value, 0, 100, _p5.env.letterHeightMin, _p5.env.letterHeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setSlant(value) {
  _p5.env.slant = _p5.map(value, 0, 100, _p5.env.slantMin, _p5.env.slantMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomSize(value) {
  _p5.env.randomSize = _p5.map(value, 0, 100, _p5.env.randomSizeMin, _p5.env.randomSizeMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomLetterSpace(value) {
  _p5.env.randomLetterSpace = _p5.map(value, 0, 100, _p5.env.randomLetterSpaceMin, _p5.env.randomLetterSpaceMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomLetterWidth(value) {
  _p5.env.randomLetterWidth = _p5.map(value, 0, 100, _p5.env.randomLetterWidthMin, _p5.env.randomLetterWidthMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomLetterHeight(value) {
  _p5.env.randomLetterHeight = _p5.map(value, 0, 100, _p5.env.randomLetterHeightMin, _p5.env.randomLetterHeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomSlant(value) {
  _p5.env.randomSlant = _p5.map(value, 0, 100, _p5.env.randomSlantMin, _p5.env.randomSlantMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomBaselineOffset(value) {
  _p5.env.randomBaselineOffset = _p5.map(value, 0, 100, _p5.env.randomBaselineOffsetMin, _p5.env.randomBaselineOffsetMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setPrecision(value) {
  _p5.env.precision = _p5.map(value, 0, 100, _p5.env.precisionMin, _p5.env.precisionMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function randomTextBoxSettings() {
  _p5.env.setupAnimation_textBoxSettings("_p5.random");
}

function resetTextBoxSettings() {
  _p5.env.setupAnimation_textBoxSettings("default");
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
