WorkSpace = fabric.util.createClass(fabric.Rect, {
  initialize: function(options) {
    debugger;
    options || (options = { });
    this.width = 600,
    this.height = 600,
    this.left = 20,
    this.top = 20,
    this.hasControls = false,
    this.evented = false,
    this.hasBorders = false,
    this.fill = 'white',
    this.selectable = false,
    this.opacity = 0.85
  },

  pictureModules: [],

  hasCollisions: function() {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].setCoords();
      for (var j = i + 1; j < this.pictureModules.length; j++) {
        this.pictureModules[j].setCoords();
        return (this.pictureModules[i].intersectsWithObject(this.pictureModules[j])
          || this.pictureModules[i].isContainedWithinObject(this.pictureModules[j]) 
          || this.pictureModules[j].isContainedWithinObject(this.pictureModules[i]));
      };
    };
    return false;
  },

  areObjectsInside: function() {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].setCoords();
      if (!this.pictureModules[i].isContainedWithinObject(this)) {
        return false;
      };
    };
    return true;
  },

  createPictureModule: function(options, pixelsPerCentimeter) {
    var pictureModule = new PictureModule(options, pixelsPerCentimeter);
    
    this.pictureModules.push(pictureModule);
    this.objectDimensionsChanged();

    pictureModule.isAllowingToRotate = pictureModule.isAllowingToMove = pictureModule.isAllowingToScale = function() {
      return !this.hasCollisions() && this.areObjectsInside();
    }.bind(this); 

    pictureModule.onPictureModuleScale = function() { 
      this.objectDimensionsChanged();
    }.bind(this);

    return pictureModule;
  },

  objectDimensionsChanged: function() {
    var minScale = 0, 
        maxScale = Infinity;
    
    for (var i = 0; i < this.pictureModules.length; i++) {
      minScale = Math.max(minScale, this.pictureModules[i].getRelativeMinScale());
      maxScale = Math.min(maxScale, this.pictureModules[i].getRelativeMaxScale());
    }
    // declared in configurator
    this.onExtremeScalesChanged && 
      this.onExtremeScalesChanged(minScale, maxScale);
  },

  canvasScaleChanged: function() {
    for (var i = 0; i < this.pictureModules.length; i++) {
      this.pictureModules[i].recalculateScales();
    }    
  }
});





