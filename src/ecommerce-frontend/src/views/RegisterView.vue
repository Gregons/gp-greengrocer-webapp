<template>
  <div class="register-page">
    <section class="register-panel">
      <div class="badge">Create Your GreenGrocers Account</div>
      <h1>Register for a new account</h1>
      <p>Fill in your details below to start shopping fresh produce.</p>

      <form class="register-form" @submit.prevent="handleRegister">
        <label>
          Full name
          <input
            v-model="name"
            type="text"
            placeholder="Your full name"
            required
          />
        </label>

        <label>
          Email address
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            v-model="password"
            type="password"
            placeholder="Create a password"
            minlength="6"
            required
          />
          <small class="field-hint">At least 6 characters</small>
        </label>

        <label>
          Confirm password
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </label>

        <button class="primary-button" type="submit" :disabled="loading">
          {{ loading ? "Creating account…" : "Register" }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import store from "@/store";
import { registerUser } from "@/api";

export default defineComponent({
  name: "RegisterView",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";
      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match";
        return;
      }
      this.loading = true;
      try {
        const user = await registerUser({
          name: this.name,
          email: this.email,
          password: this.password,
        });
        store.commit("SET_USER", user);
        router.push({ name: "home" });
      } catch (e: unknown) {
        this.errorMessage =
          e instanceof Error ? e.message : "Registration failed";
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
.register-page {
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

.register-panel {
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

.register-form {
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

.primary-button {
  width: 100%;
  padding: 14px 18px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: #2e7d32;
  color: #ffffff;
  transition: background 0.2s ease, color 0.2s ease;
  box-sizing: border-box;
}

.primary-button:hover {
  background: #25612b;
}

.field-hint {
  display: block;
  margin-top: 4px;
  font-size: 0.78rem;
  color: #4a7c59;
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
