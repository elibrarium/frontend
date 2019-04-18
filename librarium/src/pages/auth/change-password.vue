<template>
  <content-area :title="$t('change_passowrd_content_area_title')">
    <!-- Page Header Actions -->
    <template slot="actions">
      <b-button id="back"
                class="float-right"
                variant="light"
                :to="backTo">
        <fa icon="arrow-left"></fa>
        <b class="d-none d-sm-inline">{{ $t('change_password_back_button_title') }}</b>
      </b-button>
    </template>

    <b-row>
      <b-col>
        <b-form @submit="onSubmit">
          <b-form-group id="labelOldPassword"
                        :label="$t('change_password_old_password_label')"
                        label-for="inputOldPassword"
                        :invalid-feedback="errors.first('old_password')"
                        :state="errors.has('old_password') ? false : null">
            <b-form-input id="inputOldPassword"
                          ref="inputOldPassword"
                          type="password"
                          v-model="form.old_password"
                          :placeholder="$t('change_password_old_password_placeholder')"
                          v-validate="'required'"
                          :data-vv-as="$t('change_password_old_password_field_name')"
                          name="old_password"
                          :state="errors.has('old_password') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelNewPassword"
                        :label="$t('change_password_new_password_label')"
                        label-for="inputNewPassword"
                        :invalid-feedback="errors.first('new_password')"
                        :state="errors.has('new_password') ? false : null">
            <b-form-input id="inputNewPassword"
                          ref="inputNewPassword"
                          type="password"
                          v-model="form.new_password"
                          :placeholder="$t('change_password_new_password_placeholder')"
                          v-validate="'required|min:8|confirmed:inputConfirmNewPassword'"
                          :data-vv-as="$t('change_password_new_password_field_name')"
                          name="new_password"
                          :state="errors.has('new_password') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-form-group id="labelConfirmNewPassword"
                        :label="$t('change_password_confirm_new_password_label')"
                        label-for="inputConfirmNewPassword"
                        :invalid-feedback="errors.first('confirm_new_password')"
                        :state="errors.has('confirm_new_password') ? false : null">
            <b-form-input id="inputConfirmNewPassword"
                          ref="inputConfirmNewPassword"
                          type="password"
                          v-model="confirm_new_password"
                          :placeholder="$t('change_password_confirm_new_password_placeholder')"
                          v-validate="'required|min:8|confirmed:inputNewPassword'"
                          :data-vv-as="$t('change_password_confirm_new_password_field_name')"
                          name="confirm_new_password"
                          :state="errors.has('confirm_new_password') ? false : null">
            </b-form-input>
          </b-form-group>
          <b-button :disabled="errors.count() > 0"
                    type="submit"
                    variant="primary">
            {{ $t('change_password_change_button_text') }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </content-area>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import { _ } from 'vue-underscore';

const { host } = window.config;
const endpoint = `${host}/api/manager/password/change/`;

export default {
  middleware: ['auth', 'manager'],
  metaInfo() {
    return {
      title: this.$t('change_password_page_title'),
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      this.$validator.validate().then((valid) => {
        if (valid) {
          axios
            .put(endpoint, this.form)
            .then((response) => {
              if (response.status === 200) {
                this.$swal({
                  type: 'success',
                  title: this.$t('change_password_change_msg_success_title'),
                  text: this.$t('change_password_change_msg_success_text'),
                  showConfirmButton: true,
                }).then(() => {
                  this.logout();
                });
              } else {
                this.$swal({
                  type: 'warning',
                  title: this.$t('change_password_change_msg_warning_title'),
                  text: this.$t('change_password_change_msg_show_developer'),
                  showConfirmButton: true,
                }).then(() => {
                  this.$router.push(this.backTo);
                });
              }
            })
            .catch((error) => {
              console.log(error);
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
    async logout() {
      // Log out the user.
      await this.$store.dispatch('auth/logout');
      // Redirect to login.
      this.$router.push({ name: 'login' });
    },
  },
  computed: mapGetters({
    user: 'auth/user',
  }),
  data() {
    return {
      form: {
        old_password: '',
        new_password: '',
      },
      confirm_new_password: '',
      backTo: this.$route.params.back
        ? { name: this.$route.params.back }
        : { name: 'dashboard' },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
