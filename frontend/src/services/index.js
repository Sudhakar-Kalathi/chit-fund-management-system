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
    getAll: (page = 0, size = 10) => api.get(`/customers?page=${page}&size=${size}`),
    search: (query, page = 0, size = 10) => api.get(`/customers/search?query=${query}&page=${page}&size=${size}`),
    getById: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post('/admin/customers', data),
    update: (id, data) => api.put(`/admin/customers/${id}`, data),
    delete: (id) => api.delete(`/admin/customers/${id}`)
};

export const chitGroupService = {
    getAll: (page = 0, size = 10) => api.get(`/chit-groups?page=${page}&size=${size}`),
    search: (query, page = 0, size = 10) => api.get(`/chit-groups/search?query=${query}&page=${page}&size=${size}`),
    getById: (id) => api.get(`/chit-groups/${id}`),
    create: (data) => api.post('/chit-groups', data),
    addMember: (groupId, customerId) => api.post(`/chit-groups/${groupId}/members/${customerId}`),
    updateCycle: (cycleId, data) => api.put(`/chit-groups/cycles/${cycleId}`, data)
};

export const paymentService = {
    create: (data) => api.post('/payments', data),
    getByDate: (date) => api.get(`/payments/date/${date}`),
    getByMonth: (year, month) => api.get(`/payments/month?year=${year}&month=${month}`)
};

export const dayBookService = {
    create: (data) => api.post('/daybook', data),
    getByDate: (date) => api.get(`/daybook/date/${date}`)
};
