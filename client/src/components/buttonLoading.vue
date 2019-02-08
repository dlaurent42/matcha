<template>
  <b-button v-if="loadingState === 'false'" v-on:click="up" variant="dark">{{ message }}</b-button>
  <b-button v-else-if="loadingState === 'complete'" variant="success">Update complete</b-button>
  <b-button v-else-if="loadingState === 'error'" variant="danger">An error has occured, try again later</b-button>
  <b-button v-else variant="dark"><font-awesome-icon icon="spinner" size="1x" pulse/> Updating...</b-button>
</template>
<script>
export default {
  name: 'buttonLoading',
  props: {
    'loadingState': {
      type: [Boolean, String]
    },
    'message': {
      type: String,
      default: 'Update'
    }
  },
  mounted () {
    console.log(this.loadingState === 'false')
  },
  methods: {
    up () {
      this.$emit('update')
    }
  }
}
</script>
