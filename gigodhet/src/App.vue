<template>
  <div id=”app”>
    <div id="wrapper_all" :class="{wish_section: getters.activeNav()=='foresporsler'}">
      <Nav />
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import Nav from './components/Nav.vue'
  import { getters } from './store';

  export default {
    name: "app",
    components: {
      Nav: Nav
    },
    computed: {
      getters: () => getters,
    },
  }
</script>

<style>

  #wrapper_all.wish_section {
    border-left: solid 1em purple;
  }

  body a {
    cursor: pointer;
  }

  .container_under_nav {
    padding-top: 8em;
  }

  /* Disable horizontal scrolling on mobile (two css statemnts involving body)*/
  html, body {
    overflow-x: hidden;
  }
  body {
    position: relative;
  }

</style>