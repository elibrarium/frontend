import Vue from 'vue';

import Child from './Child';
import LoginForm from './LoginForm';
import ContentArea from './ContentArea';

[
  Child,
  LoginForm,
  ContentArea,
].forEach((Component) => {
  Vue.component(Component.name, Component);
});

