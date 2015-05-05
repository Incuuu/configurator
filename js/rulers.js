function Rulers() {
  this.view = new RulersView(this);
  this.centimetersPerIntervalArray = [4, 5, 10, 20, 25, 50, 100, 150];
  this.centimetersPerIntervalValue = 10;
  this.pixelsPerIntervalValue = 60;

  this.ABSTRACT_INTERVAL_QUANTITY = 11;
  this.ADDITIONAL_DRAWING_DISTANCE = 80;

  this.getCanvasObjects = function() {
    return this.prevCanvasObjects = new fabric.Group([this.view.render('x'),
      this.view.render('y')], {evented: false});
  }.bind(this);

  this.recalculateDimensions = function() {

    var pixelsPerCentimeter = pictureModuleConfigurator.getPixelsPerCentimeter(),
        maxRulersValueInCentimeters = 600 / pixelsPerCentimeter,
        len = this.centimetersPerIntervalArray.length;
    
    for (var i = 0; i < len; i++) { 
      
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

function RulersView(model) {
  this.model = model;
  this.render = function(side) {  
    return this.drawRuler(600, side);
  };

  this.drawRuler = function(size, side) {
    var container = new fabric.Group([], {
      height: 15,
      left: 49,
      top: -2,
      width: 15,
      evented: false,
      selectable: false
    });

    if (side === 'y') {
      container.set({
        height: 15,
        left: -4,
        top: 50
      });
    };

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
       
      if (side === 'y') {
        longSection.set({
          left: 1,
          top: longSectionsDistance,
          height: 1,
          width: 15,
        });

        number.set({
          left: -3,
          top: longSectionsDistance + 5
        });
      };

      longSectionsDistance+= this.model.pixelsPerIntervalValue;
      shortSectionsDistance = longSectionsDistance - this.model.pixelsPerIntervalValue / 2;
      intervalNumericValue+= this.model.centimetersPerIntervalValue;

      shortSection = new fabric.Rect({
        left: shortSectionsDistance,
        top: 10,
        fill: 'black',
        height: 5,
        width: 1
      });

      if (side === 'y') {
        shortSection.set({
          left: 11,
          top: shortSectionsDistance,
          width: 5,
          height: 1
        });        
      };

      container.add(longSection, number, shortSection);

      totalSize = longSectionsDistance + this.model.pixelsPerIntervalValue / 2;
      if (totalSize > size + this.model.ADDITIONAL_DRAWING_DISTANCE) break;
    };

    var mainRulersLine = new fabric.Rect({
      left: -56,
      top: 15,
      height: 2,
      width: totalSize,
      fill: 'blue'
    });

    if (side === 'y') {
      mainRulersLine.set({
        left: 16,
        top: -56,
        height: totalSize,
        width: 2
      });
    };
    return container.add(mainRulersLine)
  };
};