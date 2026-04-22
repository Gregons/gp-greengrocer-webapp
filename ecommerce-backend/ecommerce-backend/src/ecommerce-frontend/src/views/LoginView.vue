<template>
  <div class="login-page">
    <section class="login-panel">
      <div class="badge">GreenGrocers Member Login</div>
      <h1>Sign in to your account</h1>
      <p>Please enter your username and password to continue.</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          Email address
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </label>

        <label>
          Password
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button class="primary-button" type="submit" :disabled="loading">
          {{ loading ? "Signing in…" : "Login" }}
        </button>
      </form>

      <router-link class="secondary-button" to="/register">
        Register an account
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import store from "@/store";
import { loginUser } from "@/api";

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.loading = true;
      try {
        const user = await loginUser({
          email: this.email,
          password: this.password,
        });
        store.commit("SET_USER", user);
        router.push({ name: "home" });
      } catch (e: unknown) {
        this.errorMessage = e instanceof Error ? e.message : "Login failed";
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  background: radial-gradient(
    circle at top,
    #e8f7e8 0%,
    #c7ebc8 50%,
    #9ed49e 100%
  );
  color: #15351f;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.login-panel {
  width: min(520px, 100%);
  padding: 36px 34px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 44px rgba(24, 74, 34, 0.12);
  border: 1px solid rgba(55, 122, 64, 0.12);
  text-align: left;
}

.badge {
  display: inline-block;
  margin-bottom: 18px;
  padding: 10px 18px;
  border-radius: 999px;
  background: #2e7d32;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  color: #1e3f20;
}

p {
  margin: 14px 0 30px;
  line-height: 1.7;
  color: #3b5e43;
}

.login-form {
  display: grid;
  gap: 18px;
}

label {
  display: grid;
  gap: 10px;
  font-weight: 700;
  color: #2f5533;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(86, 142, 95, 0.2);
  background: #f8faf6;
  font-size: 1rem;
  color: #1f3b20;
  box-sizing: border-box;
}

input:focus {
  border-color: #2e7d32;
  outline: none;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
}

.primary-button,
.secondary-button {
  width: 100%;
  padding: 14px 18px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  box-sizing: border-box;
}

.primary-button {
  background: #2e7d32;
  color: #ffffff;
}

.primary-button:hover {
  background: #25612b;
}

.secondary-button {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 12px;
  background: #f0f7ef;
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.secondary-button:hover {
  background: #e8f3e6;
}

.error-message {
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fdecea;
  color: #c62828;
  font-size: 0.9rem;
  border: 1px solid rgba(198, 40, 40, 0.18);
}
</style>
