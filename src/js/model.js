
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
      return arrSelected
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
      
      this.renderFriends()
      
      console.log(data.response.items)
    })
  },

  renderFriends(){
    const arrayOfFriends = this.insertFromStorage();

    //moduleMap.deleteAllPlaceMarks()
    moduleMap.deleteAllPlaceMarks()
    arrayOfFriends.filter(friend => friend.place)
      .map(friend => {
        let parts = friend.place

        return parts
      })
      .map(moduleMap.insertPlaceMark)

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

  cleanLocalStorage(){
    localStorage.data = ''
  },

  saveToLocalStorage(object) {
    console.log('saved to storage')
    
    localStorage.data = JSON.stringify(object);
    console.log(localStorage.data)
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
