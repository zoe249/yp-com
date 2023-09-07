<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { initDynamicRoutes } from './router/index'
export default {
  data() {
    return {}
  },
  created() {
    initDynamicRoutes()
  },
  methods: {}
}
</script>

<style></style>
