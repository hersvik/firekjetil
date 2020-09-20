<template>
  <div v-if="$route.path !== '/auth'" class="nav__wrapper">
    <span v-if="$route.path !== '/spendings' && $route.path !== '/cycle'">
      <span class="header_banner">
        Godhetstavanger.no
      </span>
      <a @click='goToHjem' :class='{active: getters.activeNav() == "hjem"}'>
        Hjem
      </a>
      <a @click='goToListRegistreringer' :class='{active: getters.activeNav() == "pameldinger"}'>
        Påmeldinger</a>
      <a @click='goToListWishes' :class='{active: getters.activeNav() == "foresporsler"}'>
        Foreslå oppdrag
      </a>
    </span>
    <div v-if="getters.user().uid" class="">{{loginName}}</div>
    <a v-if="getters.user().uid" @click='logOut'>Log out</a>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {getters} from '../store.js'

  export default {
    name: "Nav",
    methods: {
      goToHjem() {
        this.$router.push("/");
      },
      goToListRegistreringer() {
        this.$router.push("/regs");
      },
      goToListWishes() {
        this.$router.push("/wishes");
      },
      logOut() {
          firebase.auth().signOut();
      }
    },
    computed: {
      getters(){
        return getters;
      },
      loginName(){
        return getters.user() && getters.user().displayName || "Mangler navn";
      }
    }
  }
</script>

<style scoped>
  .header_banner {
    margin-right: 1em;
  }
  .nav__wrapper .active {
    border: solid 1px #007bff
  }
  a:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  a {
    cursor: pointer;
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
  }
  .nav__wrapper {
    position: absolute;
    right: 0;
    top: 0;
    width: 80%;
    text-align: right;
  }
  .nav__wrapper * {
    display: inline-block;
    padding: 0.5em;
  }
</style>