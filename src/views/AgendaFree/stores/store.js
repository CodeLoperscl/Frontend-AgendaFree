import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const API_ESPECIALISTA = import.meta.env.VITE_URL_API_ESPECIALISTA;
const API_GENERAL = import.meta.env.VITE_URL_API_GENERAL;
const TOKEN = {
  headers: {
      "x-token": localStorage.getItem("Token"),
  },
};
export const useMainStore = defineStore('main', {
    state: () => ({
      sharedData: ''
    }),
    actions: {
      updateData(newData) {
        this.sharedData = newData;
      }
    }
  });

export const useUserDatos = defineStore('datosUsuario', {
  state: () => ({
    userData: {
      rut: '',
      nombre: '',
      email: '',
      telefono: '',
      prevision: '',
    },
  }),
  actions: {
    // Puedes agregar métodos para actualizar los datos del usuario
    setUserData(newData) {
      this.userData = { ...this.userData, ...newData };
    },
  },
});

export const useSesionEstado = defineStore('estadoSesion', ()=>{

    const estado = ref(false);
    const activarSesion = () =>{
      estado.value = true;
    }
    return {estado, activarSesion}
}
);

//Guardar datos del especialista desde landing especialista
export const useEspecialistaDatos = defineStore('datosEspecialista', ()=>{
  const especialista = ref({});

  const setEspecialista = (datos) =>{
    especialista.value = datos;
  };

  const cleanEspecialista = () =>{
    especialista.value = {};
  }

  return{
    especialista,
    setEspecialista,
    cleanEspecialista,
  };
});
//Guardar datos del paciente cuando el paciente esta registrado
export const usePacienteDatos = defineStore('datosPaciente', () => {
  // Estado inicial para almacenar datos del paciente
  const paciente = ref({});

  const getPaciente = () =>{
    return paciente.value;
  }

  // Acciones para actualizar los datos
  const setPaciente = (datos) => {
    paciente.value = datos;
  };
  
  const setPacientePrevision = (datos) => {
    paciente.value.prevision_id = datos;
  };

  const clearPaciente = () => {
    paciente.value = {};
  };

  return {
    setPacientePrevision,
    getPaciente,
    setPaciente,
    clearPaciente
  };
});
//Guardar datos del paciente cuando el paciente esta registrado
export const usePersonaPacienteDatos = defineStore('datosPersona', () => {
  // Estado inicial para almacenar datos del paciente
  const persona = ref({});

  const getPersona = () =>{
    return persona.value;
  }

  // Acciones para actualizar los datos
  const setPersona = (datos) => {
    persona.value = datos;
  };

  // Acciones para actualizar los datos
  const setPersonaFono = (datos) => {
    persona.value.persona.fono = datos;
  };
  const setPersonaEmail= (datos) => {
    persona.value.persona.email = datos;
  };

  const clearPersona = () => {
    persona.value = {};
  };

  return {
    setPersonaFono,
    setPersonaEmail,
    getPersona,
    setPersona,
    clearPersona
  };
});

export const useUrlApiEspecialista = defineStore('apiEspecialista', () => {
  // Estado inicial para almacenar datos del paciente
  const url = ref('');

  // Acciones para actualizar los datos
  const setUrl = (data) => {
    url.value = data;
  };
  const getURL = () =>{
    return url.value;
  }

  const clearUrl = () => {
    url.value = '';
  };

  return {
    url,
    getURL,
    setUrl,
    clearUrl,
  };
});

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(value) {
      this.isLoading = value;
    },
  },
});