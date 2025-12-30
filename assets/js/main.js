/**
 * South African Pistol Federation - Main JavaScript
 * Handles dynamic content rendering, filtering, and interactions
 */

// Global data storage
let eventsData = [];
let resultsData = [];
let documentsData = [];
let galleryData = [];
let currentLightboxIndex = -1;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initLightbox();
    setActiveNavItem();
    loadData();
    initContactForm();
    initFAQ();
});

/**
 * Set active navigation item based on current page
 */
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
}

/**
 * Initialize lightbox for gallery
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxImage = document.getElementById('lightbox-image');
    
    if (!lightbox) return;
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxClose.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeLightbox();
            }
        });
    }
    
    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPreviousImage);
        lightboxPrev.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPreviousImage();
            }
        });
    }
    
    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
        lightboxNext.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showNextImage();
            }
        });
    }
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    // Focus management
    lightbox.addEventListener('transitionend', function() {
        if (lightbox.classList.contains('active')) {
            // Focus close button when lightbox opens
            if (lightboxClose) {
                lightboxClose.focus();
            }
        }
    });
}

/**
 * Open lightbox with image
 */
function openLightbox(imageSrc, imageAlt, imageTitle, imageIndex) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    if (!lightbox || !lightboxImg) return;
    
    // Set current index
    currentLightboxIndex = imageIndex !== undefined ? imageIndex : 
        galleryData.findIndex(img => img.src === imageSrc);
    
    // Update image
    lightboxImg.src = imageSrc;
    lightboxImg.alt = imageAlt || 'Gallery image';
    
    // Update title
    if (lightboxTitle) {
        lightboxTitle.textContent = imageTitle || imageAlt || '';
    }
    
    // Update counter
    if (lightboxCounter && galleryData.length > 0) {
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryData.length}`;
    }
    
    // Show/hide navigation buttons
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    if (prevBtn) {
        prevBtn.style.display = galleryData.length > 1 ? 'flex' : 'none';
    }
    if (nextBtn) {
        nextBtn.style.display = galleryData.length > 1 ? 'flex' : 'none';
    }
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Close lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        currentLightboxIndex = -1;
    }
}

/**
 * Show previous image in lightbox
 */
function showPreviousImage() {
    if (galleryData.length === 0 || currentLightboxIndex < 0) return;
    
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
    const image = galleryData[currentLightboxIndex];
    openLightbox(image.src, image.alt, image.title, currentLightboxIndex);
}

/**
 * Show next image in lightbox
 */
function showNextImage() {
    if (galleryData.length === 0 || currentLightboxIndex < 0) return;
    
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
    const image = galleryData[currentLightboxIndex];
    openLightbox(image.src, image.alt, image.title, currentLightboxIndex);
}

/**
 * Render gallery page
 */
function renderGallery() {
    const container = document.getElementById('gallery-grid');
    const emptyState = document.getElementById('gallery-empty');
    
    if (!container) return;
    
    if (galleryData.length === 0) {
        container.classList.add('hidden');
        if (emptyState) {
            emptyState.classList.remove('hidden');
        }
        return;
    }
    
    container.classList.remove('hidden');
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    // Create gallery items with lazy loading
    container.innerHTML = galleryData.map((image, index) => createGalleryItem(image, index)).join('');
    
    // Set up lazy loading with Intersection Observer
    setupLazyLoading();
}

/**
 * Create gallery item HTML
 */
function createGalleryItem(image, index) {
    // Create placeholder for lazy loading
    const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22250%22 height=%22250%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ELoading...%3C/text%3E%3C/svg%3E';
    
    return `
        <div class="gallery-item" 
             role="listitem"
             data-image-index="${index}"
             tabindex="0"
             aria-label="View ${escapeHtml(image.alt || image.title)}"
             onclick="openLightbox('${image.src}', '${escapeHtml(image.alt || '')}', '${escapeHtml(image.title || '')}', ${index})"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openLightbox('${image.src}', '${escapeHtml(image.alt || '')}', '${escapeHtml(image.title || '')}', ${index});}">
            <img 
                src="${placeholder}"
                data-src="${image.src}"
                alt="${escapeHtml(image.alt || image.title || 'Gallery image')}"
                class="lazy-image"
                loading="lazy"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22250%22 height=%22250%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E'">
            <div class="gallery-item-overlay">
                <span class="gallery-item-title">${escapeHtml(image.title || image.alt || '')}</span>
            </div>
        </div>
    `;
}

/**
 * Setup lazy loading for gallery images
 */
function setupLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.lazy-image');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const dataSrc = img.getAttribute('data-src');
                    if (dataSrc) {
                        // Load the image
                        img.src = dataSrc;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before image enters viewport
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer
        const lazyImages = document.querySelectorAll('.lazy-image');
        lazyImages.forEach(img => {
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute('data-src');
            }
        });
    }
}

/**
 * Load JSON data files
 */
async function loadData() {
    try {
        // Load events
        const eventsResponse = await fetch('data/events.json');
        const eventsJson = await eventsResponse.json();
        eventsData = eventsJson.events || [];
        
        // Load results
        const resultsResponse = await fetch('data/results.json');
        const resultsJson = await resultsResponse.json();
        resultsData = resultsJson.results || [];
        
        // Load documents
        const documentsResponse = await fetch('data/documents.json');
        const documentsJson = await documentsResponse.json();
        documentsData = documentsJson.documents || [];
        
        // Load gallery images
        const galleryResponse = await fetch('data/gallery.json');
        const galleryJson = await galleryResponse.json();
        galleryData = galleryJson.images || [];
        
        // Render based on current page
        renderPageContent();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

/**
 * Get URL parameter value
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Render content based on current page
 */
function renderPageContent() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '') {
        renderHomepageContent();
    } else if (page === 'events.html') {
        renderEvents();
    } else if (page === 'results.html') {
        renderResults();
    } else if (page === 'documents.html') {
        renderDocuments();
    } else if (page === 'gallery.html') {
        renderGallery();
    }
}

/**
 * Render homepage dynamic content
 */
function renderHomepageContent() {
    renderUpcomingEvents();
    renderLatestResults();
}

/**
 * Render upcoming events on homepage
 */
function renderUpcomingEvents() {
    const container = document.getElementById('upcoming-events');
    if (!container) return;
    
    const upcoming = eventsData
        .filter(event => event.status === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No upcoming events scheduled.</p></div>';
        return;
    }
    
    container.innerHTML = upcoming.map(event => createEventCard(event)).join('');
}

/**
 * Render latest results on homepage
 */
function renderLatestResults() {
    const container = document.getElementById('latest-results');
    if (!container) return;
    
    const latest = resultsData
        .filter(result => !result.nationalLog)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    if (latest.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No results available.</p></div>';
        return;
    }
    
    container.innerHTML = latest.map(result => createResultCard(result)).join('');
}

/**
 * Create event card HTML
 */
function createEventCard(event) {
    const date = new Date(event.date);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const fullDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const isUpcoming = event.status === 'upcoming';
    const isPast = event.status === 'completed';
    
    // Determine badge class based on discipline
    const badgeClass = event.discipline === 'ISSF' ? 'issf' : 'npa';
    
    return `
        <article class="card event-card" role="listitem">
            <div class="event-card-header">
                <div class="event-date">
                    <div class="event-date-day">${day}</div>
                    <div class="event-date-month">${month}</div>
                    <div class="event-date-year">${year}</div>
                </div>
                <div class="event-status-badge ${event.status}">
                    ${isUpcoming ? '📅 Upcoming' : isPast ? '✓ Completed' : ''}
                </div>
            </div>
            <div class="event-card-body">
                <h3 class="event-title">${escapeHtml(event.title)}</h3>
                <div class="event-meta">
                    <div class="event-location">
                        <span class="event-icon">📍</span>
                        <span>${escapeHtml(event.location)}</span>
                    </div>
                    <div class="event-date-full">
                        <span class="event-icon">📆</span>
                        <span>${fullDate}</span>
                    </div>
                </div>
                <div class="event-discipline">
                    <span class="card-badge ${badgeClass}">${escapeHtml(event.discipline)}</span>
                </div>
            </div>
            <div class="event-card-footer">
                ${event.entryForm ? `
                    <a href="${event.entryForm}" class="btn btn-small" target="_blank" rel="noopener" aria-label="Download entry form for ${escapeHtml(event.title)}">
                        <span>📄</span> Entry Form
                    </a>
                ` : ''}
                ${event.results ? `
                    <a href="${event.results}" class="btn btn-small ${event.entryForm ? 'btn-outline' : ''}" aria-label="View results for ${escapeHtml(event.title)}">
                        <span>🏆</span> Results
                    </a>
                ` : ''}
                ${!event.entryForm && !event.results ? `
                    <span class="event-no-links">Links coming soon</span>
                ` : ''}
            </div>
        </article>
    `;
}

/**
 * Create result card HTML
 */
function createResultCard(result) {
    const date = new Date(result.date);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(result.event)}</h3>
                <span class="card-badge ${result.discipline.toLowerCase()}">${result.discipline}</span>
            </div>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Type:</strong> ${escapeHtml(result.type)}</p>
            ${result.pdf ? `<a href="${result.pdf}" class="btn btn-small" target="_blank">Download PDF</a>` : ''}
        </div>
    `;
}

