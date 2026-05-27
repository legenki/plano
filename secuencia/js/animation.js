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

  // random algorithmus below

  //if (random(1) > 0.5) {
  //  random_wordSpace = random(0, wordSpaceMax * maxFactor);
  //}
  let randomValWordSpace = random(1.0);
  if (randomValWordSpace > 0.6) {
    random_wordSpace = random(0, wordSpaceMax * (maxFactor/2));
  } else if (randomValWordSpace > 0.3) {
    random_wordSpace  = 0.0;
  } else {
    random_wordSpace = wordSpace;
  }   
  
  //if (random(1) > 0.5) {
  //  random_letterSpace = random(0, letterSpaceMax * maxFactor);
  //}
  let randomValSpace = random(1.0);
  if (randomValSpace > 0.6) {
    random_letterSpace = random(0, letterSpaceMax * maxFactor);
  } else if (randomValSpace > 0.3) {
    random_letterSpace  = 0.0;
  } else {
    random_letterSpace = letterSpace;
  }  
  
  //if (random(1) > 0.5) {
  //  random_letterWidth = random(1, letterWidthMax * maxFactor);
  //}
    let randomValWidth = random(1.0);
  if (randomValWidth > 0.6) {
    random_letterWidth = random(1, letterWidthMax * maxFactor);
  } else if (randomValWidth > 0.3) {
    random_letterWidth  = 1.0;
  } else {
    random_letterWidth = letterWidth;
  }   
  
  //if (random(1) > 0.5) {
  //  random_letterHeight = random(1, letterHeightMax * maxFactor);
  //}
    let randomValHeight = random(1.0);
  if (randomValHeight > 0.6) {
    random_letterHeight = random(1, letterHeightMax * maxFactor);
  } else if (randomValHeight > 0.3) {
    random_letterHeight  = 1.0;
  } else {
    random_letterHeight = letterHeight;
  }   
  
  //if (random(1) > 0.5) {
  //  random_slant = random(slantMin, slantMax * maxFactor);
  //}
   let randomValSlant = random(1.0);
  if (randomValSlant > 0.6) {
    random_slant = random(slantMin, slantMax * maxFactor);
  } else if (randomValSlant > 0.3) {
    random_slant  = 0.0;
  } else {
    random_slant = slant;
  }  

  //if (random(1) > 0.5) {
  //  random_randomSize = random(randomSizeMin, randomSizeMax * maxFactor);
  //}
 let randomValRandomSize = random(1.0);
  if (randomValRandomSize > 0.6) {
    random_randomSize = random(randomSizeMin, randomSizeMax *  (maxFactor*2));
  } else if (randomValRandomSize > 0.3) {
    random_randomSize  = 0.0;
  } else {
    random_randomSize = randomSize;
  }   
  
 //  if (random(1) > 0.5) {
 //   random_randomLetterSpace = random(randomLetterSpaceMin, randomLetterSpaceMax * maxFactor);
 // }
 let randomValRandomSpace = random(1.0);
  if (randomValRandomSpace > 0.6) {
    random_randomLetterSpace = random(randomLetterSpaceMin, randomLetterSpaceMax * (maxFactor/2));
  } else if (randomValRandomSpace > 0.3) {
    random_randomLetterSpace  = 0.0;
  } else {
    random_randomLetterSpace = randomLetterSpace;
  }

