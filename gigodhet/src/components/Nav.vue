<template>
  <div v-if="user.uid" class="nav__wrapper">
    <a @click='goToListRegistreringer'>Påmeldinger</a>
    <a @click='goToListWishes'>Forespørsler</a>
    <div class="">{{loginName}}</div>
    <a class="logout" @click='logOut'>Log out</a>
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
    width: 100%;
    text-align: right;
  }
  .nav__wrapper * {
    display: inline;
    margin: 1em;
  }
  .nav__wrapper .logout {
    /* position: absolute;
    right: 0; */

    /* float: right; */

    /* color: red;
    background-color: red;
    width: 100%; */
  }
</style>