/**
 * Render events page
 */
function renderEvents() {
    const container = document.getElementById('events-container');
    const emptyState = document.getElementById('events-empty');
    if (!container) return;
    
    // Filter state
    let currentDisciplineFilter = 'all';
    let currentStatusFilter = 'all';
    
    // Check URL parameters for initial filters
    const urlDiscipline = getUrlParameter('discipline');
    const urlStatus = getUrlParameter('status');
    
    if (urlDiscipline) {
        currentDisciplineFilter = urlDiscipline;
    }
    if (urlStatus) {
        currentStatusFilter = urlStatus;
    }
    
    // Initialize filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter-type]');
    filterButtons.forEach(btn => {
        const filterType = btn.dataset.filterType;
        const filterValue = btn.dataset.filterValue;
        
        // Set initial active state
        if (filterType === 'discipline' && filterValue === currentDisciplineFilter) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else if (filterType === 'status' && filterValue === currentStatusFilter) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else if (filterValue === 'all' && 
                   ((filterType === 'discipline' && currentDisciplineFilter === 'all') ||
                    (filterType === 'status' && currentStatusFilter === 'all'))) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
        
        // Add click handler
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filterType;
            const filterValue = this.dataset.filterValue;
            
            // Update active state for this filter group
            const sameGroupButtons = document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`);
            sameGroupButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Update filter state
            if (filterType === 'discipline') {
                currentDisciplineFilter = filterValue;
            } else if (filterType === 'status') {
                currentStatusFilter = filterValue;
            }
            
            // Apply filters
            applyEventFilters();
        });
    });
    
    // Initial render
    applyEventFilters();
    
    /**
     * Apply current filters and display events
     */
    function applyEventFilters() {
        let filteredEvents = [...eventsData];
        
        // Apply discipline filter
        if (currentDisciplineFilter !== 'all') {
            filteredEvents = filteredEvents.filter(e => e.discipline === currentDisciplineFilter);
        }
        
        // Apply status filter
        if (currentStatusFilter !== 'all') {
            filteredEvents = filteredEvents.filter(e => e.status === currentStatusFilter);
        }
        
        // Sort: upcoming first, then by date
        filteredEvents.sort((a, b) => {
            if (a.status !== b.status) {
                return a.status === 'upcoming' ? -1 : 1;
            }
            return new Date(a.date) - new Date(b.date);
        });
        
        displayEvents(filteredEvents);
    }
    
    /**
     * Display events in container
     */
    function displayEvents(events) {
        if (events.length === 0) {
            container.classList.add('hidden');
            if (emptyState) {
                emptyState.classList.remove('hidden');
            }
            return;
        }
        
        container.classList.remove('hidden');
        if (emptyState) {
            emptyState.classList.add('hidden');
        }
        
        container.innerHTML = events.map(event => createEventCard(event)).join('');
    }
}

/**
 * Reset all filters
 */
function resetFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter-type]');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (btn.dataset.filterValue === 'all') {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    // Trigger filter update
    const allButtons = document.querySelectorAll('.filter-btn[data-filter-value="all"]');
    allButtons.forEach(btn => btn.click());
}


/**
 * Render results page
 */
function renderResults() {
    const container = document.getElementById('results-container');
    const logsContainer = document.getElementById('national-logs');
    
    if (!container) return;
    
    // Check URL parameter for discipline filter
    const urlDiscipline = getUrlParameter('discipline');
    
    // Separate national logs and regular results
    let nationalLogs = resultsData.filter(r => r.nationalLog);
    let regularResults = resultsData.filter(r => !r.nationalLog);
    
    // Apply discipline filter if specified
    if (urlDiscipline) {
        nationalLogs = nationalLogs.filter(r => r.discipline === urlDiscipline);
        regularResults = regularResults.filter(r => r.discipline === urlDiscipline);
    }
    
    // Sort national logs by date (newest first)
    nationalLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render national logs section
    if (logsContainer) {
        if (nationalLogs.length > 0) {
            logsContainer.innerHTML = nationalLogs.map(log => createNationalLogCard(log)).join('');
        } else {
            logsContainer.innerHTML = '<div class="empty-state" role="status" aria-live="polite"><p>No national logs available.</p></div>';
        }
    }
    
    // Render results table
    if (regularResults.length > 0) {
        renderResultsTable(regularResults);
    } else {
        container.innerHTML = '<div class="empty-state" role="status" aria-live="polite"><p>No results available.</p></div>';
    }
}

/**
 * Create national log card HTML
 */
function createNationalLogCard(log) {
    const date = new Date(log.date);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const badgeClass = log.discipline === 'ISSF' ? 'issf' : 'npa';
    
    return `
        <article class="card national-log-card" role="listitem">
            <div class="national-log-header">
                <h3 class="national-log-title">${escapeHtml(log.event)}</h3>
                <span class="card-badge ${badgeClass}">${escapeHtml(log.discipline)}</span>
            </div>
            <div class="national-log-body">
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Type:</strong> ${escapeHtml(log.type)}</p>
            </div>
            <div class="national-log-footer">
                ${log.pdf ? `
                    <a href="${log.pdf}" class="btn btn-small" target="_blank" rel="noopener" 
                       aria-label="Download ${escapeHtml(log.event)} PDF">
                        <span>📥</span> Download PDF
                    </a>
                ` : '<span class="event-no-links">PDF coming soon</span>'}
            </div>
        </article>
    `;
}

/**
 * Render results table with sorting
 */
function renderResultsTable(results) {
    const container = document.getElementById('results-container');
    if (!container) return;
    
    let sortedResults = [...results];
    let sortColumn = 'date'; // Default sort by date
    let sortDirection = 'desc'; // Default: newest first
    
    // Initial sort
    sortedResults.sort((a, b) => {
        const aVal = new Date(a.date);
        const bVal = new Date(b.date);
        return bVal - aVal; // Descending (newest first)
    });
    
    const table = `
        <div class="table-container" role="region" aria-label="Results table">
            <table id="results-table" role="table" aria-label="Competition results">
                <thead>
                    <tr role="row">
                        <th class="sortable" 
                            data-column="event" 
                            role="columnheader" 
                            aria-sort="none"
                            tabindex="0"
                            aria-label="Sort by event name">
                            Event
                            <span class="sort-indicator" aria-hidden="true"></span>
                        </th>
                        <th class="sortable sort-active" 
                            data-column="date" 
                            role="columnheader" 
                            aria-sort="descending"
                            tabindex="0"
                            aria-label="Sort by date">
                            Date
                            <span class="sort-indicator" aria-hidden="true">↓</span>
                        </th>
                        <th class="sortable" 
                            data-column="discipline" 
                            role="columnheader" 
                            aria-sort="none"
                            tabindex="0"
                            aria-label="Sort by discipline">
                            Discipline
                            <span class="sort-indicator" aria-hidden="true"></span>
                        </th>
                        <th role="columnheader" aria-label="Download results">
                            Download
                        </th>
                    </tr>
                </thead>
                <tbody role="rowgroup">
                    ${sortedResults.map(result => createResultRow(result)).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = table;
    
    // Add sorting functionality
    const headers = document.querySelectorAll('#results-table th.sortable');
    headers.forEach(header => {
        // Click handler
        header.addEventListener('click', function() {
            handleSort(this);
        });
        
        // Keyboard handler (Enter and Space)
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSort(this);
            }
        });
        
        // Focus handler for accessibility
        header.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--sapf-primary)';
            this.style.outlineOffset = '2px';
        });
        
        header.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    /**
     * Handle sorting when header is clicked/pressed
     */
    function handleSort(header) {
        const column = header.dataset.column;
        
        // Update sort direction
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
        
        // Sort results
        sortedResults.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            
            if (column === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
                if (sortDirection === 'asc') {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                } else {
                    return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                }
            }
        });
        
        // Update table body
        const tbody = document.querySelector('#results-table tbody');
        tbody.innerHTML = sortedResults.map(result => createResultRow(result)).join('');
        
        // Update header states
        headers.forEach(h => {
            h.classList.remove('sort-active', 'sort-asc', 'sort-desc');
            h.setAttribute('aria-sort', 'none');
            const indicator = h.querySelector('.sort-indicator');
            if (indicator) {
                indicator.textContent = '';
            }
        });
        
        // Update active header
        header.classList.add('sort-active', sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
        header.setAttribute('aria-sort', sortDirection === 'asc' ? 'ascending' : 'descending');
        const indicator = header.querySelector('.sort-indicator');
        if (indicator) {
            indicator.textContent = sortDirection === 'asc' ? '↑' : '↓';
        }
        
        // Announce sort change to screen readers
        const sortText = `Sorted by ${column} ${sortDirection === 'asc' ? 'ascending' : 'descending'}`;
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = sortText;
        container.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}

