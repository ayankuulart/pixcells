/**
 * @typedef {Object} Color
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} alpha
 */

/**
 * @typedef {Object} Layer
 * @property {Color} color
 * @property {number} x
 * @property {number} y
 */

const BACKGROUND_LAYER_INDEX = 0;
const DEFAULT_LAYER_INDEX = 1;

const BACKGROUND_COLORS = [
  { r: 210, g: 210, b: 210, alpha: 255 },
  { r: 235, g: 235, b: 235, alpha: 255 },
];

class PixcellsCore {
  /**
   * @type {HTMLCanvasElement}
   */
  canvas = null;

  /**
   * @type {CanvasRenderingContext2D}
   */
  context = null;

  /**
   * @type {number}
   */
  aspectRatio;

  /**
   * @type {number}
   */
  width;

  /**
   * @type {number}
   */
  height;

  /**
   * @type {ImageData[]}
   * The first layer is background
   */
  layers = [];

  /**
   * @type {ImageData}
   * The first layer is background
   */
  leftLayer = null;

  /**
   * @type {ImageData}
   * The first layer is background
   */
  rightLayer = null;

  /**
   * @type {number}
   */
  activeLayerIndex = 1;

  /**
   * @type {number} activeTool
   * -1 Disabled
   *  0 Pencil
   *  1 Eraser
   */
  activeTool = 0;

  /**
   * @type {Color}
   */
  activeColor = { r: 0, g: 0, b: 0, alpha: 255 };

  /**
   * @type {function[]}
   */
  tools = [pencilTool, eraserTool];

  /**
   * @type {number}
   */
  mouseX;

  /**
   * @type {number}
   */
  mouseY;

  /**
   * @type {number}
   * Default value is "-1"
   */
  prevMouseX = -1;

  /**
   * @type {number}
   * Default value is "-1"
   */
  prevMouseY = -1;

  onFinishedLayerDraw;

  /**
   * @param {HTMLCanvasElement} canvas
   * @returns {void}
   */
  constructor(canvas, onFinishedLayerDraw) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.onFinishedLayerDraw = onFinishedLayerDraw;
    this.aspectRatio = canvas.getBoundingClientRect().width / canvas.width;
    this.drawBackground();

    this.layers[DEFAULT_LAYER_INDEX] = this.context.createImageData(
      this.width,
      this.height
    );

    this.addMouseEvents();
  }

  addLayer() {
    const nextLayerIndex = this.layers.length;
    this.layers[nextLayerIndex] = this.context.createImageData(
      this.width,
      this.height
    );
    this.activeLayerIndex = nextLayerIndex;
  }

  /**
   * @param {number} layerIndex
   */
  removeLayer(layerIndex) {
    if (this.layers.length > 2) {
      this.layers.splice(layerIndex, 1);

      if (this.activeLayerIndex === 1) {
        this.activeLayerIndex = 1;
      } else {
        this.activeLayerIndex = this.activeLayerIndex - 1;
      }

      this.changeLayer(this.activeLayerIndex);
      this.drawLayers();
    }
  }

  /**
   * @param {number} layerIndex
   */
  changeLayer(layerIndex) {
    this.activeLayerIndex = layerIndex;

    const leftLayer = document.createElement("canvas");
    const rightLayer = document.createElement("canvas");

    leftLayer.width = this.width;
    leftLayer.width = this.height;
    rightLayer.width = this.width;
    rightLayer.height = this.height;

    const leftLayerContext = leftLayer.getContext("2d");
    const rightLayerContext = rightLayer.getContext("2d");

    this.layers.forEach((layer, index) => {
      if (index === layerIndex) return;

      const tempCanvas = createTempCanvasWithImageData(
        this.width,
        this.height,
        layer
      );

      if (index < layerIndex) {
        leftLayerContext.drawImage(tempCanvas, 0, 0);
      } else {
        rightLayerContext.drawImage(tempCanvas, 0, 0);
      }
    });

    if (layerIndex === this.layers - 1) {
      this.leftLayer = leftLayerContext.getImageData(
        0,
        0,
        this.width,
        this.height
      );
      this.rightLayer = null;
      return;
    }

    if (layerIndex === 0) {
      this.rightLayer = rightLayerContext.getImageData(
        0,
        0,
        this.width,
        this.height
      );

      this.leftLayer = null;

      return;
    }

    this.leftLayer = leftLayerContext.getImageData(
      0,
      0,
      this.width,
      this.height
    );
    this.rightLayer = rightLayerContext.getImageData(
      0,
      0,
      this.width,
      this.height
    );
  }

  drawBackground() {
    const backgroundLayer = this.context.createImageData(
      this.width,
      this.height
    );

    this.layers[BACKGROUND_LAYER_INDEX] = backgroundLayer;

    let toggle = false;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        toggle
          ? this.setPixel(x, y, BACKGROUND_COLORS[0], BACKGROUND_LAYER_INDEX)
          : this.setPixel(x, y, BACKGROUND_COLORS[1], BACKGROUND_LAYER_INDEX);

        toggle = !toggle;
      }
      toggle = !toggle;
    }

    this.drawLayers();
  }

  addMouseEvents() {
    // @TODO Better add listeners after tool selecting, cause tools need different events
    this.canvas.addEventListener("mousemove", (event) => {
      if (event.buttons == 1) {
        this.tools[this.activeTool](event, this);
      }
    });

    // @TODO Better add listeners after tool selecting, cause tools need different events
    this.canvas.addEventListener("mousedown", (event) => {
      if (event.buttons == 1) {
        this.tools[this.activeTool](event, this);
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.prevMouseX = -1;
      this.prevMouseY = -1;
      this.onFinishedLayerDraw ? this.onFinishedLayerDraw() : null;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.prevMouseX = -1;
      this.prevMouseY = -1;
    });
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {Color} color
   * @param {number} layerIndex
   */
  setPixel(x, y, color, layerIndex) {
    const index = (y * this.width + x) * 4;

    this.layers[layerIndex].data[index] = color.r;
    this.layers[layerIndex].data[index + 1] = color.g;
    this.layers[layerIndex].data[index + 2] = color.b;
    this.layers[layerIndex].data[index + 3] = color.alpha;
  }

  drawLayer() {
    [
      this.leftLayer,
      this.layers[this.activeLayerIndex],
      this.rightLayer,
    ].forEach((layer) => {
      if (!layer) return;

      const tempCanvas = createTempCanvasWithImageData(
        this.width,
        this.height,
        layer
      );

      this.context.drawImage(tempCanvas, 0, 0);
    });
  }

  drawLayers() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
    const tempContext = tempCanvas.getContext("2d");

    this.layers.forEach((layer) => {
      tempContext.putImageData(layer, 0, 0);

      this.context.drawImage(tempCanvas, 0, 0);
    });

    this.onFinishedLayerDraw ? this.onFinishedLayerDraw() : null;
  }
}
