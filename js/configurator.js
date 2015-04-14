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


function Scale(pixelsPerCentimeter) {
  this._pixelsPerCentimeter = pixelsPerCentimeter || 6;
  
  this.setRangeElement = function(element) {
    this.view = new ScaleView(element, this);
  }

  this.changePixelsPerCentimeter = function(value) {
    this._pixelsPerCentimeter = value;
    this.onValueChange(value);
    this.view.render();
  };
};

function ScaleView(scaleViewEl, model) {
  var _this = this;
  this.element = scaleViewEl;
  this.model = model;
  this._stepQuantity = 200;

  this.changeValue = function(centimetersPerPixel) {
    this.model.changePixelsPerCentimeter(1 / centimetersPerPixel);
  };

  scaleViewEl.addEventListener('change', function() {
    _this.changeValue(this.value);  
  }, false);

  this.minValue = function() {
    return this.model.maxZoomCoefficient / this.model._pixelsPerCentimeter;
  }

  this.maxValue = function() {
    return this.model.maxDistanceCoefficient / this.model._pixelsPerCentimeter;
  }

  this.render = function() {
    // // debugger;
    this.element.min = this.minValue();
    this.element.max = this.maxValue();
    this.element.step = this.step();
    this.element.value = 1 / this.model._pixelsPerCentimeter;
  };

  this.step = function() {
    return (this.maxValue() - this.minValue()) / this._stepQuantity;
  }
};


function WorkSpace() {
  this.pictureModules = [];
  
  // this.pictureModuleConstructor = function(){
  //   return 
  // }

  this.createPictureModule = function(Ooptions, PpixelsPerCentimeter) {
    c = fabric.util.createClass(fabric.Rect, {
      type: 'pictureModule',

      initialize: function(options, pixelsPerCentimeter) {
        options || (options = { });
        this.callSuper('initialize', options);
        this.calculateExtremeScales();
        
        var widthInCentimeters = Math.round(this.width / pictureModuleConfigurator.getPixelsPerCentimeter()),
            heightInCentimeters = Math.round(this.height / pictureModuleConfigurator.getPixelsPerCentimeter());

        this.set('label', widthInCentimeters + 'см x ' + heightInCentimeters +'см')

      },

      calculateExtremeScales: function() {
        // devide this method, onResize - define maxScales.

        var widthInCentimeters = this.width / pictureModuleConfigurator.getPixelsPerCentimeter(),
            heightInCentimeters = this.height / pictureModuleConfigurator.getPixelsPerCentimeter(); 

        this.minScaleX = 20 / widthInCentimeters;
        this.minScaleY = 20 / heightInCentimeters;
        
        this.maxScaleX = this.getMaxDimensionInCentimeters('width') / 
          widthInCentimeters;
        
        this.maxScaleY = this.getMaxDimensionInCentimeters('height') /
          heightInCentimeters;
        
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

      calculateCurrentDimensions: function() {
        this.currentWidth = Math.round(this.scaleX * this.width);
        this.currentHeight = Math.round(this.scaleY * this.height);
      },

      getRelativeMinScale: function() {
        return Math.max(this.minScaleX / this.scaleX, this.minScaleY / this.scaleY)
      },

      getRelativeMaxScale: function() {
        return Math.min(this.maxScaleX / this.scaleX, this.maxScaleY / this.scaleY)
      },

      getCurrentWidthInCentimeters: function() {
        return Math.round(this.width * this.scaleX / pictureModuleConfigurator.getPixelsPerCentimeter());
      },

      getCurrentHeightInCentimeters: function() {
        return Math.round(this.height * this.scaleY / pictureModuleConfigurator.getPixelsPerCentimeter());
      },

      dimensionsChanged: function() {
        // debugger;
        function overrideOverstepedScales() {
          if (this.minScaleY > this.scaleY) {
            this.scaleY = this.minScaleY;
          };
          if (this.maxScaleY < this.scaleY) {
            this.scaleY = this.maxScaleY;
          };
          if (this.minScaleX > this.scaleX) {
            this.scaleX = this.minScaleX;
          };
          if (this.maxScaleX < this.scaleX) {
            this.scaleX = this.maxScaleX;
          };
        };
        function switchMaxScaleDimensions() {
          var formerMaxScaleX = this.maxScaleX, 
              formerMaxScaleY = this.maxScaleY;
       
          this.maxScaleX = formerMaxScaleY;
          this.maxScaleY = formerMaxScaleX;    
        };

        if ((this.scaleX > this.scaleY && this.maxScaleX < this.maxScaleY) ||
          (this.scaleY > this.scaleX && this.maxScaleY < this.maxScaleX)) {
          switchMaxScaleDimensions.apply(this);
        };

        overrideOverstepedScales.apply(this);

        this.set('label', this.getCurrentWidthInCentimeters() + 'см x ' + this.getCurrentHeightInCentimeters() +'см')

        this.onPictureModuleScale && this.onPictureModuleScale();
      }
    });

    var pictureModule = new c(Ooptions, PpixelsPerCentimeter);
    
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





