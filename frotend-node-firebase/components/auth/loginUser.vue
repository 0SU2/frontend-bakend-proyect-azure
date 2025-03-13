<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title class="text-h5">
      Iniciar Sesion
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="user.usuario"
          label="Usuario"
          required
        />
        <v-text-field
          v-model="user.password"
          label="Password"
          required
          type="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="login">
        Ingresar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      user: {
        usuario: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$auth.loginWith('local', {
          data: this.user
        })
        this.$router.push('/principal')
      } catch (error) {
        console.log('@@@ error => ', error)
        const errorMessage = error.response?.data?.message || 'Ocurrio un error al tratar de ingresar'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    }
  }
}
</script>
