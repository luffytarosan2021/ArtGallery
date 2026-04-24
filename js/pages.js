// ============================================
// PAGE RENDERING FUNCTIONS
// ============================================

// HOME PAGE
function renderHomePage() {
    return `
        <div class="page home-page">
            <div class="hero">
                <h1>Discover Fine Art</h1>
                <p>Explore unique artworks from talented artists around the world</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="navigateTo('/explore')">Explore Gallery</button>
                    <button class="btn btn-secondary" onclick="navigateTo('/login')">Sign In</button>
                </div>
            </div>

            <h2 class="section-title">Featured Artworks</h2>
            <div id="artworkGrid" class="artwork-grid">
                <div class="empty-state">
                    <div class="empty-state-icon">🎨</div>
                    <p>Loading artworks...</p>
                </div>
            </div>
        </div>
    `;
}

// EXPLORE PAGE
function renderExplorePage() {
    return `
        <div class="page explore-page">
            <h1 class="section-title">Browse Gallery</h1>
            <div id="artworkGrid" class="artwork-grid">
                <div class="empty-state">
                    <div class="empty-state-icon">🎨</div>
                    <p>Loading artworks...</p>
                </div>
            </div>
        </div>
    `;
}

// ARTWORK DETAILS PAGE
function renderArtworkDetailsPage(id) {
    return `
        <div class="page artwork-details-page">
            <button class="back-button" onclick="navigateTo('/explore')">← Back to Gallery</button>
            <div id="detailsContainer" class="details-container">
                <div class="empty-state">
                    <div class="empty-state-icon">🎨</div>
                    <p>Loading artwork details...</p>
                </div>
            </div>
        </div>
    `;
}

// LOGIN PAGE
function renderLoginPage() {
    return `
        <div class="page login-page">
            <div class="form-container">
                <h2 class="form-title">Welcome Back</h2>
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Enter your password">
                    </div>
                    <button type="submit" class="form-button">Login</button>
                </form>
                <div class="form-footer">
                    Don't have an account? <a href="#/register">Sign up here</a>
                </div>
            </div>
        </div>
    `;
}

// REGISTER PAGE
function renderRegisterPage() {
    return `
        <div class="page register-page">
            <div class="form-container">
                <h2 class="form-title">Create Account</h2>
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="fullname">Full Name</label>
                        <input type="text" id="fullname" name="fullname" required placeholder="Enter your full name">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Enter your password">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm your password">
                    </div>
                    <div class="form-group">
                        <label for="role">Account Type</label>
                        <select id="role" name="role" required>
                            <option value="">Select account type</option>
                            <option value="visitor">Collector / Viewer</option>
                            <option value="artist">Artist</option>
                        </select>
                    </div>
                    <button type="submit" class="form-button">Create Account</button>
                </form>
                <div class="form-footer">
                    Already have an account? <a href="#/login">Login here</a>
                </div>
            </div>
        </div>
    `;
}

// ENQUIRY FORM PAGE
function renderEnquiryFormPage(artworkId) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return `
        <div class="page enquiry-form-page">
            <div class="form-container">
                <h2 class="form-title">Send Enquiry</h2>
                ${user ? `<p style="color:#888;margin-bottom:1.5rem;text-align:center;">Enquiring as <strong>${user.name}</strong> (${user.email})</p>` : ''}
                <form id="enquiryForm" onsubmit="handleEnquiry(event, '${artworkId}')">
                    <div class="form-group">
                        <label for="message">Your Message</label>
                        <textarea id="message" name="message" required placeholder="Tell us more about your interest in this artwork..." rows="6"></textarea>
                    </div>
                    <button type="submit" class="form-button">Send Enquiry</button>
                </form>
                <div class="form-footer">
                    <a href="#/artwork/${artworkId}">← Back to Artwork</a>
                </div>
            </div>
        </div>
    `;
}


