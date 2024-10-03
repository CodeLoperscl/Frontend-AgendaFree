<script setup>
import { onBeforeMount, reactive, ref, computed, watch} from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useMainStore, usePacienteDatos, usePersonaPacienteDatos } from "../../stores/store";
import axios from 'axios';
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";

//Variables
const storePersonaPaciente = usePersonaPacienteDatos();
const dataPaciente = ref();
const storePaciente = usePacienteDatos();
const store = useMainStore();
const showReservarHora = ref(false);
const router = useRouter();
const tipoCampo = ref("RUT");
const previsionSeleccionada = ref(0);
const previsionDisponible = ref();
//API 
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;
const API_ESPECIALISTA = import.meta.env.VITE_URL_API_ESPECIALISTA;

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
  nacionalidad: computed(()=>{
    //Chileno
    if(store.sharedData == 0){
      return 1;
    }else{
      //Nacionalidad...
      return 0;
    };
  })
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
  prevision: { 
    required,
    notZero: helpers.withMessage('La nacionalidad no puede ser 0', (value) => value !== 0)
  }
}));
//Inicializar Vuevalidate
const v$ = useVuelidate(reglas, paciente)

function sendData() {
  // Enviar datos a API
  emit("submit-data");
}
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
    }
    console.log("Nuevo paciente chileno: ",nuevaPersonaChilena);
  }
  if(store.sharedData == 1){
    nuevaPersonaExtranjera.value = {
      "nombre": paciente.nombre,
      "apellido":paciente.apellido,
      "rut": props.rut,
      "email": paciente.email,
      "fono": paciente.fono,
      "nacionalidad_id": paciente.nacionalidad,
    }
    console.log("Nuevo paciente extranjero: ",nuevaPersonaExtranjera);
  }
  console.log(API_GENERAL+"persona", store.sharedData == 0 ? nuevaPersonaChilena.value : nuevaPersonaExtranjera.value);
  axios.post(API_GENERAL+"persona", store.sharedData == 0 ? nuevaPersonaChilena.value : nuevaPersonaExtranjera.value)
    .then((response)=>{
      if(response){
        dataPaciente.value = response.data;
        showReservarHora.value = !showReservarHora.value;
        if (showReservarHora.value) {
          storePaciente.setPaciente(response.data.paciente);
          storePersonaPaciente.setPersona(response.data);
          console.log("Paciente en store: ", storePaciente.getPaciente());
          router.push({ name: 'modulo-reserva' });
        } else {
          router.push({ name: 'agenda' });
        }
      }else{
        showReservarHora.value = true;
      }
    });
}

const getDataPrevisiones = () =>{
  axios.get(API_ESPECIALISTA + "/prevision")
    .then((response) =>{
      if(response){
        previsionDisponible.value = response.data.previsiones.filter(prevision => prevision.estado_id === 3);
      }
    })
    .catch((e)=>{
      if(e){
        console.log(e);
      }
    });
}
const nacionalidadesDisponibles = ref();
const getDataNacionalidades = () =>{
  axios.get(API_GENERAL + "/nacionalidad")
    .then((response) =>{
      if(response){
        nacionalidadesDisponibles.value = response.data.nacionalidades.filter(nacionalidad => nacionalidad.estado_id === 1);
      }
    })
    .catch((e)=>{
      if(e){
        console.log(e);
      }
    });
}


onBeforeMount(()=>{
  getDataPrevisiones();
  getDataNacionalidades();
})
</script>

