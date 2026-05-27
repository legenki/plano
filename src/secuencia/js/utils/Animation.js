/**
 * SECUENCIA — Animation Utilities
 * Contains AnimatedVariable class and animation loop helpers.
 * Requires _p5 (p5.js instance) passed as parameter.
 */

export function createAnimationUtils(_p5) {

// AnimatedVariable must be defined first (classes are not hoisted)
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

function anyActiveAnimation() {
  return _p5.env.animations.length > 0
}

function updateAnimation() {
  for (let [index, animation] of [...animations].entries()) {
    animation.update();
    if (animation.complete == true) {
      // remove animation object if animation is complete
      _p5.env.animations.splice(index, 1); 
    }
  }
}

function setupAnimation_textBoxSettings(mode) {

  let maxFactor = 0.5;
  let random_wordSpace = _p5.env.wordSpace;
  let random_letterSpace = _p5.env.letterSpace;
  let random_letterWidth = _p5.env.letterWidth;
  let random_letterHeight = _p5.env.letterHeight;
  let random_slant = _p5.env.slant;
  let random_randomSize = _p5.env.randomSize;
  let random_randomLetterSpace = _p5.env.randomLetterSpace;
  let random_randomLetterWidth = _p5.env.randomLetterWidth;
  let random_randomLetterHeight = _p5.env.randomLetterHeight;
  let random_randomSlant = _p5.env.randomSlant;
  let random_randomBaselineOffset = _p5.env.randomBaselineOffset;
  let random_precision = _p5.env.precision;

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
    random_wordSpace = _p5.env.wordSpace;
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
    random_letterSpace = _p5.env.letterSpace;
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
    random_letterWidth = _p5.env.letterWidth;
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
    random_letterHeight = _p5.env.letterHeight;
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
    random_slant = _p5.env.slant;
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
    random_randomSize = _p5.env.randomSize;
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
    random_randomLetterSpace = _p5.env.randomLetterSpace;
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
    random_randomLetterWidth = _p5.env.randomLetterWidth;
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
    random_randomLetterHeight = _p5.env.randomLetterHeight;
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
    random_randomSlant = _p5.env.randomSlant;
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
    random_randomBaselineOffset = _p5.env.precision;
  }
  
  let randomValRandomPrec = _p5.random(1.0);
  if (randomValRandomPrec > 0.9) {
    random_precision  = _p5.random(precisionMax, precisionMin * (maxFactor/2));
  } else if (randomValRandomPrec > 0.2) {
    random_precision  = 0.0;
  } else {
    random_precision = _p5.env.randomBaselineOffset;
  }

  // no more changes here

  textBoxSettings_animation = {
    wordSpace: new AnimatedVariable(_p5.env.wordSpace, mode == "_p5.random" ? random_wordSpace : _p5.env.wordSpace_DEFAULT),
    letterSpace: new AnimatedVariable(_p5.env.letterSpace, mode == "_p5.random" ? random_letterSpace : _p5.env.letterSpace_DEFAULT),
    letterWidth: new AnimatedVariable(_p5.env.letterWidth, mode == "_p5.random" ? random_letterWidth : _p5.env.letterWidth_DEFAULT),
    letterHeight: new AnimatedVariable(_p5.env.letterHeight, mode == "_p5.random" ? random_letterHeight : _p5.env.letterHeight_DEFAULT),
    slant: new AnimatedVariable(_p5.env.slant, mode == "_p5.random" ? random_slant : _p5.env.slant_DEFAULT),
    randomSize: new AnimatedVariable(_p5.env.randomSize, mode == "_p5.random" ? random_randomSize : _p5.env.randomSize_DEFAULT),
    randomLetterSpace: new AnimatedVariable(_p5.env.randomLetterSpace, mode == "_p5.random" ? random_randomLetterSpace : _p5.env.randomLetterSpace_DEFAULT),
    randomLetterWidth: new AnimatedVariable(_p5.env.randomLetterWidth, mode == "_p5.random" ? random_randomLetterWidth : _p5.env.randomLetterWidth_DEFAULT),
    randomLetterHeight: new AnimatedVariable(_p5.env.randomLetterHeight, mode == "_p5.random" ? random_randomLetterHeight : _p5.env.randomLetterHeight_DEFAULT),
    randomSlant: new AnimatedVariable(_p5.env.randomSlant, mode == "_p5.random" ? random_randomSlant : _p5.env.randomSlant_DEFAULT),
    randomBaselineOffset: new AnimatedVariable(_p5.env.randomBaselineOffset, mode == "_p5.random" ? random_randomBaselineOffset : _p5.env.randomBaselineOffset_DEFAULT),
    precision: new AnimatedVariable(_p5.env.precision, mode == "_p5.random" ? random_precision : _p5.env.precision_DEFAULT),
    complete: false,

    update: function() {
      _p5.env.wordSpace = this.wordSpace.update();
      _p5.env.letterSpace = this.letterSpace.update();
      _p5.env.letterWidth = this.letterWidth.update();
      _p5.env.letterHeight = this.letterHeight.update();
      _p5.env.slant = this.slant.update();
      _p5.env.randomSize = this.randomSize.update();
      _p5.env.randomLetterSpace = this.randomLetterSpace.update();
      _p5.env.randomLetterWidth = this.randomLetterWidth.update();
      _p5.env.randomLetterHeight = this.randomLetterHeight.update();
      _p5.env.randomSlant = this.randomSlant.update();
      _p5.env.randomBaselineOffset = this.randomBaselineOffset.update();
      _p5.env.precision = this.precision.update();
      _p5.env.updateInterface_textBoxSettings_state();
      _p5.env.updateInterface_textBoxSettings_label();
      if (this.wordSpace.complete == true && this.letterSpace.complete == true && this.letterWidth.complete == true && this.letterHeight.complete == true &&
        this.slant.complete == true && this.randomSize.complete == true && this.randomLetterSpace.complete == true && this.randomLetterWidth.complete == true &&
        this.randomLetterHeight.complete == true && this.randomSlant.complete == true && this.randomBaselineOffset.complete == true && this.precision.complete == true) {
        this.complete = true;
      }
    }
  };

  _p5.env.animations.push(textBoxSettings_animation);
}

  return {
    AnimatedVariable,
    anyActiveAnimation,
    updateAnimation,
    setupAnimation_textBoxSettings,
  };
}
