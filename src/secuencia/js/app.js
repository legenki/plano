export const secuenciaSketch = (_p5) => {

// Proxy document to remap prefixed IDs for secuencia
const document = new Proxy(window.document, {
  get: function(target, prop) {
    if (prop === 'getElementById') {
      return function(id) {
        let mapped = id;
        if (id === 'snackbar') mapped = 'secuencia-snackbar';
        else if (id === 'canvas-container') mapped = 'secuencia-canvas';
        else if (!id.startsWith('s-')) mapped = 's-' + id;
        
        let el = target.getElementById(mapped);
        return el ? el : target.getElementById(id);
      };
    }
    const val = target[prop];
    return typeof val === 'function' ? val.bind(target) : val;
  }
});

let globalPresets = [
    window.preset_01,
    window.preset_02,
    window.preset_03,
    window.preset_04,
    window.preset_05,
    window.preset_06,
    window.preset_07,
    window.preset_08
];

// Provide undeclared globals that were implicit before
let isHovering = false;
let script_xHeight;
let script_ascenderHeight;
let script_descenderHeight;
let script_defaultGlyphWidth;
let script_defaultWordSpace;




// --- FILE: secuencia/js/main.js ---


let developerMode = false;
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Default Controllable Parameter

let lineHeight_DEFAULT = 60;
let scriptStrokeWeight_DEFAULT = 2.5;
let size_DEFAULT = 80;

let wordSpace_DEFAULT = 0;
let letterSpace_DEFAULT = 0;
let letterWidth_DEFAULT = 1.0;
let letterHeight_DEFAULT = 1.0;
let slant_DEFAULT = 0;

let randomSize_DEFAULT = 0;
let randomLetterSpace_DEFAULT = 0;
let randomLetterWidth_DEFAULT = 0;
let randomLetterHeight_DEFAULT = 0;
let randomSlant_DEFAULT = 0;
let randomBaselineOffset_DEFAULT = 0;

let rotateAll = 0;
let bgImage = null;
let bgOpacity = 50;
let bgScale = 100;
let bgRotation = 0;
let bgOffsetX = 0;
let bgOffsetY = 0;

let precision_DEFAULT = 0;

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// Controllable Parameter

let lineHeight = lineHeight_DEFAULT;
let lineHeightMin = 20;
let lineHeightMax = 500;

let scriptStrokeWeight = scriptStrokeWeight_DEFAULT;
let scriptStrokeWeightMin = 1;
let scriptStrokeWeightMax = 10;

let size = size_DEFAULT;
let sizeMin = 20;
let sizeMax = 400;

let wordSpace = wordSpace_DEFAULT;
let wordSpaceMin = 0;
let wordSpaceMax = 2;

let letterSpace = letterSpace_DEFAULT;
let letterSpaceMin = 0;
let letterSpaceMax = 1;

let letterWidth = letterWidth_DEFAULT;
let letterWidthMin = 0.25;
let letterWidthMax = 5;

let letterHeight = letterHeight_DEFAULT;
let letterHeightMin = 0.25;
let letterHeightMax = 5;

let slant = slant_DEFAULT;
let slantMin = -1;
let slantMax = 1;

let randomSize = randomSize_DEFAULT;
let randomSizeMin = 0;
let randomSizeMax = 200;

let randomLetterSpace = randomLetterSpace_DEFAULT;
let randomLetterSpaceMin = 0;
let randomLetterSpaceMax = 1.5;

let randomLetterWidth = randomLetterWidth_DEFAULT;
let randomLetterWidthMin = 0;
let randomLetterWidthMax = 5;

let randomLetterHeight = randomLetterHeight_DEFAULT;
let randomLetterHeightMin = 0;
let randomLetterHeightMax = 5;

let randomSlant = randomSlant_DEFAULT;
let randomSlantMin = 0;
let randomSlantMax = 2;

let randomBaselineOffset = randomBaselineOffset_DEFAULT;
let randomBaselineOffsetMin = 0;
let randomBaselineOffsetMax = 1;

let precision = precision_DEFAULT;
let precisionMin = 1;
let precisionMax = 0;

// –––––––––––––––––––––––––––––––––

// Global Parameter

let defaultTextDirectory = "presets/text/" + "Text_Default.txt";
let defaultTextLines = [];
let basicLatin = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.:!?";

let hersheyAlphabet = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
let hersheyBaseIndex = hersheyAlphabet.indexOf('R');
let hersheyScale = 45;
let hersheyShift = (30 / hersheyScale) * 0.3;

let blue_dark = '#004080';
let blue_bright = '#000000';
let blue_semiBright = '#80C0FF';
let blue_medium = '#BFDFFF';
let blue_light = '#CCE6FF';

let red_bright = '#FF0000';
let red_semiBright = '#FFAAAA';
let red_medium = '#FFCCCC';
let red_light = '#FFE6E6';
let white = '#FFFFFF';

let backgroundColor = white;
let scriptColor = blue_bright;
let gridColor = red_medium;
let gridColorLight = red_light;

let hoverColor = blue_medium;
let activeColor = blue_bright;
let emptyColor = red_light;
let missingColor = red_semiBright;

let glyphEditor_anchorColor = blue_bright;
let glyphEditor_firstAnchorColor = red_medium;
let glyphEditor_lastAnchorColor = red_medium;
let glyphEditor_guideColor = '#FF3B30';

let interfaceStrokeWeight = 1;

// –––––––––––––––––––––––––––––––––

// Global Layout Parameter

let secuenciaCanvas;
let canvasWidth, canvasHeight;
let interfaceMargin = 20;
let exportActive = false;
let exportSVGActive = false;
let svgCanvas;
let interfaceFont = 'StrokeWeight';
let interfaceFontSize = 15;

// –––––––––––––––––––––––––––––––––

// TextBox Settings

let textBoxSettings_width = 250;

let textBoxSettings_animation;

let textBoxSettingsFileName_DEFAULT = "mySettings"
let textBoxSettingsFileName = textBoxSettingsFileName_DEFAULT;
let textBoxSettingsFileExtension = ".settings";

let graphicFileName_DEFAULT = "myText";
let graphicFileName = graphicFileName_DEFAULT;

// –––––––––––––––––––––––––––––––––

// GlyphSet

let glyphSetElement; // HTML Element
let glyphSet_boxSize = 40;
let glyphSet_missingLink = '�';

// –––––––––––––––––––––––––––––––––

// GlyphEditor + TextBox Tools

let toolbar_buttonSize = 30;

// –––––––––––––––––––––––––––––––––

// TextBox

let textBox;
let textBox_width;
let textBox_height;

// –––––––––––––––––––––––––––––––––

// GlyphEditor

let glyphEditor;
let glyphEditorElement;  // HTML Element

let glyphEditor_width = 500;
let glyphEditor_heightMin = 300;
let glyphEditor_heightMax = 625;
let glyphEditor_height = glyphEditor_heightMax;
let glyphEditor_gridSize_DEFAULT = 5;
let glyphEditor_gridsPerSegment_DEFAULT = 4;
let glyphEditor_scriptStrokeWeight_DEFAULT = 5;
let glyphEditor_buttonSizeBig_DEFAULT = 16;
let glyphEditor_buttonSizeSmall_DEFAULT = glyphEditor_buttonSizeBig_DEFAULT / 2;

// –––––––––––––––––––––––––––––––––

// GlyphEditor Tools

let glyphEditorToolsElement;  // HTML Element

// –––––––––––––––––––––––––––––––––

// ScriptList
let scriptListElement; // HTML Element

// –––––––––––––––––––––––––––––––––

// Script
let defaultScriptDirectories = ['01.script', '02.script', '03.script', '04.script', '05.script', '06.script', '07.script', '08.script'];
let defaultScriptFiles = [];

let scripts = [];
let activeScriptIndex = 0;
let activeScript;

let script_xHeight_DEFAULT = 0.25;
let script_ascenderHeight_DEFAULT = 0.5;
let script_descenderHeight_DEFAULT = -0.2;
let script_glyphWidth_DEFAULT = 0.3;
let script_wordSpace_DEFAULT = 0.4;

let scriptName_DEFAULT = "myScript";
let scriptFileExtension = ".script";

// –––––––––––––––––––––––––––––––––

// Animation

let animations = [];


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

_p5.preload = function() {

  // collect elements
  glyphSetElement = document.getElementById("glyphSet");
  glyphEditorElement = document.getElementById("glyphEditor");
  scriptListElement = document.getElementById('scriptList');
  glyphEditorToolsElement = document.getElementById('glyphEditorTools');

  // import default _p5.text(bypass CORS _p5.loadStrings)
  defaultTextLines = ["At 12:45 PM, the quick Brown Fox bought 6 juicy snacks for 7.89 and jumped over 2 Lazy Dogs at 3:00"];

  // import script file data (bypass CORS _p5.loadJSON)
  let globalPresets = [
    window.preset_01,
    window.preset_02,
    window.preset_03,
    window.preset_04,
    window.preset_05,
    window.preset_06,
    window.preset_07,
    window.preset_08
  ];
  for (let i = 0; i < globalPresets.length; i++) {
    defaultScriptFiles.push(globalPresets[i]);
  }

  // _p5.translate colors
  backgroundColor = hexToColor(backgroundColor);
  scriptColor = hexToColor(scriptColor);
  gridColor = _p5.color(12, 140, 233, 20);
  gridColorLight = _p5.color(12, 140, 233, 8);
  hoverColor = hexToColor(hoverColor);
  activeColor = hexToColor(activeColor);
  emptyColor = hexToColor(emptyColor);
  missingColor = hexToColor(missingColor);
  glyphEditor_guideColor = _p5.color(255, 59, 48, 100);
  glyphEditor_anchorColor = hexToColor(glyphEditor_anchorColor);
  glyphEditor_firstAnchorColor = hexToColor(glyphEditor_firstAnchorColor);
  glyphEditor_lastAnchorColor = hexToColor(glyphEditor_lastAnchorColor);

  // interfaceFont = _p5.loadFont(interfaceFont); // Loaded via CSS @font-face
}

_p5.setup = function() {
  setupCanvas();
  // setupAsync();

  // import scripts and set active script
  for (let i = 0; i < defaultScriptFiles.length; i++) {
    scripts.push(new Script(defaultScriptFiles[i]));
  }
  setScript(activeScriptIndex);

  glyphEditor = new GlyphEditor();

  textBox = new TextBox(defaultTextLines);

  _p5.ellipseMode(_p5.CENTER);
  _p5.rectMode(_p5.CENTER);

  setupInterface();
  setupSecuenciaListeners();
}

_p5.draw = function() {
  update();
  display();
}

function update() {
  if (anyActiveAnimation() == true) {
    updateAnimation();
  }
  glyphEditor.update();
}

function display() {
  _p5.background(backgroundColor);

  // Draw _p5.background reference _p5.image if uploaded
  if (exportActive == false && bgImage) {
    _p5.push();
    _p5.translate(_p5.width / 2 + bgOffsetX, _p5.height / 2 + bgOffsetY);
    _p5.rotate(_p5.radians(bgRotation));
    _p5.scale(bgScale / 100.0);
    _p5.imageMode(_p5.CENTER);
    _p5.tint(255, _p5.map(bgOpacity, 0, 100, 0, 255));
    _p5.image(bgImage, 0, 0);
    _p5.pop();
  }

  if (exportActive == false) {
    glyphEditor.display();
  }
  textBox.display();
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
  return rgbToHex(r, g, b)
}

function rgbToHex(r, g, b) {
  // Convert each color component to a two-digit hex value
  let toHex = (component) => {
    let hex = component.toString(16); // Convert to hex
    hex = hex.toUpperCase();
    return hex.length == 1 ? "0" + hex : hex; // Ensure two digits
  };

  // Concatenate the hex values for the final hex color code
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToColor(hex) {
  let c = hexToRgb(hex)
  return _p5.color(c.r, c.g, c.b);
}

function hexToRgb(hex) {
  // Remove the lineHeight # if present
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r: r, g: g, b: b };
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
  return text.split(/\r?\n/)
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
  rotateAll = parseFloat(value);
  let s = document.getElementById("rotateAll");
  let num = document.getElementById("rotateAllNum");
  if (s) s.value = rotateAll;
  if (num) num.value = rotateAll;
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
      backgroundColor = hexToColor(e.target.value);
      let lbl = document.getElementById('label-bg');
      if (lbl) lbl.innerText = e.target.value.toUpperCase();
      updateCanvas_parameter();
    });
  }

  let textColorPicker = document.getElementById('textColorPicker');
  if (textColorPicker) {
    textColorPicker.addEventListener('input', function (e) {
      scriptColor = hexToColor(e.target.value);
      let lbl = document.getElementById('label-text');
      if (lbl) lbl.innerText = e.target.value.toUpperCase();
      updateCanvas_parameter();
    });
  }

  // Sync range and number inputs for all parameters
  const syncParams = [
    { id: 'size', setFn: setSize, min: sizeMin, max: sizeMax, type: 'direct' },
    { id: 'lineHeight', setFn: setLineHeight, min: lineHeightMin, max: lineHeightMax, type: 'direct' },
    { id: 'scriptStrokeWeight', setFn: setScriptStrokeWeight, min: scriptStrokeWeightMin, max: scriptStrokeWeightMax, type: 'direct' },
    { id: 'wordSpace', setFn: setWordSpace, min: wordSpaceMin, max: wordSpaceMax, type: 'percent_shift' },
    { id: 'letterSpace', setFn: setLetterSpace, min: letterSpaceMin, max: letterSpaceMax, type: 'percent_shift' },
    { id: 'letterWidth', setFn: setLetterWidth, min: letterWidthMin, max: letterWidthMax, type: 'percent_scale' },
    { id: 'letterHeight', setFn: setLetterHeight, min: letterHeightMin, max: letterHeightMax, type: 'percent_scale' },
    { id: 'slant', setFn: setSlant, min: slantMin, max: slantMax, type: 'slant_deg' },
    { id: 'randomSize', setFn: setRandomSize, min: randomSizeMin, max: randomSizeMax, type: 'direct' },
    { id: 'randomLetterSpace', setFn: setRandomLetterSpace, min: randomLetterSpaceMin, max: randomLetterSpaceMax, type: 'percent_scale' },
    { id: 'randomLetterWidth', setFn: setRandomLetterWidth, min: randomLetterWidthMin, max: randomLetterWidthMax, type: 'percent_scale' },
    { id: 'randomLetterHeight', setFn: setRandomLetterHeight, min: randomLetterHeightMin, max: randomLetterHeightMax, type: 'percent_scale' },
    { id: 'randomSlant', setFn: setRandomSlant, min: randomSlantMin, max: randomSlantMax, type: 'slider_val' },
    { id: 'randomBaselineOffset', setFn: setRandomBaselineOffset, min: randomBaselineOffsetMin, max: randomBaselineOffsetMax, type: 'slider_val' },
    { id: 'precision', setFn: setPrecision, min: precisionMin, max: precisionMax, type: 'slider_val' }
  ];

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
          let phys = (val / 100) - 1;
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
  const bgParams = [
    { id: 'bgOpacity', setFn: setBgOpacity },
    { id: 'bgScale', setFn: setBgScale },
    { id: 'bgRotation', setFn: setBgRotation },
    { id: 'bgOffsetX', setFn: setBgOffsetX },
    { id: 'bgOffsetY', setFn: setBgOffsetY },
    { id: 'rotateAll', setFn: setRotateAll }
  ];

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
window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'SYNC_THEME') {
    if (data.theme === 'dark') {
      backgroundColor = hexToColor("#1e1e1e");
      scriptColor = hexToColor("#ffffff");
      document.body.classList.add("theme-dark");
    } else {
      backgroundColor = hexToColor("#ffffff");
      scriptColor = hexToColor("#000000");
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

window.addEventListener('keydown', (e) => {
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

  secuenciaCanvas = _p5.createCanvas(canvasWidth, canvasHeight, _p5.P2D);
  _p5.canvas.id = 'secuencia';
  updateCanvas_dimensions();
}

_p5.windowResized = function() {
  updateCanvas_dimensions();
}

function updateCanvas_dimensions() {
  // canvasWidth = _p5.windowWidth;
  // canvasHeight = _p5.windowHeight;
  canvasWidth = document.body.getBoundingClientRect().width;
  canvasHeight = document.body.getBoundingClientRect().height;

  updateCanvas_layout();
  _p5.resizeCanvas(canvasWidth, canvasHeight);
  _p5.pixelDensity(2);
}

function updateCanvas_layout() {

  // set _p5.height of glyph editor based on canvas _p5.height
  glyphEditor_height = _p5.round(_p5.min(glyphEditor_heightMax, canvasHeight * 0.6) / 100) * 100;
  glyphEditor_height = _p5.constrain(glyphEditor_height, glyphEditor_heightMin, glyphEditor_heightMax);

  // set dimensios of container
  document.documentElement.style.setProperty('--toolbar_buttonSize', toolbar_buttonSize + 'px');
  document.documentElement.style.setProperty('--textBoxSettings_width', textBoxSettings_width + 'px');
  document.documentElement.style.setProperty('--glyphEditor_width', glyphEditor_width + 'px');
  document.documentElement.style.setProperty('--glyphEditor_height', glyphEditor_height + 'px');
  document.documentElement.style.setProperty('--logo_size', textBoxSettings_width * 0.66 + 'px');

  // rearrange glyphSetBoxes based on glyphset dimensions
  let glyphSet_boxesPerRow = _p5.round(glyphEditor_width / glyphSet_boxSize);
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
  let textBox_yPosition = interfaceMargin + 50;
  let textBox_width = canvasWidth - glyphEditor_width - textBoxSettings_width - interfaceMargin * 4;
  let textBox_height = canvasHeight - interfaceMargin * 2 - 50;
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
  document.documentElement.style.setProperty('--textColorRGB', _p5.red(scriptColor) + ', ' + _p5.green(scriptColor) + ', ' + _p5.blue(scriptColor));
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
    glyphEditorContextElement.style.left = _p5.mouseX + 'px';
    glyphEditorContextElement.style.top = _p5.mouseY + 'px';

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
  document.getElementById("scriptName").value = activeScript.name;
}

function updateInterface_scriptList_label() {

  // _p5.clear list
  scriptListElement.innerHTML = '';

  // add list elements
  scripts.forEach((script, index) => {
    const li = document.createElement('li');
    li.textContent = script.name; // Set the visible text
    li.setAttribute('onclick', `setScript('${index}')`); // Set the onclick functionality
    document.getElementById("scriptList").appendChild(li); // Add the <li> to the list
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
  
  // Sliders (0..100 _p5.map)
  document.getElementById("size").value = _p5.map(size, sizeMin, sizeMax, 0, 100);
  document.getElementById("scriptStrokeWeight").value = _p5.map(scriptStrokeWeight, scriptStrokeWeightMin, scriptStrokeWeightMax, 0, 100);
  document.getElementById("wordSpace").value = _p5.map(wordSpace, wordSpaceMin, wordSpaceMax, 0, 100);
  document.getElementById("letterSpace").value = _p5.map(letterSpace, letterSpaceMin, letterSpaceMax, 0, 100);
  document.getElementById("lineHeight").value = _p5.map(lineHeight, lineHeightMin, lineHeightMax, 0, 100);
  document.getElementById("letterWidth").value = _p5.map(letterWidth, letterWidthMin, letterWidthMax, 0, 100);
  document.getElementById("letterHeight").value = _p5.map(letterHeight, letterHeightMin, letterHeightMax, 0, 100);
  document.getElementById("slant").value = _p5.map(slant, slantMin, slantMax, 0, 100);
  
  document.getElementById("randomSize").value = _p5.map(randomSize, randomSizeMin, randomSizeMax, 0, 100);
  document.getElementById("randomLetterSpace").value = _p5.map(randomLetterSpace, randomLetterSpaceMin, randomLetterSpaceMax, 0, 100);
  document.getElementById("randomLetterWidth").value = _p5.map(randomLetterWidth, randomLetterWidthMin, randomLetterWidthMax, 0, 100);
  document.getElementById("randomLetterHeight").value = _p5.map(randomLetterHeight, randomLetterHeightMin, randomLetterHeightMax, 0, 100);
  document.getElementById("randomSlant").value = _p5.map(randomSlant, randomSlantMin, randomSlantMax, 0, 100);
  document.getElementById("randomBaselineOffset").value = _p5.map(randomBaselineOffset, randomBaselineOffsetMin, randomBaselineOffsetMax, 0, 100);
  document.getElementById("precision").value = _p5.map(precision, precisionMin, precisionMax, 0, 100);
  
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
  document.getElementById("slantNum").value = Math.round(slant * 45); // convert to _p5.degrees approximately

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

// --- FILE: secuencia/js/control.js ---

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

_p5.mousePressed = function() {

  if (_p5.mouseButton == "right" || event.ctrlKey) {
    if (glyphEditor.isHovered == true) {
      glyphEditor.handleRightClick();
    }
  }

}

_p5.mouseDragged = function() {
  glyphEditor.handleDrag();
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

_p5.keyPressed = function() {

  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
    return;
  }

  if (_p5.key == 'Alt') {
    if (glyphEditor) glyphEditor.handleAlt('pressed');
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
    if (glyphEditor) glyphEditor.handleDelete();
  } else if (_p5.key == 'Escape') {
    if (glyphEditor) glyphEditor.handleEscape();
  } else if (_p5.key == 'Alt') {
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

// --- FILE: secuencia/js/textBox.js ---

class TextBox {

  constructor(tL) {

    this.seed = _p5.random(1000);

    this.position = _p5.createVector(0, 0);
    this.width;
    this.height;
    this.padding;

    this.setText(tL);

    this.tempSize;
    this.tempWordsSpace
    this.tempSpacing;
    this.tempLetterWidth;
    this.tempLetterHeight;
    this.tempSlant;
    this.temBaselineOffset;

    this.noiseIndex;

    this.prevGlyph;
    this.currGlyph;
    this.nextGlyph;

    this.resetX;
    this.resetY;

    this.currGlyphX;
    this.currGlyphY;

    this.prevAnchorX;
    this.prevAnchorY;
    this.prevHandleX;
    this.prevHandleY;

    this.displayPathsCollection;
    this.tempWordDisplayPaths;
    this.tempWordDisplayPathsLevels;

    this.displayMissingCollection;
    this.tempWordDisplayMissing;

    this.displayInfo = true;

    this.reset();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setDimensions(x, y, w, h, p) {
    this.position = _p5.createVector(x, y);
    this.width = w;
    this.height = h;
    this.padding = p;
    this.reset();
  }

  setText(input) {
    this.textLines = input;
  }

  reset() {
    this.tempSize = size;
    this.tempWordSpace = (activeScript.wordSpace) * this.tempSize * 0.8 * (1 + wordSpace);

    this.tempSlant = slant;
    this.tempLetterSpace = letterSpace;
    this.tempLetterWidth = letterWidth;
    this.tempLetterHeight = letterHeight;
    this.temBaselineOffset = 0;

    this.prevGlyph = null;
    this.currGlyph = null;
    this.nextGlyph = null;

    this.resetX = this.position.x + this.padding;
    this.resetY = this.position.y + this.padding + lineHeight;

    this.currGlyphX = this.resetX;
    this.currGlyphY = this.resetY;

    this.prevAnchorX = 0;
    this.prevAnchorY = 0;
    this.prevHandleX = 0;
    this.prevHandleY = 0;

    this.noiseIndex = 0;

    this.displayPathsCollection = [];
    this.tempWordDisplayPaths = [];
    this.tempWordDisplayPathsLevels = [];

    this.displayMissingCollection = [];
    this.tempWordDisplayMissing = [];
  }

  switchDisplayInfo() {
    this.displayInfo = !this.displayInfo;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  display() {

    this.update();

    if (exportActive == false) {
      if (this.displayInfo) {
        this.displayLines();
        this.displayMissingGlyphs();
      }
    }

    this.displayPaths();

  }

  displayLines() {

    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(gridColor);

    let totalLines = _p5.floor((this.height - this.padding * 2) / (lineHeight));
    for (let y = 1; y <= totalLines; y++) {
      _p5.line(this.position.x + this.padding, this.position.y + this.padding + (y * lineHeight),
        this.position.x + this.width - this.padding, this.position.y + this.padding + (y * lineHeight));
    }
  }

  displayBox() {
    _p5.noFill();
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(gridColor);
    _p5.rect(this.position.x + (this.width * 0.5), this.position.y + (this.height * 0.5), this.width, this.height);
  }

  displayMissingGlyphs() {
    _p5.stroke(missingColor);
    // _p5.strokeWeight(scriptStrokeWeight * size / 100);
    _p5.strokeWeight(scriptStrokeWeight);
    _p5.noFill();
    for (let missing of this.displayMissingCollection) {
      let x = missing[0];
      let y = missing[1];
      let w = missing[2];
      let h = missing[3];
      _p5.rect(x + (w * 0.5), y + (h * 0.5), w, h);
      _p5.line(x, y, x + w, y + h);
      _p5.line(x, y + h, x + w, y);
    }
  }

  displayPaths() {
    _p5.stroke(scriptColor);
    // _p5.strokeWeight(scriptStrokeWeight * size / 100);
    _p5.strokeWeight(scriptStrokeWeight);
    _p5.noFill();
    _p5.strokeCap(_p5.ROUND);
    _p5.strokeJoin(_p5.ROUND);

    if (exportActive == true && exportSVGActive == true) {
      svgCanvas.stroke(scriptColor);
      // svgCanvas.strokeWeight(scriptStrokeWeight * size / 100);
      svgCanvas.strokeWeight(scriptStrokeWeight);
      svgCanvas.noFill();
      svgCanvas.strokeCap(_p5.ROUND);
      svgCanvas.strokeJoin(_p5.ROUND);
    }

    for (let path of this.displayPathsCollection) {

      if (exportActive == true && exportSVGActive == true) {
        svgCanvas.beginShape();
      } else {
        _p5.beginShape();
      }

      // display points based on type
      for (var i = 0; i < path.length - 3; i += 3) {

        let p1 = path[i];
        let p2 = path[i + 1];
        let p3 = path[i + 2];
        let p4 = path[i + 3];

        if (i == 0) {
          if (exportActive == true && exportSVGActive == true) {
            svgCanvas.vertex(p1.x, p1.y);
          } else {
            _p5.vertex(p1.x, p1.y);
          }
        }

        if (exportActive == true && exportSVGActive == true) {
          svgCanvas.bezierVertex(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        } else {
          _p5.bezierVertex(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
        }

      }

      if (exportActive == true && exportSVGActive == true) {
        svgCanvas.endShape();
      } else {
        _p5.endShape();
      }
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  update() {

    _p5.noiseSeed(this.seed);

    this.reset();

    // Step through text _p5.line by _p5.line
    for (let i = 0; i < this.textLines.length; i++) {

      // end _p5.draw if word reach _p5.height _p5.max
      if (this.checkInsideYBounds(this.currGlyphY) == false) {
        break;
      }

      let words = this.textLines[i].split(/\s+/);

      for (let j = 0; j < words.length; j++) {

        // end _p5.draw if word reach _p5.height _p5.max
        if (this.checkInsideYBounds(this.currGlyphY) == false) {
          break;
        }


        // Step through lines glyph by glyph
        for (let k = 0; k < words[j].length; k++) {
          
          _p5.randomSeed((i+j+k) * 100);
          this.noiseIndex = _p5.random(10000);
    
        // end _p5.draw if word reach _p5.height _p5.max
        if (this.checkInsideYBounds(this.currGlyphY) == false) {
          break;
        }

          this.prevGlyph = (k > 0 && this.currGlyphX != this.resetX) ? activeScript.getGlyph(words[j].charAt(k - 1)) : null;
          this.currGlyph = activeScript.getGlyph(words[j].charAt(k));
          this.nextGlyph = k + 1 < words[j].length ? activeScript.getGlyph(words[j].charAt(k + 1)) : null;

          // If glyph is unknown add a wordspace
          if (this.currGlyph == null) {

            // this.addWordSpace();
            this.addMissing();

          } else {

            if (k > 0) {
              this.currGlyphX += this.relativeXPosition(this.tempLetterSpace);
            }

            this.tempSize += (_p5.noise(this.getNoiseIndex()) - 0.5) * randomSize;
            this.tempSize = _p5.max(this.tempSize, sizeMin);

            this.temBaselineOffset = (_p5.noise(this.getNoiseIndex()) - 0.5) * randomBaselineOffset;

            this.tempLetterSpace = letterSpace + ((_p5.noise(this.getNoiseIndex()) - 0.5) * (randomLetterSpace));
            this.tempLetterSpace = _p5.max(this.tempLetterSpace, letterSpaceMin);

            this.tempLetterWidth = letterWidth + ((_p5.noise(this.getNoiseIndex()) - 0.5) * randomLetterWidth);
            this.tempLetterWidth = _p5.max(this.tempLetterWidth, letterWidthMin);

            this.tempLetterHeight = letterHeight + ((_p5.noise(this.getNoiseIndex()) - 0.5) * randomLetterHeight);
            this.tempLetterHeight = _p5.max(this.tempLetterHeight, letterHeightMin);

            this.tempSlant = slant + ((_p5.noise(this.getNoiseIndex()) - 0.5) * randomSlant);
            // this.tempSlant = _p5.min(_p5.max(this.tempSlant, slantMin), slantMax);
            this.tempSlant = _p5.constrain(this.tempSlant, slantMin, slantMax) * -1; 

            if (this.currGlyph.paths.length > 0) {
              this.addGlyph();
              this.currGlyphX += this.relativeXPosition((this.currGlyph.width * this.tempLetterWidth) + this.currGlyph.leftSideBearing + this.currGlyph.rightSideBearing);
            } else {
              this.addMissing();
              this.currGlyphX += this.relativeXPosition((activeScript.defaultGlyphWidth * this.tempLetterWidth));
            }

            // reset tempSize to global value
            this.tempSize = size;
          }

          // check if word fits in _p5.line, else add linebreak and begin to redraw word
          if (this.checkInsideXBounds(this.currGlyphX) == false) {

            if (j == 0) { 
              // if first word in _p5.line is longer than _p5.line, _p5.save path points and jump to next _p5.line
              this.addTempPathsToGlobalPaths();
            } else {
              // reset temp paths and start all over again in next _p5.line
              this.resetTempPaths();
              k = -1; // reset loop index
            }

            this.resetToNextLine();

          }

        }

        // add paths of word to global displayPathsCollection
        this.addTempPathsToGlobalPaths();

        // add word spacing at end of word
        this.addWordSpace();
      }

      // reset to start new _p5.line
      this.resetToNextLine();
    }

// reset seed
    _p5.randomSeed(Date.now()); 
  }

  addGlyph() {

    for (let currPathLevel = 0; currPathLevel < this.currGlyph.paths.length; currPathLevel++) {

      if (currPathLevel == this.tempWordDisplayPathsLevels.length) {
        this.tempWordDisplayPathsLevels.push(new Array());
      }

      let path = this.currGlyph.paths[currPathLevel];

      if (this.currGlyph.paths[currPathLevel].connectionToPrev == false) {
        this.tempWordDisplayPathsLevels[currPathLevel] = [];
      }

      let connectionToPrev = (
        this.prevGlyph != null 
        && this.prevGlyph.paths.length > currPathLevel
        && this.prevGlyph.paths[currPathLevel].connectionToNext == true
        && this.currGlyph.paths[currPathLevel].connectionToPrev == true
      ) ? true : false;


      let connectionToNext = (
        this.currGlyph.paths[currPathLevel].connectionToNext == true
        && this.nextGlyph != null
        && this.nextGlyph.paths.length > currPathLevel
        && this.nextGlyph.paths[currPathLevel].connectionToPrev == true
      ) ? true : false;

      for (let j = 0; j < path.anchors.length; j++) {

        let anchor = path.anchors[j];
        let handleToPrev = anchor.handleToPrev;
        let handleToNext = anchor.handleToNext;

        // tempNoise for similar anchor and handle distortion
        let tempNoiseX = (_p5.noise(this.getNoiseIndex()) - 0.5) * precision;
        let tempNoiseY = (_p5.noise(this.getNoiseIndex()) - 0.5) * precision;

        // calc temp anchor positioning
        let tempAnchorX = this.relativeXPosition((((anchor.position.x - this.currGlyph.leftSideBearing) * this.tempLetterWidth) + this.currGlyph.leftSideBearing) + tempNoiseX);
        let tempAnchorY = this.relativeYPosition((anchor.position.y * this.tempLetterHeight) + (this.temBaselineOffset * this.tempLetterHeight) + tempNoiseY);
        let tempHandleToPrevX = this.relativeXPosition((((handleToPrev.position.x - this.currGlyph.leftSideBearing) * this.tempLetterWidth) + this.currGlyph.leftSideBearing) + tempNoiseX);
        let tempHandleToPrevY = this.relativeYPosition((handleToPrev.position.y * this.tempLetterHeight) + (this.temBaselineOffset * this.tempLetterHeight) + tempNoiseY);
        let tempHandleToNextX = this.relativeXPosition((((handleToNext.position.x - this.currGlyph.leftSideBearing) * this.tempLetterWidth) + this.currGlyph.leftSideBearing) + tempNoiseX);
        let tempHandleToNextY = this.relativeYPosition((handleToNext.position.y * this.tempLetterHeight) + (this.temBaselineOffset * this.tempLetterHeight) + tempNoiseY);


        // calc current anchor and handle position
        let currentAnchorX, currentAnchorY, currHandleToPrevX, currHandleToPrevY, currHandleToNextX, currHandleToNextY;

        if (typeof rotateAll !== 'undefined' && rotateAll !== 0) {
          let angle = _p5.radians(rotateAll);
          let cosA = _p5.cos(angle);
          let sinA = _p5.sin(angle);
          
          let ax = tempAnchorX + (tempAnchorY * this.tempSlant);
          let ay = tempAnchorY;
          currentAnchorX = this.currGlyphX + (ax * cosA - ay * sinA);
          currentAnchorY = this.currGlyphY + (ax * sinA + ay * cosA);

          let hpx = tempHandleToPrevX + (tempHandleToPrevY * this.tempSlant);
          let hpy = tempHandleToPrevY;
          currHandleToPrevX = this.currGlyphX + (hpx * cosA - hpy * sinA);
          currHandleToPrevY = this.currGlyphY + (hpx * sinA + hpy * cosA);

          let hnx = tempHandleToNextX + (tempHandleToNextY * this.tempSlant);
          let hny = tempHandleToNextY;
          currHandleToNextX = this.currGlyphX + (hnx * cosA - hny * sinA);
          currHandleToNextY = this.currGlyphY + (hnx * sinA + hny * cosA);
        } else {
          currentAnchorX = this.currGlyphX + tempAnchorX + (tempAnchorY * this.tempSlant);
          currentAnchorY = this.currGlyphY + tempAnchorY;
          currHandleToPrevX = this.currGlyphX + tempHandleToPrevX + (tempHandleToPrevY * this.tempSlant);
          currHandleToPrevY = this.currGlyphY + tempHandleToPrevY;
          currHandleToNextX = this.currGlyphX + tempHandleToNextX + (tempHandleToNextY * this.tempSlant);
          currHandleToNextY = this.currGlyphY + tempHandleToNextY;
        }

        // add _p5.bezier points to _p5.point collection array
        if (j > 0 || connectionToPrev == true) {
          if (this.tempWordDisplayPathsLevels[currPathLevel].length == 0) {
            this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(this.prevAnchorX, this.prevAnchorY));
          }
          if (j > 0) {
            // add handle to prev if not already drawn before (prev glyphs path handle to next)
            this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(this.prevHandleX, this.prevHandleY));
          }
          this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(currHandleToPrevX, currHandleToPrevY));
          this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(currentAnchorX, currentAnchorY));
        }

        // _p5.save current values for next anchor
        this.prevAnchorX = currentAnchorX;
        this.prevAnchorY = currentAnchorY;
        this.prevHandleX = currHandleToNextX;
        this.prevHandleY = currHandleToNextY;
      }

      // _p5.save points and reset path array if path ends
      if (connectionToNext == false) {
        this.tempWordDisplayPaths.push(this.tempWordDisplayPathsLevels[currPathLevel]);
        this.tempWordDisplayPathsLevels[currPathLevel] = [];
      } else {
        // already add handle to next for _p5.bezier in path
        this.tempWordDisplayPathsLevels[currPathLevel].push(_p5.createVector(this.prevHandleX, this.prevHandleY));
      }

    }

  }

  addMissing() {
    let w = this.relativeXPosition(activeScript.defaultGlyphWidth * letterWidth);
    let h = this.relativeYPosition(activeScript.ascenderHeight * letterHeight) * -1;
    let x = this.currGlyphX;
    let y = this.currGlyphY;
    this.tempWordDisplayMissing.push([x, y, w, h]);
  }

  addWordSpace() {

    // this.currGlyphX += this.relativeXPosition(this.tempWordSpace);
    this.currGlyphX += this.tempWordSpace + this.relativeXPosition(this.tempLetterSpace);
    this.prevAnchorX = this.currGlyphX;
    this.prevAnchorY = this.currGlyphY;

  }

  addTempPathsToGlobalPaths() {

    for (let level of this.tempWordDisplayPathsLevels) {
      this.tempWordDisplayPaths.push(level);
    }

    for (let path of this.tempWordDisplayPaths) {
      this.displayPathsCollection.push(path);
    }
    for (let missing of this.tempWordDisplayMissing) {
      this.displayMissingCollection.push(missing);
    }

    this.resetTempPaths();
  }

  resetTempPaths() {
    this.tempWordDisplayPathsLevels = [];
    this.tempWordDisplayPaths = [];
    this.tempWordDisplayMissing = [];
  }

  resetToNextLine() {
    this.currGlyphX = this.resetX;
    this.currGlyphY += lineHeight;
    this.prevGlyph = null;
    this.currGlyph = null;
    this.nextGlyph = null;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  relativeXPosition(absolutePosition) {
    this.increaseNoiseIndex();
    // return ((absolutePosition * this.tempLetterWidth) * this.tempSize);
    return (absolutePosition * this.tempSize);
  }

  relativeYPosition(absolutePosition) {
    this.increaseNoiseIndex();
    // return ((absolutePosition * this.tempLetterHeight) * this.tempSize);
    return (absolutePosition * this.tempSize);
  }

  absoluteXPosition(relativePosition) {
    this.increaseNoiseIndex();
    return ((relativePosition / this.tempLetterWidth) / this.tempSize);
  }

  absoluteYPosition(relativePosition) {
    this.increaseNoiseIndex();
    return ((relativePosition / this.tempLetterHeight) / this.tempSize);
  }

  checkInsideXBounds(checkPosition) {
    if (checkPosition >= this.position.x + this.padding &&
      checkPosition <= this.position.x + this.width - this.padding) {
      return true;
    }
    return false;
  }

  checkInsideYBounds(checkPosition) {
    if (checkPosition >= this.position.y + this.padding &&
      checkPosition <= this.position.y + this.height - this.padding) {
      return true;
    }
    return false;
  }

  getNoiseIndex() {
    this.increaseNoiseIndex();
    return this.noiseIndex;
  }

  increaseNoiseIndex() {
    this.noiseIndex++;
  }

}


// --- FILE: secuencia/js/glyph.js ---


class Glyph {
  constructor(n, p, aW) {
    this.name = n;
    this.charCode = n.charCodeAt(0);
    this.paths = p;
    this.advancedWidth = aW;
    this.width;
    this.leftSideBearing;
    this.rightSideBearing;
    this.updateSideBearings();
  }

  toJSON() {
    return {
      name: this.name,
      paths: this.paths.map(path => path.toJSON()),
      advancedWidth: this.advancedWidth,
      width: this.width,
      leftSideBearing: this.leftSideBearing,
      rightSideBearing: this.rightSideBearing,
    };
  }

  updateWidth(aW) {
    this.advancedWidth = aW;
    this.updateSideBearings();
  }

  updatePaths(updatedPaths) {
    this.reset();
    this.paths = updatedPaths;
    this.updateSideBearings();
  }

  reset() {
    this.paths = [];
  }

  updateSideBearings() {

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let path of this.paths) {
      for (let i = 0; i < path.anchors.length - 1; i++) {

        let anchor = path.anchors[i];
        let handleToNext = anchor.handleToNext;
        let nextAnchor = path.anchors[i + 1];
        let nextAnchor_handleToPrev = nextAnchor.handleToPrev;

        for (let t = 0; t <= 1; t += 0.01) {
          let x = _p5.bezierPoint(anchor.position.x, handleToNext.position.x, nextAnchor_handleToPrev.position.x, nextAnchor.position.x, t);
          let y = _p5.bezierPoint(anchor.position.y, handleToNext.position.y, nextAnchor_handleToPrev.position.y, nextAnchor.position.y, t);
          if (x < xMin) xMin = x;
          if (x > xMax) xMax = x;
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
        }
      }

      this.leftSideBearing = xMin;
      this.rightSideBearing = this.advancedWidth - xMax;
      this.width = this.advancedWidth - this.leftSideBearing - this.rightSideBearing
    }
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class Path {
  constructor(i, a, cTP, cTN) {
    this.index = i;
    this.anchors = a;
    this.connectionToPrev = cTP;
    this.connectionToNext = cTN;
  }


  toJSON() {
    return {
      index: this.index,
      anchors: this.anchors.map(anchor => anchor.toJSON()),
      connectionToPrev: this.connectionToPrev,
      connectionToNext: this.connectionToNext,
    };
  }

  updateAnchors(updatedAnchors) {
    this.reset();
    this.anchors = updatedAnchors;
  }

  reset() {
    this.anchors = [];
  }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class Anchor {
  constructor(i, x, y, hpx, hpy, hnx, hny) {
    this.index = i;
    this.position = _p5.createVector(x, y);
    this.handleToPrev = new Handle(this, hpx, hpy);
    this.handleToNext = new Handle(this, hnx, hny);
  }
  toJSON() {
    return {
      index: this.index,
      position: { x: this.position.x, y: this.position.y },
      handleToPrev: this.handleToPrev.toJSON(),
      handleToNext: this.handleToNext.toJSON(),
    };
  }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class Handle {
  constructor(a, x, y) {
    this.position = _p5.createVector(x, y);
    this.anchor = a;
    this.positionRelativeToAnchor = _p5.createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
  }

  toJSON() {
    return {
      position: { x: this.position.x, y: this.position.y },
      positionRelativeToAnchor: {
        x: this.positionRelativeToAnchor.x,
        y: this.positionRelativeToAnchor.y,
      },
    };
  }
}

// --- FILE: secuencia/js/script.js ---

class Script {

  constructor(data) {
    this.reset();
    if (Array.isArray(data)) {
      if (data[0].includes('.scm')) {
        this.fromSCM(data); // outdated file format
      } else if (data[0].includes('.jhf')) {
        this.fromJHF(data); // outdated file format
      }
    } else if (typeof data == 'object') {
      this.fromJSON(data); // json file format
    } else {
      // blank glyphs
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  reset() {
    this.name = this.name == null ? scriptName_DEFAULT : this.name;
    this.xHeight = script_xHeight_DEFAULT;
    this.ascenderHeight = script_ascenderHeight_DEFAULT;
    this.descenderHeight = script_descenderHeight_DEFAULT;
    this.defaultGlyphWidth = script_glyphWidth_DEFAULT;
    this.wordSpace = script_wordSpace_DEFAULT;

    this.glyphs = [];
    this.setupBlankGlyphs();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  fromJSON(data) {

    this.name = data ? data.name : scriptName_DEFAULT;
    this.xHeight = data ? data.xHeight : script_xHeight;
    this.ascenderHeight = data ? data.ascenderHeight : script_ascenderHeight;
    this.descenderHeight = data ? data.descenderHeight : script_descenderHeight;
    this.defaultGlyphWidth = data ? data.defaultGlyphWidth : script_defaultGlyphWidth;
    this.wordSpace = data ? data.wordSpace : script_defaultWordSpace;

    if (data && data.glyphs) {
      data.glyphs.forEach(glyphData => {

        // Get the index for the glyph in its array (or create new entry if not included yet)
        const index = this.getGlyphIndex(glyphData.name);

        // Construct the paths for the glyph
        const paths = glyphData.paths.map(pathData => {
          const anchors = pathData.anchors.map(anchorData => {
            return new Anchor(
              anchorData.index,
              anchorData.position.x,
              anchorData.position.y,
              anchorData.handleToPrev.position.x,
              anchorData.handleToPrev.position.y,
              anchorData.handleToNext.position.x,
              anchorData.handleToNext.position.y
            );
          });

          return new Path(
            pathData.index,
            anchors,
            pathData.connectionToPrev,
            pathData.connectionToNext
          );
        });

        // Create the Glyph instance
        const glyph = new Glyph(
          glyphData.name,
          paths,
          glyphData.advancedWidth
        );

        // Add the glyph to the correct index in the pre-existing array
        this.glyphs[index] = glyph;
      });
    }
  }

  toJSON() {
    return {
      name: this.name,
      xHeight: this.xHeight,
      ascenderHeight: this.ascenderHeight,
      descenderHeight: this.descenderHeight,
      defaultGlyphWidth: this.defaultGlyphWidth,
      wordSpace: this.wordSpace,
      glyphs: this.glyphs.filter(glyph => glyph.paths.length > 0).map(glyph => glyph.toJSON())
    };
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setupBlankGlyphs() {
    for (let i = 0; i < basicLatin.length; i++) {
      this.addBlankCharacter(basicLatin.charAt(i))
    }
  }

  addBlankCharacter(character) {

    let paths = [];
    let glyphWidth = this.defaultGlyphWidth;

    this.glyphs.push(new Glyph(character, paths, glyphWidth));
    this.sortGlyphs();

    if (activeScript == this) updateInterface_glyphSet_boxes();
  }

  sortGlyphs() {

    // arrays to sort glyphs belonging to different categories
    let upperCaseGlyphs = [];
    let upperCaseCodeMin = 65;
    let upperCaseCodeMax = 90;
    let lowerCaseGlyphs = [];
    let lowerCaseCodeMin = 97;
    let lowerCaseCodeMax = 122;
    let numberGlyphs = [];
    let numberCodeMin = 48;
    let numberCodeMax = 57;
    let additionalGlyphs = [];

    // iterate through all glyphs in the and check if the glyphs charCode value falls within the range of a category
    for (let glyph of this.glyphs) {
      if (glyph.charCode >= upperCaseCodeMin && glyph.charCode <= upperCaseCodeMax) {
        upperCaseGlyphs.push(glyph);
      } else if (glyph.charCode >= lowerCaseCodeMin && glyph.charCode <= lowerCaseCodeMax) {
        lowerCaseGlyphs.push(glyph);
      } else if (glyph.charCode >= numberCodeMin && glyph.charCode <= numberCodeMax) {
        numberGlyphs.push(glyph);
      } else {
        additionalGlyphs.push(glyph);
      }
    }

    // sort each category by charCode value (ascending)
    upperCaseGlyphs.sort((a, b) => a.charCode - b.charCode);
    lowerCaseGlyphs.sort((a, b) => a.charCode - b.charCode);
    numberGlyphs.sort((a, b) => a.charCode - b.charCode);
    additionalGlyphs.sort((a, b) => a.charCode - b.charCode);

    // combine all sorted arrays in the desired order
    this.glyphs = [...upperCaseGlyphs, ...lowerCaseGlyphs, ...numberGlyphs, ...additionalGlyphs];
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  getGlyph(character) {

    for (let glyph of this.glyphs) {
      if (_p5.str(glyph.name) == character) {
        return glyph;
      }
    }

    this.addBlankCharacter(character);
    updateInterface_glyphSet_boxes();

    for (let glyph of this.glyphs) {
      if (_p5.str(glyph.name) == character) {
        return glyph;
      }
    }

    return null;
  }

  getGlyphIndex(character) {
    for (let i = 0; i < this.glyphs.length; i++) {
      if (this.glyphs[i].name == character) {
        return i;
      }
    }

    this.addBlankCharacter(character);
    // return this.glyphs.length - 1;
    return this.getGlyphIndex(character);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Import from outdated File Format
  fromSCM(data) {

    this.name = data[0].split('.')[0].replace(/_/g, ' ');
    let tmp;
    let startIndexes = [];
    let endIndexes = [];
    let curImportedGlyph = 0;

    // Get position of glyph data in the file
    for (let i = 0; i < data.length; i++) {
      tmp = data[i].split(" ");

      let tempChar = tmp[tmp.length - 1];

      if (tempChar === "/") {
        startIndexes.push(i);
      } else if (tempChar === "w") {
        endIndexes.push(i);
      }
    }

    // Read glyphs and create glyph objects
    for (let j = 0; j < startIndexes.length; j++) {
      // this.parseGlyph(data, startIndex[j] + 1, endIndex[j]);

      let startIndex = startIndexes[j] + 1;
      let endIndex = endIndexes[j];

      let tempDataFileLine;

      let glyphWidth = 0;
      let character = data[startIndex - 1].split(" ")[0];

      let paths = [];
      let tempAnchors = [];
      let tempPathConnectedToPrev = false;
      let tempPathConnectedToNext = true;

      // Split lines to values
      for (let i = startIndex; i <= endIndex; i++) {

        tempDataFileLine = data[i].split(" ");

        let tempAnchorType = tempDataFileLine[tempDataFileLine.length - 1];
        let orgInd = i - startIndex;

        if (tempAnchorType === "m" || tempAnchorType === "C") {

          let xPosition = parseFloat(tempDataFileLine[0]);
          let yPosition = parseFloat(tempDataFileLine[1]);

          let handleToNext_xPosition = parseFloat(tempDataFileLine[2]);
          let handleToNext_yPosition = parseFloat(tempDataFileLine[3]);
          let handleToPrev_xPosition = xPosition + (xPosition - handleToNext_xPosition);
          let handleToPrev_yPosition = yPosition + (yPosition - handleToNext_yPosition);

          let first = false;
          let last = false;

          if (tempAnchorType == "m") {
            if (tempAnchors.length > 1) {
              paths.push(new Path(paths.length, tempAnchors, tempPathConnectedToPrev, tempPathConnectedToNext));
              tempAnchors = [];
              tempPathConnectedToPrev = false;
            }
          }

          if (tempAnchors.length == 0 && tempAnchorType == "C") {
            tempPathConnectedToPrev = true;
          }

          tempAnchors.push(new Anchor(orgInd, xPosition, yPosition, handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition, first, last));

        } else if (tempAnchorType === "w") {
          glyphWidth = parseFloat(tempDataFileLine[0]);
        }
      }

      if (tempAnchors.length > 1) {
        paths.push(new Path(paths.length, tempAnchors, tempPathConnectedToPrev, tempPathConnectedToNext));
      }

      this.glyphs[this.getGlyphIndex(character)] = new Glyph(character, paths, glyphWidth);

      curImportedGlyph++;
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Import from Hershey Font File Format
  fromJHF(data) {

    this.name = data[0].split('.')[0].replace(/_/g, ' ');

    // ––––––––––––––––––

    // analyze data and sort into to glyph structure

    const dataSortedAsGlyphs = [];
    let tempGlyphName = "";
    let tempGlyphPairs = "";
    let tempGlyphPositioning = "";
    let tempGlyphCoordinates = "";

    for (let i = 1; i < data.length; i++) {

      // const line = data[i].trim();
      const line = data[i];

      // a number at the 5th char and a whitespace at the 6th char marks a new glyph
      if (_p5.line.charAt(4).match(/^\d/) && _p5.line.charAt(5).match(/^\s/)) {

        // _p5.save current glyphs data
        if (tempGlyphName.length > 0 && tempGlyphPairs.length > 0) {
          dataSortedAsGlyphs.push([tempGlyphName, tempGlyphPairs, tempGlyphPositioning, tempGlyphCoordinates]);
        }

        // reset
        tempGlyphName = "";
        tempGlyphPairs = "";
        tempGlyphPositioning = "";
        tempGlyphCoordinates = "";

        // add new glyph name info and coordinate info
        tempGlyphName = _p5.line.slice(0, 5);
        tempGlyphPairs = _p5.line.slice(6, 8);
        tempGlyphPositioning = _p5.line.slice(8, 10);
        tempGlyphCoordinates = _p5.line.slice(10);
      } else {
        // add _p5.line to current glyph data
        tempGlyphCoordinates += _p5.line;
      }
    }

    // add last current glyph lines
    if (tempGlyphName.length > 0 && tempGlyphPairs.length > 0) {
      dataSortedAsGlyphs.push([tempGlyphName, tempGlyphPairs, tempGlyphPositioning, tempGlyphCoordinates]);
    }

    // ––––––––––––––––––

    // analyze glyphs

    for (let i = 0; i < dataSortedAsGlyphs.length; i++) {

      const line = dataSortedAsGlyphs[i];
      // extract glyph ID and vector data

      const characterCode = _p5.line[0];
      let character = hersheyCodeToLetter[characterCode] || (characterCode == "12345" ? '?' + i : '?' + characterCode);

      const pairs = _p5.line[1];
      const positioning = _p5.line[2];
      const coordinates = _p5.line[3];
      
      if (!hersheyCodeToLetter[characterCode] && pairs == "1") {
        _p5.print("missing characterCode: " + characterCode)
        // continue;
      } 

      // skip empty glyphs
      if (coordinates.length == 0) {
        continue;
      }

      let glyphWidth = 0;
      let left = 0;
      let right = 0;
      if (positioning.length > 0) {
        left = this.decodeHersheyCharToCoordinate(positioning.charAt(0));
        right = this.decodeHersheyCharToCoordinate(positioning.charAt(1));
        glyphWidth = _p5.abs(left) + right;
      }

      let paths = [];
      if (coordinates.length > 0) {

        let anchors = [];

        for (let i = 0; i < coordinates.length; i += 2) {

          if (coordinates.charAt(i).match(" ") && coordinates.charAt(i + 1).match("R")) {
            paths.push(new Path(paths.length, anchors, false, false));
            anchors = [];
          } else {
            let xPosition = this.decodeHersheyCharToCoordinate(coordinates.charAt(i)) + _p5.abs(left);
            let yPosition = this.decodeHersheyCharToCoordinate(coordinates.charAt(i + 1), true) - hersheyShift;
            let first = false;
            let last = false;
            anchors.push(new Anchor(anchors.length, xPosition, yPosition, xPosition, yPosition, xPosition, yPosition, first, last));
          }
        }

        if (anchors.length > 0) {
          paths.push(new Path(paths.length, anchors, false, false));
        }
      }

      // Save glyph data
      this.glyphs[this.getGlyphIndex(character)] = new Glyph(character, paths, glyphWidth);

    }

  }

  decodeHersheyCharToCoordinate(character) {
    let indexOfCharacter = hersheyAlphabet.indexOf(character);
    let value = indexOfCharacter - hersheyBaseIndex;
    let coordinate = _p5.map(value, -hersheyScale, hersheyScale, -1, 1);
    return coordinate;
  }

}

const hersheyCodeToLetter = {
  "  551": "A",
  "  552": "B",
  "  553": "C",
  "  554": "D",
  "  555": "E",
  "  556": "F",
  "  557": "G",
  "  558": "H",
  "  559": "I",
  "  560": "J",
  "  561": "K",
  "  562": "L",
  "  563": "M",
  "  564": "N",
  "  565": "O",
  "  566": "P",
  "  567": "Q",
  "  568": "R",
  "  569": "S",
  "  570": "T",
  "  571": "U",
  "  572": "V",
  "  573": "W",
  "  574": "X",
  "  575": "Y",
  "  576": "Z",
  "  651": "a",
  "  652": "b",
  "  653": "c",
  "  654": "d",
  "  655": "e",
  "  656": "f",
  "  657": "g",
  "  658": "h",
  "  659": "i",
  "  660": "j",
  "  661": "k",
  "  662": "l",
  "  663": "m",
  "  664": "n",
  "  665": "o",
  "  666": "p",
  "  667": "q",
  "  668": "r",
  "  669": "s",
  "  670": "t",
  "  671": "u",
  "  672": "v",
  "  673": "w",
  "  674": "x",
  "  675": "y",
  "  676": "z",
  "  710": ".",
  "  718": "°",
  "  723": "|",
  "  724": "–",
  "  725": "+",
  "  726": "=",
  "  733": "#",
  "  804": "\\",
  "  999": "_",
  " 2223": "[",
  " 2224": "]",
  " 2225": "{",
  " 2226": "}",
  " 2229": "|",
  " 2241": "<",
  " 2242": ">",
  " 2246": "∼",
  " 2262": "↑",
  " 2275": "#",
  " 2766": "‘",
  " 2271": "%",
  " 2273": "@",
  " 2551": "A",
  " 2552": "B",
  " 2553": "C",
  " 2554": "D",
  " 2555": "E",
  " 2556": "F",
  " 2557": "G",
  " 2558": "H",
  " 2559": "I",
  " 2560": "J",
  " 2561": "K",
  " 2562": "L",
  " 2563": "M",
  " 2564": "N",
  " 2565": "O",
  " 2566": "P",
  " 2567": "Q",
  " 2568": "R",
  " 2569": "S",
  " 2570": "T",
  " 2571": "U",
  " 2572": "V",
  " 2573": "W",
  " 2574": "X",
  " 2575": "Y",
  " 2576": "Z",
  " 2651": "a",
  " 2652": "b",
  " 2653": "c",
  " 2654": "d",
  " 2655": "e",
  " 2656": "f",
  " 2657": "g",
  " 2658": "h",
  " 2659": "i",
  " 2660": "j",
  " 2661": "k",
  " 2662": "l",
  " 2663": "m",
  " 2664": "n",
  " 2665": "o",
  " 2666": "p",
  " 2667": "q",
  " 2668": "r",
  " 2669": "s",
  " 2670": "t",
  " 2671": "u",
  " 2672": "v",
  " 2673": "w",
  " 2674": "x",
  " 2675": "y",
  " 2676": "z",
  " 2750": "0",
  " 2751": "1",
  " 2752": "2",
  " 2753": "3",
  " 2754": "4",
  " 2755": "5",
  " 2756": "6",
  " 2757": "7",
  " 2758": "8",
  " 2759": "9",
  " 2760": ".",
  " 2761": ",",
  " 2762": ":",
  " 2763": ";",
  " 2764": "!",
  " 2765": "?",
  " 2767": "’",
  " 2768": "&",
  " 2769": "$",
  " 2770": "/",
  " 2771": "(",
  " 2772": ")",
  " 2773": "*",
  " 2774": "-",
  " 2775": "+",
  " 2776": "=",
  " 2778": "\"",
  " 2779": "°",
  " 3214": "!",
  " 2714": "!",
  "  714": "!",
  " 2728": "\"",
  "  717": "\"",
  " 2719": "$",
  "  719": "$",
  " 2718": "&",
  " 2717": "’",
  " 2721": "(",
  " 2722": ")",
  " 2723": "*",
  " 2725": "+",
  " 2711": ",",
  " 2724": "-",
  " 2710": ".",
  " 2720": "/",
  " 2700": "0",
  " 2701": "1",
  " 2702": "2",
  " 2703": "3",
  " 2704": "4",
  " 2705": "5",
  " 2706": "6",
  " 2707": "7",
  " 2708": "8",
  " 2709": "9",
  " 2712": ":",
  " 2713": ";",
  " 2726": "=",
  " 2715": "?",
  " 2501": "A",
  " 2502": "B",
  " 2503": "C",
  " 2504": "D",
  " 2505": "E",
  " 2506": "F",
  " 2507": "G",
  " 2508": "H",
  " 2509": "I",
  " 2510": "J",
  " 2511": "K",
  " 2512": "L",
  " 2513": "M",
  " 2514": "N",
  " 2515": "O",
  " 2516": "P",
  " 2517": "Q",
  " 2518": "R",
  " 2519": "S",
  " 2520": "T",
  " 2521": "U",
  " 2522": "V",
  " 2523": "W",
  " 2524": "X",
  " 2525": "Y",
  " 2526": "Z",
  " 2601": "a",
  " 2602": "b",
  " 2603": "c",
  " 2604": "d",
  " 2605": "e",
  " 2606": "f",
  " 2607": "g",
  " 2608": "h",
  " 2609": "i",
  " 2610": "j",
  " 2611": "k",
  " 2612": "l",
  " 2613": "m",
  " 2614": "n",
  " 2615": "o",
  " 2616": "p",
  " 2617": "q",
  " 2618": "r",
  " 2619": "s",
  " 2620": "t",
  " 2621": "u",
  " 2622": "v",
  " 2623": "w",
  " 2624": "x",
  " 2625": "y",
  " 2626": "z",
  " 2716": "‘",
  " 2729": "°",

  "  734": "&",
  "  731": "’",
  "  721": "(",
  "  722": ")",
  " 2219": "*",
  "  711": ",",
  "  720": "/",
  "  700": "0",
  "  701": "1",
  "  702": "2",
  "  703": "3",
  "  704": "4",
  "  705": "5",
  "  706": "6",
  "  707": "7",
  "  708": "8",
  "  709": "9",
  "  712": ":",
  "  713": ";",
  "  715": "?",
  "  730": "‘",
  "  501": "A",
  "  502": "B",
  "  503": "C",
  "  504": "D",
  "  505": "E",
  "  506": "F",
  "  507": "G",
  "  508": "H",
  "  509": "I",
  "  510": "J",
  "  511": "K",
  "  512": "L",
  "  513": "M",
  "  514": "N",
  "  515": "O",
  "  516": "P",
  "  517": "Q",
  "  518": "R",
  "  519": "S",
  "  520": "T",
  "  521": "U",
  "  522": "V",
  "  523": "W",
  "  524": "X",
  "  525": "Y",
  "  526": "Z",
  "  601": "a",
  "  602": "b",
  "  603": "c",
  "  604": "d",
  "  605": "e",
  "  606": "f",
  "  607": "g",
  "  608": "h",
  "  609": "i",
  "  610": "j",
  "  611": "k",
  "  612": "l",
  "  613": "m",
  "  614": "n",
  "  615": "o",
  "  616": "p",
  "  617": "q",
  "  618": "r",
  "  619": "s",
  "  620": "t",
  "  621": "u",
  "  622": "v",
  "  623": "w",
  "  624": "x",
  "  625": "y",
  "  626": "z",
  " 3228": "\"",
  " 3219": "$",
  " 3220": "/",
  " 3200": "0",
  " 3201": "1",
  " 3202": "2",
  " 3203": "3",
  " 3204": "4",
  " 3205": "5",
  " 3206": "6",
  " 3207": "7",
  " 3208": "8",
  " 3209": "9",
  " 3212": ":",
  " 3213": ";",
  " 3226": "=",
  " 3215": "?",
  " 3001": "A",
  " 3002": "B",
  " 3003": "C",
  " 3004": "D",
  " 3005": "E",
  " 3006": "F",
  " 3007": "G",
  " 3008": "H",
  " 3009": "I",
  " 3010": "J",
  " 3011": "K",
  " 3012": "L",
  " 3013": "M",
  " 3014": "N",
  " 3015": "O",
  " 3016": "P",
  " 3017": "Q",
  " 3018": "R",
  " 3019": "S",
  " 3020": "T",
  " 3021": "U",
  " 3022": "V",
  " 3023": "W",
  " 3024": "X",
  " 3025": "Y",
  " 3026": "Z",
  " 3101": "a",
  " 3102": "b",
  " 3103": "c",
  " 3104": "d",
  " 3105": "e",
  " 3106": "f",
  " 3107": "g",
  " 3108": "h",
  " 3109": "i",
  " 3110": "j",
  " 3111": "k",
  " 3112": "l",
  " 3113": "m",
  " 3114": "n",
  " 3115": "o",
  " 3116": "p",
  " 3117": "q",
  " 3118": "r",
  " 3119": "s",
  " 3120": "t",
  " 3121": "u",
  " 3122": "v",
  " 3123": "w",
  " 3124": "x",
  " 3125": "y",
  " 3126": "z",
  " 3218": "&",
  " 3217": "’",
  " 3221": "(",
  " 3222": ")",
  " 3223": "*",
  " 3225": "+",
  " 3211": ",",
  " 3224": "-",
  " 3210": ".",
  " 3216": "‘",
  " 3229": "°",

  " 3714": "!",
  " 3718": "&",
  " 3717": "’",
  " 3721": "(",
  " 3722": ")",
  " 3723": "*",
  " 3725": "+",
  " 3711": ",",
  " 3713": ";",
  " 3724": "-",
  " 3710": ".",
  " 3716": "‘",
  " 3715": "?",
  " 3726": "=",
  " 3719": "$",
  " 3720": "/",
  " 3712": ":",
  " 3728": "\"",
  " 3729": "°",

  " 3700": "0",
  " 3701": "1",
  " 3702": "2",
  " 3703": "3",
  " 3704": "4",
  " 3705": "5",
  " 3706": "6",
  " 3707": "7",
  " 3708": "8",
  " 3709": "9",

  " 3501": "A",
  " 3502": "B",
  " 3503": "C",
  " 3504": "D",
  " 3505": "E",
  " 3506": "F",
  " 3507": "G",
  " 3508": "H",
  " 3509": "I",
  " 3510": "J",
  " 3511": "K",
  " 3512": "L",
  " 3513": "M",
  " 3514": "N",
  " 3515": "O",
  " 3516": "P",
  " 3517": "Q",
  " 3518": "R",
  " 3519": "S",
  " 3520": "T",
  " 3521": "U",
  " 3522": "V",
  " 3523": "W",
  " 3524": "X",
  " 3525": "Y",
  " 3526": "Z",

  " 3601": "a",
  " 3602": "b",
  " 3603": "c",
  " 3604": "d",
  " 3605": "e",
  " 3606": "f",
  " 3607": "g",
  " 3608": "h",
  " 3609": "i",
  " 3610": "j",
  " 3611": "k",
  " 3612": "l",
  " 3613": "m",
  " 3614": "n",
  " 3615": "o",
  " 3616": "p",
  " 3617": "q",
  " 3618": "r",
  " 3619": "s",
  " 3620": "t",
  " 3621": "u",
  " 3622": "v",
  " 3623": "w",
  " 3624": "x",
  " 3625": "y",
  " 3626": "z",

  " 3301": "A",
  " 3302": "B",
  " 3303": "C",
  " 3304": "D",
  " 3305": "E",
  " 3306": "F",
  " 3307": "G",
  " 3308": "H",
  " 3309": "I",
  " 3310": "J",
  " 3311": "K",
  " 3312": "L",
  " 3313": "M",
  " 3314": "N",
  " 3315": "O",
  " 3316": "P",
  " 3317": "Q",
  " 3318": "R",
  " 3319": "S",
  " 3320": "T",
  " 3321": "U",
  " 3322": "V",
  " 3323": "W",
  " 3324": "X",
  " 3325": "Y",
  " 3326": "Z",

  " 3401": "a",
  " 3402": "b",
  " 3403": "c",
  " 3404": "d",
  " 3405": "e",
  " 3406": "f",
  " 3407": "g",
  " 3408": "h",
  " 3409": "i",
  " 3410": "j",
  " 3411": "k",
  " 3412": "l",
  " 3413": "m",
  " 3414": "n",
  " 3415": "o",
  " 3416": "p",
  " 3417": "q",
  " 3418": "r",
  " 3419": "s",
  " 3420": "t",
  " 3421": "u",
  " 3422": "v",
  " 3423": "w",
  " 3424": "x",
  " 3425": "y",
  " 3426": "z",

  " 3801": "A",
  " 3802": "B",
  " 3803": "C",
  " 3804": "D",
  " 3805": "E",
  " 3806": "F",
  " 3807": "G",
  " 3808": "H",
  " 3809": "I",
  " 3810": "J",
  " 3811": "K",
  " 3812": "L",
  " 3813": "M",
  " 3814": "N",
  " 3815": "O",
  " 3816": "P",
  " 3817": "Q",
  " 3818": "R",
  " 3819": "S",
  " 3820": "T",
  " 3821": "U",
  " 3822": "V",
  " 3823": "W",
  " 3824": "X",
  " 3825": "Y",
  " 3826": "Z",

  " 3901": "a",
  " 3902": "b",
  " 3903": "c",
  " 3904": "d",
  " 3905": "e",
  " 3906": "f",
  " 3907": "g",
  " 3908": "h",
  " 3909": "i",
  " 3910": "j",
  " 3911": "k",
  " 3912": "l",
  " 3913": "m",
  " 3914": "n",
  " 3915": "o",
  " 3916": "p",
  " 3917": "q",
  " 3918": "r",
  " 3919": "s",
  " 3920": "t",
  " 3921": "u",
  " 3922": "v",
  " 3923": "w",
  " 3924": "x",
  " 3925": "y",
  " 3926": "z",

  " 0000": "↧",
};


// --- FILE: secuencia/js/glyphEditor.js ---

class GlyphEditor {

  constructor() {

    this.position = _p5.createVector(0, 0);
    this.width;
    this.height;

    this.isHovered;

    this.gridSize = glyphEditor_gridSize_DEFAULT;
    this.gridsPerSegment = glyphEditor_gridsPerSegment_DEFAULT;

    this.scriptStrokeWeight = glyphEditor_scriptStrokeWeight_DEFAULT;

    this.buttonSizeBig = glyphEditor_buttonSizeBig_DEFAULT;
    this.buttonSizeSmall = glyphEditor_buttonSizeSmall_DEFAULT;

    this.baselinePositionFactor = 0.65;
    this.leftBoundingPositionFactor = 0.25;

    this.baseline;
    this.xHeight;
    this.ascenderHeight;
    this.decenderHeight;
    this.leftBounding;
    this.rightBounding;

    this.baselineButton = new GuideButton(0, 0, this.buttonSizeBig);
    this.xHeightButton = new GuideButton(0, 0, this.buttonSizeSmall);
    this.ascenderHeightButton = new GuideButton(0, 0, this.buttonSizeSmall);
    this.descenderHeightButton = new GuideButton(0, 0, this.buttonSizeSmall);
    this.leftBoundingButton = new GuideButton(0, 0, this.buttonSizeBig);
    this.rightBoundingButton = new GuideButton(0, 0, this.buttonSizeBig);

    this.activeGlyph;
    this.activePath;
    this.activeAnchor;

    this.pathButtonsBuffer = [];
    this.pathButtonsBufferMax = 10;
    this.addBuffer = false;

    this.pathButtons = [];

    this.lockedButton = false;

    this.mouseWasPressed = false;

    this.mode = 'editPath';  // 'editPath', 'editAnchor', 'editHandle', 'drawPath'
    this.contextMenu = false;
    this.displayInfo = true;

    this.setActiveGlyph(activeScript.glyphs[0].name);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setDimensions(x, y, w, h) {

    // _p5.save new dimensions
    this.position = _p5.createVector(x, y);
    this.width = w;
    this.height = h;

    this.repositionGuides();
  }

  setMode(mode) {

    if (this.mode == 'drawPath' && mode != 'drawPath' && this.activePath != null) {
      if (this.activePath.anchors.length < 2) {
        this.removePath(this.activePath);
      }
    }

    if (mode == 'editPath') {
      this.mode = mode;
    } else if (mode == 'editAnchor') {
      this.mode = mode;
    } else if (mode == 'editHandle') {
      this.mode = mode;
    } else if (mode == 'drawPath') {
      this.mode = mode;
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setActiveGlyph(character) {

    let glyph = activeScript.getGlyph(character);

    if (glyph != null) {
      this.resetActiveGlyph();
      this.activeGlyph = glyph;

      for (let i = 0; i < this.activeGlyph.paths.length; i++) {

        let path = this.activeGlyph.paths[i];
        let pathButton = new PathButton(0, 0, this.scriptStrokeWeight * 1.5, path.connectionToPrev, path.connectionToNext, i);

        for (let j = 0; j < path.anchors.length; j++) {

          let anchor = path.anchors[j];
          let handleToPrev = anchor.handleToPrev;
          let handleToNext = anchor.handleToNext;

          let xPosition = this.relativeXPosition(anchor.position.x);
          let yPosition = this.relativeYPosition(anchor.position.y);
          let handleToPrev_xPosition = this.relativeXPosition(handleToPrev.position.x);
          let handleToPrev_yPosition = this.relativeYPosition(handleToPrev.position.y);
          let handleToNext_xPosition = this.relativeXPosition(handleToNext.position.x);
          let handleToNext_yPosition = this.relativeYPosition(handleToNext.position.y);

          let first = j == 0 ? true : false;
          let last = j == path.anchors.length - 1 ? true : false;

          if (j == path.anchors.length - 1 &&
            anchor.position.x == path.anchors[0].position.x && anchor.position.y == path.anchors[0].position.y) {
            pathButton.closed = true;
          } else {
            pathButton.anchors.push(new AnchorButton(pathButton, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall,
              handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition,
              first, last, j));
          }

        }

        this.pathButtons.push(pathButton);
      }

      this.resetActivePath();
      this.rightBounding = this.relativeXPosition(this.activeGlyph.advancedWidth);
      this.rightBoundingButton.updatePosition(this.gridify(this.rightBounding), this.gridify(this.position.y + this.height));

    }

    this.addBuffer = true;
  }

  setActiveGlyphName(character) {
    if (this.activeGlyph != null) {




      let doubleGlyphIndex = activeScript.glyphs.findIndex(glyph => glyph.name === character);
      if (doubleGlyphIndex != -1) {
        let activeGlyphIndex = activeScript.glyphs.findIndex(glyph => glyph.name === this.activeGlyph.name);
        activeScript.glyphs[doubleGlyphIndex] = this.activeGlyph;
        activeScript.glyphs.splice(activeGlyphIndex, 1);
      }

      this.activeGlyph.name = character;


    }
  }

  clearActiveGlyph() {
    this.pathButtons = [];
    this.resetActivePath();
    this.updateActiveGlyph();
    this.activeGlyph.updateWidth(activeScript.defaultGlyphWidth);
    this.repositionGuides();
  }

  resetActiveGlyph() {

    this.pathButtons = [];
    this.resetPathButtonsBuffer();

    if (this.activeGlyph != null) {
      this.activeGlyph = null;
    }
    this.resetActivePath();
  }

  reloadActiveGlyph() {
    this.setActiveGlyph(this.activeGlyph.name);
  }

  updateActiveGlyph() {

    let absolutePaths = []

    for (let i = 0; i < this.pathButtons.length; i++) {

      let path = this.pathButtons[i];
      let absoluteAnchors = []
      for (let j = 0; j < path.anchors.length; j++) {

        let anchor = path.anchors[j];
        let handleToPrev = anchor.handleToPrev;
        let handleToNext = anchor.handleToNext;

        let xPosition = this.absoluteXPosition(anchor.position.x);
        let yPosition = this.absoluteYPosition(anchor.position.y);
        let handleToPrev_xPosition = this.absoluteXPosition(handleToPrev.position.x);
        let handleToPrev_yPosition = this.absoluteYPosition(handleToPrev.position.y);
        let handleToNext_xPosition = this.absoluteXPosition(handleToNext.position.x);
        let handleToNext_yPosition = this.absoluteYPosition(handleToNext.position.y);

        absoluteAnchors.push(new Anchor(j, xPosition, yPosition,
          handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition));
      }

      if (path.closed == true) {
        let reference = absoluteAnchors[0];
        let copy = new Anchor(absoluteAnchors.length, reference.position.x, reference.position.y,
          reference.handleToPrev.position.x, reference.handleToPrev.position.y, reference.handleToNext.position.x, reference.handleToNext.position.y)
        absoluteAnchors.push(copy);
      }

      let connectionToPrev = path.connectionToPrev;
      let connectionToNext = path.connectionToNext;

      absolutePaths.push(new Path(j, absoluteAnchors, connectionToPrev, connectionToNext));
    }

    this.activeGlyph.updatePaths(absolutePaths);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  resetPathButtonsBuffer() {
    this.pathButtons = [];
    this.pathButtonsBuffer = [];
  }

  addPathButtonsBuffer() {

    let currentStatePaths = [];
    for (let i = 0; i < this.pathButtons.length; i++) {
      currentStatePaths.push(this.pathButtons[i].copy());
    }

    this.pathButtonsBuffer.push(currentStatePaths);

    if (this.pathButtonsBuffer.length > this.pathButtonsBufferMax) {
      this.pathButtonsBuffer.splice(0, 1);
    }

    this.addBuffer = false;
  }

  undoPathButtonsBuffer() {
    if (this.pathButtonsBuffer.length > 1) {

      let undoState = this.pathButtonsBuffer[this.pathButtonsBuffer.length - 2];
      let undoStatePaths = [];
      for (let i = 0; i < undoState.length; i++) {
        undoStatePaths.push(undoState[i].copy());
      }

      this.pathButtons = undoStatePaths;
      this.pathButtonsBuffer.splice(this.pathButtonsBuffer.length - 1, 1);

    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setActivePath(path) {
    this.resetActivePath();
    this.activePath = path;
    this.activePath.active = true;
  }

  resetActivePath() {

    if (this.activePath != null) {
      this.activePath.active = false;
    }

    this.activePath = null;

    this.resetActiveAnchor();
  }

  removePath(path) {

    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i] == path) {

        if (this.activePath == path) {
          this.resetActivePath();
        }
        this.pathButtons.splice(i, 1);
        break;
      }
    }

    // reset path index values
    for (let i = 0; i < this.pathButtons.length; i++) {
      this.pathButtons[i].index = i;
    }

  }

  setPathPosition(path) {
    this.setActivePath(path);
    this.activePath.updatePosition(_p5.mouseX - _p5.pmouseX, _p5.mouseY - _p5.pmouseY);
    this.lockedButton = true;
  }

  gridifyPathPosition(path) {

    this.setActivePath(path);
    this.activePath.gridifyPosition();
    this.lockedButton = true;
  }

  addPath() {

    let newPath = new PathButton(0, 0, this.scriptStrokeWeight * 1.5, false, false, this.pathButtons.length);
    this.pathButtons.push(newPath);

    this.setActivePath(newPath);

    this.addAnchor();
  }

  closePath(path) {
    this.setActivePath(path);
    this.activePath.close();
    this.resetActiveAnchor();
  }

  combinePaths(path1, path2, anchor) {

    let collectedAnchors = this.activeAnchor.first == true ?
      anchor.first == true ?
        [...path2.anchors.reverse(), ...path1.anchors] :
        [...path2.anchors, ...path1.anchors] :
      anchor.first == true ?
        [...path1.anchors, ...path2.anchors] :
        [...path1.anchors, ...path2.anchors.reverse()];

    let newPath = new PathButton(0, 0, this.scriptStrokeWeight * 1.5, false, false, _p5.min(path1.index, path2.index));

    for (let j = 0; j < collectedAnchors.length; j++) {

      let anchor = collectedAnchors[j];
      let handleToPrev = anchor.handleToPrev;
      let handleToNext = anchor.handleToNext;

      let xPosition = anchor.position.x;
      let yPosition = anchor.position.y;
      let handleToPrev_xPosition = handleToPrev.position.x;
      let handleToPrev_yPosition = handleToPrev.position.y;
      let handleToNext_xPosition = handleToNext.position.x;
      let handleToNext_yPosition = handleToNext.position.y;

      let first = j == 0 ? true : false;
      let last = j == collectedAnchors.length - 1 ? true : false;

      newPath.anchors.push(new AnchorButton(newPath, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall,
        handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition,
        first, last, j));
    }

    this.pathButtons.push(newPath);

    this.removePath(path1);
    this.removePath(path2);

    this.setActivePath(newPath);
    this.updateActiveGlyph();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setActiveAnchor(anchor) {
    this.setActivePath(anchor.path);
    this.resetActiveAnchor();
    this.activeAnchor = anchor;
    this.activeAnchor.active = true;
  }

  resetActiveAnchor() {
    if (this.activeAnchor != null) {
      this.activeAnchor.active = false;
      this.activeAnchor = null;
    }
  }

  addAnchor() {

    let addAsFirst = this.activePath.anchors.length > 1 && this.activeAnchor == this.activePath.anchors[0] ? true : false;

    let xPosition = this.gridify(this.xInsideBounds(_p5.mouseX));
    let handleToPrev_xPosition = xPosition;
    let handleToNext_xPosition = xPosition;
    let yPosition = this.gridify(this.yInsideBounds(_p5.mouseY));
    let handleToPrev_yPosition = yPosition;
    let handleToNext_yPosition = yPosition;

    let first = this.activePath.anchors.length == 0 || addAsFirst == true ? true : false;
    let last = addAsFirst == true ? false : true;
    let index = addAsFirst == true ? 1 : this.activePath.anchors.length;

    let newAnchor = new AnchorButton(this.activePath, xPosition, yPosition, this.buttonSizeBig, this.buttonSizeSmall,
      handleToPrev_xPosition, handleToPrev_yPosition, handleToNext_xPosition, handleToNext_yPosition,
      first, last, index);

    if (addAsFirst) {
      this.activePath.anchors.unshift(newAnchor);
    } else {
      this.activePath.anchors.push(newAnchor);
    }

    if (this.activePath.anchors.length > 2) {
      if (addAsFirst) {
        this.activePath.anchors[1].first = false;
        for (let i = 0; i < this.activePath.anchors.length; i++) {
          this.activePath.anchors[i].index = i;
        }
      } else {
        this.activePath.anchors[this.activePath.anchors.length - 2].last = false;
      }
    }

    this.setActiveAnchor(newAnchor);

    this.lockedButton == true;
  }

  removeAnchor(anchor) {

    let path = anchor.path;

    for (let i = 0; i < path.anchors.length; i++) {
      if (path.anchors[i] == anchor) {
        if (this.activeAnchor == anchor) {
          this.resetActiveAnchor();
        }
        path.anchors.splice(i, 1);
        break;
      }
    }

    if (path.anchors.size == 0) {
      this.removePath(path);
    }

  }

  setAnchorPosition(anchor) {

    this.setActiveAnchor(anchor);

    if (this.activeAnchor.handleToNext.isPressed == true || this.activeAnchor.handleToPrev.isPressed == true) {

      if (this.activeAnchor.angular == true) {

        if (this.activeAnchor.handleToPrev.isPressed == true && this.activeAnchor.handleToPrev.locked == false) {
          this.activeAnchor.handleToPrev.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
        } else if (this.activeAnchor.handleToNext.isPressed == true && this.activeAnchor.handleToNext.locked == false) {
          this.activeAnchor.handleToNext.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
        } else {
          this.activeAnchor.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
        }

      } else {
        this.activeAnchor.updateBothHandlePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)), false);
      }

    } else if (this.activeAnchor.isPressed == true) {
      this.activeAnchor.updatePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)));
    }

    this.lockedButton = true;
  }

  setHandlePosition(anchor) {
    this.setActiveAnchor(anchor);
    if (this.mode == 'editHandle' || this.mode == 'drawPath') {
      this.activeAnchor.angular = false;
    }
    if (this.activeAnchor.first == true) {
      this.activeAnchor.updateBothHandlePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)), true);
    } else {
      this.activeAnchor.updateBothHandlePosition(this.gridify(this.xInsideBounds(_p5.mouseX)), this.gridify(this.yInsideBounds(_p5.mouseY)), false);
    }

    this.lockedButton = true;
  }

  setHandlesLocked(anchor) {
    this.setActiveAnchor(anchor);
    this.activeAnchor.updateBothHandlePosition(this.activeAnchor.position.x, this.activeAnchor.position.y, false);
    this.lockedButton = true;
  }

  switchAnchorAngular(anchor) {
    this.setActiveAnchor(anchor);
    this.activeAnchor.switchAngular();
  }

  switchConnectionToPrev() {
    this.activePath.connectionToPrev = !this.activePath.connectionToPrev;
    this.addBuffer = true;
  }

  switchConnectionToNext() {
    this.activePath.connectionToNext = !this.activePath.connectionToNext;
    this.addBuffer = true;
  }

  switchMainPath() {

    this.pathButtons[this.activePath.index] = this.pathButtons[0];
    this.pathButtons[0] = this.activePath;

    // reset path index values
    for (let i = 0; i < this.pathButtons.length; i++) {
      this.pathButtons[i].index = i;
    }

    this.addBuffer = true;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  editGuides() {

    if (this.baselineButton.isPressed == true) {
      let shift = this.gridify(this.yInsideBounds(_p5.mouseY)) - this.baselineButton.position.y;
      this.baselineButton.updatePosition(this.gridify(this.position.x), this.gridify(this.yInsideBounds(_p5.mouseY)));
      this.xHeightButton.updatePositionRelative(0, shift);
      this.ascenderHeightButton.updatePositionRelative(0, shift);
      this.descenderHeightButton.updatePositionRelative(0, shift);
    } else if (this.xHeightButton.isPressed == true) {
      let yPosition = _p5.min(this.yInsideBounds(_p5.mouseY), this.baselineButton.position.y - this.gridSize);
      this.xHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(yPosition));
    } else if (this.ascenderHeightButton.isPressed == true) {
      let yPosition = _p5.min(this.yInsideBounds(_p5.mouseY), this.xHeightButton.position.y - this.gridSize);
      this.ascenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(yPosition));
    } else if (this.descenderHeightButton.isPressed == true) {
      let yPosition = _p5.max(this.yInsideBounds(_p5.mouseY), this.baselineButton.position.y + this.gridSize);
      this.descenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(yPosition));
    } else if (this.leftBoundingButton.isPressed == true) {
      let xPosition = _p5.min(this.xInsideBounds(_p5.mouseX), this.rightBoundingButton.position.x - this.gridSize);
      this.leftBoundingButton.updatePosition(this.gridify(xPosition), this.gridify(this.position.y + this.height));
    } else if (this.rightBoundingButton.isPressed == true) {
      let xPosition = _p5.max(this.xInsideBounds(_p5.mouseX), this.leftBoundingButton.position.x + this.gridSize);
      this.rightBoundingButton.updatePosition(this.gridify(xPosition), this.gridify(this.position.y + this.height));
    }

    this.lockedButton = true;

    this.baseline = this.baselineButton.position.y;

    this.xHeight = this.xHeightButton.position.y;
    activeScript.xHeight = (this.baseline - this.xHeight) / (this.width * 0.9);

    this.ascenderHeight = this.ascenderHeightButton.position.y;
    activeScript.ascenderHeight = (this.baseline - this.ascenderHeight) / (this.width * 0.9);

    this.descenderHeight = this.descenderHeightButton.position.y;
    activeScript.descenderHeight = (this.baseline - this.descenderHeight) / (this.width * 0.9);

    this.leftBounding = this.leftBoundingButton.position.x;
    this.rightBounding = this.rightBoundingButton.position.x;

    this.activeGlyph.updateWidth(this.absoluteXPosition(this.rightBounding));
  }

  repositionGuides() {

    // calc guide positions
    this.baseline = this.position.y + this.gridifySegments(this.height * this.baselinePositionFactor);
    this.xHeight = this.baseline - (activeScript.xHeight * (this.width * 0.9));
    this.ascenderHeight = this.baseline - (activeScript.ascenderHeight * (this.width * 0.9));
    this.descenderHeight = this.baseline - (activeScript.descenderHeight * (this.width * 0.9));
    this.leftBounding = this.position.x + (this.width * this.leftBoundingPositionFactor);

    // reposition guide buttons
    this.baselineButton.updatePosition(this.gridify(this.position.x), this.gridify(this.baseline));
    this.xHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(this.xHeight));
    this.ascenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(this.ascenderHeight));
    this.descenderHeightButton.updatePosition(this.gridify(this.position.x), this.gridify(this.descenderHeight));
    this.leftBoundingButton.updatePosition(this.gridify(this.leftBounding), this.gridify(this.position.y + this.height));

    this.reloadActiveGlyph();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  setContextMenu() {
    this.contextMenu = true;
    updateInterface_glyphEditorContext_state();
  }

  resetContextMenu() {
    this.contextMenu = false;
    updateInterface_glyphEditorContext_state();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  update() {

    this.isHovered = mouseOverRect(this.position.x, this.position.y, this.width, this.height) && glyphEditorToolsElement.matches(':hover') == false;

    this.updateButtonStates();

    if (this.addBuffer == true) {
      this.addPathButtonsBuffer();
    }
  }

  updateButtonStates() {

    if (this.lockedButton == false) {
      for (let i = 0; i < this.pathButtons.length; i++) {
        this.pathButtons[i].checkState();
      }
      this.baselineButton.checkState();
      this.xHeightButton.checkState();
      this.ascenderHeightButton.checkState();
      this.descenderHeightButton.checkState();
      this.leftBoundingButton.checkState();
      this.rightBoundingButton.checkState();
    } if (this.mouseWasPressed == true) {
      this.mouseWasPressed = false;
    } else {
      this.lockedButton = false;
    }

    if (_p5.mouseIsPressed) {
      this.mouseWasPressed = true;
    }

  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  handleDrag() {

    if (this.checkAnyGuideIsPressed() == true) {
      this.editGuides();
    } else {

    if (this.mode == 'editPath') {
      if (this.checkAnyPathIsPressed() == true) {
        this.setPathPosition(this.getPressedPath());
      } else if (this.activePath != null && mouseOverRect(this.activePath.xMin, this.activePath.yMin, this.activePath.xMax - this.activePath.xMin, this.activePath.yMax - this.activePath.yMin)) {
        this.setPathPosition(this.activePath);
      }
    } else if (this.mode == 'editAnchor') {
      if (this.checkAnyAnchorInclHandleIsPressed() == true) {
        this.setAnchorPosition(this.getPressedAnchor());
      }
    } else if (this.mode == 'editHandle') {
      if (this.checkAnyAnchorInclHandleIsPressed() == true) {
        this.setHandlePosition(this.getPressedAnchor());
      }
    } else if (this.mode == 'drawPath') {
      if (this.checkAnyAnchorInclHandleIsPressed() == true) {
        let anchor = this.getPressedAnchor();
        if (anchor == this.activeAnchor) {
          this.setHandlePosition(anchor);
        }

      } else if (this.isHovered == true) {

        if (this.activeAnchor == null) {
          this.addPath();
        } else {
          this.addAnchor();
        }

      }
    }
  }

    this.updateActiveGlyph();
  }

  handleClick() {

    this.addBuffer = true;

    if (this.lockedButton == false) {
      if (this.contextMenu == true) {

        this.resetContextMenu();

      } else if (this.checkAnyButtonIsHovered() == true) {

        if (this.mode == 'editPath') {
          if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
        } else if (this.mode == 'editAnchor') {

          if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
          if (this.checkAnyAnchorIsHovered() == true) {
            this.setActiveAnchor(this.getHoveredAnchor());
            this.addBuffer = false;
          }
        } else if (this.mode == 'editHandle') {
          if (this.checkAnyAnchorIsHovered() == true) {
            this.setHandlesLocked(this.getHoveredAnchor());

          } else if (this.checkAnyPathIsHovered() == true) {
            this.setActivePath(this.getHoveredPath());
            this.addBuffer = false;
          }
        } else if (this.mode == 'drawPath') {

            if (this.checkAnyAnchorIsHovered() == true) {

              let anchor = this.getHoveredAnchor();
              if (anchor.first == true || anchor.last == true) {
                if (this.activeAnchor == null) {
                  this.setActiveAnchor(anchor);
                  this.addBuffer = false;
                } else if (anchor != this.activeAnchor && anchor.path == this.activePath) {
                  this.closePath(anchor.path);
                } else if (this.activePath != anchor.path) {
                  this.combinePaths(this.activePath, anchor.path, anchor);
                }
              } else if (anchor.path == this.activePath) {
                this.removeAnchor(anchor);
              }
            } else {
              if (this.activeAnchor == null) {
                this.addPath();
              } else {
                this.addAnchor();
              }
            }

          }
        

      } else if (this.checkAnyButtonIsHovered() == false) {

        if (this.mode == 'drawPath') {
          if (this.activeAnchor == null) {
            this.addPath();
          } else {
            this.addAnchor();
          }
        } else if (this.contextMenu == false && this.lockedButton == false) {
          this.resetActiveAnchor();
          this.resetActivePath();
          this.addBuffer = false;
          _p5.print("infinity click")
        }

      }

      this.updateActiveGlyph();

    } else {
      if (this.mode == 'editPath') {
        if (this.activePath != null) {
          this.gridifyPathPosition(this.activePath);
        }
      }
    }

    if (this.checkAnyGuideIsHovered() == true) {
      this.repositionGuides();
    }

  }

  handleDoubleClick() {

    this.addBuffer = true;

    if (this.lockedButton == false && this.checkAnyButtonIsHovered() == false) {
      this.resetActiveAnchor();
      this.resetActivePath();
      this.addBuffer = false;
    } else {
      if (this.mode == 'editPath') {
      } else if (this.mode == 'editAnchor') {
        if (this.checkAnyAnchorIsHovered() == true) {
          this.switchAnchorAngular(this.getHoveredAnchor());
        }
      } else if (this.mode == 'editHandle') {
      } else if (this.mode == 'drawPath') {
      }
    }

    this.updateActiveGlyph();
  }

  handleRightClick() {

    this.addBuffer = false;

    if (this.mode != 'drawPath') {
      if (this.checkAnyPathIsHovered() == true) {
        this.setActivePath(this.getHoveredPath());
        this.setContextMenu();
      }
    }

  }

  handleDelete() {

    this.addBuffer = true;

    if (this.mode == 'editPath') {
      if (this.activePath != null) {
        this.removePath(this.activePath);
      }
    } else if (this.mode == 'editAnchor') {
      if (this.activeAnchor != null) {
        this.removeAnchor(this.activeAnchor);
      }
    } else if (this.mode == 'editHandle') {
      if (this.activeAnchor != null) {
        this.removeAnchor(this.activeAnchor);
      }
    } else if (this.mode == 'drawPath') {
      if (this.activeAnchor != null) {

        let removedIndex = this.activeAnchor.index;
        this.removeAnchor(this.activeAnchor);

        let newIndex = removedIndex == 0 ? 0 : removedIndex - 1;
        this.setActiveAnchor(this.activePath.anchors[newIndex]);

      } else if (this.activePath != null) {
        this.removePath(this.activePath);
      }
    }

    this.updateActiveGlyph();
  }

  handleEscape() {

    this.addBuffer = false;

    if (this.mode == 'drawPath') {

      if (this.activePath.anchors.length < 2) {
        this.removePath(this.activePath);
      }
      this.resetActivePath();
    }

    this.updateActiveGlyph();
  }

  handleAlt(status) {

    this.addBuffer = false;

    if (status == 'pressed') {

      if (this.mode == 'editHandle') {
        this.setMode('editAnchor');
        updateInterface_glyphEditorTools_state();
      } else if (this.mode == 'editAnchor') {
        this.setMode('editHandle');
        updateInterface_glyphEditorTools_state();
      } if (this.mode == 'drawPath') {
        
        // HIER



      }

    } else if (status == 'released') {

      if (this.mode == 'editHandle') {
        this.setMode('editAnchor');
        updateInterface_glyphEditorTools_state();
      } else if (this.mode == 'editAnchor') {
        this.setMode('editHandle');
        updateInterface_glyphEditorTools_state();
      }

    }

  }

  handleCmdZ() {
    this.addBuffer = false;
    this.undoPathButtonsBuffer();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  display() {
    if (this.displayInfo) {
      this.displayGrid();
    }
    this.displayBox();
    this.displayGuides();
    this.displayGlyph();
  }

  displayGrid() {
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(gridColorLight);

    for (let x = 0; x < this.width; x += this.gridSize) {
      _p5.line(this.position.x + x, this.position.y, this.position.x + x, this.position.y + this.height);
    }

    for (let y = 0; y < this.height; y += this.gridSize) {
      _p5.line(this.position.x, this.position.y + y, this.position.x + this.width, this.position.y + y);
    }

    _p5.stroke(gridColor);
    for (let x = 0; x < this.width; x += this.gridSize * this.gridsPerSegment) {
      _p5.line(this.position.x + x, this.position.y, this.position.x + x, this.position.y + this.height);
    }
    for (let y = 0; y < this.height; y += this.gridSize * this.gridsPerSegment) {
      _p5.line(this.position.x, this.position.y + y, this.position.x + this.width, this.position.y + y);
    }
  }

  displayBox() {
    _p5.stroke(gridColor);
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.noFill();
    _p5.rect(this.position.x + (this.width * 0.5), this.position.y + (this.height * 0.5), this.width, this.height);
  }

  displayGuides() {

    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.stroke(this.displayInfo == true ? glyphEditor_guideColor : gridColor);

    // x-_p5.height
    _p5.line(this.position.x, this.xHeight, this.position.x + this.width, this.xHeight);

    // ascender _p5.height
    _p5.line(this.position.x, this.ascenderHeight, this.position.x + this.width, this.ascenderHeight);

    // descender _p5.height
    _p5.line(this.position.x, this.descenderHeight, this.position.x + this.width, this.descenderHeight);

    // baseline
    _p5.line(this.position.x, this.baseline, this.position.x + this.width, this.baseline);

    // left bounding
    _p5.line(this.leftBounding, this.position.y, this.leftBounding, this.position.y + this.height);

    // right bounding
    _p5.line(this.rightBounding, this.position.y, this.rightBounding, this.position.y + this.height);

    // display buttons
    if (this.displayInfo) {
      this.xHeightButton.display();
      this.ascenderHeightButton.display();
      this.descenderHeightButton.display();
      this.baselineButton.display();
      this.leftBoundingButton.display();
      this.rightBoundingButton.display();
    }

  }

  displayGlyph() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      path.display();
    }
  }


  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // from glyph dimensions to glyhbox dimensions
  relativeXPosition(absoluteXPosition) {
    return _p5.int(absoluteXPosition * (this.width * 0.9) + this.leftBounding);
  }

  relativeYPosition(absoluteYPosition) {
    return _p5.int(absoluteYPosition * (this.width * 0.9) + this.baseline);
  }

  // from glyhbox dimensions to glyph dimensions
  absoluteXPosition(relativeXPosition) {
    return (relativeXPosition - this.leftBounding) / (this.width * 0.9);
  }

  absoluteYPosition(relativeYPosition) {
    return (relativeYPosition - this.baseline) / (this.width * 0.9);
  }

  xInsideBounds(xPosition) {
    return _p5.int(_p5.constrain(xPosition, this.position.x, this.position.x + this.width));
  }

  yInsideBounds(yPosition) {
    return _p5.int(_p5.constrain(yPosition, this.position.y, this.position.y + this.height));
  }

  checkInsideBounds(xPosition, yPosition) {
    if (xPosition > this.position.x && xPosition < this.position.x + this.width) {
      if (yPosition > this.position.y && yPosition < this.position.y + this.height) {
        return true;
      }
    }
    return false;
  }

  gridify(value) {
    return _p5.round(value / this.gridSize) * this.gridSize;
  }

  gridifySegments(value) {
    return _p5.round(value / (this.gridSize * this.gridsPerSegment)) * (this.gridSize * this.gridsPerSegment);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  checkAnyGuideIsPressed() {
    if (this.baselineButton.isPressed == true || this.xHeightButton.isPressed == true ||
      this.ascenderHeightButton.isPressed == true || this.descenderHeightButton.isPressed == true ||
      this.leftBoundingButton.isPressed == true || this.rightBoundingButton.isPressed == true) {
      return true;
    } else {
      return false
    }
  }

  getPressedGuide() {
    if (this.baselineButton.isPressed == true) {
      return this.baselineButton;
    } else if (this.xHeightButton.isPressed == true) {
      return this.xHeightButton;
    } else if (this.ascenderHeightButton.isPressed == true) {
      return this.ascenderHeightButton;
    } else if (this.descenderHeightButton.isPressed == true) {
      return this.descenderHeightButton;
    } else if (this.leftBoundingButton.isPressed == true) {
      return this.leftBoundingButton;
    } else if (this.rightBoundingButton.isPressed == true) {
      return this.rightBoundingButton;
    }
    return;
  }

  checkAnyPathIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isPressed == true) {
        return true;
      }
    }
    return false
  }

  getPressedPath() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isPressed == true) {
        return this.pathButtons[i];
      }
    }
    return;
  }

  checkAnyAnchorIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true) {
          return true;
        }
      }
    }
    return false
  }

  checkAnyAnchorInclHandleIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true || anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return true;
        }
      }
    }
    return false
  }

  checkAnyHandleIsPressed() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return true;
        }
      }
    }
    return false
  }

  getPressedAnchor() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isPressed == true || anchor.handleToNext.isPressed == true || anchor.handleToPrev.isPressed == true) {
          return anchor;
        }
      }
    }
    return;
  }

  checkAnyButtonIsHovered() {
    if (this.checkAnyGuideIsHovered() == true || this.checkAnyPathIsHovered() == true ||
      this.checkAnyAnchorInclHandleIsHovered() == true) {
      return true;
    } else {
      return false;
    }
  }

  checkAnyGuideIsHovered() {
    if (this.baselineButton.isHovered == true || this.xHeightButton.isHovered == true ||
      this.ascenderHeightButton.isHovered == true || this.descenderHeightButton.isHovered == true ||
      this.leftBoundingButton.isHovered == true || this.rightBoundingButton.isHovered == true) {
      return true;
    } else {
      return false
    }
  }

  checkAnyPathIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isHovered == true) {
        return true;
      }
    }
    return false;
  }

  getHoveredPath() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      if (this.pathButtons[i].isHovered == true) {
        return this.pathButtons[i];
      }
    }
    return;
  }

  checkAnyAnchorIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true) {
          return true;
        }
      }
    }
    return false;
  }

  checkAnyAnchorInclHandleIsHovered() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true || anchor.handleToNext.isHovered == true || anchor.handleToPrev.isHovered == true) {
          return true;
        }
      }
    }
    return false;
  }

  getHoveredAnchor() {
    for (let i = 0; i < this.pathButtons.length; i++) {
      let path = this.pathButtons[i];
      for (let j = 0; j < path.anchors.length; j++) {
        let anchor = path.anchors[j];
        if (anchor.isHovered == true) {
          return anchor;
        }
      }
    }
    return;
  }

}