/**
 * Create result table row
 */
function createResultRow(result) {
    const date = new Date(result.date);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const fullDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const badgeClass = result.discipline === 'ISSF' ? 'issf' : 'npa';
    const rowClass = result.nationalLog ? 'national-log-row' : '';
    
    return `
        <tr role="row" class="${rowClass}" ${result.nationalLog ? 'aria-label="National log"' : ''}>
            <td role="cell" data-label="Event">
                <strong>${escapeHtml(result.event)}</strong>
                ${result.type && result.type !== 'National Log' ? `<br><small class="result-type">${escapeHtml(result.type)}</small>` : ''}
            </td>
            <td role="cell" data-label="Date">
                <time datetime="${result.date}">${formattedDate}</time>
            </td>
            <td role="cell" data-label="Discipline">
                <span class="card-badge ${badgeClass}">${escapeHtml(result.discipline)}</span>
            </td>
            <td role="cell" data-label="Download">
                ${result.pdf ? `
                    <a href="${result.pdf}" 
                       class="btn btn-small" 
                       target="_blank" 
                       rel="noopener"
                       aria-label="Download results PDF for ${escapeHtml(result.event)}">
                        <span aria-hidden="true">📥</span> Download
                    </a>
                ` : '<span class="no-download" aria-label="Download not available">-</span>'}
            </td>
        </tr>
    `;
}

