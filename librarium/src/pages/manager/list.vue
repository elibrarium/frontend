<template>
  <content-area :title="$t('manager_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button
        id="create"
        class="float-right"
        variant="light"
        :to="{ name: 'manager.create' }"
      >
        <fa icon="user-plus"></fa>
        <b class="d-none d-sm-inline">{{ $t('add_new_manager') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-table
          hover
          responsive
          stacked="sm"
          :api-url="managersApiUrl"
          :per-page="managersPerPage"
          :current-page="currentPage"
          :filter="managersFilter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items="managers"
          :fields="fields"
          empty-text="$t('nothing_to_show')"
        >
          <template slot="is_active" slot-scope="data">
            <p-check
              class="p-switch p-fill"
              color="success"
              :checked="data.value"
              @change="managerStatusChanged(data.item)"
              :disabled="user.username === data.item.username"
            >
              {{ data.value ? $t('manager_enabled') : $t('manager_disabled') }}
            </p-check>
          </template>

          <template slot="actions" slot-scope="row">
            <b-button-group size="sm">
              <b-button
                variant="light"
                v-b-tooltip.hover
                @click.stop="row.toggleDetails"
                :title="$t('get_info_about_manager')"
              >
                <fa class="action-btn" icon="info"></fa>
              </b-button>
              <b-button
                variant="light"
                v-b-tooltip.hover
                :title="$t('edit_manager_info')"
                :to="{ name: 'manager.update', params: { id: row.item.id } }"
              >
                <fa class="action-btn" icon="pen"></fa>
              </b-button>
            </b-button-group>
          </template>

          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('manager_details_manager_id') }}:</b>
                </b-col>
                <b-col> {{ row.item.id }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('full_name') }}:</b>
                </b-col>
                <b-col>
                  {{ row.item.last_name }} {{ row.item.first_name }}
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('manager_details_username') }}:</b>
                </b-col>
                <b-col> {{ row.item.username }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('manager_details_phone_number') }}:</b>
                </b-col>
                <b-col> {{ row.item.phone_number }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('manager_details_date_joined') }}:</b>
                </b-col>
                <b-col> {{ row.item.date_joined | toLocaleDateTime }} </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col class="text-sm-right" sm="3">
                  <b>{{ $t('status') }}:</b>
                </b-col>
                <b-col>
                  {{
                    row.item.is_active
                      ? $t('manager_enabled')
                      : $t('manager_disabled')
                  }}
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
          :total-rows="totalManagers"
          :per-page="managersPerPage"
          v-model="currentPage"
        >
        </b-pagination>
      </b-col>
    </b-row>
  </content-area>
</template>

<script>
import axios from 'axios';

export default {
  middleware: ['auth', 'admin'],
  data() {
    return {
      totalManagers: null,
      managersFilter: null,
      sortBy: null,
      sortDesc: null,
      managersPerPage: window.config.pagination.items_per_page,
      currentPage: 1,
      managersApiUrl: '/api/managers/',
      fields: {
        phone_number: {
          label: this.$t('manager_phone_number'),
        },
        full_name: {
          label: this.$t('full_name'),
          formatter: (value, key, item) =>
            `${item.last_name} ${item.first_name}`,
        },
        username: {
          label: this.$t('manager_username'),
        },
        is_active: {
          label: this.$t('status'),
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
    managerStatusChanged(item) {
      const { host } = window.config;
      const endpoint = `/api/manager/${item.id}/activate/`;
      const url = `${host}${endpoint}`;

      axios
        .put(url, {
          is_active: !item.is_active,
        })
        .then((response) => {
          // eslint-disable-next-line
          item.is_active = response.data.is_active;
          let message;
          if (item.is_active) {
            message = this.$t('manager_enabled_message', {
              username: `${response.data.username}`,
            });
          } else {
            message = this.$t('manager_disabled_message', {
              username: `${response.data.username}`,
            });
          }
          this.$swal({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,

            type: 'success',
            title: this.$t('manager_status_change_title'),
            text: message,
          });
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            type: 'error',
            title: this.$t('error_alert_title'),
            text: this.$t('error_alert_text'),
          });
        });
    },
    managers(ctx, callback) {
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
          this.totalManagers = response.data.count;
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
  },
  metaInfo() {
    return {
      title: this.$t('manager_page_title'),
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
