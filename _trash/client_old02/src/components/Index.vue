<template>
  <div class="index">
    <h1>Message is: {{ message }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    message: String,
  },
}
</script>
