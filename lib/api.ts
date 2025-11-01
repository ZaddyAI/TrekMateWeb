const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969/api";

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return res.json();
    },
    signup: async (
      name: string,
      email: string,
      password: string,
      role: "user" | "partner" = "user"
    ) => {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      return res.json();
    },
  },

  // Destinations endpoints
  destinations: {
    getAll: async (page = 1, limit = 10, sortBy = "name") => {
      const res = await fetch(`${API_BASE_URL}/destination/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit, sortBy }),
      });
      return res.json();
    },
    getById: async (id: number, page = 1, limit = 10) => {
      const res = await fetch(`${API_BASE_URL}/destination/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit }),
      });
      return res.json();
    },
    add: async (destination: any, token: string) => {
      const formData = new FormData();
      Object.keys(destination).forEach((key) => {
        if (key === "images") {
          destination.images.forEach((img: File) =>
            formData.append("images", img)
          );
        } else {
          formData.append(key, destination[key]);
        }
      });
      const res = await fetch(`${API_BASE_URL}/admin/destination`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return res.json();
    },
  },

  // Accommodations endpoints
  accommodations: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/accomodation/all`);
      return res.json();
    },
    getById: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/accomodation/${id}`);
      return res.json();
    },
    add: async (accommodation: any, token: string) => {
      const formData = new FormData();
      Object.keys(accommodation).forEach((key) => {
        if (key === "images") {
          accommodation.images.forEach((img: File) =>
            formData.append("images", img)
          );
        } else {
          formData.append(key, accommodation[key]);
        }
      });
      const res = await fetch(`${API_BASE_URL}/admin/accomodation`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return res.json();
    },
  },

  // Transportation endpoints
  transportation: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/transportation/all`);
      return res.json();
    },
    getById: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/transportation/${id}`);
      return res.json();
    },
    add: async (transportation: any, token: string) => {
      const formData = new FormData();
      Object.keys(transportation).forEach((key) => {
        if (key === "images") {
          transportation.images.forEach((img: File) =>
            formData.append("images", img)
          );
        } else {
          formData.append(key, transportation[key]);
        }
      });
      const res = await fetch(`${API_BASE_URL}/admin/transportation`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return res.json();
    },
  },

  // Bookings endpoints
  bookings: {
    createAccommodationBooking: async (
      destinationId: number,
      date: string,
      token: string
    ) => {
      const res = await fetch(`${API_BASE_URL}/booking/accomodation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinationId, date }),
      });
      return res.json();
    },
    createTransportationBooking: async (
      transportationId: number,
      date: string,
      token: string
    ) => {
      const res = await fetch(`${API_BASE_URL}/booking/transportation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transportationId, date }),
      });
      return res.json();
    },
    getUserBookings: async (userId: number, token: string) => {
      const res = await fetch(`${API_BASE_URL}/booking/acc/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    getAllBookings: async (token: string) => {
      const res = await fetch(`${API_BASE_URL}/booking/accomodation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  },
};
