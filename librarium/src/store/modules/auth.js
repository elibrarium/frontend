/* eslint-disable */
import axios from 'axios';
import Cookies from 'js-cookie';
import * as types from '../mutation-types';

// state
export const state = {
  user: null,
  token: Cookies.get('token'),
};

// getters
export const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
  check: (state) => state.user !== null,
};

// mutations
export const mutations = {
  [types.SAVE_TOKEN](state, { token, remember }) {
    state.token = token;
    Cookies.set('token', token, { expires: remember ? 365 : null });
  },
  [types.FETCH_USER_SUCCESS](state, { user }) {
    state.user = user;
  },
  [types.FETCH_USER_FAILURE](state) {
    Cookies.remove('token');
    state.token = null;
  },
  [types.LOGOUT](state) {
    Cookies.remove('token');
    state.user = null;
    state.token = null;
  },
  [types.UPDATE_USER](state, { user }) {
    state.user = user;
  },
};

// actions
export const actions = {
  saveToken({ commit, dispatch }, payload) {
    commit(types.SAVE_TOKEN, payload);
  },
  async fetchUser({ commit }) {
    const { host } = window.config;
    try {
      const { data } = await axios.get(`${host}/api/manager/me/`);

      commit(types.FETCH_USER_SUCCESS, { user: data });
    } catch (e) {
      commit(types.FETCH_USER_FAILURE);
    }
  },
  updateUser({ commit }, payload) {
    commit(types.UPDATE_USER, payload);
  },
  async logout({ commit }) {
    commit(types.LOGOUT);
  },
  async fetchOauthUrl(ctx, { provider }) {
    const { data } = await axios.post(`/api/oauth/${provider}`);
    return data.url;
  },
};
/* eslint-enable */
