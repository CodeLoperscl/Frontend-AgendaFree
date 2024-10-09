<script setup>
import { reactive, ref, computed, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useMainStore, usePacienteDatos, usePersonaPacienteDatos } from "../../stores/store";
import axios from 'axios';
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import LoadingSpinner from "../../Component/LoadingSpinner.vue";

//Variables
const storePersonaPaciente = usePersonaPacienteDatos();
const dataPaciente = ref();
const storePaciente = usePacienteDatos();
const store = useMainStore();
const showReservarHora = ref(false);
const router = useRouter();
const tipoCampo = ref("RUT");
const previsionSeleccionada = ref(0);
const previsionDisponible = ref({});
const nacionalidadesDisponibles = ref({});
//API 
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;
const API_ESPECIALISTA = import.meta.env.VITE_URL_API_ESPECIALISTA;
//Token
const getToken = () =>{
  return {
    headers: {
      "x-token": sessionStorage.getItem("token")
    }
  }
};
//Estados
const isLoading = ref(false);


const togglecomponent = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    // Mostrar errores si la validación falla
    console.log('Formulario inválido');
    return;
  }
  // Continuar con la lógica de negocio cuando el formulario sea válido
  console.log('Formulario válido', paciente);
  registrarPaciente();
};

const props = defineProps({
  isOpen: Boolean,
  rut: String,
});
const emit = defineEmits(["modal-close", "submit-data"]);
const target = ref(null);
onClickOutside(target, () => emit("modal-close"));

//Paciente
const paciente = reactive({
  rut: props.rut,
  nombre: null,
  email: null,
  fono: null,
  nacionalidad: 0, // Valor inicial
  prevision_id: 0,
});

// Creamos una propiedad computada separada para nacionalidad
const nacionalidadComputed = computed(() => {
  return store.sharedData === 0 ? 1 : 0;
});

// Observamos los cambios en nacionalidadComputed y actualizamos paciente.nacionalidad
watch(nacionalidadComputed, (newValue) => {
  paciente.nacionalidad = newValue;
});

// Reglas de validación
const reglas = computed(() => ({
  nombre: { 
    required, 
    minLength: minLength(2) 
  },
  apellido: { 
    required, 
    minLength: minLength(2) 
  },
  email: { 
    required, 
    email 
  },
  fono: { 
    required, 
    minLength: minLength(8) 
  },
  nacionalidad: { 
    required,
    notZero: helpers.withMessage('La nacionalidad no puede ser 0', (value) => value !== 0)
  },
  prevision_id: { 
    required,
    notZero: helpers.withMessage('La nacionalidad no puede ser 0', (value) => value !== 0)
  }
}));
//Inicializar Vuevalidate
const v$ = useVuelidate(reglas, paciente)


watch(() => store.sharedData, (newVal) => {
  if (newVal == 1) {
    tipoCampo.value = "DNI";
    paciente.prevision = 3;
    previsionSeleccionada.value = 1;
  } else {
    tipoCampo.value = "RUT";
    paciente.prevision = 0;
    previsionSeleccionada.value = 0;
  }
});

watch(() => props.isOpen, (newVal) => {
  console.log('El valor de isOpen ha cambiado:', newVal);
  if (newVal) {
    console.log('El modal se ha abierto');
    getNacionalidadPrevision(getToken());
  } else {
    console.log('El modal se ha cerrado');
  }
});

const registrarPaciente = () =>{
  //Si paciente nuevo es chileno
  const nuevaPersonaChilena = ref({});
  const nuevaPersonaExtranjera = ref({});

  if(store.sharedData == 0){
    nuevaPersonaChilena.value = {
      "nombre": paciente.nombre,
      "apellido":paciente.apellido,
      "rut": props.rut,
      "email": paciente.email,
      "fono": paciente.fono,
      "nacionalidad_id": 1,
      "prevision_id": paciente.prevision_id,
    }
  }
  if(store.sharedData == 1){
    nuevaPersonaExtranjera.value = {
      "nombre": paciente.nombre,
      "apellido":paciente.apellido,
      "rut": props.rut,
      "email": paciente.email,
      "fono": paciente.fono,
      "nacionalidad_id": paciente.nacionalidad,
      "prevision_id": paciente.prevision_id,
    }
    console.log("Nuevo paciente extranjero: ",nuevaPersonaExtranjera);
  }
  console.log(API_GENERAL+"persona", store.sharedData == 0 ? nuevaPersonaChilena.value : nuevaPersonaExtranjera.value);

  console.log("token desde ModalDatosPacientes", getToken());
  isLoading.value = true;
  axios.post(API_GENERAL+"persona", store.sharedData == 0 ? nuevaPersonaChilena.value : nuevaPersonaExtranjera.value, getToken())
    .then((response)=>{
      if(response){
        dataPaciente.value = response.data;
        showReservarHora.value = !showReservarHora.value;
        if (showReservarHora.value) {
          storePaciente.setPaciente(response.data.paciente.paciente);
          storePersonaPaciente.setPersona(response.data);
          console.log("Paciente en store: ", storePaciente.getPaciente());
          isLoading.value = false;
          router.push({ name: 'modulo-reserva' });
        } else {
          router.push({ name: 'agenda' });
        }
      }else{
        showReservarHora.value = true;
        isLoading.value = false;
      }
    });
}

