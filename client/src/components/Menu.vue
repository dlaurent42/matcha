<template>
  <b-navbar toggleable="md" type="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Matcha</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
        <b-nav-item><router-link to="/About">About</router-link></b-nav-item>
        <b-nav-item><router-link to="/Services">Services</router-link></b-nav-item>
        <b-nav-item><router-link to="/Contact">Contact</router-link></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-navbar-nav class="ml-auto">
      <div v-if="userLogged === true" id="nav">
        <div v-on:click="logout()">Logout</div>
      </div>
      <div v-else id="nav">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </div>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'Menu'
}
</script>
