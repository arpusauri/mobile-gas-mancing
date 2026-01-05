import { Platform } from 'react-native';

let API_URL;

const isWeb = Platform.OS === 'web';

if (__DEV__) {
  if (isWeb) {
    // For Expo Web - backend is on localhost:3000
    API_URL = 'http://localhost:3000';
  } else if (Platform.OS === 'android') {
    // Android emulator - backend on computer
    API_URL = 'http://10.0.2.2:3000';
  } else {
    // iOS simulator or physical device - replace with your computer IP
    API_URL = 'http://192.168.1.100:3000';
  }
} else {
  // Production
  API_URL = 'https://your-production-api.com';
}

export const apiCall = async (endpoint, options = {}) => {
  console.log('🔗 Calling API:', `${API_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Raw response:', result);

    // Extract data from response wrapper if it exists
    return result.data || result;
  } catch (error) {
    console.error('❌ API call failed:', error);
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
    search: (location, price, facilities) => {
      // Build query string
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (price) params.append("price", price);
      if (facilities) params.append("facilities", facilities);

      return apiCall(`/api/places/search?${params.toString()}`);
    },
  },
  itemSewa: {
    getAll: () => apiCall("/api/item_sewa"),
    getById: (id) => apiCall(`/api/item_sewa/${id}`),
  },
  booking: {
    getAll: () => apiCall("/api/booking"),
    create: (data) =>
      apiCall("/api/booking", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getById: (id) => apiCall(`/api/booking/${id}`),
  },
  pesanan: {
    getAll: () => apiCall("/api/pesanan"),
    getById: (id) => apiCall(`/api/pesanan/${id}`),
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
    login: (data) =>
      apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    signup: (data) =>
      apiCall("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => apiCall("/api/auth/logout", { method: "POST" }),
  },
  review: {
    getAll: () => apiCall("/api/review"),
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