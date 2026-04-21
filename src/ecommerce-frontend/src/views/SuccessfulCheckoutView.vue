<template>
  <div class="success-page">
    <section class="success-panel">
      <!-- ── Success header ──────────────────────────────────────── -->
      <div class="success-icon" aria-hidden="true">✓</div>
      <div class="badge">Payment Successful</div>
      <h1>Thank you for shopping at Greengrocers!</h1>
      <p>
        Your order has been placed and payment confirmed. We'll get your fresh
        produce on its way to you as soon as possible.
      </p>

      <div v-if="!successfulOrder" class="notice">
        No order information found.
        <router-link to="/">Return to the shop</router-link>
      </div>

      <template v-else>
        <!-- ── Order reference ─────────────────────────────────── -->
        <div class="section-card highlight-card">
          <div class="order-ref-row">
            <div>
              <div class="ref-label">Order Number</div>
              <div class="ref-value">
                {{ successfulOrder.purchase.orderId }}
              </div>
            </div>
            <div>
              <div class="ref-label">Order Date</div>
              <div class="ref-value">{{ successfulOrder.purchase.date }}</div>
            </div>
          </div>
        </div>

        <!-- ── Items purchased ─────────────────────────────────── -->
        <div class="section-card">
          <h2 class="section-title">Items Purchased</h2>
          <ul class="items-list">
            <li
              v-for="item in successfulOrder.purchase.items"
              :key="item.id"
              class="item-row"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">× {{ item.quantity }}</span>
              <span class="item-price"
                >£{{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </li>
          </ul>
          <div class="order-total-row">
            <span>Total paid</span>
            <span>£{{ successfulOrder.purchase.total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- ── Delivery estimate ───────────────────────────────── -->
        <div class="section-card delivery-card">
          <h2 class="section-title">Delivery Information</h2>
          <div class="delivery-content">
            <div class="delivery-icon" aria-hidden="true">
              {{ successfulOrder.shippingMethod === "first" ? "🚀" : "📦" }}
            </div>
            <div>
              <div class="delivery-method">
                {{
                  successfulOrder.shippingMethod === "first"
                    ? "First Class"
                    : "Second Class"
                }}
              </div>
              <div class="delivery-estimate">
                Estimated delivery:
                <strong>
                  {{
                    successfulOrder.shippingMethod === "first"
                      ? "Next working day"
                      : "2–3 working days"
                  }}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Back to shopping ────────────────────────────────── -->
        <div class="actions-row">
          <router-link class="back-button" to="/">
            Back to Shopping
          </router-link>
        </div>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import type { SuccessfulOrder } from "@/store";

export default defineComponent({
  name: "SuccessfulCheckoutView",
  computed: {
    successfulOrder(): SuccessfulOrder | null {
      return store.getters.successfulOrder;
    },
  },
});
</script>

<style scoped>
.success-page {
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

.success-panel {
  width: min(680px, 100%);
  padding: 38px 36px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 44px rgba(24, 74, 34, 0.12);
  border: 1px solid rgba(55, 122, 64, 0.14);
  text-align: left;
}

/* ── Success icon ───────────────────────────────── */
.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #2e7d32;
  color: #fff;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.3);
}

.badge {
  display: inline-block;
  margin-bottom: 14px;
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
  font-size: clamp(1.5rem, 2.8vw, 2.2rem);
  color: #1f3b20;
  line-height: 1.3;
}

p {
  margin: 12px 0 26px;
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

/* ── Cards ──────────────────────────────────────── */
.section-card {
  border: 1px solid rgba(46, 125, 50, 0.14);
  border-radius: 20px;
  padding: 22px 24px;
  background: #f9fcf8;
  margin-bottom: 18px;
}

.highlight-card {
  background: #eaf5ea;
  border-color: rgba(46, 125, 50, 0.28);
}

.section-title {
  margin: 0 0 16px;
  font-size: 0.88rem;
  font-weight: 800;
  color: #1f3b20;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

/* ── Order reference ────────────────────────────── */
.order-ref-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.ref-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #4f7d58;
  margin-bottom: 4px;
}

.ref-value {
  font-size: 1rem;
  font-weight: 800;
  color: #1f3b20;
  font-family: "Courier New", monospace;
}

/* ── Items list ─────────────────────────────────── */
.items-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: grid;
  gap: 8px;
}

.item-row {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.item-name {
  flex: 1;
  font-weight: 600;
  color: #1f3b20;
  font-size: 0.92rem;
}

.item-qty {
  color: #4f7d58;
  font-size: 0.88rem;
}

.item-price {
  font-weight: 700;
  color: #1f3b20;
  font-size: 0.92rem;
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 800;
  font-size: 1rem;
  color: #1f3b20;
  padding-top: 12px;
  border-top: 1px solid rgba(46, 125, 50, 0.14);
}

/* ── Delivery card ──────────────────────────────── */
.delivery-card {
  background: #f0f7ef;
  border-color: rgba(46, 125, 50, 0.2);
}

.delivery-content {
  display: flex;
  align-items: center;
  gap: 18px;
}

.delivery-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.delivery-method {
  font-weight: 800;
  color: #1f3b20;
  font-size: 1rem;
  margin-bottom: 4px;
}

.delivery-estimate {
  font-size: 0.92rem;
  color: #3a5e3d;
}

/* ── Actions ────────────────────────────────────── */
.actions-row {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.back-button {
  padding: 16px 36px;
  border-radius: 999px;
  background: #2e7d32;
  color: #ffffff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.back-button:hover {
  background: #25612b;
  transform: translateY(-2px);
}

@media (max-width: 540px) {
  .success-panel {
    padding: 24px 16px;
  }

  .order-ref-row {
    gap: 20px;
  }
}
</style>
