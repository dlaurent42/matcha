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
          <b-button v-if="loadingInformation === 'false'" v-on:click="updateInformation()" variant="dark">Update</b-button>
          <b-button v-else-if="loadingInformation='complete'" variant="success">Update complete</b-button>
          <b-button v-else-if="loadingInformation='error'" variant="danger">An error has occured, try again later</b-button>
          <b-button v-else variant="dark"><font-awesome-icon icon="spinner" size="1x" pulse/> Updating...</b-button>
        </b-form>
      </b-card>
    </b-col>
    <b-col col md="4" lg="4">
      <b-card title="Edit Your Profile" class="bg-dark-transparent">
        <b-form>
          <b-form-group id="birthdayGroup" label="Birthday:" label-for="birthdayInput">
            <b-form-input
              id="birthdayInput"
              type="date"
              v-model="input.birthday"
              required
              placeholder="Enter name"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="genderGroup" label="Gender:" label-for="genderInput">
            <b-form-select v-model="input.gender" :options="gender" class="mb-3"/>
          </b-form-group>
          <b-form-group label="Select your orientation">
            <b-form-checkbox-group id="checkboxes1" name="flavour1" v-model="orientation" :options="getOrientation">
            </b-form-checkbox-group>
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
            <b-badge
              class="ml-1 mb-1"
              v-for="(tags, index) in interest"
              v-bind:key="tags"
              @click="removeElement(index)"
            >
              {{ tags }}
            </b-badge>
            <b-row class="m-0 mt-2">
              <b-col md="8" class="p-0">
                <b-form-input
                  id="interestInput"
                  type="text"
                  v-model="input.interest"
                  required
                  placeholder="Add interest"
                />
              </b-col>
              <b-col md="4">
                <b-button v-on:click="addInterest" variant="light">Add</b-button>
              </b-col>
            </b-row>
          </b-form-group>
          <b-button v-if="loadingProfile === 'false'" v-on:click="updateProfile" variant="dark">Update</b-button>
          <b-button v-else-if="loadingProfile ==='complete'" variant="success">Update complete</b-button>
          <b-button v-else-if="loadingProfile ==='error'" variant="danger">An error has occured, try again later</b-button>
          <b-button v-else variant="dark"><font-awesome-icon icon="spinner" size="1x" pulse/> Updating...</b-button>
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
        <template v-if="urlEmpty">
          <div class="mt-3">Selected file: {{file && file.name}}</div>
          <div  d="preview" class="w-100 mb-2">
            <p>Preview :</p>
            <img :src="url" class="w-100"/>
          </div>
          <b-button variant="outline-info" v-on:click="addPicture">Add</b-button>
          <b-button variant="outline-danger" v-on:click="resetPicture">Cancel</b-button>
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import User from '@/services/User'
import router from '@/router'
import _ from 'lodash' //eslint-disable-line
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner)

export default {
  name: 'Profile',
  data () {
    return {
      loadingInformation: false,
      loadingProfile: false,
      url: null,
      file: null,
      gender: [{
        value: null, text: 'Please select your gender'
      }],
      orientation: [],
      interest: [],
      input: {
        firstname: '',
        lastname: '',
        password: '',
        cpassword: '',
        birthday: '',
        gender: '',
        biography: '',
        interest: ''
      },
      show: true
    }
  },
  beforeMount () {
    if (this.authenticated === false) router.push('/')
    User.get()
      .then(success => {
        this.input = success.data.user
        this.input.birthday = this.input.birthday.replace(/\//gi, '-')
        this.interest = _.isEmpty(success.data.user.interests) ? [] : success.data.user.interests
        this.orientation = _.isEmpty(success.data.user.orientation) ? [] : success.data.user.orientation
      })
    User.getGender()
      .then(success => { this.gender = [...this.gender, ...success.data.genders] })
    this.loadingInformation = 'false'
    this.loadingProfile = 'false'
  },
  mounted () {
  },
  computed: {
    urlEmpty () { return !_.isEmpty(this.url) },
    getOrientation () { return _.drop(this.gender) }
  },
  methods: {
    addPicture () {
      User.addPicture(this.file)
        .then(success => {
          this.resetPicture()
        })
    },
    resetPicture () {
      this.url = null
      this.file = ''
    },
    onFileChange (e) { this.url = URL.createObjectURL(e.target.files[0]) },
    updateInformation () {
      this.loadingInformation = 'true'
      User.update({
        fields: {
          firstname: this.input.firstname,
          lastname: this.input.lastname
        }
      })
        .then(success => {
          this.input = success.data.user
          this.loadingInformation = 'complete'
        })
        .catch(() => { setTimeout(() => { this.loadingInformation = 'error' }, 1500) })
        .finally(setTimeout(() => { this.loadingInformation = 'false' }, 2000))
    },
    removeElement (index) { this.interest.splice(index, 1) },
    addInterest () {
      if (!_.isEmpty(_.trim(this.input.interest))) {
        this.interest.push(_.trim(this.input.interest))
        this.interest = _.uniq(this.interest)
        this.input.interest = ''
      }
    },
    updateProfile () {
      this.loadingProfile = 'true'
      const data = (_.pickBy(
        this.input, (x, key) => {
          return !(_.isEmpty(x) ||
            key === 'id' ||
            key === 'creation' ||
            key === 'username' ||
            key === 'fullname' ||
            key === 'email' ||
            key === 'interests' ||
            key === 'pictures' ||
            key === 'profilePic' ||
            key === 'orientation' ||
            key === 'registrationToken'
          )
        }
      ))
      if (!_.isEmpty(this.interest)) Object.assign(data, { interest: this.interest })
      if (!_.isEmpty(this.orientation)) Object.assign(data, { sexualOrientation: this.orientation })
      console.dir(data)
      User.update({ fields: data })
        .then(success => { setTimeout(() => { this.loadingProfile = 'complete' }, 1500) })
        .catch(() => { this.loadingProfile = 'error' })
        .finally(setTimeout(() => { this.loadingProfile = 'false' }, 3000))
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