/**
 * Render documents page
 */
function renderDocuments() {
    const container = document.getElementById('documents-container');
    const emptyState = document.getElementById('documents-empty');
    const countElement = document.getElementById('documents-count-text');
    
    if (!container) return;
    
    // Filter state
    let currentCategory = getUrlParameter('category') || 'all';
    let currentDiscipline = getUrlParameter('discipline') || 'all';
    
    // Initialize filter buttons
    const categoryFilters = document.querySelectorAll('.filter-btn[data-filter-category]');
    const disciplineFilters = document.querySelectorAll('.filter-btn[data-filter-discipline]');
    
    // Set initial active states
    categoryFilters.forEach(btn => {
        if (btn.dataset.filterCategory === currentCategory) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
    
    disciplineFilters.forEach(btn => {
        if (btn.dataset.filterDiscipline === currentDiscipline) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
    
    // Add event listeners to category filters
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            categoryFilters.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Update filter
            currentCategory = this.dataset.filterCategory;
            applyDocumentFilters();
        });
        
        // Keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Focus styles
        btn.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--sapf-primary)';
            this.style.outlineOffset = '2px';
        });
        
        btn.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add event listeners to discipline filters
    disciplineFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            disciplineFilters.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Update filter
            currentDiscipline = this.dataset.filterDiscipline;
            applyDocumentFilters();
        });
        
        // Keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Focus styles
        btn.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--sapf-primary)';
            this.style.outlineOffset = '2px';
        });
        
        btn.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    /**
     * Apply filters and display documents
     */
    function applyDocumentFilters() {
        let filteredDocs = documentsData.filter(doc => {
            const categoryMatch = currentCategory === 'all' || doc.category === currentCategory;
            const disciplineMatch = currentDiscipline === 'all' || doc.discipline === currentDiscipline;
            return categoryMatch && disciplineMatch;
        });
        
        // Sort by year (newest first), then by title
        filteredDocs.sort((a, b) => {
            if (b.year !== a.year) {
                return b.year - a.year;
            }
            return a.title.localeCompare(b.title);
        });
        
        // Update count
        if (countElement) {
            const count = filteredDocs.length;
            countElement.textContent = count === 1 
                ? '1 document found' 
                : `${count} documents found`;
        }
        
        displayDocuments(filteredDocs);
    }
    
    /**
     * Display documents in container
     */
    function displayDocuments(docs) {
        if (docs.length === 0) {
            container.classList.add('hidden');
            if (emptyState) {
                emptyState.classList.remove('hidden');
            }
            return;
        }
        
        container.classList.remove('hidden');
        if (emptyState) {
            emptyState.classList.add('hidden');
        }
        
        container.innerHTML = docs.map(doc => createDocumentCard(doc)).join('');
    }
    
    // Initial render
    applyDocumentFilters();
}

