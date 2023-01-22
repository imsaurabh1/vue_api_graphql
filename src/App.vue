<template>
  <div id="app">
    <Versions />
  </div>
</template>

<script>
import Versions from './components/Versions.vue'

export default {
  name: 'App',
  components: {
    Versions
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
