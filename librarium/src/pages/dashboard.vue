<template>
  <content-area :title="$t('dashboard')">
    <b-row>
      <b-col>
        <b-card title="Orders" id="orders-stat-card">
          <h3>Total: {{ totalOrders }}</h3>
          <h4>Draft: {{ unprocessedOrders }}</h4>
          <h4>Sent: {{ processedOrders }}</h4>
          <h4>Unconfirmed: {{ unconfirmedOrders }}</h4>
          <h4>Confirmed: {{ confirmedOrders }}</h4>
        </b-card>
      </b-col>
      <b-col>
        <b-card title="Customers" id="customers-stat-card">
          <h3>Total: {{ totalCustomers }}</h3>
        </b-card>
      </b-col>
      <b-col v-if="isAdmin">
        <b-card title="Managers" id="managers-stat-card">
          <h3>Total: {{ totalManagers }}</h3>
          <h3>Active: {{ activeManagers }}</h3>
        </b-card>
      </b-col>
    </b-row>
  </content-area>
</template>

<script>
import axios from 'axios';

const { host } = window.config;
const endpoint = '/api/stats/';
const url = `${host}${endpoint}`;

export default {
  middleware: 'auth',
  metaInfo() {
    return {
      title: this.$t('dashboard'),
    };
  },
  methods: {},
  data() {
    return {
      totalOrders: 0,
      unprocessedOrders: 0,
      processedOrders: 0,
      unconfirmedOrders: 0,
      confirmedOrders: 0,
      totalCustomers: 0,
      totalManagers: 0,
      activeManagers: 0,
      disabledManagers: 0,
    };
  },
  async mounted() {
    axios.get(url).then((response) => {
      this.totalOrders = response.data.orders.total;
      this.unprocessedOrders = response.data.orders.unprocessed;
      this.processedOrders = response.data.orders.processed;
      this.unconfirmedOrders = response.data.orders.unconfirmed;
      this.confirmedOrders = response.data.orders.confirmed;
      this.totalCustomers = response.data.customers.total;
      if (this.isAdmin) {
        this.totalManagers = response.data.managers.total;
        this.activeManagers = response.data.managers.active;
      }
    });
  },
  computed: {
    isAdmin() {
      const user = this.$store.getters['auth/user'];
      return user && user.is_admin;
    },
  },
};
</script>

<style lang="scss" scoped>
.fix-b-pagination {
  margin-bottom: 0 !important;
}

.row {
  margin-bottom: 20px;
}

#orders-stat-card,
#customers-stat-card,
#managers-stat-card {
  min-height: 450px;
}
</style>
