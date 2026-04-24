// ============================================
// ENHANCED PAGE RENDERING FUNCTIONS
// ============================================

// ENHANCED HOME PAGE WITH STATS
function renderEnhancedHomePage() {
    return `
        <div class="page home-page">
            <div class="hero">
                <h1>Discover Fine Art</h1>
                <p>Explore unique artworks from talented artists around the world</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="navigateTo('/explore')">Explore Gallery</button>
                    <button class="btn btn-secondary" onclick="navigateTo('/search')">Search Art</button>
                </div>
            </div>

            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-number" id="totalArtworks">0</div>
                    <div class="stat-label">Total Artworks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalArtists">0</div>
                    <div class="stat-label">Artists</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalCollectors">0</div>
                    <div class="stat-label">Art Collectors</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalSales">0</div>
                    <div class="stat-label">Artworks Sold</div>
                </div>
            </div>

            <h2 class="section-title">Featured Artworks</h2>
            <div class="filter-bar">
                <select id="categoryFilter" onchange="filterArtworks()">
                    <option value="">All Categories</option>
                    <option value="painting">Painting</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="photography">Photography</option>
                    <option value="digital">Digital Art</option>
                </select>
            </div>
            <div id="artworkGrid" class="artwork-grid">
                <div class="empty-state">
                    <div class="empty-state-icon">🎨</div>
                    <p>Loading artworks...</p>
                </div>
            </div>
        </div>
    `;
}

// SEARCH PAGE
function renderSearchPage() {
    return `
        <div class="page search-page">
            <h1 class="section-title">Search Gallery</h1>
            
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search by title, artist, or category..." onkeyup="handleSearch()">
                    <button onclick="handleSearch()" class="btn btn-primary">🔍 Search</button>
                </div>

                <div class="filter-panel">
                    <div class="filter-section">
                        <h3 class="filter-title">Category</h3>
                        <div class="filter-options">
                            <label><input type="checkbox" value="painting" onchange="applyFilters()"> Painting</label>
                            <label><input type="checkbox" value="sculpture" onchange="applyFilters()"> Sculpture</label>
                            <label><input type="checkbox" value="photography" onchange="applyFilters()"> Photography</label>
                            <label><input type="checkbox" value="digital" onchange="applyFilters()"> Digital Art</label>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Price Range</h3>
                        <div class="price-range">
                            <input type="number" id="minPrice" placeholder="Min" onchange="applyFilters()">
                            <span>to</span>
                            <input type="number" id="maxPrice" placeholder="Max" onchange="applyFilters()">
                        </div>
                    </div>

                    <div class="filter-section">
                        <h3 class="filter-title">Sort By</h3>
                        <select id="sortBy" onchange="applyFilters()">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>
            </div>

            <div id="searchResults" class="artwork-grid">
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>Enter a search term to begin</p>
                </div>
            </div>
        </div>
    `;
}

// WISHLIST PAGE
function renderWishlistPage() {
    return `
        <div class="page wishlist-page">
            <h1 class="section-title">❤️ My Wishlist</h1>
            
            <div id="wishlistGrid" class="artwork-grid">
                <div class="empty-state">
                    <div class="empty-state-icon">❤️</div>
                    <p>Your wishlist is empty</p>
                    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="navigateTo('/explore')">Browse Artworks</button>
                </div>
            </div>
        </div>
    `;
}

// USER PROFILE PAGE
function renderUserProfilePage(userId) {
    return `
        <div class="page user-profile-page">
            <div id="profileContainer">
                <div class="loading-skeleton">
                    <p>Loading profile...</p>
                </div>
            </div>
        </div>
    `;
}

// ARTIST PROFILE PAGE
function renderArtistProfilePage(artistId) {
    return `
        <div class="page artist-profile-page">
            <div id="artistProfileContainer">
                <div class="loading-skeleton">
                    <p>Loading artist profile...</p>
                </div>
            </div>
        </div>
    `;
}

