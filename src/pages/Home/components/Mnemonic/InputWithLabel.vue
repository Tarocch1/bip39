<template>
  <div class="input-with-label">
    <span class="label">{{ props.label }}</span>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ label: string }>()
</script>

<style scoped>
@reference '@/styles/index.css';

.input-with-label {
  @apply flex gap-2;

  & > .label {
    @apply shrink-0 self-start;
    @apply w-22;
    @apply text-right text-sm leading-8 font-bold;

    & + * {
      @apply grow;
    }
  }
}
</style>
