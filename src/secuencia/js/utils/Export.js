/**
 * SECUENCIA — Export Utilities
 * Handles import/export of scripts, settings, SVG, PNG, TXT.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

export function createExportUtils(_p5) {

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

  return {
    importJSON,
    exportJSON,
    exportScript,
    exportTextBoxSettings,
    exportAs,
    exportText_SVG,
    exportText_PNG,
    exportText_TXT,
    uploadToServer,
    importTextBoxSettings,
  };
}
