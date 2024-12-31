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
      <button @click="semanaAnterior" class="btn-nav"><i class="fas fa-chevron-left"></i></button>
      <span class="semana-texto">{{ formatoFecha(fechas[0]) }} - {{ formatoFecha(fechas[6]) }}</span>
      <button @click="semanaSiguiente" class="btn-nav"><i class="fas fa-chevron-right"></i></button>
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
          <p>{{ formatoHora(hora) }}</p>
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
  font-family: 'Roboto', sans-serif;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px; /* Incrementa el max-width o elimínalo si quieres que ocupe el 100% */
  width: 90%; /* Cambia a un porcentaje mayor para ocupar más espacio */
  color: #333;
}


.navegacion-semana {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1em;
  color: #333;
  gap: 10px;
}

.semana-texto {
  font-size: 1.2em;
  font-weight: 500;
  background-color: #f0f4f8;
  padding: 8px 16px;
  border-radius: 8px;
  color: #333;
}

.btn-nav {
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  font-size: 1.4em;
  color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  padding: 8px;
}

.btn-nav {
  background-color: #f0f4f8;
  border: none;
  border-radius: 50%;
  font-size: 1.2em;
  color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  padding: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-nav:hover {
  background-color: #007bff;
  color: #fff;
}

.calendario-grid {
  display: grid;
  grid-template-columns: auto repeat(7, 1fr);
  gap: 0;
  background-color: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.celda-hora {
  display: flex;
  flex-direction: row; /* Asegura que los elementos estén en fila */
  align-items: center; /* Centra verticalmente el texto y el checkbox */
  justify-content: start; /* Alinea los elementos al inicio */
  gap: 4px; /* Reduce el espacio entre la hora y el checkbox */
  font-weight: 500;
  color: #495057;
  padding: auto;
  padding-right: 4px;
  background-color: #ffffff;
  font-size: 0.85em;
}

.celda-hora p {
  margin: 1rem; /* Elimina márgenes en el <p> para una mejor alineación */
  min-width: 20px; /* Establece un ancho mínimo para que el texto no salte de línea */
}

.celda-dia {
  text-align: center;
  padding: 8px;
  background-color: #ffffff; /* Fondo blanco */
  border-bottom: 1px solid #e9ecef;
}

.dia-nombre {
  font-size: 0.85em;
  text-transform: uppercase;
  color: #6c757d;
}

.dia-fecha {
  font-size: 1.1em;
  font-weight: 600;
  color: #007bff;
}

.celda-horario {
  padding: 12px;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
}

input[type="checkbox"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

input[type="checkbox"]:checked {
  background-color: #007bff;
  border-color: #007bff;
}

input[type="checkbox"]:checked::after {
  content: '✔';
  font-size: 14px;
  color: white;
}

input[type="checkbox"]:hover {
  border-color: #007bff;
}

.celda-horario input[type="checkbox"] {
  margin: 0 auto;
  display: block;
}

.calendario-grid input[type="checkbox"] {
  position: relative;
}

</style>

