import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './components/App'
import router from './router'
import utils from './utils'
import _ from 'lodash'

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Css import
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// NPM installed modules
Vue.use(BootstrapVue)
const options = { name: 'lodash' } // customize the way you want to call it
Vue.use(_, options) // options is optional

/*
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBU8b3Mp6W4aoR7Kfe85uLZEL5lVLzzFVs',
    libraries: 'places'
  }
})
*/
// Important css
require('./assets/css/template.css')
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  utils,
  components: {
    App
  },
  template: '<App/>'
})
