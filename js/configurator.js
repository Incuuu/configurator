function Configurator(options) {
  this.canvas = new fabric.Canvas(options.canvas);
	
  // resize canvas, and set background image

  fabric.Image.fromURL(options.backgroundImageUrl, function(oImg) {
    this.canvas.setDimensions({
      width: oImg.width + 5 + 15, 
      height: oImg.height + 5 + 15
    });

    this.canvas.setBackgroundImage(oImg, 
      this.canvas.renderAll.bind(this.canvas),
      {
        left: 15,
        top: 15,
        opacity: 1
      });
  }.bind(this));

  this.getPixelsPerCentimeter = function() {
    return this.scale._pixelsPerCentimeter;
  };

  this.addPictureModule = function(options) {
    var pictureModule = this.workSpace.createPictureModule(options, this.getPixelsPerCentimeter());   
    this.canvas.add(pictureModule);
  };
  
  this.scale = new Scale(options.pixelsPerCentimeter);
  this.scale.setRangeElement(options.scaleViewEl);
  this.scale.onValueChange = function(pixelsPerCentimeter) {
    this.workSpace.canvasScaleChanged();
  }.bind(this);
  
  this.workSpace = new WorkSpace();
  this.workSpace.onExtremeScalesChanged = function(minScaleCoefficient, maxScaleCoefficient) {
    this.scale.changeZoomDistanceCoefficients(minScaleCoefficient, maxScaleCoefficient);
  }.bind(this);
  
  this.canvas.on('object:scaling', function(options) {
    options.target.dimensionsChanged();    
  });
 
};

