// ============================================
// MAIN APPLICATION LOGIC
// ============================================

let currentPage = '/';

// Initialize app on page load
window.addEventListener('load', () => {
    initApp();
    handleRouting();
});

// Handle navigation and routing
window.addEventListener('hashchange', () => {
    handleRouting();
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbarMenu');
    if (e.target !== hamburger && !navbarMenu.contains(e.target)) {
        navbarMenu.classList.remove('active');
    }
});

// Toggle mobile menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const navbarMenu = document.getElementById('navbarMenu');
            navbarMenu.classList.toggle('active');
        });
    }
});

// ============================================
// INITIALIZATION
// ============================================

async function initApp() {
    await updateAuthNavigation();
}

async function updateAuthNavigation() {
    const authNav = document.getElementById('authNav');
    const authStatus = await getAuthStatus();

    if (authStatus.isAuthenticated) {
        const user = authStatus.user;
        let dashboardLink = '/dashboard';

        if (user.role === 'admin') {
            dashboardLink = '/admin';
        } else if (user.role === 'artist') {
            dashboardLink = '/artist';
        }

        authNav.innerHTML = `
            <span style="color: #999; font-size: 0.9rem;">Welcome, ${user.name}</span>
            <a href="#${dashboardLink}" class="nav-button secondary">Dashboard</a>
            <button class="nav-button secondary" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authNav.innerHTML = `
            <a href="#/login" class="nav-button secondary">Login</a>
            <a href="#/register" class="nav-button primary">Sign Up</a>
        `;
    }
}

// ============================================
// ROUTING
// ============================================

async function handleRouting() {
    const hash = window.location.hash.slice(1) || '/';
    currentPage = hash;

    const app = document.getElementById('app');
    let pageHTML = '';

    // Parse route and parameters
    const [route, ...params] = hash.split('/').filter(Boolean);
    const routePath = '/' + (route ? route : '');
    const param = params[0];

    try {
        // Show loading spinner
        showLoading(true);

        // Auth-protected routes
        const authStatus = await getAuthStatus();

        // Route handling
        if (routePath === '/' || routePath === '/home') {
            pageHTML = renderHomePage();
            await loadFeaturedArtworks();
        } else if (routePath === '/explore') {
            pageHTML = renderExplorePage();
            await loadAllGalleryArtworks();
        } else if (routePath === '/artwork' && param) {
            pageHTML = renderArtworkDetailsPage(param);
            await loadArtworkDetails(param);
        } else if (routePath === '/enquiry' && param) {
            if (!authStatus.isAuthenticated) {
                navigateTo('/login');
                return;
            }
            pageHTML = renderEnquiryFormPage(param);
        } else if (routePath === '/login') {
            if (authStatus.isAuthenticated) {
                navigateTo('/');
                return;
            }
            pageHTML = renderLoginPage();
        } else if (routePath === '/register') {
            if (authStatus.isAuthenticated) {
                navigateTo('/');
                return;
            }
            pageHTML = renderRegisterPage();
        } else if (routePath === '/artist') {
            if (!authStatus.isAuthenticated || authStatus.user.role !== 'artist') {
                navigateTo('/login');
                return;
            }
            pageHTML = renderArtistDashboard();
        } else if (routePath === '/admin') {
            if (!authStatus.isAuthenticated || authStatus.user.role !== 'admin') {
                navigateTo('/login');
                return;
            }
            pageHTML = renderAdminDashboard();
            await loadPendingArtworks();
        } else {
            pageHTML = renderNotFoundPage();
        }

        // Render page
        app.innerHTML = pageHTML;
        showLoading(false);
    } catch (error) {
        console.error('Routing error:', error);
        showLoading(false);
        showToast('Error loading page', 'error');
    }
}

function navigateTo(path) {
    window.location.hash = path;
}

// ============================================
// LOADING & DATA FUNCTIONS
// ============================================

async function loadFeaturedArtworks() {
    try {
        const artworks = await getArtworks();
        const artworkGrid = document.getElementById('artworkGrid');

        if (!artworkGrid) return;

        if (artworks.length === 0) {
            artworkGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🎨</div>
                    <p>No artworks available yet</p>
                </div>
            `;
        } else {
            artworkGrid.innerHTML = artworks.slice(0, 8).map(renderArtworkCard).join('');
        }
    } catch (error) {
        console.error('Error loading artworks:', error);
        showToast('Failed to load artworks', 'error');
    }
}

