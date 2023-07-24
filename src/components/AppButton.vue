<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<style>
.btn {
  @apply bg-slate-900 hover:bg-slate-700 text-white;

  @apply
    focus:outline-none
    focus:ring-2
    focus:ring-slate-400
    focus:ring-offset-2
    focus:ring-offset-slate-50;

  @apply
    h-10
    px-6
    rounded
    w-full
    flex
    items-center
    justify-center
    sm:w-auto;
}
</style>
