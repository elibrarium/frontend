import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import i18n from '@/plugins/i18n';
import App from '@/App.vue';

import '@/registerServiceWorker';

import '@/plugins';
import '@/filters';
import '@/components';

Vue.config.productionTip = false;

new Vue({
  i18n,
  store,
  router,
  ...App,
}).$mount('#app');
