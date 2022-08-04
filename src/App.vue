<template>
  <div id="app">
    <router-view v-if="layout === 'Main-Layout'"></router-view>
    <component :is="layout" v-else></component>
  </div>
</template>

<script>
import app from "./app";

export default app;
</script>


