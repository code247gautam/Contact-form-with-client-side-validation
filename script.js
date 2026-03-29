// ===== UTILITY FUNCTIONS =====

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Toast notification system
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.success}</span>
        <span class="toast-message">${sanitizeInput(message)}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    toastContainer.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ===== LOCALSTORAGE MANAGEMENT =====

// Get all contacts from LocalStorage
function getContacts() {
    try {
        const contacts = localStorage.getItem('contacts');
        return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

// Save contacts to LocalStorage
function saveContacts(contacts) {
    try {
        localStorage.setItem('contacts', JSON.stringify(contacts));
        // Trigger storage event for cross-tab sync
        window.dispatchEvent(new Event('contactsUpdated'));
        return true;
    } catch (error) {
        console.error('Error saving contacts:', error);
        showToast('Failed to save data', 'error');
        return false;
    }
}

// Add new contact
function addContact(contact) {
    const contacts = getContacts();
    contacts.push(contact);
    return saveContacts(contacts);
}

// Update contact by index
function updateContact(index, updatedContact) {
    const contacts = getContacts();
    if (index >= 0 && index < contacts.length) {
        contacts[index] = updatedContact;
        return saveContacts(contacts);
    }
    return false;
}

// Delete contact by index
function deleteContact(index) {
    const contacts = getContacts();
    if (index >= 0 && index < contacts.length) {
        contacts.splice(index, 1);
        return saveContacts(contacts);
    }
    return false;
}

// ===== DARK MODE =====

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle .icon');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun icon';
        } else {
            icon.className = 'fas fa-moon icon';
        }
    }
}

// Initialize dark mode on page load
initDarkMode();

// ===== CONTACT FORM LOGIC =====

if (document.getElementById('contactForm')) {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const charCount = document.getElementById('charCount');
    const draftNotice = document.getElementById('draftNotice');
    
    let isSubmitting = false;
    let lastSubmitTime = 0;
    
    // Validation state
    const validationState = {
        name: false,
        email: false,
        message: false
    };
    
    // Restore draft on load
    function restoreDraft() {
        const draft = localStorage.getItem('contactDraft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                nameInput.value = data.name || '';
                emailInput.value = data.email || '';
                messageInput.value = data.message || '';
                
                // Trigger validation
                validateName();
                validateEmail();
                validateMessage();
                
                if (data.name || data.email || data.message) {
                    draftNotice.style.display = 'block';
                    setTimeout(() => {
                        draftNotice.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error restoring draft:', error);
            }
        }
    }
    
    // Save draft
    function saveDraft() {
        const draft = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        localStorage.setItem('contactDraft', JSON.stringify(draft));
    }
    
    // Clear draft
    function clearDraft() {
        localStorage.removeItem('contactDraft');
    }

    // Validation functions
    function validateName() {
        const value = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');
        
        if (value === '') {
            nameInput.classList.add('error');
            nameInput.classList.remove('valid');
            errorElement.textContent = 'Name is required';
            validationState.name = false;
        } else {
            nameInput.classList.remove('error');
            nameInput.classList.add('valid');
            errorElement.textContent = '';
            validationState.name = true;
        }
        
        updateSubmitButton();
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        
        if (value === '') {
            emailInput.classList.add('error');
            emailInput.classList.remove('valid');
            errorElement.textContent = 'Email is required';
            validationState.email = false;
        } else if (!isValidEmail(value)) {
            emailInput.classList.add('error');
            emailInput.classList.remove('valid');
            errorElement.textContent = 'Please enter a valid email address';
            validationState.email = false;
        } else {
            emailInput.classList.remove('error');
            emailInput.classList.add('valid');
            errorElement.textContent = '';
            validationState.email = true;
        }
        
        updateSubmitButton();
    }
    
    function validateMessage() {
        const value = messageInput.value.trim();
        const errorElement = document.getElementById('messageError');
        const length = value.length;
        
        charCount.textContent = `${length} / 10`;
        
        if (value === '') {
            messageInput.classList.add('error');
            messageInput.classList.remove('valid');
            errorElement.textContent = 'Message is required';
            validationState.message = false;
        } else if (length < 10) {
            messageInput.classList.add('error');
            messageInput.classList.remove('valid');
            errorElement.textContent = `Message must be at least 10 characters (${10 - length} more needed)`;
            validationState.message = false;
        } else {
            messageInput.classList.remove('error');
            messageInput.classList.add('valid');
            errorElement.textContent = '';
            validationState.message = true;
        }
        
        updateSubmitButton();
    }
    
    function updateSubmitButton() {
        const isValid = validationState.name && validationState.email && validationState.message;
        submitBtn.disabled = !isValid || isSubmitting;
    }

    // Event listeners for real-time validation
    nameInput.addEventListener('input', () => {
        validateName();
        saveDraft();
    });
    
    nameInput.addEventListener('blur', validateName);
    
    emailInput.addEventListener('input', () => {
        validateEmail();
        saveDraft();
    });
    
    emailInput.addEventListener('blur', validateEmail);
    
    messageInput.addEventListener('input', () => {
        validateMessage();
        saveDraft();
    });
    
    messageInput.addEventListener('blur', validateMessage);
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prevent duplicate rapid submissions
        const now = Date.now();
        if (now - lastSubmitTime < 2000) {
            showToast('Please wait before submitting again', 'warning');
            return;
        }
        
        // Final validation
        validateName();
        validateEmail();
        validateMessage();
        
        if (!validationState.name || !validationState.email || !validationState.message) {
            showToast('Please fix all errors before submitting', 'error');
            return;
        }
        
        // Show loading state
        isSubmitting = true;
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        const spinner = submitBtn.querySelector('.spinner');
        btnText.textContent = 'Submitting...';
        if (btnIcon) btnIcon.style.display = 'none';
        spinner.style.display = 'inline-block';
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create contact object
        const contact = {
            name: sanitizeInput(nameInput.value.trim()),
            email: sanitizeInput(emailInput.value.trim()),
            message: sanitizeInput(messageInput.value.trim()),
            timestamp: new Date().toISOString()
        };
        
        // Save to LocalStorage
        if (addContact(contact)) {
            showToast('Message sent successfully!', 'success');
            
            // Clear form
            form.reset();
            nameInput.classList.remove('valid', 'error');
            emailInput.classList.remove('valid', 'error');
            messageInput.classList.remove('valid', 'error');
            charCount.textContent = '0 / 10';
            
            // Clear draft
            clearDraft();
            
            // Reset validation state
            validationState.name = false;
            validationState.email = false;
            validationState.message = false;
            
            lastSubmitTime = now;
        } else {
            showToast('Failed to send message. Please try again.', 'error');
        }
        
        // Reset button state
        isSubmitting = false;
        btnText.textContent = 'Submit';
        if (btnIcon) btnIcon.style.display = 'inline-block';
        spinner.style.display = 'none';
        updateSubmitButton();
    });
    
    // Restore draft on page load
    restoreDraft();
}

