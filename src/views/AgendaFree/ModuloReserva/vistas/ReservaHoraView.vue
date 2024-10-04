<script setup>
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { format } from "date-fns";
import { useEspecialistaDatos, useUrlApiEspecialista, usePacienteDatos, usePersonaPacienteDatos } from "../../stores/store";
import axios from "axios";
import LoadingSpinner  from "../../Component/LoadingSpinner.vue";

//Variables
const previsiones = ref({});
const storePersonaPaciente = usePersonaPacienteDatos();
const storeAPIEspecialista = useUrlApiEspecialista();
const storePaciente = usePacienteDatos();
const API_ESPECIALISTA = storeAPIEspecialista.url;
const date = ref(new Date());
const solicitarHoraBtnEstado = ref(true);
const horarioSeleccionado = ref();
const idHorarioSeleccionado = ref();
const dataEspecialista = useEspecialistaDatos();
const citasEspecialista = ref();
const isLoading = ref(false);
const diaSeleccionado = ref(format(new Date, "dd-MM-yyyy"));
const horariosEspecialista = ref();
const configuracionesCalendario = ref(
  [
    {
      highlight: true,
      key: 'today',
      highlight: {
        color: 'blue',
        fillMode: 'light',
        contentClass: 'italic',
      },
      
    },
  ]
);
const nuevaCita = ref({
  "fecha": null,
  "paciente_id": storePaciente.getPaciente().paciente.id,
  "prevision_id": storePaciente.getPaciente().paciente.prevision_id,
  "hora_id": null
});
//TOken
const token = {
  headers: {
    "x-token": sessionStorage.getItem("token")
  }
};

console.log('store desde reserva de hora: ', dataEspecialista.especialista.profesionales);

const getHorarios = () =>{
  axios.get(API_ESPECIALISTA+"api/hora_disponible",token)
    .then((response)=>{
      if(response){
        horariosEspecialista.value = response.data.horas_disponibles;
        console.log("hora disponible: ",response.data.horas_disponibles);
      }
    })
    .catch((e)=>{
      console.log(e);
    });
}


const getPrevisiones = () =>{
  axios.get(API_ESPECIALISTA + "prevision", token)
    .then((response) =>{
      if(response){
        previsiones.value = response.data.previsiones.filter(prevision => prevision.estado_id === 3);
        console.log("Previsiones", previsiones.value);
      }
    })
    .catch((e)=>{
      if(e){
        console.log(e);
      }
    });
}

const generarOpciones = () =>{
  return previsiones.value.map(opcion => 
  `<option value="${opcion.value}">${opcion.label}</option>`
  ).join('');

}

const reservarCita = () =>{

  console.log("store desde reservar citaL",storePersonaPaciente.getPersona());
  Swal.fire({
  html:
  `
    <div style="text-align: left;">
      <div class="mb-3">
        <label for="nombre" class="form-label"><strong>Bienvenido </strong> ${storePersonaPaciente.getPersona().persona.nombre} ${storePersonaPaciente.getPersona().persona.apellido}</label>
        <p>Por favor, confirma que tus datos son correctos:</p>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label"><strong>Email:</strong></label>
        <input 
          type="email" 
          class="form-control" 
          id="email" 
          value="${storePersonaPaciente.getPersona().persona.email}"
        >
      </div>

      <div class="mb-3">
        <label for="fono" class="form-label"><strong>Teléfono:</strong></label>
        <input 
          type="text" 
          class="form-control" 
          id="fono" 
          value="${storePersonaPaciente.getPersona().persona.fono}"
        >
      </div>

      <div class="mb-3">
        <label for="prevision" class="form-label"><strong>Prevision:</strong></label>
        <select class="form-select">
        ${{generarOpciones}}
        </select>
        
      </div>

      <div class="mb-3">
        <label class="form-label"><strong>Reserva de cita para el día ${diaSeleccionado.value} a las ${horarioSeleccionado.value}</strong></label>
      </div>

      <p>¿Desea reservar para este día y hora?</p>
    </div>
  `,
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Confirmar',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#069fba',
  cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      // Acción a realizar si el usuario confirma
      axios.post(API_ESPECIALISTA+"api/cita",nuevaCita.value, token)
        .then((response)=>{
          if(response){
            console.log(response);
            Swal.fire({
              title: 'Cita agendada con exito!',
              text: 'En espera de confirmación del especialista',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#069fba'
            });
            horariosEspecialista.value.some((horario)=>{
              if(horario.id == nuevaCita.value.hora_id){
                horario.agendado = true;
                solicitarHoraBtnEstado.value = true;
              }
              console.log("Cita reservada con id: ", horario.id);
            });
          }
          
        }).catch((e)=>{
          console.log(e);
        })
    } else if (result.isDismissed) {
      // Acción a realizar si el usuario cancela
      Swal.fire({
        title: 'Reserva de cita cancelada',
        text: 'Tu cita ha sido cancelada. Si necesitas reprogramar, por favor contáctanos.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#069fba'
      });
    }
  });
}


const seleccionarHorario = (id, horario) =>{
  idHorarioSeleccionado.value = id
  horarioSeleccionado.value = horario
  solicitarHoraBtnEstado.value = false;
  console.log("id horario seleccionado: ", idHorarioSeleccionado.value);
  //console.log("horario seleccionado: ", horarioSeleccionado.value);
  nuevaCita.value.hora_id = id;
  console.log(nuevaCita.value);
}

