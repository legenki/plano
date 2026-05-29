import { createMathUtils } from '../../shared/utils/MathUtils.js';
import { createHelpers } from "../../shared/utils/Helpers.js";
import { createAppController } from "./controllers/AppController.js";
import { env } from "./Config.js";
import { diffAndUpdateDOM } from '../../js/ui-utils.js';
import { initGlyphModels, Glyph, Path, Anchor, Handle } from './models/Glyph.js';
import { createUIManager } from './ui/UIManager.js';
import { bindEvents } from './controllers/Events.js';
import { initScriptModel, Script } from './models/Script.js';
import { createTextBoxClass } from './models/TextBox.js';
import { createGlyphEditorClass } from './ui/GlyphEditor.js';
import { createButtonClasses } from './ui/Buttons.js';
import { createExportUtils } from '../../shared/utils/Export.js';
import { createAnimationUtils } from './utils/Animation.js';
import preset01 from '../presets/script/01.js';
import preset02 from '../presets/script/02.js';
import preset03 from '../presets/script/03.js';
import preset04 from '../presets/script/04.js';
import preset05 from '../presets/script/05.js';
import preset06 from '../presets/script/06.js';
import preset07 from '../presets/script/07.js';
import preset08 from '../presets/script/08.js';
const presets = [preset01, preset02, preset03, preset04, preset05, preset06, preset07, preset08];
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
    HandleButton} = createButtonClasses(_p5);
  const GlyphEditor = createGlyphEditorClass(_p5, {
    GuideButton,
    PathButton,
    AnchorButton,
    Path,
    Anchor});
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
    setScript: value => _p5.env.setScript(value)
  });
  const {
    AnimatedVariable,
    anyActiveAnimation,
    updateAnimation,
    setupAnimation_textBoxSettings
  } = createAnimationUtils(_p5);
  _p5.env.setupAnimation_textBoxSettings = setupAnimation_textBoxSettings;

  // Provide undeclared globals that were implicit before

  // --- FILE: secuencia/js/main.js ---

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Default Controllable Parameter

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Controllable Parameter

  // –––––––––––––––––––––––––––––––––

  // Global Parameter

  let defaultTextDirectory = "presets/text/" + "Text_Default.txt";
  let defaultTextLines = [];
  let blue_semiBright = '#80C0FF';
  let glyphEditor_firstAnchorColor = _p5.env.color_redMedium;
  let glyphEditor_lastAnchorColor = _p5.env.color_redMedium;

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
  // Expose shared utilities to env before UIManager is created
  _p5.env.diffAndUpdateDOM = diffAndUpdateDOM;
  // Instantiate UIManager and add its methods to env
  Object.assign(_p5.env, createUIManager(_p5));
  Object.assign(_p5.env, createHelpers(_p5), createMathUtils(_p5));
  Object.assign(_p5.env, createAppController(_p5, { Script }));
  _p5.preload = function () {
    // collect elements
    _p5.env.glyphSetElement = document.getElementById("glyphSet");
    _p5.env.glyphEditorElement = document.getElementById("glyphEditor");
    scriptListElement = document.getElementById('scriptList');
    glyphEditorToolsElement = document.getElementById('glyphEditorTools');

    // import default _p5.text(bypass CORS _p5.loadStrings)
    defaultTextLines = ["At 12:45 PM, the quick Brown Fox bought 6 juicy snacks for 7.89 and jumped over 2 Lazy Dogs at 3:00"];

    for (const preset of presets) {
      _p5.env.defaultScriptFiles.push(preset);
    }

    // _p5.translate colors
    _p5.env.backgroundColor = _p5.env.hexToColor(_p5.env.backgroundColor);
    _p5.env.scriptColor = _p5.env.hexToColor(_p5.env.scriptColor);
    _p5.env.gridColor = _p5.color(12, 140, 233, 20);
    _p5.env.gridColorLight = _p5.color(12, 140, 233, 8);
    _p5.env.hoverColor = _p5.env.hexToColor(_p5.env.hoverColor);
    _p5.env.activeColor = _p5.env.hexToColor(_p5.env.activeColor);
    _p5.env.emptyColor = _p5.env.hexToColor(_p5.env.emptyColor);
    _p5.env.missingColor = _p5.env.hexToColor(_p5.env.missingColor);
    _p5.env.glyphEditor_guideColor = _p5.color(255, 59, 48, 100);
    _p5.env.glyphEditor_anchorColor = _p5.env.hexToColor(_p5.env.glyphEditor_anchorColor);
    glyphEditor_firstAnchorColor = _p5.env.hexToColor(glyphEditor_firstAnchorColor);
    glyphEditor_lastAnchorColor = _p5.env.hexToColor(glyphEditor_lastAnchorColor);

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
              _p5.env.backgroundColor = typeof bg === 'string' ? _p5.env.hexToColor(bg) : bg.levels ? _p5.color(bg.levels) : _p5.env.backgroundColor;
            }
            if (data.textBoxSettings.scriptColor !== undefined) {
              const sc = data.textBoxSettings.scriptColor;
              _p5.env.scriptColor = typeof sc === 'string' ? _p5.env.hexToColor(sc) : sc.levels ? _p5.color(sc.levels) : _p5.env.scriptColor;
            }
            if (data.textBoxSettings.rotateAll !== undefined && typeof _p5.env.rotateAll !== 'undefined') _p5.env.rotateAll = data.textBoxSettings.rotateAll;
          }
          if (data.textBoxText) {
            setTimeout(() => {
              const input = document.getElementById("textInput");
              if (input) {
                input.value = data.textBoxText;
                if (_p5.env.textBox != null) {
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
      if (!redrawPending && document.getElementById('app-secuencia').classList.contains('active')) {
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
    setupCanvas();
    _p5.canvas.addEventListener('wheel', triggerRedraw);
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
    _p5.env.setupSecuenciaListeners();
  };
  _p5.draw = function () {
    update();
    display();
  };
  function update() {
    if (anyActiveAnimation() == true) {
      updateAnimation();
      if (anyActiveAnimation() == false) {
        _p5.noLoop();
      }
    }
    _p5.env.glyphEditor.update();
  }
  function display() {
    _p5.background(_p5.env.backgroundColor);

    // Draw _p5.background reference _p5.image if uploaded
    if (_p5.env.exportActive == false && _p5.env.bgImage) {
      _p5.push();
      _p5.translate(_p5.width / 2 + _p5.env.bgOffsetX, _p5.height / 2 + _p5.env.bgOffsetY);
      _p5.rotate(_p5.radians(_p5.env.bgRotation));
      _p5.scale(_p5.env.bgScale / 100.0);
      _p5.imageMode(_p5.CENTER);
      _p5.tint(255, _p5.map(_p5.env.bgOpacity, 0, 100, 0, 255));
      _p5.image(_p5.env.bgImage, 0, 0);
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

  
  
  
  
  // Parent communication listeners for Plano integration
  window.addEventListener('message', event => {
    const data = event.data;
    if (!data) return;
    if (data.type === 'SYNC_THEME') {
      if (data.theme === 'dark') {
        _p5.env.backgroundColor = _p5.env.hexToColor("#1e1e1e");
        _p5.env.scriptColor = _p5.env.hexToColor("#ffffff");
        document.body.classList.add("theme-dark");
      } else {
        _p5.env.backgroundColor = _p5.env.hexToColor("#ffffff");
        _p5.env.scriptColor = _p5.env.hexToColor("#000000");
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
    const toHex = c => typeof c === 'object' && c !== null ? _p5.env.colorToHex(c) : c;
    document.documentElement.style.setProperty('--backgroundColor', toHex(_p5.env.backgroundColor));
    document.documentElement.style.setProperty('--textColor', toHex(_p5.env.scriptColor));
    document.documentElement.style.setProperty('--textColorRGB', _p5.red(_p5.env.scriptColor) + ', ' + _p5.green(_p5.env.scriptColor) + ', ' + _p5.blue(_p5.env.scriptColor));
    document.documentElement.style.setProperty('--hoverColor', toHex(_p5.env.hoverColor));
    document.documentElement.style.setProperty('--activeColor', toHex(_p5.env.activeColor));
    document.documentElement.style.setProperty('--emptyColor', toHex(_p5.env.emptyColor));
    document.documentElement.style.setProperty('--missingColor', toHex(_p5.env.missingColor));
    document.documentElement.style.setProperty('--logoColor', toHex(_p5.env.emptyColor));
    document.documentElement.style.setProperty('--logoColorHover', toHex(_p5.env.missingColor));
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

  // --- FILE: secuencia/js/control.js ---

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // glyphEditorTools

  

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // glyphEditorContext

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // glyphEditor

  

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // script

  

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

  window.addNewScript = _p5.env.addNewScript;
  window.importScript = importScript;
  window.exportAs = exportAs;
  window.randomTextBoxSettings = _p5.env.randomTextBoxSettings;
  window.resetTextBoxSettings = _p5.env.resetTextBoxSettings;
  window.importTextBoxSettings = importTextBoxSettings;
  window.switchMode = _p5.env.switchMode;
  window.setScriptName = _p5.env.setScriptName;
  window.removeBgImage = _p5.env.removeBgImage;
  window.switchConnectionToPrev = _p5.env.switchConnectionToPrev;
  window.switchConnectionToNext = _p5.env.switchConnectionToNext;
  window.switchMainPath = _p5.env.switchMainPath;
  window.setSize = _p5.env.setSize;
  window.setLineHeight = _p5.env.setLineHeight;
  window.setScriptStrokeWeight = _p5.env.setScriptStrokeWeight;
  window.setWordSpace = _p5.env.setWordSpace;
  window.setLetterSpace = _p5.env.setLetterSpace;
  window.setLetterWidth = _p5.env.setLetterWidth;
  window.setLetterHeight = _p5.env.setLetterHeight;
  window.setSlant = _p5.env.setSlant;
  window.setRandomSize = _p5.env.setRandomSize;
  window.setRandomLetterSpace = _p5.env.setRandomLetterSpace;
  window.setRandomLetterWidth = _p5.env.setRandomLetterWidth;
  window.setRandomLetterHeight = _p5.env.setRandomLetterHeight;
  window.setRandomSlant = _p5.env.setRandomSlant;
  window.setRandomBaselineOffset = _p5.env.setRandomBaselineOffset;
  window.setPrecision = _p5.env.setPrecision;
  window.setRotateAll = _p5.env.setRotateAll;
  window.setBgOpacity = _p5.env.setBgOpacity;
  window.setBgScale = _p5.env.setBgScale;
  window.setBgRotation = _p5.env.setBgRotation;
  window.setBgOffsetX = _p5.env.setBgOffsetX;
  window.setBgOffsetY = _p5.env.setBgOffsetY;
  window.setGlyph = _p5.env.setGlyph;
  window.setGlyphName = _p5.env.setGlyphName;
  window.clearGlyph = _p5.env.clearGlyph;
  window.setText = _p5.env.setText;

  // Added missing UI handlers
  window.setScript = _p5.env.setScript;
  window.nextScript = _p5.env.nextScript;
  window.prevScript = _p5.env.prevScript;
  window.switchTextBoxDisplayInfo = _p5.env.switchTextBoxDisplayInfo;
  window.setTextBoxDisplayInfo = _p5.env.setTextBoxDisplayInfo;
  window.resetScript = _p5.env.resetScript;
  window.toggleDropDown = _p5.env.toggleDropDown;
  window.showPrompt = _p5.env.showPrompt;
  window.closePrompt = _p5.env.closePrompt;
  bindEvents(_p5);
};