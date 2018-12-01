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
      console.log(`Response from server is: ${JSON.stringify(response.data)}`)
      if (response.data.token !== 'undefined') {
        this.isLogged = true
      } else {
        this.isLogged = false
      }
      // if (this.input.username !== '' && this.input.password !== '') {
      //   if (this.input.username === this.$parent.mockAccount.username && this.input.password === this.$parent.mockAccount.password) {
      //     this.$emit('authenticated', true)
      //     this.$router.replace({ name: 'secure' })
      //   } else {
      //     console.log('The username and / or password is incorrect')
      //   }
      // } else {
      //   console.log('A username and password must be present')
      // }
    }
  }
}
</script>

<style scoped>
</style>
