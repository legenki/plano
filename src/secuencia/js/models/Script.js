/**
 * SECUENCIA — Script Model
 * Requires _p5 (p5.js instance) + Glyph classes passed as factory parameters.
 */

export function createScriptClass(_p5, { Glyph, Path, Anchor, Handle }) {

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

  return Script;
}
