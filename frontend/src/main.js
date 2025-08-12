import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

Vue.config.productionTip = false
Vue.use(ElementUI);

// 配置axios
axios.defaults.baseURL = 'http://localhost:8081/api';
console.log('Axios baseURL set to:', axios.defaults.baseURL);

// 请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization);
  } else {
    console.log('No token found in localStorage');
  }
  console.log('Request URL:', config.url);
  console.log('Request method:', config.method);
  console.log('Request data:', config.data);
  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  response => {
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  error => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')