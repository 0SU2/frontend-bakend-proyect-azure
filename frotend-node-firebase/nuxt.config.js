import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    titleTemplate: '%s - frotend-node-firebase',
    title: 'frotend-node-firebase',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  plugins: [
  ],
  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    baseURL: process.env.baseURL,
  },

  auth: {
    strategies: {
      local: {
        token:{
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
            property: 'user',
            autoFetch: true
        },
        endpoints: {
            login: { url: '/users/login', method: 'post' },
            logout: { url: '/users/logout', method: 'post' },
            user: { url: '/users/user', method: 'get' },
        }
      }
    },
    redirect: {
      login: '/',
      logout: '/',
      home: '/principal'
    }
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    icons: {
      iconFont: 'mdi'
    }
  },

  router: {
    middleware: ['auth']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
