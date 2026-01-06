import { Platform } from "react-native";

export let API_URL;

const isWeb = Platform.OS === "web";

if (__DEV__) {
  if (isWeb) {
    API_URL = "http://localhost:3000";
  } else if (Platform.OS === "android") {
    API_URL = "http://10.0.2.2:3000";
  } else {
    API_URL = "http://192.168.1.100:3000";
  }
} else {
  API_URL = "https://your-production-api.com";
}

export const apiCall = async (endpoint, options = {}) => {
  console.log("🔗 Calling API:", `${API_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();
    console.log("Raw response:", result);

    if (!response.ok || result.success === false) {
      // Tambahkan cek result.success
      const errorMessage =
        result.message || result.error || "Terjadi kesalahan";
      console.error("❌ API Error Details:", result);
      throw new Error(errorMessage);
    }

    // Extract data from response wrapper if it exists
    return result.data || result;
  } catch (error) {
    console.error("❌ API call failed:", error);
    throw error;
  }
};

export const api = {
  ensiklopedia: {
    getAll: () => apiCall("/api/ensiklopedia"),
    getById: (id) => apiCall(`/api/ensiklopedia/${id}`),
  },
  places: {
    getAll: () => apiCall("/api/places"),
    getById: (id) => apiCall(`/api/places/${id}`),
    search: (location = "", priceMin = "", priceMax = "", facilities = "") => {
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (priceMin) params.append("priceMin", priceMin);
      if (priceMax) params.append("priceMax", priceMax);
      if (facilities) params.append("facilities", facilities);

      return apiCall(`/api/places/search?${params.toString()}`);
    },
  },
  itemSewa: {
    getAll: () => apiCall("/api/item_sewa"),
    getById: (id) => apiCall(`/api/item_sewa/${id}`),
  },
  booking: {
    getByUserId: (token) =>
      apiCall(`/api/pesanan/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    getById: (id, token) =>
      apiCall(`/api/pesanan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    cancel: (id, token) =>
      apiCall(`/api/pesanan/cancel/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),

    create: (data, token) =>
      apiCall("/api/pesanan/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }),
  },

  users: {
    getAll: () => apiCall("/api/users"),
    getById: (id) => apiCall(`/api/users/${id}`),
    update: (id, data) =>
      apiCall(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  auth: {
    signup: (data) =>
      apiCall("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    signin: (data) =>
      apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getProfile: (token) =>
      apiCall("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  },
  review: {
    getAll: () => apiCall("/api/review"),
    getByPlaceId: (placeId) => apiCall(`/api/review/place/${placeId}`),
    create: (data) =>
      apiCall("/api/review", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  payment: {
    getAll: () => apiCall("/api/payment"),
    create: (data) =>
      apiCall("/api/payment", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
