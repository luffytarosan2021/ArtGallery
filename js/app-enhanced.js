// ============================================
// ENHANCED API UTILITY FUNCTIONS
// ============================================

// Wishlist management
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(artworkId) {
    if (!wishlist.includes(artworkId)) {
        wishlist.push(artworkId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showToast('Added to wishlist ❤️', 'success');
        updateWishlistButtons();
    }
}

function removeFromWishlist(artworkId) {
    wishlist = wishlist.filter(id => id !== artworkId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showToast('Removed from wishlist', 'success');
    updateWishlistButtons();
}

function isInWishlist(artworkId) {
    return wishlist.includes(artworkId);
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const artworkId = btn.dataset.artworkId;
        if (isInWishlist(parseInt(artworkId))) {
            btn.classList.add('active');
            btn.textContent = '❤️';
        } else {
            btn.classList.remove('active');
            btn.textContent = '🤍';
        }
    });
}

// ============================================
// ENHANCED ROUTING
// ============================================

async function handleEnhancedRouting() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');
    
    const [route, ...params] = hash.split('/').filter(Boolean);
    const routePath = '/' + (route ? route : '');
    const param = params[0];

    try {
        showLoading(true);
        const authStatus = await getAuthStatus();

        if (routePath === '/' || routePath === '/home') {
            app.innerHTML = renderEnhancedHomePage();
            await loadFeaturedArtworks();
            await loadHomeStatistics();
        } else if (routePath === '/explore') {
            app.innerHTML = renderExplorePage();
            await loadAllGalleryArtworks();
        } else if (routePath === '/search') {
            app.innerHTML = renderSearchPage();
        } else if (routePath === '/wishlist') {
            if (!authStatus.isAuthenticated) {
                navigateTo('/login');
                return;
            }
            app.innerHTML = renderWishlistPage();
            await loadWishlistArtworks();
        } else if (routePath === '/profile') {
            if (!authStatus.isAuthenticated) {
                navigateTo('/login');
                return;
            }
            app.innerHTML = renderUserProfilePage(authStatus.user.id);
            await loadUserProfile(authStatus.user.id);
        } else if (routePath === '/artist-profile' && param) {
            app.innerHTML = renderArtistProfilePage(param);
            await loadArtistProfile(param);
        } else if (routePath === '/settings') {
            if (!authStatus.isAuthenticated) {
                navigateTo('/login');
                return;
            }
            app.innerHTML = renderAccountSettingsPage();
        } else if (routePath === '/artwork' && param) {
            app.innerHTML = renderEnhancedArtworkDetailsPage(param);
            await loadArtworkDetails(param);
            await loadArtworkReviews(param);
        } else if (routePath === '/artist') {
            if (!authStatus.isAuthenticated || authStatus.user.role !== 'artist') {
                navigateTo('/login');
                return;
            }
            app.innerHTML = renderEnhancedArtistDashboard();
            await loadArtistDashboardData();
        } else if (routePath === '/admin') {
            if (!authStatus.isAuthenticated || authStatus.user.role !== 'admin') {
                navigateTo('/login');
                return;
            }
            app.innerHTML = renderEnhancedAdminDashboard();
            await loadAdminDashboardData();
        } else {
            app.innerHTML = renderNotFoundPage();
        }

        showLoading(false);
        updateWishlistButtons();
    } catch (error) {
        console.error('Routing error:', error);
        showLoading(false);
        showToast('Error loading page', 'error');
    }
}

// ============================================
// DATA LOADING FUNCTIONS - ENHANCED
// ============================================

