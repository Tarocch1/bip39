<template>
  <div class="wrap">
    <h1 class="title">BIP39 Mnemonic Converter</h1>

    <Mnemonic />

    <USeparator type="dashed" />

    <div v-for="coin of coins" :key="coin.name" class="coin">
      <UBadge
        :label="coin.name"
        :icon="coin.icon"
        variant="subtle"
        :ui="{ base: 'mb-2' }"
      />
      <component :is="coin.component" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue'

import { ctxKey, type Ctx } from './type'
import Mnemonic from './components/Mnemonic/index.vue'
import { coins } from './components/Coins'

const ctx: Ctx = { seed: ref(null) }

provide(ctxKey, ctx)
</script>

<style scoped>
@reference '@/styles/index.css';

.wrap {
  @apply mx-auto;
  @apply px-4;
  @apply max-w-[1024px];

  .title {
    @apply my-4;
    @apply text-center text-xl;
  }

  .coin {
    @apply my-4;
  }
}
</style>
