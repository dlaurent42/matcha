import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './components/App'
import router from './router'
import utils from './utils'

// Font awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Css import
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// NPM installed modules
Vue.use(BootstrapVue)

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
