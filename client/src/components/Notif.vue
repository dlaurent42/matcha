<template>
  <b-dropdown variant="link" size="lg" no-caret>
    <template slot="button-content">
      <font-awesome-icon icon="bell"/>
    </template>
    <b-dropdown-item>
      <b-row>
        <b-col>
          <img src="http://placehold.it/45x45" alt>
          <a href>Ahmet</a> liked your picture
          <b-button class="rounded-circle" variant="outline-secondary">
              <font-awesome-icon :icon="['fas', 'times']"/>
          </b-button>
        </b-col>
      </b-row>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBell } from '@fortawesome/free-solid-svg-icons'

library.add(faBell)

export default {
  name: 'Notif',
  data () {
    return {
      notifications: []
    }
  }
}
</script>
<style scoped>
.fa-bell {
  color:white;
}
.rounded-circle {
  font-size: 10px;
  padding: 0px;
  width: 17px;
}
</style>
