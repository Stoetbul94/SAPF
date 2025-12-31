/**
 * DEMO MODE — Admin Demo JavaScript
 * This file handles the admin demo form for simulating content uploads.
 * Replace with Firebase Firestore after client approval.
 */

document.addEventListener('DOMContentLoaded', function() {
    initAdminForm();
    loadDocumentsForSelection();
});

/**
 * Initialize admin form
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
function initAdminForm() {
    const contentTypeSelect = document.getElementById('content-type');
    const form = document.getElementById('admin-form');
    
    // Show/hide conditional fields based on content type
    contentTypeSelect.addEventListener('change', function() {
        const contentType = this.value;
        
        // Hide all conditional fields and remove required attributes
        const eventFields = document.getElementById('event-fields');
        const resultFields = document.getElementById('result-fields');
        const entryFormFields = document.getElementById('entry-form-fields');
        
        eventFields.classList.remove('show');
        resultFields.classList.remove('show');
        entryFormFields.classList.remove('show');
        
        // Remove required attributes from hidden fields
        eventFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));
        resultFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));
        entryFormFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));
        
        // Show relevant fields and add required attributes back
        if (contentType === 'event') {
            eventFields.classList.add('show');
            document.getElementById('event-title').setAttribute('required', '');
            document.getElementById('event-location').setAttribute('required', '');
            document.getElementById('event-date').setAttribute('required', '');
            document.getElementById('event-discipline').setAttribute('required', '');
            document.getElementById('event-status').setAttribute('required', '');
        } else if (contentType === 'result') {
            resultFields.classList.add('show');
            document.getElementById('result-event').setAttribute('required', '');
            document.getElementById('result-date').setAttribute('required', '');
            document.getElementById('result-discipline').setAttribute('required', '');
            document.getElementById('result-type').setAttribute('required', '');
            document.getElementById('result-pdf').setAttribute('required', '');
        } else if (contentType === 'entry-form') {
            entryFormFields.classList.add('show');
            document.getElementById('doc-title').setAttribute('required', '');
            document.getElementById('doc-discipline').setAttribute('required', '');
            document.getElementById('doc-year').setAttribute('required', '');
            document.getElementById('doc-pdf').setAttribute('required', '');
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Load documents for PDF selection dropdowns
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
async function loadDocumentsForSelection() {
    try {
        const response = await fetch('data/documents.json');
        const data = await response.json();
        const documents = data.documents || [];
        
        // Get all PDF selects
        const pdfSelects = [
            document.getElementById('event-entry-form'),
            document.getElementById('result-pdf'),
            document.getElementById('doc-pdf')
        ];
        
        pdfSelects.forEach(select => {
            if (!select) return;
            
            // Add documents to dropdown
            documents.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.url;
                option.textContent = `${doc.title} (${doc.url})`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error loading documents for selection:', error);
    }
}

/**
 * Load current data from JSON files and localStorage
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
async function loadCurrentData() {
    // Load base data from JSON files
    const eventsResponse = await fetch('data/events.json');
    const eventsJson = await eventsResponse.json();
    let currentEvents = eventsJson.events || [];
    
    const resultsResponse = await fetch('data/results.json');
    const resultsJson = await resultsResponse.json();
    let currentResults = resultsJson.results || [];
    
    const documentsResponse = await fetch('data/documents.json');
    const documentsJson = await documentsResponse.json();
    let currentDocuments = documentsJson.documents || [];
    
    // Check for demo updates in localStorage
    try {
        const eventsDemo = localStorage.getItem('sapf-demo-events');
        const resultsDemo = localStorage.getItem('sapf-demo-results');
        const documentsDemo = localStorage.getItem('sapf-demo-documents');
        
        if (eventsDemo) {
            const parsed = JSON.parse(eventsDemo);
            if (Array.isArray(parsed)) {
                currentEvents = parsed;
            }
        }
        
        if (resultsDemo) {
            const parsed = JSON.parse(resultsDemo);
            if (Array.isArray(parsed)) {
                currentResults = parsed;
            }
        }
        
        if (documentsDemo) {
            const parsed = JSON.parse(documentsDemo);
            if (Array.isArray(parsed)) {
                currentDocuments = parsed;
            }
        }
    } catch (error) {
        console.warn('Error loading demo updates:', error);
    }
    
    return { currentEvents, currentResults, currentDocuments };
}

/**
 * Handle form submission
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('message');
    const contentType = document.getElementById('content-type').value;
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    messageEl.className = 'message';
    
    try {
        // Load current data (base + any existing demo updates)
        const { currentEvents, currentResults, currentDocuments } = await loadCurrentData();
        
        let newItem;
        
        if (contentType === 'event') {
            newItem = createEventItem(currentEvents);
        } else if (contentType === 'result') {
            newItem = createResultItem(currentResults);
        } else if (contentType === 'entry-form') {
            newItem = createDocumentItem(currentDocuments);
        } else {
            throw new Error('Invalid content type');
        }
        
        // Add new item to appropriate array
        if (contentType === 'event') {
            // DEMO MODE — update in-memory data and localStorage
            const updatedEvents = [...currentEvents, newItem];
            saveDemoUpdates('events', updatedEvents);
            // Update global variable if available
            if (typeof eventsData !== 'undefined') {
                eventsData = updatedEvents;
            }
        } else if (contentType === 'result') {
            const updatedResults = [...currentResults, newItem];
            saveDemoUpdates('results', updatedResults);
            if (typeof resultsData !== 'undefined') {
                resultsData = updatedResults;
            }
        } else if (contentType === 'entry-form') {
            const updatedDocuments = [...currentDocuments, newItem];
            saveDemoUpdates('documents', updatedDocuments);
            if (typeof documentsData !== 'undefined') {
                documentsData = updatedDocuments;
            }
        }
        
        // Show success message
        showMessage('Content added successfully! The new item will appear on relevant pages when you navigate to them.', 'success');
        
        // Reset form
        document.getElementById('admin-form').reset();
        const eventFields = document.getElementById('event-fields');
        const resultFields = document.getElementById('result-fields');
        const entryFormFields = document.getElementById('entry-form-fields');
        
        eventFields.classList.remove('show');
        resultFields.classList.remove('show');
        entryFormFields.classList.remove('show');
        
        // Remove required attributes from hidden fields
        eventFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));
        resultFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));
        entryFormFields.querySelectorAll('input, select').forEach(field => field.removeAttribute('required'));
        
        // Note: In a real implementation, you would refresh or navigate to the updated page
        // For demo purposes, we just show the success message
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage(`Error: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Content';
    }
}

/**
 * Create event item from form data
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
function createEventItem(currentEvents) {
    const title = document.getElementById('event-title').value.trim();
    const location = document.getElementById('event-location').value.trim();
    const date = document.getElementById('event-date').value;
    const discipline = document.getElementById('event-discipline').value;
    const status = document.getElementById('event-status').value;
    const entryForm = document.getElementById('event-entry-form').value || null;
    
    // Validate required fields
    if (!title || !location || !date || !discipline || !status) {
        throw new Error('Please fill in all required fields for the event');
    }
    
    // Generate next ID (get max ID from existing events)
    const maxId = currentEvents.length > 0 
        ? Math.max(...currentEvents.map(e => e.id)) 
        : 0;
    const newId = maxId + 1;
    
    // Create results link
    const resultsLink = `results.html#event-${newId}`;
    
    return {
        id: newId,
        date: date,
        title: title,
        location: location,
        discipline: discipline,
        entryForm: entryForm,
        results: resultsLink,
        status: status
    };
}

/**
 * Create result item from form data
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
function createResultItem(currentResults) {
    const event = document.getElementById('result-event').value.trim();
    const date = document.getElementById('result-date').value;
    const discipline = document.getElementById('result-discipline').value;
    const type = document.getElementById('result-type').value.trim();
    const pdf = document.getElementById('result-pdf').value;
    const nationalLog = document.getElementById('result-national-log').checked;
    
    // Validate required fields
    if (!event || !date || !discipline || !type || !pdf) {
        throw new Error('Please fill in all required fields for the result');
    }
    
    // Generate next ID
    const maxId = currentResults.length > 0 
        ? Math.max(...currentResults.map(r => r.id)) 
        : 0;
    const newId = maxId + 1;
    
    return {
        id: newId,
        event: event,
        date: date,
        discipline: discipline,
        type: type,
        pdf: pdf,
        nationalLog: nationalLog
    };
}

/**
 * Create document item from form data
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
function createDocumentItem(currentDocuments) {
    const title = document.getElementById('doc-title').value.trim();
    const discipline = document.getElementById('doc-discipline').value;
    const year = parseInt(document.getElementById('doc-year').value);
    const description = document.getElementById('doc-description').value.trim() || '';
    const url = document.getElementById('doc-pdf').value;
    
    // Validate required fields
    if (!title || !discipline || !year || !url) {
        throw new Error('Please fill in all required fields for the document');
    }
    
    // Generate next ID
    const maxId = currentDocuments.length > 0 
        ? Math.max(...currentDocuments.map(d => d.id)) 
        : 0;
    const newId = maxId + 1;
    
    // Category is always "Entry Form" for this form
    return {
        id: newId,
        title: title,
        category: 'Entry Form',
        discipline: discipline,
        year: year,
        url: url,
        description: description
    };
}

/**
 * Save demo updates to localStorage
 * DEMO MODE — replace with Firebase Firestore after client approval
 */
function saveDemoUpdates(dataType, dataArray) {
    try {
        const key = `sapf-demo-${dataType}`;
        localStorage.setItem(key, JSON.stringify(dataArray));
        
        // Also set a flag to indicate demo mode is active
        localStorage.setItem('sapf-demo-active', 'true');
    } catch (error) {
        console.error('Error saving demo updates:', error);
        throw new Error('Failed to save updates. Please check browser localStorage support.');
    }
}

/**
 * Show message to user
 */
function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageEl.className = 'message';
        }, 5000);
    }
}
