function Rulers() {
  this.viewX = new RulersViewX(this);
  this.viewY = new RulersViewY(this);
  this.centimetersPerIntervalArray = [4, 5, 10, 20, 25];
  this.abstractIntervalQuantity = 11;

  this.canvasScaleChanged = function() {
    this.recalculateDimensions();
    this.render(); 
  }.bind(this);

  this.render = function() {
    this.viewX.render();
    this.viewY.render();
  }

  this.recalculateDimensions = function() {
    var pixelsPerCentimeter = pictureModuleConfigurator.getPixelsPerCentimeter();
        maxRulersValueInCentimeters = 600 / pixelsPerCentimeter;
        len = this.centimetersPerIntervalArray.length;
      
      for (var i = 0; i < len; i++) { 
        if (maxRulersValueInCentimeters / 
          this.centimetersPerIntervalArray[i] < this.abstractIntervalQuantity) {
          this.centimetersPerIntervalValue = this.centimetersPerIntervalArray[i];
        };
      };
      this.centimetersPerIntervalValue = this.centimetersPerIntervalArray[len - 1];

    this.pixelsPerIntervalValue = this.centimetersPerIntervalValue * pixelsPerCentimeter;
    this.intervalQuantity = Math.round(maxRulersValueInCentimeters / this.centimetersPerIntervalValue);

  }.bind(this);
};

function RulersViewX(model) {
  this.model = model;
  this.render = function() {
    console.log('centimeters = ' + this.model.centimetersPerIntervalValue);
    console.log('pixels = ' + this.model.pixelsPerIntervalValue);
    console.log('interval = ' + this.model.intervalQuantity);
  };
};

function RulersViewY(model) {
  this.render = function() {
    console.log('renderY')
  };
};
