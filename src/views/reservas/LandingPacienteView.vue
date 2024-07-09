<script setup>
import { ref, reactive } from "vue";
import FlatPickr from "vue-flatpickr-component";
import ModalComponent from "./componentes/ModalComponent.vue";

const session = ref(false);
const modal = ref(false);
const flatPickrState = reactive({
  // Initial values
  inlineDefault: null,
  // Configuration, get more form https://chmln.github.io/flatpickr/options/
  configInlineDefault: {
    inline: true,
    minDate: "today",
    altInputClass: "bootstrap",
    static: true,
    disableMobile: true,
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        longhand: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
      },
      months: {
        shorthand: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Оct",
          "Nov",
          "Dic",
        ],
        longhand: [
          "Enero",
          "Febreo",
          "Мarzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
      },
    },
  },
});

const horarios = reactive([
  {
    id: 1,
    hora: "09:00",
    estado: true,
  },
  {
    id: 2,
    hora: "10:00",
    estado: false,
  },
  {
    id: 3,
    hora: "11:00",
    estado: false,
  },
  {
    id: 4,
    hora: "12:00",
    estado: false,
  },
  {
    id: 5,
    hora: "13:00",
    estado: false,
  },
  {
    id: 6,
    hora: "16:00",
    estado: false,
  },
  {
    id: 7,
    hora: "17:00",
    estado: false,
  },
  {
    id: 8,
    hora: "18:00",
    estado: false,
  },
  {
    id: 9,
    hora: "19:00",
    estado: false,
  },
  {
    id: 10,
    hora: "20:00",
    estado: false,
  },
]);

const closeModal = () => {
  modal.value = false;
};

const guardarDatos = () => {
  closeModal();
  session.value = "Michael Aguirre Saavedra";
};

async function doSomethingOnChange() {
  console.log("buscar hora el dia " + flatPickrState.inlineDefault);
}
</script>

<template>
  <!-- Hero -->
  <div class="hero bg-body-extra-light h-100">
    <div class="content content-full">
      <div class="row justify-content-center text-center">
        <div class="col-lg-8 col-xl-6">
          <i class="fa fa-3x fa-book-medical text-primary"></i>
          <h4 class="mb-0 mt-3">Bienvenido a</h4>
          <h3 class="fw=bold mb-0" v-show="!session">
            Sistema de reservas Online
          </h3>
          <h1 class="fst-italic mb-4">
            <span class="fw-light" v-show="!session">
              Psicóloga Nathaly Morales</span
            >
            <span class="fw-light" v-show="session"> {{ session }}</span>
          </h1>
        </div>
      </div>

      <div class="row justify-content-center text-center" v-show="!session">
        <div class="col-lg-8 mt-3">
          <p class="fs-lg fw-medium text-muted mb-4">
            Para solicitar una hora de atención, ingrese su rut y presione
            continuar.
          </p>
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="input-group">
                <input
                  type="rut"
                  class="form-control"
                  id="example-group3-input2"
                  name="example-group3-input2"
                  placeholder="Rut Ej: 17463223-K"
                />
                <button
                  type="button"
                  class="btn btn-primary px-4 py-3"
                  v-click-ripple
                  @click="modal = true"
                >
                  Continuar
                  <i class="fa fa-fw fa-arrow-right ms-1 opacity-50"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row pt-3 py-md-5 my-md-3" v-show="session">
        <div
          class="col-lg-8 col-xl-4 offset-xl-2 p-md-5 py-5 bg-primary border border-primary text-center"
        >
          <h2 class="text-white mb-5">
            ¿En qué fecha deseas solicitar reunión con
            <span class="fst-italic fw-light"> Psicóloga Nathaly Morales</span>
            ?
          </h2>
          <FlatPickr
            id="example-flatpickr-inline"
            class="form-control md-input flatpickr-input form-control input active"
            placeholder="Fecha de reunión"
            v-model="flatPickrState.inlineDefault"
            :config="flatPickrState.configInlineDefault"
            @on-change="doSomethingOnChange"
          />
        </div>
        <div class="col-lg-8 col-xl-4 p-5 border border-primary">
          <p class="fw-bold">¿A qué hora puedes?</p>
          <p>
            Mostrando los horarios para el
            <span class="fw-bold">30 de mayo de 2024</span>
          </p>
          <div class="d-grid gap-2">
            <button
              v-for="horario in horarios"
              :key="horario.id"
              type="button"
              class="btn btn-outline-primary js-click-ripple-enabled py-2 mb-2"
              data-toggle="click-ripple"
              style="overflow: hidden; z-index: 1"
              :disabled="horario.estado"
            >
              {{ horario.hora }}
            </button>
          </div>
        </div>
      </div>

      <ModalComponent
        :isOpen="modal"
        @modal-close="closeModal"
        @submit-data="guardarDatos"
      ></ModalComponent>
    </div>
  </div>
  <!-- END Hero -->
</template>

<style lang="scss">
.hero {
  min-height: 100vh;
}
#example-flatpickr-inline {
  display: none;
}
.flatpickr-calendar {
  background: transparent;
  color: white !important;
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.flatpickr-months .flatpickr-month {
  color: white;
}

.flatpickr-months .flatpickr-next-month,
.flatpickr-months .flatpickr-prev-month {
  color: white;
  fill: white;
}

span.flatpickr-weekday,
.flatpickr-day {
  color: white;
}

.flatpickr-day.today {
  border-color: #ffffff;
  color: white;
}
.theme-flat .flatpickr-day.selected,
.theme-flat .flatpickr-day.selected:hover,
.theme-flat .flatpickr-day.selected:focus {
  background-color: #ffffff;
  color: #069fba !important;
}

.flatpickr-day.nextMonthDay,
.flatpickr-day.prevMonthDay {
  color: rgba(255, 255, 255, 0.8);
}

.flatpickr-day.flatpickr-disabled {
  color: rgba(255, 255, 255, 0.3);
}

@import "flatpickr/dist/flatpickr.css";
@import "@/assets/scss/vendor/flatpickr";
</style>
