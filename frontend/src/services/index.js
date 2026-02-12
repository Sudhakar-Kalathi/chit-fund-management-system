import api from './api';

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

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export const customerService = {
    getAll: (page = 0, size = 10) => api.get(`/api/customers?page=${page}&size=${size}`),
    search: (query, page = 0, size = 10) => api.get(`/api/customers/search?query=${query}&page=${page}&size=${size}`),
    getById: (id) => api.get(`/api/customers/${id}`),
    create: (data) => api.post('/api/admin/customers', data),
    update: (id, data) => api.put(`/api/admin/customers/${id}`, data),
    delete: (id) => api.delete(`/api/admin/customers/${id}`)
};

export const chitGroupService = {
    getAll: (page = 0, size = 10) => api.get(`/api/chit-groups?page=${page}&size=${size}`),
    search: (query, page = 0, size = 10) => api.get(`/api/chit-groups/search?query=${query}&page=${page}&size=${size}`),
    getById: (id) => api.get(`/api/chit-groups/${id}`),
    create: (data) => api.post('/api/chit-groups', data),
    addMember: (groupId, customerId) => api.post(`/api/chit-groups/${groupId}/members/${customerId}`),
    updateCycle: (cycleId, data) => api.put(`/api/chit-groups/cycles/${cycleId}`, data)
};

export const paymentService = {
    create: (data) => api.post('/api/payments', data),
    getByDate: (date) => api.get(`/api/payments/date/${date}`),
    getByMonth: (year, month) => api.get(`/api/payments/month?year=${year}&month=${month}`)
};

export const dayBookService = {
    create: (data) => api.post('/api/daybook', data),
    getByDate: (date) => api.get(`/api/daybook/date/${date}`)
};