/**
 * Create document card HTML
 */
function createDocumentCard(doc) {
    const badgeClass = doc.discipline === 'ISSF' ? 'issf' : doc.discipline === 'NPA/PPC' ? 'npa' : 'general';
    const categoryIcon = getCategoryIcon(doc.category);
    
    return `
        <article class="card document-card" role="listitem">
            <div class="document-card-header">
                <div class="document-icon">${categoryIcon}</div>
                <div class="document-header-content">
                    <h3 class="document-title">${escapeHtml(doc.title)}</h3>
                    <div class="document-meta">
                        <span class="document-year" aria-label="Year: ${doc.year}">${doc.year}</span>
                        <span class="card-badge ${badgeClass}">${escapeHtml(doc.discipline)}</span>
                    </div>
                </div>
            </div>
            <div class="document-card-body">
                <div class="document-category">
                    <span class="document-category-label">Category:</span>
                    <span class="document-category-value">${escapeHtml(doc.category)}</span>
                </div>
                ${doc.description ? `
                    <p class="document-description">${escapeHtml(doc.description)}</p>
                ` : ''}
            </div>
            <div class="document-card-footer">
                <a href="${doc.url}" 
                   class="btn btn-small" 
                   target="_blank" 
                   rel="noopener"
                   aria-label="Download ${escapeHtml(doc.title)} PDF">
                    <span aria-hidden="true">📥</span> Download PDF
                </a>
            </div>
        </article>
    `;
}

