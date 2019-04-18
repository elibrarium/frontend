import Vue from 'vue';

import store from '@/store';


Vue.filter(
  'toLocaleDateTime',
  (value) => {
    const date = new Date(value);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return date.toLocaleDateString(
      store.getters['lang/locale'],
      options,
    );
  },
);