// ===== SUBMISSIONS PAGE LOGIC =====

if (document.getElementById('submissionsContainer')) {
    const submissionsContainer = document.getElementById('submissionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const totalCount = document.getElementById('totalCount');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    let allContacts = [];
    let filteredContacts = [];
    let displayedCount = 0;
    const itemsPerPage = 6;
    
    // Load and display submissions
    function loadSubmissions() {
        allContacts = getContacts();
        filteredContacts = [...allContacts];
        displayedCount = 0;
        
        applyFiltersAndSort();
    }
    
    function applyFiltersAndSort() {
        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredContacts = allContacts.filter(contact => 
                contact.name.toLowerCase().includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredContacts = [...allContacts];
        }
        
        // Apply sorting
        const sortValue = sortSelect.value;
        if (sortValue === 'latest') {
            filteredContacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else if (sortValue === 'oldest') {
            filteredContacts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        } else if (sortValue === 'name') {
            filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        // Reset display
        displayedCount = 0;
        submissionsContainer.innerHTML = '';
        
        // Update UI
        updateTotalCount();
        displaySubmissions();
    }
    
    function displaySubmissions() {
        const start = displayedCount;
        const end = Math.min(start + itemsPerPage, filteredContacts.length);
        
        if (filteredContacts.length === 0) {
            emptyState.style.display = 'block';
            loadMoreContainer.style.display = 'none';
            return;
        }
        
        emptyState.style.display = 'none';
        
        for (let i = start; i < end; i++) {
            const contact = filteredContacts[i];
            const originalIndex = allContacts.findIndex(c => 
                c.timestamp === contact.timestamp && 
                c.email === contact.email
            );
            
            const card = createSubmissionCard(contact, originalIndex);
            submissionsContainer.appendChild(card);
        }
        
        displayedCount = end;
        
        // Show/hide load more button
        if (displayedCount < filteredContacts.length) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    function createSubmissionCard(contact, index) {
        const card = document.createElement('div');
        card.className = 'submission-card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-name"><i class="fas fa-user"></i> ${contact.name}</div>
                    <div class="card-email"><i class="fas fa-envelope"></i> ${contact.email}</div>
                </div>
                <div class="card-timestamp"><i class="far fa-clock"></i> ${formatTimestamp(contact.timestamp)}</div>
            </div>
            <div class="card-message"><i class="fas fa-comment-dots"></i> ${contact.message}</div>
            <div class="card-actions">
                <button class="btn btn-small btn-secondary edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger delete-btn" data-index="${index}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;
        
        // Add event listeners
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => openEditModal(index));
        deleteBtn.addEventListener('click', () => handleDelete(index));
        
        return card;
    }
    
    function updateTotalCount() {
        const count = filteredContacts.length;
        totalCount.textContent = `${count} submission${count !== 1 ? 's' : ''}`;
    }
    
    function handleDelete(index) {
        if (confirm('Are you sure you want to delete this submission?')) {
            if (deleteContact(index)) {
                showToast('Submission deleted successfully', 'success');
                loadSubmissions();
            } else {
                showToast('Failed to delete submission', 'error');
            }
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', applyFiltersAndSort);
    sortSelect.addEventListener('change', applyFiltersAndSort);
    loadMoreBtn.addEventListener('click', displaySubmissions);
    
    // Listen for storage events (cross-tab sync)
    window.addEventListener('storage', (e) => {
        if (e.key === 'contacts') {
            loadSubmissions();
        }
    });
    
    // Listen for custom contacts updated event
    window.addEventListener('contactsUpdated', loadSubmissions);
    
    // Initial load
    loadSubmissions();
}

// ===== EDIT MODAL LOGIC =====

if (document.getElementById('editModal')) {
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editNameInput = document.getElementById('editName');
    const editEmailInput = document.getElementById('editEmail');
    const editMessageInput = document.getElementById('editMessage');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelEditBtn = document.getElementById('cancelEdit');
    
    let currentEditIndex = -1;
    
    const editValidationState = {
        name: false,
        email: false,
        message: false
    };
    
    window.openEditModal = function(index) {
        const contacts = getContacts();
        if (index < 0 || index >= contacts.length) return;
        
        const contact = contacts[index];
        currentEditIndex = index;
        
        editNameInput.value = contact.name;
        editEmailInput.value = contact.email;
        editMessageInput.value = contact.message;
        
        // Reset validation
        editNameInput.classList.remove('error', 'valid');
        editEmailInput.classList.remove('error', 'valid');
        editMessageInput.classList.remove('error', 'valid');
        document.getElementById('editNameError').textContent = '';
        document.getElementById('editEmailError').textContent = '';
        document.getElementById('editMessageError').textContent = '';
        
        editValidationState.name = true;
        editValidationState.email = true;
        editValidationState.message = true;
        
        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    function closeEditModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
        currentEditIndex = -1;
    }
    
    function validateEditName() {
        const value = editNameInput.value.trim();
        const errorElement = document.getElementById('editNameError');
        
        if (value === '') {
            editNameInput.classList.add('error');
            editNameInput.classList.remove('valid');
            errorElement.textContent = 'Name is required';
            editValidationState.name = false;
        } else {
            editNameInput.classList.remove('error');
            editNameInput.classList.add('valid');
            errorElement.textContent = '';
            editValidationState.name = true;
        }
    }
    
    function validateEditEmail() {
        const value = editEmailInput.value.trim();
        const errorElement = document.getElementById('editEmailError');
        
        if (value === '') {
            editEmailInput.classList.add('error');
            editEmailInput.classList.remove('valid');
            errorElement.textContent = 'Email is required';
            editValidationState.email = false;
        } else if (!isValidEmail(value)) {
            editEmailInput.classList.add('error');
            editEmailInput.classList.remove('valid');
            errorElement.textContent = 'Please enter a valid email address';
            editValidationState.email = false;
        } else {
            editEmailInput.classList.remove('error');
            editEmailInput.classList.add('valid');
            errorElement.textContent = '';
            editValidationState.email = true;
        }
    }

    function validateEditMessage() {
        const value = editMessageInput.value.trim();
        const errorElement = document.getElementById('editMessageError');
        
        if (value === '') {
            editMessageInput.classList.add('error');
            editMessageInput.classList.remove('valid');
            errorElement.textContent = 'Message is required';
            editValidationState.message = false;
        } else if (value.length < 10) {
            editMessageInput.classList.add('error');
            editMessageInput.classList.remove('valid');
            errorElement.textContent = `Message must be at least 10 characters`;
            editValidationState.message = false;
        } else {
            editMessageInput.classList.remove('error');
            editMessageInput.classList.add('valid');
            errorElement.textContent = '';
            editValidationState.message = true;
        }
    }
    
    // Event listeners for edit form
    editNameInput.addEventListener('input', validateEditName);
    editNameInput.addEventListener('blur', validateEditName);
    editEmailInput.addEventListener('input', validateEditEmail);
    editEmailInput.addEventListener('blur', validateEditEmail);
    editMessageInput.addEventListener('input', validateEditMessage);
    editMessageInput.addEventListener('blur', validateEditMessage);
    
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editModal.classList.contains('active')) {
            closeEditModal();
        }
    });
    
    // Handle edit form submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        validateEditName();
        validateEditEmail();
        validateEditMessage();
        
        if (!editValidationState.name || !editValidationState.email || !editValidationState.message) {
            showToast('Please fix all errors before saving', 'error');
            return;
        }
        
        const contacts = getContacts();
        const originalContact = contacts[currentEditIndex];
        
        const updatedContact = {
            name: sanitizeInput(editNameInput.value.trim()),
            email: sanitizeInput(editEmailInput.value.trim()),
            message: sanitizeInput(editMessageInput.value.trim()),
            timestamp: originalContact.timestamp // Keep original timestamp
        };
        
        if (updateContact(currentEditIndex, updatedContact)) {
            showToast('Submission updated successfully', 'success');
            closeEditModal();
            
            // Reload submissions if on submissions page
            if (document.getElementById('submissionsContainer')) {
                const loadSubmissions = window.loadSubmissions;
                if (typeof loadSubmissions === 'function') {
                    loadSubmissions();
                } else {
                    location.reload();
                }
            }
        } else {
            showToast('Failed to update submission', 'error');
        }
    });
}
