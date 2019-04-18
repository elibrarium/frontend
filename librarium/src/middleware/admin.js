import store from '@/store';

export default (to, from, next) => {
  if (store.getters['auth/user'].is_admin !== true) {
    next({ name: 'landing' });
  } else {
    next();
  }
};
