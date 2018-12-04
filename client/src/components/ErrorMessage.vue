<template v-if="err != ''">
   <b-alert show variant="warning">{{err}}</b-alert>
</template>

<script>
export default {
  name: 'ErrorMessage',
  data () {
    return {
      err: ''
    }
  }
}
</script>
