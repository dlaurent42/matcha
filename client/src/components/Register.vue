<template>
  <div id="register">
    <h1>Register</h1>
    <input type="text" name="username" v-model="input.username" placeholder="Username" />
    <input type="text" name="firstname" v-model="input.firstname" placeholder="First name" />
    <input type="text" name="lastname" v-model="input.lastname" placeholder="Last name" />
    <input type="email" name="email" v-model="input.email" placeholder="Email" />
    <input type="password" name="password" v-model="input.password" placeholder="Password" />
    <input type="password" name="cpassword" v-model="input.cpassword" placeholder="Confirm password" />
    <button type="button" v-on:click="register()">Register</button>
  </div>
</template>

<script>
import Register from '@/services/Register'
export default {
  name: 'Register',
  data () {
    return {
      input: {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        cpassword: ''
      }
    }
  },
  methods: {
    async register () {
      const response = await Register.register({
        user: {
          username: this.input.username,
          firstname: this.input.firstname,
          lastname: this.input.lastname,
          email: this.input.email,
          password: this.input.password,
          cpassword: this.input.cpassword
        }
      })
      console.log(`Register - Response from server is: ${JSON.stringify(response.data)}`)
    }
  }
}
</script>

<style scoped>
</style>
