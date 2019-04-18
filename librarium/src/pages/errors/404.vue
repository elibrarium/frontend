<template>
  <card class="text-center">
    <h3 class="mb-4">{{ $t('page_not_found') }}</h3>

    <div class="links">
      <template v-if="authenticated">
        <router-link :to="{ name: 'dashboard' }">{{ $t('go_dashboard') }}</router-link>
      </template>
      <template v-else>
        <router-link :to="{ name: 'login' }">{{ $t('login') }}</router-link>
      </template>
    </div>
  </card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NotFound',
  metaInfo() {
    return {
      title: this.$t('page_not_found'),
    };
  },
  data: () => ({
    title: window.config.appName,
  }),
  computed: mapGetters({
    authenticated: 'auth/check',
  }),
};
</script>
