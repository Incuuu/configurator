define(['fabric', 'rulersView'], function (fabric, RulersView) {

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

    this.recalculateDimensions = function(pixelsPerCentimeter) {

      var maxRulersValueInCentimeters = 600 / pixelsPerCentimeter,
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

  return Rulers
});
