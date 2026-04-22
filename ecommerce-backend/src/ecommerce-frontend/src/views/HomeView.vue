<template>
  <div class="home-page">
    <header class="hero">
      <h1>GreenGrocers</h1>
      <p>
        Fresh produce and everyday essentials from our sustainable online
        market.
      </p>
      <div class="filter-group">
        <button
          type="button"
          :class="['filter-button', { active: activeFilter === 'All' }]"
          @click="activeFilter = 'All'"
        >
          All
        </button>
        <button
          type="button"
          :class="['filter-button', { active: activeFilter === 'Fruit' }]"
          @click="activeFilter = 'Fruit'"
        >
          Fruit
        </button>
        <button
          type="button"
          :class="['filter-button', { active: activeFilter === 'Vegetables' }]"
          @click="activeFilter = 'Vegetables'"
        >
          Vegetables
        </button>
      </div>
    </header>

    <section class="catalogue">
      <div v-for="item in visibleItems" :key="item.id" class="item-card">
        <router-link
          :to="{ name: 'item', params: { id: String(item.id) } }"
          class="item-image-link"
        >
          <img :src="item.image" :alt="item.name" />
        </router-link>
        <div class="item-name">{{ item.name }}</div>
        <div class="item-category">{{ item.category }}</div>
        <div class="item-price">£{{ item.price.toFixed(2) }}</div>

        <div class="quantity-row">
          <button
            class="quantity-button"
            type="button"
            @click="decrementQuantity(item.id)"
          >
            −
          </button>
          <div class="quantity-count">{{ localQuantity(item.id) }}</div>
          <button
            class="quantity-button"
            type="button"
            @click="incrementQuantity(item.id)"
          >
            +
          </button>
        </div>

        <button class="cart-button" type="button" @click="addToCart(item)">
          Add to cart
        </button>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import { catalogueItems, CatalogueItem } from "@/data/catalogue";

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      items: catalogueItems as CatalogueItem[],
      activeFilter: "All",
      pendingQuantities: {} as Record<number, number>,
    };
  },
  computed: {
    localQuantity() {
      return (itemId: number) => this.pendingQuantities[itemId] ?? 1;
    },
    visibleItems(): CatalogueItem[] {
      if (this.activeFilter === "All") {
        return this.items;
      }
      return this.items.filter((item) => item.category === this.activeFilter);
    },
  },
  methods: {
    incrementQuantity(itemId: number) {
      const current = this.pendingQuantities[itemId] ?? 1;
      this.pendingQuantities = {
        ...this.pendingQuantities,
        [itemId]: current + 1,
      };
    },
    decrementQuantity(itemId: number) {
      const current = this.pendingQuantities[itemId] ?? 1;
      this.pendingQuantities = {
        ...this.pendingQuantities,
        [itemId]: Math.max(current - 1, 1),
      };
    },
    addToCart(item: CatalogueItem) {
      const qty = this.pendingQuantities[item.id] ?? 1;
      store.commit("SET_CART_QUANTITY", {
        id: item.id,
        quantity: qty,
      });
      this.pendingQuantities = { ...this.pendingQuantities, [item.id]: 1 };
    },
  },
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: radial-gradient(
    circle at top left,
    #d5f5d8 0%,
    #a8e6a1 45%,
    #7dc67e 100%
  );
  color: #1f3b20;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.hero {
  max-width: 900px;
  margin: 0 auto 32px;
  padding: 28px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 18px 36px rgba(31, 59, 32, 0.12);
  text-align: center;
}

.brand-badge {
  display: inline-block;
  margin-bottom: 12px;
  padding: 10px 18px;
  border-radius: 999px;
  background: #2e7d32;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.88rem;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 4rem);
  letter-spacing: -0.04em;
}

.hero p {
  margin: 16px auto 0;
  max-width: 620px;
  font-size: 1.05rem;
  line-height: 1.7;
}

.filter-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.filter-button {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(46, 125, 50, 0.18);
  background: rgba(255, 255, 255, 0.92);
  color: #1f3b20;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.filter-button:hover,
.filter-button.active {
  background: #2e7d32;
  color: #ffffff;
}

.catalogue {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.item-card {
  padding: 22px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 14px 30px rgba(15, 47, 18, 0.12);
  border: 1px solid rgba(56, 107, 63, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-image-link {
  display: block;
  border-radius: 18px;
  overflow: hidden;
}

.item-image-link img {
  width: 100%;
  display: block;
  object-fit: cover;
  min-height: 160px;
}

.item-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0;
}

.item-category {
  color: #4f7d58;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.82rem;
}

.item-price {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1f3b20;
}

.quantity-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

.quantity-button {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(46, 125, 50, 0.18);
  border-radius: 14px;
  background: #ffffff;
  color: #2e7d32;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.quantity-button:hover {
  background: #f0f7ef;
}

.quantity-count {
  min-width: 54px;
  padding: 12px 0;
  border-radius: 14px;
  background: rgba(46, 125, 50, 0.08);
  color: #1f3b20;
  font-weight: 700;
  text-align: center;
}

.cart-button {
  margin-top: 0;
  padding: 12px 18px;
  border: none;
  border-radius: 999px;
  background: #2e7d32;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
</style>