<template>
  <div v-if="props.isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <BaseBlock transparent>
          <template #content>
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn-block-option"
                aria-label="Close"
                @click='emit("modal-close")'
              >
                <i class="fa fa-fw fa-times"></i>
              </button>
            </div>
            <h4 class="mb-0 mt-3">Bienvenid@</h4>
            <p class="fs-lg fw-medium text-muted mb-4">
              Para solicitar hora de atención por favor ingrese sus datos y presione continuar
            </p>
            <div>
              <div class="mb-3 form-group">
                <label class="form-label" for="rut">{{ tipoCampo }}: </label>
                <input id="rut" class="form-control" type="text" :value="props.rut" disabled>
              </div>
              <!-- Campo Nombre -->
              <div class="mb-3 form-group">
                <label class="form-label" for="nombre">Nombre: </label>
                <input 
                  v-model="paciente.nombre"
                  id="nombre" 
                  class="form-control" 
                  type="text" 
                  placeholder="Nombre"
                  :class="{'is-invalid': v$.nombre.$invalid && v$.nombre.$dirty}"
                >
                <div v-if="v$.nombre.$invalid && v$.nombre.$dirty" class="invalid-feedback">
                  El nombre es obligatorio y debe tener al menos 2 caracteres.
                </div>
              </div>

              <!-- Campo Apellido -->
              <div class="mb-3 form-group">
                <label class="form-label" for="apellido">Apellido: </label>
                <input 
                  v-model="paciente.apellido" 
                  id="apellido" 
                  class="form-control" 
                  type="text" 
                  placeholder="Apellido" 
                  :class="{ 'is-invalid': v$.apellido.$invalid && v$.apellido.$dirty }"
                >
                <div v-if="v$.apellido.$invalid && v$.apellido.$dirty" class="invalid-feedback">
                  El apellido es obligatorio y debe tener al menos 2 caracteres.
                </div>
              </div>
              <!-- Campo Email -->
              <div class="mb-3 form-group">
                <label class="form-label" for="email">Email: </label>
                <input 
                  v-model="paciente.email" 
                  id="email" 
                  class="form-control" 
                  type="email" 
                  placeholder="Email" 
                  :class="{ 'is-invalid': v$.email.$invalid && v$.email.$dirty }"
                >
                <div v-if="v$.email.$invalid && v$.email.$dirty" class="invalid-feedback">
                  Debes ingresar un correo electrónico válido.
                </div>
              </div>

              <!-- Campo Telefono -->
              <div class="mb-3 form-group">
                <label class="form-label" for="telefono">Teléfono: </label>
                <input 
                  v-model="paciente.fono" 
                  id="telefono" 
                  class="form-control" 
                  type="text" 
                  placeholder="+56935281541" 
                  :class="{ 'is-invalid': v$.fono.$invalid && v$.fono.$dirty }"
                >
                <div v-if="v$.fono.$invalid && v$.fono.$dirty" class="invalid-feedback">
                  El teléfono es obligatorio y debe tener al menos 8 caracteres.
                </div>
              </div>

              <!-- Campo Nacionalidad -->
              <div class="mb-3 form-group">
                <label for="nacionalidad" class="form-label">Nacionalidad: </label>
                <select 
                  v-model="paciente.nacionalidad" 
                  :disabled="store.sharedData == 0" 
                  id="nacionalidad" 
                  class="form-select"
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
                <div v-if="v$.nacionalidad.$invalid && v$.nacionalidad.$dirty" class="invalid-feedback">
                  Selecciona una nacionalidad.
                </div>
              </div>
              <!-- Campo Prevision -->
              <div class="mb-3 form-group">
                <label for="prevision" class="form-label">Previsión: </label>
                <select 
                  v-model="paciente.prevision" 
                  id="prevision" 
                  class="form-select" 
                  :disabled = "store.sharedData == 1"
                  :class="{ 'is-invalid': v$.prevision.$invalid && v$.prevision.$dirty }"
                >
                  <option value="0" disabled selected>Previsiones...</option>
                  <option 
                    v-for="prevision in previsionDisponible" 
                    :value="prevision.id">
                    {{ prevision.nombre }}
                  </option>
                </select>
                <div v-if="v$.prevision.$invalid && v$.prevision.$dirty" class="invalid-feedback">
                  Selecciona una previsión.
                </div>
              </div>
              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="togglecomponent"
                >
                  Continuar
                </button>
              </div>
            </div>
          </template>
        </BaseBlock>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 600px) {
  .modal-container {
    width: 90% !important;
    margin: 50px auto;
  }
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  width: 50%;
  margin: 100px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.pointer {
  cursor: pointer;
}
</style>
