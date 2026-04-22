<template>
  <div class="profile-page">
    <section class="profile-panel">
      <div class="badge">My Profile</div>
      <h1>Your account details</h1>
      <p>Review your login info, addresses, and payment methods.</p>

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
          <h2>Delivery addresses</h2>
          <template v-if="addresses.length > 0">
            <div v-for="(addr, idx) in addresses" :key="idx" class="saved-item">
              <label class="radio-label">
                <input
                  type="radio"
                  name="address-select"
                  :value="idx"
                  v-model="selectedAddressIndex"
                />
                <span class="saved-item__details">
                  <span>{{ addr.line1 }}</span>
                  <span v-if="addr.line2">{{ addr.line2 }}</span>
                  <span>{{ addr.city }}, {{ addr.postcode }}</span>
                  <span>{{ addr.country }}</span>
                </span>
              </label>
              <button
                class="remove-button"
                type="button"
                @click="removeAddress(idx)"
              >
                ✕
              </button>
            </div>
          </template>
          <p v-else>No addresses saved yet.</p>
        </div>

        <div class="detail-card">
          <h2>Payment methods</h2>
          <template v-if="payments.length > 0">
            <div v-for="(pay, idx) in payments" :key="idx" class="saved-item">
              <label class="radio-label">
                <input
                  type="radio"
                  name="payment-select"
                  :value="idx"
                  v-model="selectedPaymentIndex"
                />
                <span class="saved-item__details">
                  <span>{{ pay.cardHolder }}</span>
                  <span>
                    Card ending in
                    {{ pay.cardNumber.replace(/\s/g, "").slice(-4) }}
                  </span>
                  <span>Expires {{ pay.expiry }}</span>
                </span>
              </label>
              <button
                class="remove-button"
                type="button"
                @click="removePayment(idx)"
              >
                ✕
              </button>
            </div>
          </template>
          <p v-else>No payment methods saved yet.</p>
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
            @click="openAddAddress"
          >
            Add address
          </button>
          <button
            class="secondary-button"
            type="button"
            @click="openAddPayment"
          >
            Add payment
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

    <!-- Add Address Modal -->
    <div
      v-if="showAddAddress"
      class="modal-overlay"
      @click.self="showAddAddress = false"
    >
      <div class="modal">
        <h2>Add address</h2>
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
              @click="showAddAddress = false"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Payment Modal -->
    <div
      v-if="showAddPayment"
      class="modal-overlay"
      @click.self="showAddPayment = false"
    >
      <div class="modal">
        <h2>Add payment method</h2>
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
              @click="showAddPayment = false"
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

function addressesKey(userId: number): string {
  return `addresses-v2-${userId}`;
}

function selectedAddressKey(userId: number): string {
  return `selected-address-${userId}`;
}

function loadAddresses(userId: number): AddressInfo[] {
  try {
    const raw = localStorage.getItem(addressesKey(userId));
    return raw ? (JSON.parse(raw) as AddressInfo[]) : [];
  } catch {
    return [];
  }
}

function loadSelectedAddress(userId: number): number {
  const raw = localStorage.getItem(selectedAddressKey(userId));
  const idx = raw !== null ? parseInt(raw, 10) : 0;
  return isNaN(idx) ? 0 : idx;
}

function paymentsKey(userId: number): string {
  return `payments-v2-${userId}`;
}

function selectedPaymentKey(userId: number): string {
  return `selected-payment-${userId}`;
}

function loadPayments(userId: number): PaymentInfo[] {
  try {
    const raw = localStorage.getItem(paymentsKey(userId));
    return raw ? (JSON.parse(raw) as PaymentInfo[]) : [];
  } catch {
    return [];
  }
}

function loadSelectedPayment(userId: number): number {
  const raw = localStorage.getItem(selectedPaymentKey(userId));
  const idx = raw !== null ? parseInt(raw, 10) : 0;
  return isNaN(idx) ? 0 : idx;
}

export default defineComponent({
  name: "ProfileView",
  data() {
    return {
      showEditProfile: false,
      showAddPayment: false,
      showAddAddress: false,
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
      addresses: [] as AddressInfo[],
      payments: [] as PaymentInfo[],
      selectedAddressIndex: 0,
      selectedPaymentIndex: 0,
    };
  },
  computed: {
    currentUser() {
      return store.getters.currentUser;
    },
  },
  watch: {
    selectedAddressIndex(newVal: number) {
      const user = store.getters.currentUser;
      if (user) {
        localStorage.setItem(selectedAddressKey(user.id), String(newVal));
      }
    },
    selectedPaymentIndex(newVal: number) {
      const user = store.getters.currentUser;
      if (user) {
        localStorage.setItem(selectedPaymentKey(user.id), String(newVal));
      }
    },
  },
  created() {
    const user = store.getters.currentUser;
    if (user) {
      this.addresses = loadAddresses(user.id);
      this.selectedAddressIndex = Math.min(
        loadSelectedAddress(user.id),
        Math.max(0, this.addresses.length - 1)
      );
      this.payments = loadPayments(user.id);
      this.selectedPaymentIndex = Math.min(
        loadSelectedPayment(user.id),
        Math.max(0, this.payments.length - 1)
      );
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
    openAddAddress() {
      this.editLine1 = "";
      this.editLine2 = "";
      this.editCity = "";
      this.editPostcode = "";
      this.editCountry = "";
      this.showAddAddress = true;
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
      this.addresses.push(info);
      localStorage.setItem(
        addressesKey(user.id),
        JSON.stringify(this.addresses)
      );
      this.selectedAddressIndex = this.addresses.length - 1;
      this.showAddAddress = false;
    },
    removeAddress(idx: number) {
      const user = store.getters.currentUser;
      if (!user) return;
      this.addresses.splice(idx, 1);
      localStorage.setItem(
        addressesKey(user.id),
        JSON.stringify(this.addresses)
      );
      if (this.addresses.length === 0) {
        this.selectedAddressIndex = 0;
      } else if (this.selectedAddressIndex >= this.addresses.length) {
        this.selectedAddressIndex = this.addresses.length - 1;
      }
    },
    openAddPayment() {
      this.editCardHolder = "";
      this.editCardNumber = "";
      this.editExpiry = "";
      this.showAddPayment = true;
    },
    savePayment() {
      const user = store.getters.currentUser;
      if (!user) return;
      const info: PaymentInfo = {
        cardHolder: this.editCardHolder,
        cardNumber: this.editCardNumber,
        expiry: this.editExpiry,
      };
      this.payments.push(info);
      localStorage.setItem(paymentsKey(user.id), JSON.stringify(this.payments));
      this.selectedPaymentIndex = this.payments.length - 1;
      this.showAddPayment = false;
    },
    removePayment(idx: number) {
      const user = store.getters.currentUser;
      if (!user) return;
      this.payments.splice(idx, 1);
      localStorage.setItem(paymentsKey(user.id), JSON.stringify(this.payments));
      if (this.payments.length === 0) {
        this.selectedPaymentIndex = 0;
      } else if (this.selectedPaymentIndex >= this.payments.length) {
        this.selectedPaymentIndex = this.payments.length - 1;
      }
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

/* ── Saved item list (addresses / payment methods) ───────────────────────── */

.saved-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(46, 125, 50, 0.1);
}

.saved-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.radio-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.radio-label input[type="radio"] {
  margin-top: 3px;
  accent-color: #2e7d32;
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.saved-item__details {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #2f5132;
  font-size: 0.95rem;
}

.remove-button {
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 8px;
  transition: background 0.15s;
  flex-shrink: 0;
}

.remove-button:hover {
  background: #fdecea;
}
</style>
