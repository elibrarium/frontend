<template>
  <content-area :title="$t('manager_update_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button
        id="back"
        class="float-right"
        variant="light"
        :to="{ name: 'managers' }"
      >
        <fa icon="arrow-left"></fa>
        <b class="d-none d-sm-inline">{{ $t('manager_update_back') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-form @submit="onSubmit" v-if="show">
          <b-form-group id="labelUsername"
                        :label="$t('manager_update_username')"
                        label-for="inputUsername">
            <b-form-input id="inputUsername"
                          ref="inputUsername"
                          type="text"
                          v-model.trim="form.username"
                          :placeholder="$t('manager_update_username_placeholder')"
                          disabled
                          name="username">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelFirstName"
                        label-for="inputFirstName"
                        :label="$t('manager_update_first_name')"
                        :invalid-feedback="errors.first('first_name')"
                        :state="errors.has('first_name') ? false : null">
            <b-form-input id="inputFirstName"
                          ref="inputFirstName"
                          type="text"
                          v-model.trim="form.first_name"
                          :placeholder="$t('manager_update_first_name_placeholder')"
                          :data-vv-as="$t('manager_update_first_name')"
                          name="first_name"
                          :state="errors.has('first_name') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelLastName"
                        :label="$t('manager_update_last_name')"
                        label-for="inputLastName">
            <b-form-input id="inputLastName"
                          ref="inputLastName"
                          type="text"
                          v-model.trim="form.last_name"
                          :placeholder="$t('manager_update_last_name_placeholder')"
                          :data-vv-as="$t('manager_update_last_name')"
                          name="last_name">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelPhoneNumber"
                        :label="$t('manager_update_phone_number')"
                        label-for="inputPhoneNumber"
                        :invalid-feedback="errors.first('phone_number')"
                        :state="errors.has('phone_number') ? false : null">
            <b-form-input id="inputPhoneNumber"
                          ref="inputPhoneNumber"
                          type="tel"
                          v-model.trim="form.phone_number"
                          :placeholder="$t('manager_update_phone_number_hint')"
                          v-validate="'phone_number|unique_manager_phone_number'"
                          :data-vv-as="$t('manager_update_phone_number')"
                          name="phone_number"
                          :state="errors.has('phone_number') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelPassword"
                        :label="$t('manager_update_password')"
                        label-for="inputPassword"
                        :invalid-feedback="errors.first('password')"
                        :state="errors.has('password') ? false : null">
            <b-form-input id="inputPassword"
                          ref="inputPassword"
                          type="password"
                          v-model="form.password"
                          :placeholder="$t('manager_update_password_placeholder')"
                          v-validate="'min:8|confirmed:inputConfirmPassword'"
                          :data-vv-as="$t('manager_update_password')"
                          name="password"
                          :state="errors.has('password') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelConfirmPassword"
                        :label="$t('manager_update_confirm_password')"
                        label-for="inputConfirmPassword"
                        :invalid-feedback="errors.first('confirm_password')"
                        :state="errors.has('confirm_password') ? false : null">
            <b-form-input id="inputConfirmPassword"
                          ref="inputConfirmPassword"
                          type="password"
                          v-model="confirm_password"
                          :placeholder="$t('manager_update_confirm_password_placeholder')"
                          v-validate="'min:8|confirmed:inputPassword'"
                          :data-vv-as="$t('manager_update_confirm_password')"
                          name="confirm_password"
                          :state="errors.has('confirm_password') ? false : null">
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
  middleware: ['auth', 'admin'],
  data() {
    return {
      show: true,
      confirm_password: '',
      form: {
        pk: this.$route.params.id,
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      this.$validator.validate().then((valid) => {
        if (valid) {
          const url = `${host}${this.managerUpdateUrl}`;

          const data = {};
          Object.keys(this.form).forEach((key) => {
            const value = this.form[key];
            if (value !== '' && key !== 'pk' && key !== 'username') {
              data[key] = value;
            }
          });

          axios
            .patch(url, data)
            .then((response) => {
              console.log(response);
              this.$swal({
                type: 'success',
                title: this.$t('manager_update_success_title'),
                text: this.$t('manager_update_success_text'),
                showConfirmButton: true,
              }).then(() => {
                this.$router.push({ name: 'managers' });
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
  computed: {
    managerUpdateUrl() {
      return `/api/manager/update/${this.form.pk}/`;
    },
    managerRetrieveUrl() {
      return `/api/manager/update/${this.form.pk}/`;
    },
    managerUpdateCheckPhoneNumberUrl() {
      return `/api/managers/update/${this.form.pk}/check/phone_number/`;
    },
  },
  mounted() {
    axios
      .get(
        `${host}${this.managerRetrieveUrl}`,
      )
      .then((response) => {
        this.form.username = response.data.username;
        this.form.first_name = response.data.first_name;
        this.form.last_name = response.data.last_name;
        this.form.phone_number = response.data.phone_number;
      })
      .catch((error) => {
        console.log(error);
      });


    // --------------------------------------------------------
    // custom validator for customer phone number
    // --------------------------------------------------------
    const isManagerPhoneNumberUnique = (value) => {
      const url = `${host}${this.managerUpdateCheckPhoneNumberUrl}${value}`;

      return axios
        .get(url)
        .then((response) => {
          let data = { valid: true };
          if (response.data.exists) {
            data = {
              valid: false,
              data: {
                message: this.$t('manager_update_phone_number_exits'),
              },
            };
          }
          return data;
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            type: 'error',
            title: this.$t('manager_update_phone_number_validation_error'),
            text: this.$t('manager_update_phone_number_validation_error_text'),
            showConfirmButton: true,
          }).then(() => {
            this.$router.push({ name: 'managers' });
          });
        });
    };

    // --------------------------------------------------------
    // registring custom validator
    // --------------------------------------------------------
    Validator.extend('unique_manager_phone_number', {
      validate: isManagerPhoneNumberUnique,
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