// ARTIST DASHBOARD
function renderArtistDashboard() {
    return `
        <div class="page artist-dashboard">
            <h1 class="section-title">Artist Dashboard</h1>
            
            <div class="tabs">
                <button class="tab active" onclick="switchTab('addArtwork')">Add Artwork</button>
                <button class="tab" onclick="switchTab('myArtworks')">My Artworks</button>
            </div>

            <div id="addArtworkTab" class="tab-content">
                <div class="form-container">
                    <h2 class="form-title">Upload Artwork</h2>
                    <form id="addArtworkForm" onsubmit="handleAddArtwork(event)">
                        <div class="form-group">
                            <label for="title">Artwork Title</label>
                            <input type="text" id="title" name="title" required placeholder="Enter artwork title">
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" name="description" required placeholder="Describe your artwork..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="categoryId">Category</label>
                            <select id="categoryId" name="categoryId" required>
                                <option value="">Select Category</option>
                                <option value="1">Painting</option>
                                <option value="2">Digital Art</option>
                                <option value="3">Landscape</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="price">Price</label>
                            <input type="number" id="price" name="price" required placeholder="Enter price" min="0" step="100">
                        </div>
                        <div class="form-group">
                            <label for="image">Image URL</label>
                            <input type="url" id="image" name="image" placeholder="Enter image URL (optional)">
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
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="myArtworksTable">
                            <tr><td colspan="5" style="text-align: center; color: #999;">Loading artworks...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ADMIN DASHBOARD
function renderAdminDashboard() {
    return `
        <div class="page admin-dashboard">
            <h1 class="section-title">Admin Dashboard</h1>
            
            <div class="tabs">
                <button class="tab active" onclick="switchTab('pendingArtworks')">Pending Approvals</button>
                <button class="tab" onclick="switchTab('allArtworks')">All Artworks</button>
                <button class="tab" onclick="switchTab('allEnquiries')">Enquiries</button>
            </div>

            <div id="pendingArtworksTab" class="tab-content">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="pendingArtworksTable">
                            <tr><td colspan="4" style="text-align: center; color: #999;">Loading artworks...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="allArtworksTab" class="tab-content" style="display: none;">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="allArtworksTable">
                            <tr><td colspan="5" style="text-align: center; color: #999;">Loading artworks...</td></tr>
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
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="allEnquiriesTable">
                            <tr><td colspan="5" style="text-align: center; color: #999;">Loading enquiries...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// NOT FOUND PAGE
function renderNotFoundPage() {
    return `
        <div class="page not-found-page">
            <div class="empty-state" style="padding: 8rem 2rem;">
                <div class="empty-state-icon">❌</div>
                <h2 style="color: #333; margin-bottom: 1rem;">Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <button class="btn btn-primary" style="margin-top: 2rem;" onclick="navigateTo('/')">Go Home</button>
            </div>
        </div>
    `;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach((tab) => {
        tab.style.display = 'none';
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.remove('active');
    });

    // Show selected tab
    const tabElement = document.getElementById(`${tabName}Tab`);
    if (tabElement) {
        tabElement.style.display = 'block';
    }

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Load tab-specific data
    if (tabName === 'myArtworks') {
        loadArtistArtworks();
    } else if (tabName === 'allArtworks') {
        loadAllArtworks();
    } else if (tabName === 'pendingArtworks') {
        loadPendingArtworks();
    } else if (tabName === 'allEnquiries') {
        loadAllEnquiries();
    }
}

function renderArtworkCard(artwork) {
    return `
        <div class="artwork-card" onclick="navigateTo('/artwork/${artwork.id}')">
            <div class="artwork-image">
                ${
                    artwork.image
                        ? `<img src="${artwork.image}" alt="${artwork.title}" onerror="this.parentElement.innerHTML='<div class=artwork-image-placeholder>🎨</div>'">`
                        : '<div class="artwork-image-placeholder">🎨</div>'
                }
            </div>
            <div class="artwork-content">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-artist">${artwork.artist_name || 'Unknown Artist'}</p>
                <p class="artwork-price">₹ ${parseInt(artwork.price).toLocaleString()}</p>
            </div>
        </div>
    `;
}

function renderArtworkDetails(artwork) {
    const statusBadge = {
        approved: '<span style="color: #10b981; font-weight: 600;">✓ Approved</span>',
        rejected: '<span style="color: #ef4444; font-weight: 600;">✗ Rejected</span>',
        pending: '<span style="color: #f59e0b; font-weight: 600;">⏱ Pending</span>',
        default: '',
    };

    const userStatus = localStorage.getItem('user');
    const user = userStatus ? JSON.parse(userStatus) : null;
    const isOwnArtwork = user && parseInt(user.id) === parseInt(artwork.user_id);

    return `
        <div class="details-image">
            ${
                artwork.image
                    ? `<img src="${artwork.image}" alt="${artwork.title}">`
                    : '<div class="artwork-image-placeholder">🎨</div>'
            }
        </div>
        <div class="details-info">
            <h1>${artwork.title}</h1>
            <div class="details-meta">
                <div class="meta-item">
                    <span class="meta-label">Artist</span>
                    <span class="meta-value">${artwork.artist_name || 'Unknown'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Category</span>
                    <span class="meta-value">${artwork.category || artwork.category_name || 'Uncategorized'}</span>
                </div>
                ${
                    artwork.approval_status
                        ? `<div class="meta-item">
                    <span class="meta-label">Status</span>
                    <span class="meta-value">${statusBadge[artwork.approval_status] || artwork.approval_status}</span>
                </div>`
                        : ''
                }
            </div>
            <div class="details-price">₹ ${parseInt(artwork.price).toLocaleString()}</div>
            <p class="details-description">${artwork.bio || artwork.description || 'No description available'}</p>
            <div class="details-actions">
                ${
                    !isOwnArtwork
                        ? `<button class="btn-large primary" onclick="navigateTo('/enquiry/${artwork.id}')">Send Enquiry</button>`
                        : `<button class="btn-large secondary" disabled>Your Artwork</button>`
                }
                <button class="btn-large secondary" onclick="navigateTo('/explore')">Browse More</button>
            </div>
        </div>
    `;
}

