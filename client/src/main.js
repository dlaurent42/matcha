import Vue from 'vue'
import App from './components/App'
import ErrorMessage from './components/ErrorMessage'
import router from './router'

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
