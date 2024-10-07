<script setup>
import { validateRut, formatRut } from '@fdograph/rut-utilities';
import { defineEmits, onBeforeMount, onMounted, ref } from "vue";
import { useMainStore, usePacienteDatos, usePersonaPacienteDatos, useUrlApiEspecialista } from '../../stores/store';
import axios from 'axios';
import { useRouter } from 'vue-router';
import LoadingSpinner from '../../Component/LoadingSpinner.vue';
import ModalComponent from './ModalDatosPacientes.vue';

//Modal
const modal = ref(false);

//Store
//const storeAPIEspecialista = useUrlApiEspecialista();
const storePersonaPaciente = usePersonaPacienteDatos();
const storePaciente = usePacienteDatos();
const store = useMainStore();
//API
const URL_API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;
//const API_ESPECIALISTA = storeAPIEspecialista.getUrl();

//Vue Router
const router = useRouter();

//RUT/DNI
const rutInput = ref('');
const rutState = ref(false);
const rutValidated = ref('');

//Estados
const isLoading = ref(false);
const estado = ref(0);

//Informacion
const dataPaciente = ref();

//TOKEN
const getToken = () =>{
  return {
    headers: {
      "x-token": sessionStorage.getItem("token")
    }
  }
};
//Modal Crear nuevo paciente
const updateStoreData = () => {
    store.updateData(estado.value);
}
const emitAbrirModal = () =>{
    openModal();
    //emit('abrirModal', rutValidated.value);
    updateStoreData();
}


const openModal = () => {
  modal.value = true;
  console.log("data");
}
const closeModal = () => {
  modal.value = false;
  //router.push({ name: 'agenda'});
};
const guardarDatos = () => {
  closeModal();
  //session.value = dataEspecialista.value.nombre;
  console.log("Hola desde cerrar modal");
};

//Verificar rut
const verificarRut = () => {
    rutState.value = validateRut(rutInput.value);
    rutValidated.value = formatRut(rutInput.value);
}
//Formatear rut
const formatearRut = () =>{
    rutInput.value = rutValidated.value;
}
const inputExtranjero = () =>{
    estado.value = 1;
    rutValidated.value = '';
}
const inputChileno = () =>{
    estado.value = 0;
    rutInput.value = '';
}
const arrayTipo = [
    {
        "tipo": "RUT",
        "ejemplo": "Rut Ej: 17463223-K",
    },
    {
        "tipo":"DNI",
        "ejemplo": "Ingrese su DNI",
    },
];

// const getPaciente = (identificador) =>{
//     isLoading.value = true;
//     axios.get(URL_API_GENERAL + "persona/rut/" + identificador)
//         .then((response)=>{
//             if(response){
//                 if(response.status === 200){
//                     //Persona existe en la api general
//                     //Si persona existe, buscar paciente en API especialista con id del paciente
//                     axios.get(API_ESPECIALISTA)
//                 }
//             }
//         })
// }

//Buscar paciente
const getPaciente = async (identificador) => {
  isLoading.value = true;
  console.log("token desde Input", getToken());
  axios.get(`${URL_API_GENERAL}persona/rut/${identificador}`, getToken())
  .then((response)=>{
      if(response){
          dataPaciente.value = response.data.paciente;
          console.log(dataPaciente.value);
          storePaciente.setPaciente(dataPaciente.value);
          storePersonaPaciente.setPersona(response.data);
          console.log("store paciente: ", storePaciente.getPaciente());
          router.push({ name: 'modulo-reserva'});
      }
  })
  .catch((error)=>{
      console.log("Error: ", error);
      emitAbrirModal();
  }).finally(()=>{
    isLoading.value = false;
  });

    // try {
    //     const buscarPersona = await axios.get(URL_API_GENERAL + "persona/rut/" + identificador);
    //     //Primero busco si persona existe
    //     if (buscarPersona.status === 200) {
    //         //Si persona existe, buscare a paciente en la base de datos del especialista
    //         //Buscar si persona existe en la base de datos del especialista api-especialista/api/persona/idpersona
    //             //Si existe paciente, realizar un post a la api del especialista para crear paciente enviando el id de persona, si paciente existe
    //             //devuelve error 400 y si no existe 200 y se registra
    //             //En ambos casos lleva al calendario
    //         //Pero, si paciente no existe, se registra paciente a traves del modal de registo de persona, se crea persona y paciente (en la api de 
    //         //especialista) y redirige a calendario
    //         dataPaciente.value = response.data.paciente;
    //         console.log(dataPaciente.value);
    //         storePaciente.setPaciente(dataPaciente.value);
    //         storePersonaPaciente.setPersona(response.data);
    //         console.log("store paciente: ", storePaciente.getPaciente());
    //         router.push({ name: 'modulo-reserva'});
    //         isLoading.value = false;
    //     }
    // } catch (error) {
    //     if (error.response && error.response.status === 404) {
    //         isLoading.value = false;
    //         emitAbrirModal();
    //     } else {
    //         isLoading.value = false;
    //         console.error("Error inesperado:", error);
    //         // Manejar otros errores si es necesario
    //     }
    // }
};

