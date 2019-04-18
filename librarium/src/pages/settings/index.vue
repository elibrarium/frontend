<template>
  <content-area :title="$t('settings_page_title')">
    <b-row>
      <b-col cols="3">
        <b-nav vertical pills>
          <b-nav-item
            v-for="tab in tabs"
            :key="tab.route"
            :to="{ name: tab.route }"
            active-class="active">
            <fa :icon="tab.icon" fixed-width/>
            {{ tab.name }}
          </b-nav-item>
        </b-nav>
      </b-col>
      <b-col>
        <child></child>
      </b-col>
    </b-row>
  </content-area>
</template>

<script>
export default {
  middleware: 'auth',
  computed: {
    tabs() {
      return [
        {
          icon: 'user',
          name: this.$t('profile'),
          route: 'settings.profile',
        }, {
          icon: 'lock',
          name: this.$t('password'),
          route: 'settings.password',
        },
      ];
    },
  },
};
</script>
