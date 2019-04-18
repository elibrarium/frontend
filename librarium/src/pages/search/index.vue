<template>
  <content-area id="search">
    <b-row id="search">
      <div class="mx-auto sm-auto" style="width: 800px;">
        <h1 class="text-center">Search</h1>
        <b-form-group>
          <vue-bootstrap-typeahead
            id="searchInput"
            :data="suggestionResults"
            v-model="query"
            v-autofocus
            :serializer="(item) => item"
            :placeholder="$t('search_type_anything')"
            @hit="selectedSuggestionResult"
            @keydown.native="handleEnterKey"
          >
            <template slot="append">
              <button @click="sendSearchQuery" class="btn btn-primary">
                Search
              </button>
            </template>
          </vue-bootstrap-typeahead>
        </b-form-group>
      </div>
    </b-row>
    <b-row>
      <template>
        <div class="mx-auto sm-auto" style="width: 800px;">
          <p class="text-center" v-if="foundResultsCount > 0">
            {{ foundResultsCount }} results found with query "{{
              foundResultsQuery
            }}" ({{ foundResultsTook }} seconds)
          </p>
          <b-table
            fixed
            :items="searchUserResults"
            :fields="searchUserResultsFields"
            v-if="searchUserResults.length > 0"
          >
            <template slot="managerName" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.first_name }}&nbsp;{{ data.item.last_name }}
              </text-highlight>
            </template>
            <template slot="userPhoneNumber" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.phone_number }}
              </text-highlight>
            </template>
            <template slot="userDateJoined" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.date_joined | toLocaleDateTime }}
              </text-highlight>
            </template>
            <template slot="userActive" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{
                  data.item.is_active
                    ? $t('manager_enabled')
                    : $t('manager_disabled')
                }}
              </text-highlight>
            </template>
          </b-table>
          <b-table
            fixed
            :items="searchCustomerResults"
            :fields="searchCustomerResultsFields"
            v-if="searchCustomerResults.length > 0"
          >
            <template slot="customerFullName" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.full_name }}
              </text-highlight>
            </template>
            <template slot="customerPhoneNumber" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.phone_number }}
              </text-highlight>
            </template>
            <template slot="customerCreatedDateTime" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.created_datetime | toLocaleDateTime }}
              </text-highlight>
            </template>
            <template slot="customerCreator" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.creator__first_name }}&nbsp;{{
                  data.item.creator__last_name
                }}
              </text-highlight>
            </template>
          </b-table>
          <b-table
            fixed
            :items="searchOrderResults"
            :fields="searchOrderResultsFields"
            v-if="searchOrderResults.length > 0"
          >
            <template slot="orderDetails" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.details }}
              </text-highlight>
            </template>
            <template slot="orderAddress" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.address }}
              </text-highlight>
            </template>
            <template slot="orderCreatedDateTime" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.created_datetime | toLocaleDateTime }}
              </text-highlight>
            </template>
            <template slot="orderProcessed" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{
                  data.item.is_processed ? $t('order_sent') : $t('order_draft')
                }}
              </text-highlight>
            </template>
            <template slot="orderCustomer" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.customer__full_name }}
              </text-highlight>
            </template>
            <template slot="orderManager" slot-scope="data">
              <text-highlight :queries="query" :caseSensitive="false">
                {{ data.item.creator__first_name }}&nbsp;{{
                  data.item.creator__last_name
                }}
              </text-highlight>
            </template>
          </b-table>
        </div>
      </template>
    </b-row>
  </content-area>
</template>

<script>
import axios from 'axios';
import _ from 'underscore';

const { host } = window.config;
const globalSuggestionEndpoint = '/api/suggestions/';
const globalSearchEndpoint = '/api/search/';
const globalSuggestionURL = `${host}${globalSuggestionEndpoint}`;
const globalSearchURL = `${host}${globalSearchEndpoint}`;

export default {
  middleware: 'auth',
  data() {
    return {
      result: '',
      query: '',
      suggestionResults: [],
      searchUserResults: [],
      searchUserResultsFields: {
        managerName: {
          label: 'Manager name',
          key: 'managerName',
        },
        userPhoneNumber: {
          label: 'Phone number',
          key: 'userPhoneNumber',
        },
        userDateJoined: {
          label: 'Date joined',
          key: 'userDateJoined',
        },
        userActive: {
          label: 'Enabled',
          key: 'userActive',
        },
      },
      searchCustomerResults: [],
      searchCustomerResultsFields: {
        customerFullName: {
          label: 'Customer name',
          key: 'customerFullName',
        },
        customerPhoneNumber: {
          label: 'Phone Number',
          key: 'customerPhoneNumber',
        },
        customerCreatedDateTime: {
          label: 'Created',
          key: 'customerCreatedDateTime',
        },
        customerCreator: {
          label: 'Manager',
          key: 'customerCreator',
        },
      },
      searchOrderResults: [],
      searchOrderResultsFields: {
        orderDetails: {
          label: 'Order details',
          key: 'orderDetails',
        },
        orderAddress: {
          label: 'Address',
          key: 'orderAddress',
        },
        orderCreatedDateTime: {
          label: 'Created',
          key: 'orderCreatedDateTime',
        },
        orderProcessed: {
          label: 'Status',
          key: 'orderProcessed',
        },
        orderCustomer: {
          label: 'Customer',
          key: 'orderCustomer',
        },
        orderManager: {
          label: 'Manager',
          key: 'orderManager',
        },
      },
      foundResultsCount: 0,
    };
  },
  methods: {
    sendSearchQuery() {
      const url = `${globalSearchURL}?q=${this.query}`;
      axios.get(url).then((res) => {
        this.searchUserResults = res.data.items.filter(
          item => item.type === 'user',
        );
        this.searchCustomerResults = res.data.items.filter(
          item => item.type === 'customer',
        );
        this.searchOrderResults = res.data.items.filter(
          item => item.type === 'order',
        );
        this.foundResultsCount = res.data.count;
        this.foundResultsQuery = this.query;
        this.foundResultsTook = res.data.took;
      });
    },
    selectedSuggestionResult(item) {
      this.query = item;
      this.sendSearchQuery();
    },
    handleEnterKey(event) {
      if (event.key === 'Enter') {
        this.suggestionResults = [];
        this.sendSearchQuery();
      }
    },
    async sendSuggestionQuery(q) {
      const url = `${globalSuggestionURL}?q=${q}`;
      axios.get(url).then((res) => {
        this.suggestionResults = res.data.items;
      });
    },
  },
  watch: {
    // eslint-disable-next-line
    query: _.debounce(function(q) {
      this.sendSuggestionQuery(q);
    }, 200),
  },
};
</script>
<style lang="scss" scoped>
div.row#search {
  padding-top: 140px;
}
.brand-logo {
  width: 30px;
  height: auto;
  margin-right: 8px;
}
a,
a:visited {
  text-decoration: none;
  color: black;
}
a:hover {
  text-decoration: none;
  background: black;
  color: white;
}
.highlightText {
  background: yellow;
}
</style>