async function loadAllGalleryArtworks() {
    try {
        const artworks = await getArtworks();
        const artworkGrid = document.getElementById('artworkGrid');

        if (!artworkGrid) return;

        if (artworks.length === 0) {
            artworkGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🎨</div>
                    <p>No artworks available</p>
                </div>
            `;
        } else {
            artworkGrid.innerHTML = artworks.map(renderArtworkCard).join('');
        }
    } catch (error) {
        console.error('Error loading artworks:', error);
        showToast('Failed to load artworks', 'error');
    }
}

async function loadArtworkDetails(id) {
    try {
        const artwork = await getArtworkById(id);
        const detailsContainer = document.getElementById('detailsContainer');

        if (!detailsContainer) return;

        if (!artwork) {
            detailsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">❌</div>
                    <p>Artwork not found</p>
                </div>
            `;
        } else {
            detailsContainer.innerHTML = renderArtworkDetails(artwork);
        }
    } catch (error) {
        console.error('Error loading artwork:', error);
        const detailsContainer = document.getElementById('detailsContainer');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">❌</div>
                    <p>Failed to load artwork details</p>
                </div>
            `;
        }
    }
}

async function loadArtistArtworks() {
    try {
        const user = await getCurrentUser();
        if (!user) return;

        const artworks = await getArtworksByArtist(user.id);
        const tbody = document.getElementById('myArtworksTable');

        if (!tbody) return;

        if (artworks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #999;">No artworks yet. Create your first artwork!</td></tr>`;
        } else {
            tbody.innerHTML = artworks
                .map(
                    (artwork) => `
                <tr>
                    <td>${artwork.title}</td>
                    <td>${artwork.category || '-'}</td>
                    <td>₹ ${parseInt(artwork.price).toLocaleString()}</td>
                    <td>
                        <span style="
                            padding: 0.3rem 0.8rem;
                            border-radius: 4px;
                            font-size: 0.85rem;
                            font-weight: 600;
                            ${
                                artwork.approval_status === 'approved'
                                    ? 'background: #d1fae5; color: #10b981;'
                                    : artwork.approval_status === 'rejected'
                                      ? 'background: #fee2e2; color: #ef4444;'
                                      : 'background: #fef3c7; color: #f59e0b;'
                            }
                        ">
                            ${artwork.approval_status || 'Pending'}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn edit" onclick="editArtwork(${artwork.id})">Edit</button>
                            <button class="action-btn delete" onclick="deleteArtworkHandler(${artwork.id})">Delete</button>
                        </div>
                    </td>
                </tr>
            `
                )
                .join('');
        }
    } catch (error) {
        console.error('Error loading artist artworks:', error);
        showToast('Failed to load artworks', 'error');
    }
}

async function loadPendingArtworks() {
    try {
        const artworks = await getUnapprovedArtworks();
        const tbody = document.getElementById('pendingArtworksTable');

        if (!tbody) return;

        if (artworks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #999;">No pending artworks</td></tr>`;
        } else {
            tbody.innerHTML = artworks
                .map(
                    (artwork) => `
                <tr>
                    <td>${artwork.title}</td>
                    <td>${artwork.artist_name || '-'}</td>
                    <td>₹ ${parseInt(artwork.price).toLocaleString()}</td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn approve" onclick="approveArtworkHandler(${artwork.id})">Approve</button>
                            <button class="action-btn reject" onclick="rejectArtworkHandler(${artwork.id})">Reject</button>
                        </div>
                    </td>
                </tr>
            `
                )
                .join('');
        }
    } catch (error) {
        console.error('Error loading pending artworks:', error);
        showToast('Failed to load pending artworks', 'error');
    }
}

async function loadAllArtworks() {
    try {
        const artworks = await getAllArtworks();
        const tbody = document.getElementById('allArtworksTable');

        if (!tbody) return;

        if (artworks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #999;">No artworks</td></tr>`;
        } else {
            tbody.innerHTML = artworks
                .map(
                    (artwork) => `
                <tr>
                    <td>${artwork.title}</td>
                    <td>${artwork.artist_name || '-'}</td>
                    <td>₹ ${parseInt(artwork.price).toLocaleString()}</td>
                    <td>
                        <span style="
                            padding: 0.3rem 0.8rem;
                            border-radius: 4px;
                            font-size: 0.85rem;
                            font-weight: 600;
                            ${
                                artwork.approval_status === 'approved'
                                    ? 'background: #d1fae5; color: #10b981;'
                                    : artwork.approval_status === 'rejected'
                                      ? 'background: #fee2e2; color: #ef4444;'
                                      : 'background: #fef3c7; color: #f59e0b;'
                            }
                        ">
                            ${artwork.approval_status || 'Pending'}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn edit" onclick="navigateTo('/artwork/${artwork.id}')">View</button>
                        </div>
                    </td>
                </tr>
            `
                )
                .join('');
        }
    } catch (error) {
        console.error('Error loading all artworks:', error);
        showToast('Failed to load artworks', 'error');
    }
}

