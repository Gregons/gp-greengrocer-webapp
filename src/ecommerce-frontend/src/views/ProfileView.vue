<template>
  <div class="profile-page">
    <section class="profile-panel">
      <div class="badge">My Profile</div>
      <h1>Your account details</h1>
      <p>Review your login info, address, and payment details.</p>

      <div class="details-group">
        <div class="detail-card">
          <h2>Login information</h2>
          <p>
            <strong>Name:</strong> {{ currentUser ? currentUser.name : "—" }}
          </p>
          <p>
            <strong>Email:</strong> {{ currentUser ? currentUser.email : "—" }}
          </p>
        </div>

        <div class="detail-card">
          <h2>Delivery address</h2>
          <template v-if="addressInfo">
            <p>{{ addressInfo.line1 }}</p>
            <p v-if="addressInfo.line2">{{ addressInfo.line2 }}</p>
            <p>{{ addressInfo.city }}, {{ addressInfo.postcode }}</p>
            <p>{{ addressInfo.country }}</p>
          </template>
          <p v-else>No address saved yet.</p>
        </div>

        <div class="detail-card">
          <h2>Payment details</h2>
          <template v-if="paymentInfo">
            <p>{{ paymentInfo.cardHolder }}</p>
            <p>
              Card ending in
              {{ paymentInfo.cardNumber.replace(/\s/g, "").slice(-4) }}
            </p>
            <p>Expires {{ paymentInfo.expiry }}</p>
          </template>
          <p v-else>No payment details saved yet.</p>
        </div>
      </div>

      <div class="action-group">
        <div class="action-group__left">
          <button class="primary-button" type="button" @click="openEditProfile">
            Edit profile
          </button>
          <button
            class="secondary-button"
            type="button"
            @click="openManageAddress"
          >
            {{ addressInfo ? "Edit address" : "Add address" }}
          </button>
          <button
            class="secondary-button"
            type="button"
            @click="openManagePayment"
          >
            Manage payment
          </button>
          <button class="secondary-button" type="button" @click="goToPurchases">
            Purchases
          </button>
        </div>
        <button class="logout-button" type="button" @click="handleLogout">
          Logout
        </button>
      </div>
    </section>

    <!-- Edit Profile Modal -->
    <div
      v-if="showEditProfile"
      class="modal-overlay"
      @click.self="showEditProfile = false"
    >
      <div class="modal">
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
          <label>
            Full name
            <input v-model="editName" type="text" required />
          </label>
          <label>
            Email address
            <input v-model="editEmail" type="email" required />
          </label>
          <div class="modal-actions">
            <button class="primary-button" type="submit">Save changes</button>
            <button
              class="secondary-button"
              type="button"
              @click="showEditProfile = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manage Address Modal -->
    <div
      v-if="showManageAddress"
      class="modal-overlay"
      @click.self="showManageAddress = false"
    >
      <div class="modal">
        <h2>{{ addressInfo ? "Edit address" : "Add address" }}</h2>
        <form @submit.prevent="saveAddress">
          <label>
            Address line 1
            <input v-model="editLine1" type="text" required />
          </label>
          <label>
            Address line 2 (optional)
            <input v-model="editLine2" type="text" />
          </label>
          <label>
            City
            <input v-model="editCity" type="text" required />
          </label>
          <label>
            Postcode
            <input v-model="editPostcode" type="text" required />
          </label>
          <label>
            Country
            <input v-model="editCountry" type="text" required />
          </label>
          <div class="modal-actions">
            <button class="primary-button" type="submit">Save address</button>
            <button
              class="secondary-button"
              type="button"
              @click="showManageAddress = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manage Payment Modal -->
    <div
      v-if="showManagePayment"
      class="modal-overlay"
      @click.self="showManagePayment = false"
    >
      <div class="modal">
        <h2>Manage Payment</h2>
        <form @submit.prevent="savePayment">
          <label>
            Cardholder name
            <input v-model="editCardHolder" type="text" required />
          </label>
          <label>
            Card number
            <input
              v-model="editCardNumber"
              type="text"
              maxlength="19"
              placeholder="1234 5678 9012 3456"
              required
            />
          </label>
          <label>
            Expiry (MM/YY)
            <input
              v-model="editExpiry"
              type="text"
              maxlength="5"
              placeholder="MM/YY"
              required
            />
          </label>
          <div class="modal-actions">
            <button class="primary-button" type="submit">Save payment</button>
            <button
              class="secondary-button"
              type="button"
              @click="showManagePayment = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import store from "@/store";

interface PaymentInfo {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
}

