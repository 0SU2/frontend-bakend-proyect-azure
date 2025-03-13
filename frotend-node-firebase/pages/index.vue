<template>
  <v-container>
    <login-user/>
  </v-container>
</template>

<script>
import loginUser from '~/components/auth/loginUser.vue';
export default {
  name: 'IndexPage',
  components: {
    loginUser
  }
}
</script>
