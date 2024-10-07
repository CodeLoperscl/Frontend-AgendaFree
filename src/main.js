import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import Particles from "@tsparticles/vue3";
   import { loadSlim } from "@tsparticles/slim";

// You can use the following starter router instead of the default one as a clean starting point
// import router from "./router/starter";
import router from "./router/starter.js";

// Template components
import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

// Template directives
import clickRipple from "@/directives/clickRipple";

// Bootstrap framework
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

// Craft new application
const app = createApp(App);

// Use Plugins
app.use(Particles, {
    init: async (engine) => {
      await loadSlim(engine); // Carga la versión slim
    },
  });
app.use(createPinia());
app.use(router);

// Register global components
app.component("BaseBlock", BaseBlock);
app.component("BaseBackground", BaseBackground);
app.component("BasePageHeading", BasePageHeading);

// Register global directives
app.directive("click-ripple", clickRipple);

// Import Animate.css
import 'animate.css';

// Mount the app
app.mount("#app");
