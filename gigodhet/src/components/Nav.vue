<template>
  <div>
    <button @click='logOut'>Log out</button>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: "Nav",
    methods: {
      logOut() {
          firebase.auth().signOut();
        }
    }
  }
</script>