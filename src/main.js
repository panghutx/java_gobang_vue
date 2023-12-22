import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import store from './stores'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store)
app.use(materialKit);
app.use(ElementPlus)
app.mount("#app");
