<template>
  <div class="review-page">
    <section class="review-panel">
      <div class="badge">Checkout</div>
      <h1>Review &amp; Pay</h1>
      <p>
        Please complete your delivery and payment details before proceeding.
      </p>

      <div v-if="!isLoggedIn" class="login-notice">
        Please
        <router-link to="/login">log in</router-link>
        before checking out.
      </div>

      <div v-else-if="cartDetails.length === 0" class="empty-notice">
        Your cart is empty.
        <router-link to="/">Go shopping</router-link>
      </div>

      <form v-else @submit.prevent="goToFinalCheckout">
        <!-- -- Recipient name ----------------------------------------- -->
        <div class="section-card">
          <h2 class="section-title">Recipient</h2>
          <div class="field">
            <label for="recipientName">Full name of recipient</label>
            <input
              id="recipientName"
              v-model="form.recipientName"
              type="text"
              placeholder="e.g. Jane Smith"
              required
            />
          </div>
        </div>

        <!-- -- Delivery address -------------------------------------- -->
        <div class="section-card">
          <h2 class="section-title">Delivery Address</h2>

          <!-- Saved addresses -->
          <div v-if="addresses.length > 0" class="saved-list">
            <label
              v-for="(addr, idx) in addresses"
              :key="'addr-' + idx"
              class="radio-label"
              :class="{ selected: selectedAddressIndex === idx }"
            >
              <input
                v-model="selectedAddressIndex"
                type="radio"
                name="delivery-address"
                :value="idx"
              />
              <span class="saved-details">
                <span class="saved-primary"
                  >{{ addr.line1
                  }}<template v-if="addr.line2"
                    >, {{ addr.line2 }}</template
                  ></span
                >
                <span class="saved-secondary"
                  >{{ addr.city }}, {{ addr.postcode
                  }}<template v-if="addr.country"
                    >, {{ addr.country }}</template
                  ></span
                >
              </span>
            </label>
          </div>

          <!-- "Add new address" toggle -->
          <label
            class="radio-label add-new-label"
            :class="{ selected: selectedAddressIndex === 'new' }"
          >
            <input
              v-model="selectedAddressIndex"
              type="radio"
              name="delivery-address"
              value="new"
            />
            <span>+ Add a new address</span>
          </label>

          <!-- Inline new-address form -->
          <div v-if="selectedAddressIndex === 'new'" class="inline-form">
            <div class="field">
              <label>Address line 1</label>
              <input
                v-model="newAddress.line1"
                type="text"
                placeholder="House number &amp; street name"
                :required="selectedAddressIndex === 'new'"
              />
            </div>
            <div class="field">
              <label
                >Address line 2 <span class="optional">(optional)</span></label
              >
              <input
                v-model="newAddress.line2"
                type="text"
                placeholder="Apartment, suite, etc."
              />
            </div>
            <div class="field-row">
              <div class="field">
                <label>City</label>
                <input
                  v-model="newAddress.city"
                  type="text"
                  placeholder="e.g. London"
                  :required="selectedAddressIndex === 'new'"
                />
              </div>
              <div class="field">
                <label>Postcode</label>
                <input
                  v-model="newAddress.postcode"
                  type="text"
                  placeholder="e.g. SW1A 1AA"
                  :required="selectedAddressIndex === 'new'"
                />
              </div>
            </div>
            <div class="field">
              <label>Country</label>
              <input
                v-model="newAddress.country"
                type="text"
                placeholder="e.g. United Kingdom"
                :required="selectedAddressIndex === 'new'"
              />
            </div>
            <button
              class="save-inline-button"
              type="button"
              @click="saveNewAddress"
            >
              Save address to profile
            </button>
          </div>

          <p v-if="addressError" class="inline-error">{{ addressError }}</p>
        </div>

        <!-- -- Payment method ---------------------------------------- -->
        <div class="section-card">
          <h2 class="section-title">Payment Method</h2>

          <!-- Saved payment methods -->
          <div v-if="payments.length > 0" class="saved-list">
            <label
              v-for="(pay, idx) in payments"
              :key="'pay-' + idx"
              class="radio-label"
              :class="{ selected: selectedPaymentIndex === idx }"
            >
              <input
                v-model="selectedPaymentIndex"
                type="radio"
                name="payment-method"
                :value="idx"
              />
              <span class="saved-details">
                <span class="saved-primary">{{ pay.cardHolder }}</span>
                <span class="saved-secondary">
                  Card ending &middot;&middot;&middot;&middot;
                  {{ pay.cardNumber.replace(/\s/g, "").slice(-4) }}
                  &nbsp;&middot;&nbsp; Expires {{ pay.expiry }}
                </span>
              </span>
            </label>
          </div>

          <!-- "Add new payment method" toggle -->
          <label
            class="radio-label add-new-label"
            :class="{ selected: selectedPaymentIndex === 'new' }"
          >
            <input
              v-model="selectedPaymentIndex"
              type="radio"
              name="payment-method"
              value="new"
            />
            <span>+ Add a new payment method</span>
          </label>

          <!-- Inline new-payment form -->
          <div v-if="selectedPaymentIndex === 'new'" class="inline-form">
            <div class="field">
              <label>Cardholder name</label>
              <input
                v-model="newPayment.cardHolder"
                type="text"
                placeholder="Name as it appears on card"
                :required="selectedPaymentIndex === 'new'"
              />
            </div>
            <div class="field">
              <label>Card number</label>
              <input
                v-model="newPayment.cardNumber"
                type="text"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                :required="selectedPaymentIndex === 'new'"
              />
            </div>
            <div class="field" style="max-width: 160px">
              <label>Expiry (MM/YY)</label>
              <input
                v-model="newPayment.expiry"
                type="text"
                maxlength="5"
                placeholder="MM/YY"
                :required="selectedPaymentIndex === 'new'"
              />
            </div>
            <button
              class="save-inline-button"
              type="button"
              @click="saveNewPayment"
            >
              Save payment to profile
            </button>
          </div>

          <p v-if="paymentError" class="inline-error">{{ paymentError }}</p>
        </div>

        <!-- -- Billing address --------------------------------------- -->
        <div class="section-card">
          <h2 class="section-title">Billing Address</h2>

          <fieldset class="radio-group">
            <legend>Where should the bill go?</legend>
            <label
              class="radio-label"
              :class="{ selected: form.billingAddressSame === true }"
            >
              <input
                v-model="form.billingAddressSame"
                type="radio"
                name="billing"
                :value="true"
              />
              <span>Same as delivery address</span>
            </label>
            <label
              class="radio-label"
              :class="{ selected: form.billingAddressSame === false }"
            >
              <input
                v-model="form.billingAddressSame"
                type="radio"
                name="billing"
                :value="false"
              />
              <span>Use a different billing address</span>
            </label>
          </fieldset>

          <div v-if="form.billingAddressSame === false" class="billing-fields">
            <p class="billing-intro">
              Please enter your billing address below.
            </p>
            <div class="field">
              <label>Address line 1</label>
              <input
                v-model="form.billingAddressLine1"
                type="text"
                placeholder="House number &amp; street name"
                required
              />
            </div>
            <div class="field">
              <label
                >Address line 2 <span class="optional">(optional)</span></label
              >
              <input
                v-model="form.billingAddressLine2"
                type="text"
                placeholder="Apartment, suite, etc."
              />
            </div>
            <div class="field-row">
              <div class="field">
                <label>City</label>
                <input
                  v-model="form.billingCity"
                  type="text"
                  placeholder="e.g. London"
                  required
                />
              </div>
              <div class="field">
                <label>Postcode</label>
                <input
                  v-model="form.billingPostcode"
                  type="text"
                  placeholder="e.g. SW1A 1AA"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label>Country</label>
              <input
                v-model="form.billingCountry"
                type="text"
                placeholder="e.g. United Kingdom"
                required
              />
            </div>
          </div>
        </div>

        <!-- -- Order summary + Shipping side by side ---------------- -->
        <div class="summary-shipping-row">
          <!-- Order summary -->
          <div class="section-card summary-card">
            <h2 class="section-title">Order Summary</h2>
            <ul class="summary-list">
              <li
                v-for="item in cartDetails"
                :key="item.id"
                class="summary-item"
              >
                <span class="summary-name">{{ item.name }}</span>
                <span class="summary-qty">&times; {{ item.quantity }}</span>
                <span class="summary-price"
                  >&pound;{{ (item.price * item.quantity).toFixed(2) }}</span
                >
              </li>
            </ul>
            <div class="summary-subtotal">
              Subtotal: <strong>&pound;{{ subtotal.toFixed(2) }}</strong>
            </div>
          </div>

          <!-- Shipping method -->
          <div class="section-card shipping-card">
            <h2 class="section-title">Shipping Method</h2>
            <fieldset class="radio-group">
              <legend>Select a shipping option</legend>
              <label
                class="radio-label shipping-option"
                :class="{ selected: form.shippingMethod === 'first' }"
              >
                <input
                  v-model="form.shippingMethod"
                  type="radio"
                  name="shipping"
                  value="first"
                />
                <div class="shipping-info">
                  <span class="shipping-name">First Class</span>
                  <span class="shipping-detail">Next working day</span>
                </div>
                <span class="shipping-cost">&pound;5.00</span>
              </label>
              <label
                class="radio-label shipping-option"
                :class="{ selected: form.shippingMethod === 'second' }"
              >
                <input
                  v-model="form.shippingMethod"
                  type="radio"
                  name="shipping"
                  value="second"
                />
                <div class="shipping-info">
                  <span class="shipping-name">Second Class</span>
                  <span class="shipping-detail">2-3 working days</span>
                </div>
                <span class="shipping-cost">&pound;2.50</span>
              </label>
            </fieldset>

            <div v-if="form.shippingMethod" class="order-total">
              Total (incl. shipping):
              <strong>&pound;{{ orderTotal.toFixed(2) }}</strong>
            </div>
          </div>
        </div>

        <!-- -- Action buttons --------------------------------------- -->
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="actions-row">
          <router-link class="secondary-button" to="/">
            Continue Shopping
          </router-link>
          <button class="primary-button" type="submit">
            Final Checkout &rarr;
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import type { CheckoutDetails } from "@/store";
import { catalogueItems, CatalogueItem } from "@/data/catalogue";