//  if (random(1) > 0.5) {
//    random_randomLetterWidth = random(randomLetterWidthMin, randomLetterWidthMax * maxFactor);
//  } 
  let randomValRandomWidth = random(1.0);
  if (randomValRandomWidth > 0.6) {
    random_randomLetterWidth = random(randomLetterWidthMin, randomLetterWidthMax * maxFactor);
  } else if (randomValRandomWidth > 0.3) {
    random_randomLetterWidth  = 0.0;
  } else {
    random_randomLetterWidth = randomLetterWidth;
  }
  
 //  if (random(1) > 0.5) {
 //   random_randomLetterHeight = random(randomLetterHeightMin, randomLetterHeightMax * maxFactor);
 //}
     let randomValRandomHeight = random(1.0);
  if (randomValRandomHeight > 0.6) {
    random_randomLetterHeight = random(randomLetterHeightMin, randomLetterHeightMax * maxFactor);
  } else if (randomValRandomHeight > 0.3) {
    random_randomLetterHeight  = 0.0;
  } else {
    random_randomLetterHeight = randomLetterHeight;
  }  
  
 // if (random(1) > 0.5) {
 //   random_randomSlant = random(randomSlantMin, randomSlantMax * maxFactor);
 // }
   let randomValRandomSlant = random(1.0);
  if (randomValRandomSlant > 0.6) {
    random_randomSlant = random(randomSlantMin, randomSlantMax * maxFactor);
  } else if (randomValRandomSlant > 0.3) {
    random_randomSlant  = 0.0;
  } else {
    random_randomSlant = randomSlant;
  }
 
 // if (random(1) > 0.5) {
 //   random_randomBaselineOffset = random(randomBaselineOffsetMin, randomBaselineOffsetMax * maxFactor);
 // }
  let randomValRandomBase = random(1.0);
  if (randomValRandomBase > 0.6) {
    random_randomBaselineOffset = random(randomBaselineOffsetMin, randomBaselineOffsetMax * (maxFactor*2));
  } else if (randomValRandomBase > 0.3) {
    random_randomBaselineOffset  = 0.0;
  } else {
    random_randomBaselineOffset = precision;
  }
  
  let randomValRandomPrec = random(1.0);
  if (randomValRandomPrec > 0.9) {
    random_precision  = random(precisionMax, precisionMin * (maxFactor/2));
  } else if (randomValRandomPrec > 0.2) {
    random_precision  = 0.0;
  } else {
    random_precision = randomBaselineOffset;
  }

  // no more changes here

  textBoxSettings_animation = {
    wordSpace: new AnimatedVariable(wordSpace, mode == "random" ? random_wordSpace : wordSpace_DEFAULT),
    letterSpace: new AnimatedVariable(letterSpace, mode == "random" ? random_letterSpace : letterSpace_DEFAULT),
    letterWidth: new AnimatedVariable(letterWidth, mode == "random" ? random_letterWidth : letterWidth_DEFAULT),
    letterHeight: new AnimatedVariable(letterHeight, mode == "random" ? random_letterHeight : letterHeight_DEFAULT),
    slant: new AnimatedVariable(slant, mode == "random" ? random_slant : slant_DEFAULT),
    randomSize: new AnimatedVariable(randomSize, mode == "random" ? random_randomSize : randomSize_DEFAULT),
    randomLetterSpace: new AnimatedVariable(randomLetterSpace, mode == "random" ? random_randomLetterSpace : randomLetterSpace_DEFAULT),
    randomLetterWidth: new AnimatedVariable(randomLetterWidth, mode == "random" ? random_randomLetterWidth : randomLetterWidth_DEFAULT),
    randomLetterHeight: new AnimatedVariable(randomLetterHeight, mode == "random" ? random_randomLetterHeight : randomLetterHeight_DEFAULT),
    randomSlant: new AnimatedVariable(randomSlant, mode == "random" ? random_randomSlant : randomSlant_DEFAULT),
    randomBaselineOffset: new AnimatedVariable(randomBaselineOffset, mode == "random" ? random_randomBaselineOffset : randomBaselineOffset_DEFAULT),
    precision: new AnimatedVariable(precision, mode == "random" ? random_precision : precision_DEFAULT),
    complete: false,

    update: function () {
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
    this.startTime = millis();
    this.duration = d || 600;
    this.elapsed = 0;
    this.progress = 0;
    this.originValue = o;
    this.targetValue = t;
    this.currentValue = this.originValue;
    this.complete = false;
  }

  update() {
    this.elapsed = millis() - this.startTime;
    this.progress = constrain(this.elapsed / this.duration, 0, 1);
    this.currentValue = lerp(this.originValue, this.targetValue, this.progress);
    if (this.progress === 1) {
      this.complete = true;
    }
    return this.currentValue;
  }

}