/**
 * Get icon for document category
 */
function getCategoryIcon(category) {
    const icons = {
        'Rulebook': '📖',
        'Entry Form': '📝',
        'Results': '📊',
        'Logs': '📋'
    };
    return icons[category] || '📄';
}

/**
 * Reset all document filters
 */
function resetDocumentFilters() {
    const categoryFilters = document.querySelectorAll('.filter-btn[data-filter-category]');
    const disciplineFilters = document.querySelectorAll('.filter-btn[data-filter-discipline]');
    
    // Reset category
    categoryFilters.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (btn.dataset.filterCategory === 'all') {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    // Reset discipline
    disciplineFilters.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (btn.dataset.filterDiscipline === 'all') {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    // Trigger filter update
    const allCategoryBtn = document.querySelector('.filter-btn[data-filter-category="all"]');
    const allDisciplineBtn = document.querySelector('.filter-btn[data-filter-discipline="all"]');
    if (allCategoryBtn) allCategoryBtn.click();
    if (allDisciplineBtn) allDisciplineBtn.click();
}


/**
 * Utility: Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show error message
 */
function showError(message) {
    console.error(message);
    // You can add a toast notification here if needed
}

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const formMessages = document.getElementById('form-messages');
    
    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', () => validateField(nameInput, validateName));
        nameInput.addEventListener('input', () => clearFieldError(nameInput));
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateField(emailInput, validateEmail));
        emailInput.addEventListener('input', () => clearFieldError(emailInput));
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => validateField(messageInput, validateMessage));
        messageInput.addEventListener('input', () => clearFieldError(messageInput));
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        clearFormMessages();
        
        // Validate all fields
        const nameValid = validateField(nameInput, validateName);
        const emailValid = validateField(emailInput, validateEmail);
        const messageValid = validateField(messageInput, validateMessage);
        
        if (!nameValid || !emailValid || !messageValid) {
            showFormMessage('Please correct the errors in the form before submitting.', 'error');
            // Focus first invalid field
            if (!nameValid && nameInput) nameInput.focus();
            else if (!emailValid && emailInput) emailInput.focus();
            else if (!messageValid && messageInput) messageInput.focus();
            return;
        }
        
        // Disable submit button and show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        // Prepare form data
        const formData = new FormData(form);
        
        try {
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                form.reset();
                // Clear all field errors
                clearFieldError(nameInput);
                clearFieldError(emailInput);
                clearFieldError(messageInput);
            } else {
                const data = await response.json();
                if (data.errors) {
                    const errorMessages = data.errors.map(err => err.message).join(', ');
                    showFormMessage(`Error: ${errorMessages}`, 'error');
                } else {
                    showFormMessage('There was an error sending your message. Please try again later.', 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('There was a network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    });
}

/**
 * Validate name field
 */
function validateName(value) {
    if (!value || value.trim().length === 0) {
        return 'Name is required.';
    }
    if (value.trim().length < 2) {
        return 'Name must be at least 2 characters long.';
    }
    if (value.trim().length > 100) {
        return 'Name must be less than 100 characters.';
    }
    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(value.trim())) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    }
    return null;
}

/**
 * Validate email field
 */
function validateEmail(value) {
    if (!value || value.trim().length === 0) {
        return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
        return 'Please enter a valid email address.';
    }
    if (value.trim().length > 254) {
        return 'Email address is too long.';
    }
    return null;
}

/**
 * Validate message field
 */
function validateMessage(value) {
    if (!value || value.trim().length === 0) {
        return 'Message is required.';
    }
    if (value.trim().length < 10) {
        return 'Message must be at least 10 characters long.';
    }
    if (value.trim().length > 2000) {
        return 'Message must be less than 2000 characters.';
    }
    return null;
}

/**
 * Validate a single field
 */
function validateField(field, validator) {
    if (!field || !validator) return false;
    
    const value = field.value;
    const error = validator(value);
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (error) {
        field.classList.add('error');
        field.classList.remove('success');
        if (errorElement) {
            errorElement.textContent = error;
            errorElement.setAttribute('role', 'alert');
        }
        field.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        field.classList.remove('error');
        field.classList.add('success');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.removeAttribute('role');
        }
        field.setAttribute('aria-invalid', 'false');
        return true;
    }
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    if (!field) return;
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
}

