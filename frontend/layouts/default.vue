<template>
  <v-app>
    <v-alert
      v-if="$store.state.alert.visible"
      :type="$store.state.alert.type"
      dismissible
      top
      right
      class="position-fixed"
    >
      {{ $store.state.alert.message }}
    </v-alert>
    <v-container
      class="fill-height d-flex justify-center align-center"
    >
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>

<style scoped>
.position-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
}
</style>
