<script setup>
// El código JavaScript se mantiene igual
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { format } from "date-fns";
import {
  useEspecialistaDatos,
  useUrlApiEspecialista,
  usePacienteDatos,
  usePersonaPacienteDatos,
} from "../../stores/store";
import axios from "axios";
import LoadingSpinner from "../../Component/LoadingSpinner.vue";

//API
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;

//Store
const storePersonaPaciente = usePersonaPacienteDatos();
const storeAPIEspecialista = useUrlApiEspecialista();
const storePaciente = usePacienteDatos();

// Variables
const previsiones = ref();
const API_ESPECIALISTA = storeAPIEspecialista.url;
const date = ref(new Date());
const solicitarHoraBtnEstado = ref(true);
const horarioSeleccionado = ref();
const idHorarioSeleccionado = ref();
const dataEspecialista = useEspecialistaDatos();
const citasEspecialista = ref();
const isLoading = ref(false);
const diaSeleccionado = ref(format(new Date(), "dd-MM-yyyy"));
const horariosEspecialista = ref();
const configuracionesCalendario = ref([
  {
    highlight: true,
    key: "today",
    highlight: {
      color: "#16A085",
      fillMode: "light",
      contentClass: "italic",
    },
  },
]);

const nuevaCita = ref({
  especialista_id: dataEspecialista.especialista.especialista.id,
  fecha: null,
  paciente_id: storePaciente.getPaciente().id,
  prevision_id: storePaciente.getPaciente().prevision_id,
  hora_id: null,
  estado_cita_id: 1,
});

const getToken = () => {
  return {
    headers: {
      "x-token": sessionStorage.getItem("token"),
    },
  };
};

