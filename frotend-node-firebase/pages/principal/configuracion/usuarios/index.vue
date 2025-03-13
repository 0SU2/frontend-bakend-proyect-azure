<template>
  <v-app>
    <v-container>
      <h1 class="text-4 mb-4">
        Gestion De Usuarios
      </h1>
      <!--Renglon con el boton crear nuevo usuario-->
      <v-row align="center" justfiy="end">
        <v-btn color="primary" @click="openDialog('create')">
          <v-icon left>
            mdi-account-plus
          </v-icon>
          Crear Usuario
        </v-btn>
      </v-row>
      <!-- Tabla de los usuarios-->
      <v-data-table
        :headers="headers"
        :items="usuarios"
        :items-per-page="10"
        dense
        class="mt-4"
      >
        <template #[`item.actions`] = "{item}">
          <!-- Editar -->
          <v-icon small color="primary" title="Editar" @click="openDialog('edit', item)">
            mdi-pencil
          </v-icon>
          <!-- Borrar -->
          <v-icon small color="red" title="Borrar" @click="openDialog('delete', item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-container>

  <!-- Dialogo para crear o editar un usuario -->
   <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card color="indigo lighten-5">
      <v-card-title>
        <span class="text-h6">
          {{ dialogMode === 'create' ? 'Crear Usuario' : 'Editar Usuario' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Columna para la direccion -->
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="userData.nombre"
                label="Nombre"
                required
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="userData.apaterno"
                label="A. Paterno"
                required
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="userData.amaterno"
                label="A. Materno"
                required
              />
            </v-col>
          </v-row>

          <!-- Columna para la direccion -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="userData.direccion"
                label="Direccion"
                required
              />
            </v-col>
          </v-row>

          <!-- Columna para la datos generales -->
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="userData.telefono"
                label="Telefono"
                required
              />
            </v-col>
            <v-col cols="4">
              <v-select
                :items="estados"
                v-model="userData.estado"
                label="Estado"
                @change="changeEstate()"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                :items="municipios"
                v-model="userData.ciudad"
                label="Ciudad"
              />
            </v-col>
          </v-row>

          <!-- Columna para la datos perfil de usuario -->
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="userData.usuario"
                label="Usuario"
                required
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="userData.password"
                label="Password"
                type="password"
                required
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="userData.rol"
                :items="roles"
                required
                label="rol"
              />
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="closeDialog">
          Cancelar
        </v-btn>
        <v-btn :disabled="!valid" @click="saveUser">
          {{ dialogMode === 'create' ? 'Crear' : 'Actualizar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
   </v-dialog>

   <!-- Dialigo para eliminar un usuario -->
   <v-dialog v-model="deleteDialog" persistent max-width="700px">
    <v-card color="indigo lighten-5">
      Confirmacion de Eliminacion
    </v-card>
    <v-card-text>
      <template v-if="selectedUser">
        ¿Estas seguro que deseas eliminar al usuario?
        <strong>{{  selectedUser.nombre }}</strong>
      </template>
      <template v-else>
        Cargando Datos del Usuario...
      </template>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn text @click="closeConfirm">
        Cancelar
      </v-btn>
      <v-spacer/>
      <v-btn text color="red" :disable="!selectedUser" @click="deleteUser">
        Eliminar
      </v-btn>
    </v-card-actions>
   </v-dialog>

  </v-app>
</template>

<script>
import { Estate } from '~/static/EntryDataState.js'
export default {
  layout: 'principal',
  middleware: ['auth'],
  data () {
    return {
      estados: [],
      municipios: [],
      usuarios: [],
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'A. Paterno', value: 'apaterno' },
        { text: 'A. Materno', value: 'amaterno' },
        { text: 'Usuario', value: 'usuario' },
        { text: 'Rol', value: 'rol' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      roles: ['admin', 'contabilidad', 'recursos', 'secretaria'],
      valid: false,
      dialog: false,
      deletedialog: false,
      confirmDialog: false,
      dialogMode: 'create', // create - edit
      userData: {
        nombre: '',
        apaterno: '',
        amaterno: '',
        direccion: '',
        telefono: '',
        ciudad: '',
        estado: '',
        usuario: '',
        password: '',
        rol: 'contabilidad'
      },
      selectedUser: null
    }
  },
  mounted () { // Funciones que se ejecutaran primero al momento de que obtengamos la pagina
    this.fetchUsers()
  },
  methods: {
    changeEstate () {
      Estate.options.forEach((dataDoc) => {
        if (dataDoc.label === this.userData.estado) {
          this.municipios = []
          dataDoc.value.forEach((cityDoc, index) => {
            this.municipios[index] = cityDoc
          })
        }
      })
    },
    async fetchUsers () {
      try {
        const response = await this.$axios.get('/users')
        this.usuarios = response.data
      } catch (error) {
        const errorMessage = error.message || 'Error al cargar los usuarios'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    openDialog (mode, user = null) {
      this.dialogMode = mode
      if (mode === 'edit' && user) {
        this.dialog = true
        this.userData.password = ''
        this.userData = { ...user }
        // TO - DO
        // Please, fix this...
        Estate.options.forEach((dataDoc, index) => {
          this.estados[index] = dataDoc.label
          if (dataDoc.label === this.userData.estado) {
            this.municipios = []
            dataDoc.value.forEach((cityDoc, index) => {
              this.municipios[index] = cityDoc
            })
          }
        })
        // I mean, wtf brah.
      } else if (mode === 'create') {
        this.dialog = true
        this.userData = {
          nombre: '',
          apaterno: '',
          amaterno: '',
          direccion: '',
          telefono: '',
          ciudad: '',
          estado: '',
          usuario: '',
          password: '',
          rol: 'contabilidad'
        }
        // TO - DO
        // Please, fix this...
        Estate.options.forEach((dataDoc, index) => {
          this.estados[index] = dataDoc.label
          if (dataDoc.label === this.userData.estado) {
            this.municipios = []
            dataDoc.value.forEach((cityDoc, index) => {
              this.municipios[index] = cityDoc
            })
          }
        })
        // I mean, wtf brah.
      } else if (mode === 'delete') { // borrar
        this.selectedUser = user
        this.deleteDialog = true
        this.confirmDialog = true
        console.log('delete')
      }
    },
    closeConfirm () {
      this.selectedUser = null
      this.confirmDialog = false
    },
    closeDialog () {
      this.municipios = []
      this.dialog = false
    },
    saveUser () {
      if (this.dialogMode === 'create') {
        this.createUser()
      } else {
        this.updateUser()
      }
    },
    async createUser () {
      try {
        await this.$axios.post('/users/create', this.userData)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Usuario creado con exito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al crear el usuario'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async updateUser () {
      try {
        await this.$axios.put(`/users/update/${this.userData.id}`, this.userData)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Usuario actualizado con exito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al actualizar el usuario'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async deleteUser () {
      try {
        await this.$axios.delete(`/users/delete/${this.selectedUser.id}`)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'Usuario actualizado con exito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al actualizar el usuario'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