/**
 * Show form message (success/error/info)
 */
function showFormMessage(message, type = 'info') {
    const formMessages = document.getElementById('form-messages');
    if (!formMessages) return;
    
    formMessages.textContent = message;
    formMessages.className = type;
    formMessages.setAttribute('role', 'alert');
    formMessages.setAttribute('aria-live', 'polite');
    
    // Scroll to message
    formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            clearFormMessages();
        }, 5000);
    }
}

/**
 * Clear form messages
 */
function clearFormMessages() {
    const formMessages = document.getElementById('form-messages');
    if (formMessages) {
        formMessages.textContent = '';
        formMessages.className = '';
        formMessages.removeAttribute('role');
    }
}

/**
 * Initialize FAQ accordion functionality
 */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = document.getElementById(this.getAttribute('aria-controls'));
            
            // Close all other FAQ items (optional - remove if you want multiple open)
            // faqQuestions.forEach(q => {
            //     if (q !== this) {
            //         q.setAttribute('aria-expanded', 'false');
            //         const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
            //         if (otherAnswer) {
            //             otherAnswer.style.maxHeight = '0';
            //         }
            //     }
            // });
            
            // Toggle current item
            this.setAttribute('aria-expanded', !isExpanded);
            
            // CSS handles the transition via aria-expanded attribute
            // No need for manual max-height manipulation
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}
