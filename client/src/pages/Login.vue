<template>
  <b-row class="fill-space">
    <b-col md="6" cols="12" class="right-space bg-dark">
      <b-card v-if="recovery === false"
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
       <b-card v-else
          title="Recover Password"
          sub-title="Enter your email to reset your password"
          class="bg-dark-transparent border-info"
        >
          <b-form-group
            id="exampleInputGroup1"
            label-for="exampleInput1"
          >
            <b-form-input
              id="exampleInput1"
              type="text"
              v-model="recover"
              required
              placeholder="Enter your email"
            ></b-form-input>
          </b-form-group>
          <b-button v-on:click="reset" variant="info">Reset</b-button>
          <b-button v-on:click="resetPassword" variant="dark">Go back to log in</b-button>
          <p v-if="sent === true" class="card-text text-info mt-4">An email has been sent to your email address</p>
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
      recovery: false,
      sent: false,
      input: {
        username: '',
        password: ''
      },
      recover: '',
      show: true
    }
  },
  methods: {
    async login () {
      const data = { params: { username: this.input.username, password: this.input.password } }
      User.login(data)
        .then(success => {
          this.$emit('authenticated', success)
          router.push('/')
        })
        .catch(error => console.dir(error))
    },
    reset () {
      User.resetPassword({ 'email': this.recover })
        .then(success => {
          this.sent = true
          setTimeout(() => { this.resetPassword() }, 2000)
        })
        .catch(err => console.log(err))
    },
    resetPassword () { this.recovery = !this.recovery }
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
