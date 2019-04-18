<template>
  <content-area :title="$t('customer_update_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button id="back" class="float-right" variant="light" :to="{ name: 'customers' }">
        <fa icon="arrow-left"></fa>
        <b class="d-none d-sm-inline">{{ $t('customer_update_back') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-form @submit="onSubmit" v-if="show">
          <b-form-group id="labelFullName"
                        label-for="inputFullName"
                        :label="$t('full_name')"
                        :invalid-feedback="errors.first('full_name')"
                        :state="errors.has('full_name') ? false : null">
            <b-form-input id="inputFullName"
                          ref="inputFullName"
                          type="text"
                          v-model="form.full_name"
                          :placeholder="$t('customer_update_full_name_placeholder')"
                          v-validate="'required'"
                          :data-vv-as="$t('full_name')"
                          name="full_name"
                          :state="errors.has('full_name') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelPhoneNumber"
                        label-for="inputPhoneNumber"
                        :label="$t('customer_update_phone_number')"
                        :invalid-feedback="errors.first('phone_number')"
                        :state="errors.has('phone_number') ? false : null">
            <b-form-input id="inputPhoneNumber"
                          ref="inputPhoneNumber"
                          type="tel"
                          v-model="form.phone_number"
                          :placeholder="$t('customer_update_phone_number_placeholder')"
                          v-validate="'required|phone_number|unique_customer_phone_number'"
                          :data-vv-as="$t('customer_update_phone_number')"
                          name="phone_number"
                          :state="errors.has('phone_number') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-button :disabled="errors.count() > 0"
                    type="submit"
                    variant="primary">
            {{ $t('update') }}
          </b-button>
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
      form: {
        pk: this.$route.params.id,
        full_name: '',
        phone_number: '',
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      this.$validator.validate().then((valid) => {
        if (valid) {
          const endpoint = this.customerUpdateUrl;
          const url = `${host}${endpoint}`;

          delete this.form.pk;

          axios
            .put(
              url,
              this.form,
            )
            .then((response) => {
              console.log(response);
              this.$swal({
                type: 'success',
                title: this.$t('customer_update_success_title'),
                text: this.$t('customer_update_success_text'),
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
  },
  mounted() {
    axios
      .get(
        `${host}${this.customerDetailUrl}`,
      )
      .then((response) => {
        this.form.full_name = response.data.full_name;
        this.form.phone_number = response.data.phone_number;
      })
      .catch((error) => {
        console.log(error);
      });

    // custom validator for customer phone number
    const isUnique = (value) => {
      const endpoint = this.checkPhoneNumberUrl;
      const url = `${host}${endpoint}${value}`;

      return axios
        .get(url)
        .then((response) => {
          let data = { valid: true };
          if (response.data.exists) {
            data = {
              valid: false,
              data: {
                message: this.$t('customer_update_phone_number_exits'),
              },
            };
          }
          return data;
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            type: 'error',
            title: this.$t('customer_update_phone_number_validation_error'),
            text: this.$t('customer_update_phone_number_validation_error_text'),
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
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    customerUpdateUrl() {
      if (this.user.is_admin) {
        return `/api/customers/update/${this.form.pk}/`;
      }
      return `/api/manager/customers/update/${this.form.pk}/`;
    },
    checkPhoneNumberUrl() {
      if (this.user.is_admin) {
        return `/api/customers/update/check/${this.form.pk}/`;
      }
      return `/api/manager/customers/update/check/${this.form.pk}/`;
    },
    customerDetailUrl() {
      if (this.user.is_admin) {
        return `/api/customer/${this.form.pk}/`;
      }
      return `/api/manager/customer/${this.form.pk}/`;
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
    margin-top:4px;
  }
</style>
