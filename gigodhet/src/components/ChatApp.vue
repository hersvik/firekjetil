<template>
  <div class="container container_under_nav">
    <h1>chat ... </h1>

    <li class="list-group">
      <ul>
        <input @keyup="save" v-model="heitest.text" class="form-control" placeholder="Cost (amount)" type="text" />
        <input @keyup="save" v-model="heitest2.text" class="form-control" placeholder="Name or Description" type="text" />
        <button @click="save">Save</button>
      </ul>
    </li>

  </div>
</template>

<script>
  import { db } from '../main';
  import {getters, setters, constants} from '../store';

  export default {
    beforeCreate() {
      setters.setActiveNav("pameldinger");
    },
    name: "ChatApp",
    data () {
      return {
        heitest: {},
        heitest2: {},
      };
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
    },
    firestore () {
      if (getters.user().uid) {
        return {
          heitest: db.collection("chats").doc("heitest"),
          heitest2: db.collection("chats").doc("heitest2")//.where("ownerUid", "==", getters.user().uid)
        };
      }
    },
    methods: {
      save () {
        const heitest= { ...this.heitest} // to exclude non-enumerable "id"-property
        const heitest2= { ...this.heitest2} // to exclude non-enumerable "id"-property

        // this.....ownerUid = getters.user().uid;

        db.collection("chats")
        .doc("heitest")
        .set(heitest, {merge: true})
        .then(() => {
        })
        .catch(function(error){ // trenger å verifiseres
          alert("Kunne ikke lagre. ("+error+")")
        });

        db.collection("chats")
        .doc("heitest2")
        .set(heitest2, {merge: true})
        .then(() => {
        })
        .catch(function(error){ // trenger å verifiseres
          alert("Kunne ikke lagre. ("+error+")")
        });


      },
    }
  }
</script>

<style scoped>
  .edited_tag {
    opacity: 0.5;
  }
  .float_right {
    float: right;
  }
</style>