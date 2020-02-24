<template>
  <div class="nav__wrapper">
    {{loginName}}
    <button class="logout btn btn-default" @click='logOut'>Log out</button>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {getters} from '../store.js'

  export default {
    name: "Nav",
    methods: {
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

  .nav__wrapper {
    width: 100%;
    text-align: right;
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