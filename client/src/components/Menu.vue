<template>
  <div v-if="err !== '' && err !== 'undefined'" id="alert-box">
    {{ err }}
  </div>
</template>

<script>
export default {
  name: 'header',
  data () {}
}
</script>
