<script setup>
import { useTemplateStore } from "@/stores/template";
import BaseLayout from "@/layouts/BaseLayout.vue";
import { ref } from "vue";
// Main store
const store = useTemplateStore();
const isLoading = ref(true);
// Set default elements for this layout
store.setLayout({
  header: true,
  sidebar: false,
  sideOverlay: false,
  footer: false,
});

// Set various template options for this layout variation
store.headerStyle({ mode: "dark" });
store.mainContent({ mode: "full" });
</script>

<template>
  <BaseLayout>
    <!-- Header Content Left -->
    <template #header-content-left>
      <!-- Logo -->
      <RouterLink
        :to="{ name: 'landing' }"
        class="logo-link d-flex align-items-center"
      >
        <span class="logo-text">
          <!-- Agenda
          <span class="fw-light">Free</span> -->
          <img src="/assets/media/AGFree/logo_v3.svg" width="200" alt="Logo" />
          
        </span>
      </RouterLink>
      <!-- END Logo -->
    </template>
    
  </BaseLayout>
</template>

<style lang="scss" scoped>
// Definición de variables de color
$verde-azulado: #16a085;
$blanco-marfil: #fafafa;
$azul-marino: #2c3e50;
$gris-acero: #95a5a6;
$verde-pastel: #d1f2eb;

:deep(.header-navbar) {
  background-color: $azul-marino;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-link {
  text-decoration: none;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: $blanco-marfil;
  letter-spacing: 0.5px;

  .fw-light {
    color: $verde-pastel;
  }
}

:deep(.nav-main-link) {
  color: $blanco-marfil;

  &:hover,
  &:focus {
    color: $verde-pastel;
    background-color: rgba($verde-azulado, 0.1);
  }
}

:deep(.btn-dual) {
  background-color: $verde-azulado;
  border-color: $verde-azulado;
  color: $blanco-marfil;

  &:hover,
  &:focus {
    background-color: darken($verde-azulado, 10%);
    border-color: darken($verde-azulado, 10%);
  }
}
</style>
