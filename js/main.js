(function() {

  requirejs.config({
      baseUrl: "js/configurator"
  });

  require(['configurator'], function(Configurator) {

      pictureModuleConfigurator = new Configurator({
      canvas: document.getElementById('configurator'),
      backgroundImageUrl: document.getElementById('background').src,
      scaleViewEl: document.getElementById('scaleRange'),
      hintEl: document.getElementById('hint'),
      pixelsPerCentimeter: 6
    });

    pictureModuleConfigurator.addPictureModule({
      left: 100,
      top: 100
    });

    pictureModuleConfigurator.addPictureModule({
      left: 320,
      top: 60,
      scaleX: 1.4,
      scaleY: 1.2
    });

    pictureModuleConfigurator.addPictureModule({
      left: 80,
      top: 330,
    });

    pictureModuleConfigurator.addPictureModule({
      left: 340,
      top: 360,
      scaleX: 1.2,
      scaleY: 2
    });

    pictureModuleConfigurator.addPictureModule({
      left: 400,
      top: 220,
      scaleX: 1.7
    });
  });

})();

