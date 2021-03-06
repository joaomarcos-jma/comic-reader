import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  target: 'server',
  head: {
    title: 'Comic Reader',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  // router: {
  //   scrollBehavior(to) {
  //     if (to.hash) {
  //       return window.scrollTo({ top: document.querySelector(to.hash).offsetTop + window.innerHeight, behavior: 'smooth' });
  //     }
  //     return window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '~/plugins/localStorage.js',
      ssr: false
    },
    '~/plugins/mask.js',
    '~/plugins/method.js',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
  ],
  axios: {
    proxy: true
  },
  // leitor.net
  proxy: {
    '/api/': {
      target: "https://mangalivre.net",
      pathRewrite: {
        '^/api/': ''
      },
      changeOrigin: true
    },
    '/scan/': {
      target: "https://mangalivre.net/leitor/pages/",
      pathRewrite: {
        '^/scan/': ''
      },
      changeOrigin: true
    },
    '/all/': {
      target: "https://mangalivre.net/series/",
      pathRewrite: {
        '^/all/': ''
      },
      changeOrigin: true
    },
    '/home/': {
      target: "https://mangalivre.net/home/",
      pathRewrite: {
        '^/home/': ''
      },
      changeOrigin: true
    },
    '/search': {
      target: "https://mangalivre.net/lib/search/series.json",
      pathRewrite: {
        '^/search': ''
      },
      changeOrigin: true
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    icons: {
      iconfont: 'fa',
    },
    theme: {
      dark: true,
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
    }
  },
  pwa: {
    icon: {
      iconSrc: './static/icon.png'
    },
    manifest: {
      name: 'Comic Reader',
      short_name: 'Comic Reader',
      lang: 'en',
      display: 'standalone',
    },
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [
      "epic-spinners"
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
