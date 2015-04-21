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
    stroke: 'black'

  });

pictureModuleConfigurator.addPictureModule({
    width: 200,
    height: 230,
    left: 320,
    top: 100,
    stroke: 'black'
  });


pictureModuleConfigurator.addPictureModule({
    width: 210,
    height: 230,
    left: 80,
    top: 330,
    stroke: 'black'
  });

pictureModuleConfigurator.addPictureModule({
    width: 180,
    height: 150,
    left: 340,
    top: 360,
    stroke: 'black'
  });          
})();

 