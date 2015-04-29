function Rulers() {
  this.viewX = new RulersViewX(this);
  this.viewY = new RulersViewY(this);
  this.centimetersPerIntervalArray = [4, 5, 10, 20, 25, 50];
  this.centimetersPerIntervalValue = 10;
  this.pixelsPerIntervalValue = 60;

  this.ABSTRACT_INTERVAL_QUANTITY = 11;
  this.ADDITIONAL_DRAWING_DISTANCE = 80;

  this.getCanvasObjects = function() {
    return this.prevCanvasObjects = new fabric.Group([this.viewX.render(),
      this.viewY.render()], {evented: false});
  }.bind(this);

  this.recalculateDimensions = function() {

    var pixelsPerCentimeter = pictureModuleConfigurator.getPixelsPerCentimeter(),
        maxRulersValueInCentimeters = 600 / pixelsPerCentimeter,
        len = this.centimetersPerIntervalArray.length;
      
      for (var i = 0; i < len; i++) { 
        if (len - i === 1) {
          this.centimetersPerIntervalValue = this.centimetersPerIntervalArray[len - 1];
        };

        if (maxRulersValueInCentimeters / 
          this.centimetersPerIntervalArray[i] < this.ABSTRACT_INTERVAL_QUANTITY) {
          this.centimetersPerIntervalValue = this.centimetersPerIntervalArray[i];
          break;
        };
      };
    
      this.pixelsPerIntervalValue = this.centimetersPerIntervalValue
       * pixelsPerCentimeter;

    }.bind(this);
};

function RulersViewX(model) {
  this.model = model;
  this.render = function() {

    function drawRulerX(size) {
      var group = new fabric.Group([], {
        height: 15,
        left: 49,
        top: -2,
        width: 15,
        evented: false,
        selectable: false
      });

      var longSectionsDistance = 0,
          shortSectionsDistance = 0,
          numbersDistance = 0,
          intervalNumericValue = 0,
          totalSize = 0,
          longSection, shortSection, number;

      while(true) {
        
        longSection = new fabric.Rect({
          left: longSectionsDistance,
          top: 0,
          height: 15,
          width: 1,
          fill: 'black'
        });

        number = new fabric.Text(intervalNumericValue + '', {
          left: longSectionsDistance + 5,
          top: 0,
          fontSize: 12
        });

        longSectionsDistance+= this.model.pixelsPerIntervalValue;
        shortSectionsDistance = longSectionsDistance - this.model.pixelsPerIntervalValue / 2;
        intervalNumericValue+= this.model.centimetersPerIntervalValue;

        shortSection = new fabric.Rect({
          left: shortSectionsDistance,
          top: 10,
          fill: 'black',
          height: 5,
          width: 1
        })
      group.add(longSection, number, shortSection);

      totalSize = longSectionsDistance + this.model.pixelsPerIntervalValue / 2;
      if (totalSize > size + this.model.ADDITIONAL_DRAWING_DISTANCE) break;

      };
      var mainRulersLineX = new fabric.Rect({
        left: -56,
        top: 15,
        height: 2,
        width: totalSize,
        fill: 'blue'
      })
      return group.add(mainRulersLineX)
    };
    return drawRulerX.call(this, 600);
  };
};

function RulersViewY(model) {
  this.model = model;
  this.render = function() {

    function drawRulerY(size) {
      var group = new fabric.Group([], {
        height: 15,
        left: -4,
        top: 50,
        width: 15,
        evented: false,
        selectable: false
      });

      var longSectionsDistance = 0,
          shortSectionsDistance = 0,
          numbersDistance = 0,
          intervalNumericValue = 0,
          totalSize = 0,
          longSection, shortSection, number;

      while(true) {
        
        longSection = new fabric.Rect({
          left: 1,
          top: longSectionsDistance,
          height: 1,
          width: 15,
          fill: 'black'
        });
        number = new fabric.Text(intervalNumericValue + '', {
          left: -3,
          top: longSectionsDistance + 5,
          fontSize: 12
        });

        longSectionsDistance+= this.model.pixelsPerIntervalValue;
        shortSectionsDistance = longSectionsDistance - this.model.pixelsPerIntervalValue / 2;
        intervalNumericValue+= this.model.centimetersPerIntervalValue;

        shortSection = new fabric.Rect({
          left: 11,
          top: shortSectionsDistance,
          fill: 'black',
          height: 1,
          width: 5
        })
      group.add(longSection, number, shortSection);

      totalSize = longSectionsDistance + this.model.pixelsPerIntervalValue / 2;
      if (totalSize > size + this.model.ADDITIONAL_DRAWING_DISTANCE) break;

      };
      var mainRulersLineY = new fabric.Rect({
        left: 16,
        top: -56,
        height: totalSize,
        width: 2,
        fill: 'blue'
      })
      return group.add(mainRulersLineY)
    };
    return drawRulerY.call(this, 600);
  };
};