const getHorarios = () => {
  axios
    .get(API_ESPECIALISTA + "api/hora_disponible", getToken())
    .then((response) => {
      if (response) {
        horariosEspecialista.value = response.data.horas_disponibles;
        console.log("hora disponible: ", response.data.horas_disponibles);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const getPrevisiones = () => {
  axios
    .get(API_ESPECIALISTA + "api/prevision", getToken())
    .then((response) => {
      if (response) {
        previsiones.value = response.data.previsiones.filter(
          (prevision) => prevision.estado_id === 3
        );
        console.log("Previsiones", previsiones.value);
      }
    })
    .catch((e) => {
      if (e) {
        console.log(e);
      }
    });
};

const generarOpciones = () => {
  const esChileno =
    storePersonaPaciente.getPersona().persona.nacionalidad_id === 1;
  const previsionActual = storePaciente.getPaciente().prevision_id;
  console.log("Prevision actual: ", previsionActual);

  if (esChileno) {
    return previsiones.value
      .map(
        (opcion) =>
          `<option value="${opcion.id}" id="prevision${opcion.id}" ${
            opcion.id === previsionActual ? "selected" : ""
          }>${opcion.nombre}</option>`
      )
      .join("");
  } else {
    return `<option value="3" id="previsionExtranjero" selected>Particular</option>`;
  }
};

const reservarCita = () => {
  console.log("Paciente: ", storePaciente.getPaciente().prevision_id);
  Swal.fire({
    html: `
    <div style="text-align: left;">
      <div class="mb-3">
        <label for="nombre" class="form-label"><strong>Bienvenido </strong> ${
          storePersonaPaciente.getPersona().persona.nombre
        } ${storePersonaPaciente.getPersona().persona.apellido}</label>
        <p>Por favor, confirma que tus datos son correctos:</p>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label"><strong>Email:</strong></label>
        <input 
          type="email" 
          class="form-control" 
          id="email" 
          value="${storePersonaPaciente.getPersona().persona.email}"
        >
      </div>

      <div class="mb-3">
        <label for="fono" class="form-label"><strong>Teléfono:</strong></label>
        <input 
          type="text" 
          class="form-control" 
          id="fono" 
          value="${storePersonaPaciente.getPersona().persona.fono}"
        >
      </div>

      <div class="mb-3">
        <label for="prevision" class="form-label"><strong>Prevision:</strong></label>
        <select class="form-select" id="prevision" value="${
          storePaciente.getPaciente().prevision_id
        }">
        ${generarOpciones()}
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label"><strong>Reserva de cita para el día ${
          diaSeleccionado.value
        } a las ${horarioSeleccionado.value}</strong></label>
      </div>

      <p>¿Desea reservar para este día y hora?</p>
    </div>
  `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3485b7",
    cancelButtonColor: "#95A5A6",
    preConfirm: () => {
      const email = document.getElementById("email").value;
      const fono = document.getElementById("fono").value;
      const prevision = document.getElementById("prevision").value;

      if (!email || !fono || !prevision) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
      }

      return { email, fono, prevision };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { email, fono, prevision } = result.value;
      // Actualizar los datos del paciente
      storePersonaPaciente.setPersonaEmail(email);
      storePersonaPaciente.setPersonaFono(fono);
      storePaciente.setPacientePrevision(parseInt(prevision));
      if (email && fono) {
        axios
          .put(
            `${API_GENERAL}persona/${
              storePersonaPaciente.getPersona().persona.id
            }`,
            { email: email, fono: fono },
            getToken()
          )
          .then((response) => {
            if (response) {
              console.log("Paciente actualizado: ", response.data);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
      if (prevision) {
        axios
          .put(
            `${API_ESPECIALISTA}api/paciente/${storePaciente.getPaciente().id}`,
            { prevision_id: prevision },
            getToken()
          )
          .then((response) => {
            if (response) {
              console.log("Paciente actualizado: ", response.data);
              nuevaCita.value.prevision_id = parseInt(prevision);
              console.log(
                "La Prevision de la Cita ha sido actualizada: ",
                nuevaCita.value
              );
              // Registrar la cita después de actualizar el paciente
              registrarCita();
            }
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al actualizar los datos del paciente. Por favor, inténtalo de nuevo.",
              icon: "error",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#3485b7",
            });
          });
      } else {
        // Si no hay previsión para actualizar, registrar la cita directamente
        registrarCita();
      }
    } else if (result.isDismissed) {
      Swal.fire({
        title: "Reserva de cita cancelada",
        text: "Tu cita ha sido cancelada. Si necesitas reprogramar, por favor contáctanos.",
        icon: "info",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3485b7",
      });
    }
  });
};

// Función para registrar la cita
function registrarCita() {
  axios
    .post(API_ESPECIALISTA + "api/cita", nuevaCita.value, getToken())
    .then((response) => {
      if (response) {
        console.log(response);
        Swal.fire({
          title: "Cita agendada con éxito!",
          text: "En espera de confirmación del especialista",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#3485b7",
        });
        horariosEspecialista.value.some((horario) => {
          if (horario.id == nuevaCita.value.hora_id) {
            horario.agendado = true;
            solicitarHoraBtnEstado.value = true;
          }
          console.log("Cita reservada con id: ", horario.id);
        });
      }
    })
    .catch((e) => {
      console.log(e);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al agendar la cita. Por favor, inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3485b7",
      });
    });
}

const seleccionarHorario = (id, horario) => {
  idHorarioSeleccionado.value = id;
  horarioSeleccionado.value = horario;
  solicitarHoraBtnEstado.value = false;
  console.log("id horario seleccionado: ", idHorarioSeleccionado.value);
  nuevaCita.value.hora_id = id;
  console.log("Ultima cita:", nuevaCita.value);
};

const fechaMaxima = () => {
  let fecha = new Date();
  fecha.setDate(
    fecha.getDate() + dataEspecialista.especialista.max_dias_atencion
  );
  return fecha;
};

const getCitas = () => {
  console.log(
    "Máximos días de atención: ",
    dataEspecialista.especialista.max_dias_atencion
  );
  solicitarHoraBtnEstado.value = true;
  if (date.value != null) {
    isLoading.value = true;
    diaSeleccionado.value = format(date.value, "dd-MM-yyyy");
    date.value = format(date.value, "yyyy-MM-dd");
    nuevaCita.value.fecha = date.value;
    //Cargo todas las citas para el especialista con id 1 en la fecha seleccionada en el calendario
    axios
      .get(
        API_ESPECIALISTA + "api/cita/esp_date/" + 1 + "/" + date.value,
        getToken()
      )
      .then((response) => {
        citasEspecialista.value = response.data.allCitasFecha;
        console.log("Citas especialista", citasEspecialista.value);
        horasDisponiblesPorDia();
        isLoading.value = false;
      })
      .catch((e) => {
        console.log(e);
        isLoading.value = false;
      });
  } else {
    horariosEspecialista.value.forEach((horario) => {
      horario.agendado = true;
    });
  }
};

const horasDisponiblesPorDia = () => {
  if (citasEspecialista.value.length === 0) {
    horariosEspecialista.value.forEach((horario) => {
      horario.agendado = false;
    });
  } else {
    horariosEspecialista.value.forEach((hora) => {
      const horaReservada = citasEspecialista.value.find(
        (cita) => cita.hora_id == hora.id
      );
      horaReservada ? (hora.agendado = true) : (hora.agendado = false);
    });
  }
};

onBeforeMount(async () => {
  console.log("store2", storePersonaPaciente.getPersona());
  console.log("store3", dataEspecialista.especialista);
  await getPrevisiones();
  await getHorarios();
  await getCitas();
});

const disabledDates = ref([
  {
    repeat: {
      weekdays: [7, 1],
    },
  },
]);
</script>

<template>
  <div
    class="d-flex justify-content-center align-items-center vh-100"
    transition-style="in:circle:hesitate"
  >
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-6 mb-4 d-flex">
          <div class="card shadow h-100 flex-grow-1 d-flex flex-column">
            <div
              class="card-body bg-teal text-ivory d-flex flex-column justify-content-between"
            >
              <h2 class="card-title text-center mb-4">
                <img
                  src="/assets/media/avatars/avatar0.jpg"
                  alt="Imagen"
                  class="my-2 rounded-circle"
                  style="max-width: 100px; display: block; margin: 0 auto"
                />
                <span class="fst-italic fw-light d-block mt-2"
                  >{{
                    `${dataEspecialista.especialista.especialista.especialidades[0].abreviatura}. ${dataEspecialista.especialista.nombre} ${dataEspecialista.especialista.apellido}`
                  }}
                </span>
              </h2>
              <div
                class="calendar-wrapper flex-grow-1 d-flex align-items-center"
              >
                <DatePicker
                  locale="es-MX"
                  class="calendar w-100"
                  v-model="date"
                  color="#16A085"
                  :disabled-dates="disabledDates"
                  :attributes="configuracionesCalendario"
                  :min-date="new Date()"
                  :max-date="fechaMaxima()"
                  @dayclick="getCitas()"
                  expanded
                  borderless
                  transparent
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4 d-flex">
          <div class="card shadow h-100 flex-grow-1 d-flex flex-column">
            <div class="card-body d-flex flex-column">
              <h3 class="card-title text-navy mb-4" v-if="date != null">
                Horarios disponibles para el
                <span class="text-teal">{{ diaSeleccionado }}</span>
              </h3>
              <h3 class="card-title text-navy mb-4 fw-bold" v-else>
                Selecciona una fecha para ver los horarios disponibles
              </h3>
              <div class="row g-3 flex-grow-1">
                <div
                  class="col-6"
                  v-for="horario in horariosEspecialista"
                  :key="horario.id"
                >
                  <button
                    :id="horario.id"
                    type="button"
                    :class="[
                      'btn',
                      'w-100',
                      'py-2',
                      'btn-hora',
                      {
                        'btn-hora-seleccionada':
                          horario.id === idHorarioSeleccionado,
                      },
                      { 'btn-hora-deshabilitada': horario.agendado },
                    ]"
                    :disabled="horario.agendado"
                    @click="seleccionarHorario(horario.id, horario.hora)"
                  >
                    {{ horario.hora }}
                  </button>
                </div>
              </div>
              <div class="d-flex justify-content-center mt-4">
                <button
                  class="btn btn-navy btn-small fw-bold"
                  @click="reservarCita"
                  :disabled="solicitarHoraBtnEstado"
                >
                  Solicitar Hora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Variables de color
$color-primary: #3485b7;
$color-secondary: #00b1b9;
$color-tertiary: #a6d4cc;

// ... código existente ...

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba($color-primary, 0.1) !important;
  }
}

