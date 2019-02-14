<template>
  <div class="max-height-600">
    <b-carousel
      id="carousel1"
      style="text-shadow: 1px 1px 2px #333;"
      controls
      indicators
      background="#ababab"
      :interval="4000"
      img-width="100%"
      img-height="100%"
      v-model="slide"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide
        v-for="(pic, index) in pictures"
        v-bind:key="index"
        v-model="current"
        v-bind:img-src="getPath(pic)"
        class="max-height-600"
      >
      </b-carousel-slide>
    </b-carousel>
    <p class="mt-4 text-white">
      <b-button v-if="isProfile && pictures.length > 1" variant="danger" @click="deletePicture(pictures[slide])">X</b-button>
    </p>
  </div>
</template>

<script>
import User from '@/services/User'
export default {
  name: 'Carousel',
  props: ['pictures', 'isProfile'],
  data () {
    return {
      slide: 0,
      sliding: null,
      current: ''
    }
  },
  methods: {
    onSlideStart (slide) {
      this.sliding = true
    },
    onSlideEnd (slide) {
      this.sliding = false
    },
    deletePicture (pic) {
      User.deletePicture({ 'filename': pic })
        .then(success => { this.$emit('deletePicture') })
        .catch(() => {})
    },
    getPath (path) { return 'http://localhost:8081/assets/' + path }
  }
}
</script>
<style>
.carousel-caption {
    height: 60px;
    right: 0;
    top: -15px;
    left: 65px;
    text-align: left;
}
.max-height-600 {
  max-height: 600px;
}
</style>
