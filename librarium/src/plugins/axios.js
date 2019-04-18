import Vue from 'vue';

import axios from 'axios';

import store from '@/store';
import router from '@/router';

import i18n from './i18n';

// Request interceptor
axios.interceptors.request.use((request) => {
  // if (error.config.hasOwnProperty('external') && error.config.external === true) {
  //   return request;
  // }

  const localRequest = request;
  const token = store.getters['auth/token'];

  if (token) {
    localRequest.headers.common.Authorization = `Token ${token}`;
  }

  const locale = store.getters['lang/locale'];
  if (locale) {
    localRequest.headers.common['Accept-Language'] = locale;
  }

  return request;
});

// Response interceptor
axios.interceptors.response.use(response => response, (error) => {
  const { status } = error.response;

  // eslint-disable-next-line
  if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
    return Promise.reject(error);
  }

  if (status >= 500) {
    Vue.swal({
      type: 'error',
      title: i18n.t('error_alert_title'),
      text: i18n.t('error_alert_text'),
      reverseButtons: true,
      confirmButtonText: i18n.t('ok'),
      cancelButtonText: i18n.t('cancel'),
    });
  }

  if (status === 401 && store.getters['auth/check']) {
    Vue.swal({
      type: 'warning',
      title: i18n.t('token_expired_alert_title'),
      text: i18n.t('token_expired_alert_text'),
      reverseButtons: true,
      confirmButtonText: i18n.t('ok'),
      cancelButtonText: i18n.t('cancel'),
    }).then(() => {
      store.commit('auth/LOGOUT');
      router.push({ name: 'login' });
    });
  }

  return Promise.reject(error);
});
