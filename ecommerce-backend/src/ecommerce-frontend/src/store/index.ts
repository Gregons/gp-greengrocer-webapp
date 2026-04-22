import { createStore } from "vuex";
import type { UserInfo } from "@/api";

interface CartEntry {
  id: number;
  quantity: number;
}

export interface PurchaseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Purchase {
  orderId: string;
  date: string;
  items: PurchaseItem[];
  total: number;
}

export interface CheckoutDetails {
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  billingAddressSame: boolean;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingPostcode: string;
  billingCountry: string;
  shippingMethod: "first" | "second";
  paymentCardHolder: string;
  paymentCardNumber: string;
  paymentCardExpiry: string;
}

export interface SuccessfulOrder {
  purchase: Purchase;
  shippingMethod: "first" | "second";
}

interface RootState {
  cartItems: CartEntry[];
  purchases: Purchase[];
  currentUser: UserInfo | null;
  checkoutDetails: CheckoutDetails | null;
  successfulOrder: SuccessfulOrder | null;
}

function loadUser(): UserInfo | null {
  try {
    const raw = localStorage.getItem("user-info");
    return raw ? (JSON.parse(raw) as UserInfo) : null;
  } catch {
    return null;
  }
}

export default createStore<RootState>({
  state: {
    cartItems: [],
    purchases: [],
    currentUser: loadUser(),
    checkoutDetails: null,
    successfulOrder: null,
  },
  getters: {
    cartItems(state) {
      return state.cartItems;
    },
    cartCount: (state) => (itemId: number) => {
      const item = state.cartItems.find((entry) => entry.id === itemId);
      return item ? item.quantity : 0;
    },
    purchases(state) {
      return state.purchases;
    },
    currentUser(state) {
      return state.currentUser;
    },
    isLoggedIn(state) {
      return state.currentUser !== null;
    },
    totalCartCount(state) {
      return state.cartItems.reduce((sum, entry) => sum + entry.quantity, 0);
    },
    checkoutDetails(state) {
      return state.checkoutDetails;
    },
    successfulOrder(state) {
      return state.successfulOrder;
    },
  },
  mutations: {
    SET_CART_QUANTITY(state, payload: { id: number; quantity: number }) {
      const existing = state.cartItems.find((entry) => entry.id === payload.id);
      if (payload.quantity <= 0) {
        state.cartItems = state.cartItems.filter(
          (entry) => entry.id !== payload.id
        );
        return;
      }
      if (existing) {
        existing.quantity = payload.quantity;
      } else {
        state.cartItems.push({ id: payload.id, quantity: payload.quantity });
      }
    },
    CLEAR_CART(state) {
      state.cartItems = [];
    },
    ADD_PURCHASE(state, purchase: Purchase) {
      state.purchases.unshift(purchase);
    },
    CLEAR_PURCHASES(state) {
      state.purchases = [];
    },
    SET_USER(state, user: UserInfo) {
      state.currentUser = user;
      localStorage.setItem("session-token", user.token);
      localStorage.setItem("user-info", JSON.stringify(user));
    },
    UPDATE_PROFILE(state, payload: { name: string; email: string }) {
      if (state.currentUser) {
        state.currentUser.name = payload.name;
        state.currentUser.email = payload.email;
        localStorage.setItem("user-info", JSON.stringify(state.currentUser));
      }
    },
    LOGOUT(state) {
      state.currentUser = null;
      state.purchases = [];
      localStorage.removeItem("session-token");
      localStorage.removeItem("user-info");
    },
    SET_CHECKOUT_DETAILS(state, details: CheckoutDetails) {
      state.checkoutDetails = details;
    },
    SET_SUCCESSFUL_ORDER(state, order: SuccessfulOrder) {
      state.successfulOrder = order;
    },
  },
  actions: {},
  modules: {},
});