// ACCOUNT SETTINGS PAGE
function renderAccountSettingsPage() {
    return `
        <div class="page account-settings-page">
            <div class="settings-container">
                <h1 class="section-title">⚙️ Account Settings</h1>

                <div class="settings-tabs">
                    <button class="settings-tab active" onclick="switchSettingsTab('profile')">Profile</button>
                    <button class="settings-tab" onclick="switchSettingsTab('preferences')">Preferences</button>
                    <button class="settings-tab" onclick="switchSettingsTab('security')">Security</button>
                    <button class="settings-tab" onclick="switchSettingsTab('notifications')">Notifications</button>
                </div>

                <div id="profileTab" class="settings-tab-content">
                    <form id="profileForm" onsubmit="handleUpdateProfile(event)">
                        <div class="form-group">
                            <label>Profile Picture</label>
                            <div class="image-upload">
                                <input type="file" id="profilePic" accept="image/*" onchange="previewProfileImage(event)">
                                <div id="profilePreview" class="image-preview"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="fullName" required>
                        </div>
                        <div class="form-group">
                            <label>Bio</label>
                            <textarea id="bio" placeholder="Tell us about yourself..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" id="location" placeholder="City, Country">
                        </div>
                        <button type="submit" class="form-button">Save Changes</button>
                    </form>
                </div>

                <div id="preferencesTab" class="settings-tab-content" style="display: none;">
                    <div class="preference-item">
                        <label>Dark Mode</label>
                        <input type="checkbox" id="darkMode" onchange="toggleDarkMode()">
                    </div>
                    <div class="preference-item">
                        <label>Email Notifications</label>
                        <input type="checkbox" id="emailNotifs" checked>
                    </div>
                    <div class="preference-item">
                        <label>Show Profile Publicly</label>
                        <input type="checkbox" id="publicProfile" checked>
                    </div>
                </div>

                <div id="securityTab" class="settings-tab-content" style="display: none;">
                    <form id="passwordForm" onsubmit="handleChangePassword(event)">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" id="currentPassword" required>
                        </div>
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="newPassword" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" id="confirmPassword" required>
                        </div>
                        <button type="submit" class="form-button">Update Password</button>
                    </form>
                </div>

                <div id="notificationsTab" class="settings-tab-content" style="display: none;">
                    <div class="notification-items">
                        <div class="notification-item">
                            <input type="checkbox" id="newArtworks" checked>
                            <label>New artworks from followed artists</label>
                        </div>
                        <div class="notification-item">
                            <input type="checkbox" id="enquiryUpdates" checked>
                            <label>Updates on my enquiries</label>
                        </div>
                        <div class="notification-item">
                            <input type="checkbox" id="reviews" checked>
                            <label>New reviews on my artworks</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ENHANCED ARTWORK DETAILS WITH REVIEWS
function renderEnhancedArtworkDetailsPage(id) {
    return `
        <div class="page artwork-details-page">
            <button class="back-button" onclick="navigateTo('/explore')">← Back to Gallery</button>
            
            <div id="detailsContainer" class="details-container">
                <div class="empty-state">
                    <div class="empty-state-icon">🎨</div>
                    <p>Loading artwork details...</p>
                </div>
            </div>

            <div id="reviewsSection" style="display: none;">
                <h2 class="section-title">Reviews & Ratings</h2>
                
                <div class="review-container">
                    <div class="add-review-form">
                        <h3>Share Your Review</h3>
                        <form id="reviewForm" onsubmit="handleAddReview(event, '${id}')">
                            <div class="form-group">
                                <label>Rating</label>
                                <div class="star-rating">
                                    <input type="radio" id="star5" name="rating" value="5">
                                    <label for="star5">⭐</label>
                                    <input type="radio" id="star4" name="rating" value="4">
                                    <label for="star4">⭐</label>
                                    <input type="radio" id="star3" name="rating" value="3">
                                    <label for="star3">⭐</label>
                                    <input type="radio" id="star2" name="rating" value="2">
                                    <label for="star2">⭐</label>
                                    <input type="radio" id="star1" name="rating" value="1">
                                    <label for="star1">⭐</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Comment</label>
                                <textarea id="reviewComment" placeholder="Share your thoughts about this artwork..."></textarea>
                            </div>
                            <button type="submit" class="form-button">Post Review</button>
                        </form>
                    </div>

                    <div id="reviewsList" class="reviews-list">
                        <p style="text-align: center; color: #999;">Loading reviews...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ENHANCED ARTIST DASHBOARD
function renderEnhancedArtistDashboard() {
    return `
        <div class="page artist-dashboard">
            <h1 class="section-title">🎨 Artist Dashboard</h1>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number" id="totalArtworks">0</div>
                    <div class="stat-label">Total Artworks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="approvedCount">0</div>
                    <div class="stat-label">Approved</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="pendingCount">0</div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalEnquiries">0</div>
                    <div class="stat-label">Enquiries</div>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active" onclick="switchArtistTab('addArtwork')">+ Add Artwork</button>
                <button class="tab" onclick="switchArtistTab('myArtworks')">My Artworks</button>
                <button class="tab" onclick="switchArtistTab('enquiries')">Enquiries</button>
                <button class="tab" onclick="switchArtistTab('analytics')">Analytics</button>
            </div>

            <div id="addArtworkTab" class="tab-content">
                <div class="form-container">
                    <h2 class="form-title">Upload Artwork</h2>
                    <form id="addArtworkForm" onsubmit="handleAddArtwork(event)">
                        <div class="form-group">
                            <label for="title">Artwork Title *</label>
                            <input type="text" id="title" name="title" required placeholder="Enter artwork title">
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Description *</label>
                            <textarea id="description" name="description" required placeholder="Describe your artwork..."></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="categoryId">Category *</label>
                                <select id="categoryId" name="categoryId" required>
                                    <option value="">Select Category</option>
                                    <option value="1">Painting</option>
                                    <option value="2">Digital Art</option>
                                    <option value="3">Landscape</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="price">Price (₹) *</label>
                                <input type="number" id="price" name="price" required placeholder="Enter price" min="0" step="100">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="image">Artwork Image *</label>
                            <div class="image-upload-area">
                                <input type="file" id="image" name="image" accept="image/*" required onchange="previewImage(event)">
                                <div class="upload-placeholder">
                                    <span>📸 Click to upload or drag image here</span>
                                </div>
                            </div>
                            <div id="imagePreview" class="image-preview"></div>
                        </div>

                        <button type="submit" class="form-button">Upload Artwork</button>
                    </form>
                </div>
            </div>

            <div id="myArtworksTab" class="tab-content" style="display: none;">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="myArtworksTable">
                            <tr><td colspan="7" style="text-align: center; color: #999;">Loading artworks...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="enquiriesTab" class="tab-content" style="display: none;">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Artwork</th>
                                <th>From</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="enquiriesTable">
                            <tr><td colspan="6" style="text-align: center; color: #999;">Loading enquiries...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="analyticsTab" class="tab-content" style="display: none;">
                <h3 style="margin-bottom: 2rem;">Your Analytics</h3>
                <div class="analytics-grid">
                    <div class="chart-container">
                        <h4>Views per Artwork</h4>
                        <div id="viewsChart" style="height: 300px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                            Chart placeholder (integrate Chart.js)
                        </div>
                    </div>
                    <div class="chart-container">
                        <h4>Enquiries Over Time</h4>
                        <div id="enquiriesChart" style="height: 300px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                            Chart placeholder (integrate Chart.js)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ENHANCED ADMIN DASHBOARD
function renderEnhancedAdminDashboard() {
    return `
        <div class="page admin-dashboard">
            <h1 class="section-title">📊 Admin Dashboard</h1>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number" id="totalArtworksAdmin">0</div>
                    <div class="stat-label">Total Artworks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="pendingApprovalsCount">0</div>
                    <div class="stat-label">Pending Approval</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalUsersCount">0</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="totalEnquiriesAdmin">0</div>
                    <div class="stat-label">Enquiries</div>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active" onclick="switchAdminTab('pendingArtworks')">⏱ Pending Approvals</button>
                <button class="tab" onclick="switchAdminTab('allArtworks')">📁 All Artworks</button>
                <button class="tab" onclick="switchAdminTab('allEnquiries')">💬 Enquiries</button>
                <button class="tab" onclick="switchAdminTab('users')">👥 Users</button>
                <button class="tab" onclick="switchAdminTab('analytics')">📈 Analytics</button>
            </div>

            <div id="pendingArtworksTab" class="tab-content">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="pendingArtworksTable">
                            <tr><td colspan="6" style="text-align: center; color: #999;">Loading artworks...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="allArtworksTab" class="tab-content" style="display: none;">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="allArtworksTable">
                            <tr><td colspan="7" style="text-align: center; color: #999;">Loading artworks...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="allEnquiriesTab" class="tab-content" style="display: none;">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Artwork</th>
                                <th>From</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="allEnquiriesTable">
                            <tr><td colspan="6" style="text-align: center; color: #999;">Loading enquiries...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="usersTab" class="tab-content" style="display: none;">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTable">
                            <tr><td colspan="6" style="text-align: center; color: #999;">Loading users...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="analyticsTab" class="tab-content" style="display: none;">
                <h3 style="margin-bottom: 2rem;">Platform Analytics</h3>
                <div class="analytics-grid">
                    <div class="chart-container">
                        <h4>Artworks by Category</h4>
                        <div id="categoryChart" style="height: 300px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                            Chart placeholder
                        </div>
                    </div>
                    <div class="chart-container">
                        <h4>Platform Growth</h4>
                        <div id="growthChart" style="height: 300px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">
                            Chart placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
