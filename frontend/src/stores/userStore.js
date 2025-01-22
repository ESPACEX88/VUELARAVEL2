import { defineStore } from 'pinia';
import api from '@/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loggedInUser: null, 
  }),

  actions: {
    async fetchUsers() {
      try {
        const response = await api.get('users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    async fetchLoggedInUser() {
      try {
        const response = await api.get('auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });
        console.log('Logged in user data:', response.data); 
        this.loggedInUser = response.data;
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    },

    async logout(router) {
      try {
        await api.post('logout', null, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });

        localStorage.removeItem('auth_token');
        this.loggedInUser = null;
        router.push({ name: 'Login' });
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },

    async deleteUser(userId) {
      try {
        await api.delete(`users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });
        this.users = this.users.filter(user => user.id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },

    async updateUser(user) {
      try {
        const response = await api.put(`users/${user.id}`, user, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });
        const index = this.users.findIndex(u => u.id === user.id);
        this.users[index] = response.data;
    
        if (this.loggedInUser && this.loggedInUser.id === user.id) {
          this.loggedInUser = response.data;
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    

   
    async updatePassword(currentPassword, newPassword, newPasswordConfirmation) {
      try {
        const response = await api.put('/change-password', {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });

        console.log('Password changed successfully', response.data);
        return response.data; 
      } catch (error) {
        console.error('Error changing password:', error.response ? error.response.data : error);
        throw error; 
      }
    },
  },
});
