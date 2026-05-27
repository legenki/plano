
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

function preload() {

  // collect elements
  glyphSetElement = document.getElementById("glyphSet");
  glyphEditorElement = document.getElementById("glyphEditor");
  scriptListElement = document.getElementById('scriptList');
  glyphEditorToolsElement = document.getElementById('glyphEditorTools');

  // import default text (bypass CORS loadStrings)
  defaultTextLines = ["At 12:45 PM, the quick Brown Fox bought 6 juicy snacks for 7.89 and jumped over 2 Lazy Dogs at 3:00"];

  // import script file data (bypass CORS loadJSON)
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

  // translate colors
  backgroundColor = hexToColor(backgroundColor);
  scriptColor = hexToColor(scriptColor);
  gridColor = color(12, 140, 233, 20);
  gridColorLight = color(12, 140, 233, 8);
  hoverColor = hexToColor(hoverColor);
  activeColor = hexToColor(activeColor);
  emptyColor = hexToColor(emptyColor);
  missingColor = hexToColor(missingColor);
  glyphEditor_guideColor = color(255, 59, 48, 100);
  glyphEditor_anchorColor = hexToColor(glyphEditor_anchorColor);
  glyphEditor_firstAnchorColor = hexToColor(glyphEditor_firstAnchorColor);
  glyphEditor_lastAnchorColor = hexToColor(glyphEditor_lastAnchorColor);

  // interfaceFont = loadFont(interfaceFont); // Loaded via CSS @font-face
}

function setup() {
  setupCanvas();
  // setupAsync();

  // import scripts and set active script
  for (let i = 0; i < defaultScriptFiles.length; i++) {
    scripts.push(new Script(defaultScriptFiles[i]));
  }
  setScript(activeScriptIndex);

  glyphEditor = new GlyphEditor();

  textBox = new TextBox(defaultTextLines);

  ellipseMode(CENTER);
  rectMode(CENTER);

  setupInterface();
  setupSecuenciaListeners();
}

function draw() {
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
  background(backgroundColor);

  // Draw background reference image if uploaded
  if (exportActive == false && bgImage) {
    push();
    translate(width / 2 + bgOffsetX, height / 2 + bgOffsetY);
    rotate(radians(bgRotation));
    scale(bgScale / 100.0);
    imageMode(CENTER);
    tint(255, map(bgOpacity, 0, 100, 0, 255));
    image(bgImage, 0, 0);
    pop();
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
//   } catch (random) {
//     alert(random);
//   }
// }

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function colorToHex(c) {
  let r = red(c);
  let g = green(c);
  let b = blue(c);
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
  return color(c.r, c.g, c.b);
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
    bgImage = loadImage(imgUrl);
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
  // Bg image upload listener
  let bgInput = document.getElementById('bgImageInput');
  if (bgInput) {
    bgInput.addEventListener('change', function(e) {
      handleBgImageUpload(e.target.files[0]);
    });
  }

  // Color pickers
  let bgColorPicker = document.getElementById('bgColorPicker');
  if (bgColorPicker) {
    bgColorPicker.addEventListener('input', function(e) {
      backgroundColor = hexToColor(e.target.value);
      let lbl = document.getElementById('label-bg');
      if (lbl) lbl.innerText = e.target.value.toUpperCase();
      updateCanvas_parameter();
    });
  }

  let textColorPicker = document.getElementById('textColorPicker');
  if (textColorPicker) {
    textColorPicker.addEventListener('input', function(e) {
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
      rangeEl.addEventListener('input', function() {
        param.setFn(parseFloat(rangeEl.value));
      });

      // Когда пользователь вводит число вручную
      numEl.addEventListener('input', function() {
        let val = parseFloat(numEl.value);
        if (isNaN(val)) return;
        
        let percentage = 0;
        
        if (param.type === 'direct') {
          val = constrain(val, param.min, param.max);
          percentage = map(val, param.min, param.max, 0, 100);
        } else if (param.type === 'percent_shift') {
          // input: 100..300% -> physical: 0..2
          let phys = (val / 100) - 1;
          phys = constrain(phys, param.min, param.max);
          percentage = map(phys, param.min, param.max, 0, 100);
        } else if (param.type === 'percent_scale') {
          // input: 0..500% -> physical: 0..5
          let phys = val / 100;
          phys = constrain(phys, param.min, param.max);
          percentage = map(phys, param.min, param.max, 0, 100);
        } else if (param.type === 'slant_deg') {
          // input: -45..45 deg -> physical: -1..1
          let phys = val / 45;
          phys = constrain(phys, param.min, param.max);
          percentage = map(phys, param.min, param.max, 0, 100);
        } else if (param.type === 'slider_val') {
          // input: 0..100 (matches slider direct val)
          val = constrain(val, 0, 100);
          percentage = val;
        }

        // Устанавливаем процент слайдера
        param.setFn(percentage);
        // Синхронизируем положение слайдера
        rangeEl.value = percentage;
      });
    }
  });

  // Sync background parameters
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
      rangeEl.addEventListener('input', function() {
        param.setFn(rangeEl.value);
      });
      numEl.addEventListener('input', function() {
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