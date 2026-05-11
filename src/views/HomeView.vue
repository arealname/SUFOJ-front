<script lang="ts" setup >
import NavView from '@/components/NavView.vue'
import { useRoute } from 'vue-router'
  const route=useRoute()
</script>

<template>
  <NavView></NavView>
  <div class="common-layout">

    <RouterView :key="route.path">

    </RouterView>
    </div>
</template>