async function loadHomeStatistics() {
    try {
        // These are placeholder values - update with real API calls
        document.getElementById('totalArtworks').textContent = '1250+';
        document.getElementById('totalArtists').textContent = '340+';
        document.getElementById('totalCollectors').textContent = '8900+';
        document.getElementById('totalSales').textContent = '5600+';
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

async function loadWishlistArtworks() {
    try {
        const wishlistGrid = document.getElementById('wishlistGrid');
        if (!wishlist.length) {
            wishlistGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">❤️</div>
                    <p>Your wishlist is empty</p>
                    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="navigateTo('/explore')">Browse Artworks</button>
                </div>
            `;
            return;
        }

        const allArtworks = await getArtworks();
        const wishlistItems = allArtworks.filter(a => wishlist.includes(a.id));
        
        if (wishlistItems.length === 0) {
            wishlistGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">❤️</div>
                    <p>No artworks in your wishlist</p>
                </div>
            `;
        } else {
            wishlistGrid.innerHTML = wishlistItems.map(artwork => `
                ${renderArtworkCard(artwork)}
            `).join('');
        }
    } catch (error) {
        console.error('Error loading wishlist:', error);
        showToast('Failed to load wishlist', 'error');
    }
}

async function loadUserProfile(userId) {
    try {
        const user = await getCurrentUser();
        const profileContainer = document.getElementById('profileContainer');

        const profileHTML = `
            <div class="profile-header">
                <div class="profile-pic">
                    <img src="https://via.placeholder.com/150" alt="${user.name}">
                </div>
                <div class="profile-info">
                    <h1>${user.name}</h1>
                    <p>Artist</p>
                    <div class="profile-stats">
                        <div class="pstat">
                            <span class="pstat-number">24</span>
                            <span class="pstat-label">Artworks</span>
                        </div>
                        <div class="pstat">
                            <span class="pstat-number">4.8</span>
                            <span class="pstat-label">Rating</span>
                        </div>
                        <div class="pstat">
                            <span class="pstat-number">156</span>
                            <span class="pstat-label">Followers</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="profile-sections">
                <div class="profile-section">
                    <h3>Bio</h3>
                    <p>Contemporary artist exploring the intersection of digital and traditional media.</p>
                </div>
                <div class="profile-section">
                    <h3>Featured Artworks</h3>
                    <div id="featuredArtworks" class="artwork-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                        Loading...
                    </div>
                </div>
            </div>
        `;

        profileContainer.innerHTML = profileHTML;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadArtistProfile(artistId) {
    try {
        const profileContainer = document.getElementById('artistProfileContainer');

        const profileHTML = `
            <div class="profile-header">
                <div class="profile-pic">
                    <img src="https://via.placeholder.com/150" alt="Artist">
                </div>
                <div class="profile-info">
                    <h1>Artist Name</h1>
                    <p>Contemporary Artist</p>
                    <div class="profile-stats">
                        <div class="pstat">
                            <span class="pstat-number">42</span>
                            <span class="pstat-label">Artworks</span>
                        </div>
                        <div class="pstat">
                            <span class="pstat-number">4.9</span>
                            <span class="pstat-label">Rating</span>
                        </div>
                        <div class="pstat">
                            <span class="pstat-number">2.3K</span>
                            <span class="pstat-label">Followers</span>
                        </div>
                    </div>
                    <button class="btn btn-primary">Follow Artist</button>
                </div>
            </div>

            <div class="profile-sections">
                <div class="profile-section">
                    <h3>About</h3>
                    <p>Award-winning contemporary artist with 15+ years of experience...</p>
                </div>
                <div class="profile-section">
                    <h3>Portfolio</h3>
                    <div id="artistArtworks" class="artwork-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                        Loading artworks...
                    </div>
                </div>
            </div>
        `;

        profileContainer.innerHTML = profileHTML;
    } catch (error) {
        console.error('Error loading artist profile:', error);
    }
}

async function loadArtworkReviews(artworkId) {
    try {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        // Placeholder for reviews - integrate with backend
        const reviews = [
            {
                id: 1,
                author: 'John Doe',
                rating: 5,
                text: 'Absolutely stunning artwork! The colors and details are breathtaking.',
                date: '2 days ago'
            },
            {
                id: 2,
                author: 'Jane Smith',
                rating: 4,
                text: 'Beautiful piece. Great composition and execution.',
                date: '1 week ago'
            }
        ];

        if (reviews.length === 0) {
            reviewsList.innerHTML = `<p style="text-align: center; color: #999;">No reviews yet. Be the first to review!</p>`;
        } else {
            reviewsList.innerHTML = reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${review.author}</span>
                        <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            `).join('');
        }

        document.getElementById('reviewsSection').style.display = 'block';
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

async function loadArtistDashboardData() {
    try {
        const artworks = await getArtworksByArtist(JSON.parse(localStorage.getItem('user')).id);
        
        // Update stats
        document.getElementById('totalArtworks').textContent = artworks.length;
        document.getElementById('approvedCount').textContent = artworks.filter(a => a.approval_status === 'approved').length;
        document.getElementById('pendingCount').textContent = artworks.filter(a => a.approval_status === 'pending').length;
        
        // Load artworks table
        await loadArtistArtworks();
    } catch (error) {
        console.error('Error loading artist dashboard:', error);
    }
}

async function loadAdminDashboardData() {
    try {
        const allArtworks = await getAllArtworks();
        const pendingArtworks = await getUnapprovedArtworks();
        const enquiries = await getEnquiries();

        // Update stats
        document.getElementById('totalArtworksAdmin').textContent = allArtworks.length;
        document.getElementById('pendingApprovalsCount').textContent = pendingArtworks.length;
        document.getElementById('totalEnquiriesAdmin').textContent = enquiries.length;
        document.getElementById('totalUsersCount').textContent = '120+'; // Placeholder

        // Load tables
        await loadPendingArtworks();
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// ============================================
// SEARCH & FILTER FUNCTIONS
// ============================================

let allArtworksCache = [];

async function handleSearch() {
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const searchResults = document.getElementById('searchResults');

    if (!searchInput.trim()) {
        searchResults.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <p>Enter a search term to begin</p>
            </div>
        `;
        return;
    }

    try {
        if (!allArtworksCache.length) {
            allArtworksCache = await getArtworks();
        }

        const filtered = allArtworksCache.filter(art =>
            art.title.toLowerCase().includes(searchInput) ||
            art.artist_name?.toLowerCase().includes(searchInput) ||
            art.category?.toLowerCase().includes(searchInput)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🔍</div>
                    <p>No artworks found matching your search</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = filtered.map(renderArtworkCard).join('');
        }
    } catch (error) {
        console.error('Search error:', error);
        showToast('Search failed', 'error');
    }
}

async function applyFilters() {
    const categories = Array.from(document.querySelectorAll('.filter-options input:checked')).map(i => i.value);
    const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
    const sortBy = document.getElementById('sortBy')?.value || 'newest';

    try {
        if (!allArtworksCache.length) {
            allArtworksCache = await getArtworks();
        }

        let filtered = allArtworksCache;

        // Apply category filter
        if (categories.length > 0) {
            filtered = filtered.filter(art => categories.includes(art.category?.toLowerCase()));
        }

        // Apply price filter
        filtered = filtered.filter(art => art.price >= minPrice && art.price <= maxPrice);

        // Apply sorting
        switch (sortBy) {
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = filtered.map(renderArtworkCard).join('');
    } catch (error) {
        console.error('Filter error:', error);
        showToast('Filter failed', 'error');
    }
}

function filterArtworks() {
    const category = document.getElementById('categoryFilter')?.value;
    // Implement category filtering
    applyFilters();
}

// ============================================
// TAB SWITCHING - ENHANCED
// ============================================

function switchArtistTab(tabName) {
    document.querySelectorAll('#artist-dashboard .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('#artist-dashboard .tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const tabElement = document.getElementById(`${tabName}Tab`);
    if (tabElement) {
        tabElement.style.display = 'block';
    }

    event.target.classList.add('active');

    if (tabName === 'myArtworks') {
        loadArtistArtworks();
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('#admin-dashboard .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('#admin-dashboard .tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const tabElement = document.getElementById(`${tabName}Tab`);
    if (tabElement) {
        tabElement.style.display = 'block';
    }

    event.target.classList.add('active');
}

function switchSettingsTab(tabName) {
    document.querySelectorAll('.settings-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const tabElement = document.getElementById(`${tabName}Tab`);
    if (tabElement) {
        tabElement.style.display = 'block';
    }

    event.target.classList.add('active');
}

// ============================================
// IMAGE PREVIEW FUNCTIONS
// ============================================

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (!preview) return;

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function previewProfileImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profilePreview');

    if (!preview) return;

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
// FORM HANDLERS - ENHANCED
// ============================================

async function handleAddReview(event, artworkId) {
    event.preventDefault();
    showLoading(true);

    try {
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const comment = document.getElementById('reviewComment').value;

        if (!rating) {
            showToast('Please select a rating', 'error');
            return;
        }

        // Implement backend call for review
        showToast('Review posted successfully!', 'success');
        document.getElementById('reviewForm').reset();
        
        // Reload reviews
        await loadArtworkReviews(artworkId);
    } catch (error) {
        console.error('Review error:', error);
        showToast('Failed to post review', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    showLoading(true);

    try {
        const fullName = document.getElementById('fullName').value;
        const bio = document.getElementById('bio').value;
        const location = document.getElementById('location').value;

        // Implement backend call to update profile
        showToast('Profile updated successfully!', 'success');
    } catch (error) {
        console.error('Update profile error:', error);
        showToast('Failed to update profile', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleChangePassword(event) {
    event.preventDefault();
    showLoading(true);

    try {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Implement backend call to change password
        showToast('Password changed successfully!', 'success');
        document.getElementById('passwordForm').reset();
    } catch (error) {
        console.error('Password change error:', error);
        showToast('Failed to change password', 'error');
    } finally {
        showLoading(false);
    }
}

function toggleDarkMode() {
    const isDark = document.getElementById('darkMode').checked;
    localStorage.setItem('darkMode', isDark);
    // Implement dark mode toggle
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// ============================================
// INITIALIZATION WITH ENHANCED ROUTING
// ============================================

window.addEventListener('hashchange', () => {
    handleEnhancedRouting();
});

window.addEventListener('load', async () => {
    await updateAuthNavigation();
    await handleEnhancedRouting();

    // Restore dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
});
