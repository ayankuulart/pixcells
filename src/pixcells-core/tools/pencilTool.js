// @TODO make builds, or organize imports/exports
/**
 * @param {MouseEvent} event
 * @param {PixcellsCore} core
 */
function pencilTool(event, core) {
  const prevX = core.prevMouseX;
  const prevY = core.prevMouseY;
  const x = Math.floor(event.offsetX / core.aspectRatio);
  const y = Math.floor(event.offsetY / core.aspectRatio);
  const dX = Math.abs(prevX - x);
  const dY = Math.abs(prevY - y);

  if ((dX > 1 || dY > 1) && prevX !== -1 && prevY !== -1) {
    const lessX = x > prevX ? prevX : x;
    const lessY = y > prevY ? prevY : y;

    for (let i = 0, k = 0; i < dX - 1 || k < dY - 1; ) {
      if (i < dX - 1) {
        if (dY > dX) {
          i += dX / dY;
        } else {
          i++;
        }
      }

      if (k < dY - 1) {
        if (dX > dY) {
          k += dY / dX;
        } else {
          k++;
        }
      }

      if (x > prevX && y > prevY) {
        core.setPixel(
          prevX + Math.floor(i),
          prevY + Math.floor(k),
          core.activeColor,
          core.activeLayerIndex
        );
        continue;
      }

      if (x < prevX && y < prevY) {
        core.setPixel(
          prevX - Math.floor(i),
          prevY - Math.floor(k),
          core.activeColor,
          core.activeLayerIndex
        );
        continue;
      }

      if (x > prevX && y < prevY) {
        core.setPixel(
          prevX + Math.floor(i),
          prevY - Math.floor(k),
          core.activeColor,
          core.activeLayerIndex
        );
        continue;
      }

      if (x < prevX && y > prevY) {
        core.setPixel(
          prevX - Math.floor(i),
          prevY + Math.floor(k),
          core.activeColor,
          core.activeLayerIndex
        );
        continue;
      }

      core.setPixel(
        lessX + i,
        lessY + k,
        core.activeColor,
        core.activeLayerIndex
      );
    }
  }

  core.setPixel(x, y, core.activeColor, core.activeLayerIndex);

  core.prevMouseX = x;
  core.prevMouseY = y;

  core.drawLayer();
}