const fechaMaxima = () =>{
  let fecha = new Date();
  fecha.setDate(fecha.getDate() + dataEspecialista.especialista.profesionales[0].max_dias_atencion);
  return fecha; 
}

const getCitas = () =>{
  console.log('Miaxmos dias de atencion: ', dataEspecialista.especialista.profesionales[0].max_dias_atencion);
  //Habilito el boton para solicitar hora
  solicitarHoraBtnEstado.value = true;
  //Si hay fecha seleccionada en el calendario...
  if(date.value != null){
    //Abrir spinner de carga
    isLoading.value = true;
    //Capturo el dia seleccionado para el template
    diaSeleccionado.value = format(date.value, "dd-MM-yyyy");
    date.value = format(date.value, "yyyy-MM-dd");
    nuevaCita.value.fecha = date.value;
    //Cargo todas las citas para el especialista con id 1 en la fecha seleccionada en el calendario
    axios.get(API_ESPECIALISTA+"api/cita/esp_date/"+1+"/"+date.value, token)
     .then((response)=>{
      //citas deel especialista del dia seleccionado
       citasEspecialista.value = response.data.allCitasFecha;
       console.log("Citas especialista",citasEspecialista.value);
       //Cierro spinner de carga y cargo los horarios libres
       horasDisponiblesPorDia();
       isLoading.value = false;
     })
     .catch((e)=>{
       console.log(e);
       isLoading.value = false;
     });
    //Si date.value es null, o sea, no hay fecha seleccionada en el calendario
    //Las horas estaran bloqueadas
  }else{
    horariosEspecialista.value.forEach((horario)=>{ horario.agendado = true; });
  }
}
//Realizo el mappeo con la logica necesaria para obtener las horas libres para el dia seleccionado en el calendario
const horasDisponiblesPorDia = () =>{
  if(citasEspecialista.value.length === 0){
    horariosEspecialista.value.forEach((horario)=>{ horario.agendado = false;});
  }else{
    horariosEspecialista.value.forEach((hora)=>{
      const horaReservada = citasEspecialista.value.find((cita)=> cita.hora_id == hora.id );
      horaReservada ? hora.agendado = true  : hora.agendado = false;
    }); 
  }
}

onBeforeMount(async ()=>{
  getPrevisiones();
  await getHorarios();
  await getCitas();
});


</script>

<template>

    <LoadingSpinner :isLoading="isLoading" />
    <div class="row pt-3 py-md-5 my-md-3">
        <div
          class="col-xl-4 offset-xl-2 pt-2 bg-info  text-center"
          style="padding-bottom: 25%"
        >
          <h2 class="text-white">
            ¿En qué fecha deseas solicitar reunión con
            <span class="fst-italic fw-light"> {{ dataEspecialista.especialista.nombre + " " + dataEspecialista.especialista.apellido}}</span>
          </h2>
          <div class="calendar-container">
            <DatePicker 
              locale= 'es-MX'
              class="calendar"
              v-model="date"
              color="blue"
              :attributes="configuracionesCalendario"
              :min-date="new Date()"
              :max-date="fechaMaxima()"
              @dayclick="getCitas()"
              expanded
              borderless
              transparent
            />
          </div>
        </div>
        <div class="col-lg-8 col-xl-4 p-5 border border-primary">
          <p v-if="date != null">
            ¿A qué hora te gustaría agendar tu cita? Aquí están los horarios disponibles para el día
            <span class="fw-bold">{{ diaSeleccionado }}</span>
          </p>
          <p v-else>
            {{ "¿Qué día te gustaría agendar tu cita con el Dr./Dra. "+ dataEspecialista.especialista.nombre + " " + dataEspecialista.especialista.apellido+"? Selecciona una fecha disponible."}}
          </p>
          <div class="d-grid gap-2">
            <button
              v-for="horario in horariosEspecialista"
              :key="horario.id"
              :id=horario.id
              type="button"
              :class="['btn', 'py-2', 'mb-2', horario.estado ? 'btn-primary' : 'btn-outline-primary']"
              data-toggle="click-ripple"
              :disabled="horario.agendado"
              @click="seleccionarHorario(horario.id, horario.hora)"
            >
              {{ horario.hora }}
            </button>
            <button 
              class="btn btn-info js-click-ripple-enabled py-2 mb-2"
              @click="reservarCita"
              :disabled="solicitarHoraBtnEstado"
              >Solicitar Hora
            </button>
          </div>
        </div>
    </div>
</template>

<style lang="scss">

.vc-disabled {
    pointer-events: none; /* Desactiva los eventos del puntero, haciendo el elemento no clickeable */
    cursor: default; /* Cambia el cursor a una flecha estándar para indicar que no es interactivo */
}


/* Cambiar color de los días no seleccionables a rojo */

.vc-pane-container {
  transform: scale(1); /* Escala el tamaño del calendario junto con el fondo */ /* Mantén el calendario anclado en la esquina superior izquierda */
}


.vc-day, .vc-day-content {
  font-size: 1.8rem;
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
  padding: 10px;
  /* Aumenta el tamaño del texto en los días del calendario */
}

/* Opcional: ajustar el tamaño del contenedor del calendario para evitar que se corte */
.vc-container {
  width: 100%;
  height: 300px;
}

.vc-highlight{
  width: 50px;
  height: 50px;
}
.vc-weekday{
  font-size: 1.3rem;
  color: white;
  margin-top: 50px;
}
.vc-title{
  background-color: #0891B2;
  color: white;
}
.vc-header .vc-title{
  color: white;
  font-size: 1.8rem;
}




</style>
