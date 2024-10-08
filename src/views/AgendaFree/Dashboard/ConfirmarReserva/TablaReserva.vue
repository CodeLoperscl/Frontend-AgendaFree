<script setup>
import { reactive, computed, onMounted, ref, onBeforeMount } from "vue";
import axios from "axios";
// Vue Dataset, for more info and examples you can check out https://github.com/kouts/vue-dataset/tree/next
import { useRoute } from "vue-router";

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

//Token especialista
const tokenEspecialista = () =>{
  return{
    headers: {
      "x-token": sessionStorage.getItem("especialista-token")
    }
  }
}
//Route
const route = useRoute();
//Parametro uid
const uid = route.params.uid;

//API General
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;
//API Especialista
const API_ESPECIALISTA = ref('');
// Citas
const citasEspecialista = ref(); 

//Obtener API del Especialista
const getEspecialistaAPI = async () =>{
  await axios.get(API_GENERAL+"users/uid/"+uid, tokenEspecialista())
  .then((response)=>{
    if(response.data.personas[0].profesionales[0].habilitado == true && response.data.personas[0].profesionales[0].ruta_api){
      API_ESPECIALISTA.value = response.data.personas[0].profesionales[0].ruta_api;
      console.log("API_ESPECIALISTA: ", API_ESPECIALISTA.value);
      getCitas(response.data.personas[0].profesionales[0].ruta_api);
    }
  }).catch((e)=>{
    console.log(e);
  });
}
const getCitas = async (api) => {
  try {
    const response = await axios.get(`${api}/api/cita/`, tokenEspecialista());
    if (response && response.data) {
      citasEspecialista.value = response.data.allCitas
        .filter(cita => cita.estados_cita.id !== 4 && cita.estados_cita.id !== 5)
        .map(cita => ({
          id: cita.id,
          nombre_persona: `${cita.persona.nombre} ${cita.persona.apellido}`,
          fecha: cita.fecha,
          prevision: cita.previsione.nombre,
          hora: cita.horas_disponible.hora,
          estado: {
            id: cita.estados_cita.id,
            nombre: cita.estados_cita.estado
          }
        }));
      console.log("citas filtradas y ma:", citasEspecialista.value);
    }
  } catch (error) {
    console.error("Error al obtener citas:", error);
  }
};

// Helper variables
const cols = reactive([
  {
    name: "Paciente",
    field: "paciente",
    sort: "",
  },
  {
    name: "Dia",
    field: "dia",
    sort: "",
  },
  {
    name: "Hora",
    field: "hora",
    sort: "",
  },
  {
    name: "Prevision",
    field: "prevision",
    sort: "",
  },
  {
    name: "Estado",
    field: "estado",
    sort: "",
  },
  {
    name: "Acciones",
    field: "",
    sort: "",
  },
]);


// Sort by functionality
const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
    }
    return acc;
  }, []);
});

// On sort th click
function onSort(event, i) {
  let toset;
  const sortEl = cols[i];

  if (!event.shiftKey) {
    cols.forEach((o) => {
      if (o.field !== sortEl.field) {
        o.sort = "";
      }
    });
  }

  if (!sortEl.sort) {
    toset = "asc";
  }

  if (sortEl.sort === "desc") {
    toset = event.shiftKey ? "" : "asc";
  }

  if (sortEl.sort === "asc") {
    toset = "desc";
  }

  sortEl.sort = toset;
}

// Apply a few Bootstrap 5 optimizations
onMounted(() => {
  // Remove labels from
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });

  // Replace select classes
  let selectLength = document.querySelector("#datasetLength select");

  selectLength.classList = "";
  selectLength.classList.add("form-select");
  selectLength.style.width = "80px";
});

//Rechazar cita, filtra la cita donde el id coincida con el id de la lista cita
const rechazarCita = (id) => {
  axios.put(`${API_ESPECIALISTA.value}api/cita/${id}`, { estado_cita_id: 5 }, tokenEspecialista())
    .then((response) => {
      if (response) {
        citasEspecialista.value = citasEspecialista.value.filter(cita => cita.id !== id);
      }
    })
    .catch((error) => {
      console.error('Error al rechazar la cita:', error);
    });
}

// Cuando la cita esta Solicitada y se requiere el abono del paciente, se solicita el abono LISTO
const solicitarAbono = (id) => {

  axios.put(`${API_ESPECIALISTA.value}api/cita/${id}`,{estado_cita_id: 2},tokenEspecialista())
    .then((response) => {
      if (response) {
        console.log("Cita actualizada: ", response.data);
        const cita = citasEspecialista.value.find((cita) => cita.id === id);
        if (cita) {
          cita.estado.id = 2;
        }
      }
    })
    .catch(error => {
      console.error('Error al solicitar abono:', error);
    });

}

// Confirmar cita, la solicitud se aprobará y se borrará de la lista de solicitudes sin gestionar LISTO
const confirmarCita = (id) => {
  axios.put(`${API_ESPECIALISTA.value}api/cita/${id}`,{ estado_cita_id: 4 },tokenEspecialista())
    .then((response) => {
      if (response.data) {
        console.log("Cita actualizada: ", response.data);
        citasEspecialista.value = citasEspecialista.value.filter(cita => cita.id !== id);

      }
    })
    .catch((error) => {
      console.error('Error al confirmar la cita:', error);
    });
}

