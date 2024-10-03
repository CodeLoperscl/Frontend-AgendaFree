<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";


// Vuelidate, for more info and examples you can check out https://github.com/vuelidate/vuelidate
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import axios from "axios";
const router = useRouter();

const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;

// Input state variables
const state = reactive({
  username: null,
  password: null,
});

// Validation rules
const rules = computed(() => {
  return {
    username: {
      required,
      minLength: minLength(3),
    },
    password: {
      required,
      minLength: minLength(5),
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();
  if(result){
    
  }
}
</script>

<template>
  <BaseBlock class="mb-0">
    <template #options>
      <RouterLink
        :to="{ name: 'auth-reminder' }"
        class="btn-block-option fs-sm"
        >¿Olvidaste tu contraseña?</RouterLink
      >
      <RouterLink
        :to="{ name: 'auth-signup' }"
        class="btn-block-option"
      >
        <i class="fa fa-user-plus"></i>
      </RouterLink>
    </template>

    <div class="p-sm-3 px-lg-4 px-xxl-5 py-lg-5">
      <h1 class="h2 mb-1">OneUI</h1>
      <p class="fw-medium text-muted">Bienvenido, por favor inicia sesión.</p>

      <!-- Formulario de Iniciar Sesión -->
      <form @submit.prevent="onSubmit">
        <div class="py-3">
          <div class="mb-4">
            <input
              type="text"
              class="form-control form-control-alt form-control-lg"
              id="login-username"
              name="login-username"
              placeholder="Nombre de usuario"
              :class="{
                'is-invalid': v$.username.$errors.length,
              }"
              v-model="state.username"
              @blur="v$.username.$touch"
            />
            <div
              v-if="v$.username.$errors.length"
              class="invalid-feedback animated fadeIn"
            >
              Por favor, ingresa tu nombre de usuario
            </div>
          </div>
          <div class="mb-4">
            <input
              type="password"
              class="form-control form-control-alt form-control-lg"
              id="login-password"
              name="login-password"
              placeholder="Contraseña"
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
          </div>
          <div class="mb-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="login-remember"
                name="login-remember"
              />
              <label class="form-check-label" for="login-remember"
                >Recuérdame</label
              >
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div>
            <button type="submit" class="btn w-100 btn-alt-primary">
              <i class="fa fa-fw fa-sign-in-alt me-1 opacity-50"></i>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </form>
      <!-- FIN del Formulario de Iniciar Sesión -->
    </div>
  </BaseBlock>

</template>
