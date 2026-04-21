<template>
  <div class="final-checkout-page">
    <section class="final-checkout-panel">
      <div class="badge">Final Checkout</div>
      <h1>Review your order</h1>
      <p>
        Please check all your details below before completing your purchase.
      </p>

      <div v-if="!checkoutDetails || !cartDetails.length" class="notice">
        No order details found.
        <router-link to="/cart">Return to cart</router-link>
      </div>

      <template v-else>
        <!-- ── Delivery details ─────────────────────────────────── -->
        <div class="section-card">
          <h2 class="section-title">Delivery Details</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Recipient</span>
              <span class="detail-value">{{
                checkoutDetails.recipientName
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address</span>
              <span class="detail-value">
                {{ checkoutDetails.addressLine1
                }}<template v-if="checkoutDetails.addressLine2"
                  >, {{ checkoutDetails.addressLine2 }}</template
                >, {{ checkoutDetails.city }}, {{ checkoutDetails.postcode
                }}<template v-if="checkoutDetails.country"
                  >, {{ checkoutDetails.country }}</template
                >
              </span>
            </div>
          </div>
        </div>

        <!-- ── Billing address ─────────────────────────────────── -->
        <div class="section-card">
          <h2 class="section-title">Billing Address</h2>
          <div class="detail-grid">
            <div v-if="checkoutDetails.billingAddressSame" class="detail-row">
              <span class="detail-label">Billing address</span>
              <span class="detail-value same-tag"
                >Same as delivery address</span
              >
            </div>
            <template v-else>
              <div class="detail-row">
                <span class="detail-label">Billing address</span>
                <span class="detail-value">
                  {{ checkoutDetails.billingAddressLine1
                  }}<template v-if="checkoutDetails.billingAddressLine2"
                    >, {{ checkoutDetails.billingAddressLine2 }}</template
                  >, {{ checkoutDetails.billingCity }},
                  {{ checkoutDetails.billingPostcode
                  }}<template v-if="checkoutDetails.billingCountry"
                    >, {{ checkoutDetails.billingCountry }}</template
                  >
                </span>
              </div>
            </template>
          </div>
        </div>

        <!-- ── Payment method ─────────────────────────────────── -->
        <div class="section-card">
          <h2 class="section-title">Payment Method</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Cardholder</span>
              <span class="detail-value">{{
                checkoutDetails.paymentCardHolder
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Card number</span>
              <span class="detail-value"
                >···· ···· ····
                {{
                  checkoutDetails.paymentCardNumber.replace(/\s/g, "").slice(-4)
                }}</span
              >
            </div>
            <div class="detail-row">
              <span class="detail-label">Expires</span>
              <span class="detail-value">{{
                checkoutDetails.paymentCardExpiry
              }}</span>
            </div>
          </div>
        </div>

        <!-- ── Shipping method ─────────────────────────────────── -->
        <div class="section-card">
          <h2 class="section-title">Shipping Method</h2>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">
                {{
                  checkoutDetails.shippingMethod === "first"
                    ? "First Class"
                    : "Second Class"
                }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estimated delivery</span>
              <span class="detail-value">
                {{
                  checkoutDetails.shippingMethod === "first"
                    ? "Next working day"
                    : "2–3 working days"
                }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Shipping cost</span>
              <span class="detail-value">£{{ shippingCost.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- ── Order summary ───────────────────────────────────── -->
        <div class="section-card">
          <h2 class="section-title">Order Summary</h2>
          <ul class="summary-list">
            <li v-for="item in cartDetails" :key="item.id" class="summary-item">
              <span class="summary-name">{{ item.name }}</span>
              <span class="summary-qty">× {{ item.quantity }}</span>
              <span class="summary-price"
                >£{{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </li>
          </ul>
          <div class="totals-block">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>£{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="totals-row">
              <span>Shipping</span>
              <span>£{{ shippingCost.toFixed(2) }}</span>
            </div>
            <div class="totals-row total-row">
              <span>Total</span>
              <span>£{{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- ── Error ──────────────────────────────────────────── -->
        <p v-if="checkoutError" class="form-error">{{ checkoutError }}</p>

        <!-- ── Actions ────────────────────────────────────────── -->
        <div class="actions-row">
          <router-link class="secondary-button" to="/">
            Continue Shopping
          </router-link>
          <button
            class="primary-button"
            type="button"
            :disabled="paying"
            @click="pay"
          >
            {{ paying ? "Processing…" : "Pay £" + orderTotal.toFixed(2) }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import type { CheckoutDetails, Purchase, SuccessfulOrder } from "@/store";
import { catalogueItems, CatalogueItem } from "@/data/catalogue";
import { placeOrder } from "@/api";

interface CartProduct extends CatalogueItem {
  quantity: number;
}

export default defineComponent({
  name: "FinalCheckoutView",
  data() {
    return {
      paying: false,
      checkoutError: "",
    };
  },
  computed: {
    checkoutDetails(): CheckoutDetails | null {
      return store.getters.checkoutDetails;
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
      if (this.checkoutDetails?.shippingMethod === "first") return 5.0;
      if (this.checkoutDetails?.shippingMethod === "second") return 2.5;
      return 0;
    },
    orderTotal(): number {
      return this.subtotal + this.shippingCost;
    },
  },
  methods: {
    async pay() {
      if (!this.checkoutDetails || !this.cartDetails.length) return;
      this.checkoutError = "";
      this.paying = true;
      try {
        const saved = await placeOrder({
          items: this.cartDetails.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: this.orderTotal,
        });

        const purchase: Purchase = {
          orderId: saved.orderId,
          date: saved.date,
          items: saved.items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total: saved.total,
        };

        const successfulOrder: SuccessfulOrder = {
          purchase,
          shippingMethod: this.checkoutDetails.shippingMethod,
        };

        store.commit("ADD_PURCHASE", purchase);
        store.commit("SET_SUCCESSFUL_ORDER", successfulOrder);
        store.commit("CLEAR_CART");
        this.$router.push({ name: "successful-checkout" });
      } catch (e: unknown) {
        this.checkoutError =
          e instanceof Error ? e.message : "Payment failed. Please try again.";
      } finally {
        this.paying = false;
      }
    },
  },
});
</script>

<style scoped>
.final-checkout-page {
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

.final-checkout-panel {
  width: min(720px, 100%);
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

.notice {
  padding: 20px 24px;
  border-radius: 16px;
  background: #f6f9f1;
  border: 1px dashed rgba(46, 125, 50, 0.2);
  color: #2f5132;
  font-weight: 600;
}

.notice a {
  color: #2e7d32;
  font-weight: 700;
}

/* ── Section cards ──────────────────────────────── */
.section-card {
  border: 1px solid rgba(46, 125, 50, 0.14);
  border-radius: 20px;
  padding: 22px 24px;
  background: #f9fcf8;
  margin-bottom: 18px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 0.88rem;
  font-weight: 800;
  color: #1f3b20;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

/* ── Detail rows ────────────────────────────────── */
.detail-grid {
  display: grid;
  gap: 10px;
}

.detail-row {
  display: flex;
  gap: 16px;
  align-items: baseline;
}

.detail-label {
  min-width: 130px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4f7d58;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.detail-value {
  font-size: 0.95rem;
  color: #1f3b20;
}

.same-tag {
  font-style: italic;
  color: #4f7d58;
}

/* ── Summary ────────────────────────────────────── */
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: grid;
  gap: 8px;
}

.summary-item {
  display: flex;
  gap: 10px;
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

/* ── Totals ─────────────────────────────────────── */
.totals-block {
  border-top: 1px solid rgba(46, 125, 50, 0.12);
  padding-top: 12px;
  display: grid;
  gap: 6px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.92rem;
  color: #2a4a2d;
}

.total-row {
  font-weight: 800;
  font-size: 1rem;
  color: #1f3b20;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(46, 125, 50, 0.16);
}

/* ── Actions ────────────────────────────────────── */
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

.primary-button:hover:not(:disabled) {
  background: #25612b;
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 540px) {
  .final-checkout-panel {
    padding: 24px 16px;
  }

  .detail-row {
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    min-width: unset;
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
