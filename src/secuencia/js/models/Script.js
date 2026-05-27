import { parseSCM, parseJHF } from "../utils/parsers/LegacyParsers.js";
/**
 * SECUENCIA — _p5.env.Script Model
 * Requires _p5 (p5.js instance) + Glyph classes passed as factory parameters.
 */

import { Glyph, Path, Anchor, Handle } from './Glyph.js';
let _p5;
export function initScriptModel(p) {
  _p5 = p;
}
export class Script {
  constructor(data) {
    this.reset();
    if (Array.isArray(data)) {
      if (data[0].includes('.scm')) {
        parseSCM(this, data); // outdated file format
      } else if (data[0].includes('.jhf')) {
        parseJHF(this, data); // outdated file format
      }
    } else if (typeof data == 'object') {
      this.fromJSON(data); // json file format
    } else {
      // blank glyphs
    }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  reset() {
    this.name = this.name == null ? _p5.env.scriptName_DEFAULT : this.name;
    this.xHeight = _p5.env.script_xHeight_DEFAULT;
    this.ascenderHeight = _p5.env.script_ascenderHeight_DEFAULT;
    this.descenderHeight = _p5.env.script_descenderHeight_DEFAULT;
    this.defaultGlyphWidth = _p5.env.script_glyphWidth_DEFAULT;
    this.wordSpace = _p5.env.script_wordSpace_DEFAULT;
    this.glyphs = [];
    this.setupBlankGlyphs();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  fromJSON(data) {
    this.name = data ? data.name : _p5.env.scriptName_DEFAULT;
    this.xHeight = data ? data.xHeight : _p5.env.script_xHeight;
    this.ascenderHeight = data ? data.ascenderHeight : _p5.env.script_ascenderHeight;
    this.descenderHeight = data ? data.descenderHeight : _p5.env.script_descenderHeight;
    this.defaultGlyphWidth = data ? data.defaultGlyphWidth : _p5.env.script_defaultGlyphWidth;
    this.wordSpace = data ? data.wordSpace : _p5.env.script_defaultWordSpace;
    if (data && data.glyphs) {
      data.glyphs.forEach(glyphData => {
        // Get the index for the glyph in its array (or create new entry if not included yet)
        const index = this.getGlyphIndex(glyphData.name);

        // Construct the paths for the glyph
        const paths = glyphData.paths.map(pathData => {
          const anchors = pathData.anchors.map(anchorData => {
            return new Anchor(anchorData.index, anchorData.position.x, anchorData.position.y, anchorData.handleToPrev.position.x, anchorData.handleToPrev.position.y, anchorData.handleToNext.position.x, anchorData.handleToNext.position.y);
          });
          return new Path(pathData.index, anchors, pathData.connectionToPrev, pathData.connectionToNext);
        });

        // Create the Glyph instance
        const glyph = new Glyph(glyphData.name, paths, glyphData.advancedWidth);

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
    for (let i = 0; i < _p5.env.basicLatin.length; i++) {
      this.addBlankCharacter(_p5.env.basicLatin.charAt(i));
    }
  }
  addBlankCharacter(character) {
    let paths = [];
    let glyphWidth = this.defaultGlyphWidth;
    this.glyphs.push(new Glyph(character, paths, glyphWidth));
    this.sortGlyphs();
    if (_p5.env.activeScript == this) _p5.env.updateInterface_glyphSet_boxes();
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
    _p5.env.updateInterface_glyphSet_boxes();
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

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Import from Hershey Font File Format
}