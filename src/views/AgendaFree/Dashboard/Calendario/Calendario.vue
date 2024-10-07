<template>
  <BaseBlock  title="Calendario"  content-full>
    <LoadingSpinner :isLoading="isLoading"/>
    <div class="calendar-container is-light-mode">
      <Qalendar 
        :events="events" 
        :config="config"
        @delete-event="liberarHora($event)"
      >
        
        <!-- Personalizar linea de tiempo actual -->
        <template #customCurrentTime>
          <div :style="{ height: '3px', backgroundColor: '#14B9E2', position: 'relative' }">
            <div :style="{ position: 'absolute', left: '-7px', top: '-6px', height: '15px', width: '15px', backgroundColor: '#14B9E2', borderRadius: '50%' }"></div>
          </div>
        </template>
      </Qalendar>
    </div>
  </BaseBlock>
</template>

<script setup>
import { Qalendar } from "qalendar";
import { onBeforeMount, onMounted, ref } from "vue";
import Swal from "sweetalert2";
import axios from "axios";
import { format, add, parse } from "date-fns";
import LoadingSpinner from "../../Component/LoadingSpinner.vue";

const API_ESPECIALISTA = "https://apirestnatalymorales.agendafree.cl/api/";
const citasEspecialista = ref({});
const isLoading = ref(true);
const events = ref([]);

//Token especialista
const getToken = () =>{
  return {
    headers: {
      "x-token": sessionStorage.getItem("especialista-token")
    }
  }
}

onBeforeMount(async ()=>{
  await getCitasEspecialista();
});

const getCitasEspecialista = () => {
  axios.get(`${API_ESPECIALISTA}cita`, getToken())
    .then((response) => {
      if (response) {
        // Asigna las citas recibidas a citasEspecialista.value
        citasEspecialista.value = response.data.allCitas;
        console.log("citas: ",citasEspecialista.value);

        // Formatea las citas y asigna el resultado a event.value
        events.value = formatearCitas(citasEspecialista.value);
        console.log("eventos: ",events.value);
        // Marca como terminado el proceso de carga
        isLoading.value = false;

      }
    }).catch((e) => {
      console.log(e);
    });
};

const formatearCitas = (citas) => {
  return citas.map((cita) => {
    console.log(cita);
    return {
      id: cita.id,
      title: cita.persona.nombre + " " + cita.persona.apellido, // nombre paciente
      description:cita.estados_cita.estado + " " + cita.previsione.nombre,
      time: { start: cita.fecha+" "+formatearHora(cita.horas_disponible.hora), end: cita.fecha+" "+agregarUnaHora(cita.horas_disponible.hora) },
      //color: "yellow", Como sugerencia cambiar color dependiendo de la prevision
      isEditable: true,
      disableDnD: ['month', 'day', 'week']
    }
  })
}

const formatearHora = (horaString) => {
  // Parsear la hora en formato "HH:mm:ss" a un objeto Date
  const fecha = parse(horaString, 'HH:mm:ss', new Date());

  // Formatear la hora solo como "HH:mm"
  return format(fecha, 'HH:mm');
};

const agregarUnaHora = (horaString) => {
  // Separar las horas y minutos del string
  const [horas, minutos] = horaString.split(':').map(Number);
  
  // Crear un objeto Date con la hora
  const fecha = new Date();
  fecha.setHours(horas, minutos, 0); // Establecer horas y minutos, segundos en 0

  // Sumar una hora usando date-fns
  const nuevaFecha = add(fecha, { hours: 1 });

  // Retornar la hora formateada como "HH:mm"
  return format(nuevaFecha, 'HH:mm');
};




//$event trae el id por defendo del evento
const liberarHora = (idEvento) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Liberar hora"
  }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Hora liberada",
          text: "La hora fue liberada",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        citasEspecialista.value = citasEspecialista.value.filter(event => event.id !== idEvento);
      }
  });
}

const config = ref({
  //Muestra una linea que indica el tiempo actual
  showCurrentTime: true,
  locale: "es-ES",
  //month, week, day
  defaultMode: "month",
  style: {
    colorSchemes: {
      //Segun el tipo de reunion: meeting, sports, etc...
      meetings: {
        color: "#fff",
        backgroundColor: "#131313",
      },
      sports: {
        color: "#fff",
        backgroundColor: "#ff4081",
      },
    },
  },
  dayBoundaries:{
    start: 8,
    end: 21,
  },
  isSilent: true,
});


</script>

<style>
  @import "qalendar/dist/style.css";
  .calendar-container {
    width: 100%;
    height: 600px;
  }
  .is-edit-icon{
    display:none;
  }
  .is-draggable{
    -webkit-user-drag: none;
  }
  .is-editable{
    -webkit-user-drag: none;
  }
</style>