<template>
  <Suspense>
    <Index/>
  </Suspense>
</template>

<script setup lang="ts">
import Index from './components/Index.vue'

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body,
html,
#app {
  height: 100%;
}

html {
  overflow-y: hidden;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  margin: 0 5px;
}
a {
  color: #42b983;
  cursor: pointer;
}

.d-flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.scroll-y {
  overflow-y: scroll;
}

.m-5 {
  margin: 5px;
}
</style>
