<script setup lang="ts">
import {
  onMounted, PropType, ref, watch,
} from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { useSoundcloneStore } from '@/stores/soundclone';
import type { PlaylistSerializer, SongSerializer, VersionSerializer } from '@/types/core';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.round(seconds) % 60;
  const paddedSeconds = `0${secondsRemainder}`.slice(-2);
  return `${minutes}:${paddedSeconds}`;
};

const store = useSoundcloneStore();

// Props
const props = defineProps({
  index: { type: Number, required: true },
  song: { type: Object as PropType<SongSerializer|VersionSerializer>, required: true },
  playlist: { type: Object as PropType<PlaylistSerializer>, required: false, default: null },
});

// Emit
const emit = defineEmits([
  'isPlaying',
  'songFinished',
]);

// Refs
const waveform = ref<HTMLElement|null>(null);
const hover = ref<HTMLElement|null>(null);

// Data
const wavesurfer = ref<WaveSurfer>();
const isPlaying = ref(false);
const time = ref(formatTime(0));
const duration = ref(formatTime(0));

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Define the waveform gradient
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
gradient.addColorStop(0, '#656666'); // Top color
gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Top color
gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Bottom color
gradient.addColorStop(1, '#B1B1B1'); // Bottom color

// Define the progress gradient
const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
progressGradient.addColorStop(0, '#EE772F'); // Top color
progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Top color
progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // White line
progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // White line
progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094'); // Bottom color
progressGradient.addColorStop(1, '#F6B094'); // Bottom color

const play = () => {
  wavesurfer.value?.play();
  isPlaying.value = true;
  emit('isPlaying', true);

  store.setCurrentIndex(props.index as number);
};

const pause = () => {
  wavesurfer.value?.pause();
  isPlaying.value = false;
  emit('isPlaying', false);
};

const stop = () => {
  wavesurfer.value?.stop();
  isPlaying.value = false;
  emit('isPlaying', false);
};

const createWavesurfer = () => {
  time.value = formatTime(0);
  wavesurfer.value = WaveSurfer.create({
    container: waveform.value as string,
    waveColor: gradient,
    progressColor: progressGradient,
    barWidth: 2,
    normalize: true,
    url: props.song?.file as String,
    peaks: props.song?.waveform?.data,
  });

  // Hover effect
  waveform.value?.addEventListener('pointermove', (e) => {
    if ('style' in hover.value) {
      hover.value.style.width = `${e.offsetX}px`;
    }
  });

  wavesurfer.value?.on('decode', (decodedDuration: number) => {
    duration.value = formatTime(decodedDuration);
  });

  wavesurfer.value?.on('timeupdate', (currentTime: number) => {
    time.value = formatTime(currentTime);
  });

  wavesurfer.value?.on('finish', () => {
    // Trigger the "songFinished" event
    emit('songFinished');

    // If the player is not from a playlist, we can safely go to the next
    // song from the feed
    if (!props.playlist) {
      store.goToNextSong();
    }
  });
};

const destroyWavesurfer = () => {
  wavesurfer.value?.destroy();
};

onMounted(() => {
  createWavesurfer();
});

// Regenerate the wavesurfer when the song changes
watch(() => props.song, () => {
  destroyWavesurfer();
  createWavesurfer();
  if (isPlaying.value) {
    wavesurfer.value?.play();
  }
});

watch(() => store.currentIndex, (newIndex: number) => {
  if (newIndex !== props.index) {
    stop();
  } else if (!isPlaying.value && newIndex > 0) {
    play();
  }
});
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="w-16">
      <button type="button" v-if="isPlaying" @click="pause()" class="btn">Pause</button>
      <button type="button" v-if="!isPlaying" @click="play()" class="btn">Play</button>
    </div>
    <div class="w-full pr-2">
      <div ref="waveform" class="waveform">
        <div class="time left-0">{{ time }}</div>
        <div class="time right-0">{{ duration }}</div>
        <div class="hover" ref="hover" />
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
