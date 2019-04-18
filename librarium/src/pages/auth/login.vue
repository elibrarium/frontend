<template>
  <div class="mx-auto" style="width: 300px;">
    <content-area>
      <b-card :header="$t('login')" class="login-form">
        <b-form @submit="onSubmit">
          <b-form-group
            id="usernameInputLabel"
            label-for="usernameInput"
            :label="$t('username')"
            :invalid-feedback="errors.first('username')"
            :state="errors.has('username') ? false : null"
          >
            <b-form-input
              id="usernameInput"
              v-validate="'required'"
              v-model="form.username"
              type="text"
              name="username"
              :state="errors.has('username') ? false : null"
            />
          </b-form-group>
          <b-form-group
            id="passwordInputLabel"
            label-for="passwordInput"
            :label="$t('password')"
            :invalid-feedback="errors.first('password')"
            :state="errors.has('password') ? false : null"
          >
            <b-form-input
              id="passwordInput"
              v-validate="'required'"
              v-model="form.password"
              class="form-control"
              type="password"
              name="password"
              autocomplete="password"
              :state="errors.has('password') ? false : null"
            />
          </b-form-group>
          <b-form-group>
            <b-form-checkbox v-model="remember" name="remember">
              {{ $t('remember_me') }}
            </b-form-checkbox>
          </b-form-group>
          <b-button type="submit" variant="primary">{{ $t('login') }}</b-button>
        </b-form>
      </b-card>
    </content-area>
  </div>
</template>

<script>
import axios from 'axios';
import { _ } from 'vue-underscore';

const { host } = window.config;

export default {
  middleware: 'guest',
  metaInfo() {
    return { title: this.$t('login') };
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      remember: false,
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      this.$validator.validate().then((valid) => {
        if (valid) {
          const endpoint = '/api/auth/obtain/token/';
          const url = `${host}${endpoint}`;

          axios
            .post(url, this.form)
            .then((response) => {
              this.$store.dispatch('auth/saveToken', {
                token: response.data.token,
                remember: this.remember,
              });
              this.$store.dispatch('auth/fetchUser');
              // Redirect to dashboard
              this.$router.push({ name: 'dashboard' });
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
              this.$swal({
                type: 'error',
                title: this.$t('error_alert_title'),
                text: this.$t('wrong_username_or_password'),
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  margin-top: 2rem;
  max-width: 30rem;
}
</style>
