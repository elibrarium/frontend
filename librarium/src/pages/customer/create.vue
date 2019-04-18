<template>
  <content-area :title="$t('customer_create_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button id="back" class="float-right" variant="light" :to="backTo">
        <fa icon="arrow-left"></fa>
        <b class="d-none d-sm-inline">{{ $t('customer_create_back') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="labelFullName"
            label-for="inputFullName"
            :label="$t('full_name')"
            :invalid-feedback="errors.first('full_name')"
            :state="errors.has('full_name') ? false : null"
          >
            <b-form-input
              id="inputFullName"
              ref="inputFullName"
              type="text"
              v-model="form.full_name"
              v-autofocus
              :placeholder="$t('customer_create_full_name_placeholder')"
              v-validate="'required'"
              :data-vv-as="$t('full_name')"
              name="full_name"
              :state="errors.has('full_name') ? false : null"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="labelPhoneNumber"
            label-for="inputPhoneNumber"
            :label="$t('customer_create_phone_number')"
            :invalid-feedback="errors.first('phone_number')"
            :state="errors.has('phone_number') ? false : null"
          >
            <b-form-input
              id="inputPhoneNumber"
              ref="inputPhoneNumber"
              type="tel"
              v-model="form.phone_number"
              :placeholder="$t('customer_create_phone_number_placeholder')"
              v-validate="'phone_number|unique_customer_phone_number'"
              :data-vv-as="$t('customer_create_phone_number')"
              name="phone_number"
              :state="errors.has('phone_number') ? false : null"
            >
            </b-form-input>
          </b-form-group>
          <b-button
            :disabled="errors.count() > 0"
            type="submit"
            variant="primary"
          >
            {{ $t('submit') }}
          </b-button>
          <b-button type="reset" variant="danger">{{ $t('reset') }}</b-button>
        </b-form>
      </b-col>
    </b-row>
  </content-area>
</template>

<script>
import axios from 'axios';
import { _ } from 'vue-underscore';
import { Validator } from 'vee-validate';

const { host } = window.config;

export default {
  middleware: 'auth',
  data() {
    return {
      show: true,
      confirm_password: '',
      form: {
        full_name: '',
        phone_number: '',
      },
      backTo: this.$route.params.back
        ? { name: this.$route.params.back }
        : { name: 'customers' },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      this.$validator.validate().then((valid) => {
        if (valid) {
          const endpoint = '/api/manager/customers/new/';
          const url = `${host}${endpoint}`;

          axios
            .post(url, this.form)
            .then((response) => {
              console.log(response);
              this.$swal({
                type: 'success',
                title: this.$t('customer_create_success_title'),
                text: this.$t('customer_create_success_text'),
                showConfirmButton: true,
              }).then(() => {
                this.$router.push({ name: 'customers' });
              });
            })
            .catch((error) => {
              if (error.response.status === 400) {
                _.mapObject(error.response.data, (errorMessages, fieldName) => {
                  _.each(errorMessages, (message) => {
                    this.errors.add({
                      field: fieldName,
                      msg: message,
                    });
                  });
                });
              }
            });
        }
      });
    },
    onReset(event) {
      event.preventDefault();
      this.form.full_name = '';
      this.form.phone_number = '';

      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
  mounted() {
    // custom validator for customer phone number
    const isUnique = (value) => {
      const endpoint = `/api/manager/customers/check/${value}`;
      const url = `${host}${endpoint}`;

      return axios
        .get(url)
        .then((response) => {
          let data = { valid: true };
          if (response.data.exists) {
            data = {
              valid: false,
              data: {
                message: this.$t('customer_create_phone_number_exits'),
              },
            };
          }
          return data;
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            type: 'error',
            title: this.$t('customer_create_phone_number_validation_error'),
            text: this.$t('customer_create_phone_number_validation_error_text'),
            showConfirmButton: true,
          }).then(() => {
            this.$router.push({ name: 'customers' });
          });
        });
    };

    // registring custom validator
    Validator.extend('unique_customer_phone_number', {
      validate: isUnique,
      getMessage: (field, params, data) => data.message,
    });
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