.card-body {
  padding: 2rem;
  flex-grow: 1;
}

// Estilo para la primera card (calendario)
.card:first-of-type .card-body {
  background-color: $color-tertiary;
  color: $color-primary;
}

// Estilo para la segunda card (horarios)
.card:last-of-type .card-body {
  background-color: #ffffff;
  color: $color-primary;
}

h2,
h3 {
  letter-spacing: 0.5px;
  color: $color-secondary;
}

.bg-teal {
  background-color: $color-tertiary;
}

.text-ivory {
  color: $color-primary;
}

.text-navy {
  color: $color-primary;
}

.text-teal {
  color: $color-secondary;
}

.btn-teal {
  background-color: $color-secondary;
  color: #ffffff;
  font-weight: 600;
  &:hover {
    background-color: darken($color-secondary, 10%);
  }
}

.btn-outline-teal {
  border-color: $color-secondary;
  color: $color-secondary;
  font-weight: 600;
  &:hover {
    background-color: $color-secondary;
    color: #ffffff;
  }
}

.btn-navy {
  background-color: $color-primary;
  color: #ffffff;
  &:hover {
    color: #ffffff;
    background-color: darken($color-primary, 10%);
  }
}

.btn-hora {
  background-color: transparent;
  border: 1px solid $color-primary;
  color: $color-primary;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba($color-primary, 0.1);

  &:hover:not(:disabled) {
    background-color: rgba($color-primary, 0.1);
    box-shadow: 0 6px 8px rgba($color-primary, 0.2);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba($color-primary, 0.25);
  }
}

.btn-hora-seleccionada {
  background-color: $color-primary;
  color: #ffffff;
  box-shadow: 0 4px 6px rgba($color-primary, 0.3);
}

.btn-hora-deshabilitada {
  border-color: #95a5a6;
  color: #95a5a6;
  cursor: not-allowed;
  box-shadow: none;

  &:hover {
    background-color: transparent;
  }
}

body {
  background-color: #eff2f3;
}

// Actualiza los colores del calendario

.vc-title-wrapper {
  padding-bottom: 15px;
}

.vc-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: $color-primary;
}

.vc-disabled {
  pointer-events: none;
  cursor: default;
}

.vc-pane-container {
  transform: scale(0.95);
}

.vc-day,
.vc-day-content {
  font-size: 1.1rem;
  color: $color-secondary;
  font-weight: 500;
}

.vc-container {
  width: 100%;
  border: none;
  background: transparent;
}

.vc-highlight {
  width: 30px;
  height: 30px;
  background-color: $color-tertiary;
}

.vc-weekday {
  padding: 20px;
  font-size: 1rem;
  color: $color-primary;
  font-weight: 600;
}

.vc-title {
  background-color: transparent;
  color: #fafafa;
  font-size: 1.4rem;
  font-weight: bold;
}

// ... resto del código ...
</style>
