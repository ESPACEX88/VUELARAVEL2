<template>
  <div class="user-list-container">
    <header class="header">
      <div>
        <h2>Lista de Usuarios</h2>
      </div>
      <button @click="logout" class="btn-logout">Cerrar sesión</button>
    </header>
    
    <ul class="user-list">
      <li v-for="user in userStore.users" :key="user.id" class="user-item">
        <div>
          <strong>{{ user.name }}</strong>
        </div>
        <div>{{ user.email }}</div>
        <div class="action-buttons">
          
          <button @click="editUser(user)" class="btn-edit">Editar</button>
          <button @click="deleteUser(user.id)" class="btn-delete">Eliminar</button>
          <button v-if="user.id === userStore.loggedInUser.id" 
                  @click="changePassword" class="btn-change-password">Cambiar Contraseña</button>
        </div>
      </li>
    </ul>

    <div v-if="isEditing" class="modal-overlay">
      <div class="modal-content">
        <h3>Editar Usuario</h3>
        <form @submit.prevent="updateUser">
          <div class="input-group">
            <label for="edit-name">Nombre:</label>
            <input type="text" v-model="editedUser.name" id="edit-name" required />
          </div>
          <div class="input-group">
            <label for="edit-email">Correo:</label>
            <input type="email" v-model="editedUser.email" id="edit-email" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Modificar</button>
            <button @click="cancelEdit" type="button" class="btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isChangingPassword" class="modal-overlay">
      <div class="modal-content">
        <h3>Cambiar Contraseña</h3>
        <form @submit.prevent="updatePassword">
          <div class="input-group">
            <label for="current-password">Contraseña Actual:</label>
            <input type="password" v-model="passwords.current" id="current-password" required />
          </div>
          <div class="input-group">
            <label for="new-password">Nueva Contraseña:</label>
            <input type="password" v-model="passwords.new" id="new-password" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Cambiar</button>
            <button @click="cancelPasswordChange" type="button" class="btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isUserEdited" class="modal-overlay">
      <div class="modal-content success-modal">
        <div class="modal-header">
          <h3>¡Usuario Editado!</h3>
        </div>
        <div class="modal-body">
          <p>Los cambios se han guardado exitosamente.</p>
          <button @click="closeSuccessModal" class="btn-success">Cerrar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';

export default {
  data() {
    return {
      isEditing: false,
      editedUser: {},
      isChangingPassword: false,
      passwords: {
        current: '',
        new: '',
      },
      isUserEdited: false,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  created() {
    this.userStore.fetchUsers();
    this.userStore.fetchLoggedInUser();
  },
  methods: {
    editUser(user) {
      this.isEditing = true;
      this.editedUser = { ...user };
    },
    logout() {
      this.userStore.logout(this.$router);
    },
    async updateUser() {
      await this.userStore.updateUser(this.editedUser);
      this.isUserEdited = true;
      setTimeout(() => {
        this.closeSuccessModal();
      }, 3000); 
      this.cancelEdit();
    },
    closeSuccessModal() {
      this.isUserEdited = false;
    },
    deleteUser(userId) {
      if (userId !== this.userStore.loggedInUser.id) {
        this.userStore.deleteUser(userId);
      } else {
        alert("No puedes eliminar tu propio usuario.");
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedUser = {};
    },
    changePassword() {
      this.isChangingPassword = true;
    },
    async updatePassword() {
      try {
        const currentPassword = this.passwords.current.trim();
        const newPassword = this.passwords.new.trim();

        if (!currentPassword || !newPassword) {
          alert("Por favor, ingrese ambas contraseñas.");
          return;
        }

        await this.userStore.updatePassword(currentPassword, newPassword, newPassword);
        alert("Contraseña cambiada exitosamente.");
        this.cancelPasswordChange();
      } catch (error) {
        alert("Hubo un error al cambiar la contraseña.");
        console.error(error);
      }
    },
    cancelPasswordChange() {
      this.isChangingPassword = false;
      this.passwords = { current: '', new: '' };
    },
  },
};
</script>

<style scoped>
.user-list-container {
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #c0392b;
}

.user-list {
  list-style-type: none;
  padding: 0;
}

.user-item {
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.user-item:last-child {
  border-bottom: none;
}

strong {
  display: block;
  font-size: 1.2em;
}

.action-buttons {
  margin-top: 10px;
}

button {
  padding: 8px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.btn-change-password {
  background-color: #16a085;
  color: white;
}

.btn-change-password:hover {
  background-color: #1abc9c;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #bdc3c7;
  color: white;
}

.btn-secondary:hover {
  background-color: #95a5a6;
}

.success-modal {
  background-color: #28a745;
  color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.success-modal .btn-success {
  background-color: #218838;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success-modal .btn-success:hover {
  background-color: #1e7e34;
}
</style>
