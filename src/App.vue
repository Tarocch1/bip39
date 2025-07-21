<template>
  <UApp>
    <GithubCorner />
    <RouterView :key="route.fullPath" />
  </UApp>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

import GithubCorner from '@/components/GithubCorner.vue'

const route = useRoute()
</script>