interface AddressInfo {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

interface PaymentInfo {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
}

interface CartProduct extends CatalogueItem {
  quantity: number;
}

function addressesKey(userId: number): string {
  return `addresses-v2-${userId}`;
}

function paymentsKey(userId: number): string {
  return `payments-v2-${userId}`;
}

function loadAddresses(userId: number): AddressInfo[] {
  try {
    const raw = localStorage.getItem(addressesKey(userId));
    return raw ? (JSON.parse(raw) as AddressInfo[]) : [];
  } catch {
    return [];
  }
}

function loadPayments(userId: number): PaymentInfo[] {
  try {
    const raw = localStorage.getItem(paymentsKey(userId));
    return raw ? (JSON.parse(raw) as PaymentInfo[]) : [];
  } catch {
    return [];
  }
}

export default defineComponent({
  name: "ReviewAndPayView",
  data() {
    return {
      formError: "",
      addressError: "",
      paymentError: "",
      addresses: [] as AddressInfo[],
      payments: [] as PaymentInfo[],
      selectedAddressIndex: 0 as number | "new",
      selectedPaymentIndex: 0 as number | "new",
      newAddress: {
        line1: "",
        line2: "",
        city: "",
        postcode: "",
        country: "",
      } as AddressInfo,
      newPayment: {
        cardHolder: "",
        cardNumber: "",
        expiry: "",
      } as PaymentInfo,
      form: {
        recipientName: "",
        billingAddressSame: true as boolean,
        billingAddressLine1: "",
        billingAddressLine2: "",
        billingCity: "",
        billingPostcode: "",
        billingCountry: "",
        shippingMethod: "" as "" | "first" | "second",
      },
    };
  },
  computed: {
    isLoggedIn(): boolean {
      return store.getters.isLoggedIn;
    },
    cartDetails(): CartProduct[] {
      return store.getters.cartItems
        .map((entry: { id: number; quantity: number }) => {
          const product = catalogueItems.find((item) => item.id === entry.id);
          if (!product) return null;
          return { ...product, quantity: entry.quantity };
        })
        .filter(
          (item: CartProduct | null): item is CartProduct => item !== null
        );
    },
    subtotal(): number {
      return this.cartDetails.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    shippingCost(): number {
      if (this.form.shippingMethod === "first") return 5.0;
      if (this.form.shippingMethod === "second") return 2.5;
      return 0;
    },
    orderTotal(): number {
      return this.subtotal + this.shippingCost;
    },
    selectedAddress(): AddressInfo | null {
      if (
        typeof this.selectedAddressIndex === "number" &&
        this.addresses[this.selectedAddressIndex]
      ) {
        return this.addresses[this.selectedAddressIndex];
      }
      return null;
    },
    selectedPayment(): PaymentInfo | null {
      if (
        typeof this.selectedPaymentIndex === "number" &&
        this.payments[this.selectedPaymentIndex]
      ) {
        return this.payments[this.selectedPaymentIndex];
      }
      return null;
    },
  },
  created() {
    const user = store.getters.currentUser;
    if (user) {
      this.addresses = loadAddresses(user.id);
      this.payments = loadPayments(user.id);
      // Default to first saved address / payment if they exist
      this.selectedAddressIndex = this.addresses.length > 0 ? 0 : "new";
      this.selectedPaymentIndex = this.payments.length > 0 ? 0 : "new";
    }
    // Restore recipient name and billing details from previously saved checkout
    const saved = store.getters.checkoutDetails as CheckoutDetails | null;
    if (saved) {
      this.form.recipientName = saved.recipientName;
      this.form.billingAddressSame = saved.billingAddressSame;
      this.form.billingAddressLine1 = saved.billingAddressLine1;
      this.form.billingAddressLine2 = saved.billingAddressLine2;
      this.form.billingCity = saved.billingCity;
      this.form.billingPostcode = saved.billingPostcode;
      this.form.billingCountry = saved.billingCountry ?? "";
      this.form.shippingMethod = saved.shippingMethod;
    }
  },
  methods: {
    saveNewAddress() {
      this.addressError = "";
      if (
        !this.newAddress.line1 ||
        !this.newAddress.city ||
        !this.newAddress.postcode ||
        !this.newAddress.country
      ) {
        this.addressError =
          "Please fill in address line 1, city, postcode and country.";
        return;
      }
      const user = store.getters.currentUser;
      if (!user) return;
      this.addresses.push({ ...this.newAddress });
      localStorage.setItem(
        addressesKey(user.id),
        JSON.stringify(this.addresses)
      );
      // Select the newly saved address
      this.selectedAddressIndex = this.addresses.length - 1;
      this.newAddress = {
        line1: "",
        line2: "",
        city: "",
        postcode: "",
        country: "",
      };
    },
    saveNewPayment() {
      this.paymentError = "";
      if (
        !this.newPayment.cardHolder ||
        !this.newPayment.cardNumber ||
        !this.newPayment.expiry
      ) {
        this.paymentError = "Please fill in all payment method fields.";
        return;
      }
      const user = store.getters.currentUser;
      if (!user) return;
      this.payments.push({ ...this.newPayment });
      localStorage.setItem(paymentsKey(user.id), JSON.stringify(this.payments));
      // Select the newly saved payment
      this.selectedPaymentIndex = this.payments.length - 1;
      this.newPayment = { cardHolder: "", cardNumber: "", expiry: "" };
    },
    goToFinalCheckout() {
      this.formError = "";

      // Validate delivery address
      if (this.selectedAddressIndex === "new") {
        this.formError =
          "Please save your new address before continuing (click 'Save address to profile').";
        return;
      }
      const addr = this.selectedAddress;
      if (!addr) {
        this.formError = "Please select a delivery address.";
        return;
      }

      // Validate payment method
      if (this.selectedPaymentIndex === "new") {
        this.formError =
          "Please save your new payment method before continuing (click 'Save payment to profile').";
        return;
      }
      const pay = this.selectedPayment;
      if (!pay) {
        this.formError = "Please select a payment method.";
        return;
      }

      // Validate shipping
      if (!this.form.shippingMethod) {
        this.formError = "Please select a shipping method.";
        return;
      }

      // Validate billing address
      if (
        this.form.billingAddressSame === false &&
        (!this.form.billingAddressLine1 ||
          !this.form.billingCity ||
          !this.form.billingPostcode)
      ) {
        this.formError = "Please complete your billing address.";
        return;
      }

      const details: CheckoutDetails = {
        recipientName: this.form.recipientName,
        addressLine1: addr.line1,
        addressLine2: addr.line2,
        city: addr.city,
        postcode: addr.postcode,
        country: addr.country,
        billingAddressSame: this.form.billingAddressSame,
        billingAddressLine1: this.form.billingAddressLine1,
        billingAddressLine2: this.form.billingAddressLine2,
        billingCity: this.form.billingCity,
        billingPostcode: this.form.billingPostcode,
        billingCountry: this.form.billingCountry,
        shippingMethod: this.form.shippingMethod as "first" | "second",
        paymentCardHolder: pay.cardHolder,
        paymentCardNumber: pay.cardNumber,
        paymentCardExpiry: pay.expiry,
      };

      store.commit("SET_CHECKOUT_DETAILS", details);
      this.$router.push({ name: "final-checkout" });
    },
  },
});
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 18px;
  background: radial-gradient(
    circle at top,
    #e9f7ee 0%,
    #d7efd6 45%,
    #b5d7b0 100%
  );
  color: #173820;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.review-panel {
  width: min(860px, 100%);
  padding: 38px 36px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 44px rgba(24, 74, 34, 0.12);
  border: 1px solid rgba(55, 122, 64, 0.14);
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
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  color: #1f3b20;
}

p {
  margin: 12px 0 24px;
  line-height: 1.7;
  color: #3a5e3d;
}

.login-notice,
.empty-notice {
  padding: 20px 24px;
  border-radius: 16px;
  background: #f6f9f1;
  border: 1px dashed rgba(46, 125, 50, 0.2);
  color: #2f5132;
  font-weight: 600;
}

.login-notice a,
.empty-notice a {
  color: #2e7d32;
  font-weight: 700;
}

/* -- Section cards ------------------------------------ */
.section-card {
  border: 1px solid rgba(46, 125, 50, 0.14);
  border-radius: 20px;
  padding: 24px 26px;
  background: #f9fcf8;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 18px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #1f3b20;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* -- Saved list (addresses / payments) ---------------- */
.saved-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

/* -- Radio labels ------------------------------------- */
.radio-label {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(46, 125, 50, 0.18);
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  font-size: 0.95rem;
  color: #1f3b20;
}

.radio-label:hover {
  border-color: #2e7d32;
  background: #f0f7ef;
}

.radio-label.selected {
  border-color: #2e7d32;
  background: #eaf5ea;
}

.radio-label input[type="radio"] {
  accent-color: #2e7d32;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.saved-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.saved-primary {
  font-weight: 700;
  color: #1f3b20;
}

.saved-secondary {
  font-size: 0.82rem;
  color: #4f7d58;
}

.add-new-label {
  margin-top: 10px;
  border-style: dashed;
  color: #2e7d32;
  font-weight: 700;
}

/* -- Inline add forms --------------------------------- */
.inline-form {
  margin-top: 16px;
  padding: 20px 22px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.save-inline-button {
  margin-top: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: #2e7d32;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.save-inline-button:hover {
  background: #25612b;
}

.inline-error {
  margin: 8px 0 0;
  font-size: 0.88rem;
  color: #c0392b;
  font-weight: 600;
}

/* -- Form fields -------------------------------------- */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.field label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2a4a2d;
}

.optional {
  font-weight: 400;
  color: #6a8a6e;
  font-size: 0.82rem;
}

.field input {
  padding: 11px 14px;
  border-radius: 12px;
  border: 1px solid rgba(46, 125, 50, 0.22);
  background: #fff;
  color: #1f3b20;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: #2e7d32;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* -- Radio groups (billing / shipping) ---------------- */
.radio-group {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-group legend {
  font-size: 0.88rem;
  font-weight: 700;
  color: #4a6f4d;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Shipping options */
.shipping-option {
  justify-content: space-between;
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.shipping-name {
  font-weight: 700;
  color: #1f3b20;
}

.shipping-detail {
  font-size: 0.82rem;
  color: #4f7d58;
}

.shipping-cost {
  font-weight: 800;
  color: #2e7d32;
}

/* -- Billing fields ----------------------------------- */
.billing-fields {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(46, 125, 50, 0.12);
}

.billing-intro {
  margin: 0 0 14px;
  font-size: 0.92rem;
  color: #2e7d32;
  font-weight: 600;
}

/* -- Summary + Shipping row --------------------------- */
.summary-shipping-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card,
.shipping-card {
  margin-bottom: 0;
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: grid;
  gap: 8px;
}

.summary-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.summary-name {
  flex: 1;
  font-weight: 600;
  color: #1f3b20;
  font-size: 0.92rem;
}

.summary-qty {
  color: #4f7d58;
  font-size: 0.88rem;
}

.summary-price {
  font-weight: 700;
  color: #1f3b20;
  font-size: 0.92rem;
}

.summary-subtotal {
  text-align: right;
  font-size: 0.95rem;
  color: #2a4a2d;
  padding-top: 10px;
  border-top: 1px solid rgba(46, 125, 50, 0.12);
}

.order-total {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #eaf5ea;
  border: 1px solid rgba(46, 125, 50, 0.2);
  font-size: 0.95rem;
  color: #1f3b20;
  text-align: right;
}

/* -- Actions ------------------------------------------ */
.form-error {
  margin: 0 0 14px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff0f0;
  border: 1px solid rgba(200, 50, 50, 0.2);
  color: #c0392b;
  font-weight: 600;
  font-size: 0.92rem;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  align-items: center;
  padding-top: 8px;
}

.secondary-button {
  padding: 14px 26px;
  border-radius: 999px;
  background: #f0f7ef;
  color: #2e7d32;
  font-weight: 700;
  border: 1px solid rgba(46, 125, 50, 0.25);
  cursor: pointer;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.secondary-button:hover {
  background: #e8f3e6;
  transform: translateY(-1px);
}

.primary-button {
  padding: 14px 26px;
  border-radius: 999px;
  background: #2e7d32;
  color: #ffffff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s ease, transform 0.2s ease;
}

.primary-button:hover {
  background: #25612b;
  transform: translateY(-1px);
}

/* -- Responsive --------------------------------------- */
@media (max-width: 640px) {
  .review-panel {
    padding: 24px 18px;
  }

  .summary-shipping-row {
    grid-template-columns: 1fr;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .actions-row {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .secondary-button,
  .primary-button {
    text-align: center;
    justify-content: center;
  }
}
</style>
