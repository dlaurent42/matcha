
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './components/App'
import ErrorMessage from './components/ErrorMessage'
import router from './router'

// Css import
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// NPM installed modules
Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App,
    ErrorMessage
  },
  template: '<App/>'
})
