<template>
  <b-row class="fill-space">
    <b-col md="6" cols="12" class="left-space bg-dark">
      <b-card
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
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="exampleInputGroup2"
            label="Username:"
            label-for="exampleInput2"
            description="Your username must be alpha numeric and contain between 6 and 24 characters"
          >
            <b-form-input
              id="exampleInput2"
              type="text"
              v-model="input.username"
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
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup4" label="Last Name:" label-for="exampleInput4">
            <b-form-input
              id="exampleInput4"
              type="text"
              v-model="input.lastname"
              required
              placeholder="Enter lastname"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup5" label="Password" label-for="exampleInput5">
            <b-form-input
              id="exampleInput5"
              type="password"
              v-model="input.password"
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
              required
              placeholder="Enter your password again"
            ></b-form-input>
          </b-form-group>
          <b-button v-on:click="verify()" variant="info">Submit</b-button>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import User from '@/services/User'
import isEmail from '@/utils/user/isEmail'
import isUsername from '@/utils/user/isUsername'
import isPassword from '@/utils/user/isPassword'
import isLastname from '@/utils/user/isLastname'
import isFirstname from '@/utils/user/isFirstname'
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
        isPassword(this.input.password, this.input.cpassword)
      ) this.register()
      else {
        console.log(
          isUsername(this.input.username),
          isFirstname(this.input.firstname),
          isLastname(this.input.lastname),
          isEmail(this.input.email),
          isPassword(this.input.password, this.input.cpassword)
        )
      }
    },
    async register () {
      await User.register({ user: this.input })
        .then(
          success => { console.log(success) },
          error => { console.dir(error) }
        )
    }
  }
}
</script>

<style scoped>
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
.form-control {
  background-color: #ffffff2e;
  border: 1px solid #dacece00;
  color: #e6e6e6!important;
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