// --- FILE: secuencia/js/buttons.js ---

class Button {

  constructor(x, y, s, t) {
    this.position = _p5.createVector(x, y);
    this.size = s;
    this.type = t;

    this.active = false;

    // State properties
    this.isHovered = false;
    this.isPressed = false;
    this.isHold = false;
    this.isClicked = false;
    this.isDoubleClicked = false;

    // Timing control properties
    this.lastClickTime = 0;
    this.clickThreshold = 250;
    this.holdTimeout
    this.holdThreshold = 75; // 200;
    this.releasedTimeout;
    this.releasedThreshold = this.clickThreshold + 5;
  }

  checkState() {

    this.isDoubleClicked = false;
    if (_p5.frameCount - this.lastClickFrame > 0) {
      this.isClicked = false;
    }

    // Hover state
    if (this.type == "path") {

    } else {
      this.isHovered = mouseOverEllipse(this.position.x, this.position.y, this.size);
    }

    // clicked state
    if (_p5.mouseIsPressed == false && this.isPressed == true) {

      const currentTime = _p5.millis();

      // Check if within the double-click threshold
      if (currentTime - this.lastClickTime < this.clickThreshold) {
        clearTimeout(this.clickTimeout); // Cancel pending single-click
        this.isDoubleClicked = true;
        this.isClicked = false;
        this.lastClickFrame = _p5.frameCount;

      } else {
        // Set a timeout to confirm a single click if no double-click occurs
        this.isClicked = true;
        this.lastClickFrame = _p5.frameCount;
        this.lastClickTime = currentTime;
      }


    }

    // pressed and hold state
    if (_p5.mouseIsPressed) {
      if (this.isHovered) {
        if (this.isPressed == false) {
          this.holdTimeout = setTimeout(() => {
            if (this.isPressed) {
              this.isHold = true;

            }
          }, this.holdThreshold);
        }
        this.isPressed = true;
      }
    } else {
      clearTimeout(this.holdTimeout);
      if (this.isPressed == true) {
        this.isPressed = false;
        if (this.isHold == true) {
          this.releasedTimeout = setTimeout(() => {
            this.isHold = false;
          }, this.releasedThreshold);
        }
      }
    }
  }

