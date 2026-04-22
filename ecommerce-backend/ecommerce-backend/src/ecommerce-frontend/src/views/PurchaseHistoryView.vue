<template>
  <div class="purchases-page">
    <section class="purchases-panel">
      <div class="badge">Purchase History</div>
      <h1>Your orders</h1>
      <p>A full record of every order you have placed.</p>

      <div v-if="purchases.length" class="orders-list">
        <div v-for="order in purchases" :key="order.orderId" class="order-card">
          <div class="order-header">
            <div class="order-meta">
              <span class="order-id">{{ order.orderId }}</span>
              <span class="order-date">{{ order.date }}</span>
            </div>
            <div class="order-total">£{{ order.total.toFixed(2) }}</div>
          </div>
          <ul class="order-items">
            <li v-for="item in order.items" :key="item.id" class="order-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">× {{ item.quantity }}</span>
              <span class="item-line"
                >£{{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="empty-state">
        <span v-if="!isLoggedIn">
          Please
          <router-link to="/login">log in</router-link>
          to view your purchase history.
        </span>
        <span v-else-if="loadError">{{ loadError }}</span>
        <span v-else>
          You have not placed any orders yet. Head to the shop to get started.
        </span>
      </div>

      <div class="action-group">
        <router-link to="/profile">
          <button class="secondary-button" type="button">
            ← Back to profile
          </button>
        </router-link>
        <router-link to="/">
          <button class="primary-button" type="button">
            Continue shopping
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import type { Purchase } from "@/store";
import { fetchOrders } from "@/api";

export default defineComponent({
  name: "PurchaseHistoryView",
  data() {
    return {
      loadError: "",
    };
  },
  computed: {
    isLoggedIn(): boolean {
      return store.getters.isLoggedIn;
    },
    purchases(): Purchase[] {
      return store.getters.purchases;
    },
  },
  async mounted() {
    if (!store.getters.isLoggedIn) return;
    try {
      const orders = await fetchOrders();
      // Replace in-memory list with server truth
      store.commit("CLEAR_PURCHASES");
      orders.forEach((o) =>
        store.commit("ADD_PURCHASE", {
          orderId: o.orderId,
          date: o.date,
          items: o.items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total: o.total,
        })
      );
    } catch (e: unknown) {
      this.loadError = e instanceof Error ? e.message : "Failed to load orders";
    }
  },
});
</script>

<style scoped>
.purchases-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
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

.purchases-panel {
  width: min(760px, 100%);
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.order-card {
  padding: 24px;
  border-radius: 22px;
  background: #f6fbf5;
  border: 1px solid rgba(46, 125, 50, 0.14);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-weight: 700;
  font-size: 0.95rem;
  color: #25522f;
}

.order-date {
  font-size: 0.82rem;
  color: #5a7c5e;
}

.order-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2e7d32;
}

.order-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.93rem;
  color: #2f5132;
}

.item-name {
  flex: 1;
}

.item-qty {
  color: #5a7c5e;
  min-width: 32px;
  text-align: center;
}

.item-line {
  min-width: 60px;
  text-align: right;
  font-weight: 600;
}

.empty-state {
  padding: 36px;
  border-radius: 22px;
  background: #f6fbf5;
  border: 1px solid rgba(46, 125, 50, 0.14);
  color: #3a5e3d;
  text-align: center;
  font-size: 1rem;
  margin-bottom: 8px;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
  align-items: center;
}

.action-group a {
  text-decoration: none;
}

.primary-button,
.secondary-button {
  padding: 14px 20px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, transform 0.2s ease;
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
</style>
