import Vue from "vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from "./App.vue";

Vue.use(Antd);

new Vue({
  el: "#app",
  render: (h) => h(App),
});
