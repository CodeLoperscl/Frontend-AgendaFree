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


// Define particles options
const particlesOptions = ref({
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#16A085"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 5
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});


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
        <div class="modal-body">
          <vue-particles
            id="tsparticles"
            :options="particlesOptions" 
          />
          <p class="modal-description">
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
              <div class="text-end">
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes floatCircle {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, 20px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

@keyframes floatSquare {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, 20px) rotate(-90deg); }
  100% { transform: translate(0, 0) rotate(-180deg); }
}

@keyframes floatTriangle {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, -20px) rotate(45deg); }
  100% { transform: translate(0, 0) rotate(90deg); }
}

@keyframes rainbowThreeColors {
  0% { color: #1ABC9C; } /* Primer color */
  33% { color: #76da88; } /* Segundo color */
  66% { color: #0d6453; } /* Tercer color */
  100% { color: #1ABC9C; } /* Volver al primer color */
}

.rainbow-text {
  animation: rainbowThreeColors 5s linear infinite;
}

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
  animation: fadeIn 0.3s ease-out;
  overflow: hidden;
}

.modal-container {
  width: 100%;
  max-width: 1000px; /* Reducido de 1200px */
  max-height: 80vh; /* Limita la altura al 80% de la altura de la ventana */
  overflow-y: auto; /* Permite scroll si el contenido excede la altura */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  position: relative;
  z-index: 1;
  border: 5px solid;
  animation: borderRainbow 5s linear infinite;
}

.modal-header {
  background-color: #16A085;
  color: white;
  padding: 15px 20px; /* Reducido de 20px */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.3em; /* Reducido de 1.5em */
  font-weight: 600;
}

.close-btn {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
  opacity: 0.8;
}

.modal-body {
  padding: 20px; /* Reducido de 30px */
  width: 100%;
  max-width: 700px; /* Reducido de 800px */
  margin: 0 auto;
  position: relative; /* Ensure positioning context for absolute children */
  overflow: hidden; /* Hide overflow to keep animations within bounds */
}

.modal-description {
  color: #7F8C8D;
  margin-bottom: 15px; /* Reducido de 25px */
  font-size: 1em; /* Reducido de 1.1em */
  line-height: 1.4;
}

.form-group {
  margin-bottom: 15px; /* Reducido de 20px */
  text-align: left;
}

.form-group label {
  display: block;
  text-align: left;
  margin-bottom: 5px; /* Reducido de 8px */
  color: #2C3E50;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px; /* Reducido de 12px */
  border: 2px solid #BDC3C7;
  border-radius: 6px;
  font-size: 0.9em; /* Reducido de 1em */
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #16A085;
  box-shadow: 0 0 0 3px rgba(22, 160, 133, 0.2);
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 10px; /* Reducido de 14px */
  background-color: #16A085;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1em; /* Reducido de 1.1em */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #1ABC9C;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.is-invalid {
  border-color: #E74C3C !important;
}

.invalid-feedback {
  color: #E74C3C;
  font-size: 0.9em;
  margin-top: 5px;
}

.geometric-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.circle, .square, .triangle {
  position: absolute;
  opacity: 0.1;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #16A085;
  top: 10%;
  left: 10%;
  animation: floatCircle 3s infinite linear; /* Reduced duration */
}

.square {
  width: 80px;
  height: 80px;
  background-color: #1ABC9C;
  bottom: 15%;
  right: 15%;
  animation: floatSquare 4s infinite linear; /* Reduced duration */
}

.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 86.6px solid #2ECC71;
  top: 50%;
  left: 50%;
  animation: floatTriangle 2s infinite linear; /* Reduced duration */
}
@keyframes borderRainbow {
  0% { border-color: #1ABC9C; } /* Primer color */
  33% { border-color: #2ECC71; } /* Segundo color */
  66% { border-color: #31a762; } /* Tercer color */
  100% { border-color: #1ABC9C; } /* Volver al primer color */
}

.modal-container {
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
  position: relative;
  z-index: 1;
  border: 5px solid; /* Añadir borde */
  animation: borderRainbow 5s linear infinite; /* Aplicar animación */
}

</style>
