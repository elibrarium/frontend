<template>
  <content-area :title="$t('manager_create_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button
        id="back"
        class="float-right"
        variant="light"
        :to="{ name: 'managers' }"
      >
        <fa icon="arrow-left"></fa>
        <b class="d-none d-sm-inline">{{ $t('manager_create_back') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="labelFirstName"
            label-for="inputFirstName"
            :label="$t('manager_create_first_name')"
            :invalid-feedback="errors.first('first_name')"
            :state="errors.has('first_name') ? false : null"
          >
            <b-form-input
              id="inputFirstName"
              ref="inputFirstName"
              type="text"
              v-model.trim="form.first_name"
              v-autofocus
              :placeholder="$t('manager_create_first_name_placeholder')"
              v-validate="'required'"
              :data-vv-as="$t('manager_create_first_name')"
              name="first_name"
              :state="errors.has('first_name') ? false : null"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="labelLastName"
            :label="$t('manager_create_last_name')"
            label-for="inputLastName"
          >
            <b-form-input
              id="inputLastName"
              ref="inputLastName"
              type="text"
              v-model.trim="form.last_name"
              :placeholder="$t('manager_create_last_name_placeholder')"
              :data-vv-as="$t('manager_create_last_name')"
              name="last_name"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="labelUsername"
            :label="$t('manager_create_username')"
            label-for="inputUsername"
            :invalid-feedback="errors.first('username')"
            :state="errors.has('username') ? false : null"
          >
            <b-form-input
              id="inputUsername"
              ref="inputUsername"
              type="text"
              v-model.trim="form.username"
              :placeholder="$t('manager_create_username_placeholder')"
              v-validate="'required|unique_manager_username'"
              :data-vv-as="$t('manager_create_username')"
              name="username"
              :state="errors.has('username') ? false : null"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="labelPhoneNumber"
            :label="$t('manager_create_phone_number')"
            label-for="inputPhoneNumber"
            :invalid-feedback="errors.first('phone_number')"
            :state="errors.has('phone_number') ? false : null"
          >
            <b-form-input
              id="inputPhoneNumber"
              ref="inputPhoneNumber"
              type="tel"
              v-model.trim="form.phone_number"
              :placeholder="$t('manager_create_phone_number_hint')"
              v-validate="'required|phone_number|unique_manager_phone_number'"
              :data-vv-as="$t('manager_create_phone_number')"
              name="phone_number"
              :state="errors.has('phone_number') ? false : null"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="labelPassword"
            :label="$t('manager_create_password')"
            label-for="inputPassword"
            :invalid-feedback="errors.first('password')"
            :state="errors.has('password') ? false : null"
          >
            <b-form-input
              id="inputPassword"
              ref="inputPassword"
              type="password"
              v-model="form.password"
              :placeholder="$t('manager_create_password_placeholder')"
              v-validate="'required|min:8|confirmed:inputConfirmPassword'"
              :data-vv-as="$t('manager_create_password')"
              name="password"
              :state="errors.has('password') ? false : null"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="labelConfirmPassword"
            :label="$t('manager_create_confirm_password')"
            label-for="inputConfirmPassword"
            :invalid-feedback="errors.first('confirm_password')"
            :state="errors.has('confirm_password') ? false : null"
          >
            <b-form-input
              id="inputConfirmPassword"
              ref="inputConfirmPassword"
              type="password"
              v-model="confirm_password"
              :placeholder="$t('manager_create_confirm_password_placeholder')"
              v-validate="'required|min:8|confirmed:inputPassword'"
              :data-vv-as="$t('manager_create_confirm_password')"
              name="confirm_password"
              :state="errors.has('confirm_password') ? false : null"
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
  middleware: ['auth', 'admin'],
  data() {
    return {
      show: true,
      confirm_password: '',
      form: {
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
          const endpoint = '/api/managers/new/';
          const url = `${host}${endpoint}`;

          axios
            .post(url, this.form)
            .then((response) => {
              console.log(response);
              this.$swal({
                type: 'success',
                title: this.$t('manager_create_success_title'),
                text: this.$t('manager_create_success_text'),
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
    onReset(event) {
      event.preventDefault();

      this.form.first_name = '';
      this.form.last_name = '';
      this.form.username = '';
      this.form.phone_number = '';
      this.form.password = '';
      this.confirm_password = '';

      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
  mounted() {
    // --------------------------------------------------------
    // custom validator for manager username
    // --------------------------------------------------------
    const isManagerUsernameUnique = (value) => {
      const endpoint = `/api/managers/check/username/${value}`;
      const url = `${host}${endpoint}`;

      return axios
        .get(url)
        .then((response) => {
          let data = { valid: true };
          if (response.data.exists) {
            data = {
              valid: false,
              data: {
                message: this.$t('manager_create_username_exits'),
              },
            };
          }
          return data;
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            type: 'error',
            title: this.$t('manager_create_username_validation_error'),
            text: this.$t('manager_create_username_validation_error_text'),
            showConfirmButton: true,
          }).then(() => {
            this.$router.push({ name: 'managers' });
          });
        });
    };

    // --------------------------------------------------------
    // registring custom validator
    // --------------------------------------------------------
    Validator.extend('unique_manager_username', {
      validate: isManagerUsernameUnique,
      getMessage: (field, params, data) => data.message,
    });

    // --------------------------------------------------------
    // custom validator for customer phone number
    // --------------------------------------------------------
    const isManagerPhoneNumberUnique = (value) => {
      const endpoint = `/api/managers/check/phone_number/${value}`;
      const url = `${host}${endpoint}`;

      return axios
        .get(url)
        .then((response) => {
          let data = { valid: true };
          if (response.data.exists) {
            data = {
              valid: false,
              data: {
                message: this.$t('manager_create_phone_number_exits'),
              },
            };
          }
          return data;
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            type: 'error',
            title: this.$t('manager_create_phone_number_validation_error'),
            text: this.$t('manager_create_phone_number_validation_error_text'),
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
