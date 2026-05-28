export function createHelpers(_p5) {
  const Math = window.Math;
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
  return rgbToHex(r, g, b);
}

  function rgbToHex(r, g, b) {
  // Convert each color component to a two-digit hex value
  let toHex = component => {
    let hex = component.toString(16); // Convert to hex
    hex = hex.toUpperCase();
    return hex.length == 1 ? "0" + hex : hex; // Ensure two digits
  };

  // Concatenate the hex values for the final hex color code
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

  function hexToColor(hex) {
  let c = hexToRgb(hex);
  return _p5.color(c.r, c.g, c.b);
}

  function hexToRgb(hex) {
  // Remove the lineHeight # if present
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  let bigint = parseInt(hex, 16);
  let r = bigint >> 16 & 255;
  let g = bigint >> 8 & 255;
  let b = bigint & 255;
  return {
    r: r,
    g: g,
    b: b
  };
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
  return text.split(/\r?\n/);
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

  return {
    colorToHex,
    rgbToHex,
    hexToColor,
    hexToRgb,
    arrayToText,
    textToArray,
    timestamp,
  };
}
