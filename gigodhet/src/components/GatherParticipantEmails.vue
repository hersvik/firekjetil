<template>
  <div class="container container_under_nav">


    <h1>
      Deltagerne sine epost-adresser
    </h1>
    <li class="list-group">
      <ul class="list-group-item"  style="white-space: pre;">{{ JSON.stringify(output, null, 4).replace(/"/g, '') }}
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
    created(){
      
    },
    name: "CountRegistreringer",
    props: [],
    data () {
      return {
        registrations: [],
      }
    },
    computed: {
      getters: () => getters,
      constants: () => constants,
      isSentralAdmin(){
        return this.getters.user().uid === this.constants.adminUid
      },
      output(){
        let activeRegs = this.registrations.filter(r => !r.removedBy);
        let result = [];
        for(let reg of activeRegs){
          let email = reg.primaryPerson.email;

          if(email == "sentral@gigodhet.web.app"){
            continue
          }

          if (!email)
            continue
          email = email.replace(/^\t/, '');
          result.push(email);
        }
        return result;
      },
    },
    firestore () {
      if(this.isSentralAdmin){
        return {
          registrations: db.collection("registrations"),
        };
      }
    },
    methods: {
    },
    watch: {
    }
  }
</script>

<style scoped>
  h1 {
    margin-top: 0.5em;
  }
  .dayTitle{
    margin: 1em 0 0.5em;
  }
  .edited_tag {
    opacity: 0.5;
  }
  .show_removed {
    font-size: 1rem;
    float: right;
    opacity: 0.3;
    cursor: pointer;
    line-height: 2em;
  }
  .faded_removed {
    opacity: 0.4;
  }
  .hasAgent{
    font-weight: bold;
  }
  .dot {
    height: 0.8em;
    width: 0.8em;
    background-color: rgb(148, 207, 252);
    border-radius: 50%;
    display: inline-block;
    margin: 0 0.2em;
  }
  .highlight_background_optimistic{
    background-color: #e4ffec;
    border: solid 1px #93d9a8;
  }
  .highlight_background_optimistic a{
    color: black;
  }
  .btn_green_outline {
    border: solid 1px #93d9a8;
    background-color: #cfffdd;
  }
  .btn_green_outline:hover {
    background-color: silver;
  }
</style>