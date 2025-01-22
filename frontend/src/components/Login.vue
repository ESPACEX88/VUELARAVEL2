<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="auth-form">
      <div class="input-group">
        <label for="email">Email:</label>
        <input
          type="email"
          v-model="form.email"
          id="email"
          placeholder="Email"
          required
        />
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input
          type="password"
          v-model="form.password"
          id="password"
          placeholder="Password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p v-if="message" class="error-message">{{ message }}</p>
  </div>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      message: "",
    };
  },
  methods: {
    async login() {
      try {
        
        const response = await api.post("login", this.form);
        this.message = response.data.message;
        localStorage.setItem("auth_token", response.data.token);
        this.$router.push({ name: "UserList" });
      } catch (error) {
        this.message = error.response
          ? error.response.data.message
          : "Error connecting to the server";
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #174475;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 15px;
}
</style>
