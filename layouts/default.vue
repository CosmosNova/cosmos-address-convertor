<template>
  <v-app>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>CosmosNova - {{ new Date().getFullYear() }}</span>
      <v-spacer />
      <a style="text-decoration: none; color: inherit;" href="https://github.com/CosmosNova/cosmos-address-convertor"
        target="_blank">
        <v-icon class="mr-3" large>
          mdi-github
        </v-icon>
      </a>
      <a style="text-decoration: none; color: inherit;" href="https://twitter.com/atmon3r" target="_blank">
        <v-icon class="mr-3" large>
          mdi-twitter
        </v-icon>
      </a>

    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
