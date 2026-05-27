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

export const secuenciaSketch = (_p5) => {
  _p5.env = {
    get scriptName_DEFAULT() { return typeof scriptName_DEFAULT !== 'undefined' ? scriptName_DEFAULT : undefined; },
    set scriptName_DEFAULT(v) { scriptName_DEFAULT = v; },
    get script_xHeight_DEFAULT() { return typeof script_xHeight_DEFAULT !== 'undefined' ? script_xHeight_DEFAULT : undefined; },
    set script_xHeight_DEFAULT(v) { script_xHeight_DEFAULT = v; },
    get script_ascenderHeight_DEFAULT() { return typeof script_ascenderHeight_DEFAULT !== 'undefined' ? script_ascenderHeight_DEFAULT : undefined; },
    set script_ascenderHeight_DEFAULT(v) { script_ascenderHeight_DEFAULT = v; },
    get script_descenderHeight_DEFAULT() { return typeof script_descenderHeight_DEFAULT !== 'undefined' ? script_descenderHeight_DEFAULT : undefined; },
    set script_descenderHeight_DEFAULT(v) { script_descenderHeight_DEFAULT = v; },
    get script_glyphWidth_DEFAULT() { return typeof script_glyphWidth_DEFAULT !== 'undefined' ? script_glyphWidth_DEFAULT : undefined; },
    set script_glyphWidth_DEFAULT(v) { script_glyphWidth_DEFAULT = v; },
    get script_wordSpace_DEFAULT() { return typeof script_wordSpace_DEFAULT !== 'undefined' ? script_wordSpace_DEFAULT : undefined; },
    set script_wordSpace_DEFAULT(v) { script_wordSpace_DEFAULT = v; },
    get script_xHeight() { return typeof script_xHeight !== 'undefined' ? script_xHeight : undefined; },
    set script_xHeight(v) { script_xHeight = v; },
    get script_ascenderHeight() { return typeof script_ascenderHeight !== 'undefined' ? script_ascenderHeight : undefined; },
    set script_ascenderHeight(v) { script_ascenderHeight = v; },
    get script_descenderHeight() { return typeof script_descenderHeight !== 'undefined' ? script_descenderHeight : undefined; },
    set script_descenderHeight(v) { script_descenderHeight = v; },
    get script_defaultGlyphWidth() { return typeof script_defaultGlyphWidth !== 'undefined' ? script_defaultGlyphWidth : undefined; },
    set script_defaultGlyphWidth(v) { script_defaultGlyphWidth = v; },
    get script_defaultWordSpace() { return typeof script_defaultWordSpace !== 'undefined' ? script_defaultWordSpace : undefined; },
    set script_defaultWordSpace(v) { script_defaultWordSpace = v; },
    get basicLatin() { return typeof basicLatin !== 'undefined' ? basicLatin : undefined; },
    set basicLatin(v) { basicLatin = v; },
    get activeScript() { return typeof activeScript !== 'undefined' ? activeScript : undefined; },
    set activeScript(v) { activeScript = v; },
    get size() { return typeof size !== 'undefined' ? size : undefined; },
    set size(v) { size = v; },
    get wordSpace() { return typeof wordSpace !== 'undefined' ? wordSpace : undefined; },
    set wordSpace(v) { wordSpace = v; },
    get lineHeight() { return typeof lineHeight !== 'undefined' ? lineHeight : undefined; },
    set lineHeight(v) { lineHeight = v; },
    get gridColor() { return typeof gridColor !== 'undefined' ? gridColor : undefined; },
    set gridColor(v) { gridColor = v; },
    get missingColor() { return typeof missingColor !== 'undefined' ? missingColor : undefined; },
    set missingColor(v) { missingColor = v; },
    get scriptStrokeWeight() { return typeof scriptStrokeWeight !== 'undefined' ? scriptStrokeWeight : undefined; },
    set scriptStrokeWeight(v) { scriptStrokeWeight = v; },
    get scriptColor() { return typeof scriptColor !== 'undefined' ? scriptColor : undefined; },
    set scriptColor(v) { scriptColor = v; },
    get glyphEditor_gridSize_DEFAULT() { return typeof glyphEditor_gridSize_DEFAULT !== 'undefined' ? glyphEditor_gridSize_DEFAULT : undefined; },
    set glyphEditor_gridSize_DEFAULT(v) { glyphEditor_gridSize_DEFAULT = v; },
    get glyphEditor_gridsPerSegment_DEFAULT() { return typeof glyphEditor_gridsPerSegment_DEFAULT !== 'undefined' ? glyphEditor_gridsPerSegment_DEFAULT : undefined; },
    set glyphEditor_gridsPerSegment_DEFAULT(v) { glyphEditor_gridsPerSegment_DEFAULT = v; },
    get glyphEditor_scriptStrokeWeight_DEFAULT() { return typeof glyphEditor_scriptStrokeWeight_DEFAULT !== 'undefined' ? glyphEditor_scriptStrokeWeight_DEFAULT : undefined; },
    set glyphEditor_scriptStrokeWeight_DEFAULT(v) { glyphEditor_scriptStrokeWeight_DEFAULT = v; },
    get glyphEditor_buttonSizeBig_DEFAULT() { return typeof glyphEditor_buttonSizeBig_DEFAULT !== 'undefined' ? glyphEditor_buttonSizeBig_DEFAULT : undefined; },
    set glyphEditor_buttonSizeBig_DEFAULT(v) { glyphEditor_buttonSizeBig_DEFAULT = v; },
    get glyphEditor_buttonSizeSmall_DEFAULT() { return typeof glyphEditor_buttonSizeSmall_DEFAULT !== 'undefined' ? glyphEditor_buttonSizeSmall_DEFAULT : undefined; },
    set glyphEditor_buttonSizeSmall_DEFAULT(v) { glyphEditor_buttonSizeSmall_DEFAULT = v; },
    get glyphEditor_guideColor() { return typeof glyphEditor_guideColor !== 'undefined' ? glyphEditor_guideColor : undefined; },
    set glyphEditor_guideColor(v) { glyphEditor_guideColor = v; },
    get backgroundColor() { return typeof backgroundColor !== 'undefined' ? backgroundColor : undefined; },
    set backgroundColor(v) { backgroundColor = v; },
    get hoverColor() { return typeof hoverColor !== 'undefined' ? hoverColor : undefined; },
    set hoverColor(v) { hoverColor = v; },
    get glyphEditor_anchorColor() { return typeof glyphEditor_anchorColor !== 'undefined' ? glyphEditor_anchorColor : undefined; },
    set glyphEditor_anchorColor(v) { glyphEditor_anchorColor = v; },
    get activeColor() { return typeof activeColor !== 'undefined' ? activeColor : undefined; },
    set activeColor(v) { activeColor = v; },
    get scripts() { return typeof scripts !== 'undefined' ? scripts : undefined; },
    set scripts(v) { scripts = v; },
    get wordSpace_DEFAULT() { return typeof wordSpace_DEFAULT !== 'undefined' ? wordSpace_DEFAULT : undefined; },
    set wordSpace_DEFAULT(v) { wordSpace_DEFAULT = v; },
    get letterSpace_DEFAULT() { return typeof letterSpace_DEFAULT !== 'undefined' ? letterSpace_DEFAULT : undefined; },
    set letterSpace_DEFAULT(v) { letterSpace_DEFAULT = v; },
    get letterWidth_DEFAULT() { return typeof letterWidth_DEFAULT !== 'undefined' ? letterWidth_DEFAULT : undefined; },
    set letterWidth_DEFAULT(v) { letterWidth_DEFAULT = v; },
    get letterHeight_DEFAULT() { return typeof letterHeight_DEFAULT !== 'undefined' ? letterHeight_DEFAULT : undefined; },
    set letterHeight_DEFAULT(v) { letterHeight_DEFAULT = v; },
    get slant_DEFAULT() { return typeof slant_DEFAULT !== 'undefined' ? slant_DEFAULT : undefined; },
    set slant_DEFAULT(v) { slant_DEFAULT = v; },
    get randomSize_DEFAULT() { return typeof randomSize_DEFAULT !== 'undefined' ? randomSize_DEFAULT : undefined; },
    set randomSize_DEFAULT(v) { randomSize_DEFAULT = v; },
    get randomLetterSpace_DEFAULT() { return typeof randomLetterSpace_DEFAULT !== 'undefined' ? randomLetterSpace_DEFAULT : undefined; },
    set randomLetterSpace_DEFAULT(v) { randomLetterSpace_DEFAULT = v; },
    get randomLetterWidth_DEFAULT() { return typeof randomLetterWidth_DEFAULT !== 'undefined' ? randomLetterWidth_DEFAULT : undefined; },
    set randomLetterWidth_DEFAULT(v) { randomLetterWidth_DEFAULT = v; },
    get randomLetterHeight_DEFAULT() { return typeof randomLetterHeight_DEFAULT !== 'undefined' ? randomLetterHeight_DEFAULT : undefined; },
    set randomLetterHeight_DEFAULT(v) { randomLetterHeight_DEFAULT = v; },
    get randomSlant_DEFAULT() { return typeof randomSlant_DEFAULT !== 'undefined' ? randomSlant_DEFAULT : undefined; },
    set randomSlant_DEFAULT(v) { randomSlant_DEFAULT = v; },
    get randomBaselineOffset_DEFAULT() { return typeof randomBaselineOffset_DEFAULT !== 'undefined' ? randomBaselineOffset_DEFAULT : undefined; },
    set randomBaselineOffset_DEFAULT(v) { randomBaselineOffset_DEFAULT = v; },
    get precision_DEFAULT() { return typeof precision_DEFAULT !== 'undefined' ? precision_DEFAULT : undefined; },
    set precision_DEFAULT(v) { precision_DEFAULT = v; },
    get letterSpace() { return typeof letterSpace !== 'undefined' ? letterSpace : undefined; },
    set letterSpace(v) { letterSpace = v; },
    get letterWidth() { return typeof letterWidth !== 'undefined' ? letterWidth : undefined; },
    set letterWidth(v) { letterWidth = v; },
    get letterHeight() { return typeof letterHeight !== 'undefined' ? letterHeight : undefined; },
    set letterHeight(v) { letterHeight = v; },
    get slant() { return typeof slant !== 'undefined' ? slant : undefined; },
    set slant(v) { slant = v; },
    get randomSize() { return typeof randomSize !== 'undefined' ? randomSize : undefined; },
    set randomSize(v) { randomSize = v; },
    get randomLetterSpace() { return typeof randomLetterSpace !== 'undefined' ? randomLetterSpace : undefined; },
    set randomLetterSpace(v) { randomLetterSpace = v; },
    get randomLetterWidth() { return typeof randomLetterWidth !== 'undefined' ? randomLetterWidth : undefined; },
    set randomLetterWidth(v) { randomLetterWidth = v; },
    get randomLetterHeight() { return typeof randomLetterHeight !== 'undefined' ? randomLetterHeight : undefined; },
    set randomLetterHeight(v) { randomLetterHeight = v; },
    get randomSlant() { return typeof randomSlant !== 'undefined' ? randomSlant : undefined; },
    set randomSlant(v) { randomSlant = v; },
    get randomBaselineOffset() { return typeof randomBaselineOffset !== 'undefined' ? randomBaselineOffset : undefined; },
    set randomBaselineOffset(v) { randomBaselineOffset = v; },
    get precision() { return typeof precision !== 'undefined' ? precision : undefined; },
    set precision(v) { precision = v; },
    get animations() { return typeof animations !== 'undefined' ? animations : undefined; },
    set animations(v) { animations = v; },
    get activeScriptIndex() { return typeof activeScriptIndex !== 'undefined' ? activeScriptIndex : undefined; },
    set activeScriptIndex(v) { activeScriptIndex = v; },
    get glyphEditor() { return typeof glyphEditor !== 'undefined' ? glyphEditor : undefined; },
    set glyphEditor(v) { glyphEditor = v; },
    get Script() { return typeof Script !== 'undefined' ? Script : undefined; },
    get arrayToText() { return typeof arrayToText !== 'undefined' ? arrayToText : undefined; },
    get canvasHeight() { return typeof canvasHeight !== 'undefined' ? canvasHeight : undefined; },
    set canvasHeight(v) { canvasHeight = v; },
    get canvasWidth() { return typeof canvasWidth !== 'undefined' ? canvasWidth : undefined; },
    set canvasWidth(v) { canvasWidth = v; },
    get colorToHex() { return typeof colorToHex !== 'undefined' ? colorToHex : undefined; },
    get defaultScriptFiles() { return typeof defaultScriptFiles !== 'undefined' ? defaultScriptFiles : undefined; },
    set defaultScriptFiles(v) { defaultScriptFiles = v; },
    get developerMode() { return typeof developerMode !== 'undefined' ? developerMode : undefined; },
    set developerMode(v) { developerMode = v; },
    get diffAndUpdateDOM() { return typeof diffAndUpdateDOM !== 'undefined' ? diffAndUpdateDOM : undefined; },
    get display() { return typeof display !== 'undefined' ? display : undefined; },
    get emptyColor() { return typeof emptyColor !== 'undefined' ? emptyColor : undefined; },
    set emptyColor(v) { emptyColor = v; },
    get exportActive() { return typeof exportActive !== 'undefined' ? exportActive : undefined; },
    set exportActive(v) { exportActive = v; },
    get exportSVGActive() { return typeof exportSVGActive !== 'undefined' ? exportSVGActive : undefined; },
    set exportSVGActive(v) { exportSVGActive = v; },
    get glyphEditorElement() { return typeof glyphEditorElement !== 'undefined' ? glyphEditorElement : undefined; },
    set glyphEditorElement(v) { glyphEditorElement = v; },
    get glyphEditor_height() { return typeof glyphEditor_height !== 'undefined' ? glyphEditor_height : undefined; },
    set glyphEditor_height(v) { glyphEditor_height = v; },
    get glyphEditor_heightMax() { return typeof glyphEditor_heightMax !== 'undefined' ? glyphEditor_heightMax : undefined; },
    set glyphEditor_heightMax(v) { glyphEditor_heightMax = v; },
    get glyphEditor_heightMin() { return typeof glyphEditor_heightMin !== 'undefined' ? glyphEditor_heightMin : undefined; },
    set glyphEditor_heightMin(v) { glyphEditor_heightMin = v; },
    get glyphEditor_width() { return typeof glyphEditor_width !== 'undefined' ? glyphEditor_width : undefined; },
    set glyphEditor_width(v) { glyphEditor_width = v; },
    get glyphSetElement() { return typeof glyphSetElement !== 'undefined' ? glyphSetElement : undefined; },
    set glyphSetElement(v) { glyphSetElement = v; },
    get glyphSet_boxSize() { return typeof glyphSet_boxSize !== 'undefined' ? glyphSet_boxSize : undefined; },
    set glyphSet_boxSize(v) { glyphSet_boxSize = v; },
    get glyphSet_missingLink() { return typeof glyphSet_missingLink !== 'undefined' ? glyphSet_missingLink : undefined; },
    set glyphSet_missingLink(v) { glyphSet_missingLink = v; },
    get graphicFileName() { return typeof graphicFileName !== 'undefined' ? graphicFileName : undefined; },
    set graphicFileName(v) { graphicFileName = v; },
    get gridColorLight() { return typeof gridColorLight !== 'undefined' ? gridColorLight : undefined; },
    set gridColorLight(v) { gridColorLight = v; },
    get hersheyAlphabet() { return typeof hersheyAlphabet !== 'undefined' ? hersheyAlphabet : undefined; },
    set hersheyAlphabet(v) { hersheyAlphabet = v; },
    get hersheyBaseIndex() { return typeof hersheyBaseIndex !== 'undefined' ? hersheyBaseIndex : undefined; },
    set hersheyBaseIndex(v) { hersheyBaseIndex = v; },
    get hersheyScale() { return typeof hersheyScale !== 'undefined' ? hersheyScale : undefined; },
    set hersheyScale(v) { hersheyScale = v; },
    get hersheyShift() { return typeof hersheyShift !== 'undefined' ? hersheyShift : undefined; },
    set hersheyShift(v) { hersheyShift = v; },
    get interfaceFont() { return typeof interfaceFont !== 'undefined' ? interfaceFont : undefined; },
    set interfaceFont(v) { interfaceFont = v; },
    get interfaceFontSize() { return typeof interfaceFontSize !== 'undefined' ? interfaceFontSize : undefined; },
    set interfaceFontSize(v) { interfaceFontSize = v; },
    get interfaceMargin() { return typeof interfaceMargin !== 'undefined' ? interfaceMargin : undefined; },
    set interfaceMargin(v) { interfaceMargin = v; },
    get interfaceStrokeWeight() { return typeof interfaceStrokeWeight !== 'undefined' ? interfaceStrokeWeight : undefined; },
    set interfaceStrokeWeight(v) { interfaceStrokeWeight = v; },
    get isHovering() { return typeof isHovering !== 'undefined' ? isHovering : undefined; },
    set isHovering(v) { isHovering = v; },
    get letterHeightMax() { return typeof letterHeightMax !== 'undefined' ? letterHeightMax : undefined; },
    set letterHeightMax(v) { letterHeightMax = v; },
    get letterHeightMin() { return typeof letterHeightMin !== 'undefined' ? letterHeightMin : undefined; },
    set letterHeightMin(v) { letterHeightMin = v; },
    get letterSpaceMax() { return typeof letterSpaceMax !== 'undefined' ? letterSpaceMax : undefined; },
    set letterSpaceMax(v) { letterSpaceMax = v; },
    get letterSpaceMin() { return typeof letterSpaceMin !== 'undefined' ? letterSpaceMin : undefined; },
    set letterSpaceMin(v) { letterSpaceMin = v; },
    get letterWidthMax() { return typeof letterWidthMax !== 'undefined' ? letterWidthMax : undefined; },
    set letterWidthMax(v) { letterWidthMax = v; },
    get letterWidthMin() { return typeof letterWidthMin !== 'undefined' ? letterWidthMin : undefined; },
    set letterWidthMin(v) { letterWidthMin = v; },
    get lineHeightMax() { return typeof lineHeightMax !== 'undefined' ? lineHeightMax : undefined; },
    set lineHeightMax(v) { lineHeightMax = v; },
    get lineHeightMin() { return typeof lineHeightMin !== 'undefined' ? lineHeightMin : undefined; },
    set lineHeightMin(v) { lineHeightMin = v; },
    get lineHeight_DEFAULT() { return typeof lineHeight_DEFAULT !== 'undefined' ? lineHeight_DEFAULT : undefined; },
    set lineHeight_DEFAULT(v) { lineHeight_DEFAULT = v; },
    get precisionMax() { return typeof precisionMax !== 'undefined' ? precisionMax : undefined; },
    set precisionMax(v) { precisionMax = v; },
    get precisionMin() { return typeof precisionMin !== 'undefined' ? precisionMin : undefined; },
    set precisionMin(v) { precisionMin = v; },
    get randomBaselineOffsetMax() { return typeof randomBaselineOffsetMax !== 'undefined' ? randomBaselineOffsetMax : undefined; },
    set randomBaselineOffsetMax(v) { randomBaselineOffsetMax = v; },
    get randomBaselineOffsetMin() { return typeof randomBaselineOffsetMin !== 'undefined' ? randomBaselineOffsetMin : undefined; },
    set randomBaselineOffsetMin(v) { randomBaselineOffsetMin = v; },
    get randomLetterHeightMax() { return typeof randomLetterHeightMax !== 'undefined' ? randomLetterHeightMax : undefined; },
    set randomLetterHeightMax(v) { randomLetterHeightMax = v; },
    get randomLetterHeightMin() { return typeof randomLetterHeightMin !== 'undefined' ? randomLetterHeightMin : undefined; },
    set randomLetterHeightMin(v) { randomLetterHeightMin = v; },
    get randomLetterSpaceMax() { return typeof randomLetterSpaceMax !== 'undefined' ? randomLetterSpaceMax : undefined; },
    set randomLetterSpaceMax(v) { randomLetterSpaceMax = v; },
    get randomLetterSpaceMin() { return typeof randomLetterSpaceMin !== 'undefined' ? randomLetterSpaceMin : undefined; },
    set randomLetterSpaceMin(v) { randomLetterSpaceMin = v; },
    get randomLetterWidthMax() { return typeof randomLetterWidthMax !== 'undefined' ? randomLetterWidthMax : undefined; },
    set randomLetterWidthMax(v) { randomLetterWidthMax = v; },
    get randomLetterWidthMin() { return typeof randomLetterWidthMin !== 'undefined' ? randomLetterWidthMin : undefined; },
    set randomLetterWidthMin(v) { randomLetterWidthMin = v; },
    get randomSizeMax() { return typeof randomSizeMax !== 'undefined' ? randomSizeMax : undefined; },
    set randomSizeMax(v) { randomSizeMax = v; },
    get randomSizeMin() { return typeof randomSizeMin !== 'undefined' ? randomSizeMin : undefined; },
    set randomSizeMin(v) { randomSizeMin = v; },
    get randomSlantMax() { return typeof randomSlantMax !== 'undefined' ? randomSlantMax : undefined; },
    set randomSlantMax(v) { randomSlantMax = v; },
    get randomSlantMin() { return typeof randomSlantMin !== 'undefined' ? randomSlantMin : undefined; },
    set randomSlantMin(v) { randomSlantMin = v; },
    get rotateAll() { return typeof rotateAll !== 'undefined' ? rotateAll : undefined; },
    set rotateAll(v) { rotateAll = v; },
    get scriptFileExtension() { return typeof scriptFileExtension !== 'undefined' ? scriptFileExtension : undefined; },
    set scriptFileExtension(v) { scriptFileExtension = v; },
    get scriptStrokeWeightMax() { return typeof scriptStrokeWeightMax !== 'undefined' ? scriptStrokeWeightMax : undefined; },
    set scriptStrokeWeightMax(v) { scriptStrokeWeightMax = v; },
    get scriptStrokeWeightMin() { return typeof scriptStrokeWeightMin !== 'undefined' ? scriptStrokeWeightMin : undefined; },
    set scriptStrokeWeightMin(v) { scriptStrokeWeightMin = v; },
    get scriptStrokeWeight_DEFAULT() { return typeof scriptStrokeWeight_DEFAULT !== 'undefined' ? scriptStrokeWeight_DEFAULT : undefined; },
    set scriptStrokeWeight_DEFAULT(v) { scriptStrokeWeight_DEFAULT = v; },
    get secuenciaCanvas() { return typeof secuenciaCanvas !== 'undefined' ? secuenciaCanvas : undefined; },
    set secuenciaCanvas(v) { secuenciaCanvas = v; },
    get setGlyph() { return typeof setGlyph !== 'undefined' ? setGlyph : undefined; },
    get setScript() { return typeof setScript !== 'undefined' ? setScript : undefined; },
    get setupAnimation_textBoxSettings() { return typeof setupAnimation_textBoxSettings !== 'undefined' ? setupAnimation_textBoxSettings : undefined; },
    get sizeMax() { return typeof sizeMax !== 'undefined' ? sizeMax : undefined; },
    set sizeMax(v) { sizeMax = v; },
    get sizeMin() { return typeof sizeMin !== 'undefined' ? sizeMin : undefined; },
    set sizeMin(v) { sizeMin = v; },
    get size_DEFAULT() { return typeof size_DEFAULT !== 'undefined' ? size_DEFAULT : undefined; },
    set size_DEFAULT(v) { size_DEFAULT = v; },
    get slantMax() { return typeof slantMax !== 'undefined' ? slantMax : undefined; },
    set slantMax(v) { slantMax = v; },
    get slantMin() { return typeof slantMin !== 'undefined' ? slantMin : undefined; },
    set slantMin(v) { slantMin = v; },
    get svgCanvas() { return typeof svgCanvas !== 'undefined' ? svgCanvas : undefined; },
    set svgCanvas(v) { svgCanvas = v; },
    get textBox() { return typeof textBox !== 'undefined' ? textBox : undefined; },
    set textBox(v) { textBox = v; },
    get textBoxSettingsFileExtension() { return typeof textBoxSettingsFileExtension !== 'undefined' ? textBoxSettingsFileExtension : undefined; },
    set textBoxSettingsFileExtension(v) { textBoxSettingsFileExtension = v; },
    get textBoxSettingsFileName() { return typeof textBoxSettingsFileName !== 'undefined' ? textBoxSettingsFileName : undefined; },
    set textBoxSettingsFileName(v) { textBoxSettingsFileName = v; },
    get textBoxSettings_animation() { return typeof textBoxSettings_animation !== 'undefined' ? textBoxSettings_animation : undefined; },
    set textBoxSettings_animation(v) { textBoxSettings_animation = v; },
    get textBoxSettings_width() { return typeof textBoxSettings_width !== 'undefined' ? textBoxSettings_width : undefined; },
    set textBoxSettings_width(v) { textBoxSettings_width = v; },
    get textToArray() { return typeof textToArray !== 'undefined' ? textToArray : undefined; },
    get timestamp() { return typeof timestamp !== 'undefined' ? timestamp : undefined; },
    get toolbar_buttonSize() { return typeof toolbar_buttonSize !== 'undefined' ? toolbar_buttonSize : undefined; },
    set toolbar_buttonSize(v) { toolbar_buttonSize = v; },
    get wordSpaceMax() { return typeof wordSpaceMax !== 'undefined' ? wordSpaceMax : undefined; },
    set wordSpaceMax(v) { wordSpaceMax = v; },
    get wordSpaceMin() { return typeof wordSpaceMin !== 'undefined' ? wordSpaceMin : undefined; },
    set wordSpaceMin(v) { wordSpaceMin = v; },
  };

// --- Initialize module factories (bind p5 instance to all classes) ---
initGlyphModels(_p5);
initScriptModel(_p5);
const TextBox = createTextBoxClass(_p5);
const { Button, GuideButton, PathButton, AnchorButton, HandleButton, mouseOverRect } = createButtonClasses(_p5);
const GlyphEditor = createGlyphEditorClass(_p5, { GuideButton, PathButton, AnchorButton, Path, Anchor, mouseOverRect });
const {
  importJSON, exportJSON, importScript, exportScript, exportTextBoxSettings,
  exportAs, exportText_SVG, exportText_PNG, exportText_TXT,
  uploadToServer, importTextBoxSettings,
} = createExportUtils(_p5, { Script, setScript });
const {
  AnimatedVariable, anyActiveAnimation, updateAnimation, setupAnimation_textBoxSettings,
} = createAnimationUtils(_p5);

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
  // Instantiate UIManager and add its methods to env
  Object.assign(_p5.env, createUIManager(_p5));


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

function saveSecuenciaState() {
  const data = {
    activeScriptIndex: activeScriptIndex,
    scripts: scripts.map(s => s.toJSON()),
    textBoxText: document.getElementById("textInput") ? document.getElementById("textInput").value : null,
    textBoxSettings: {
       size, wordSpace, letterSpace, lineHeight, letterWidth, letterHeight, slant,
       randomSize, randomLetterSpace, randomLetterWidth, randomLetterHeight, randomSlant, randomBaselineOffset, precision,
       scriptStrokeWeight, 
       backgroundColor: typeof backgroundColor === 'object' && backgroundColor.levels ? colorToHex(backgroundColor) : backgroundColor, 
       scriptColor: typeof scriptColor === 'object' && scriptColor.levels ? colorToHex(scriptColor) : scriptColor, 
       rotateAll
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
        scripts = [];
        data.scripts.forEach(sData => {
           let sc = new Script();
           sc.fromJSON(sData);
           scripts.push(sc);
        });
        activeScriptIndex = data.activeScriptIndex || 0;
        
        if (data.textBoxSettings) {
           size = data.textBoxSettings.size !== undefined ? data.textBoxSettings.size : size;
           wordSpace = data.textBoxSettings.wordSpace !== undefined ? data.textBoxSettings.wordSpace : wordSpace;
           letterSpace = data.textBoxSettings.letterSpace !== undefined ? data.textBoxSettings.letterSpace : letterSpace;
           lineHeight = data.textBoxSettings.lineHeight !== undefined ? data.textBoxSettings.lineHeight : lineHeight;
           letterWidth = data.textBoxSettings.letterWidth !== undefined ? data.textBoxSettings.letterWidth : letterWidth;
           letterHeight = data.textBoxSettings.letterHeight !== undefined ? data.textBoxSettings.letterHeight : letterHeight;
           slant = data.textBoxSettings.slant !== undefined ? data.textBoxSettings.slant : slant;
           randomSize = data.textBoxSettings.randomSize !== undefined ? data.textBoxSettings.randomSize : randomSize;
           randomLetterSpace = data.textBoxSettings.randomLetterSpace !== undefined ? data.textBoxSettings.randomLetterSpace : randomLetterSpace;
           randomLetterWidth = data.textBoxSettings.randomLetterWidth !== undefined ? data.textBoxSettings.randomLetterWidth : randomLetterWidth;
           randomLetterHeight = data.textBoxSettings.randomLetterHeight !== undefined ? data.textBoxSettings.randomLetterHeight : randomLetterHeight;
           randomSlant = data.textBoxSettings.randomSlant !== undefined ? data.textBoxSettings.randomSlant : randomSlant;
           randomBaselineOffset = data.textBoxSettings.randomBaselineOffset !== undefined ? data.textBoxSettings.randomBaselineOffset : randomBaselineOffset;
           precision = data.textBoxSettings.precision !== undefined ? data.textBoxSettings.precision : precision;
           scriptStrokeWeight = data.textBoxSettings.scriptStrokeWeight !== undefined ? data.textBoxSettings.scriptStrokeWeight : scriptStrokeWeight;
           
           if (data.textBoxSettings.backgroundColor !== undefined) {
             const bg = data.textBoxSettings.backgroundColor;
             backgroundColor = (typeof bg === 'string') ? hexToColor(bg) : (bg.levels ? _p5.color(bg.levels) : backgroundColor);
           }
           if (data.textBoxSettings.scriptColor !== undefined) {
             const sc = data.textBoxSettings.scriptColor;
             scriptColor = (typeof sc === 'string') ? hexToColor(sc) : (sc.levels ? _p5.color(sc.levels) : scriptColor);
           }
           
           if (data.textBoxSettings.rotateAll !== undefined && typeof rotateAll !== 'undefined') rotateAll = data.textBoxSettings.rotateAll;
        }
        if (data.textBoxText) {
           setTimeout(() => {
             const input = document.getElementById("textInput");
             if (input) {
               input.value = data.textBoxText;
               if (typeof textBox !== 'undefined') {
                 textBox.setText(textToArray(data.textBoxText));
                 _p5.redraw();
               }
             }
           }, 100);
        }
        return true;
      }
    } catch(e) {
      console.error("Auto-save load failed:", e);
    }
  }
  return false;
}