</script>

<template>
  <LoadingSpinner :isLoading="isLoading" />
  <div class="row mt-3 justify-content-center">
    <div class="col-12 col-md-10 col-lg-8">
      <div v-show="estado == 0" class="input-rut">
        <input
          type="text"
          class="form-control"
          :class="{'text-info': !rutState}"
          :placeholder="arrayTipo[0].ejemplo"
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
      <div v-show="estado == 1" class="input-rut">
        <input
          type="text"
          class="form-control"
          :placeholder="arrayTipo[1].ejemplo"
          v-model="rutValidated"
        />
        <button
          type="button"
          class="btn btn-primary"
          v-click-ripple
          @click="getPaciente(rutValidated)"
        >
          CONTINUAR
          <i class="fa fa-fw fa-arrow-right"></i>
        </button>
      </div>
      <div class="mt-2 text-center">
        <a v-if="estado == 0" href="#" @click.prevent="inputExtranjero()" class="toggle-input">Ingresar con {{ arrayTipo[1].tipo }}</a>
        <a v-else-if="estado == 1" href="#" @click.prevent="inputChileno()" class="toggle-input">Ingresar con {{ arrayTipo[0].tipo }}</a>
      </div>
    </div>
  </div>
  <ModalComponent
    :isOpen="modal"
    :rut = "rutValidated"
    @modal-close="closeModal"
    @submit-data="guardarDatos"
  ></ModalComponent>
</template>

<style lang="scss" scoped>
// Definición de variables de color
$verde-azulado: #16A085;
$blanco-marfil: #FAFAFA;
$azul-marino: #2C3E50;
$gris-acero: #95A5A6;
$verde-pastel: #D1F2EB;

.input-rut {
  display: flex;
  align-items: center; // Alinea verticalmente el input y el botón
  
  .form-control {
    height: 40px; // Ajusta esto si es necesario para que coincida con tu input actual
    font-size: 1rem;
    background-color: $blanco-marfil;
    border: 2px solid $gris-acero; // Borde más visible
    color: $azul-marino;
    margin-bottom: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 8px; // Bordes más redondeados
    
    @media (min-width: 768px) {
      margin-bottom: 0;
      margin-right: 1rem; // Más espacio entre input y botón
    }
    
    &:focus {
      border-color: $verde-azulado;
      box-shadow: 0 0 0 0.2rem rgba($verde-azulado, 0.25);
    }
  }
  
  .btn-primary {
    height: 40px; // Igual que la altura del input
    font-size: 0.75rem; // Mantenemos el tamaño de fuente pequeño
    padding: 0 1rem; // Ajustamos el padding horizontal
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap; // Evita que el texto se divida en dos líneas
    
    background-color: $verde-azulado;
    border-color: $verde-azulado;
    color: $blanco-marfil;
    font-weight: 600;
    transition: all 0.3s ease;
    border-radius: 6px; // Mantenemos el radio de borde original
    min-width: 120px; // Mantenemos el ancho mínimo original
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
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
      font-size: 0.7rem; // Reducido el tamaño del icono
    }
  }
}

.toggle-input {
  color: $verde-azulado;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem; // Más espacio arriba
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