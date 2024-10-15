<script setup>
import { ref, computed } from 'vue';

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const horas = Array.from({ length: 12 }, (_, i) => i);

const semanaActual = ref(new Date());

const fechas = computed(() => {
  const primerDiaSemana = new Date(semanaActual.value);
  primerDiaSemana.setDate(primerDiaSemana.getDate() - primerDiaSemana.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(primerDiaSemana);
    fecha.setDate(fecha.getDate() + i);
    return fecha;
  });
});

const horarioSeleccionado = ref({});

const toggleHorario = (fecha, hora) => {
  const key = `${fecha.toISOString().split('T')[0]}-${hora}`;
  horarioSeleccionado.value[key] = !horarioSeleccionado.value[key];
};

const toggleDia = (fecha) => {
  const diaSeleccionado = horas.every(hora => 
    horarioSeleccionado.value[`${fecha.toISOString().split('T')[0]}-${hora}`]
  );
  
  horas.forEach(hora => {
    const key = `${fecha.toISOString().split('T')[0]}-${hora}`;
    horarioSeleccionado.value[key] = !diaSeleccionado;
  });
};

const toggleHora = (hora) => {
  const horaSeleccionada = fechas.value.every(fecha => 
    horarioSeleccionado.value[`${fecha.toISOString().split('T')[0]}-${hora}`]
  );
  
  fechas.value.forEach(fecha => {
    const key = `${fecha.toISOString().split('T')[0]}-${hora}`;
    horarioSeleccionado.value[key] = !horaSeleccionada;
  });
};

const isDiaSeleccionado = (fecha) => {
  return horas.every(hora => 
    horarioSeleccionado.value[`${fecha.toISOString().split('T')[0]}-${hora}`]
  );
};

const isHoraSeleccionada = (hora) => {
  return fechas.value.every(fecha => 
    horarioSeleccionado.value[`${fecha.toISOString().split('T')[0]}-${hora}`]
  );
};

const formatoFecha = (fecha) => {
  return fecha.getDate().toString().padStart(2, '0');
};

const formatoHora = (hora) => {
  return `${hora.toString().padStart(2, '0')}:00`;
};

const semanaSiguiente = () => {
  const nuevaFecha = new Date(semanaActual.value);
  nuevaFecha.setDate(nuevaFecha.getDate() + 7);
  semanaActual.value = nuevaFecha;
};

const semanaAnterior = () => {
  const nuevaFecha = new Date(semanaActual.value);
  nuevaFecha.setDate(nuevaFecha.getDate() - 7);
  semanaActual.value = nuevaFecha;
};
</script>

<template>
  <div class="calendario-configuracion">
    <div class="navegacion-semana">
      <button @click="semanaAnterior" class="btn-nav">&lt;</button>
      <span>{{ formatoFecha(fechas[0]) }} - {{ formatoFecha(fechas[6]) }}</span>
      <button @click="semanaSiguiente" class="btn-nav">&gt;</button>
    </div>
    <div class="calendario-grid">
      <div class="celda-hora"></div>
      <div v-for="(dia, index) in diasSemana" :key="index" class="celda-dia">
        <div class="dia-nombre">{{ dia }}</div>
        <div class="dia-fecha">{{ formatoFecha(fechas[index]) }}</div>
        <input type="checkbox" :checked="isDiaSeleccionado(fechas[index])" @change="toggleDia(fechas[index])">
      </div>
      <template v-for="hora in horas" :key="hora">
        <div class="celda-hora">
          {{ formatoHora(hora) }}
          <input type="checkbox" :checked="isHoraSeleccionada(hora)" @change="toggleHora(hora)">
        </div>
        <div v-for="fecha in fechas" :key="fecha.toISOString()" class="celda-horario">
          <input 
            type="checkbox" 
            :id="`${fecha.toISOString().split('T')[0]}-${hora}`"
            :checked="horarioSeleccionado[`${fecha.toISOString().split('T')[0]}-${hora}`]"
            @change="toggleHorario(fecha, hora)"
          >
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.calendario-configuracion {
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 900px;
  width: 100%;
}

.navegacion-semana {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1em;
  color: #333;
}

.semana-actual {
  font-weight: bold;
}

.btn-nav {
  background-color: transparent;
  border: none;
  font-size: 1.2em;
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s;
  padding: 5px 10px;
}

.btn-nav:hover {
  color: #0056b3;
}

.calendario-grid {
  display: grid;
  grid-template-columns: auto repeat(7, 1fr);
  gap: 1px;
  background-color: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
}

.celda-horario {
  background-color: #fff;
  padding: 8px 4px;
  text-align: center;
  font-size: 0.9em;
  border: 0.1rem solid #e9ecef;
}

.celda-dia {
  text-align: center;
  font-weight: bold;
  color: #495057;
}

.dia-nombre {
  font-size: 0.85em;
  text-transform: uppercase;
  color: #6c757d;
}

.dia-fecha {
  font-size: 1.1em;
  margin-top: 2px;
}

.celda-hora {
  font-weight: bold;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 0.85em;
}

input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #ced4da;
  border-radius: 3px;
  transition: all 0.2s;
}

input[type="checkbox"]:checked {
  background-color: #007bff;
  border-color: #007bff;
}

input[type="checkbox"]:checked::after {
  content: '\2714';
  display: block;
  text-align: center;
  color: white;
  font-size: 12px;
  line-height: 14px;
}

.celda-horario input[type="checkbox"] {
  margin: 0 auto;
  display: block;
  
}
</style>
