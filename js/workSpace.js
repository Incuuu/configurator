function WorkSpace() {
  this.pictureModules = [];

  this.createPictureModule = function(options, pixelsPerCentimeter) {
    var pictureModule = new PictureModule(options, pixelsPerCentimeter);
    
    this.pictureModules.push(pictureModule);
    this.objectDimensionsChanged();
    
    pictureModule.onPictureModuleScale = function() { 
      this.objectDimensionsChanged();
    }.bind(this);

    return pictureModule;
  };

  this.objectDimensionsChanged = function() {
    var minScale = 0, 
        maxScale = Infinity;
    
    for (var i = 0; i < this.pictureModules.length; i++) {
      minScale = Math.max(minScale, this.pictureModules[i].getRelativeMinScale());
      maxScale = Math.min(maxScale, this.pictureModules[i].getRelativeMaxScale());
    }
    
    this.onExtremeScalesChanged && 
      this.onExtremeScalesChanged(minScale, maxScale);
  };

  this.calculatePictureModulesExtremeScales = function(pixelsPerCentimeter) {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].calculateExtremeScales(pixelsPerCentimeter);
    };    
  };
};





