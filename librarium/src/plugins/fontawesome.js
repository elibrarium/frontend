import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// import { } from '@fortawesome/free-regular-svg-icons'

import {
  faUser,
  faLock,
  faSignOutAlt,
  faCog,
  faTimes,
  faPen,
  faPlus,
  faInfo,
  faArrowLeft,
  faSearch,
  faFilter,
  faArrowCircleDown,
  faCheck,
  faUserPlus,
  faPaperPlane,
  faKey,
} from '@fortawesome/free-solid-svg-icons';

import { faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(
  faUser,
  faLock,
  faSignOutAlt,
  faCog,
  faTimes,
  faPen,
  faPlus,
  faInfo,
  faGithub,
  faArrowLeft,
  faSearch,
  faFilter,
  faArrowCircleDown,
  faCheck,
  faUserPlus,
  faPaperPlane,
  faKey,
);

Vue.component('fa', FontAwesomeIcon);
