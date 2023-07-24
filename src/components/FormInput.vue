<script setup lang="ts">
defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <label class="block">
    <span class="text-slate-700">{{ label }}</span>
    <input
      type="text"
      class="mt-1 block w-full rounded border-slate-200"
      placeholder=""
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  </label>
</template>
