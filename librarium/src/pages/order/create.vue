<template>
  <content-area :title="$t('order_create_title')">
    <template slot="actions">
      <b-button-group class="float-right">
        <b-button
          class="m2"
          variant="light"
          :to="{ name: 'customer.create', params: { back: 'order.create' } }"
        >
          <fa icon="user-plus"></fa>
          <b class="d-none d-sm-inline">
            {{ $t('order_create_redirect_to_customer_create_page') }}
          </b>
        </b-button>
        <b-button id="back" variant="light" :to="backTo">
          <fa icon="arrow-left"></fa>
          <b class="d-none d-sm-inline">{{ $t('order_create_back') }}</b>
        </b-button>
      </b-button-group>
    </template>
    <template>
      <div>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="customerInputGroup"
            :label="$t('order_create_customer_lookup')"
            label-for="customerInputGroup"
          >
            <vue-bootstrap-typeahead
              :data="customers"
              v-model="query"
              :placeholder="$t('order_create_lookup_input_placeholder')"
              v-autofocus
              :serializer="(item) => item.dump"
              @hit="selectedCustomer"
            >
            </vue-bootstrap-typeahead>
          </b-form-group>
          <b-form-group
            id="customerInputGroup"
            :label="$t('order_create_customer_full_name')"
            label-for="customerInputGroup"
            v-if="showCustomerName"
          >
            <b-form inline>
              <b-form-input
                id="customerInputName"
                class="col-sm"
                ref="customerInputName"
                type="text"
                v-model="form.customer_full_name"
                disabled
                :placeholder="$t('order_create_customer_full_name_placeholder')"
              />
            </b-form>
          </b-form-group>
          <b-form-group
            id="labelPhoneNumber"
            label-for="inputPhoneNumber"
            :label="$t('customer_create_phone_number')"
            v-if="showCustomerName"
          >
            <b-form-input
              id="customerInputPhoneNumber"
              class="col-sm"
              ref="customerInputPhoneNumber"
              type="tel"
              v-model="form.customer_phone_number"
              disabled
              :placeholder="$t('order_create_phone_number_placeholder')"
              name="phone_number"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="customerInputGroup"
            :label="$t('order_create_address_lookup_title')"
            label-for="customerInputGroup"
          >
            <vue-bootstrap-typeahead
              :data="addresses"
              v-model="addressQuery"
              :placeholder="$t('order_create_address_enter_the_address')"
              :serializer="(item) => item.address_name"
              @hit="selectedAddress"
            >
            </vue-bootstrap-typeahead>
          </b-form-group>
          <b-form-group
            id="addressInputGroup"
            :label="$t('order_create_address')"
            label-for="addressInputGroup"
          >
            <b-form-textarea
              id="addressInput"
              ref="addressInput"
              type="text"
              v-model="form.address"
              :rows="3"
              :max-rows="6"
              required
              :placeholder="$t('shipping_address')"
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            id="detailsInputGroup"
            :label="$t('order_create_details')"
            label-for="detailsInputGroup"
          >
            <b-form-textarea
              id="detailsInput"
              class="mr-sm-2"
              ref="detailsInput"
              type="text"
              v-model="form.details"
              :rows="3"
              :max-rows="6"
              required
              :placeholder="$t('order_create_details_hint')"
            />
          </b-form-group>
          <b-button type="submit" variant="primary">{{
            $t('order_create_button_text')
          }}</b-button>
          <b-button type="reset" variant="danger">{{ $t('reset') }}</b-button>
        </b-form>
      </div>
    </template>
  </content-area>
</template>

<script>
import axios from 'axios';
import querystring from 'querystring';

const { host } = window.config;
const { kakaoAPIToken, kakaoAPIURL } = window.config;
const customerSearchEndpoint = '/api/manager/customers/search/';
const customerSearchURL = `${host}${customerSearchEndpoint}`;
const createOrderEndpoint = '/api/manager/orders/new/';
const createOrderURL = `${host}${createOrderEndpoint}`;

export default {
  middleware: 'auth',
  data() {
    return {
      result: '',
      query: '',
      customers: [],
      canCreateCustomer: false,
      addresses: [],
      addressQuery: '',
      form: {
        customer: null,
        customer_full_name: '',
        customer_phone_number: '',
        details: '',
        address: '',
      },
      show: true,
      showCustomerName: false,
      showCustomerPhoneNumber: false,
      backTo: this.$route.params.back
        ? { name: this.$route.params.back }
        : { name: 'orders' },
    };
  },
  methods: {
    selectedCustomer(customer) {
      this.form.customer = customer.id;
      this.form.customer_full_name = customer.full_name;
      this.form.customer_phone_number = customer.phone_number;
      this.getLastOrderAddressOfCustomer(customer.id);
      this.$refs.detailsInput.focus();
      this.showCustomerName = true;
      this.showCustomerPhoneNumber = true;
      this.canCreateCustomer = true;
    },
    getLastOrderAddressOfCustomer(customerId) {
      const endpoint = `/api/manager/customers/${customerId}/orders/last/address/`;
      const url = `${host}${endpoint}`;
      axios.get(url).then((res) => {
        if (res.data !== undefined && res.data.address !== undefined) {
          this.form.address = res.data.address;
        }
      });
    },
    selectedAddress(address) {
      this.form.address = address.address_name;
      this.$refs.addressInput.focus();
    },
    onSubmit(event) {
      event.preventDefault();
      if (!this.canCreateCustomer) {
        this.$swal({
          type: 'error',
          title: this.$t('order_create_no_customer_chosen_error_title'),
          text: this.$t('order_create_no_customer_chosen_error_text'),
          showConfirmButton: true,
        });
      } else {
        delete this.form.customer_full_name;
        delete this.form.customer_phone_number;

        axios
          .post(createOrderURL, this.form)
          // eslint-disable-next-line
          .then((response) => {
            if (response.status === 201) {
              this.$swal({
                type: 'success',
                title: this.$t('order_create_success_title'),
                text: this.$t('order_create_success_text'),
                showConfirmButton: true,
              }).then(() => {
                this.$router.push({ name: 'orders' });
              });
            } else {
              this.$swal({
                type: 'error',
                title: this.$t('order_create_error_title'),
                text: this.$t('order_create_error_text'),
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
              }).then(() => {
                this.$router.push({ name: 'orders' });
              });
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
      }
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.customer = null;
      this.form.customer_full_name = '';
      this.form.customer_phone_number = '';
      this.form.details = '';
      this.form.address = '';
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
  watch: {
    query(q) {
      const url = `${customerSearchURL}?q=${q}`;
      axios.get(url).then((res) => {
        this.customers = res.data.items;
      });
    },
    addressQuery(q) {
      if (q.length >= 3) {
        fetch(kakaoAPIURL, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: kakaoAPIToken,
          },
          body: querystring.stringify({ query: q }),
        })
          // eslint-disable-next-line
          .then((resp) => resp.json())
          .then((data) => {
            this.addresses = data.documents;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#back {
  margin-left: 6px;
}
</style>
