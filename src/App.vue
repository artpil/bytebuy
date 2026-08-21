<template>
  <div class="app">
    <VHeader />
    <router-view />
    <VFooter />
  </div>

</template>

<style>

</style>
<script setup lang="ts">

import VFooter from "@/components/layout/v-footer/VFooter.vue";
import VHeader from "@/components/layout/v-header/VHeader.vue";

</script>
