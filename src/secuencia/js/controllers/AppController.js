export function createAppController(_p5, { Script }) {
  const document = _p5.env.document;
  // Provide undeclared globals that were implicit before


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Default Controllable Parameter

let bgImage = null;
  let bgOpacity = 50;
  let bgScale = 100;
  let bgRotation = 0;
  let bgOffsetX = 0;
  let bgOffsetY = 0;

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Controllable Parameter

// –––––––––––––––––––––––––––––––––

// Global Parameter

function setRotateAll(value) {
  _p5.env.rotateAll = parseFloat(value);
  let s = document.getElementById("rotateAll");
  let num = document.getElementById("rotateAllNum");
  if (s) s.value = _p5.env.rotateAll;
  if (num) num.value = _p5.env.rotateAll;
}
function setBgOpacity(value) {
  _p5.env.bgOpacity = parseFloat(value);
  let s = document.getElementById("bgOpacity");
  let num = document.getElementById("bgOpacityNum");
  if (s) s.value = _p5.env.bgOpacity;
  if (num) num.value = _p5.env.bgOpacity;
}
function setBgScale(value) {
  _p5.env.bgScale = parseFloat(value);
  let s = document.getElementById("bgScale");
  let num = document.getElementById("bgScaleNum");
  if (s) s.value = _p5.env.bgScale;
  if (num) num.value = _p5.env.bgScale;
}
function setBgRotation(value) {
  _p5.env.bgRotation = parseFloat(value);
  let s = document.getElementById("bgRotation");
  let num = document.getElementById("bgRotationNum");
  if (s) s.value = _p5.env.bgRotation;
  if (num) num.value = _p5.env.bgRotation;
}
function setBgOffsetX(value) {
  _p5.env.bgOffsetX = parseFloat(value);
  let s = document.getElementById("bgOffsetX");
  let num = document.getElementById("bgOffsetXNum");
  if (s) s.value = _p5.env.bgOffsetX;
  if (num) num.value = _p5.env.bgOffsetX;
}
function setBgOffsetY(value) {
  _p5.env.bgOffsetY = parseFloat(value);
  let s = document.getElementById("bgOffsetY");
  let num = document.getElementById("bgOffsetYNum");
  if (s) s.value = _p5.env.bgOffsetY;
  if (num) num.value = _p5.env.bgOffsetY;
}
function handleBgImageUpload(file) {
  if (file) {
    let imgUrl = URL.createObjectURL(file);
    _p5.env.bgImage = _p5.loadImage(imgUrl);
  }
}
function removeBgImage() {
  _p5.env.bgImage = null;
  let bgInput = document.getElementById('bgImageInput');
  if (bgInput) {
    bgInput.value = '';
  }
}
function setupSecuenciaListeners() {
  // Bg _p5.image upload listener
  let bgInput = document.getElementById('bgImageInput') || document.getElementById('s-bgImageInput');
  if (bgInput) {
    bgInput.addEventListener('change', function (e) {
      _p5.env.handleBgImageUpload(e.target.files[0]);
    });
  }

  // Color pickers
  let bgColorPicker = document.getElementById('bgColorPicker');
  if (bgColorPicker) {
    bgColorPicker.addEventListener('input', function (e) {
      _p5.env.backgroundColor = _p5.env.hexToColor(e.target.value);
      let lbl = document.getElementById('label-bg');
      if (lbl) lbl.innerText = e.target.value.toUpperCase();
      _p5.env.updateCanvas_parameter();
    });
  }
  let textColorPicker = document.getElementById('textColorPicker');
  if (textColorPicker) {
    textColorPicker.addEventListener('input', function (e) {
      _p5.env.scriptColor = _p5.env.hexToColor(e.target.value);
      let lbl = document.getElementById('label-text');
      if (lbl) lbl.innerText = e.target.value.toUpperCase();
      _p5.env.updateCanvas_parameter();
    });
  }

  // Sync range and number inputs for all parameters
  const syncParams = [{
    id: 'size',
    setFn: _p5.env.setSize,
    min: _p5.env.sizeMin,
    max: _p5.env.sizeMax,
    type: 'direct'
  }, {
    id: 'lineHeight',
    setFn: _p5.env.setLineHeight,
    min: _p5.env.lineHeightMin,
    max: _p5.env.lineHeightMax,
    type: 'direct'
  }, {
    id: 'scriptStrokeWeight',
    setFn: _p5.env.setScriptStrokeWeight,
    min: _p5.env.scriptStrokeWeightMin,
    max: _p5.env.scriptStrokeWeightMax,
    type: 'direct'
  }, {
    id: 'wordSpace',
    setFn: _p5.env.setWordSpace,
    min: _p5.env.wordSpaceMin,
    max: _p5.env.wordSpaceMax,
    type: 'percent_shift'
  }, {
    id: 'letterSpace',
    setFn: _p5.env.setLetterSpace,
    min: _p5.env.letterSpaceMin,
    max: _p5.env.letterSpaceMax,
    type: 'percent_shift'
  }, {
    id: 'letterWidth',
    setFn: _p5.env.setLetterWidth,
    min: _p5.env.letterWidthMin,
    max: _p5.env.letterWidthMax,
    type: 'percent_scale'
  }, {
    id: 'letterHeight',
    setFn: _p5.env.setLetterHeight,
    min: _p5.env.letterHeightMin,
    max: _p5.env.letterHeightMax,
    type: 'percent_scale'
  }, {
    id: 'slant',
    setFn: _p5.env.setSlant,
    min: _p5.env.slantMin,
    max: _p5.env.slantMax,
    type: 'slant_deg'
  }, {
    id: 'randomSize',
    setFn: _p5.env.setRandomSize,
    min: _p5.env.randomSizeMin,
    max: _p5.env.randomSizeMax,
    type: 'direct'
  }, {
    id: 'randomLetterSpace',
    setFn: _p5.env.setRandomLetterSpace,
    min: _p5.env.randomLetterSpaceMin,
    max: _p5.env.randomLetterSpaceMax,
    type: 'percent_scale'
  }, {
    id: 'randomLetterWidth',
    setFn: _p5.env.setRandomLetterWidth,
    min: _p5.env.randomLetterWidthMin,
    max: _p5.env.randomLetterWidthMax,
    type: 'percent_scale'
  }, {
    id: 'randomLetterHeight',
    setFn: _p5.env.setRandomLetterHeight,
    min: _p5.env.randomLetterHeightMin,
    max: _p5.env.randomLetterHeightMax,
    type: 'percent_scale'
  }, {
    id: 'randomSlant',
    setFn: _p5.env.setRandomSlant,
    min: _p5.env.randomSlantMin,
    max: _p5.env.randomSlantMax,
    type: 'slider_val'
  }, {
    id: 'randomBaselineOffset',
    setFn: _p5.env.setRandomBaselineOffset,
    min: _p5.env.randomBaselineOffsetMin,
    max: _p5.env.randomBaselineOffsetMax,
    type: 'slider_val'
  }, {
    id: 'precision',
    setFn: _p5.env.setPrecision,
    min: _p5.env.precisionMin,
    max: _p5.env.precisionMax,
    type: 'slider_val'
  }];
  syncParams.forEach(param => {
    let rangeEl = document.getElementById(param.id);
    let numEl = document.getElementById(param.id + 'Num');
    if (rangeEl && numEl) {
      // When the user moves the slider
      rangeEl.addEventListener('input', function () {
        param.setFn(parseFloat(rangeEl.value));
      });

      // When the user types a value manually
      numEl.addEventListener('input', function () {
        let val = parseFloat(numEl.value);
        if (isNaN(val)) return;
        let percentage = 0;
        if (param.type === 'direct') {
          val = _p5.constrain(val, param.min, param.max);
          percentage = _p5.map(val, param.min, param.max, 0, 100);
        } else if (param.type === 'percent_shift') {
          // input: 100..300% -> physical: 0..2
          let phys = val / 100 - 1;
          phys = _p5.constrain(phys, param.min, param.max);
          percentage = _p5.map(phys, param.min, param.max, 0, 100);
        } else if (param.type === 'percent_scale') {
          // input: 0..500% -> physical: 0..5
          let phys = val / 100;
          phys = _p5.constrain(phys, param.min, param.max);
          percentage = _p5.map(phys, param.min, param.max, 0, 100);
        } else if (param.type === 'slant_deg') {
          // input: -45..45 deg -> physical: -1..1
          let phys = val / 45;
          phys = _p5.constrain(phys, param.min, param.max);
          percentage = _p5.map(phys, param.min, param.max, 0, 100);
        } else if (param.type === 'slider_val') {
          // input: 0..100 (matches slider direct val)
          val = _p5.constrain(val, 0, 100);
          percentage = val;
        }

        // Apply the computed percentage to the parameter
        param.setFn(percentage);
        // Sync the slider position
        rangeEl.value = percentage;
      });
    }
  });

  // Sync _p5.background parameters
  const bgParams = [{
    id: 'bgOpacity',
    setFn: _p5.env.setBgOpacity
  }, {
    id: 'bgScale',
    setFn: _p5.env.setBgScale
  }, {
    id: 'bgRotation',
    setFn: _p5.env.setBgRotation
  }, {
    id: 'bgOffsetX',
    setFn: _p5.env.setBgOffsetX
  }, {
    id: 'bgOffsetY',
    setFn: _p5.env.setBgOffsetY
  }, {
    id: 'rotateAll',
    setFn: _p5.env.setRotateAll
  }];
  bgParams.forEach(param => {
    let rangeEl = document.getElementById(param.id);
    let numEl = document.getElementById(param.id + 'Num');
    if (rangeEl && numEl) {
      rangeEl.addEventListener('input', function () {
        param.setFn(rangeEl.value);
      });
      numEl.addEventListener('input', function () {
        let val = parseFloat(numEl.value);
        if (!isNaN(val)) {
          param.setFn(val);
        }
      });
    }
  });
}

// Parent communication listeners for Plano integration

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorTools
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

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

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorContext

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditor
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

// glyphEditor

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditor

function setGlyph(char) {
  _p5.env.glyphEditor.setActiveGlyph(char);
  _p5.env.updateInterface_glyphSet_state();
}
function setGlyphName() {
  let value = document.getElementById("setGlyphName").value;
  let char = _p5.env.glyphSet_missingLink;
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
    _p5.env.scripts[_p5.env.activeScriptIndex] = new Script(_p5.env.defaultScriptFiles[_p5.env.activeScriptIndex]);
    _p5.env.activeScript = _p5.env.scripts[_p5.env.activeScriptIndex];
  } else {
    // For custom created or imported scripts, perform a clean reset
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
  _p5.env.scripts.push(new Script());
  _p5.env.activeScriptIndex = _p5.env.scripts.length - 1;
  _p5.env.setScript(_p5.env.activeScriptIndex);
}
function setScriptName(value) {
  _p5.env.activeScript.name = value;
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_scriptList_label();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBox

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBox

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBoxSettings

// function setWordSpace(value) { // animation value
//   animations.push({
//     variable: new AnimatedVariable(wordSpace, _p5.map(value, 0, 100, wordSpaceMin, wordSpaceMax)),
//     complete: false,
//     update: function() {
//       wordSpace = this.variable.update();
//       _p5.env.updateInterface_textBoxSettings_state();
//       _p5.env.updateInterface_textBoxSettings_label();
//       this.complete = this.variable.complete;
//     }
//   });

// }
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

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBoxSettings

function setText() {
  let textInput = document.getElementById("textInput").value;
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
function setWordSpace(value) {
  // direct translation
  _p5.env.wordSpace = _p5.map(value, 0, 100, _p5.env.wordSpaceMin, _p5.env.wordSpaceMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

// function setWordSpace(value) { // animation value
//   animations.push({
//     variable: new AnimatedVariable(wordSpace, _p5.map(value, 0, 100, wordSpaceMin, wordSpaceMax)),
//     complete: false,
//     update: function() {
//       wordSpace = this.variable.update();
//       _p5.env.updateInterface_textBoxSettings_state();
//       _p5.env.updateInterface_textBoxSettings_label();
//       this.complete = this.variable.complete;
//     }
//   });

// }

// function setWordSpace(value) { // animation value
//   animations.push({
//     variable: new AnimatedVariable(wordSpace, _p5.map(value, 0, 100, wordSpaceMin, wordSpaceMax)),
//     complete: false,
//     update: function() {
//       wordSpace = this.variable.update();
//       _p5.env.updateInterface_textBoxSettings_state();
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
  return {
    setRotateAll,
    setBgOpacity,
    setBgScale,
    setBgRotation,
    setBgOffsetX,
    setBgOffsetY,
    handleBgImageUpload,
    removeBgImage,
    setupSecuenciaListeners,
    isTouchDevice,
    switchMode,
    switchGlyphEditorDisplayInfo,
    switchConnectionToPrev,
    switchConnectionToNext,
    switchMainPath,
    setGlyph,
    setGlyphName,
    clearGlyph,
    setScript,
    nextScript,
    prevScript,
    resetScript,
    addNewScript,
    setScriptName,
    switchTextBoxDisplayInfo,
    setTextBoxDisplayInfo,
    setText,
    setLineHeight,
    setScriptStrokeWeight,
    setSize,
    setWordSpace,
    setLetterSpace,
    setLetterWidth,
    setLetterHeight,
    setSlant,
    setRandomSize,
    setRandomLetterSpace,
    setRandomLetterWidth,
    setRandomLetterHeight,
    setRandomSlant,
    setRandomBaselineOffset,
    setPrecision,
    randomTextBoxSettings,
    resetTextBoxSettings,
    bgImage,
    bgOpacity,
    bgScale,
    bgRotation,
    bgOffsetX,
    bgOffsetY,
  };
}
