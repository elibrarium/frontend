<template>
  <b-navbar class="" toggleable="md" type="dark" variant="dark">
    <b-container>
      <b-navbar-toggle v-if="user" target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand :to="{ name: user ? 'dashboard' : 'landing' }" href="#">
        <img
          :src="brand"
          alt="OMS"
          class="d-0inline-block align-top brand-logo"
        />
        {{ appName | capitilize }}
      </b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav v-if="user">
          <b-nav-item :to="{ name: 'dashboard' }">{{
            $t('dashboard')
          }}</b-nav-item>
          <b-nav-item :to="{ name: 'orders' }">{{ $t('orders') }}</b-nav-item>
          <b-nav-item :to="{ name: 'customers' }">{{
            $t('customers')
          }}</b-nav-item>
          <template v-if="user.is_admin">
            <b-nav-item :to="{ name: 'managers' }">{{
              $t('managers')
            }}</b-nav-item>
            <b-nav-item :to="{ name: 'search' }">{{ $t('search') }}</b-nav-item>
          </template>
          <!--
          <b-nav-item :to="{ name: 'playground' }">Playground</b-nav-item>
          -->
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="user" right>
            <template slot="button-content">
              {{ user.first_name || user.username }}
              <template v-if="user.is_admin"
                >(Admin)</template
              >
            </template>
            <b-dropdown-item :to="{ name: 'change.password' }" v-if="!user.is_admin">
              <fa icon="key" fixed-width /> {{ $t('change_password') }}
            </b-dropdown-item>
            <b-dropdown-item href="#" @click.prevent="logout">
              <fa icon="sign-out-alt" fixed-width /> {{ $t('logout') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item
            v-else-if="$route.name !== 'login'"
            :to="{ name: 'login' }"
          >
            {{ $t('login') }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import brandImage from '@/assets/brand.png';

import { mapGetters } from 'vuex';
import LocaleDropdown from './LocaleDropdown';

export default {
  components: {
    LocaleDropdown,
  },
  data: () => ({
    appName: window.config.appName,
    brand: brandImage,
  }),
  computed: mapGetters({
    user: 'auth/user',
  }),
  methods: {
    async logout() {
      // Log out the user.
      await this.$store.dispatch('auth/logout');
      // Redirect to login.
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style lang="scss" scoped>
.brand-logo {
  width: 30px;
  height: auto;
  margin-right: 8px;
}
</style>
