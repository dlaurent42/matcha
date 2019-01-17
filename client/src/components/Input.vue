<template>
  <b-form-group
      v-bind:id="idgroup"
      v-bind:label="label"
      v-bind:label-for="id"
      v-bind:description="description"
    >
      <b-form-input
        v-bind:id="id"
        v-bind:type="type"
        v-model="input"
        required
        v-bind:placeholder="placeholder"
        v-bind:class="{'bg-danger': Boolean(isVerified)}"
      ></b-form-input>
    </b-form-group>
</template>
<script>
export default {
  name: 'Input',
  props: ['name', 'type', 'label', 'description', 'input', 'verification'],
  data () {
    return {
      id: 'ID',
      idgroup: 'GroupID',
      placeholder: 'Enter ',
      isVerified: false
    }
  },
  mounted () {
    this.id = name + 'ID'
    this.idgroup = name + 'GroupID'
    this.placeholder = 'Enter ' + name
  },
  methods: {
    onChange () {
      if (this.verification(this.input)) this.isVerified = true
    }
  }
}
</script>
<style scoped>

</style>
