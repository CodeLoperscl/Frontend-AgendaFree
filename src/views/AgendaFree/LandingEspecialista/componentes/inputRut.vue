<script setup>
import { validateRut, formatRut } from "@fdograph/rut-utilities";
import { ref, reactive } from "vue";
import {
  useMainStore,
  usePacienteDatos,
  usePersonaPacienteDatos,
} from "../../stores/store";
import axios from "axios";
import { useRouter } from "vue-router";
import LoadingSpinner from "../../Component/LoadingSpinner.vue";
import ModalComponent from "./ModalDatosPacientes.vue";
//Modal
const modal = ref(false);
//Store
const storePersonaPaciente = usePersonaPacienteDatos();
const storePaciente = usePacienteDatos();
const store = useMainStore();
//API
const URL_API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;
//TOKEN
const getToken = () => {
  return {
    headers: {
      "x-token": sessionStorage.getItem("token"),
    },
  };
};
//Vue Router
const router = useRouter();
const dataPaciente = ref();
//Estados
const isLoading = ref(false);
const estado = ref(false);
const arrayTipo = reactive({
  tipo: "Documento Extranjero",
  ejemplo: "Rut Ej: 17463223-K",
});
//RUT/DNI
const rutInput = ref("");
const rutState = ref(false);
const rutValidated = ref("");

//modal methods
const emitAbrirModal = () => {
  openModal();
  updateStoreData();
};

const openModal = () => {
  modal.value = true;
  console.log("data");
};
const closeModal = () => {
  modal.value = false;
};
const guardarDatos = () => {
  closeModal();
  console.log("Hola desde cerrar modal");
};

//estados
const updateStoreData = () => {
  if (estado.value) {
    store.updateData(1);
  } else {
    store.updateData(0);
  }
};
//Verificar rut
const verificarRut = () => {
  if (!estado.value) {
    rutState.value = validateRut(rutInput.value);
    rutValidated.value = formatRut(rutInput.value);
  }
};
//Formatear rut
const formatearRut = () => {
  if (!estado.value) {
    rutInput.value = rutValidated.value;
  }
};

const inputChange = (est) => {
  estado.value = est;
  updateStoreData();
  if (est) {
    arrayTipo.tipo = "CI Documento Chileno";
    arrayTipo.ejemplo = "DNI";
    rutState.value = true;
    rutValidated.value = rutInput.value;
  } else {
    arrayTipo.tipo = "Documento Extranjero";
    arrayTipo.ejemplo = "Rut Ej: 17463223-K";
  }
};

//Buscar paciente
const getPaciente = async (identificador) => {
  isLoading.value = true;
  axios
    .get(`${URL_API_GENERAL}persona/rut/${identificador}`, getToken())
    .then((response) => {
      if (response) {
        dataPaciente.value = response.data.paciente;
        console.log(dataPaciente.value);
        storePaciente.setPaciente(dataPaciente.value);
        storePersonaPaciente.setPersona(response.data);
        router.push({ name: "modulo-reserva" });
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
      emitAbrirModal();
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<template>
  <LoadingSpinner :isLoading="isLoading" />
  <div class="row mt-3 justify-content-center">
    <div class="col-12 col-md-10">
      <div class="input-rut">
        <input
          type="text"
          class="form-control"
          :class="{ 'text-info': !rutState }"
          :placeholder="arrayTipo.ejemplo"
          @input="verificarRut"
          @change="formatearRut"
          v-model="rutInput"
        />
        <button
          type="button"
          class="btn btn-primary"
          v-click-ripple
          @click="getPaciente(rutValidated)"
          :disabled="!rutState"
        >
          CONTINUAR
          <i class="fa fa-fw fa-arrow-right"></i>
        </button>
      </div>

      <div class="mt-2 text-center">
        <a
          href="#"
          @click.prevent="inputChange(!estado)"
          class="toggle-input fs-7"
          >Ingresar con {{ arrayTipo.tipo }}</a
        >
      </div>
    </div>
  </div>
  <ModalComponent
    :isOpen="modal"
    :rut="rutValidated"
    @modal-close="closeModal"
    @submit-data="guardarDatos"
  ></ModalComponent>
</template>

<style lang="scss" scoped>
// Definición de variables de color
$verde-azulado: #16a085;
$blanco-marfil: #fafafa;
$azul-marino: #2c3e50;
$gris-acero: #95a5a6;
$verde-pastel: #d1f2eb;

.fs-7 {
  font-size: 0.8rem !important;
}

.input-rut {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }

  .form-control {
    height: 50px;
    font-size: 0.75rem;
    background-color: $blanco-marfil;
    border: 2px solid $gris-acero;
    color: $azul-marino;
    margin-bottom: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    width: 100%;

    @media (min-width: 768px) {
      height: 35px;
      margin-bottom: 0;
      margin-right: 1rem;
      flex: 1;
    }

    &:focus {
      border-color: $verde-azulado;
      box-shadow: 0 0 0 0.2rem rgba($verde-azulado, 0.25);
    }
  }

  .btn-primary {
    height: 50px;
    font-size: 0.9rem;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    background-color: $verde-azulado;
    border-color: $verde-azulado;
    color: $blanco-marfil;
    font-weight: 600;
    transition: all 0.3s ease;
    border-radius: 6px;
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (min-width: 768px) {
      height: 35px;
      font-size: 0.75rem;
      min-width: 120px;
      width: auto;
    }

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: darken($verde-azulado, 10%);
      border-color: darken($verde-azulado, 10%);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      background-color: $gris-acero;
      border-color: $gris-acero;
      opacity: 0.7;
    }

    i {
      margin-left: 4px;
      font-size: 0.7rem;
    }
  }
}

.toggle-input {
  color: $verde-azulado;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
}

// Ajustes adicionales para dispositivos móviles
@media (max-width: 767px) {
  .input-rut {
    .form-control,
    .btn-primary {
      width: 100%;
      height: 50px; // Ligeramente más pequeño en móviles
      font-size: 1.1rem;
    }
  }
}
</style>
