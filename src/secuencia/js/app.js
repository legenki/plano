import { env } from "./Config.js";
import { diffAndUpdateDOM } from '../../js/ui-utils.js';
import { initGlyphModels, Glyph, Path, Anchor, Handle } from './models/Glyph.js';
import { createUIManager } from './ui/UIManager.js';
import { bindEvents } from './controllers/Events.js';
import { initScriptModel, Script } from './models/Script.js';
import { createTextBoxClass } from './models/TextBox.js';
import { createGlyphEditorClass } from './ui/GlyphEditor.js';
import { createButtonClasses } from './ui/Buttons.js';
import { createExportUtils } from './utils/Export.js';
import { createAnimationUtils } from './utils/Animation.js';
export const secuenciaSketch = _p5 => {
  _p5.env = env;

// Proxy document to remap prefixed IDs for secuencia
  const document = new Proxy(window.document, {
    get: function (target, prop) {
      if (prop === 'getElementById') {
        return function (id) {
          let mapped = id;
          if (id === 'snackbar') mapped = 'secuencia-snackbar';else if (id === 'canvas-container') mapped = 'secuencia-canvas';else if (!id.startsWith('s-')) mapped = 's-' + id;
          let el = target.getElementById(mapped);
          return el ? el : target.getElementById(id);
        };
      }
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
  });
_p5.env.document = document;
  // --- Initialize module factories (bind p5 instance to all classes) ---
  initGlyphModels(_p5);
  initScriptModel(_p5);
  const TextBox = createTextBoxClass(_p5);
  const {
    Button,
    GuideButton,
    PathButton,
    AnchorButton,
    HandleButton,
    mouseOverRect
  } = createButtonClasses(_p5);
  const GlyphEditor = createGlyphEditorClass(_p5, {
    GuideButton,
    PathButton,
    AnchorButton,
    Path,
    Anchor,
    mouseOverRect
  });
  
  const {
    importJSON,
    exportJSON,
    importScript,
    exportScript,
    exportTextBoxSettings,
    exportAs,
    exportText_SVG,
    exportText_PNG,
    exportText_TXT,
    uploadToServer,
    importTextBoxSettings
  } = createExportUtils(_p5, {
    Script,
    setScript: _p5.env.setScript
  });
  
  const {
    AnimatedVariable,
    anyActiveAnimation,
    updateAnimation,
    setupAnimation_textBoxSettings
  } = createAnimationUtils(_p5);

  
  
  let globalPresets = [window.preset_01, window.preset_02, window.preset_03, window.preset_04, window.preset_05, window.preset_06, window.preset_07, window.preset_08];

  // Provide undeclared globals that were implicit before

  // --- FILE: secuencia/js/main.js ---

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

  let defaultTextDirectory = "presets/text/" + "Text_Default.txt";
  let defaultTextLines = [];
  let blue_semiBright = '#80C0FF';
  let glyphEditor_firstAnchorColor = _p5.env.red_medium;
  let glyphEditor_lastAnchorColor = _p5.env.red_medium;

  // –––––––––––––––––––––––––––––––––

  // Global Layout Parameter

  // –––––––––––––––––––––––––––––––––

  // TextBox Settings

  // –––––––––––––––––––––––––––––––––

  // GlyphSet

  // HTML Element

  // –––––––––––––––––––––––––––––––––

  // GlyphEditor + TextBox Tools

  // –––––––––––––––––––––––––––––––––

  // TextBox

  let textBox_width;
  let textBox_height;

  // –––––––––––––––––––––––––––––––––

  // GlyphEditor

  // HTML Element

  // –––––––––––––––––––––––––––––––––

  // GlyphEditor Tools

  let glyphEditorToolsElement; // HTML Element

  // –––––––––––––––––––––––––––––––––

  // ScriptList
  let scriptListElement; // HTML Element

  // –––––––––––––––––––––––––––––––––

  // Script
  let defaultScriptDirectories = ['01.script', '02.script', '03.script', '04.script', '05.script', '06.script', '07.script', '08.script'];

  // –––––––––––––––––––––––––––––––––

  // Animation

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Instantiate UIManager and add its methods to env
  Object.assign(_p5.env, createUIManager(_p5));
  _p5.preload = function () {
    // collect elements
    _p5.env.glyphSetElement = document.getElementById("glyphSet");
    _p5.env.glyphEditorElement = document.getElementById("glyphEditor");
    scriptListElement = document.getElementById('scriptList');
    glyphEditorToolsElement = document.getElementById('glyphEditorTools');

    // import default _p5.text(bypass CORS _p5.loadStrings)
    defaultTextLines = ["At 12:45 PM, the quick Brown Fox bought 6 juicy snacks for 7.89 and jumped over 2 Lazy Dogs at 3:00"];

    // import script file data (bypass CORS _p5.loadJSON)
    let globalPresets = [window.preset_01, window.preset_02, window.preset_03, window.preset_04, window.preset_05, window.preset_06, window.preset_07, window.preset_08];
    for (let i = 0; i < globalPresets.length; i++) {
      _p5.env.defaultScriptFiles.push(globalPresets[i]);
    }

    // _p5.translate colors
    _p5.env.backgroundColor = hexToColor(_p5.env.backgroundColor);
    _p5.env.scriptColor = hexToColor(_p5.env.scriptColor);
    _p5.env.gridColor = _p5.color(12, 140, 233, 20);
    _p5.env.gridColorLight = _p5.color(12, 140, 233, 8);
    _p5.env.hoverColor = hexToColor(_p5.env.hoverColor);
    _p5.env.activeColor = hexToColor(_p5.env.activeColor);
    _p5.env.emptyColor = hexToColor(_p5.env.emptyColor);
    _p5.env.missingColor = hexToColor(_p5.env.missingColor);
    _p5.env.glyphEditor_guideColor = _p5.color(255, 59, 48, 100);
    _p5.env.glyphEditor_anchorColor = hexToColor(_p5.env.glyphEditor_anchorColor);
    glyphEditor_firstAnchorColor = hexToColor(glyphEditor_firstAnchorColor);
    glyphEditor_lastAnchorColor = hexToColor(glyphEditor_lastAnchorColor);

    // interfaceFont = _p5.loadFont(interfaceFont); // Loaded via CSS @font-face
  };
  function saveSecuenciaState() {
    const data = {
      activeScriptIndex: _p5.env.activeScriptIndex,
      scripts: _p5.env.scripts.map(s => s.toJSON()),
      textBoxText: document.getElementById("textInput") ? document.getElementById("textInput").value : null,
      textBoxSettings: {
        size: _p5.env.size,
        wordSpace: _p5.env.wordSpace,
        letterSpace: _p5.env.letterSpace,
        lineHeight: _p5.env.lineHeight,
        letterWidth: _p5.env.letterWidth,
        letterHeight: _p5.env.letterHeight,
        slant: _p5.env.slant,
        randomSize: _p5.env.randomSize,
        randomLetterSpace: _p5.env.randomLetterSpace,
        randomLetterWidth: _p5.env.randomLetterWidth,
        randomLetterHeight: _p5.env.randomLetterHeight,
        randomSlant: _p5.env.randomSlant,
        randomBaselineOffset: _p5.env.randomBaselineOffset,
        precision: _p5.env.precision,
        scriptStrokeWeight: _p5.env.scriptStrokeWeight,
        backgroundColor: typeof _p5.env.backgroundColor === 'object' && _p5.env.backgroundColor.levels ? _p5.env.colorToHex(_p5.env.backgroundColor) : _p5.env.backgroundColor,
        scriptColor: typeof _p5.env.scriptColor === 'object' && _p5.env.scriptColor.levels ? _p5.env.colorToHex(_p5.env.scriptColor) : _p5.env.scriptColor,
        rotateAll: _p5.env.rotateAll
      }
    };
    localStorage.setItem('secuencia_autosave', JSON.stringify(data));
  }
  function loadSecuenciaState() {
    const saved = localStorage.getItem('secuencia_autosave');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data && data.scripts && data.scripts.length > 0) {
          _p5.env.scripts = [];
          data.scripts.forEach(sData => {
            let sc = new Script();
            sc.fromJSON(sData);
            _p5.env.scripts.push(sc);
          });
          
          _p5.env.activeScriptIndex = data.activeScriptIndex || 0;
          if (data.textBoxSettings) {
            _p5.env.size = data.textBoxSettings.size !== undefined ? data.textBoxSettings.size : _p5.env.size;
            _p5.env.wordSpace = data.textBoxSettings.wordSpace !== undefined ? data.textBoxSettings.wordSpace : _p5.env.wordSpace;
            _p5.env.letterSpace = data.textBoxSettings.letterSpace !== undefined ? data.textBoxSettings.letterSpace : _p5.env.letterSpace;
            _p5.env.lineHeight = data.textBoxSettings.lineHeight !== undefined ? data.textBoxSettings.lineHeight : _p5.env.lineHeight;
            _p5.env.letterWidth = data.textBoxSettings.letterWidth !== undefined ? data.textBoxSettings.letterWidth : _p5.env.letterWidth;
            _p5.env.letterHeight = data.textBoxSettings.letterHeight !== undefined ? data.textBoxSettings.letterHeight : _p5.env.letterHeight;
            _p5.env.slant = data.textBoxSettings.slant !== undefined ? data.textBoxSettings.slant : _p5.env.slant;
            _p5.env.randomSize = data.textBoxSettings.randomSize !== undefined ? data.textBoxSettings.randomSize : _p5.env.randomSize;
            _p5.env.randomLetterSpace = data.textBoxSettings.randomLetterSpace !== undefined ? data.textBoxSettings.randomLetterSpace : _p5.env.randomLetterSpace;
            _p5.env.randomLetterWidth = data.textBoxSettings.randomLetterWidth !== undefined ? data.textBoxSettings.randomLetterWidth : _p5.env.randomLetterWidth;
            _p5.env.randomLetterHeight = data.textBoxSettings.randomLetterHeight !== undefined ? data.textBoxSettings.randomLetterHeight : _p5.env.randomLetterHeight;
            _p5.env.randomSlant = data.textBoxSettings.randomSlant !== undefined ? data.textBoxSettings.randomSlant : _p5.env.randomSlant;
            _p5.env.randomBaselineOffset = data.textBoxSettings.randomBaselineOffset !== undefined ? data.textBoxSettings.randomBaselineOffset : _p5.env.randomBaselineOffset;
            _p5.env.precision = data.textBoxSettings.precision !== undefined ? data.textBoxSettings.precision : _p5.env.precision;
            _p5.env.scriptStrokeWeight = data.textBoxSettings.scriptStrokeWeight !== undefined ? data.textBoxSettings.scriptStrokeWeight : _p5.env.scriptStrokeWeight;
            if (data.textBoxSettings.backgroundColor !== undefined) {
              const bg = data.textBoxSettings.backgroundColor;
              _p5.env.backgroundColor = typeof bg === 'string' ? hexToColor(bg) : bg.levels ? _p5.color(bg.levels) : _p5.env.backgroundColor;
            }
            if (data.textBoxSettings.scriptColor !== undefined) {
              const sc = data.textBoxSettings.scriptColor;
              _p5.env.scriptColor = typeof sc === 'string' ? hexToColor(sc) : sc.levels ? _p5.color(sc.levels) : _p5.env.scriptColor;
            }
            if (data.textBoxSettings.rotateAll !== undefined && typeof _p5.env.rotateAll !== 'undefined') _p5.env.rotateAll = data.textBoxSettings.rotateAll;
          }
          if (data.textBoxText) {
            setTimeout(() => {
              const input = document.getElementById("textInput");
              if (input) {
                input.value = data.textBoxText;
                if (typeof _p5.env.textBox !== 'undefined') {
                  _p5.env.textBox.setText(_p5.env.textToArray(data.textBoxText));
                  _p5.redraw();
                }
              }
            }, 100);
          }
          return true;
        }
      } catch (e) {
        console.error("Auto-save load failed:", e);
      }
    }
    return false;
  }
  _p5.setup = function () {
    _p5.noLoop();
    let redrawPending = false;
    let saveTimeout = null;
    const triggerRedraw = () => {
      if (!redrawPending) {
        redrawPending = true;
        requestAnimationFrame(() => {
          _p5.redraw();
          redrawPending = false;
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(saveSecuenciaState, 1000);
        });
        
      }
    };
    window.addEventListener('pointermove', triggerRedraw);
    window.addEventListener('pointerdown', triggerRedraw);
    window.addEventListener('pointerup', triggerRedraw);
    window.addEventListener('keydown', triggerRedraw);
    window.addEventListener('keyup', triggerRedraw);
    window.addEventListener('input', triggerRedraw);
    window.addEventListener('wheel', triggerRedraw);
    setupCanvas();
    // setupAsync();

    if (!loadSecuenciaState()) {
      // import scripts and set active script
      for (let i = 0; i < _p5.env.defaultScriptFiles.length; i++) {
        _p5.env.scripts.push(new Script(_p5.env.defaultScriptFiles[i]));
      }
    }
    _p5.env.setScript(_p5.env.activeScriptIndex);
    _p5.env.glyphEditor = new GlyphEditor();
    _p5.env.textBox = new TextBox(defaultTextLines);
    _p5.ellipseMode(_p5.CENTER);
    _p5.rectMode(_p5.CENTER);
    setupInterface();
    setupSecuenciaListeners();
  };
  _p5.draw = function () {
    update();
    display();
  };
  function update() {
    if (anyActiveAnimation() == true) {
      updateAnimation();
    }
    _p5.env.glyphEditor.update();
  }
  function display() {
    _p5.background(_p5.env.backgroundColor);

    // Draw _p5.background reference _p5.image if uploaded
    if (_p5.env.exportActive == false && bgImage) {
      _p5.push();
      _p5.translate(_p5.width / 2 + bgOffsetX, _p5.height / 2 + bgOffsetY);
      _p5.rotate(_p5.radians(bgRotation));
      _p5.scale(bgScale / 100.0);
      _p5.imageMode(_p5.CENTER);
      _p5.tint(255, _p5.map(bgOpacity, 0, 100, 0, 255));
      _p5.image(bgImage, 0, 0);
      _p5.pop();
    }
    if (_p5.env.exportActive == false) {
      _p5.env.glyphEditor.display();
    }
    _p5.env.textBox.display();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Async function to handle the sequential execution
  // async function setupAsync() {
  //   try {
  //   } catch (_p5.random) {
  //     alert(_p5.random);
  //   }
  // }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  function colorToHex(c) {
    let r = _p5.red(c);
    let g = _p5.green(c);
    let b = _p5.blue(c);
    return rgbToHex(r, g, b);
  }
  function rgbToHex(r, g, b) {
    // Convert each color component to a two-digit hex value
    let toHex = component => {
      let hex = component.toString(16); // Convert to hex
      hex = hex.toUpperCase();
      return hex.length == 1 ? "0" + hex : hex; // Ensure two digits
    };

    // Concatenate the hex values for the final hex color code
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }
  function hexToColor(hex) {
    let c = hexToRgb(hex);
    return _p5.color(c.r, c.g, c.b);
  }
  function hexToRgb(hex) {
    // Remove the lineHeight # if present
    hex = hex.replace(/^#/, '');

    // Parse the r, g, b values
    let bigint = parseInt(hex, 16);
    let r = bigint >> 16 & 255;
    let g = bigint >> 8 & 255;
    let b = bigint & 255;
    return {
      r: r,
      g: g,
      b: b
    };
  }
  function arrayToText(array) {
    let text = '';
    for (let i = 0; i < array.length; i++) {
      text += array[i];
      if (i < array.length - 1) {
        text += '\n';
      }
    }
    return text;
  }
  function textToArray(text) {
    return text.split(/\r?\n/);
  }
  function timestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
  }
  function setRotateAll(value) {
    _p5.env.rotateAll = parseFloat(value);
    let s = document.getElementById("rotateAll");
    let num = document.getElementById("rotateAllNum");
    if (s) s.value = _p5.env.rotateAll;
    if (num) num.value = _p5.env.rotateAll;
  }
  function setBgOpacity(value) {
    bgOpacity = parseFloat(value);
    let s = document.getElementById("bgOpacity");
    let num = document.getElementById("bgOpacityNum");
    if (s) s.value = bgOpacity;
    if (num) num.value = bgOpacity;
  }
  function setBgScale(value) {
    bgScale = parseFloat(value);
    let s = document.getElementById("bgScale");
    let num = document.getElementById("bgScaleNum");
    if (s) s.value = bgScale;
    if (num) num.value = bgScale;
  }
  function setBgRotation(value) {
    bgRotation = parseFloat(value);
    let s = document.getElementById("bgRotation");
    let num = document.getElementById("bgRotationNum");
    if (s) s.value = bgRotation;
    if (num) num.value = bgRotation;
  }
  function setBgOffsetX(value) {
    bgOffsetX = parseFloat(value);
    let s = document.getElementById("bgOffsetX");
    let num = document.getElementById("bgOffsetXNum");
    if (s) s.value = bgOffsetX;
    if (num) num.value = bgOffsetX;
  }
  function setBgOffsetY(value) {
    bgOffsetY = parseFloat(value);
    let s = document.getElementById("bgOffsetY");
    let num = document.getElementById("bgOffsetYNum");
    if (s) s.value = bgOffsetY;
    if (num) num.value = bgOffsetY;
  }
  function handleBgImageUpload(file) {
    if (file) {
      let imgUrl = URL.createObjectURL(file);
      bgImage = _p5.loadImage(imgUrl);
    }
  }
  function removeBgImage() {
    bgImage = null;
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
        handleBgImageUpload(e.target.files[0]);
      });
      
    }

    // Color pickers
    let bgColorPicker = document.getElementById('bgColorPicker');
    if (bgColorPicker) {
      bgColorPicker.addEventListener('input', function (e) {
        _p5.env.backgroundColor = hexToColor(e.target.value);
        let lbl = document.getElementById('label-bg');
        if (lbl) lbl.innerText = e.target.value.toUpperCase();
        updateCanvas_parameter();
      });
      
    }
    let textColorPicker = document.getElementById('textColorPicker');
    if (textColorPicker) {
      textColorPicker.addEventListener('input', function (e) {
        _p5.env.scriptColor = hexToColor(e.target.value);
        let lbl = document.getElementById('label-text');
        if (lbl) lbl.innerText = e.target.value.toUpperCase();
        updateCanvas_parameter();
      });
      
    }

    // Sync range and number inputs for all parameters
    const syncParams = [{
      id: 'size',
      setFn: setSize,
      min: _p5.env.sizeMin,
      max: _p5.env.sizeMax,
      type: 'direct'
    }, {
      id: 'lineHeight',
      setFn: setLineHeight,
      min: _p5.env.lineHeightMin,
      max: _p5.env.lineHeightMax,
      type: 'direct'
    }, {
      id: 'scriptStrokeWeight',
      setFn: setScriptStrokeWeight,
      min: _p5.env.scriptStrokeWeightMin,
      max: _p5.env.scriptStrokeWeightMax,
      type: 'direct'
    }, {
      id: 'wordSpace',
      setFn: setWordSpace,
      min: _p5.env.wordSpaceMin,
      max: _p5.env.wordSpaceMax,
      type: 'percent_shift'
    }, {
      id: 'letterSpace',
      setFn: setLetterSpace,
      min: _p5.env.letterSpaceMin,
      max: _p5.env.letterSpaceMax,
      type: 'percent_shift'
    }, {
      id: 'letterWidth',
      setFn: setLetterWidth,
      min: _p5.env.letterWidthMin,
      max: _p5.env.letterWidthMax,
      type: 'percent_scale'
    }, {
      id: 'letterHeight',
      setFn: setLetterHeight,
      min: _p5.env.letterHeightMin,
      max: _p5.env.letterHeightMax,
      type: 'percent_scale'
    }, {
      id: 'slant',
      setFn: setSlant,
      min: _p5.env.slantMin,
      max: _p5.env.slantMax,
      type: 'slant_deg'
    }, {
      id: 'randomSize',
      setFn: setRandomSize,
      min: _p5.env.randomSizeMin,
      max: _p5.env.randomSizeMax,
      type: 'direct'
    }, {
      id: 'randomLetterSpace',
      setFn: setRandomLetterSpace,
      min: _p5.env.randomLetterSpaceMin,
      max: _p5.env.randomLetterSpaceMax,
      type: 'percent_scale'
    }, {
      id: 'randomLetterWidth',
      setFn: setRandomLetterWidth,
      min: _p5.env.randomLetterWidthMin,
      max: _p5.env.randomLetterWidthMax,
      type: 'percent_scale'
    }, {
      id: 'randomLetterHeight',
      setFn: setRandomLetterHeight,
      min: _p5.env.randomLetterHeightMin,
      max: _p5.env.randomLetterHeightMax,
      type: 'percent_scale'
    }, {
      id: 'randomSlant',
      setFn: setRandomSlant,
      min: _p5.env.randomSlantMin,
      max: _p5.env.randomSlantMax,
      type: 'slider_val'
    }, {
      id: 'randomBaselineOffset',
      setFn: setRandomBaselineOffset,
      min: _p5.env.randomBaselineOffsetMin,
      max: _p5.env.randomBaselineOffsetMax,
      type: 'slider_val'
    }, {
      id: 'precision',
      setFn: setPrecision,
      min: _p5.env.precisionMin,
      max: _p5.env.precisionMax,
      type: 'slider_val'
    }];
    syncParams.forEach(param => {
      let rangeEl = document.getElementById(param.id);
      let numEl = document.getElementById(param.id + 'Num');
      if (rangeEl && numEl) {
        // Когда пользователь двигает слайдер
        rangeEl.addEventListener('input', function () {
          param.setFn(parseFloat(rangeEl.value));
        });
        

        // Когда пользователь вводит число вручную
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

          // Устанавливаем процент слайдера
          param.setFn(percentage);
          // Синхронизируем положение слайдера
          rangeEl.value = percentage;
        });
        
      }
    });
    

    // Sync _p5.background parameters
    const bgParams = [{
      id: 'bgOpacity',
      setFn: setBgOpacity
    }, {
      id: 'bgScale',
      setFn: setBgScale
    }, {
      id: 'bgRotation',
      setFn: setBgRotation
    }, {
      id: 'bgOffsetX',
      setFn: setBgOffsetX
    }, {
      id: 'bgOffsetY',
      setFn: setBgOffsetY
    }, {
      id: 'rotateAll',
      setFn: setRotateAll
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
  window.addEventListener('message', event => {
    const data = event.data;
    if (!data) return;
    if (data.type === 'SYNC_THEME') {
      if (data.theme === 'dark') {
        _p5.env.backgroundColor = hexToColor("#1e1e1e");
        _p5.env.scriptColor = hexToColor("#ffffff");
        document.body.classList.add("theme-dark");
      } else {
        _p5.env.backgroundColor = hexToColor("#ffffff");
        _p5.env.scriptColor = hexToColor("#000000");
        document.body.classList.remove("theme-dark");
      }

      // Update color picker values in UI
      let bgPicker = document.getElementById('bgColorPicker');
      if (bgPicker) bgPicker.value = data.theme === 'dark' ? '#1e1e1e' : '#ffffff';
      let textPicker = document.getElementById('textColorPicker');
      if (textPicker) textPicker.value = data.theme === 'dark' ? '#ffffff' : '#000000';
      if (typeof updateCanvas_parameter === 'function') {
        updateCanvas_parameter();
      }
    }
  });
  
  window.addEventListener('keydown', e => {
    if (e.altKey && (e.key === 'g' || e.key === 'v' || e.key === 's' || e.key === 'п' || e.key === 'м' || e.key === 'ы')) {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'KEYDOWN_EVENT',
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          key: e.key,
          keyCode: e.keyCode
        }, '*');
      }
    }
  });
  

  // --- FILE: secuencia/js/interface.js ---

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  function setupCanvas() {
    _p5.env.secuenciaCanvas = _p5.createCanvas(_p5.env.canvasWidth, _p5.env.canvasHeight, _p5.P2D);
    _p5.canvas.id = 'secuencia';
    updateCanvas_dimensions();
  }
  _p5.windowResized = function () {
    updateCanvas_dimensions();
  };
  function updateCanvas_dimensions() {
    // canvasWidth = _p5.windowWidth;
    // canvasHeight = _p5.windowHeight;
    _p5.env.canvasWidth = document.body.getBoundingClientRect().width;
    _p5.env.canvasHeight = document.body.getBoundingClientRect().height;
    updateCanvas_layout();
    _p5.resizeCanvas(_p5.env.canvasWidth, _p5.env.canvasHeight);
    _p5.pixelDensity(2);
  }
  function updateCanvas_layout() {
    // set _p5.height of glyph editor based on canvas _p5.height
    _p5.env.glyphEditor_height = _p5.round(_p5.min(_p5.env.glyphEditor_heightMax, _p5.env.canvasHeight * 0.6) / 100) * 100;
    _p5.env.glyphEditor_height = _p5.constrain(_p5.env.glyphEditor_height, _p5.env.glyphEditor_heightMin, _p5.env.glyphEditor_heightMax);

    // set dimensios of container
    document.documentElement.style.setProperty('--toolbar_buttonSize', _p5.env.toolbar_buttonSize + 'px');
    document.documentElement.style.setProperty('--textBoxSettings_width', _p5.env.textBoxSettings_width + 'px');
    document.documentElement.style.setProperty('--glyphEditor_width', _p5.env.glyphEditor_width + 'px');
    document.documentElement.style.setProperty('--glyphEditor_height', _p5.env.glyphEditor_height + 'px');
    document.documentElement.style.setProperty('--logo_size', _p5.env.textBoxSettings_width * 0.66 + 'px');

    // rearrange glyphSetBoxes based on glyphset dimensions
    let glyphSet_boxesPerRow = _p5.round(_p5.env.glyphEditor_width / _p5.env.glyphSet_boxSize);
    let glyphSet_boxSizeFit = _p5.env.glyphEditor_width / glyphSet_boxesPerRow + (glyphSet_boxesPerRow - 1) * 0.1;
    document.documentElement.style.setProperty('--glyphSet_boxSize', glyphSet_boxSizeFit + 'px');

    // reposition glyphEditor
    if (_p5.env.glyphEditor != null) {
      let glyphEditor_xPosition = _p5.env.glyphEditorElement.getBoundingClientRect().left;
      let glyphEditor_yPosition = _p5.env.glyphEditorElement.getBoundingClientRect().top;
      _p5.env.glyphEditor.setDimensions(glyphEditor_xPosition, glyphEditor_yPosition, _p5.env.glyphEditor_width, _p5.env.glyphEditor_height);
    }

    // reposition textBox
    let textBox_xPosition = _p5.env.glyphEditor_width + _p5.env.interfaceMargin * 2;
    let textBox_yPosition = _p5.env.interfaceMargin + 50;
    let textBox_width = _p5.env.canvasWidth - _p5.env.glyphEditor_width - _p5.env.textBoxSettings_width - _p5.env.interfaceMargin * 4;
    let textBox_height = _p5.env.canvasHeight - _p5.env.interfaceMargin * 2 - 50;
    if (_p5.env.textBox != null) {
      _p5.env.textBox.setDimensions(textBox_xPosition, textBox_yPosition, textBox_width, textBox_height, _p5.env.interfaceMargin);
    }
    document.documentElement.style.setProperty('--textBox_width', textBox_width + 'px');
    document.documentElement.style.setProperty('--textBox_height', textBox_height + 'px');
    document.getElementById('textBox').style.left = textBox_xPosition + 'px';
    document.getElementById('textBox').style.top = textBox_yPosition + 'px';
  }
  function updateCanvas_parameter() {
    document.documentElement.style.setProperty('--backgroundColor', _p5.env.backgroundColor);
    document.documentElement.style.setProperty('--textColor', _p5.env.scriptColor);
    document.documentElement.style.setProperty('--textColorRGB', _p5.red(_p5.env.scriptColor) + ', ' + _p5.green(_p5.env.scriptColor) + ', ' + _p5.blue(_p5.env.scriptColor));
    document.documentElement.style.setProperty('--hoverColor', _p5.env.hoverColor);
    document.documentElement.style.setProperty('--activeColor', _p5.env.activeColor);
    document.documentElement.style.setProperty('--emptyColor', _p5.env.emptyColor);
    document.documentElement.style.setProperty('--missingColor', _p5.env.missingColor);
    document.documentElement.style.setProperty('--logoColor', _p5.env.emptyColor);
    document.documentElement.style.setProperty('--logoColorHover', _p5.env.missingColor);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  function setupInterface() {
    updateCanvas_parameter();
    updateCanvas_layout();
    _p5.env.updateInterface_glyphSet_boxes();
    _p5.env.updateInterface_textBoxSettings_state();
    _p5.env.updateInterface_textBoxSettings_label();
    _p5.env.updateInterface_glyphEditorTools_state();
    _p5.env.updateInterface_glyphEditorContext_state();
    _p5.env.updateInterface_glyphSet_state();
    _p5.env.updateInterface_scriptName();
    _p5.env.updateInterface_scriptList_label();
    _p5.env.updateInterface_scriptList_state();
    _p5.env.updateInterface_textBoxTools_state();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  // --- FILE: secuencia/js/control.js ---

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
  });
  document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
    document.body.style.zoom = 0.999999999;
  });
  document.addEventListener('gestureend', function (e) {
    e.preventDefault();
    document.body.style.zoom = 1.0;
  });

  // --- Modules imported at top of file, classes initialized via factories ---

  window.addNewScript = addNewScript;
  window.importScript = importScript;
  window.exportAs = exportAs;
  window.randomTextBoxSettings = randomTextBoxSettings;
  window.resetTextBoxSettings = resetTextBoxSettings;
  window.importTextBoxSettings = importTextBoxSettings;
  window.switchMode = switchMode;
  window.setScriptName = setScriptName;
  window.removeBgImage = removeBgImage;
  window.switchConnectionToPrev = switchConnectionToPrev;
  window.switchConnectionToNext = switchConnectionToNext;
  window.switchMainPath = switchMainPath;
  window.setSize = setSize;
  window.setLineHeight = setLineHeight;
  window.setScriptStrokeWeight = setScriptStrokeWeight;
  window.setWordSpace = setWordSpace;
  window.setLetterSpace = setLetterSpace;
  window.setLetterWidth = setLetterWidth;
  window.setLetterHeight = setLetterHeight;
  window.setSlant = setSlant;
  window.setRandomSize = setRandomSize;
  window.setRandomLetterSpace = setRandomLetterSpace;
  window.setRandomLetterWidth = setRandomLetterWidth;
  window.setRandomLetterHeight = setRandomLetterHeight;
  window.setRandomSlant = setRandomSlant;
  window.setRandomBaselineOffset = setRandomBaselineOffset;
  window.setPrecision = setPrecision;
  window.setRotateAll = setRotateAll;
  window.setBgOpacity = setBgOpacity;
  window.setBgScale = setBgScale;
  window.setBgRotation = setBgRotation;
  window.setBgOffsetX = setBgOffsetX;
  window.setBgOffsetY = setBgOffsetY;
  window.setGlyph = _p5.env.setGlyph;
  window.setGlyphName = setGlyphName;
  window.clearGlyph = clearGlyph;
  window.setText = setText;

  // Added missing UI handlers
  window.setScript = _p5.env.setScript;
  window.nextScript = nextScript;
  window.prevScript = prevScript;
  window.switchTextBoxDisplayInfo = switchTextBoxDisplayInfo;
  window.setTextBoxDisplayInfo = setTextBoxDisplayInfo;
  bindEvents(_p5);
};