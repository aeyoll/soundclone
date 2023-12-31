import './assets/main.css';

import axios from 'axios';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueAxios from 'vue-axios';

// eslint-disable-next-line import/extensions
import App from './App.vue';
import router from './router';

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
};

const instance = axios.create({
  headers,
  baseURL: import.meta.env.VITE_API_URL,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
// @ts-ignore
app.use(VueAxios, instance);
app.provide('axios', app.config.globalProperties.axios);

app.mount('#app');
