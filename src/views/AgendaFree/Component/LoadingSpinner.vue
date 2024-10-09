<template>
  <div v-if="isLoading" class="spinner-overlay">
    <div class="loader">
      <div class="orbe" style="--index: 0"></div>
      <div class="orbe" style="--index: 1"></div>
      <div class="orbe" style="--index: 2"></div>
      <div class="orbe" style="--index: 3"></div>
      <div class="orbe" style="--index: 4"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

// Definimos el prop que recibe el estado de carga
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
$blanco-marfil: #fafafa;
$verde-azulado: #16a085;
$verde-pastel: #d1f2eb;
/* Estilos para el fondo opaco */
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
.loader {
  --size-loader: 50px;
  --size-orbe: 10px;
  width: var(--size-loader);
  height: var(--size-loader);
  position: relative;
  transform: rotate(45deg);
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
</style>
