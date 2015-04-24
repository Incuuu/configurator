function Configurator(options) {
  this.canvas = new fabric.Canvas(options.canvas);
  this.canvas.globalCompositeOperation = 'xor';
  this.canvas.selection = false;
	
  // resize canvas, and set background image

  fabric.Image.fromURL(options.backgroundImageUrl, function(oImg) {
    this.canvas.setDimensions({
      width: oImg.width + 5 + 15, 
      height: oImg.height + 5 + 15
    });
  }.bind(this))
  //   this.canvas.setBackgroundImage(oImg, 
  //     this.canvas.renderAll.bind(this.canvas),
  //     {
  //       left: 15,
  //       top: 15,
  //       opacity: 1
  //     });
  // }.bind(this));

  this.getPixelsPerCentimeter = function() {
    return this.scale._pixelsPerCentimeter;
  };

  this.addPictureModule = function(parameters) {
    var pictureModule = this.workSpace.createPictureModule(parameters, this.getPixelsPerCentimeter());   
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
  this.workSpace.hint = options.hintEl;
  this.canvas.add(this.workSpace)
  
  this.canvas.on('object:scaling', function(options) {
    options.target.scaled();
  });

  this.canvas.on('object:moving', function(options) {
    options.target.moved();
  });

  this.canvas.on('object:rotating', function(options) {
    options.target.rotated();
  });

  this.canvas.on('mouse:over', function(options) {
    this.canvas.on('mouse:move', function(e) {
      options.target.mouseMovingOvered(e, options.target);  
    });
  }.bind(this));

  this.canvas.on('mouse:out', function(options) {
    this.canvas.off('mouse:move');
    options.target.mouseOuted();
  }.bind(this));
};

