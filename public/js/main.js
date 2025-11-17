// API Base URL
const API_URL = 'http://localhost:3000/api';

// Utility function to fetch data
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error || 'Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(error.message);
        return null;
    }
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    alert(`Error: ${message}`);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        // Fetch all data
        const [species, observations, locations, actions, dashboardStats] = await Promise.all([
            fetchData('/species'),
            fetchData('/observations'),
            fetchData('/locations'),
            fetchData('/actions'),
            fetchData('/dashboard/stats')
        ]);

        // Update counts
        document.getElementById('speciesCount').textContent = species ? species.length : 0;
        document.getElementById('observationCount').textContent = observations ? observations.length : 0;
        document.getElementById('locationCount').textContent = locations ? locations.length : 0;
        document.getElementById('actionCount').textContent = actions ? actions.length : 0;

        // Load status chart
        if (dashboardStats && dashboardStats.statusCounts) {
            loadStatusChart(dashboardStats.statusCounts);
        }

        // Load recent observations
        if (dashboardStats && dashboardStats.recentObservations) {
            loadRecentObservations(dashboardStats.recentObservations);
        } else if (observations) {
            loadRecentObservations(observations.slice(0, 5));
        }

    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

// Load status chart
function loadStatusChart(statusCounts) {
    const chartDiv = document.getElementById('statusChart');
    chartDiv.innerHTML = '';

    if (!statusCounts || statusCounts.length === 0) {
        chartDiv.innerHTML = '<p class="loading">No status data available</p>';
        return;
    }

    const statusLabels = {
        'CR': 'Critically Endangered',
        'EN': 'Endangered',
        'VU': 'Vulnerable',
        'NT': 'Near Threatened',
        'LC': 'Least Concern',
        'DD': 'Data Deficient',
        'EX': 'Extinct',
        'EW': 'Extinct in Wild',
        'NE': 'Not Evaluated'
    };

    const maxCount = Math.max(...statusCounts.map(i => i.Count));

    statusCounts.forEach(item => {
        const barContainer = document.createElement('div');
        barContainer.style.marginBottom = '15px';
        
        const percentage = (item.Count / maxCount) * 100;
        
        barContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px;">
                <span class="status-badge status-${item.ConservationStatus}" style="min-width: 50px; text-align: center;">
                    ${item.ConservationStatus}
                </span>
                <span style="flex: 1; font-weight: 500;">${statusLabels[item.ConservationStatus] || item.ConservationStatus}</span>
                <span style="font-weight: 700; color: #2c3e50;">${item.Count}</span>
            </div>
            <div style="background: #ecf0f1; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #3498db 0%, #2ecc71 100%); height: 100%; width: ${percentage}%; transition: width 0.5s; border-radius: 10px;"></div>
            </div>
        `;
        chartDiv.appendChild(barContainer);
    });
}

// Load recent observations
function loadRecentObservations(observations) {
    const tbody = document.querySelector('#recentObservationsTable tbody');
    tbody.innerHTML = '';

    if (!observations || observations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No observations found</td></tr>';
        return;
    }

    observations.forEach(obs => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(obs.DateTime)}</td>
            <td><strong>${obs.SpeciesName || 'Unknown'}</strong></td>
            <td>${obs.Country}, ${obs.Region}</td>
            <td>${obs.ObserverName || 'Unknown'}</td>
            <td><span style="background: #3498db; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600;">${obs.Count}</span></td>
            <td>${obs.Behavior || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize dashboard on page load
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Loading dashboard...');
        loadDashboardStats();
    });
}
