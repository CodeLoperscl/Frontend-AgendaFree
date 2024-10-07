<script setup>
import { reactive, computed, onBeforeMount, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import { useUrlApiEspecialista } from "../stores/store"
import axios from "axios";
// Vuelidate, for more info and examples you can check out https://github.com/vuelidate/vuelidate
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

const token = ref();
const usuarioVista = reactive({
  "username": "visita",
  "password": "2843bc16"
});
// Main store and Router
const store = useTemplateStore();
const storeAPIEspecialista = useUrlApiEspecialista();
const router = useRouter();
const route = useRoute();

//API GENERAL
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;

//Datos del especialista
const dataEspecialista = ref("");

//Parametro uid
const uid = route.params.uid
console.log(uid);

const autoLogin = async () => {
  try {
    const response = await axios.post(`${API_GENERAL}auth/login`, usuarioVista);
    if (response) {
      token.value = {
        headers: {
          "x-token": response.data.token
        }
      }
      getEspecialista();
      console.log('Usuario autenticado:', response.data.token);
    } else {
      console.error('Error al autenticar al usuario:', response.data);
    }
  } catch (error) {
    console.error('Error al autenticar al usuario:', error);
    router.push({ path: '/error' });
  }
}


// Verificar si existe especialista por uid
const getEspecialista = async () => {
  try {
    const response = await axios.get(`${API_GENERAL}users/uid/${uid}`, token.value);
    
    if (!response || !response.data.personas || !response.data.personas[0]) {
      throw new Error('Respuesta inválida');
    }

    const profesional = response.data.personas[0].profesionales[0];
    
    if (!profesional || !profesional.habilitado || !profesional.ruta_api) {
      throw new Error('Profesional no habilitado o sin ruta API');
    }

    storeAPIEspecialista.setUrl(profesional.ruta_api);
    dataEspecialista.value = response.data.personas[0];
    state.username = dataEspecialista.value.rut;
    console.log(dataEspecialista.value);
  } catch (error) {
    console.error('Error al obtener datos del especialista:', error);
    router.push({ path: '/error' });
  }
};
// Input state variables
const state = reactive({
  username: null,
  password: null,
});

// Validación personalizada para verificar isCorrect
const checkPasswordError = () => {
  return !state.isCorrect;
};

// Validation rules
const rules = computed(() => {
  return {
    password: {
      required,
      minLength: minLength(5),
      customError: checkPasswordError // Agregamos la regla personalizada
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);
const esCorrecto = ref(false);

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();
  if (!result) {
    // notify user form is invalid
    console.log("incorrecto")
    
    return;
  }

  axios.post(API_GENERAL+"auth/login", state)
    .then((response)=>{
      if(response){
        console.log(response.status);
        if(response.status === 200){
          sessionStorage.setItem("especialista-token", response.data.token);
          router.push({ name: "backend-dashboard" });
        }
      }
    }).catch((e)=>{
      if(e.response.status === 400){
        console.log("Error de clave");
        esCorrecto.value = true;
      }
    });
  // Go to dashboard
  //router.push({ name: "backend-dashboard" });
}

//Comprobar si hay sesion
const isSession = () =>{
  const session = sessionStorage.getItem("especialista-token");
  if(session){
    router.push({ name: "backend-dashboard" });
  }
}

watch(()=> state.password, (newPassword)=>{
  if(newPassword && newPassword.length < 5){
    esCorrecto.value = false;
  }
});


onBeforeMount(async ()=>{
  await autoLogin();
  await isSession();
});
onMounted(()=>{
 //autoLogin();
})

</script>

<template>
  <!-- Page Content -->
  <div class="bg-danger">
    <div class="row g-0 bg-primary">
      <!-- Meta Info Section -->
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
              Agenda<span class="fw-normal">Free</span>
            <p class="text-white-75 me-xl-8 mt-2">

            </p>
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline mb-0 py-2">
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Meta Info Section -->

      <!-- Main Section -->
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
              <p class="mb-3">
                <i class="fa fa-2x fa-circle-notch text-primary-light"></i>
              </p>
              <h1 class="fw-bold mb-2">Iniciar sesion</h1>
              <p class="fw-medium text-muted mb-5">
                Por favor, ingrese su contraseña para ingresar a su cuenta
              </p>
              <img
                class="img-avatar img-avatar96"
                src="/assets/media/avatars/avatar10.jpg"
                alt=""
              />
              <p class="fw-semibold text-center my-2">{{ dataEspecialista.email }}</p>
            </div>
            <!-- END Header -->

            <!-- Unlock Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="lock-password"
                      name="lock-password"
                      placeholder="Contraseña.."
                      :class="{
                        'is-invalid': v$.password.$errors.length,
                      }"
                      v-model="state.password"
                      @blur="v$.password.$touch"
                    />
                    <div
                      v-if="v$.password.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Por favor, ingresa tu contraseña
                    </div>
                    <div v-if="esCorrecto" class="clave-invalida"
                    >
                    La contraseña ingresada es incorrecta.
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-lg btn-alt-success">
                      <i class="fa fa-fw fa-lock-open me-1 opacity-50"></i>
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Unlock Form -->
          </div>
        </div>
        <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Main Section -->
    </div>
  </div>
  <!-- END Page Content -->
</template>

<style>
.clave-invalida{
  width: 100%;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #dc2626;
}
</style>
