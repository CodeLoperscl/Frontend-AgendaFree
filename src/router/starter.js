import { createRouter, createWebHashHistory, createWebHistory, RouterView, useRoute } from "vue-router";

import NProgress from "nprogress/nprogress.js";

// Main layout variations

import LayoutLanding from "@/layouts/variations/Landing.vue";
import LayoutBackend from "@/layouts/variations/Backend.vue";


// Landing Agendar Cita
const LandingEspecialista = () => import("@/views/AgendaFree/LandingEspecialista/vistas/LandingEspecialistaView.vue");
const ReservaHoraView = () => import("@/views/AgendaFree/ModuloReserva/vistas/ReservaHoraView.vue");

// Dashboard Especialista
const BackendDashboard = () => import("@/views/AgendaFree/Dashboard/DashboardView.vue");
const CalendarioView = () => import("@/views/AgendaFree/Dashboard/Calendario/CalendarioView.vue");
const ConfirmarHoraView = () => import("@/views/AgendaFree/Dashboard/ConfirmarReserva/ConfirmarHoraView.vue");
const PersonalizarHorarioView = () => import("@/views/AgendaFree/Dashboard/ConfiguracionHora/ConfiguracionHoraView.vue");
// Error 404 Not Found
const NoFoundView = () => import("@/views/errors/404View.vue");

//Auth
const signInView = () => import('@/views/AgendaFree/SignIn/Lock3View.vue');

const routes = [

  {
    path: "/",
    component: LayoutBackend,
    children: [
      {
        path: "",
        name: "landing",
        component: BackendDashboard,
      },
    ],
  },
  {
    path: "/:uid/:especialista",
    component: LayoutLanding,
    children:[
      {
        path:"",
        name:"agenda",
        component: LandingEspecialista,
      },
      {
        path: "",
        name: "modulo-reserva",
        component: ReservaHoraView,
      },
    ],
  },
  {
    path: "/:uid/backend",
    redirect: { name: "signin-especialista" }, // Redirige a signin-especialista primero
  },
  {
    path: "/:uid/backend",
    name: "signin-especialista",
    component: signInView,
  },
  {
    path: "/:uid/backend",
    component: LayoutBackend,
    children: [
      {
        path: "",
        name: "confirmar-hora",
        component: ConfirmarHoraView,
      },
      {
        path: "",
        name: "backend-dashboard",
        component: BackendDashboard,
      },
      {
        path: "",
        name: "calendario",
        component: CalendarioView,
      },
      {
        path:"",
        name: "personalizar-horario",
        component: PersonalizarHorarioView,
      }
    ],
  },
  {
    path: "/error",
    component: LayoutLanding,
    children:[
      {
        path: "",
        name:"error",
        component: NoFoundView,
      },
    ],
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/error' 
  },
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "",
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

// NProgress
/*eslint-disable no-unused-vars*/
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
  NProgress.start();
  next();
});


router.afterEach((to, from) => {
  NProgress.done();
});

NProgress.inc();
export default router;