const rechazarAbono = (id) => {
  axios.put(`${API_ESPECIALISTA.value}api/cita/${id}`,{ estado_cita_id: 1 },tokenEspecialista())
    .then((response) => {
      if (response.data) {
        const cita = citasEspecialista.value.find((cita) => cita.id === id);
        if (cita) {
          cita.estado.id = 1;
        }
      }
    })
}


onBeforeMount(async() => {
  await getEspecialistaAPI();
  //citas.value = citas.value.filter(cita => cita.estado === 1 || cita.estado === 2 || cita.estado === 3);
});

</script>



<template>
  <!-- Page Content -->
  <div class="content">
    <BaseBlock title="Solicitudes sin gestionar" content-full>
      <!--Para hacer funcionar el filtro hay que hacer coincidir los nombres de los atributos de los objetos con :ds-search-in-->
      <Dataset
        v-slot="{ ds }"
        :ds-data="citasEspecialista"
        :ds-sortby="sortBy"
        :ds-search-in="['paciente', 'dia', 'hora', 'prevision','estado']"
        
      >
        <div class="row" :data-page-count="ds.dsPagecount">
          <div id="datasetLength" class="col-md-8 py-2">
            <!--:ds-show-entries es el prop que define la cantidad de datos visibles por defecto en la tabla-->
            <DatasetShow 
              :ds-show-entries=5
            />
          </div>
          <div class="col-md-4 py-2">
            <DatasetSearch ds-search-placeholder="Buscar..." />
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-12">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th
                      v-for="(th, index) in cols"
                      :key="th.field"
                      :class="['sort', th.sort]"
                      @click="onSort($event, index)"
                    >
                      {{ th.name }} <i class="gg-select float-end"></i>
                    </th>
                  </tr>
                </thead>
                <DatasetItem tag="tbody" class="fs-sm">
                  <template #default="{ row }">
                    <tr>
                      <th scope="row">{{ row.id }}</th>
                      <td style="min-width: 150px">{{ row.nombre_persona }}</td>
                      <td>{{ row.dia }}</td>
                      <td style="min-width: 150px">{{ row.hora }}</td>
                      <td style="min-width: 150px">{{ row.prevision }}</td>
                      <td style="min-width: 150px">
                        <span v-if="row.estado.id === 1"
                          class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-success-light text-success"
                        >
                          {{ "Solicitado" }}
                        </span> 
                        <span v-if="row.estado.id === 2"
                          class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info"
                        >
                          {{ "Solicitud abono" }}
                        </span> 
                        <!--Estado: En espera de abono-->
                        <span v-if="row.estado.id === 3"
                          class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-warning"
                        >
                          {{ "Pendiente revision" }}
                        </span> 
                      </td>
                      <td>
                        <!--Btn Reservar-->
                        <button 
                          type="button" 
                          class="btn btn-sm btn-alt-success m-1" 
                          style="width: auto; min-width: 60px;"
                          @click="confirmarCita(row.id)"
                        >
                          <span class="d-none d-lg-inline">Confirmar</span>
                          <i class="fa fa-calendar-check d-lg-none"></i>
                        </button>
                        <!--Btn Rechazar-->
                        <button 
                          type="button" 
                          class="btn btn-sm btn-alt-danger m-1" 
                          style="width: auto; min-width: 60px;"
                          @click="rechazarCita(row.id)"
                          >
                          <span class="d-none d-lg-inline">Rechazar</span>
                          <i class="fa fa-times-circle d-lg-none"></i>
                        </button>
                        <!--Btn Solicitar Abono-->
                        <button 
                          type="button" 
                          class="btn btn-sm btn-alt-primary m-1" 
                          style="width: 
                          auto; min-width: 60px;"
                          @click="solicitarAbono(row.id)"
                          v-if="row.estado.id == 1"
                        >
                          <span class="d-none d-lg-inline">Solicitar abono</span>
                          <i class="fa fa-money-check-dollar d-lg-none"></i>
                        </button>
                        <!--Btn Rechazar Bono-->
                        <button 
                          type="button" 
                          class="btn btn-sm btn-alt-primary m-1" 
                          style="width: 
                          auto; min-width: 60px;"
                          @click="rechazarAbono(row.id)"
                          v-else-if="row.estado.id == 2"
                        >
                          <span class="d-none d-lg-inline">Rechazar Abono</span>
                          <i class="fa fa-money-check-dollar d-lg-none"></i>
                        </button>
                      </td>
                    </tr>
                  </template>
                </DatasetItem>
              </table>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-md-row flex-column justify-content-between align-items-center"
        >
          <DatasetInfo class="py-3 fs-sm" />
          <DatasetPager class="flex-wrap py-3 fs-sm" />
        </div>
      </Dataset>
    </BaseBlock>
  </div>
  <!-- END Page Content -->
</template>

<style lang="scss" scoped>

.gg-select {
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
.gg-select::after,
.gg-select::before {
  content: "";
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
th.sort {
  cursor: pointer;
  user-select: none;
  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }
  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}
</style>