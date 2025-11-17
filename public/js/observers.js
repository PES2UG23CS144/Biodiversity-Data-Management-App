// API Base URL
const API_URL = 'http://localhost:3000/api';

// Modal functions
function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Observer';
    document.getElementById('observerId').disabled = false;
    document.getElementById('observerForm').reset();
    document.getElementById('observerModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('observerModal').style.display = 'none';
}

// Get seniority label
function getSeniorityLabel(level) {
    if (!level || level < 2) return 'Novice';
    if (level < 5) return 'Intermediate';
    if (level < 10) return 'Advanced';
    return 'Expert';
}

// Load observers
async function loadObservers() {
    const tbody = document.querySelector('#observersTable tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading observers...</td></tr>';
    
    try {
        console.log('Fetching observers from:', `${API_URL}/observers`);
        
        const response = await fetch(`${API_URL}/observers`);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load observers');
        }
        
        const observers = data.data;
        tbody.innerHTML = '';
        
        if (!observers || observers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No observers found</td></tr>';
            return;
        }
        
        observers.forEach(obs => {
            const seniority = getSeniorityLabel(obs.ExperienceLevel);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${obs.ObserverId}</td>
                <td><strong>${obs.Name || '-'}</strong></td>
                <td>${obs.Contact || '-'}</td>
                <td>${obs.Affiliation || '-'}</td>
                <td>${obs.ExperienceLevel || 0}</td>
                <td><span class="status-badge status-LC">${seniority}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="editObserver(${obs.ObserverId})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteObserver(${obs.ObserverId})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        console.log('Observers loaded successfully');
    } catch (error) {
        console.error('Error loading observers:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red; padding:2rem;">Error: ${error.message}</td></tr>`;
    }
}

// Edit observer
async function editObserver(id) {
    try {
        console.log('Editing observer:', id);
        const response = await fetch(`${API_URL}/observers/${id}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load observer');
        }
        
        const obs = data.data;
        document.getElementById('modalTitle').textContent = 'Edit Observer';
        document.getElementById('observerId').value = obs.ObserverId;
        document.getElementById('observerId').disabled = true;
        document.getElementById('name').value = obs.Name || '';
        document.getElementById('contact').value = obs.Contact || '';
        document.getElementById('affiliation').value = obs.Affiliation || '';
        document.getElementById('experienceLevel').value = obs.ExperienceLevel || 0;
        
        document.getElementById('observerModal').style.display = 'block';
    } catch (error) {
        console.error('Error editing observer:', error);
        alert('Error: ' + error.message);
    }
}

// Save observer
async function saveObserver(event) {
    event.preventDefault();
    
    const observerId = parseInt(document.getElementById('observerId').value);
    const payload = {
        observerId: observerId,
        name: document.getElementById('name').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        affiliation: document.getElementById('affiliation').value.trim(),
        experienceLevel: parseInt(document.getElementById('experienceLevel').value)
    };
    
    try {
        const isEdit = document.getElementById('observerId').disabled;
        const url = isEdit ? `${API_URL}/observers/${observerId}` : `${API_URL}/observers`;
        const method = isEdit ? 'PUT' : 'POST';
        
        console.log('Saving observer:', method, url, payload);
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to save observer');
        }
        
        alert(isEdit ? 'Observer updated!' : 'Observer created!');
        closeModal();
        await loadObservers();
    } catch (error) {
        console.error('Error saving observer:', error);
        alert('Error: ' + error.message);
    }
}

// Delete observer
async function deleteObserver(id) {
    if (!confirm(`Delete observer ${id}? This will also delete their observations.`)) {
        return;
    }
    
    try {
        console.log('Deleting observer:', id);
        const response = await fetch(`${API_URL}/observers/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to delete observer');
        }
        
        alert('Observer deleted successfully!');
        await loadObservers();
    } catch (error) {
        console.error('Error deleting observer:', error);
        alert('Error: ' + error.message);
    }
}

// Close modal on outside click
window.addEventListener('click', (event) => {
    if (event.target.id === 'observerModal') {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Observers page initialized');
    loadObservers();
});
