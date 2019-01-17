<template>
    <b-row class="justify-content-md-center pt-5" v-bind:style="{ 'background-image': 'url(' + img + ')' }">
        <b-col col md="12" lg="10">
            <b-card-group columns>
                <b-card
                    v-for="(person, index) in persons"
                    v-bind:index="index"
                    v-bind:key=index
                    v-bind:item="person"
                    v-bind:title="person.name.first"
                    v-bind:subTitle="person.name.last"
                    v-bind:img-src="person.picture.large"
                    img-fluid
                    img-alt="image"
                    img-top
                >
                    <p class="card-text" >{{ person.name.first }} {{ person.name.last }}</p>
                    <p class="card-text" ><strong>Location:</strong> {{ person.location.city }}, {{ person.location.state }}</p>
                    <b-row class="justify-content-center">
                      <b-col class="text-right">
                        <b-button class="rounded-circle" variant="outline-danger">
                          <font-awesome-icon :icon="['far', 'heart']"/>
                        </b-button>
                      </b-col>
                      <b-col class="text-left">
                        <b-button class="rounded-circle" variant="outline-warning">
                          <font-awesome-icon :icon="['fas', 'times']"/>
                        </b-button>
                      </b-col>
                    </b-row>
                </b-card>
            </b-card-group>
        </b-col>
    </b-row>
</template>
<script>
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
library.add([faHeart, faTimes])

export default {
  name: 'Match',
  data () {
    return {
      persons: [],
      img: ''
    }
  },
  methods: {
    getHeight () {
      let e = document.documentElement
      return e.scrollHeight - e.scrollTop === e.clientHeight
    },
    pushUser () {
      axios.get(`https://randomuser.me/api/`).then(response => {
        if (response !== undefined) this.persons.push(response.data.results[0])
        if (this.getHeight()) { this.pushUser() }
      })
    },
    getInitialUsers () {
      for (var i = 0; i < 5; i++) {
        axios.get(`https://randomuser.me/api/`).then(response => {
          this.persons.push(response.data.results[0])
        })
      }
    },
    scroll (person) {
      window.onscroll = () => { if (this.getHeight()) { this.pushUser() } }
    }
  },
  beforeMount () {
    this.getInitialUsers()
    this.img = 'http://getwallpapers.com/wallpaper/full/f/c/3/43246.jpg'
  },
  mounted () {
    this.scroll(this.person)
  }
}
</script>
<style scoped>
.rounded-circle {
  height: 50px;
  width: 50px;
  font-size: 22px;
  padding: 0;
  margin: 0;
}
.btn-outline-warning:hover {
  color:white;
}
</style>
