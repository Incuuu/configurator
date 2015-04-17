PictureModule = fabric.util.createClass(fabric.Rect, {
  type: 'pictureModule',

  initialize: function(options, pixelsPerCentimeter) {
    options || (options = { });
    this.callSuper('initialize', options);
    this.calculateExtremeScales();
    this.updateSize();
    this.prevScaleX = this.scaleX;
    this.prevScaleY = this.scaleY;
    this.prevAngle = this.angle;
    this.prevLeft = this.left;
    this.prevTop = this.top;
    this.lockScalingFlip = true;
  },
  
  recalculateScales: function() {
    this.calculateExtremeScales();
    this.updateSize();
  },

  isAllowingToScale: function() {
    return true;
  },

  isAllowingToMove: function() {
    return true;
  },

  isAllowingToRotate: function() {
    return true;
  },

  calculateExtremeScales: function() {
   
    this.minScaleX = 20 * this.scaleX / this.widthInCentimeters();
    this.minScaleY = 20 * this.scaleY / this.heightInCentimeters();
    
    this.maxScaleX = this.getMaxDimensionInCentimeters('width') / 
      this.widthInCentimeters() * this.scaleX;
    
    this.maxScaleY = this.getMaxDimensionInCentimeters('height') /
      this.heightInCentimeters() * this.scaleY;

  },

  updateSize: function() {
    
    this.set('label', Math.round(this.widthInCentimeters() * 10) / 10
     + 'см x ' + Math.round(this.heightInCentimeters() * 10) / 10 +'см');
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);
    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#333';
    ctx.fillText(this.label, -this.width / 2, -this.height / 2 + 20);
    ctx.shadowOffsetX = 1;
  },

  getMaxDimensionInCentimeters: function(dimension) {
    var maxDimension; 
    if (this.width * this.scaleX > this.height * this.scaleY) {
      maxDimension = dimension === 'width' ? 150 : 100;
    } else {
      maxDimension = dimension === 'width' ? 100 : 150;
    }
    return maxDimension;
  },

  getRelativeMinScale: function() {
    return Math.max(this.minScaleX / this.scaleX, this.minScaleY / this.scaleY)
  },

  getRelativeMaxScale: function() {
    return Math.min(this.maxScaleX / this.scaleX, this.maxScaleY / this.scaleY)
  },

  widthInCentimeters: function() {
    return this.width * this.scaleX / pictureModuleConfigurator.getPixelsPerCentimeter();
  }, 

  heightInCentimeters: function() {
    return this.height * this.scaleY / pictureModuleConfigurator.getPixelsPerCentimeter();
  },

  moved: function() {
    if (this.isAllowingToMove()) {
      this.prevLeft = this.left;
      this.prevTop = this.top;
    } else {
      this.left = this.prevLeft;
      this.top = this.prevTop;
    }
  },

  rotated: function() {
    if (this.isAllowingToRotate()) {
      this.prevAngle = this.angle;
    } else {
      this.angle = this.prevAngle;
    }
  },

  scaled: function() {
    function switchMaxScaleDimensions() {
      var formerMaxScaleX = this.maxScaleX, 
          formerMaxScaleY = this.maxScaleY;
   
      this.maxScaleX = formerMaxScaleY;
      this.maxScaleY = formerMaxScaleX;    
    };

    // switching max dimension of picture module: 100x150 or 150x100
    if ((this.scaleX > this.scaleY && this.maxScaleX < this.maxScaleY) ||
      (this.scaleY > this.scaleX && this.maxScaleY < this.maxScaleX)) {
      switchMaxScaleDimensions.apply(this);
    };

    var validSize = this.minScaleY < this.scaleY &&
      this.maxScaleY > this.scaleY && this.minScaleX < this.scaleX && 
      this.maxScaleX > this.scaleX;

    var scaleIsPositive = this.scaleX > 0 && this.scaleY > 0;
    debugger;
    if (validSize && this.isAllowingToScale() && scaleIsPositive) {
      this.prevLeft = this.left;
      this.prevTop = this.top;
      this.prevScaleX = this.scaleX;
      this.prevScaleY = this.scaleY;
      this.updateSize();
      this.onPictureModuleScale && this.onPictureModuleScale();
    } else {
      this.scaleX = this.prevScaleX;
      this.scaleY = this.prevScaleY;
      this.left = this.prevLeft;
      this.top = this.prevTop;
    }
  }
});
