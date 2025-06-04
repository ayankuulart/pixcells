/**
 *
 * @param {*} hex
 * @param {*} alpha
 * @return {Color}
 */

function hexToRGBA(hex, alpha) {
  const tempHex = hex.replace("#", "");
  const r = parseInt(tempHex.substring(0, 2), 16);
  const g = parseInt(tempHex.substring(2, 4), 16);
  const b = parseInt(tempHex.substring(4, 6), 16);

  return { r, g, b, alpha: alpha ? alpha : 255 };
}
