// ============================================
// API UTILITY FUNCTIONS
// ============================================

const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || `HTTP ${response.status}`,
                data,
            };
        }

        return data;
    } catch (error) {
        console.error(`API Error:`, error);
        throw error;
    }
}

// Normalize artwork objects: backend returns artwork_id, frontend uses .id
function normalizeArtwork(a) {
    return { ...a, id: a.id || a.artwork_id };
}

// ============================================
// ARTWORK ENDPOINTS
// ============================================

async function getArtworks() {
    const res = await apiCall('/artworks/artist');  // returns artworks with artist name
    const data = res.data || res;
    return Array.isArray(data) ? data.map(normalizeArtwork) : data;
}

async function getArtworkById(id) {
    const res = await apiCall(`/artworks/${id}`);
    const data = res.data || res;
    return normalizeArtwork(data);
}

async function createArtwork(artworkData) {
    const res = await apiCall('/artworks', {
        method: 'POST',
        body: JSON.stringify(artworkData),
    });
    return res.data || res;
}

async function updateArtwork(id, artworkData) {
    return apiCall(`/artworks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(artworkData),
    });
}

async function deleteArtwork(id) {
    return apiCall(`/artworks/${id}`, {
        method: 'DELETE',
    });
}

async function getArtworksByArtist(userId) {
    const res = await apiCall(`/artworks/artist/${userId}`);
    const data = res.data || res;
    return Array.isArray(data) ? data.map(normalizeArtwork) : data;
}

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

async function login(email, password) {
    const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    // Store token
    if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
}

async function register(userData) {
    const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    return response;
}

async function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}

async function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

async function verifyToken() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        const response = await apiCall('/auth/verify', {
            method: 'POST',
        });

        return response.user;
    } catch (error) {
        logout();
        return null;
    }
}

// ============================================
// ENQUIRY ENDPOINTS
// ============================================

async function createEnquiry(enquiryData) {
    return apiCall('/enquiry', {
        method: 'POST',
        body: JSON.stringify(enquiryData),
    });
}

async function getEnquiries() {
    const res = await apiCall('/enquiry');
    return res.data || res;
}

async function getEnquiriesByArtwork(artworkId) {
    const res = await apiCall(`/enquiry/artwork/${artworkId}`);
    return res.data || res;
}

async function updateEnquiryStatus(id, status) {
    return apiCall(`/enquiry/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// ============================================
// ADMIN ENDPOINTS
// ============================================

async function getUnapprovedArtworks() {
    // Fetch all artworks with artist info and filter to pending
    const res = await apiCall('/artworks/artist');
    const artworks = res.data || res;
    return artworks.filter(a => a.approval_status === 'pending' || !a.approval_status);
}

async function approveArtwork(id) {
    return apiCall(`/artworks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approval_status: 'approved' }),
    });
}

async function rejectArtwork(id, reason = '') {
    return apiCall(`/artworks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approval_status: 'rejected' }),
    });
}

async function getAllArtworks() {
    const res = await apiCall('/artworks/artist');
    return res.data || res;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

function isAdmin() {
    const user = getCurrentUser();
    return user?.role === 'admin';
}

function isArtist() {
    const user = getCurrentUser();
    return user?.role === 'artist';
}

async function getAuthStatus() {
    const user = await verifyToken();
    return {
        isAuthenticated: !!user,
        user,
    };
}
