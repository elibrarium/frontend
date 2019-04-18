<template>
  <div>
    <template v-if="user.is_admin">
      <admin-order-list></admin-order-list>
    </template>
    <template v-else>
      <manager-order-list></manager-order-list>
    </template>
  </div>
</template>

<script>

export default {
  middleware: 'auth',
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
  },
  metaInfo() {
    return {
      title: this.$t('order_page_title'),
    };
  },
};
</script>
