define(['fabric', 'pictureModule'], function (fabric, PictureModule) {

  var WorkSpace = fabric.util.createClass(fabric.Rect, {
    initialize: function(options) {
      options || (options = { });
      this.width = 600,
      this.height = 600,
      this.left = 55,
      this.top = 55,
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
          if (this.pictureModules[i].intersectsWithObject(this.pictureModules[j])
            || this.pictureModules[i].isContainedWithinObject(this.pictureModules[j])
            || this.pictureModules[j].isContainedWithinObject(this.pictureModules[i])) {
            return true;
          };
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

    createPictureModule: function(options, configurator) {
      var pictureModule = new PictureModule(options, configurator);

      this.pictureModules.push(pictureModule);
      this.objectDimensionsChanged();

      pictureModule.isAllowingToRotate = pictureModule.isAllowingToMove = pictureModule.isAllowingToScale = function() {
        // !this.hasCollisions() &&
        return this.areObjectsInside();
      }.bind(this);

      pictureModule.onPictureModuleScale = function() {
        this.objectDimensionsChanged();
      }.bind(this);

      pictureModule.onPictureModuleInnerMouseMoving = function(e, target) {
        this.updateHint(e, target)
      }.bind(this);

      pictureModule.onPictureModuleMouseLeft = function() {
        this.hideHint();
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
    },

    updateHint: function(e, target) {
      this.hint.innerHTML = 'Размер модуля: '+'<br>' + target.label;
      this.hint.style.display = 'block';
      this.hint.style.left = e.e.pageX + 15 +'px';
      this.hint.style.top = e.e.pageY + 15 +'px';
    },

    hideHint: function() {
      this.hint.style.display = 'none';
    }

  });

  return WorkSpace
});
