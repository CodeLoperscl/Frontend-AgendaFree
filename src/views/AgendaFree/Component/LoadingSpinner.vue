<template>
  <div v-if="showLoading" class="spinner-overlay">
    <div id="spinner"><img src="./loggo.svg" alt="Logo" /></div>
    
  </div>
  
</template>


<script setup>

import { defineProps, ref, watch } from 'vue';

// Definimos el prop que recibe el estado de carga
// const props = defineProps({
//   isLoading: {
//     type: Boolean,
//     required: true,
//   },
// });
const showLoading = ref(true);

// watch(props.isLoading, (newVal)=>{
//   showLoading = newVal;
// })
</script>

<style lang="scss" scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); // Fondo oscuro con opacidad
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

#spinner {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url('loggo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

@keyframes reboteGiroYDeformacion {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  5% { transform: translate(-50%, -58%) rotate(45deg) scale(0.95, 1.05); }
  10% { transform: translate(-50%, -65%) rotate(90deg) scale(0.9, 1.1); }
  15% { transform: translate(-50%, -70%) rotate(180deg) scale(0.85, 1.15); }
  20% { transform: translate(-50%, -80%) rotate(270deg) scale(0.8, 1.2); }
  25% { transform: translate(-50%, -80%) rotate(360deg) scale(0.75, 1.25); }
  30% { transform: translate(-50%, -78%) rotate(360deg) scale(0.8, 1.2); }
  35% { transform: translate(-50%, -75%) rotate(360deg) scale(0.85, 1.15); }
  40% { transform: translate(-50%, -70%) rotate(360deg) scale(0.9, 1.1); }
  45% { transform: translate(-50%, -60%) rotate(360deg) scale(0.95, 1.05); }
  50% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
  55% { transform: translate(-50%, -40%) rotate(360deg) scale(1.05, 0.95); }
  60% { transform: translate(-50%, -30%) rotate(360deg) scale(1.1, 0.9); }
  65% { transform: translate(-50%, -20%) rotate(360deg) scale(1.15, 0.85); }
  70% { transform: translate(-50%, -10%) rotate(360deg) scale(1.2, 0.8); }
  75% { transform: translate(-50%, 0%) rotate(360deg) scale(1.25, 0.75); }
  80% { transform: translate(-50%, -10%) rotate(360deg) scale(1.2, 0.8); }
  85% { transform: translate(-50%, -20%) rotate(360deg) scale(1.15, 0.85); }
  90% { transform: translate(-50%, -30%) rotate(360deg) scale(1.1, 0.9); }
  95% { transform: translate(-50%, -40%) rotate(360deg) scale(1.05, 0.95); }
  100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
}
#spinner {
  animation: reboteGiroYDeformacion 1.5s ease-in-out infinite;
}
</style>
