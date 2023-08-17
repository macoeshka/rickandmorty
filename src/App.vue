<template>
  <Suspense>
    <Index :page=1 />
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
</style>
