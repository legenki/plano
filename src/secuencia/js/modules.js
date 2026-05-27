/**
 * SECUENCIA — Module Registry
 *
 * This file is the future entry point for the fully modularized Secuencia.
 * Currently the factory functions are defined but not yet wired into app.js.
 * Each factory receives the p5.js instance (_p5) to avoid global scope pollution.
 *
 * Roadmap:
 *   1. [DONE] Create module files and factory wrappers
 *   2. [TODO] Import factories in app.js and replace inline class definitions
 *   3. [TODO] Extract state vars and constants into a dedicated constants.js
 *   4. [TODO] Shrink app.js to a pure orchestrator
 */

export { createGlyphClasses } from './models/Glyph.js';
export { createScriptClass } from './models/Script.js';
export { createTextBoxClass } from './models/TextBox.js';
export { createGlyphEditorClass } from './ui/GlyphEditor.js';
export { createButtonClasses } from './ui/Buttons.js';
export { createInterfaceFunctions } from './ui/Interface.js';
export { createControlFunctions } from './ui/Control.js';
export { createExportUtils } from './utils/Export.js';
export { createAnimationUtils } from './utils/Animation.js';
