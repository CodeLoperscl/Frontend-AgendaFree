<script setup>
import { ref, onBeforeMount, onMounted, reactive } from "vue";
// import ModalComponent from "../componentes/ModalDatosPacientes.vue";
import { useRoute, useRouter } from "vue-router";
import inputRut from "../componentes/inputRut.vue";
import axios from "axios";
import {
  useEspecialistaDatos,
  useUrlApiEspecialista,
} from "../../stores/store";
import LoadingSpinner from "../../Component/LoadingSpinner.vue";

//Usuario visita
const usuarioVista = reactive({
  username: "visita",
  password: "2843bc16",
});
//token
const token = ref(null);
const isLoading = ref(true);
const storeEspecialista = useEspecialistaDatos();
const storeAPIEspecialista = useUrlApiEspecialista();
const persona = ref({
  id: "",
  uid: "",
  username: "",
  estado_id: "",
  nombre: "",
  apellido: "",
  abreviatura: "",
});
const rutPaciente = ref(null);
const route = useRoute();
const router = useRouter();
// Con el uid traere los datos del especialista
const uid = route.params.uid;
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;

const getProfesional = async () => {
  try {
    const response = await axios.get(
      `${API_GENERAL}users/uid/${uid}`,
      token.value
    );

    if (!response || !response.data) {
      throw new Error("No se recibieron datos");
    }
    console.log("response profesional: ", response.data);
    const profesional = response.data.personas[0]?.profesionales[0];

    if (!profesional || !profesional.habilitado || !profesional.ruta_api) {
      throw new Error("Profesional no válido o no habilitado");
    }
    storeAPIEspecialista.setUrl(profesional.ruta_api);
    persona.value.id = response.data.personas[0].id;
    persona.value.uid = response.data.uid;
    persona.value.username = response.data.username;
    persona.value.estado_id = response.data.estado_id;
    persona.value.nombre = response.data.personas[0].nombre;
    persona.value.apellido = response.data.personas[0].apellido;
    await getEspecialista(
      profesional.persona_id,
      response.data.personas[0]?.nombre,
      response.data.personas[0]?.apellido,
      response.data.personas[0]?.profesionales[0].max_dias_atencion
    );
  } catch (error) {
    console.error("Error al obtener datos del especialista:", error);
    router.push({ path: "/error" });
  }
};

const getEspecialista = (persona_id, nombre, apellido, dias_atencion) => {
  axios
    .get(
      `${storeAPIEspecialista.getURL()}api/especialista/persona/${persona_id}`,
      token.value
    )
    .then((response) => {
      response.data.max_dias_atencion = dias_atencion;
      response.data.nombre = nombre;
      response.data.apellido = apellido;
      storeEspecialista.setEspecialista(response.data);
      console.log("store especialista 1: ", storeEspecialista.especialista);
      persona.value.abreviatura =
        storeEspecialista.especialista.especialista.especialidades[0].abreviatura;
    })
    .catch((error) => {
      console.error("Error al obtener datos del especialista:", error);
    });
};

const autoLogin = async () => {
  try {
    const response = await axios.post(`${API_GENERAL}auth/login`, usuarioVista);
    if (response) {
      sessionStorage.setItem("token", response.data.token);
      token.value = {
        headers: {
          "x-token": response.data.token,
        },
      };
      console.log("Usuario autenticado:", response.data.token);
    } else {
      console.error("Error al autenticar al usuario:", response.data);
    }
  } catch (error) {
    console.error("Error al autenticar al usuario:", error);
    router.push({ path: "/error" });
  }
};

onBeforeMount(async () => {
  await autoLogin();
  await getProfesional();
  isLoading.value = false;
});

const particlesOptions = ref({
  background: {
    color: {
      value: "#ffffff",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#16A085",
    },
    links: {
      color: "#ffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: "bounce",
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
});

onMounted(() => {
  setTimeout(() => {
    document.querySelector(".hero-content").style.animationPlayState =
      "running";
  }, 100);
});
</script>

<template>
  <!-- <LoadingSpinner :isLoading="isLoading" /> -->
  <div v-if="isLoading" class="spinner-overlay">
    <div class="loader">
      <div class="orbe" style="--index: 0"></div>
      <div class="orbe" style="--index: 1"></div>
      <div class="orbe" style="--index: 2"></div>
      <div class="orbe" style="--index: 3"></div>
      <div class="orbe" style="--index: 4"></div>
    </div>
  </div>
  <div class="hero d-flex align-items-center justify-content-center">
    <div class="animated-background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    <div
      class="hero-content pb-0 text-center"
      transition-style="in:circle:hesitate"
    >
      <div class="content content-full text-center">
        <!-- <i class="fa fa-4x fa-stethoscope text-primary mb-5"></i> -->
        <h1 class="fw-bold my-3">Agenda tu cita online con</h1>
        <h2 class="fw-light mb-5">
          {{ persona.abreviatura }}.
          {{ persona.nombre + " " + persona.apellido }}
        </h2>

        <div class="row justify-content-center">
          <div class="col-12 col-xl-10">
            <div class="bg-card p-5 rounded shadow-lg">
              <p class="fs-5 fw-medium text-dark mb-4">
                Para solicitar una hora de atención, ingrese su RUT y presione
                continuar.
              </p>
              <div class="input-container">
                <inputRut />
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/assets/media/AGFree/logo_v1_2.svg"
        class="mt-5 mb-5"
        width="70"
        alt="Logo Agenda Free"
      />
      <div class="shadow"></div>
    </div>
  </div>

  <vue-particles
    id="tsparticles"
    :options="particlesOptions"
    @particles-loaded="particlesLoaded"
  />
</template>

<style lang="scss">
// Definición de variables de color
$verde-azulado: #16a085;
$blanco-marfil: #fafafa;
$azul-marino: #2c3e50;
$gris-acero: #95a5a6;
$verde-pastel: #d1f2eb;

.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  display: block;
  width: 100%; /* Ajusta el tamaño de la imagen si es necesario */
}

.shadow {
  position: absolute;
  bottom: 48px; /* Ajusta la distancia de la sombra debajo de la imagen */
  left: 50%;
  transform: translateX(-50%);
  width: 7%; /* Ajusta el tamaño horizontal del óvalo */
  height: 10px; /* Ajusta el grosor del óvalo */
  background-color: rgba(
    0,
    0,
    0,
    0
  ); /* Color negro con opacidad para suavizar */
  border-radius: 45%; /* Crea el efecto de óvalo */
  z-index: -1; /* Coloca la sombra debajo de la imagen */
  box-shadow: 0 1.5rem 0.5rem rgba(0, 0, 0, 0.15) !important;
}

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
  animation: 2.5s cubic-bezier(0.25, 1, 0.3, 1) circle-in-hesitate both;
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
  0%,
  100% {
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
  .hero {
    overflow: scroll !important;
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

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($blanco-marfil, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  --size-loader: 50px;
  --size-orbe: 10px;
  width: var(--size-loader);
  height: var(--size-loader);
  position: relative;
  transform: rotate(45deg);
}

.orbe {
  position: absolute;
  width: 100%;
  height: 100%;
  --delay: calc(var(--index) * 0.1s);
  animation: orbit7456 ease-in-out 1.5s var(--delay) infinite;
  opacity: calc(1 - calc(0.2 * var(--index)));
}

.orbe::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: var(--size-orbe);
  height: var(--size-orbe);
  background-color: $verde-azulado;
  box-shadow: 0px 0px 20px 2px $verde-azulado;
  border-radius: 50%;
}

@keyframes orbit7456 {
  0% {
  }

  80% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
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
