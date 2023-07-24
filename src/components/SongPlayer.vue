<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import type { SongSerializer } from '@/types/core';
import WaveSurfer from 'wavesurfer.js';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secondsRemainder = Math.round(seconds) % 60
  const paddedSeconds = `0${secondsRemainder}`.slice(-2)
  return `${minutes}:${paddedSeconds}`
};

// Props
const props = defineProps({
  song: { type: Object as PropType<SongSerializer>, required: true }
});

// Refs
const waveform = ref(null);
const hover = ref(null);

// Data
const wavesurfer = ref<WaveSurfer>();
const isPlaying = ref(false);
const time = ref(formatTime(0));
const duration = ref(formatTime(0));

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// Define the waveform gradient
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
gradient.addColorStop(0, '#656666') // Top color
gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
gradient.addColorStop(1, '#B1B1B1') // Bottom color

// Define the progress gradient
const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
progressGradient.addColorStop(0, '#EE772F') // Top color
progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
progressGradient.addColorStop(1, '#F6B094') // Bottom color

const play = () => {
  wavesurfer.value?.play();
  isPlaying.value = true;
}

const pause = () => {
  wavesurfer.value?.pause();
  isPlaying.value = false;
}

onMounted(() => {
  wavesurfer.value = WaveSurfer.create({
    container: waveform.value as string,
    waveColor: gradient,
    progressColor: progressGradient,
    barWidth: 2,
    normalize: true,
    url: props.song?.file as String,
    peaks: props.song?.waveform?.data,
  });

  // Play/pause on click
  wavesurfer.value?.on('interaction', () => {
    wavesurfer.value?.playPause()
    isPlaying.value = !isPlaying.value;
  });

  // Hover effect
  waveform.value.addEventListener('pointermove', (e) => (hover.value.style.width = `${e.offsetX}px`));

  wavesurfer.value?.on('decode', (decodedDuration) => duration.value = formatTime(decodedDuration));
  wavesurfer.value?.on('timeupdate', (currentTime) => time.value = formatTime(currentTime));
});
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="w-16">
      <button v-if="isPlaying" @click="pause()" class="btn">Pause</button>
      <button v-if="!isPlaying" @click="play()" class="btn">Play</button>
    </div>
    <div class="w-full">
      <div ref="waveform" class="waveform">
        <div class="time left-0">{{ time }}</div>
        <div class="time right-0">{{ duration }}</div>
        <div class="hover" ref="hover"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .waveform  {
    @apply cursor-pointer relative;
  }

  .waveform:hover .hover {
    @apply opacity-100;
  }

  .btn {
    @apply aspect-square rounded-full bg-slate-800 text-white p-2 h-16 w-16;
  }

  .time {
    @apply absolute z-20 top-1/2 mt-1 -translate-y-1/2;
    @apply p-1;
    @apply rounded;
    @apply bg-slate-800 text-white;
    @apply text-xs;
  }

  .hover {
    @apply absolute left-0 top-0 z-10 pointer-events-none h-full w-0 mix-blend-overlay;
    @apply opacity-0;
    background: rgba(255, 255, 255, 0.5);
  }
</style>