_p5.setup = function() {
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
    for (let i = 0; i < defaultScriptFiles.length; i++) {
      scripts.push(new Script(defaultScriptFiles[i]));
    }
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
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// --- FILE: secuencia/js/control.js ---

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorTools

function switchMode(value) {
  glyphEditor.setMode(value);
  _p5.env.updateInterface_glyphEditorTools_state();
}

function switchGlyphEditorDisplayInfo() {
  glyphEditor.displayInfo = !glyphEditor.displayInfo;
  _p5.env.updateInterface_glyphEditorTools_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditorContext

function switchConnectionToPrev() {
  glyphEditor.switchConnectionToPrev();
  _p5.env.updateInterface_glyphEditorContext_state();
}

function switchConnectionToNext() {
  glyphEditor.switchConnectionToNext();
  _p5.env.updateInterface_glyphEditorContext_state();
}

function switchMainPath() {
  glyphEditor.switchMainPath();
  _p5.env.updateInterface_glyphEditorContext_state();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// glyphEditor

function setGlyph(char) {
  glyphEditor.setActiveGlyph(char);
  _p5.env.updateInterface_glyphSet_state();
}

function setGlyphName() {

  var value = document.Id("setGlyphName").value;
  var char = glyphSet_missingLink;

  if (value.length > 0 && value != '') {
    char = value;
  }

  glyphEditor.setActiveGlyphName(char);
  _p5.env.updateInterface_glyphSet_state();

  _p5.env.closePrompt('setGlyphNamePrompt');
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
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_glyphSet_boxes();
  _p5.env.updateInterface_scriptList_state();
  _p5.env.updateInterface_scriptList_label();
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
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_glyphSet_boxes();
  _p5.env.updateInterface_scriptList_state();
  _p5.env.updateInterface_scriptList_label();
}

function addNewScript() {
  scripts.push(new Script());
  activeScriptIndex = scripts.length - 1;
  setScript(activeScriptIndex);
}

function setScriptName(value) {
  activeScript.name = value;
  _p5.env.updateInterface_scriptName();
  _p5.env.updateInterface_scriptList_label();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBox

function switchTextBoxDisplayInfo() {
  textBox.displayInfo = !textBox.displayInfo;
  _p5.env.updateInterface_textBoxTools_state();
}

function setTextBoxDisplayInfo(value) {
  
  if (value == 'hide') {
    textBox.displayInfo = false;
  } else {
    textBox.displayInfo = true;
  }

  _p5.env.updateInterface_textBoxTools_state();
}


// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

// textBoxSettings

function setText() {
  var textInput = document.getElementById("textInput").value;
  textBox.setText(textToArray(textInput));
  _p5.env.updateInterface_glyphSet_state();
}

function setLineHeight(value) {
  lineHeight = _p5.map(value, 0, 100, lineHeightMin, lineHeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setScriptStrokeWeight(value) {
  scriptStrokeWeight = _p5.map(value, 0, 100, scriptStrokeWeightMin, scriptStrokeWeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setSize(value) {
  size = _p5.map(value, 0, 100, sizeMin, sizeMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setWordSpace(value) { // direct translation
  wordSpace = _p5.map(value, 0, 100, wordSpaceMin, wordSpaceMax);
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
  letterSpace = _p5.map(value, 0, 100, letterSpaceMin, letterSpaceMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setLetterWidth(value) {
  letterWidth = _p5.map(value, 0, 100, letterWidthMin, letterWidthMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setLetterHeight(value) {
  letterHeight = _p5.map(value, 0, 100, letterHeightMin, letterHeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setSlant(value) {
  slant = _p5.map(value, 0, 100, slantMin, slantMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomSize(value) {
  randomSize = _p5.map(value, 0, 100, randomSizeMin, randomSizeMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomLetterSpace(value) {
  randomLetterSpace = _p5.map(value, 0, 100, randomLetterSpaceMin, randomLetterSpaceMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomLetterWidth(value) {
  randomLetterWidth = _p5.map(value, 0, 100, randomLetterWidthMin, randomLetterWidthMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomLetterHeight(value) {
  randomLetterHeight = _p5.map(value, 0, 100, randomLetterHeightMin, randomLetterHeightMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomSlant(value) {
  randomSlant = _p5.map(value, 0, 100, randomSlantMin, randomSlantMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setRandomBaselineOffset(value) {
  randomBaselineOffset = _p5.map(value, 0, 100, randomBaselineOffsetMin, randomBaselineOffsetMax);
  _p5.env.updateInterface_textBoxSettings_label();
}

function setPrecision(value) {
  precision = _p5.map(value, 0, 100, precisionMin, precisionMax);
  _p5.env.updateInterface_textBoxSettings_label();
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
bindEvents(_p5);

};
