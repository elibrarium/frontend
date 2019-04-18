import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Load store modules dynamically.
const requireContext = require.context('./modules', false, /.*\.js$/);

const modules = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)],
  )
  .reduce((argModules, [name, argModule]) => {
    const module = argModule;
    if (module.namespaced === undefined) {
      module.namespaced = true;
    }

    return { ...argModules, [name]: module };
  }, {});

export default new Vuex.Store({
  modules,
});
