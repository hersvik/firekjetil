<template>
  <div v-if="user.uid" class="nav__wrapper">
    <a @click='goToListRegistreringer' :class='{active: activeNav == "pameldinger"}'>Påmeldinger</a>
    <a @click='goToListWishes' :class='{active: activeNav == "foresporsler"}'>Forespørsler</a>
    <div class="">{{loginName}}</div>
    <a class="" @click='logOut'>Log out</a>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {getters} from '../store.js'

  export default {
    name: "Nav",
    methods: {
      goToListRegistreringer() {
        this.$router.push("/");
      },
      goToListWishes() {
        this.$router.push("/wishes");
      },
      logOut() {
          firebase.auth().signOut();
      }
    },
    computed: {
      ...getters,
      loginName(){
        return this.user && this.user.displayName || "Mangler navn";
      }
    }
  }
</script>

<style scoped>
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