  // WITH CLICK ONLY TRUE IF NO DOUBLE CLICK
  // checkState() {

  //   this.isDoubleClicked = false;
  //   if (_p5.frameCount - this.lastClickFrame > 1) {
  //     this.isClicked = false;
  //   }

  //   // Hover state
  //   this.isHovered = mouseOverEllipse(this.position.x, this.position.y, this.size);

  //   // clicked state
  //   if (_p5.mouseIsPressed == false && this.isPressed == true) {

  //     const currentTime = _p5.millis();

  //     // Check if within the double-click threshold
  //     if (currentTime - this.lastClickTime < this.clickThreshold) {
  //       clearTimeout(this.clickTimeout); // Cancel pending single-click
  //       this.isDoubleClicked = true;
  //       this.isClicked = false;
  //       this.lastClickFrame = _p5.frameCount;
  //     } else {
  //       // Set a timeout to confirm a single click if no double-click occurs
  //       this.isDoubleClicked = false;
  //       this.clickTimeout = setTimeout(() => {
  //         if (this.isHold == false) {
  //           this.isClicked = true;
  //           this.lastClickFrame = _p5.frameCount;
  //         }
  //         this.isHold == false;
  //       }, this.clickThreshold);
  //     }

  //     this.lastClickTime = currentTime;
  //   }

