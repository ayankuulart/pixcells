function createTempCanvasWithImageData(w, h, layer) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempContext = tempCanvas.getContext("2d");
  tempContext.putImageData(layer, 0, 0);

  return tempCanvas;
}
