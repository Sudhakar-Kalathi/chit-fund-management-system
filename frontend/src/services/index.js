import api from './api';

// ===================== AUTH =====================
export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: () => !!localStorage.getItem('token')
};

// ===================== CUSTOMERS =====================
export const customerService = {
    getAll: (page = 0, size = 10) => api.get(`/api/customers?page=${page}&size=${size}`),
    search: (query) => api.get(`/api/customers/search?query=${encodeURIComponent(query)}`),
    getById: (id) => api.get(`/api/customers/${id}`),
    getDetails: (id) => api.get(`/api/customers/${id}/details`),
    create: (data) => api.post('/api/admin/customers', data),
    update: (id, data) => api.put(`/api/admin/customers/${id}`, data),
    deactivate: (id) => api.delete(`/api/admin/customers/${id}`)
};

// ===================== CHIT GROUPS =====================
export const chitGroupService = {
    getAll: (page = 0, size = 50) => api.get(`/api/chit-groups?page=${page}&size=${size}`),
    search: (query) => api.get(`/api/chit-groups/search?query=${encodeURIComponent(query)}`),
    getById: (id) => api.get(`/api/chit-groups/${id}`),
    create: (data) => api.post('/api/chit-groups', data),
    addMember: (groupId, customerId) => api.post(`/api/chit-groups/${groupId}/members/${customerId}`),
    updateCycle: (cycleId, data) => api.put(`/api/chit-groups/cycles/${cycleId}`, data)
};


// ===================== PAYOUTS =====================
export const payoutService = {
    getByGroup: (groupId) => api.get(`/api/payouts/group/${groupId}`),
    recordPayment: (id, payload) => api.put(`/api/admin/payouts/${id}/pay`, payload)
};

// ===================== PAYMENTS =====================
export const paymentService = {
    create: (data) => api.post('/api/admin/payments', data),
    getByDate: (year, month, day) => api.get(`/api/payments/date?year=${year}&month=${month}&day=${day}`),
    getByMonth: (year, month) => api.get(`/api/payments/month?year=${year}&month=${month}`),
    update: (id, data) => api.put(`/api/admin/payments/${id}`, data)
};

// ===================== DEBIT / CREDIT / SUSPENSE =====================
export const dayBookService = {
    create: (data) => api.post('/api/admin/daybook', data),
    getByDate: (year, month, day) => api.get(`/api/daybook/date?year=${year}&month=${month}&day=${day}`),
    update: (id, data) => api.put(`/api/admin/daybook/${id}`, data)
};