  //   // pressed and hold state
  //   if (_p5.mouseIsPressed && this.isHovered) {
  //     this.isPressed = true;
  //     this.holdTimeout = setTimeout(() => {
  //       this.isHold = true;
  //     }, this.holdThreshold);
  //   } else {
  //     this.isPressed = false;
  //     clearTimeout(this.holdTimeout);
  //     this.releasedTimeout = setTimeout(() => {
  //       this.isHold = false;
  //       clearTimeout(this.releasedTimeout);
  //     }, this.releasedThreshold);
  //   }
  // }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class GuideButton extends Button {

  constructor(x, y, s) {
    super(x, y, s, "guide");
  }

  // –––––––––––––––––––––––––––––––––

  updatePosition(x, y) {
    this.position = _p5.createVector(x, y);
  }

  updatePositionRelative(x, y) {
    this.position = _p5.createVector(this.position.x + x, this.position.y + y);
  }

  // –––––––––––––––––––––––––––––––––

  display() {
    _p5.push();
    _p5.stroke(glyphEditor_guideColor);
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.fill(this.isHovered == true ? glyphEditor_guideColor : backgroundColor);
    _p5.ellipse(this.position.x, this.position.y, this.size, this.size);
    _p5.pop();
  }

}
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class PathButton extends Button {

  constructor(x, y, s, cTP, CTN, i) {
    super(x, y, s, "path");
    this.anchors = [];
    this.connectionToPrev = cTP;
    this.connectionToNext = CTN;
    this.index = i;
    this.xMin = this.position.x;
    this.xMax = this.position.x;
    this.yMin = this.position.y;
    this.yMax = this.position.y;
    this.closed = false;
  }

  copy() {
    let myCopy = new PathButton(this.position.x, this.position.y, this.size, this.connectionToPrev, this.connectionToNext, this.index)
    myCopy.active = this.active
    myCopy.xMin = this.xMin;
    myCopy.xMax = this.xMax;
    myCopy.yMin = this.yMin;
    myCopy.yMax = this.yMax;
    myCopy.closed = this.closed;
    for (let i = 0; i < this.anchors.length; i++) {
      myCopy.anchors.push(this.anchors[i].copy(myCopy));
    }
    return myCopy;
  }

  // –––––––––––––––––––––––––––––––––

  checkState() {

    this.isHovered = false;
    for (let i = 0; i < this.anchors.length - 1; i++) {
      let anchor = this.anchors[i];
      let handleToNext = anchor.handleToNext;
      let nextAnchor = this.anchors[i + 1];
      let nextAnchor_handleToPrev = nextAnchor.handleToPrev;
      if (mouseOverBezier(anchor.position, handleToNext.position, nextAnchor_handleToPrev.position, nextAnchor.position, glyphEditor.scriptStrokeWeight * 2) == true) {
        this.isHovered = true;
      }
    }

    for (let i = 0; i < this.anchors.length; i++) {
      this.anchors[i].checkState();
      if (this.anchors[i].isHovered == true) {
        this.isHovered = true;
      }
    }

    let wasPressed = this.isPressed;
    super.checkState();

  }

  // –––––––––––––––––––––––––––––––––

  updatePosition(x, y) {

    // this.position = _p5.createVector(x, y);
    this.position.add(x, y);

    for (let anchor of this.anchors) {
      anchor.updatePositionRelativeToPath();
    }

  }

  gridifyPosition() {

    this.position = _p5.createVector(glyphEditor.gridify(this.position.x), glyphEditor.gridify(this.position.y));

    for (let anchor of this.anchors) {
      anchor.updatePositionRelativeToPath();
    }
  }

  updateBounding() {

    this.xMin = Infinity;
    this.xMax = -Infinity;
    this.yMin = Infinity;
    this.yMax = -Infinity;

    for (let i = 0; i < this.anchors.length - 1; i++) {
      let anchor = this.anchors[i];
      let handleToNext = anchor.handleToNext;
      let nextAnchor = this.anchors[i + 1];
      let nextAnchor_handleToPrev = nextAnchor.handleToPrev;

      for (let t = 0; t <= 1; t += 0.01) {
        let x = _p5.bezierPoint(anchor.position.x, handleToNext.position.x, nextAnchor_handleToPrev.position.x, nextAnchor.position.x, t);
        let y = _p5.bezierPoint(anchor.position.y, handleToNext.position.y, nextAnchor_handleToPrev.position.y, nextAnchor.position.y, t);
        if (x < this.xMin) this.xMin = x;
        if (x > this.xMax) this.xMax = x;
        if (y < this.yMin) this.yMin = y;
        if (y > this.yMax) this.yMax = y;
      }

    }

    this.xMin -= this.size;
    this.xMax += this.size;
    this.yMin -= this.size;
    this.yMax += this.size;

  }

  close() {
    this.closed = true;
    for (let i = 0; i < this.anchors.length; i++) {
      this.anchors[i].first = false;
      this.anchors[i].last = false;
    }
  }

  // –––––––––––––––––––––––––––––––––

  display() {
    if (!this.anchors || this.anchors.length === 0) {
      return;
    }

    this.updateBounding();

    if (this.connectionToPrev == true) {
      this.displayPathConnection("prev");
    }

    if (this.connectionToNext == true) {
      this.displayPathConnection("next");
    } 

    this.displayPath();

    if (glyphEditor.displayInfo == true) {

      if (glyphEditor.mode != 'drawPath') {
        this.displayIndex();
      }

      if (glyphEditor.mode == 'editPath') {
        if (this.active == true) {
          this.displayBounding();
          if (this.connectionToPrev == true && this.anchors[0]) {
            this.anchors[0].displayConnection();
          }
          if (this.connectionToNext == true && this.anchors[this.anchors.length - 1]) {
            this.anchors[this.anchors.length - 1].displayConnection();
          }
        }
      }

      if (glyphEditor.mode == 'editAnchor' || glyphEditor.mode == 'editHandle') {
        for (let anchor of this.anchors) {
          if (this.active == true) {
            anchor.display(true);
          }
        }
      }

      if (glyphEditor.mode == 'drawPath') {
        for (let anchor of this.anchors) {
          if (this.active == true) {
            anchor.display(true);
          } else if ((anchor.first == true && this.isHovered == true) || (anchor.last == true && this.isHovered == true)) {
            anchor.display(false);
          }
        }
      }

    }
  }

  displayPath() {
    _p5.push();

    _p5.stroke(scriptColor);
    _p5.strokeWeight(glyphEditor.scriptStrokeWeight);
    _p5.noFill();

    if (glyphEditor.displayInfo == true) {
      if (this.isHovered == true && this.active == false) {
        _p5.stroke(hoverColor);
      }
    }

    for (let i = 0; i < this.anchors.length - 1; i++) {

      let anchor = this.anchors[i];
      let handleToNext = anchor.handleToNext;
      let nextAnchor = this.anchors[i + 1];
      let nextAnchor_handleToPrev = nextAnchor.handleToPrev;
      _p5.bezier(
        anchor.position.x, anchor.position.y,
        handleToNext.position.x, handleToNext.position.y,
        nextAnchor_handleToPrev.position.x, nextAnchor_handleToPrev.position.y,
        nextAnchor.position.x, nextAnchor.position.y
      );
    }

    if (this.closed == true) {
      let anchor = this.anchors[this.anchors.length - 1];
      let handleToNext = anchor.handleToNext;
      let nextAnchor = this.anchors[0];
      let nextAnchor_handleToPrev = nextAnchor.handleToPrev;

      _p5.bezier(
        anchor.position.x, anchor.position.y,
        handleToNext.position.x, handleToNext.position.y,
        nextAnchor_handleToPrev.position.x, nextAnchor_handleToPrev.position.y,
        nextAnchor.position.x, nextAnchor.position.y
      );
    } else if (this.active == true &&  glyphEditor.mode == 'drawPath' && glyphEditor.checkAnyGuideIsHovered() == false &&
      glyphEditor.isHovered == true && glyphEditor.isHovered == true && 
      glyphEditor.activeAnchor != null && glyphEditor.activeAnchor.isPressed == false) {
      this.displayCurrentDraw();
    }

    _p5.pop();

  }

  displayPathConnection(direction) {
    let anchor1, handle1, anchor2, handle2;

    if (direction == "prev") {
      anchor2 = this.anchors[0].position;
      handle2 = this.anchors[0].handleToPrev.position;
      let x = glyphEditor.xInsideBounds(this.xMin - (0.15 * glyphEditor.width));
      let y = glyphEditor.yInsideBounds(glyphEditor.xHeightButton.position.y);
      anchor1 = _p5.createVector(x, y);
      handle1 = _p5.createVector(x, y);
    } else {
      anchor1 = this.anchors[this.anchors.length-1].position;
      handle1 = this.anchors[this.anchors.length-1].handleToNext.position;     
      let x = glyphEditor.xInsideBounds(this.xMax + (0.15 * glyphEditor.width));
      let y = glyphEditor.yInsideBounds(glyphEditor.xHeightButton.position.y);
      anchor2 = _p5.createVector(x, y);
      handle2 = _p5.createVector(x, y);
    }

    _p5.push();
    _p5.stroke(hoverColor);
    _p5.strokeWeight(glyphEditor.scriptStrokeWeight);
    _p5.noFill();
    _p5.bezier(
      anchor1.x, anchor1.y,
      handle1.x, handle1.y,
      handle2.x, handle2.y,
      anchor2.x, anchor2.y
    );
    _p5.pop();

  }

  displayCurrentDraw() {
    let anchor = glyphEditor.activeAnchor.first == true ? this.anchors[0] : this.anchors[this.anchors.length - 1];
    let handle = glyphEditor.activeAnchor.first == true ? anchor.handleToPrev : anchor.handleToNext;
    _p5.bezier(
      anchor.position.x, anchor.position.y,
      handle.position.x, handle.position.y,
      _p5.mouseX, _p5.mouseY,
      _p5.mouseX, _p5.mouseY,
    );
  }

  displayIndex() {
    if (!this.anchors || this.anchors.length === 0) {
      return;
    }

    let firstAnchor = this.anchors[0];
    if (!firstAnchor || !firstAnchor.inwardsCenteredDirection) {
      return;
    }

    let shift;

    if ((firstAnchor.inwardsCenteredDirection.x == 0 && firstAnchor.inwardsCenteredDirection.y == 0) == false) {
      shift = firstAnchor.inwardsCenteredDirection.copy();
    } else {
      let secondAnchor = this.anchors.length > 1 ? this.anchors[1] : firstAnchor;
      shift = calcCenterDirection(firstAnchor.handleToPrev.position, firstAnchor.position, secondAnchor.position, 0);
    }
    shift.mult(interfaceFontSize);

    let x = firstAnchor.position.x + shift.x;
    let y = firstAnchor.position.y + shift.y;

    _p5.noStroke();
    _p5.fill(scriptColor);
    _p5.textFont(interfaceFont);
    _p5.textSize(interfaceFontSize);
    _p5.textAlign(_p5.CENTER, _p5.CENTER);
    _p5.text(this.index + 1, x, y);

  }

  displayConnection(anchor) {
    if (!anchor || !anchor.inwardsCenteredDirection) {
      return;
    }

    let shift;

    if ((anchor.inwardsCenteredDirection.x == 0 && anchor.inwardsCenteredDirection.y == 0) == false) {
      shift = anchor.inwardsCenteredDirection.copy();
    } else {
      let secondAnchor = this.anchors.length > 1 ? this.anchors[1] : anchor;
      shift = calcCenterDirection(anchor.handleToPrev.position, anchor.position, secondAnchor.position, 0);
    }
    shift.mult(interfaceFontSize * 2);

    let x = anchor.position.x + shift.x;
    let y = anchor.position.y + shift.y;

    _p5.noStroke();
    _p5.fill(scriptColor);
    _p5.textFont(interfaceFont);
    _p5.textSize(interfaceFontSize);
    _p5.textAlign(_p5.CENTER, _p5.CENTER);
    if (anchor.first == true) {
      _p5.text('toPrev', x, y);
    }
    if (anchor.last == true) {
      _p5.text('toNext', x, y);
    }
  }

  displayBounding() {
    _p5.push();
    _p5.rectMode(_p5.CORNER);
    _p5.stroke(scriptColor);
    _p5.strokeWeight(interfaceStrokeWeight);
    _p5.noFill();
    _p5.rect(this.xMin, this.yMin, this.xMax - this.xMin, this.yMax - this.yMin);
    _p5.pop();
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class AnchorButton extends Button {

  constructor(p, x, y, s, hs, hpx, hpy, hnx, hny, f, l, i) {
    super(x, y, s, "anchor");

    this.index = i;
    this.path = p;
    this.positionRelativeToPath = _p5.createVector(this.position.x - this.path.position.x, this.position.y - this.path.position.y);

    this.handleToPrev = new HandleButton(this, hpx, hpy, hs);
    this.handleToNext = new HandleButton(this, hnx, hny, hs);

    this.first = f;
    this.last = l;
    this.angular = false;

    this.handleToPrevDistance;
    this.handleToNextDistance;
    this.handleToPrevDirection;
    this.handleToNextDirection;
    this.angle;
    this.analyze();
    this.checkForHandleLock();
  }

  copy(path) {
    let myCopy = new AnchorButton(path, this.position.x, this.position.y, this.size, this.handleToPrev.size,
      this.handleToPrev.position.x, this.handleToPrev.position.y, this.handleToNext.position.x, this.handleToNext.position.y,
      this.first, this.last, this.index);
    return myCopy;
  }

  // –––––––––––––––––––––––––––––––––

  updatePosition(x, y) {
    this.position = _p5.createVector(x, y);
    this.positionRelativeToPath = _p5.createVector(this.position.x - this.path.position.x, this.position.y - this.path.position.y);
    this.handleToNext.updatePositionRelativeToAnchor();
    this.handleToPrev.updatePositionRelativeToAnchor();
    this.analyze();
    this.checkForHandleLock();
  }

  updatePositionRelativeToPath() {
    let x = this.path.position.x + this.positionRelativeToPath.x;
    let y = this.path.position.y + this.positionRelativeToPath.y;
    this.position = _p5.createVector(x, y);
    this.handleToNext.updatePositionRelativeToAnchor();
    this.handleToPrev.updatePositionRelativeToAnchor();
    this.analyze();
    this.checkForHandleLock();
  }

  updateBothHandlePosition(x, y, reversed) {

    if (this.handleToNext.isPressed == true && reversed == false) {
      this.handleToNext.updatePosition(x, y);
      let reflectionPoint = calcReflectionPoint(this.handleToNext.position, this.position);
      this.handleToPrev.updatePosition(reflectionPoint.x, reflectionPoint.y);
    } else {
      this.handleToPrev.updatePosition(x, y);
      let reflectionPoint = calcReflectionPoint(this.handleToPrev.position, this.position);
      this.handleToNext.updatePosition(reflectionPoint.x, reflectionPoint.y);
    }
    this.analyze();
    this.checkForHandleLock();
  }

  switchAngular() {

    if (this.handleToPrev.locked == false && this.handleToNext.locked == false) {
      this.angular = !this.angular;

      if (this.angular == false) {
        this.alignHandles();
      }

      this.analyze();
    }
  }

  alignHandles() {

    this.analyze();

    let alignedDistance = _p5.abs((this.handleToPrevDistance + this.handleToNextDistance) * 0.5);

    let direction1 = this.handleToPrevDirection;
    let direction2 = calcReflectionPoint(this.handleToNextDirection, _p5.createVector(0, 0));

    let alignedDirection = p5.Vector.add(direction1, direction2).normalize();
    alignedDirection.mult(alignedDistance);

    let handlePos = _p5.createVector(this.position.x + alignedDirection.x, this.position.y + alignedDirection.y);
    let handlePosReflection = calcReflectionPoint(handlePos, this.position);

    this.handleToPrev.updatePosition(handlePosReflection.x, handlePosReflection.y);
    this.handleToNext.updatePosition(handlePos.x, handlePos.y);

  }

  // –––––––––––––––––––––––––––––––––

  display(displayHandle) {

    _p5.push();

    if (displayHandle == true) {
      // _p5.line from anchor to handle
      _p5.strokeWeight(interfaceStrokeWeight);
      _p5.stroke(glyphEditor_anchorColor);
      _p5.noFill();
      _p5.line(this.handleToPrev.position.x, this.handleToPrev.position.y, this.position.x, this.position.y);
      _p5.line(this.handleToNext.position.x, this.handleToNext.position.y, this.position.x, this.position.y);
    }

    // display settings
    _p5.stroke(glyphEditor_anchorColor);
    if (this.active == true) {
      _p5.fill(activeColor);
    } else if (this.isHovered == true) {
      _p5.fill(hoverColor);
    } else {
      _p5.fill(backgroundColor);
    }

    if (this.angular == true) {
      _p5.rect(this.position.x, this.position.y, this.size * 0.9, this.size * 0.9);
      if (this.first == true || this.last == true) {
        _p5.noFill();
        _p5.rect(this.position.x, this.position.y, (this.size * 0.9) + (interfaceStrokeWeight * 6), (this.size * 0.9) + (interfaceStrokeWeight * 6));
      }
    } else {
      _p5.ellipse(this.position.x, this.position.y, this.size, this.size);
      if (this.first == true || this.last == true) {
        _p5.noFill();
        _p5.ellipse(this.position.x, this.position.y, this.size + (interfaceStrokeWeight * 6), this.size + (interfaceStrokeWeight * 6));
      }
    }

    this.displayConnection();

    if (displayHandle == true && this.handleToPrev.locked == false) {
      this.handleToPrev.display();
    }
    if (displayHandle == true && this.handleToNext.locked == false) {
      this.handleToNext.display();
    }

    _p5.pop();
  }

  displayConnection() {
    if ((this.first == true && this.path.connectionToPrev == true) || (this.last == true && this.path.connectionToNext == true)) {

      _p5.strokeWeight(interfaceStrokeWeight);
      if (this.active == true) {
        _p5.stroke(backgroundColor);
      } else if (this.isHovered == true) {
        _p5.stroke(glyphEditor_anchorColor);
      } else {
        _p5.stroke(glyphEditor_anchorColor);
      }
      _p5.noFill();

      if (this.angular == true) {
        _p5.line(this.position.x - (this.size * 0.5), this.position.y - (this.size * 0.5), this.position.x + (this.size * 0.5), this.position.y + (this.size * 0.5));
        _p5.line(this.position.x + (this.size * 0.5), this.position.y - (this.size * 0.5), this.position.x - (this.size * 0.5), this.position.y + (this.size * 0.5));

      } else {
        _p5.line(this.position.x - (this.size * 0.35), this.position.y - (this.size * 0.35), this.position.x + (this.size * 0.35), this.position.y + (this.size * 0.35));
        _p5.line(this.position.x + (this.size * 0.35), this.position.y - (this.size * 0.35), this.position.x - (this.size * 0.35), this.position.y + (this.size * 0.35));
  
      }
      
    }
  }

  // –––––––––––––––––––––––––––––––––

  checkState() {
    super.checkState();
    this.handleToPrev.checkState();
    this.handleToNext.checkState();
  }

  checkForHandleLock() {
    if (this.handleToPrevDistance < this.size * 0.5) {
      this.handleToPrev.locked = true;
      if (this.position.x != this.handleToPrev.position.x || this.position.y != this.handleToPrev.position.y) {
        this.handleToPrev.updatePosition(this.position.x, this.position.y);
      }
    } else {
      this.handleToPrev.locked = false;
    }
    if (this.handleToNextDistance < this.size * 0.5) {
      this.handleToNext.locked = true;
      if (this.position.x != this.handleToNext.position.x || this.position.y != this.handleToNext.position.y) {
        this.handleToNext.updatePosition(this.position.x, this.position.y);
      }
    } else {
      this.handleToNext.locked = false;
    }
    if (this.handleToPrev.locked == true || this.handleToNext.locked == true) {
      this.angular = true;
    }
  }

  analyze() {
    this.handleToPrevDistance = p5.Vector.dist(this.position, this.handleToPrev.position);
    this.handleToNextDistance = p5.Vector.dist(this.position, this.handleToNext.position);
    this.handleToPrevDirection = calcDirection(this.position, this.handleToPrev.position);
    this.handleToNextDirection = calcDirection(this.position, this.handleToNext.position);
    this.angle = calcAngle(this.handleToPrev.position, this.position, this.handleToNext.position);
    this.inwardsCenteredDirection = calcCenterDirection(this.handleToPrev.position, this.position, this.handleToNext.position, this.angle);
    this.outwardsCenteredDirection = calcCenterDirection(this.handleToNext.position, this.position, this.handleToPrev.position, this.angle);
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

class HandleButton extends Button {

  constructor(a, x, y, s) {
    super(x, y, s, "handle");
    this.anchor = a;
    this.positionRelativeToAnchor = _p5.createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
    this.locked = false;
  }

  // –––––––––––––––––––––––––––––––––

  updatePosition(x, y) {
    this.position = _p5.createVector(x, y);
    this.positionRelativeToAnchor = _p5.createVector(this.position.x - this.anchor.position.x, this.position.y - this.anchor.position.y);
    this.anchor.analyze();
    this.anchor.checkForHandleLock();
  }

  updatePositionRelativeToAnchor() {
    let x = this.anchor.position.x + this.positionRelativeToAnchor.x;
    let y = this.anchor.position.y + this.positionRelativeToAnchor.y;
    this.position = _p5.createVector(x, y);
    this.anchor.analyze();
    this.anchor.checkForHandleLock();
  }

  // –––––––––––––––––––––––––––––––––

  display() {
    _p5.stroke(scriptColor);
    _p5.strokeWeight(interfaceStrokeWeight);
    if (this.anchor.active == true) {
      _p5.fill(activeColor);
    } else if (this.isHovered == true) {
      _p5.fill(hoverColor);
    } else {
      _p5.fill(backgroundColor);
    }
    _p5.ellipse(this.position.x, this.position.y, this.size, this.size);
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function mouseOverEllipse(x, y, diameter) {
  return _p5.dist(x, y, _p5.mouseX, _p5.mouseY) < diameter / 2;
}

function mouseOverRect(x, y, width, height) {
  if (_p5.mouseX >= x && _p5.mouseX <= x + _p5.width && _p5.mouseY >= y && _p5.mouseY <= y + _p5.height) {
    return true;
  } else {
    return false
  }
}

function mouseOverBezier(p1, p2, p3, p4, tolerance) {
  // Check points along the Bézier _p5.curve
  for (let t = 0; t <= 1; t += 0.01) {
    let x = _p5.bezierPoint(p1.x, p2.x, p3.x, p4.x, t);
    let y = _p5.bezierPoint(p1.y, p2.y, p3.y, p4.y, t);

    // If _p5.cursor is within the tolerance range of a _p5.point, return true
    if (mouseOverEllipse(x, y, tolerance)) {
      return true;
    }

  }
  return false;
}

function mouseOverBezier(p1, p2, p3, p4, tolerance) {
  // Check points along the Bézier _p5.curve
  for (let t = 0; t <= 1; t += 0.01) {
    let x = _p5.bezierPoint(p1.x, p2.x, p3.x, p4.x, t);
    let y = _p5.bezierPoint(p1.y, p2.y, p3.y, p4.y, t);

    // If _p5.cursor is within the tolerance range of a _p5.point, return true
    if (mouseOverEllipse(x, y, tolerance)) {
      return true;
    }

  }
  return false;
}

function rhombus(x, y, w, h) {
  _p5.beginShape();
  _p5.vertex(x, y - h * 0.5);
  _p5.vertex(x + w * 0.5, y);
  _p5.vertex(x, y + h * 0.5);
  _p5.vertex(x - w * 0.5, y);
  _p5.endShape(_p5.CLOSE);
}

function calcDirection(position, targetPosition) {
  let direction = p5.Vector.sub(position, targetPosition);
  direction.normalize();
  return direction;
}

function calcAngle(prevPosition, position, nextPosition) {

  // Check if the distance to the previous or next _p5.point is zero (Return zero angle if distance is zero)
  if (p5.Vector.dist(position, prevPosition) == 0 || p5.Vector.dist(position, nextPosition) == 0) {
    return 0;
  }

  // Calculate normalized vectors to previous and next points
  let v1 = p5.Vector.sub(position, prevPosition);
  let v2 = p5.Vector.sub(position, nextPosition);
  v1.normalize();
  v2.normalize();
  let dotProduct = v1.dot(v2);
  let angle = _p5.round(_p5.degrees(_p5.acos(dotProduct)));
  if (angle == 180) {
    angle = 0;
  }

  return angle;
}

function calcCenterDirection(prevPosition, position, nextPosition, angle) {

  let centerDirection;

  // if (this.angleCenterDirection.x == 0 && this.angleCenterDirection.y == 0) {
  if (angle == 0) {
    let v = p5.Vector.sub(nextPosition, prevPosition);
    v.normalize();
    centerDirection = _p5.createVector(-v.y, v.x);
  } else {
    // Calculate normalized vectors to previous and next points
    let directionToPrev = p5.Vector.sub(position, prevPosition);
    let directionToNext = p5.Vector.sub(position, nextPosition);
    directionToPrev.normalize();
    directionToNext.normalize();

    // Calculate the bisector of the angle
    centerDirection = p5.Vector.add(directionToPrev, directionToNext).normalize();
  }

  return centerDirection
}

function calcReflectionPoint(position, center) {
  return _p5.createVector(center.x + (center.x - position.x), center.y + (center.y - position.y));
}

// --- FILE: secuencia/js/export.js ---

let inputElement;
function importJSON(fileExtension) {

  return new Promise((resolve, reject) => {

    inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = fileExtension;

    inputElement.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data); // Resolve the Promise with the JSON data
        } catch (err) {
          reject(err); // Reject the Promise if JSON parsing fails
        }
      };
      reader.readAsText(file);

    });

    inputElement.click();
  });
}

function exportJSON(data, fileName) {
  // Convert the custom data object to a JSON string
  const jsonString = JSON.stringify(data, null, 2); // `null, 2` for readable indentation

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Trigger the download
  link.click();

  // Clean up the object URL
  URL.revokeObjectURL(link.href);
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function importScript() {
  importJSON(scriptFileExtension)
    .then((data) => {
      scripts.push(new Script(data));
      setScript(scripts.length - 1);
    })
    .catch((err) => {
      console.error("Failed to import JSON:", err.message);
    });
}

function importTextBoxSettings() {
  importJSON(textBoxSettingsFileExtension)
    .then((data) => {

      lineHeight = _p5.constrain(data.lineHeight, lineHeightMin, lineHeightMax) || lineHeight_DEFAULT;
      scriptStrokeWeight = _p5.constrain(data.strokeWeight, scriptStrokeWeightMin, scriptStrokeWeightMax) || scriptStrokeWeight_DEFAULT;
      size = _p5.constrain(data.size, sizeMin, sizeMax) || size_DEFAULT;
      wordSpace = _p5.constrain(data.wordSpace, wordSpaceMin, wordSpaceMax) || wordSpace_DEFAULT;
      letterSpace = _p5.constrain(data.letterSpace, letterSpaceMin, letterSpaceMax) || letterSpace_DEFAULT;
      letterWidth = _p5.constrain(data.letterWidth, letterWidthMin, letterWidthMax) || letterWidth_DEFAULT;
      letterHeight = _p5.constrain(data.letterHeight, letterHeightMin, letterHeightMax) || letterHeight_DEFAULT;
      slant = _p5.constrain(data.slant, slantMin, slantMax) || slant_DEFAULT;

      _p5.print("data.slant: " + data.slant + "slant: " + slant);
      randomSize = _p5.constrain(data.randomSize, randomSizeMin, randomSizeMax) || randomSize_DEFAULT;
      randomLetterSpace = _p5.constrain(data.randomLetterSpace, randomLetterSpaceMin, randomLetterSpaceMax) || randomLetterSpace_DEFAULT;
      randomLetterWidth = _p5.constrain(data.randomLetterWidth, randomLetterWidthMin, randomLetterWidthMax) || randomLetterWidth_DEFAULT;
      randomLetterHeight = _p5.constrain(data.randomLetterHeight, randomLetterHeightMin, randomLetterHeightMax) || randomLetterHeight_DEFAULT;
      randomSlant = _p5.constrain(data.randomSlant, randomSlantMin, randomSlantMax) || randomSlant_DEFAULT;
      randomBaselineOffset = _p5.constrain(data.randomBaselineOffset, randomBaselineOffsetMin, randomBaselineOffsetMax) || randomBaselineOffset_DEFAULT;
      precision = _p5.constrain(data.precision, precisionMax, precisionMin) || precision_DEFAULT;
      textBox.seed = data.seed || _p5.random(1000);

      updateInterface_textBoxSettings_state();
      updateInterface_textBoxSettings_label();
    })
    .catch((err) => {
      console.error("Failed to import JSON:", err.message);
    });
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function exportAs(value) {

  let stamp = timestamp();

  // generate file name and format
  let fileName;
  switch (value) {
    case 'script':
      fileName = document.getElementById('exportScriptFileName').value || activeScript.name;
      break;
    case 'settings':
      textBoxSettingsFileName = document.getElementById('exportTextBoxSettingsFileName').value || textBoxSettingsFileName;
      fileName = textBoxSettingsFileName;
      break;
    case 'textAsSVG':
    case 'textAsPNG':
      graphicFileName = document.getElementById('exportGraphicFileName').value || graphicFileName;
      fileName = graphicFileName;
      break;
  }
  fileName = fileName.replace(/ /g, "_");
  fileName = fileName + '_' + stamp;

  switch (value) {
    case 'script':
      exportScript(fileName, true, true, 'scripts');
      break;
    case 'settings':
      exportTextBoxSettings(fileName, true, true, 'settings');
      break;
    case 'textAsSVG':
      exportText_SVG(fileName, true, true, 'texts');
      exportTextBoxSettings(fileName, false, true, 'texts');
      exportScript(fileName, false, true, 'texts');
      exportText_PNG(fileName, false, true, 'texts');
      exportText_TXT(fileName, false, true, 'texts');
      break;
    case 'textAsPNG':
      exportText_PNG(fileName, true, true, 'texts');
      exportTextBoxSettings(fileName, false, true, 'texts');
      exportScript(fileName, false, true, 'texts');
      exportText_SVG(fileName, false, true, 'texts');
      exportText_TXT(fileName, false, true, 'texts');
      break;
  }


}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function exportScript(fileName, localDownload, serverUpload, uploadFolder) {
  const data = activeScript.toJSON();

  if (localDownload == true) {
    // _p5.save locally
    exportJSON(data, fileName + scriptFileExtension);
  }

  if (serverUpload == true) {
    // upload to server
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    uploadToServer(blob, fileName + scriptFileExtension, uploadFolder);
  }

  closePrompt('exportScriptPrompt');
}

function exportTextBoxSettings(fileName, localDownload, serverUpload, uploadFolder) {

  const data = {
    lineHeight: lineHeight,
    strokeWeight: scriptStrokeWeight,
    size: size,
    wordSpace: wordSpace,
    letterSpace: letterSpace,
    letterWidth: letterWidth,
    letterHeight: letterHeight,
    slant: slant,
    randomSize: randomSize,
    randomLetterSpace: randomLetterSpace,
    randomLetterWidth: randomLetterWidth,
    randomLetterHeight: randomLetterHeight,
    randomSlant: randomSlant,
    randomBaselineOffset: randomBaselineOffset,
    precision: precision,
    seed: textBox.seed
  };

  if (localDownload == true) {
    // _p5.save locally
    exportJSON(data, fileName + textBoxSettingsFileExtension);
  }

  if (serverUpload == true) {
    // upload to server
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    uploadToServer(blob, fileName + textBoxSettingsFileExtension, uploadFolder);
  }

  closePrompt('exportTextBoxSettingsPrompt');
}

function exportText_SVG(fileName, localDownload, serverUpload, uploadFolder) {

  exportActive = true;
  exportSVGActive = true;
  // Create a temporary graphics buffer with the desired size based on exportSize
  svgCanvas = _p5.createGraphics(textBox.width, textBox.height, _p5.SVG);

  // _p5.translate the temporary canvas to fit the textBox position
  svgCanvas.translate(-textBox.position.x, -textBox.position.y);

  // display and _p5.save
  display();

  if (localDownload == true) {
    // _p5.save locally
    _p5.save(svgCanvas, fileName + '.svg');
  }

  if (serverUpload == true) {
    // convert _p5.SVG canvas to blob and upload to server
    // access the _p5.SVG element
    const svgElement = svgCanvas._renderer.svg;
    // serialize the _p5.SVG element
    const svgString = new XMLSerializer().serializeToString(svgElement);
    // cCreate the Blob from the serialized _p5.SVG string
    const svgBlob = new Blob([svgString], { type: "_p5.image/svg+xml" });
    // upload to server
    uploadToServer(svgBlob, fileName + '.svg', uploadFolder);
  }

  exportActive = false;
  exportSVGActive = false;

  closePrompt('exportTextPrompt');
}

function exportText_PNG(fileName, localDownload, serverUpload, uploadFolder) {

  exportActive = true;

  // Create a temporary graphics buffer with the desired size based on exportSize
  let exportGraphic = _p5.createGraphics(textBox.width, textBox.height, _p5.P2D);

  // update current display state
  display();

  // Scale the original canvas content to fit the export size
  exportGraphic.image(secuenciaCanvas, -textBox.position.x, -textBox.position.y, canvasWidth, canvasHeight);

  if (localDownload == true) {
    // _p5.save locally
    exportGraphic.save(fileName + '.png');
  }

  if (serverUpload == true) {
    // convert PNG canvas to Blob and upload to server
    exportGraphic.canvas.toBlob(blob => {
      uploadToServer(blob, fileName + '.png', uploadFolder);
    });
  }

  exportActive = false;
  closePrompt('exportTextPrompt');

}

function exportText_TXT(fileName, localDownload, serverUpload, uploadFolder) {
  const data = document.getElementById("textInput").value;

  if (localDownload == true) {
    // _p5.save locally
  
    _p5.saveStrings(textToArray(data), fileName + '.txt')
  }

  if (serverUpload == true) {
    // upload to server
    // const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([data], { type: "text/plain" });
    uploadToServer(blob, fileName + '.txt', uploadFolder);
  }

}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

async function uploadToServer(blob, fileName, folder) {
  // Convert POST request to client-side local file download
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.style.display = 'none';
  downloadAnchor.href = url;
  downloadAnchor.download = fileName;
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  
  setTimeout(() => {
    document.body.removeChild(downloadAnchor);
    window.URL.revokeObjectURL(url);
  }, 100);
  
  console.log(`File ${fileName} downloaded successfully`);
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


// --- FILE: secuencia/js/animation.js ---

function anyActiveAnimation() {
  return animations.length > 0
}

function updateAnimation() {
  for (let [index, animation] of [...animations].entries()) {
    animation.update();
    if (animation.complete == true) {
      // remove animation object if animation is complete
      animations.splice(index, 1); 
    }
  }
}

function setupAnimation_textBoxSettings(mode) {

  let maxFactor = 0.5;
  let random_wordSpace = wordSpace;
  let random_letterSpace = letterSpace;
  let random_letterWidth = letterWidth;
  let random_letterHeight = letterHeight;
  let random_slant = slant;
  let random_randomSize = randomSize;
  let random_randomLetterSpace = randomLetterSpace;
  let random_randomLetterWidth = randomLetterWidth;
  let random_randomLetterHeight = randomLetterHeight;
  let random_randomSlant = randomSlant;
  let random_randomBaselineOffset = randomBaselineOffset;
  let random_precision = precision;

  // _p5.random algorithmus below

  //if (_p5.random(1) > 0.5) {
  //  random_wordSpace = _p5.random(0, wordSpaceMax * maxFactor);
  //}
  let randomValWordSpace = _p5.random(1.0);
  if (randomValWordSpace > 0.6) {
    random_wordSpace = _p5.random(0, wordSpaceMax * (maxFactor/2));
  } else if (randomValWordSpace > 0.3) {
    random_wordSpace  = 0.0;
  } else {
    random_wordSpace = wordSpace;
  }   
  
  //if (_p5.random(1) > 0.5) {
  //  random_letterSpace = _p5.random(0, letterSpaceMax * maxFactor);
  //}
  let randomValSpace = _p5.random(1.0);
  if (randomValSpace > 0.6) {
    random_letterSpace = _p5.random(0, letterSpaceMax * maxFactor);
  } else if (randomValSpace > 0.3) {
    random_letterSpace  = 0.0;
  } else {
    random_letterSpace = letterSpace;
  }  
  
  //if (_p5.random(1) > 0.5) {
  //  random_letterWidth = _p5.random(1, letterWidthMax * maxFactor);
  //}
    let randomValWidth = _p5.random(1.0);
  if (randomValWidth > 0.6) {
    random_letterWidth = _p5.random(1, letterWidthMax * maxFactor);
  } else if (randomValWidth > 0.3) {
    random_letterWidth  = 1.0;
  } else {
    random_letterWidth = letterWidth;
  }   
  
  //if (_p5.random(1) > 0.5) {
  //  random_letterHeight = _p5.random(1, letterHeightMax * maxFactor);
  //}
    let randomValHeight = _p5.random(1.0);
  if (randomValHeight > 0.6) {
    random_letterHeight = _p5.random(1, letterHeightMax * maxFactor);
  } else if (randomValHeight > 0.3) {
    random_letterHeight  = 1.0;
  } else {
    random_letterHeight = letterHeight;
  }   
  
  //if (_p5.random(1) > 0.5) {
  //  random_slant = _p5.random(slantMin, slantMax * maxFactor);
  //}
   let randomValSlant = _p5.random(1.0);
  if (randomValSlant > 0.6) {
    random_slant = _p5.random(slantMin, slantMax * maxFactor);
  } else if (randomValSlant > 0.3) {
    random_slant  = 0.0;
  } else {
    random_slant = slant;
  }  

  //if (_p5.random(1) > 0.5) {
  //  random_randomSize = _p5.random(randomSizeMin, randomSizeMax * maxFactor);
  //}
 let randomValRandomSize = _p5.random(1.0);
  if (randomValRandomSize > 0.6) {
    random_randomSize = _p5.random(randomSizeMin, randomSizeMax *  (maxFactor*2));
  } else if (randomValRandomSize > 0.3) {
    random_randomSize  = 0.0;
  } else {
    random_randomSize = randomSize;
  }   
  
 //  if (_p5.random(1) > 0.5) {
 //   random_randomLetterSpace = _p5.random(randomLetterSpaceMin, randomLetterSpaceMax * maxFactor);
 // }
 let randomValRandomSpace = _p5.random(1.0);
  if (randomValRandomSpace > 0.6) {
    random_randomLetterSpace = _p5.random(randomLetterSpaceMin, randomLetterSpaceMax * (maxFactor/2));
  } else if (randomValRandomSpace > 0.3) {
    random_randomLetterSpace  = 0.0;
  } else {
    random_randomLetterSpace = randomLetterSpace;
  }

//  if (_p5.random(1) > 0.5) {
//    random_randomLetterWidth = _p5.random(randomLetterWidthMin, randomLetterWidthMax * maxFactor);
//  } 
  let randomValRandomWidth = _p5.random(1.0);
  if (randomValRandomWidth > 0.6) {
    random_randomLetterWidth = _p5.random(randomLetterWidthMin, randomLetterWidthMax * maxFactor);
  } else if (randomValRandomWidth > 0.3) {
    random_randomLetterWidth  = 0.0;
  } else {
    random_randomLetterWidth = randomLetterWidth;
  }
  
 //  if (_p5.random(1) > 0.5) {
 //   random_randomLetterHeight = _p5.random(randomLetterHeightMin, randomLetterHeightMax * maxFactor);
 //}
     let randomValRandomHeight = _p5.random(1.0);
  if (randomValRandomHeight > 0.6) {
    random_randomLetterHeight = _p5.random(randomLetterHeightMin, randomLetterHeightMax * maxFactor);
  } else if (randomValRandomHeight > 0.3) {
    random_randomLetterHeight  = 0.0;
  } else {
    random_randomLetterHeight = randomLetterHeight;
  }  
  
 // if (_p5.random(1) > 0.5) {
 //   random_randomSlant = _p5.random(randomSlantMin, randomSlantMax * maxFactor);
 // }
   let randomValRandomSlant = _p5.random(1.0);
  if (randomValRandomSlant > 0.6) {
    random_randomSlant = _p5.random(randomSlantMin, randomSlantMax * maxFactor);
  } else if (randomValRandomSlant > 0.3) {
    random_randomSlant  = 0.0;
  } else {
    random_randomSlant = randomSlant;
  }
 
 // if (_p5.random(1) > 0.5) {
 //   random_randomBaselineOffset = _p5.random(randomBaselineOffsetMin, randomBaselineOffsetMax * maxFactor);
 // }
  let randomValRandomBase = _p5.random(1.0);
  if (randomValRandomBase > 0.6) {
    random_randomBaselineOffset = _p5.random(randomBaselineOffsetMin, randomBaselineOffsetMax * (maxFactor*2));
  } else if (randomValRandomBase > 0.3) {
    random_randomBaselineOffset  = 0.0;
  } else {
    random_randomBaselineOffset = precision;
  }
  
  let randomValRandomPrec = _p5.random(1.0);
  if (randomValRandomPrec > 0.9) {
    random_precision  = _p5.random(precisionMax, precisionMin * (maxFactor/2));
  } else if (randomValRandomPrec > 0.2) {
    random_precision  = 0.0;
  } else {
    random_precision = randomBaselineOffset;
  }

  // no more changes here

  textBoxSettings_animation = {
    wordSpace: new AnimatedVariable(wordSpace, mode == "_p5.random" ? random_wordSpace : wordSpace_DEFAULT),
    letterSpace: new AnimatedVariable(letterSpace, mode == "_p5.random" ? random_letterSpace : letterSpace_DEFAULT),
    letterWidth: new AnimatedVariable(letterWidth, mode == "_p5.random" ? random_letterWidth : letterWidth_DEFAULT),
    letterHeight: new AnimatedVariable(letterHeight, mode == "_p5.random" ? random_letterHeight : letterHeight_DEFAULT),
    slant: new AnimatedVariable(slant, mode == "_p5.random" ? random_slant : slant_DEFAULT),
    randomSize: new AnimatedVariable(randomSize, mode == "_p5.random" ? random_randomSize : randomSize_DEFAULT),
    randomLetterSpace: new AnimatedVariable(randomLetterSpace, mode == "_p5.random" ? random_randomLetterSpace : randomLetterSpace_DEFAULT),
    randomLetterWidth: new AnimatedVariable(randomLetterWidth, mode == "_p5.random" ? random_randomLetterWidth : randomLetterWidth_DEFAULT),
    randomLetterHeight: new AnimatedVariable(randomLetterHeight, mode == "_p5.random" ? random_randomLetterHeight : randomLetterHeight_DEFAULT),
    randomSlant: new AnimatedVariable(randomSlant, mode == "_p5.random" ? random_randomSlant : randomSlant_DEFAULT),
    randomBaselineOffset: new AnimatedVariable(randomBaselineOffset, mode == "_p5.random" ? random_randomBaselineOffset : randomBaselineOffset_DEFAULT),
    precision: new AnimatedVariable(precision, mode == "_p5.random" ? random_precision : precision_DEFAULT),
    complete: false,

    update: function() {
      wordSpace = this.wordSpace.update();
      letterSpace = this.letterSpace.update();
      letterWidth = this.letterWidth.update();
      letterHeight = this.letterHeight.update();
      slant = this.slant.update();
      randomSize = this.randomSize.update();
      randomLetterSpace = this.randomLetterSpace.update();
      randomLetterWidth = this.randomLetterWidth.update();
      randomLetterHeight = this.randomLetterHeight.update();
      randomSlant = this.randomSlant.update();
      randomBaselineOffset = this.randomBaselineOffset.update();
      precision = this.precision.update();
      updateInterface_textBoxSettings_state();
      updateInterface_textBoxSettings_label();
      if (this.wordSpace.complete == true && this.letterSpace.complete == true && this.letterWidth.complete == true && this.letterHeight.complete == true &&
        this.slant.complete == true && this.randomSize.complete == true && this.randomLetterSpace.complete == true && this.randomLetterWidth.complete == true &&
        this.randomLetterHeight.complete == true && this.randomSlant.complete == true && this.randomBaselineOffset.complete == true && this.precision.complete == true) {
        this.complete = true;
      }
    }
  };

  animations.push(textBoxSettings_animation);
}

class AnimatedVariable {
  constructor(o, t, d) {
    this.startTime = _p5.millis();
    this.duration = d || 600;
    this.elapsed = 0;
    this.progress = 0;
    this.originValue = o;
    this.targetValue = t;
    this.currentValue = this.originValue;
    this.complete = false;
  }

  update() {
    this.elapsed = _p5.millis() - this.startTime;
    this.progress = _p5.constrain(this.elapsed / this.duration, 0, 1);
    this.currentValue = _p5.lerp(this.originValue, this.targetValue, this.progress);
    if (this.progress === 1) {
      this.complete = true;
    }
    return this.currentValue;
  }

}

window.resetScript = resetScript;
window.addNewScript = addNewScript;
window.importScript = importScript;
window.showPrompt = showPrompt;
window.closePrompt = closePrompt;
window.exportAs = exportAs;
window.randomTextBoxSettings = randomTextBoxSettings;
window.resetTextBoxSettings = resetTextBoxSettings;
window.importTextBoxSettings = importTextBoxSettings;
window.switchMode = switchMode;
window.toggleDropDown = toggleDropDown;
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
window.setGlyph = setGlyph;
window.setGlyphName = setGlyphName;
window.clearGlyph = clearGlyph;
window.setText = setText;

// Added missing UI handlers
window.setScript = setScript;
window.nextScript = nextScript;
window.prevScript = prevScript;
window.switchTextBoxDisplayInfo = switchTextBoxDisplayInfo;
window.setTextBoxDisplayInfo = setTextBoxDisplayInfo;

};
