<template>
    <div v-if="isLoading" class="overlay">
      <div class="text-center">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-light mt-3">Cargando...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Definimos el prop que recibe el estado de carga
  const props = defineProps({
    isLoading: {
      type: Boolean,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  /* Estilos para el fondo opaco */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro con opacidad */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  </style>
  
  