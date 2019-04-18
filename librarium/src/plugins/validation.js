import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {
  // this is the default
  inject: true,
  // important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
});
