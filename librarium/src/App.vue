<template>
  <div id="app">
    <loading ref="loading"/>

    <transition name="page" mode="out-in">
      <component v-if="layout" :is="layout"/>
    </transition>
  </div>
</template>

<script>
import Loading from '@/components/Loading';

// Load layout components dynamically.
const requireContext = require.context('@/layouts', false, /.*\.vue$/);
const layouts = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)],
  )
  .reduce((components, [name, component]) => {
    const componentsObj = components;
    componentsObj[name] = component.default || component;
    return componentsObj;
  }, {});

export default {
  el: '#app',
  components: {
    Loading,
  },
  data: () => ({
    layout: null,
    defaultLayout: 'default',
  }),
  metaInfo() {
    const { appName } = window.config;
    return {
      title: appName,
      titleTemplate: `%s · ${appName}`,
    };
  },
  mounted() {
    this.$loading = this.$refs.loading;
  },
  methods: {
    /**
     * Set the application layout.
     *
     * @param {String} layout
     */
    setLayout(layout) {
      let layoutObj = layout;
      if (!layoutObj || !layouts[layoutObj]) {
        layoutObj = this.defaultLayout;
      }
      this.layout = layouts[layoutObj];
    },
  },
};
</script>
