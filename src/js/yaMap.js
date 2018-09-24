module.exports = {
  init(){
    new Promise(resolve => ymaps.ready(resolve))
      .then(() => {
        this.createMap()
      })
  },


  createMap(){
    let myMap;
    let myCollection;
    
    console.log(`старт moduleMap`)
    myMap = new ymaps.Map('map', {
      center: [55.76, 37.64], // Москва
      controls: ['smallMapDefaultSet'],
      zoom: 5
    },
      {
        searchControlProvider: 'yandex#search'
      });

    myCollection = new ymaps.GeoObjectCollection();

    clusterer = new ymaps.Clusterer({
      preset: 'islands#invertedVioletClusterIcons',
      clusterDisableClickZoom: true,
      openBalloonOnClick: true,
      geoObjectOpenBalloonOnClick: true
    });
    myMap.geoObjects.add(clusterer);
    myMap.geoObjects.add(myCollection);

    console.log(`map is initialized`)
  },

  insertPlaceMark(name,place,photo) {
    
    return ymaps.geocode(place)
      .then(result => {
        const points = result.geoObjects.toArray();
        if (points.length) {
          let coors = points[0].geometry.getCoordinates();
          let placemark = new ymaps.Placemark(
            [coors[0], coors[1]], 
            {
              balloonContentHeader: `${name}`,
              balloonContentBody: `<h4>город ${place}</h4><img src='${photo}'/>`,
              clusterCaption: `${name}`
             
            }, { preset: 'islands#invertedVioletClusterIcons' })
          
          clusterer.add(placemark)
          myCollection.add(placemark);
        }
      })
  },

  deleteAllPlaceMarks(){

    clusterer.removeAll();
    console.log('remove has done')
  }
}