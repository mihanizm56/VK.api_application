module.exports = {
  init(){
    new Promise(resolve => ymaps.ready(resolve))
      .then(() => {
        this.createMap()
      })
  },
  
  createMap(){
    let myMap;
    console.log(`старт moduleMap`)
    myMap = new ymaps.Map('map', {
      center: [55.76, 37.64], // Москва
      controls: ['smallMapDefaultSet'],
      zoom: 5
    },
      {
        searchControlProvider: 'yandex#search'
      });
    clusterer = new ymaps.Clusterer({
      preset: 'islands#invertedVioletClusterIcons',
      clusterDisableClickZoom: false,
      openBalloonOnClick: true,
      geoObjectOpenBalloonOnClick: true
    });
    myMap.geoObjects.add(clusterer);
    console.log(`map is initialized`)
  },

  geocode(address) {
    return ymaps.geocode(address)
      .then(result => {
        const points = result.geoObjects.toArray();
        if (points.length) {
          const coors = points[0].geometry.getCoordinates();
          clusterer.add(new ymaps.Placemark([coors[0], coors[1]], {}, { preset: 'islands#invertedVioletClusterIcons' }))
        }
      })
  }
}