(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const Controller = require('./controller.js')
const moduleMap = require('./yaMap')

Controller.init()
moduleMap.init()

},{"./controller.js":2,"./yaMap":5}],2:[function(require,module,exports){
const Model = require('./model')
const View = require('./view')

module.exports = {

  init() {
    Model.vkInit()
    Model.vkAuth()
    Model.vkCallApi('friends.get', { fields: 'name,lastname,photo_100,country,city' })

    this.objectListener(document, 'click')
    this.objectListener(document, 'keyup')
  },

  objectListener(object, type) {
    if (type == 'click') object.addEventListener(type, () => this.delegateClick(event))
    if (type == 'keyup') object.addEventListener(type, () => this.delegateKeyUp(event))
  },

  delegateClick() {

    if (event.target.dataset.state) Model.changeState(event.target.dataset.state)

    if (event.target.className == 'user-plus' || 'user-minus') {
      View.changeItemIcon(event)
      Model.renderList(document.querySelectorAll('.your-friends__list-item .full-name'), document.querySelector('.search-one_input'))
      Model.renderList(document.querySelectorAll('.list-friends__list-item .full-name'), document.querySelector('.search-two_input'))
    }

    if (event.target.className == 'footer__button-save') this.saveList()
  },

  delegateKeyUp() {
    if (event.target.className == 'search-one_input') Model.renderList(document.querySelectorAll('.your-friends__list-item .full-name'), document.querySelector('.search-one_input'))
    if (event.target.className == 'search-two_input') Model.renderList(document.querySelectorAll('.list-friends__list-item .full-name'), document.querySelector('.search-two_input'))
  },

  saveList() {
    const reestablish = {};
    const selectedItems = document.querySelector('.list-friends__list-item').children;

    for (let i = 0; i < selectedItems.length; i++) {
      reestablish[i] = selectedItems[i].id;
    }

    Model.saveToLocalStorage(reestablish)
  },

}


},{"./model":3,"./view":4}],3:[function(require,module,exports){

const View = require('./view')
const moduleMap = require('./yaMap')

module.exports = {
  stateOfApp: 0,

  changeState(state) {
    this.stateOfApp = state
    View.showState(this.stateOfApp)
  },

  
  insertFromStorage() {
    // Вывести из хранилища если есть там что то
    if (localStorage.data) {
      const arrSelected = JSON.parse(localStorage.data);
      View.insertChoosenFriends(arrSelected)
    }
  },

  vkInit() {
    console.log('app started')
    VK.init({
      apiId: 6669747
    })
  },

  vkAuth() {
    VK.Auth.login(data => {
      if (!data.session) {
        throw new Error('Не удалось авторизоваться!')
      }
    }, 2)
  },

  vkCallApi(method, params) {
    params.v = '5.76';

    VK.api(method, params, (data) => {
      if (data.error) {
        throw new Error(data.error)
      }

      View.insertFriends(data.response)
      this.insertFromStorage()
      this.filterFriends(data.response.items)
    })
  },

  filterFriends(friends){
    friends.filter(friend => friend.city && friend.city.title)
      .map(friend => {
        let parts = friend.country.title

        if(friend.city){
          parts += ' ' + friend.city.title
        }
        return parts
      })
      .map(moduleMap.geocode)
  },

  saveToLocalStorage(object) {
    localStorage.data = JSON.stringify(object);
  },

  renderList(arr = [], element) {
    for (let i = 0; i < arr.length; i++) {
      if (!this.isMatching(arr[i].textContent, element.value)) {
        View.showElem(arr[i].parentNode.parentNode, 'hide')
      }
      else {
        View.showElem(arr[i].parentNode.parentNode, 'show')
      }
    }
  },

  isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) > -1;
  },

  initMap(){
    moduleMap.init()
  }
}

},{"./view":4,"./yaMap":5}],4:[function(require,module,exports){


module.exports = {

  showState(state) {
    const layout = document.querySelector('.layout');
    const app = document.querySelector('.main-wrapper__container');
    const mapWrapper = document.getElementById('mapWrapper');
    const btnCloseMap = document.querySelector('.map-wrapper__button-close');
    const btnOpenMap = document.querySelector('.map-wrapper__button-open');
    const mapContainer = document.getElementById('map');

    if (state == 1) {
      layout.style.display = 'block';
      app.style.display = 'block';
      mapWrapper.className = 'container__map-wrapper';
      mapContainer.style.display = 'none';
      btnCloseMap.style.display = 'none';
      btnOpenMap.style.display = 'block';
      return
    } 
    if (state == 2) {
      layout.style.display = 'block';
      app.style.display = 'block';
      mapWrapper.className = 'container__map-active-wrapper';
      mapContainer.style.display = 'flex';
      btnCloseMap.style.display = 'block';
      btnOpenMap.style.display = 'none';
      return
    }

    layout.style.display = 'none';
    app.style.display = 'none';
  },

  insertFriends(friends) {
    const template = document.querySelector('#user-template').textContent;
    const render = Handlebars.compile(template);
    const renderFriends = render(friends);
    const results = document.querySelector('.your-friends__list-item');
    results.innerHTML = renderFriends;

  },

  changeItemIcon(event, zone = '', elem = '') {
    console.log('changeItemIcon')
    console.log(event.target.className)
    const element = event.target;
    const className = event.target.className;

    if (className == 'user-plus') {
      element.className = 'user-minus'
      return this.changePlaceItem(element)
    }

    if (className == 'user-minus') {
      element.className = 'user-plus'
      return this.changePlaceItem(element)
    }

    if (zone && elem) {
      if (zone == 'list-friends__list-item') {
        return elem.lastElementChild.className = 'user-plus'
      }
      elem.lastElementChild.className = 'user-minus'
    }
  },

  showElem(element, prop) {
    if (prop == 'show') { element.style.display = 'flex' }
    if (prop == 'hide') { element.style.display = 'none' }
  },

  changePlaceItem(element) {

    if (element.className == 'user-minus') {
      const listFriends = document.querySelector('.list-friends__list-item');
      return listFriends.appendChild(element.parentNode)
    }

    if (element.className == 'user-plus') {
      const yourFriends = document.querySelector('.your-friends__list-item');
      const parent = element.parentNode;

      if (yourFriends.childNodes) {
        return yourFriends.insertBefore(parent, yourFriends.firstChild);
      }

      yourFriends.appendChild(parent);
    }
  },

  insertChoosenFriends(arrayOfFriends) {
    for (let prop in arrayOfFriends) {
      document.getElementById(arrayOfFriends[prop]).lastElementChild.classList = 'user-minus';
      document.querySelector('.list-friends__list-item').appendChild(document.getElementById(arrayOfFriends[prop]));
    }
  }
}

},{}],5:[function(require,module,exports){
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
},{}]},{},[1]);
