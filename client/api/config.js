import { Platform } from "react-native";

export let API_URL;

const isWeb = Platform.OS === "web";

if (__DEV__) {
  if (isWeb) {
    API_URL = "http://localhost:3000";
  } else if (Platform.OS === "android") {
    API_URL = "http://192.168.1.3:3000";
  } else {
    API_URL = "http://192.168.1.3:3000"; // Ganti dengan IP lokal kamu
  }
} else {
  API_URL = "https://your-production-api.com";
}

export const apiCall = async (endpoint, options = {}) => {
  console.log("🔗 Calling API:", `${API_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        // HAPUS Content-Type jika body adalah FormData
        ...(options.body instanceof FormData 
            ? {} 
            : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      ...options,
    });
    
    const result = await response.json();
    console.log("✅ API Response:", result);

    if (!response.ok || result.success === false) {
      const errorMessage = result.message || result.error || "Terjadi kesalahan";
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
  getByMitraId: (mitraId, token) => 
    apiCall(`/api/places/mitra/${mitraId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  // ✅ TAMBAHKAN INI (method create):
  create: (formData, token) =>
    apiCall("/api/places", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData, // FormData dengan image
    }),
  
  update: (id, data, token) =>
    apiCall(`/api/places/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  
  delete: (id, token) =>
    apiCall(`/api/places/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
    
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
    create: (data, token) =>
      apiCall("/api/review", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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

  // ==========================================
  // MITRA API - FIXED VERSION
  // ==========================================
  mitra: {
    // 1. REGISTER MITRA (TIDAK PERLU TOKEN)
    // Endpoint: POST /api/mitra/register
    // Body: FormData dengan foto
    register: (formData) =>
      apiCall("/api/mitra/register", {
        method: "POST",
        // JANGAN set Content-Type manual untuk FormData
        // JANGAN pakai JSON.stringify untuk FormData
        body: formData, // Langsung kirim FormData
      }),

    // 2. LOGIN MITRA
    // Endpoint: POST /api/mitra/login
    login: (data) =>
      apiCall("/api/mitra/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    // 3. GET MITRA BY ID (PERLU TOKEN)
    // Endpoint: GET /api/mitra/:id
    getById: (id, token) =>
      apiCall(`/api/mitra/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    // 4. UPDATE MITRA (PERLU TOKEN)
    // Endpoint: PUT /api/mitra/:id
    update: (id, data, token) =>
      apiCall(`/api/mitra/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),

    // 5. DELETE MITRA (PERLU TOKEN)
    // Endpoint: DELETE /api/mitra/:id
    delete: (id, token) =>
      apiCall(`/api/mitra/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),

    // 6. GET PROPERTY BOOKINGS BY MITRA ID (PERLU TOKEN)
    // Endpoint: GET /api/mitra/property/bookings/:mitraId
    getPropertyBookings: (mitraId, token) =>
      apiCall(`/api/mitra/property/bookings/${mitraId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),

    // 7. UPDATE PROPERTY BOOKING STATUS (PERLU TOKEN)
    // Endpoint: PUT /api/mitra/property/bookings/:id/status
    updateBookingStatus: (id, status, token) =>
      apiCall(`/api/mitra/property/bookings/${id}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      }),

    // 8. DELETE PROPERTY BOOKING (PERLU TOKEN)
    // Endpoint: DELETE /api/mitra/property/bookings/:id
    deleteBooking: (id, token) =>
      apiCall(`/api/mitra/property/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
  },
};