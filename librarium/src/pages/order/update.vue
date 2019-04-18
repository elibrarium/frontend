<template>
  <content-area :title="$t('order_update_title')">
    <template slot="actions">
      <b-button-group class="float-right">
        <b-button id="back" variant="light" :to="backTo">
          <fa icon="arrow-left"></fa>
          <b class="d-none d-sm-inline">{{ $t('order_update_back') }}</b>
        </b-button>
      </b-button-group>
    </template>
    <template>
      <div>
        <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="customerInputGroup"
            :label="$t('order_update_customer_full_name')"
            label-for="customerInputGroup"
          >
            <b-form inline>
              <b-form-input
                id="customerInputName"
                class="col-sm"
                ref="customerInputName"
                type="text"
                v-model="form.customer_full_name"
                disabled
                :placeholder="$t('order_update_customer_full_name_placeholder')"
              />
            </b-form>
          </b-form-group>
          <b-form-group
            id="labelPhoneNumber"
            label-for="inputPhoneNumber"
            :label="$t('customer_create_phone_number')"
          >
            <b-form-input
              id="customerInputPhoneNumber"
              class="col-sm"
              ref="customerInputPhoneNumber"
              type="tel"
              v-model="form.customer_phone_number"
              disabled
              :placeholder="$t('order_update_phone_number_placeholder')"
              name="phone_number"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="customerInputGroup"
            :label="$t('order_update_address_lookup_title')"
            label-for="customerInputGroup"
          >
            <vue-bootstrap-typeahead
              :data="addresses"
              v-model="addressQuery"
              :placeholder="$t('order_update_address_enter_the_address')"
              :serializer="(item) => item.address_name"
              @hit="selectedAddress"
            >
            </vue-bootstrap-typeahead>
          </b-form-group>
          <b-form-group id="addressInputGroup"
                        label-for="addressInputGroup"
                        :label="$t('order_update_address')"
                        :invalid-feedback="errors.first('address')"
                        :state="errors.has('address') ? false : null">
            <b-form-textarea id="addressInput"
                             ref="addressInput"
                             type="text"
                             v-model="form.address"
                             :placeholder="$t('shipping_address')"
                             v-validate="'required'"
                             :data-vv-as="$t('order_update_address')"
                             :rows="3"
                             :max-rows="6"
                             name='address'
                             :state="errors.has('address') ? false : null">
            </b-form-textarea>
          </b-form-group>
          <b-form-group id="detailsInputGroup"
                        :label="$t('order_update_details')"
                        label-for="detailsInputGroup"
                        :invalid-feedback="errors.first('details')"
                        :state="errors.has('details') ? false : null">
            <b-form-textarea id="detailsInput"
                             ref="detailsInput"
                             type="text"
                             v-model="form.details"
                             :placeholder="$t('order_update_details_hint')"
                             v-validate="'required'"
                             :data-vv-as="$t('order_update_details')"
                             :rows="3"
                             :max-rows="6"
                             class="mr-sm-2"
                             name='details'
                             :state="errors.has('details') ? false : null">
            </b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">
            {{ $t('order_update_button_text') }}
          </b-button>
          <b-button type="reset" variant="danger">
            {{ $t('reset') }}
          </b-button>
        </b-form>
      </div>
    </template>
  </content-area>
</template>

<script>
import axios from 'axios';
import querystring from 'querystring';
import { _ } from 'vue-underscore';

const { host } = window.config;
const { kakaoAPIToken, kakaoAPIURL } = window.config;

export default {
  middleware: 'auth',
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    orderDetailUrl() {
      if (this.user.is_admin) {
        return `/api/order/${this.form.pk}/`;
      }
      return `/api/manager/order/${this.form.pk}/`;
    },
    orderUpdateUrl() {
      if (this.user.is_admin) {
        return `/api/order/update/${this.form.pk}/`;
      }
      return `/api/manager/order/update/${this.form.pk}/`;
    },
  },
  mounted() {
    axios
      .get(
        `${host}${this.orderDetailUrl}`,
      )
      .then((response) => {
        const data = response.data;
        this.form.customer_full_name = data.customer.full_name;
        this.form.customer_phone_number = data.customer.phone_number;
        this.form.details = data.details;
        this.form.address = data.address;
      })
      .catch((error) => {
        if (error.response.status === 404) {
          this.$router.push({ name: 'not-found' });
        } else {
          console.log(error);
        }
      });
  },
  data() {
    return {
      addresses: [],
      addressQuery: '',
      show: true,
      form: {
        pk: this.$route.params.id,
        customer: null,
        customer_full_name: '',
        customer_phone_number: '',
        details: '',
        address: '',
      },
      backTo: this.$route.params.back
        ? { name: this.$route.params.back }
        : { name: 'orders' },
    };
  },
  methods: {
    selectedAddress(address) {
      this.form.address = address.address_name;
      this.$refs.addressInput.focus();
    },
    onReset(event) {
      event.preventDefault();
      this.form.details = '';
      this.form.address = '';

      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onSubmit(event) {
      event.preventDefault();

      this.$validator.validate().then((valid) => {
        if (valid) {
          const endpoint = this.orderUpdateUrl;
          const url = `${host}${endpoint}`;

          delete this.form.pk;
          delete this.form.customer;
          delete this.form.customer_full_name;
          delete this.form.customer_phone_number;

          axios
            .put(
              url,
              this.form,
            )
            .then((response) => {
              console.log(response);
              this.$swal({
                type: 'success',
                title: this.$t('order_update_success_title'),
                text: this.$t('order_update_success_text'),
                showConfirmButton: true,
              }).then(() => {
                this.$router.push(this.backTo);
              });
            })
            .catch((error) => {
              if (error.response.status === 404) {
                this.$router.push({ name: 'not-found' });
              } else if (error.response.status === 400) {
                _.mapObject(error.response.data, (errorMessages, fieldName) => {
                  _.each(errorMessages, (message) => {
                    this.errors.add({
                      field: fieldName,
                      msg: message,
                    });
                  });
                });
              } else {
                console.log(error);
              }
            });
        }
      });
    },
  },
  watch: {
    addressQuery(q) {
      if (q.length >= 3) {
        console.log(q);
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
.action-btn {
  margin-right: 6px;
  margin-left: 6px;
}

#back {
  margin-top: 4px;
}
</style>
