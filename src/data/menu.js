/*
 * Main and demo navigation arrays
 *
 * 'to' attribute points to the route name, not the path url
 */

export default {
  main: [
    {
      name: "Dashboard",
      to: "backend-dashboard",
      icon: "si si-speedometer",
    },
    {
      name: "Calendario",
      to: "calendario",
      icon: "si si-calendar",
    },
    {
      name: "Solicitudes Pendientes",
      to: "confirmar-hora",
      icon: "si si-pencil",
    },
    {
      name:"Configurar Horario",
      to: "personalizar-horario",
      icon: "si si-settings"
    }
  ],
};
