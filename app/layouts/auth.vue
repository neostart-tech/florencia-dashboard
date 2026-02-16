<template>
  <div class="auth-layout min-h-screen relative overflow-hidden flex items-center justify-center bg-[#FDFCFB]">
    <!-- Gradients de luxe Florencia -->
    <div class="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cafe-100/40 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cafe-200/20 rounded-full blur-[100px]" style="animation: pulse 8s infinite"></div>
    
    <!-- Grain Texture (subtile) -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

    <UMain class="relative z-10 w-full">
      <slot />
    </UMain>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.auth-layout {
  background-image: 
    radial-gradient(at 0% 0%, rgba(214, 144, 105, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(108, 66, 57, 0.05) 0px, transparent 50%);
}
</style>
