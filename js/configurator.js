function Configurator(options) {
	var _this = this;

  this.canvas = new fabric.Canvas(options.canvas);
	
  // resize canvas, and set background image

  fabric.Image.fromURL(options.backgroundImageUrl, function(oImg) {
    _this.canvas.setDimensions({
      width: oImg.width + 5 + 15, 
      height: oImg.height + 5 + 15
    });

    _this.canvas.setBackgroundImage(oImg, 
      _this.canvas.renderAll.bind(_this.canvas),
      {
        left: 15,
        top: 15,
        opacity: 1
      });
  });
  
  this.scale = new Scale(options.pixelsPerCentimeter);
  this.scale.setRangeElement(options.scaleViewEl);
  this.scale.onValueChange = function(pixelsPerCentimeter) {
    this.workSpace.calculatePictureModulesExtremeScales(pixelsPerCentimeter);
  }.bind(this) 
  
  this.workSpace = new WorkSpace();
  this.workSpace.onExtremeScalesChanged = function(minScaleCoefficient, maxScaleCoefficient) {
    // debugger;
    _this.scale.maxZoomCoefficient = minScaleCoefficient;
    _this.scale.maxDistanceCoefficient = maxScaleCoefficient;
    _this.scale.view.render();
  }

  this.getPixelsPerCentimeter = function() {
    return this.scale._pixelsPerCentimeter;
  } 
  this.addPictureModule = function(options) {
    var pictureModule = this.workSpace.createPictureModule(options, this.getPixelsPerCentimeter()) 
    
    this.canvas.add(pictureModule)
  }

  this.canvas.on('object:scaling', function(options) {
    options.target.dimensionsChanged();
  })
}

