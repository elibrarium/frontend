<template>
  <content-area :title="$t('customer_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button
        id="create"
        class="float-right"
        variant="light"
        :to="{ name: 'customer.create' }"
      >
        <fa icon="user-plus"></fa>
        <b class="d-none d-sm-inline">{{ $t('add_new_customer') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-table
          hover
          responsive
          stacked="sm"
          :api-url="customersApiUrl"
          :per-page="customersPerPage"
          :current-page="currentPage"
          :filter="customersFilter"
          :fields="fields"
          :items="customers"
          empty-text="$t('nothing_to_show')"
        >
          <template slot="modified_datetime" slot-scope="data">
            {{ data.value | toLocaleDateTime }}
          </template>

          <template slot="actions" slot-scope="row">
            <b-button-group size="sm">
              <b-button
                variant="light"
                v-b-tooltip.hover
                @click.stop="row.toggleDetails"
                :title="$t('get_info_about_customer')"
              >
                <fa class="action-btn" icon="info"></fa>
              </b-button>
              <b-button
                variant="light"
                v-b-tooltip.hover
                :title="$t('edit_customer_info')"
                :to="{ name: 'customer.update', params: { id: row.item.id }}"
              >
                <fa class="action-btn" icon="pen"></fa>
              </b-button>
            </b-button-group>
          </template>

          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('customer_details_customer_id') }}:</b>
                </b-col>
                <b-col> {{ row.item.id }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('full_name') }}:</b>
                </b-col>
                <b-col> {{ row.item.full_name }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('customer_details_phone_number') }}:</b>
                </b-col>
                <b-col> {{ row.item.phone_number }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('customer_details_orders_count') }}:</b>
                </b-col>
                <b-col> {{ row.item.orders_count }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('customer_details_created_date') }}:</b>
                </b-col>
                <b-col>
                  {{ row.item.created_datetime | toLocaleDateTime }}
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('customer_details_modified_date') }}:</b>
                </b-col>
                <b-col>
                  {{ row.item.modified_datetime | toLocaleDateTime }}
                </b-col>
              </b-row>
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination
          align="center"
          :total-rows="totalCustomers"
          :per-page="customersPerPage"
          v-model="currentPage"
        >
        </b-pagination>
      </b-col>
    </b-row>
  </content-area>
</template>

<script>
import axios from 'axios';

const adminEndpoint = '/api/customers/';
const userEndpoint = '/api/manager/customers/';

export default {
  middleware: 'auth',
  data() {
    return {
      totalCustomers: null,
      customersFilter: null,
      customersPerPage: window.config.pagination.items_per_page,
      currentPage: 1,
      fields: {
        phone_number: {
          label: this.$t('phone_number'),
          thStyle: {
            width: '200!important',
          },
        },
        full_name: {
          label: this.$t('full_name'),
          thStyle: {
            width: '600!important',
          },
        },
        orders_count: {
          label: this.$t('customer_order_count'),
        },
        modified_datetime: {
          label: this.$t('customer_modified_date'),
          thStyle: {
            width: '600!important',
          },
        },
        actions: {
          label: this.$t('actions'),
          thStyle: {
            width: '40!important',
          },
        },
      },
    };
  },
  methods: {
    // editHandler(item) {
    editHandler(item) {
      console.log(item);
      this.$swal({
        type: 'error',
        title: 'Oops...',
        text: 'Not implemented yet!',
      });
    },
    customers(ctx, callback) {
      const { host } = window.config;
      const endpoint = ctx.apiUrl;
      const offset = (ctx.currentPage - 1) * ctx.perPage;

      let url = `${host}${endpoint}`;

      let args = `?limit=${ctx.perPage}`;
      if (offset !== 0) {
        args = `${args}&offset=${offset}`;
      }
      url = `${url}${args}`;

      axios
        .get(url)
        .then((response) => {
          this.totalCustomers = response.data.count;
          callback(response.data.results);
        })
        .catch(() => {
          callback([]);
        });

      return null;
    },
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    customersApiUrl() {
      return this.user.is_admin ? adminEndpoint : userEndpoint;
    },
  },
  metaInfo() {
    return {
      title: this.$t('customer_page_title'),
    };
  },
};
</script>

<style lang="scss" scoped>
.action-btn {
  margin-right: 6px;
  margin-left: 6px;
}

#create {
  margin-top: 4px;
}
</style>
