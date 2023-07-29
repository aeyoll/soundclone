<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-black">
      <div class="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <button type="button" @click.prevent="closeModal" class="absolute right-4 top-4 bg-transparent">x</button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  isOpen: { type: Boolean, required: true, default: false },
});

const emit = defineEmits(['update:isOpen']);

const closeModal = () => {
  emit('update:isOpen', false);
};
</script>

<style>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 3.3s ease;
}
.modal-fade-enter, .modal-fade-leave-to /* .modal-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
