<template v-if="err !== null">
   <b-alert show variant="warning">{{err}}</b-alert>
</template>

<script>
export default {
  name: 'ErrorMessage',
  data () {
    return {
      err: null
    }
  }
}
</script>
