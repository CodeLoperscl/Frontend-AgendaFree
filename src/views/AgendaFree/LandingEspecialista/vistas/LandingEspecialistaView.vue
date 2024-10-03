<script setup>
import { defineEmits, ref, watch, onBeforeMount, onMounted, onBeforeUpdate } from "vue";
import ModalComponent from "../componentes/ModalDatosPacientes.vue";
import { useRoute, useRouter } from "vue-router";
import inputRut  from '../componentes/inputRut.vue';
import { reactive } from "vue";
import axios from "axios";
import { useEspecialistaDatos, useUrlApiEspecialista } from "../../stores/store";
import LoadingSpinner from "../../Component/LoadingSpinner.vue";

const isLoading = ref(true);
const storeEspecialista = useEspecialistaDatos();
const storeAPIEspecialista = useUrlApiEspecialista();
const persona = ref(
  {
    id: '',
    uid: '',
    username: '',
    estado_id: '',
    nombre: '',
    apellido: '',
  });
const rutPaciente = ref(null);
const modal = ref(false);
const route = useRoute();
const router = useRouter();
// Con el uid traere los datos del especialista
const uid = route.params.uid
const dataEspecialista = ref([]);
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;

const closeModal = () => {
  modal.value = false;
  //router.push({ name: 'agenda'});
};
const openModal = (data) => {
  rutPaciente.value = data;
  modal.value = true;
  console.log("data", rutPaciente.value);
}

const guardarDatos = () => {
  closeModal();
  //session.value = dataEspecialista.value.nombre;
  console.log("Hola desde cerrar modal");
};

const getEspecialista = () => {
  axios.get(API_GENERAL + "users/uid/"+uid)
  .then((response)=>{
    if(response){
      if(response.data.personas[0].profesionales[0].habilitado == true){
        if(response.data.personas[0].profesionales[0].ruta_api){
          storeAPIEspecialista.setUrl(response.data.personas[0].profesionales[0].ruta_api);
          //console.log(storeAPIEspecialista.url);
          dataEspecialista.value = response.data;
        }else{
          router.push({ path: '/error' });
        }
      }else{
        router.push({ path: '/error' }); 
      }
    }else{
      router.push({ path: '/error' });
    }
  })
  .catch((error)=>{
    console.log(error);
    router.push({ path: '/error' });
  });
}

onBeforeMount(()=>{
  getEspecialista();
  //isLoading.value = false;
});
onBeforeUpdate(()=>{
  isLoading.value = false;
})

watch(dataEspecialista, (newValue) => {
  // Esta función se ejecutará cuando dataEspecialista cambie
  const personaData = newValue.personas[0];
  persona.value = personaData;
  storeEspecialista.setEspecialista(persona.value)
  console.log("store especialista: ",storeEspecialista.especialista)
});

onMounted(() => {
  setTimeout(() => {
    document.querySelector('.hero-content').style.animationPlayState = 'running';
  }, 100);
});
</script>

<template>
  <LoadingSpinner :isLoading="isLoading" />
  <div class="hero d-flex align-items-center justify-content-center">
    <div class="animated-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    <div class="hero-content" transition-style="in:circle:hesitate">
      <div class="content content-full text-center">
        <i class="fa fa-4x fa-stethoscope text-primary mb-5"></i>
        <h1 class="fw-bold mb-4">Sistema de Reservas Online</h1>
        <h2 class="fw-light mb-5">Dr. {{ persona.nombre + " " + persona.apellido }}</h2>
        
        <div class="row justify-content-center">
          <div class="col-12 col-xl-10">
            <div class="bg-card p-5 rounded shadow-lg">
              <p class="fs-4 fw-medium text-dark mb-4">
                Para solicitar una hora de atención, ingrese su RUT y presione continuar.
              </p>
              <div class="input-container">
                <inputRut @abrirModal="openModal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Definición de variables de color
$verde-azulado: #16A085;
$blanco-marfil: #FAFAFA;
$azul-marino: #2C3E50;
$gris-acero: #95A5A6;
$verde-pastel: #D1F2EB;

@keyframes circle-in-hesitate {
  0% {
    clip-path: circle(0%);
  }
  40% {
    clip-path: circle(40%);
  }
  100% {
    clip-path: circle(125%);
  }
}

.hero {
  min-height: 100vh;
  background-color: $blanco-marfil;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.hero-content {
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 4rem 2rem;
  background-color: rgba($blanco-marfil, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: 2.5s cubic-bezier(.25, 1, .30, 1) circle-in-hesitate both;
  animation-play-state: paused;
  position: relative;
  z-index: 2;
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.shape {
  position: absolute;
  background: rgba($verde-azulado, 0.1);
  border-radius: 50%;
  animation: float 20s infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: -7s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 50%;
  left: 50%;
  animation-delay: -13s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(50px) rotate(180deg);
  }
}

h1 {
  font-size: 3rem;
  color: $azul-marino;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.8rem;
  color: $gris-acero;
  margin-bottom: 3rem;
}

.bg-card {
  background-color: $verde-pastel;
  padding: 3rem !important;
}

.input-container {
  margin-top: 2rem;
}

.text-primary {
  color: $verde-azulado !important;
}

.text-dark {
  color: $azul-marino !important;
}

:deep(.input-group) {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-wrap: nowrap;
}

:deep(.form-control) {
  flex: 1;
  font-size: 1.5rem;
  height: 70px;
  padding: 1rem 1.5rem;
  border: 2px solid $verde-azulado;
}

:deep(.btn-primary) {
  min-width: 200px;
  height: 70px;
  font-size: 1.5rem;
  padding: 1rem 2rem;
  background-color: $verde-azulado;
  border-color: $verde-azulado;
  transition: all 0.3s ease;

  &:hover {
    background-color: darken($verde-azulado, 10%);
    border-color: darken($verde-azulado, 10%);
  }
}

// Ajustes adicionales para dispositivos móviles
@media (max-width: 768px) {
  .hero-content {
    padding: 3rem 1.5rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .bg-card {
    padding: 2rem !important;
  }

  :deep(.input-group) {
    flex-direction: column;
  }

  :deep(.form-control),
  :deep(.btn-primary) {
    width: 100%;
    margin-top: 1rem;
    height: 60px;
    font-size: 1.25rem;
  }
}
</style>