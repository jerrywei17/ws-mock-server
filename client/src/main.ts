import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/plugins'
import '@/style/reset.css'
import '@/style/base.scss'

Vue.config.productionTip = false;

store.dispatch('fetchProject')
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
