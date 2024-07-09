<script setup>
import { reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  isOpen: Boolean,
  run: String,
});
const emit = defineEmits(["modal-close", "submit-data"]);

const target = ref(null);
onClickOutside(target, () => emit("modal-close"));

const paciente = reactive({
  run: props.run,
  nombre: null,
  email: null,
  fono: null,
});

function sendData() {
  // Enviar datos a API
  emit("submit-data");
}
</script>
<template>
  <div v-if="props.isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <p
          @click.stop="emit('modal-close')"
          class="text-secondary mb-0 text-end pointer fa-2x"
        >
          <i class="si si-close"></i>
        </p>
        <div class="modal-header">
          <slot name="header">
            <p class="fs-lg fw-medium text-muted text-center">
              Bienvenid@, <br />para solicitar una hora de atención, ingrese sus
              datos y presione continuar.
            </p>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="content">
            <div class="row justify-content-center">
              <div class="col-lg-10">
                <div class="mb-4">
                  <div class="mb-4">
                    <label class="form-label" for="example-ltf-run">Run</label>
                    <input
                      type="text"
                      class="form-control"
                      id="example-ltf-run"
                      v-model="paciente.run"
                      disabled
                      placeholder="Su run..."
                    />
                  </div>
                  <label class="form-label" for="example-ltf-nombre"
                    >Nombre</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="example-ltf-nombre"
                    v-model="paciente.nombre"
                    placeholder="Su nombre completo..."
                  />
                </div>
                <div class="mb-4">
                  <label class="form-label" for="example-ltf-email"
                    >Email</label
                  >
                  <input
                    type="email"
                    class="form-control"
                    id="example-ltf-email"
                    v-model="paciente.email"
                    placeholder="Su correo electrónico..."
                  />
                </div>
                <div class="mb-4">
                  <label class="form-label" for="example-ltf-fono">Fono</label>
                  <input
                    type="text"
                    class="form-control"
                    id="example-ltf-fono"
                    v-model="paciente.fono"
                    placeholder="Su numero de contacto..."
                  />
                </div>
              </div>
            </div>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <div>
              <button
                type="button"
                class="btn btn-primary px-4 py-3 float-end"
                v-click-ripple
                @click="sendData"
              >
                Continuar
                <i class="fa fa-fw fa-arrow-right ms-1 opacity-50"></i>
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 600px) {
  .modal-container {
    width: 90% !important;
    margin: 50px auto;
  }
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  width: 50%;
  margin: 100px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.pointer {
  cursor: pointer;
}
</style>
