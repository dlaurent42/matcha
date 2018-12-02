<template>
  <div id="login">
    <h1>Login</h1>
    <input type="text" name="username" v-model="input.username" placeholder="Username" />
    <input type="password" name="password" v-model="input.password" placeholder="Password" />
    <button type="button" v-on:click="login()">Login</button>
  </div>
</template>

<script>
import User from '@/services/User'
export default {
  name: 'Login',
  data () {
    return {
      input: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      const response = await User.login({
        user: {
          username: this.input.username,
          password: this.input.password
        }
      })
      console.log(`Login - Response from server is: ${JSON.stringify(response.data)}`)
    }
  }
}
</script>

<style scoped>
</style>
