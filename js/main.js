(function() {
    pictureModuleConfigurator = new Configurator({
    canvas: document.getElementById('configurator'),
    backgroundImageUrl: 'images/img3-lg.jpg',
    scaleViewEl: document.getElementById('scaleRange'),
    pixelsPerCentimeter: 6
  });


pictureModuleConfigurator.addPictureModule({
    width: 200,
    height: 200,
    left: 100,
    top: 100,
    stroke: 'green',
    fill: 'transparent',
    strokeWidth: 2
  });

    
})();

 