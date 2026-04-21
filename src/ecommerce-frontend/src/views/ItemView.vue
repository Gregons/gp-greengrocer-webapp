<template>
  <div class="item-page">
    <div v-if="item" class="item-detail-card">
      <div class="item-hero">
        <img :src="item.image" :alt="item.name" />
      </div>
      <div class="item-details">
        <div class="item-meta">
          <span class="item-category">{{ item.category }}</span>
          <h2>{{ item.name }}</h2>
          <p class="item-description">{{ item.description }}</p>
          <p class="item-origin">
            🌍 Imported from <strong>{{ item.origin }}</strong>
          </p>
          <div class="item-price">£{{ item.price.toFixed(2) }}</div>

          <div class="quantity-row">
            <button
              class="quantity-button"
              type="button"
              @click="decrement(item.id)"
            >
              −
            </button>
            <div class="quantity-count">{{ cartCount(item.id) }}</div>
            <button
              class="quantity-button"
              type="button"
              @click="increment(item.id)"
            >
              +
            </button>
          </div>

          <button class="cart-button" type="button" @click="addToCart(item)">
            Add to cart
          </button>
        </div>
      </div>
    </div>
    <div v-else class="not-found">
      <h2>Item not found</h2>
      <p>The product you are looking for is unavailable.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import store from "@/store";
import { catalogueItems, CatalogueItem } from "@/data/catalogue";

export default defineComponent({
  name: "ItemView",
  setup() {
    const route = useRoute();
    const itemId = Number(route.params.id);

    const item = computed(() =>
      catalogueItems.find((catalogueItem) => catalogueItem.id === itemId)
    );

    const cartCount = computed(
      () => (id: number) => store.getters.cartCount(id)
    );

    const increment = (id: number) => {
      const current = store.getters.cartCount(id);
      store.commit("SET_CART_QUANTITY", {
        id,
        quantity: current + 1,
      });
    };

    const decrement = (id: number) => {
      const current = store.getters.cartCount(id);
      store.commit("SET_CART_QUANTITY", {
        id,
        quantity: Math.max(current - 1, 0),
      });
    };

    const addToCart = (item: CatalogueItem | null) => {
      if (!item) return;
      const current = store.getters.cartCount(item.id);
      store.commit("SET_CART_QUANTITY", {
        id: item.id,
        quantity: current > 0 ? current : 1,
      });
    };

    return { item, cartCount, increment, decrement, addToCart };
  },
});
</script>

<style scoped>
.item-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #eaf8eb;
  color: #1f3b20;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.item-detail-card {
  width: min(980px, 100%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 22px 40px rgba(15, 47, 18, 0.12);
}

.item-hero img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.item-details {
  padding: 32px;
}

.item-meta {
  max-width: 700px;
  margin: 0 auto;
}

.item-category {
  display: inline-block;
  margin-bottom: 14px;
  padding: 8px 16px;
  border-radius: 999px;
  background: #dff5df;
  color: #2e7d32;
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-details h2 {
  margin: 0 0 18px;
  font-size: clamp(2rem, 3vw, 3rem);
}

.item-description {
  margin: 0 0 10px;
  line-height: 1.8;
  color: #354f38;
}

.item-origin {
  margin: 0 0 22px;
  font-size: 0.95rem;
  color: #5a7a5c;
}

.item-price {
  font-size: 2rem;
  font-weight: 800;
  color: #1f3b20;
  margin-bottom: 24px;
}

.quantity-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.quantity-button {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(46, 125, 50, 0.18);
  border-radius: 14px;
  background: #ffffff;
  color: #2e7d32;
  font-size: 1.4rem;
  cursor: pointer;
}

.quantity-button:hover {
  background: #f0f7ef;
}

.quantity-count {
  min-width: 60px;
  padding: 12px 0;
  border-radius: 14px;
  background: rgba(46, 125, 50, 0.08);
  color: #1f3b20;
  font-weight: 700;
  text-align: center;
}

.cart-button {
  padding: 14px 24px;
  border-radius: 999px;
  border: none;
  background: #2e7d32;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.not-found {
  text-align: center;
  padding: 120px 20px;
}
</style>
