<template>
  <div id="wrapper">
    <header>
      <div v-if="isLogged" id="nav">
        <router-link to="/">Home - logged</router-link> |
        <router-link to="/about">About - logged</router-link>
      </div>
      <div v-else-if="!isLogged" id="nav">
        <router-link to="/">Home - not logged</router-link> |
        <router-link to="/about">About - not logged</router-link>
      </div>
    </header>
    <router-view/>
    <footer>
      Copyright {{ year }}
    </footer>
  </div>
</template>

<script>
import Main from '@/services/Main'
export default {
  name: 'App',
  data() {
    const d = new Date();
    return {
      year: d.getFullYear(),
      isLogged: false,
    };
  },
  mounted() {
    this.isLogged()
  },
  methods: {
    async isLogged() {
      const response = await Main.fetch()
      this.isLogged = response.isLogged
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
