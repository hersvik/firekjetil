<template>
  <div class="container container_under_nav">


    <h1>
      Antall påmeldte 
    </h1>
    * Middag onsdag er med i påmeldingen, men summeres ikke på denne visningen ennå. 
    <li class="list-group">
      <ul class="list-group-item"  style="white-space: pre;">{{ JSON.stringify(counts, null, 4) }}
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
      counts(){
        let activeRegs = this.registrations.filter(r => !r.removedBy);
        let result = {
          total_personer: 0,
          voksne: 0,
          barn: 0,
          mandag: {
            sum_dugnad:0,
            sum_middag:0,
            gluten_OG_laktosefri: 0,
            kun_glutenfri:0,
            kun_laktosefri:0,
            vanlig:0,
          },
          tirsdag: {
            sum_dugnad:0,
            sum_middag:0,
            gluten_OG_laktosefri: 0,
            kun_glutenfri:0,
            kun_laktosefri:0,
            vanlig:0,
          },
          onsdag_dugnad_inkl_barn: 0,
          torsdag_dugnad_inkl_barn: 0,
          fredag_dugnad_inkl_barn: 0,

        };
        for(let reg of activeRegs){
          result.total_personer++;
          result.voksne++;
          result.total_personer += reg.participants.length;
          result.voksne += reg.participants.filter(p => p.ageGroup === "adult").length;
          result.barn += reg.participants.filter(p => p.ageGroup === "child").length;

          result.mandag.sum_dugnad += reg.primaryPerson.willAttendDay[0] ? 1 : 0;
          result.mandag.sum_dugnad += reg.participants.filter(p => p.willAttendDay[0]).length;
          result.mandag.sum_middag += reg.primaryPerson.wantDinnerMonday ? 1 : 0;
          result.mandag.sum_middag += reg.participants.filter(p => p.wantDinnerMonday).length;
          result.mandag.gluten_OG_laktosefri += reg.primaryPerson.wantDinnerMonday 
                                              && reg.primaryPerson.glutenFree 
                                              && reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.mandag.gluten_OG_laktosefri += reg.participants.filter(p => p.wantDinnerMonday 
                                              && p.glutenFree 
                                              && p.lactoseFree).length;
          result.mandag.kun_glutenfri += reg.primaryPerson.wantDinnerMonday 
                                              && reg.primaryPerson.glutenFree 
                                              && !reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.mandag.kun_glutenfri += reg.participants.filter(p => p.wantDinnerMonday 
                                              && p.glutenFree 
                                              && !p.lactoseFree).length;
          result.mandag.kun_laktosefri += reg.primaryPerson.wantDinnerMonday 
                                              && !reg.primaryPerson.glutenFree 
                                              && reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.mandag.kun_laktosefri += reg.participants.filter(p => p.wantDinnerMonday 
                                              && !p.glutenFree 
                                              && p.lactoseFree).length;
          result.mandag.vanlig += reg.primaryPerson.wantDinnerMonday 
                                              && !reg.primaryPerson.glutenFree 
                                              && !reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.mandag.vanlig += reg.participants.filter(p => p.wantDinnerMonday 
                                              && !p.glutenFree 
                                              && !p.lactoseFree).length;

          result.tirsdag.sum_dugnad += reg.primaryPerson.willAttendDay[1] ? 1 : 0;
          result.tirsdag.sum_dugnad += reg.participants.filter(p => p.willAttendDay[1]).length;
          result.tirsdag.sum_middag += reg.primaryPerson.wantDinnerTuesday ? 1 : 0;
          result.tirsdag.sum_middag += reg.participants.filter(p => p.wantDinnerTuesday).length;
          result.tirsdag.gluten_OG_laktosefri += reg.primaryPerson.wantDinnerTuesday 
                                              && reg.primaryPerson.glutenFree 
                                              && reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.tirsdag.gluten_OG_laktosefri += reg.participants.filter(p => p.wantDinnerTuesday 
                                              && p.glutenFree 
                                              && p.lactoseFree).length;
          result.tirsdag.kun_glutenfri += reg.primaryPerson.wantDinnerTuesday 
                                              && reg.primaryPerson.glutenFree 
                                              && !reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.tirsdag.kun_glutenfri += reg.participants.filter(p => p.wantDinnerTuesday 
                                              && p.glutenFree 
                                              && !p.lactoseFree).length;
          result.tirsdag.kun_laktosefri += reg.primaryPerson.wantDinnerTuesday 
                                              && !reg.primaryPerson.glutenFree 
                                              && reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.tirsdag.kun_laktosefri += reg.participants.filter(p => p.wantDinnerTuesday 
                                              && !p.glutenFree 
                                              && p.lactoseFree).length;
          result.tirsdag.vanlig += reg.primaryPerson.wantDinnerTuesday 
                                              && !reg.primaryPerson.glutenFree 
                                              && !reg.primaryPerson.lactoseFree 
                                              ? 1 : 0;
          result.tirsdag.vanlig += reg.participants.filter(p => p.wantDinnerTuesday 
                                              && !p.glutenFree 
                                              && !p.lactoseFree).length;
                                              
          result.onsdag_dugnad_inkl_barn += reg.primaryPerson.willAttendDay[2] ? 1 : 0;
          result.onsdag_dugnad_inkl_barn += reg.participants.filter(p => p.willAttendDay[2]).length;

          result.torsdag_dugnad_inkl_barn += reg.primaryPerson.willAttendDay[3] ? 1 : 0;
          result.torsdag_dugnad_inkl_barn += reg.participants.filter(p => p.willAttendDay[3]).length;

          result.fredag_dugnad_inkl_barn += reg.primaryPerson.willAttendDay[4] ? 1 : 0;
          result.fredag_dugnad_inkl_barn += reg.participants.filter(p => p.willAttendDay[4]).length;
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