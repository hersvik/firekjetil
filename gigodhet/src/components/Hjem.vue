<template>
  <div class="container container_under_nav">
    <h1>Godhet Stavanger</h1>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/--K_rM6p4IM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</template>

<script>
  import {setters} from '../store'
  export default {
    beforeCreate() {
      setters.setActiveNav("hjem");
    },
  }
</script>