interface AddressInfo {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

function paymentKey(userId: number): string {
  return `payment-info-${userId}`;
}

function loadPayment(userId: number): PaymentInfo | null {
  try {
    const raw = localStorage.getItem(paymentKey(userId));
    return raw ? (JSON.parse(raw) as PaymentInfo) : null;
  } catch {
    return null;
  }
}

function addressKey(userId: number): string {
  return `address-info-${userId}`;
}

function loadAddress(userId: number): AddressInfo | null {
  try {
    const raw = localStorage.getItem(addressKey(userId));
    return raw ? (JSON.parse(raw) as AddressInfo) : null;
  } catch {
    return null;
  }
}

export default defineComponent({
  name: "ProfileView",
  data() {
    return {
      showEditProfile: false,
      showManagePayment: false,
      showManageAddress: false,
      editName: "",
      editEmail: "",
      editCardHolder: "",
      editCardNumber: "",
      editExpiry: "",
      editLine1: "",
      editLine2: "",
      editCity: "",
      editPostcode: "",
      editCountry: "",
      paymentInfo: null as PaymentInfo | null,
      addressInfo: null as AddressInfo | null,
    };
  },
  computed: {
    currentUser() {
      return store.getters.currentUser;
    },
  },
  created() {
    const user = store.getters.currentUser;
    if (user) {
      this.addressInfo = loadAddress(user.id);
      this.paymentInfo = loadPayment(user.id);
    }
  },
  methods: {
    openEditProfile() {
      this.editName = this.currentUser?.name ?? "";
      this.editEmail = this.currentUser?.email ?? "";
      this.showEditProfile = true;
    },
    saveProfile() {
      store.commit("UPDATE_PROFILE", {
        name: this.editName,
        email: this.editEmail,
      });
      this.showEditProfile = false;
    },
    openManageAddress() {
      if (this.addressInfo) {
        this.editLine1 = this.addressInfo.line1;
        this.editLine2 = this.addressInfo.line2;
        this.editCity = this.addressInfo.city;
        this.editPostcode = this.addressInfo.postcode;
        this.editCountry = this.addressInfo.country;
      } else {
        this.editLine1 = "";
        this.editLine2 = "";
        this.editCity = "";
        this.editPostcode = "";
        this.editCountry = "";
      }
      this.showManageAddress = true;
    },
    saveAddress() {
      const user = store.getters.currentUser;
      if (!user) return;
      const info: AddressInfo = {
        line1: this.editLine1,
        line2: this.editLine2,
        city: this.editCity,
        postcode: this.editPostcode,
        country: this.editCountry,
      };
      localStorage.setItem(addressKey(user.id), JSON.stringify(info));
      this.addressInfo = info;
      this.showManageAddress = false;
    },
    openManagePayment() {
      if (this.paymentInfo) {
        this.editCardHolder = this.paymentInfo.cardHolder;
        this.editCardNumber = this.paymentInfo.cardNumber;
        this.editExpiry = this.paymentInfo.expiry;
      } else {
        this.editCardHolder = "";
        this.editCardNumber = "";
        this.editExpiry = "";
      }
      this.showManagePayment = true;
    },
    savePayment() {
      const user = store.getters.currentUser;
      if (!user) return;
      const info: PaymentInfo = {
        cardHolder: this.editCardHolder,
        cardNumber: this.editCardNumber,
        expiry: this.editExpiry,
      };
      localStorage.setItem(paymentKey(user.id), JSON.stringify(info));
      this.paymentInfo = info;
      this.showManagePayment = false;
    },
    goToPurchases() {
      router.push({ name: "purchases" });
    },
    handleLogout() {
      store.commit("LOGOUT");
      router.push({ name: "home" });
    },
  },
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  background: radial-gradient(
    circle at top,
    #e8f7e8 0%,
    #cef0d1 45%,
    #9ed49e 100%
  );
  color: #173820;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.profile-panel {
  width: min(720px, 100%);
  padding: 38px 36px;
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
  font-size: clamp(2rem, 3.2vw, 2.9rem);
  color: #1f3b20;
}

p {
  margin: 14px 0 30px;
  line-height: 1.7;
  color: #3a5e3d;
}

.details-group {
  display: grid;
  gap: 18px;
}

.detail-card {
  padding: 24px;
  border-radius: 22px;
  background: #f6fbf5;
  border: 1px solid rgba(46, 125, 50, 0.14);
}

.detail-card h2 {
  margin-top: 0;
  font-size: 1.15rem;
  color: #25522f;
}

.detail-card p {
  margin: 10px 0 0;
  color: #2f5132;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 14px;
  margin-top: 28px;
  align-items: center;
}

.action-group__left {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.primary-button,
.secondary-button,
.logout-button {
  padding: 14px 20px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.primary-button {
  background: #2e7d32;
  color: #ffffff;
}

.primary-button:hover {
  background: #25612b;
}

.secondary-button {
  background: #f0f7ef;
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.secondary-button:hover {
  background: #e8f3e6;
}

.logout-button {
  background: #ffffff;
  color: #d32f2f;
  border: 1px solid rgba(211, 47, 47, 0.18);
  box-shadow: 0 10px 20px rgba(211, 47, 47, 0.08);
}

.logout-button:hover {
  background: #fdecec;
  transform: translateY(-1px);
}

/* ── Modals ───────────────────────────────────────────────────────────────── */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: min(440px, 92vw);
  padding: 32px 28px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 24px 48px rgba(24, 74, 34, 0.18);
  text-align: left;
}

.modal h2 {
  margin: 0 0 22px;
  font-size: 1.4rem;
  color: #1f3b20;
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #2f5132;
  font-size: 0.9rem;
}

.modal input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(46, 125, 50, 0.28);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.modal input:focus {
  border-color: #2e7d32;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
</style>
