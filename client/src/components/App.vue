<template>
  <div id="wrapper">
    <v-header></v-header>
    <div id="wrapper-header">
    </div>
    <div id="wrapper-content" :style="{ 'backgroundImage':'url(\'' + bgHeaderImage + '\')' }">
      <router-view/>
    </div>
    <div id="wrapper-footer">
      Copyright {{ year }}
    </div>
  </div>
</template>

<script>
import User from '@/services/User'
import ErrorMessage from './ErrorMessage.vue'
import Menu from './Menu.vue'

export default {
  name: 'App',
  components: {
    'v-header': Menu,
    'v-error': ErrorMessage
  },
  data () {
    const d = new Date()
    return {
      year: d.getFullYear(),
      bgHeaderImage: require('../assets/backgrouds/headerbg.jpg'),
      userLogged: false
    }
  },
  mounted () {
    this.isLogged()
  },
  methods: {
    async isLogged () {
      const response = await User.isLogged()
      this.userLogged = response.data.isLogged
      this.err = response.data.err
      console.log(`isLogged():\n\tuser.userLogged = ${this.userLogged},\n\tresponse = ${JSON.stringify(response.data)}`)
    },
    async logout () {
      const response = await User.logout()
      this.userLogged = response.data.isLogged
      this.err = response.data.err
      console.log(`logout():\n\tuser.userLogged = ${this.userLogged},\n\tresponse = ${JSON.stringify(response.data)}`)
    }
  }
}
</script>

<style>
  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, section, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
    width: auto;
    height: auto;
    margin: auto;
    padding: 0;
    border: 0;
    font-size: 100%;
    font-family: 'Roboto';
    text-align: center;
    vertical-align: top;
  }

  body {
    overflow-x: hidden;
  }

  a:link, a:visited {
    color: white;
    padding: 14px 25px;
    text-decoration: none;
  }

  a:hover, a:active {
    color: rgb(154,154,154);
  }

  h1, h2, h3, h4, h5, h6 {
    font-variant: small-caps;
    letter-spacing: 3px;
  }

  h1 {
    padding: 40px 0;
    font-size: 60px;
    line-height: 1.16666667;
    text-transform: uppercase;
  }

  h2 {
    color: white;
    font-size: 24px;
    line-height: 1.1;
    font-family: "Cabin", sans-serif;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0px;
    padding: 60px 0;
  }

  h3 {
    font-size: 18px;
    line-height: 1.38888889;
    font-weight: 500;
  }

  body {
    background-color: #242529;
    color: #243238;
    font-family: "PT Sans",sans-serif;
    font-size: 13px;
    line-height: 16px;
    margin: 0;
    min-width: 320px;
    overflow: hidden;
    width: 100%;
  }

  #wrapper-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 85vh;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>