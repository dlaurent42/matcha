<template>
  <b-row class="fill-space">
    <b-col
      md="6"
      cols="12"
      class="left-space bg-dark"
      v-bind:class="{ 'translate': registered }"
    >
      <b-card
        v-if="registered === false"
        class="text-white bg-dark my-auto col-md-8 border-info"
        title="Register"
        sub-title="Create your account to use our awesome services !"
      >
        <b-form>
          <b-form-group
            id="exampleInputGroup1"
            label="Email address:"
            label-for="exampleInput1"
            description="We'll never share your email with anyone else."
          >
            <b-form-input
              id="exampleInput1"
              type="email"
              v-model="input.email"
              required
              placeholder="Enter email"
              :state="verifyEmail"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="exampleInputGroup2"
            label="Username:"
            label-for="exampleInput2"
            description="Your username must be alpha numeric and contain between 5 and 24 characters"
          >
            <b-form-input
              id="exampleInput2"
              type="text"
              v-model="input.username"
              :state="verifyUserName"
              required
              placeholder="Enter username"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="exampleInputGroup3"
            label="Name:"
            label-for="exampleInput3"
          >
            <b-form-input
              id="exampleInput3"
              type="text"
              v-model="input.firstname"
              :state="verifyFirstName"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup4" label="Last Name:" label-for="exampleInput4">
            <b-form-input
              id="exampleInput4"
              type="text"
              v-model="input.lastname"
              :state="verifyLastName"
              required
              placeholder="Enter lastname"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup5" label="Password" label-for="exampleInput5">
            <b-form-input
              id="exampleInput5"
              type="password"
              v-model="input.password"
              :state="verifyPassword"
              required
              placeholder="Enter your password"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="exampleInputGroup6"
            label="Re-enter your password"
            label-for="exampleInput6"
          >
            <b-form-input
              id="exampleInput6"
              type="password"
              v-model="input.cpassword"
              :state="verifycPassword"
              required
              placeholder="Enter your password again"
            ></b-form-input>
          </b-form-group>
          <v-load
              v-bind:loadingState="loadingRegister"
              v-bind:errorMessage="errorMessage"
              message="Register"
              v-on:update="verify()"
            />
        </b-form>
      </b-card>
      <b-card
        v-else
        class="text-white bg-dark my-auto col-md-8 border-info"
        title="Register successful !"
        sub-title="Thanks for creating an account"
      >
      <p class="card-text">
        Check your email to set your account as confirmed
      </p>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import _ from 'lodash'
import User from '@/services/User'
import buttonLoading from '@/components/buttonLoading'
import router from '@/router'
import isEmail from '@/utils/user/isEmail'
import isUsername from '@/utils/user/isUsername'
import isPassword from '@/utils/user/isPassword'
import isLastname from '@/utils/user/isLastname'
import isFirstname from '@/utils/user/isFirstname'
export default {
  name: 'Register',
  props: ['authenticated'],
  components: {
    'v-load': buttonLoading
  },
  data () {
    return {
      loadingRegister: 'false',
      errorMessage: 'Please verify that all fields are filled in',
      registered: false,
      input: {
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        cpassword: ''
      },
      verified: {
        username: null,
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        cpassword: null
      },
      show: true
    }
  },
  methods: {
    verify () {
      if (
        isUsername(this.input.username) &&
        isFirstname(this.input.firstname) &&
        isLastname(this.input.lastname) &&
        isEmail(this.input.email) &&
        !(_.isEmpty(this.input.cpassword)) &&
        isPassword(this.input.password, this.input.cpassword) &&
        this.input.cpassword !== ''
      ) this.register()
      else {
        this.loadingRegister = 'error'
        setTimeout(() => { this.loadingRegister = 'false' }, 3000)
      }
    },
    register () {
      this.loadingRegister = true
      User.register({ user: this.input })
        .then((success) => {
          if (success.data.err) {
            this.loadingRegister = 'error'
            setTimeout(() => { this.loadingRegister = 'false' }, 3000)
          } else this.registered = true
        })
        .catch(() => {
          this.loadingRegister = 'error'
          setTimeout(() => { this.loadingRegister = 'false' }, 3000)
        })
    }
  },
  computed: {
    verifyEmail () { return (this.input.email === '' ? null : isEmail(this.input.email)) },
    verifyUserName () { return this.input.username === '' ? null : isUsername(this.input.username) },
    verifyFirstName () { return this.input.firstname === '' ? null : isFirstname(this.input.firstname) },
    verifyLastName () { return this.input.lastname === '' ? null : isLastname(this.input.lastname) },
    verifyPassword () { return this.input.password === '' ? null : isPassword(this.input.password) },
    verifycPassword () { return this.input.password === '' ? null : this.input.cpassword === this.input.password }
  },
  beforeMount () {
    if (this.authenticated === true) router.push('/')
    this.loadingRegister = 'false'
  }
}
</script>

<style scoped>
@media screen and (min-width: 640px) {
  .translate {
    transform: translate(100%, 0);
    transition: transform 2s, height 4s;
  }
}
.bg-dark-transparent {
  background-color:#343a40ad;
  color:rgba(255, 255, 255, 0.8);
  height: 100%;
}
.left-space {
  padding: 0;
  flex: 1 100%;
  align-self: flex-start;
  justify-content: center;
  display: flex;
}
.form-control:not(:matches(.is-valid, .is-unvalid)) {
  border: transparent;
}
.form-control {
  background-color: #ffffff2e;
  color: #e6e6e6;
}
.form-control:focus {
    color: #dae0e6;
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
