<template>
  <div class="cart-page">
    <section class="cart-panel">
      <div class="badge">Shopping Cart</div>
      <h1>Your cart</h1>
      <p>
        Review your selected items, update quantities, and checkout when ready.
      </p>

      <div v-if="cartDetails.length" class="cart-list">
        <div v-for="item in cartDetails" :key="item.id" class="cart-row">
          <img :src="item.image" :alt="item.name" />
          <div class="cart-meta">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-category">{{ item.category }}</div>
            <div class="item-price">£{{ item.price.toFixed(2) }} each</div>
          </div>
          <div class="quantity-controls">
            <div class="quantity-row">
              <button type="button" @click="decrement(item.id)">−</button>
              <div class="quantity-display">{{ item.quantity }}</div>
              <button type="button" @click="increment(item.id)">+</button>
            </div>
            <button
              class="remove-button"
              type="button"
              @click="removeItem(item.id)"
            >
              Remove
            </button>
          </div>
          <div class="item-subtotal">
            £{{ (item.price * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        Your cart is empty. Add some fresh produce from the home page.
      </div>

      <div v-if="cartDetails.length" class="checkout-strip">
        <div class="subtotal">Total: £{{ subtotal.toFixed(2) }}</div>
        <div class="checkout-right">
          <p v-if="checkoutError" class="checkout-error">{{ checkoutError }}</p>
          <button
            class="checkout-button"
            type="button"
            :disabled="checkoutLoading"
            @click="handleCheckout"
          >
            {{ checkoutLoading ? "Placing order…" : "Checkout" }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import store from "@/store";
import type { Purchase } from "@/store";
import { catalogueItems, CatalogueItem } from "@/data/catalogue";
import { placeOrder } from "@/api";

interface CartProduct extends CatalogueItem {
  quantity: number;
}

export default defineComponent({
  name: "CartView",
  data() {
    return {
      checkoutError: "",
      checkoutLoading: false,
    };
  },
  computed: {
    cartDetails(): CartProduct[] {
      const rawList = store.getters.cartItems.map(
        (entry: { id: number; quantity: number }) => {
          const product = catalogueItems.find((item) => item.id === entry.id);
          if (!product) {
            return null;
          }
          return {
            ...product,
            quantity: entry.quantity,
          };
        }
      ) as Array<CartProduct | null>;

      return rawList.filter((item): item is CartProduct => item !== null);
    },
    subtotal(): number {
      return this.cartDetails.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  methods: {
    increment(itemId: number) {
      const current = store.getters.cartCount(itemId);
      store.commit("SET_CART_QUANTITY", {
        id: itemId,
        quantity: current + 1,
      });
    },
    decrement(itemId: number) {
      const current = store.getters.cartCount(itemId);
      store.commit("SET_CART_QUANTITY", {
        id: itemId,
        quantity: Math.max(current - 1, 0),
      });
    },
    removeItem(itemId: number) {
      store.commit("SET_CART_QUANTITY", {
        id: itemId,
        quantity: 0,
      });
    },
    async handleCheckout() {
      if (!this.cartDetails.length) return;
      this.checkoutError = "";
      if (!store.getters.isLoggedIn) {
        this.checkoutError = "Please log in before checking out";
        return;
      }
      this.checkoutLoading = true;
      try {
        const saved = await placeOrder({
          items: this.cartDetails.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: this.subtotal,
        });
        // Mirror into Vuex so purchases page updates instantly
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
        store.commit("ADD_PURCHASE", purchase);
        store.commit("CLEAR_CART");
        router.push({ name: "purchases" });
      } catch (e: unknown) {
        this.checkoutError = e instanceof Error ? e.message : "Checkout failed";
      } finally {
        this.checkoutLoading = false;
      }
    },
  },
});
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
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

.cart-panel {
  width: min(760px, 100%);
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
  font-size: clamp(2rem, 3.2vw, 2.9rem);
  color: #1f3b20;
}

p {
  margin: 14px 0 30px;
  line-height: 1.7;
  color: #3a5e3d;
}

.cart-list {
  display: grid;
  gap: 18px;
}

.cart-row {
  display: grid;
  grid-template-columns: 110px 1fr auto auto;
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
  border-radius: 20px;
  background: #f6fbf5;
  border: 1px solid rgba(46, 125, 50, 0.14);
}

.cart-row img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 18px;
}

.cart-meta {
  display: grid;
  gap: 6px;
}

.item-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1f3b20;
}

.item-category {
  color: #4f7d58;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-price {
  color: #25522f;
  font-weight: 700;
}

.quantity-controls {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.quantity-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.quantity-row button,
.quantity-controls .remove-button {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid rgba(46, 125, 50, 0.18);
  background: #ffffff;
  color: #2e7d32;
  font-size: 1.2rem;
  cursor: pointer;
}

.quantity-row button:hover,
.quantity-controls .remove-button:hover {
  background: #f0f7ef;
}

.quantity-display {
  min-width: 42px;
  text-align: center;
  font-weight: 700;
  color: #1f3b20;
}

.quantity-controls .remove-button {
  width: auto;
  min-width: 90px;
  padding: 0 14px;
  font-size: 0.95rem;
  border-radius: 999px;
}

.item-subtotal {
  min-width: 82px;
  text-align: right;
  font-weight: 700;
  color: #1f3b20;
}

.empty-state {
  padding: 32px 24px;
  border-radius: 22px;
  background: #f6f9f1;
  border: 1px dashed rgba(46, 125, 50, 0.16);
  color: #2f5132;
  font-weight: 700;
}

.checkout-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 24px;
  padding: 22px 24px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(46, 125, 50, 0.14);
}

.subtotal {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1f3b20;
}

.checkout-button {
  padding: 14px 24px;
  border-radius: 999px;
  background: #2e7d32;
  color: #ffffff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.checkout-button:hover {
  background: #25612b;
  transform: translateY(-1px);
}

.checkout-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.checkout-error {
  margin: 0;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fdecea;
  color: #c62828;
  font-size: 0.88rem;
  border: 1px solid rgba(198, 40, 40, 0.18);
}
</style>