const getNacionalidadPrevision = async (token) => {
  try {
    // Obtener previsiones
    const previsionResponse = await axios.get(`${API_ESPECIALISTA}prevision`, token);
    previsionDisponible.value = previsionResponse.data.previsiones.filter(prevision => prevision.estado_id === 3);

    // Obtener nacionalidades
    const nacionalidadResponse = await axios.get(`${API_GENERAL}nacionalidad`, token);
    nacionalidadesDisponibles.value = nacionalidadResponse.data.nacionalidades.filter(nacionalidad => nacionalidad.estado_id === 1);
  } catch (error) {
    console.error("Error al obtener datos de previsión o nacionalidad:", error);
  }
};

</script>

<template>
  <div v-if="props.isOpen" class="modal-mask">
    <LoadingSpinner :isLoading="isLoading" />
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <div class="modal-header">
          <h4 class="modal-title">Bienvenid@</h4>
          <button
            type="button"
            class="close-btn"
            @click='emit("modal-close")'
          >
            <i class="fa fa-fw fa-times"></i>
          </button>
        </div>
        <div class="modal-body px-5">
          <!-- Eliminar la siguiente línea -->
          <!-- <vue-particles id="tsparticles" :options="particlesOptions" /> -->
          <p class="modal-description mt-3">
            Para solicitar hora de atención por favor ingrese sus datos y presione continuar
          </p>
          <div>
            <form @submit.prevent="togglecomponent">
              <div class="form-group">
                <label :for="tipoCampo" class="rainbow-text">{{ tipoCampo }}:</label>
                <input :id="tipoCampo" type="text" :value="props.rut" disabled>
              </div>
              <!-- Campo Nombre -->
              <div class="form-group">
                <label for="nombre" class="rainbow-text" >Nombre: </label>
                <input 
                  v-model="paciente.nombre"
                  id="nombre"
                  type="text"
                  placeholder="Nombre"
                  :class="{'is-invalid': v$.nombre.$invalid && v$.nombre.$dirty}"
                >
              </div>
              <!-- Campo Apellido -->
              <div class="form-group">
                <label class="rainbow-text" for="apellido">Apellido: </label>
                <input 
                  v-model="paciente.apellido" 
                  id="apellido" 
                  type="text"  
                  placeholder="Apellido" 
                  :class="{ 'is-invalid': v$.apellido.$invalid && v$.apellido.$dirty }"
                >
              </div>
              <!-- Campo Email -->
              <div class="form-group">
                <label class="rainbow-text" for="email">Email: </label>
                <input 
                  v-model="paciente.email" 
                  id="email" 
                  type="email" 
                  placeholder="Email" 
                  :class="{ 'is-invalid': v$.email.$invalid && v$.email.$dirty }"
                >
              </div>
              <!-- Campo Telefono -->
              <div class="form-group">
                <label class="rainbow-text" for="telefono">Teléfono: </label>
                <input 
                  v-model="paciente.fono" 
                  id="telefono" 
                  type="text"
                  placeholder="+56935281541" 
                  :class="{ 'is-invalid': v$.fono.$invalid && v$.fono.$dirty }"
                >
              </div>
              <!-- Campo Nacionalidad -->
              <div class="form-group">
                <label for="nacionalidad" class="rainbow-text">Nacionalidad: </label>
                <select 
                  v-model="paciente.nacionalidad" 
                  :disabled="store.sharedData == 0" 
                  id="nacionalidad" 
                  :class="{ 'is-invalid': v$.nacionalidad.$invalid && v$.nacionalidad.$dirty }"
                >
                  <option value="0" disabled>Nacionalidades...</option>
                  <option 
                    v-for="nacionalidad in nacionalidadesDisponibles"
                    :key="nacionalidad.id" 
                    :value="nacionalidad.id"
                    :disabled="store.sharedData == 1 && nacionalidad.id == 1"
                  >{{ nacionalidad.nombre }}
                  </option>
                </select>
              </div>
              <!-- Campo Prevision -->
              <div class="form-group">
                <label for="prevision" class="rainbow-text">Previsión: </label>
                <select 
                  v-model="paciente.prevision_id" 
                  id="prevision" 
                  :disabled = "store.sharedData == 1"
                  :class="{ 'is-invalid': v$.prevision_id.$invalid && v$.prevision_id.$dirty }"
                >
                  <option value="0" disabled selected>Previsiones...</option>
                  <option
                    v-for="prevision in previsionDisponible" 
                    :value="prevision.id">
                    {{ prevision.nombre }}
                  </option>
                </select>
              </div>
              <div class="text-end mb-3 mt-5">
                <button
                  type="submit"
                  class="submit-btn"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 90%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  overflow-y: auto;
  max-height: 90vh;
}

.modal-header {
  background-color: #1F2937;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 15px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  flex: 0 0 30%; /* Ajusta este valor según necesites */
  margin-right: 10px;
}

.form-group input,
.form-group select {
  flex: 1;
  padding: 8px;
  border: 1px solid #16A085;
  border-radius: 4px;
  text-align: left;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #1F2937;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn {
  color: white;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-title,
.modal-description {
  text-align: left;
}
</style>