async function loadAllEnquiries() {
    try {
        const enquiries = await getEnquiries();
        const tbody = document.getElementById('allEnquiriesTable');

        if (!tbody) return;

        if (enquiries.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #999;">No enquiries</td></tr>`;
        } else {
            tbody.innerHTML = enquiries
                .map(
                    (enquiry) => `
                <tr>
                    <td>${enquiry.artwork_title || '-'}</td>
                    <td>${enquiry.name || '-'}</td>
                    <td>${enquiry.email || '-'}</td>
                    <td>${enquiry.status || 'Pending'}</td>
                    <td>#${enquiry.enquiry_id}</td>
                </tr>
            `
                )
                .join('');
        }
    } catch (error) {
        console.error('Error loading enquiries:', error);
        showToast('Failed to load enquiries', 'error');
    }
}

// ============================================
// FORM HANDLERS
// ============================================

async function handleLogin(event) {
    event.preventDefault();
    showLoading(true);

    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await login(email, password);

        showToast('Login successful!', 'success');

        // Redirect based on role
        const user = await getCurrentUser();
        if (user.role === 'admin') {
            navigateTo('/admin');
        } else if (user.role === 'artist') {
            navigateTo('/artist');
        } else {
            navigateTo('/');
        }

        await updateAuthNavigation();
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    showLoading(true);

    try {
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('role').value;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const response = await register({
            name: fullname,
            email,
            password,
            role,
        });

        // Store token and user data like login does
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Update navigation to show logged-in state
        await updateAuthNavigation();

        // Redirect to appropriate dashboard based on role
        let redirectPath = '/';
        if (response.user.role === 'artist') {
            redirectPath = '/artist';
        } else if (response.user.role === 'admin') {
            redirectPath = '/admin';
        }
        // For visitors, redirect to home page

        showToast('Registration successful! Welcome to ArtGallery!', 'success');
        setTimeout(() => navigateTo(redirectPath), 1000);
    } catch (error) {
        console.error('Register error:', error);
        showToast(error.message || 'Registration failed', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleEnquiry(event, artworkId) {
    event.preventDefault();
    showLoading(true);

    try {
        const message = document.getElementById('message').value;

        // Get the logged-in user's ID from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user) {
            showToast('Please log in to send an enquiry', 'error');
            navigateTo('/login');
            return;
        }

        await createEnquiry({
            user_id: user.id,
            artwork_id: artworkId,
            message,
        });

        showToast('Enquiry sent successfully!', 'success');
        setTimeout(() => navigateTo('/explore'), 1500);
    } catch (error) {
        console.error('Enquiry error:', error);
        showToast(error.message || 'Failed to send enquiry', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleAddArtwork(event) {
    event.preventDefault();
    showLoading(true);

    try {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const categoryId = document.getElementById('categoryId').value;
        const price = document.getElementById('price').value;
        const image = document.getElementById('image').value;

        // Get current user ID
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        await createArtwork({
            user_id: user.id,
            title,
            description,
            category_id: categoryId,
            price,
            image: image || null,
        });

        showToast('Artwork uploaded successfully!', 'success');
        document.getElementById('addArtworkForm').reset();
        loadArtistArtworks();
    } catch (error) {
        console.error('Add artwork error:', error);
        showToast(error.message || 'Failed to upload artwork', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleLogout() {
    logout();
    await updateAuthNavigation();
    navigateTo('/');
    showToast('Logged out successfully', 'success');
}

// ============================================
// ACTION HANDLERS
// ============================================

async function approveArtworkHandler(id) {
    showLoading(true);
    try {
        await approveArtwork(id);
        showToast('Artwork approved!', 'success');
        loadPendingArtworks();
    } catch (error) {
        console.error('Approve error:', error);
        showToast('Failed to approve artwork', 'error');
    } finally {
        showLoading(false);
    }
}

async function rejectArtworkHandler(id) {
    const reason = prompt('Enter rejection reason (optional):');
    showLoading(true);
    try {
        await rejectArtwork(id, reason || '');
        showToast('Artwork rejected', 'success');
        loadPendingArtworks();
    } catch (error) {
        console.error('Reject error:', error);
        showToast('Failed to reject artwork', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteArtworkHandler(id) {
    if (confirm('Are you sure you want to delete this artwork?')) {
        showLoading(true);
        try {
            await deleteArtwork(id);
            showToast('Artwork deleted', 'success');
            loadArtistArtworks();
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete artwork', 'error');
        } finally {
            showLoading(false);
        }
    }
}

function editArtwork(id) {
    navigateTo(`/artwork/${id}`);
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

function showLoading(show = true) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.toggle('active', show);
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
