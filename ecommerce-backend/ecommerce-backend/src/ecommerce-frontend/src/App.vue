<template>
  <nav>
    <div class="nav-left">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>

    <div class="nav-right">
      <router-link class="nav-button cart-button" to="/cart">
        🛒 Cart
        <span v-if="totalCartCount > 0" class="cart-badge">{{
          totalCartCount
        }}</span>
      </router-link>
      <router-link
        v-if="!currentUser"
        class="nav-button login-button"
        to="/login"
        >Login</router-link
      >
      <router-link v-else class="nav-button login-button" to="/profile">{{
        firstName
      }}</router-link>
    </div>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "App",
  computed: {
    currentUser() {
      return store.getters.currentUser;
    },
    firstName(): string {
      const user = store.getters.currentUser;
      if (!user) return "";
      return user.name.split(" ")[0];
    },
    totalCartCount(): number {
      return store.getters.totalCartCount;
    },
  },
});
</script>

<style>
html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

body {
  background: #eaf8eb;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 18px 30px;
  background: rgba(46, 125, 50, 0.08);
  border-bottom: 1px solid rgba(56, 107, 63, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

nav a {
  font-weight: bold;
  color: #1f3b20;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #2e7d32;
}

.nav-button {
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.cart-button {
  position: relative;
  background: #ffffff;
  color: #2e7d32;
  border-color: rgba(46, 125, 50, 0.16);
}

.cart-button:hover {
  background: #f0f7ef;
}

.cart-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  margin-left: 6px;
  border-radius: 999px;
  background: #2e7d32;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  vertical-align: middle;
  transition: transform 0.15s ease;
}

.cart-button:hover .cart-badge {
  transform: scale(1.1);
}

.login-button {
  background: #2e7d32;
  color: #ffffff;
}

.login-button:hover {
  background: #25612b;
}
</style>
