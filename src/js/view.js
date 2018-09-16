
module.exports = {

  showState(state) {
    const layout = document.querySelector('.layout');
    const app = document.querySelector('.main-wrapper__container');

    if (state == 1) {
      layout.style.display = 'block';
      app.style.display = 'block';
    } else {
      layout.style.display = 'none';
      app.style.display = 'none';
    }
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
