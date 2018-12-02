<template>
  <div id="wrapper">
    <div id="wrapper-header" :style="{ 'backgroundImage':'url(\'' + bgHeaderImage + '\')' }">
      <div v-if="userLogged === true" id="nav">
        <router-link to="/">Home - logged</router-link> |
        <router-link to="/about">About - logged</router-link> |
        <div v-on:click="logout()">Logout</div>
      </div>
      <div v-else id="nav">
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link>
      </div>
    </div>
    <div id="wrapper-content">
      <router-view/>
    </div>
    <div id="wrapper-footer">
      Copyright {{ year }}
    </div>
  </div>
</template>

<script>
import User from '@/services/User'
export default {
  name: 'App',
  data () {
    const d = new Date()
    return {
      year: d.getFullYear(),
      userLogged: false,
      bgHeaderImage: require('./assets/backgrouds/headerbg.jpg')
    }
  },
  mounted () {
    this.isLogged()
  },
  methods: {
    async isLogged () {
      const response = await User.isLogged()
      this.userLogged = response.data.isLogged
      console.log(`isLogged():\n\tuser.userLogged = ${this.userLogged},\n\tresponse = ${JSON.stringify(response.data)}`)
    },
    async logout () {
      const response = await User.logout()
      this.userLogged = response.data.isLogged
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
