<template>
    <b-row class="justify-content-md-center bg-transparent">
      <b-col col md="4" lg="3">
        <b-card title="Edit Your Informations" class="bg-dark-transparent">
          <b-form>
            <b-form-group
              id="firstnameGroup"
              label="Firstname:"
              label-for="firstnameInput"
            >
              <b-form-input
                id="firstnameInput"
                type="text"
                v-model="input.firstname"
                required
                placeholder="Enter firstname"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="lastnameGroup"
              label="Last Name:"
              label-for="lastnameInput"
            >
              <b-form-input
                id="lastnameInput"
                type="text"
                v-model="input.lastname"
                required
                placeholder="Enter lastname"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="passwordGroup" label="Password:" label-for="passwordInput">
              <b-form-input
                id="passwordInput"
                type="password"
                v-model="input.password"
                required
                placeholder="Enter your password"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="cpasswordGroup" label="Re-enter your password:" label-for="cpasswordInput">
              <b-form-input
                id="cpasswordInput"
                type="password"
                v-model="input.cpassword"
                required
                placeholder="Enter your password again"
              ></b-form-input>
            </b-form-group>
            <b-button v-on:click="updateInformation()" variant="dark">Update</b-button>
          </b-form>
        </b-card>
      </b-col>
      <b-col col md="4" lg="4">
        <b-card title="Edit Your Profile" class="bg-dark-transparent">
          <b-form>
            <b-form-group
              id="ageGroup"
              label="Age:"
              label-for="ageInput"
            >
              <b-form-input
                id="ageInput"
                type="text"
                v-model="input.age"
                required
                placeholder="Enter your age"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="birthdayGroup" label="Birthday:" label-for="birthdayInput">
              <b-form-input
                id="birthdayInput"
                type="date"
                v-model="input.date"
                required
                placeholder="Enter name"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="genderGroup" label="Last Name:" label-for="genderInput">
              <b-form-input
                id="genderInput"
                type="text"
                v-model="input.gender"
                required
                placeholder="Enter gender"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="orientationGroup" label="Orientation:" label-for="orientationInput">
              <b-form-input
                id="orientationInput"
                type="text"
                v-model="input.orientation"
                required
                placeholder="Enter your orientation"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="biographyGroup"
              label="Biography:"
              label-for="biographyInput"
            >
              <b-form-textarea
                id="biographyInput"
                type="text"
                :rows="3"
                :max-rows="6"
                v-model="input.biography"
                required
                placeholder="This will be displayed on matching page"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group
              id="interestGroup"
              label="Interest:"
              label-for="interestInput"
            >
              <b-form-input
                id="interestInput"
                type="text"
                v-model="input.interest"
                required
                placeholder="Add interest to your profile"
              ></b-form-input>
            </b-form-group>
            <b-button v-on:click="updateProfile()" variant="dark">Update</b-button>
          </b-form>
        </b-card>
      </b-col>
      <b-col col md="4" ld="4">
        <b-card title="Add a profile picture" class="bg-dark-transparent">
          <b-form-file
            v-model="file"
            @change="onFileChange"
            :state="Boolean(file)"
            placeholder='Choose a file...'
            accept="image/jpeg, image/png, image/gif"
          >
          </b-form-file>
          <div class="mt-3">Selected file: {{file && file.name}}</div>
          <div id="preview" class="w-100 mb-2">
            <p>Preview :</p>
            <img v-if="url" :src="url" class="w-100"/>
          </div>
          <b-button v-if="url" variant="outline-info" v-on:click="addPicture">Add</b-button>
          <b-button v-if="url" variant="outline-danger" v-on:click="resetPicture">Cancel</b-button>
        </b-card>
      </b-col>
    </b-row>
</template>

<script>
import User from '@/services/User'
import { isEmpty } from '@/utils/obj/isEmpty'

export default {
  name: 'Profile',
  props: ['user'],
  data () {
    return {
      url: null,
      file: null,
      input: {
        username: '',
        firstname: '',
        lastname: '',
        password: '',
        cpassword: '',
        age: '',
        birthday: '',
        gender: '',
        orientation: [],
        biography: '',
        interest: ''
      },
      show: true
    }
  },
  beforeMount () {
    if (!isEmpty(this.user)) for (var k in this.user) this.input[k] = this.user[k]
  },
  methods: {
    addPicture () {
      return ''
    },
    resetPicture () {
      this.url = null
      this.file = ''
    },
    onFileChange (e) {
      this.url = URL.createObjectURL(e.target.files[0])
    },
    async updateInformation () {
      const response = await User.update({
        user: {
          username: this.input.username,
          firstname: this.input.firstname,
          lastname: this.input.lastname,
          password: this.input.password,
          cpassword: this.input.cpassword
        }
      })
      console.log(
        `Register - Response from server is: ${JSON.stringify(response.data)}`
      )
    },
    async updateProfile () {
      const response = await User.update({
        user: {
          username: this.input.username,
          firstname: this.input.firstname,
          lastname: this.input.lastname,
          password: this.input.password,
          cpassword: this.input.cpassword
        }
      })
      console.log(
        `Register - Response from server is: ${JSON.stringify(response.data)}`
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
