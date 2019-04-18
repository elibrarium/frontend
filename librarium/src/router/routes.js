const Login = () => import('@/pages/auth/login').then(m => m.default || m);

const Dashboard = () => import('@/pages/dashboard').then(m => m.default || m);
const Search = () => import('@/pages/search/index').then(m => m.default || m);

const ChangePassword = () =>
  import('@/pages/auth/change-password').then(m => m.default || m);

const Settings = () =>
  import('@/pages/settings/index').then(m => m.default || m);

const NotFound = () => import('@/pages/errors/404').then(m => m.default || m);

export default [
  {
    path: '/',
    name: 'landing',
    redirect: {
      name: 'login',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
  {
    path: '/change/password',
    name: 'change.password',
    component: ChangePassword,
  },
  {
    path: '/settings',
    component: Settings,
    children: [],
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
];
