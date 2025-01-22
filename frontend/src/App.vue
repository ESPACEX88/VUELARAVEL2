<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1>Sistema de Usuarios</h1>
        <p v-if="userStore.loggedInUser" class="welcome-message">Bienvenido, {{ userStore.loggedInUser.name }}</p>
        <p v-else class="auth-status">No estás autenticado.</p>
      </div>
    </header>
    <section class="content">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';

export default {
  name: "App",
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  mounted() {
    document.title = "Sistema de Usuarios";
    this.userStore.fetchLoggedInUser();
  },
};
</script>

<style scoped>
/* Contenedor principal */
.app-container {
  font-family: 'Arial', sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Estilos de la barra superior (header) */
.header {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.welcome-message, .auth-status {
  font-size: 1.2em;
}

/* Estilos para el contenido */
.content {
  flex: 1;
  background-color: #f9f9f9;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilo de las pantallas de la aplicación */
.router-view {
  width: 100%;
  max-width: 800px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
