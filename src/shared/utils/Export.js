/**
 * SECUENCIA — Export Utilities
 * Handles import/export of _p5.env.scripts, settings, SVG, PNG, TXT.
 * Requires _p5 (p5.js instance) passed as factory parameter.
 */

export function createExportUtils(_p5, { Script, setScript }) {

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
  importJSON(_p5.env.scriptFileExtension)
    .then((data) => {
      _p5.env.scripts.push(new _p5.env.Script(data));
      _p5.env.setScript(_p5.env.scripts.length - 1);
    })
    .catch((err) => {
      console.error("Failed to import JSON:", err.message);
    });
}

function importTextBoxSettings() {
  importJSON(_p5.env.textBoxSettingsFileExtension)
    .then((data) => {

      _p5.env.lineHeight = _p5.constrain(data.lineHeight, _p5.env.lineHeightMin, _p5.env.lineHeightMax) || _p5.env.lineHeight_DEFAULT;
      _p5.env.scriptStrokeWeight = _p5.constrain(data.strokeWeight, _p5.env.scriptStrokeWeightMin, _p5.env.scriptStrokeWeightMax) || _p5.env.scriptStrokeWeight_DEFAULT;
      _p5.env.size = _p5.constrain(data.size, _p5.env.sizeMin, _p5.env.sizeMax) || _p5.env.size_DEFAULT;
      _p5.env.wordSpace = _p5.constrain(data.wordSpace, _p5.env.wordSpaceMin, _p5.env.wordSpaceMax) || _p5.env.wordSpace_DEFAULT;
      _p5.env.letterSpace = _p5.constrain(data.letterSpace, _p5.env.letterSpaceMin, _p5.env.letterSpaceMax) || _p5.env.letterSpace_DEFAULT;
      _p5.env.letterWidth = _p5.constrain(data.letterWidth, _p5.env.letterWidthMin, _p5.env.letterWidthMax) || _p5.env.letterWidth_DEFAULT;
      _p5.env.letterHeight = _p5.constrain(data.letterHeight, _p5.env.letterHeightMin, _p5.env.letterHeightMax) || _p5.env.letterHeight_DEFAULT;
      _p5.env.slant = _p5.constrain(data.slant, _p5.env.slantMin, _p5.env.slantMax) || _p5.env.slant_DEFAULT;

      _p5.print("data.slant: " + data.slant + "slant: " + _p5.env.slant);
      _p5.env.randomSize = _p5.constrain(data.randomSize, _p5.env.randomSizeMin, _p5.env.randomSizeMax) || _p5.env.randomSize_DEFAULT;
      _p5.env.randomLetterSpace = _p5.constrain(data.randomLetterSpace, _p5.env.randomLetterSpaceMin, _p5.env.randomLetterSpaceMax) || _p5.env.randomLetterSpace_DEFAULT;
      _p5.env.randomLetterWidth = _p5.constrain(data.randomLetterWidth, _p5.env.randomLetterWidthMin, _p5.env.randomLetterWidthMax) || _p5.env.randomLetterWidth_DEFAULT;
      _p5.env.randomLetterHeight = _p5.constrain(data.randomLetterHeight, _p5.env.randomLetterHeightMin, _p5.env.randomLetterHeightMax) || _p5.env.randomLetterHeight_DEFAULT;
      _p5.env.randomSlant = _p5.constrain(data.randomSlant, _p5.env.randomSlantMin, _p5.env.randomSlantMax) || _p5.env.randomSlant_DEFAULT;
      _p5.env.randomBaselineOffset = _p5.constrain(data.randomBaselineOffset, _p5.env.randomBaselineOffsetMin, _p5.env.randomBaselineOffsetMax) || _p5.env.randomBaselineOffset_DEFAULT;
      _p5.env.precision = _p5.constrain(data.precision, _p5.env.precisionMax, _p5.env.precisionMin) || _p5.env.precision_DEFAULT;
      _p5.env.textBox.seed = data.seed || _p5.random(1000);

      _p5.env.updateInterface_textBoxSettings_state();
      _p5.env.updateInterface_textBoxSettings_label();
    })
    .catch((err) => {
      console.error("Failed to import JSON:", err.message);
    });
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

function exportAs(value) {

  let stamp = _p5.env.timestamp();

  // generate file name and format
  let fileName;
  switch (value) {
    case 'script':
      fileName = document.getElementById('exportScriptFileName').value || _p5.env.activeScript.name;
      break;
    case 'settings':
      _p5.env.textBoxSettingsFileName = document.getElementById('exportTextBoxSettingsFileName').value || _p5.env.textBoxSettingsFileName;
      fileName = _p5.env.textBoxSettingsFileName;
      break;
    case 'textAsSVG':
    case 'textAsPNG':
      _p5.env.graphicFileName = document.getElementById('exportGraphicFileName').value || _p5.env.graphicFileName;
      fileName = _p5.env.graphicFileName;
      break;
  }
  fileName = fileName.replace(/ /g, "_");
  fileName = fileName + '_' + stamp;

  switch (value) {
    case 'script':
      exportScript(fileName, true, true, '_p5.env.scripts');
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
  const data = _p5.env.activeScript.toJSON();

  if (localDownload == true) {
    // _p5.save locally
    exportJSON(data, fileName + _p5.env.scriptFileExtension);
  }

  if (serverUpload == true) {
    // upload to server
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    uploadToServer(blob, fileName + _p5.env.scriptFileExtension, uploadFolder);
  }

  _p5.env.closePrompt('exportScriptPrompt');
}

function exportTextBoxSettings(fileName, localDownload, serverUpload, uploadFolder) {

  const data = {
    lineHeight: _p5.env.lineHeight,
    strokeWeight: _p5.env.scriptStrokeWeight,
    size: _p5.env.size,
    wordSpace: _p5.env.wordSpace,
    letterSpace: _p5.env.letterSpace,
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
    seed: _p5.env.textBox.seed
  };

  if (localDownload == true) {
    // _p5.save locally
    exportJSON(data, fileName + _p5.env.textBoxSettingsFileExtension);
  }

  if (serverUpload == true) {
    // upload to server
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    uploadToServer(blob, fileName + _p5.env.textBoxSettingsFileExtension, uploadFolder);
  }

  _p5.env.closePrompt('exportTextBoxSettingsPrompt');
}

function exportText_SVG(fileName, localDownload, serverUpload, uploadFolder) {

  _p5.env.exportActive = true;
  _p5.env.exportSVGActive = true;
  // Create a temporary graphics buffer with the desired _p5.env.size based on exportSize
  _p5.env.svgCanvas = _p5.createGraphics(_p5.env.textBox.width, _p5.env.textBox.height, _p5.SVG);

  // _p5.translate the temporary canvas to fit the _p5.env.textBox position
  _p5.env.svgCanvas.translate(-_p5.env.textBox.position.x, -_p5.env.textBox.position.y);

  // _p5.env.display and _p5.save
  _p5.env.display();

  if (localDownload == true) {
    // _p5.save locally
    _p5.save(_p5.env.svgCanvas, fileName + '.svg');
  }

  if (serverUpload == true) {
    // convert _p5.SVG canvas to blob and upload to server
    // access the _p5.SVG element
    const svgElement = _p5.env.svgCanvas._renderer.svg;
    // serialize the _p5.SVG element
    const svgString = new XMLSerializer().serializeToString(svgElement);
    // cCreate the Blob from the serialized _p5.SVG string
    const svgBlob = new Blob([svgString], { type: "_p5.image/svg+xml" });
    // upload to server
    uploadToServer(svgBlob, fileName + '.svg', uploadFolder);
  }

  _p5.env.exportActive = false;
  _p5.env.exportSVGActive = false;

  _p5.env.closePrompt('exportTextPrompt');
}

function exportText_PNG(fileName, localDownload, serverUpload, uploadFolder) {

  _p5.env.exportActive = true;

  // Create a temporary graphics buffer with the desired _p5.env.size based on exportSize
  let exportGraphic = _p5.createGraphics(_p5.env.textBox.width, _p5.env.textBox.height, _p5.P2D);

  // update current _p5.env.display state
  _p5.env.display();

  // Scale the original canvas content to fit the export _p5.env.size
  exportGraphic.image(_p5.env.secuenciaCanvas, -_p5.env.textBox.position.x, -_p5.env.textBox.position.y, _p5.env.canvasWidth, _p5.env.canvasHeight);

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

  _p5.env.exportActive = false;
  _p5.env.closePrompt('exportTextPrompt');

}

function exportText_TXT(fileName, localDownload, serverUpload, uploadFolder) {
  const data = document.getElementById("textInput").value;

  if (localDownload == true) {
    // _p5.save locally
  
    _p5.saveStrings(_p5.env.textToArray(data), fileName + '.txt')
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
  
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––



  return {
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
    importTextBoxSettings,
  };
}
