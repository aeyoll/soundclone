<script setup lang="ts">
const props = defineProps({
  size: { type: String, default: '' },
});
</script>

<template>
  <button class="btn" type="button" :class="{ 'btn-sm': props.size === 'sm', 'btn-xs': props.size === 'xs' }">
    <slot />
  </button>
</template>

<style>
.btn {
  @apply bg-slate-800 hover:bg-slate-700 text-white;

  @apply focus:outline-none
    focus:ring-2
    focus:ring-slate-400
    focus:ring-offset-2
    focus:ring-offset-slate-50;

  @apply h-10
    px-6
    rounded
    w-full
    flex
    items-center
    justify-center
    sm:w-auto;
}

.btn-sm {
  @apply text-xs
    h-8
    px-4;
}

.btn-xs {
  @apply text-xs
    h-6
    px-2;
}
</style>
