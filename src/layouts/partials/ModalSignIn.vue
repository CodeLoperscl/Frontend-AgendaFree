<template>
    <div
      class="modal"
      id="modal-block-normal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modal-block-normal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <SignInView />
        </div>
      </div>
    </div>
</template>
<script setup>
import SignInView from '../../views/auth/SignInView.vue';
</script>
<style>
    
</style>