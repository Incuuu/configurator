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
  };
};
