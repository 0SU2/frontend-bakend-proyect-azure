<template>
  <v-app>
    <v-navigation-drawer
      permanent
      app
      color="#F8FAFC"
    >
      <v-list dense>
        <template v-for="(item, index) in items">
          <v-list-item
            v-if="!item.children && canAccess(item.roles)"
            :key="`item-${index}`"
            link
            @click="goTo(item.path)"
          >
            <v-list-item-icon>
              <v-icon color="blue">
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group
            v-else-if="canAccess(item.roles)"
            :key="`group-${index}`"
            no-action
            prepend-icon="mdi-tools"
            append-icon="mdi-cheron-down"
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, cIndex) in item.children"
              :key="`child-${index}-${cIndex}`"
              link
              @click="goTo(child.path)"
            >
              <v-list-item-icon>
                <v-icon color="blue darkeen-3">
                  {{ child.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
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
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  middleware: ['auth'],
  data () {
    return {
      items: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          path: '/principal',
          roles: ['admin', 'contabilidad']
        },
        {
          title: 'Configuración',
          icon: 'mdi-tools',
          roles: ['admin'],
          children: [
            {
              title: 'Usuarios',
              icon: 'mdi-account-multiple',
              path: '/principal/configuracion/usuarios'
            },
            {
              title: 'Desbloquear Usuarios',
              icon: 'mdi-account-lock-open',
              path: '/principal/configuracion/desbloquear'
            }
          ]
        },
        {
          title: 'Cerrar Sesión',
          icon: 'mdi-logout',
          path: '/',
          roles: ['admin', 'coordinador', 'recursos']
        }
      ]
    }
  },
  methods: {
    goTo (route) {
      if (route === '/') {
        this.logout()
      } else {
        this.$router.push(route)
      }
    },
    canAccess (allowedRoles) {
      return allowedRoles.includes(this.$auth.user.rol)
    },
    async logout () {
      try {
        await this.$axios.post('/users/logout')
        window.location.href = '/'
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Ocurrio un error al cerrar sesion'
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
.position-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
}
</style>
