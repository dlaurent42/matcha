<template>
  <b-row class="fill-space">
    <b-col md="6" cols="12" class="right-space bg-dark">
      <b-card
        title="Login"
        sub-title="Log in to use our awesome services !"
        class="bg-dark-transparent border-info"
      >
        <b-form class="mt-5">
          <b-form-group
            id="exampleInputGroup1"
            label-for="exampleInput1"
          >
            <b-form-input
              id="exampleInput1"
              type="text"
              v-model="input.username"
              required
              placeholder="Enter username"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="exampleInputGroup2"
            label-for="exampleInput2"
          >
            <b-form-input
              id="exampleInput2"
              type="password"
              v-model="input.password"
              required
              placeholder="Enter password"
            ></b-form-input>
          </b-form-group>
          <b-button v-on:click="login()" variant="info">Login</b-button>
          <b-button v-on:click="resetPassword()" variant="dark">Forgot your password ?</b-button>
          <b-card-footer class="mt-4">
            <p class="card-text">Not on Matcha yet ? <router-link to="/register" class="card-link">Sign up</router-link></p>
          </b-card-footer>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import User from '@/services/User'
import router from '@/router'

export default {
  name: 'Login',
  data () {
    return {
      input: {
        username: '',
        password: ''
      },
      show: true
    }
  },
  methods: {
    async login () {
      await User.login({
        params: {
          username: this.input.username,
          password: this.input.password
        }
      })
        .then(
          // On success go to profile page
          success => {
            console.log(`Login - Response from server is: ${JSON.stringify(success)}`)
            router.push('/Profile')
          },
          error => console.dir(error)
        )
    },
    async resetPassword () {
      return null
    }
  }
}
</script>

<style scoped>
.right-space {
  padding: 0;
  flex: 1 100%;
  align-self: flex-end;
  justify-content: center;
  -ms-flex: 1;
  display: flex;
}
.bg-dark-transparent {
  background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8);
  align-self: center;
}
.form-control {
  background-color: #ffffff2e;
  border: 1px solid #dacece00;
  color: #e6e6e6;
}
.form-control:focus {
    color: #dae0e6;
    border-color:transparent;
    outline: 0;
    -webkit-box-shadow: 0 0 0 0.2rem rgba(121, 121, 121, 0.25);
    box-shadow: 0 0 0 0.2rem rgba(121, 121, 121, 0.25);
}
::-webkit-input-placeholder {
    color:    rgb(148, 148, 148);
}
:-moz-placeholder {
    color:    rgb(148, 148, 148);
}
::-moz-placeholder {
    color:    rgb(148, 148, 148);
}
:-ms-input-placeholder {
    color:    rgb(148, 148, 148);
}
</style>
