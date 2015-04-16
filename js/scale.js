function Scale(pixelsPerCentimeter) {
  this._pixelsPerCentimeter = pixelsPerCentimeter || 6;
  
  this.setRangeElement = function(element) {
    this.view = new ScaleView(element, this);
  };

  this.changeZoomDistanceCoefficients = function(minScaleCoefficient, maxScaleCoefficient) {
    this.maxZoomCoefficient = minScaleCoefficient;
    this.maxDistanceCoefficient = maxScaleCoefficient;
    this.view.render();
  };

  this.changePixelsPerCentimeter = function(value) {
    this._pixelsPerCentimeter = value;
    // declared in configurator
    this.onValueChange(value);
    // this.view.render();
  };
};

function ScaleView(scaleViewEl, model) {
  this.element = scaleViewEl;
  this.model = model;
  this._stepQuantity = 200;

  this.changeValue = function(centimetersPerPixel) {
    this.model.changePixelsPerCentimeter(1 / centimetersPerPixel);
  };

  scaleViewEl.addEventListener('input', function(e) {
    this.changeValue(e.target.value);
    pictureModuleConfigurator.canvas.renderAll();  
  }.bind(this), false);

  this.minValue = function() {
    return this.model.maxZoomCoefficient / this.model._pixelsPerCentimeter;
  };

  this.maxValue = function() {
    return this.model.maxDistanceCoefficient / this.model._pixelsPerCentimeter;
  };

  this.render = function() {
    this.element.min = this.minValue();
    this.element.max = this.maxValue();
    this.element.step = this.step();
    this.element.value = 1 / this.model._pixelsPerCentimeter;
  };

  this.step = function() {
    return (this.maxValue() - this.minValue()) / this._stepQuantity;
  };
};


