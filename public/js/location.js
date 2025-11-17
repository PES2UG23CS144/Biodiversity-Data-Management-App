const API_URL_LOC = 'http://localhost:3000/api';

async function apiGet(p) {
    const res = await fetch(`${API_URL_LOC}${p}`);
    const j = await res.json();
    if (!j.success) throw new Error(j.error || 'Request failed');
    return j.data;
}

async function apiSend(p, method, body) {
    const res = await fetch(`${API_URL_LOC}${p}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const j = await res.json();
    if (!j.success) throw new Error(j.error || 'Request failed');
    return j.data;
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Location';
    document.getElementById('locationId').disabled = false;
    document.getElementById('locationForm').reset();
    document.getElementById('locationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('locationModal').style.display = 'none';
}

async function loadLocations() {
    const tbody = document.querySelector('#locationsTable tbody');
    tbody.innerHTML = `<tr><td colspan="6" class="loading">Loading...</td></tr>`;
    try {
        const rows = await apiGet('/locations');
        tbody.innerHTML = '';
        rows.forEach(l => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${l.LocationId}</td>
                <td>${l.Country}</td>
                <td>${l.Region}</td>
                <td>${l.Latitude}, ${l.Longitude}</td>
                <td>${l.EcosystemType}</td>
                <td>
                    <button class="btn btn-primary" onclick='editLocation(${l.LocationId})'>Edit</button>
                    <button class="btn btn-danger" onclick='deleteLocation(${l.LocationId})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="6" class="loading">Error: ${e.message}</td></tr>`;
    }
}

async function editLocation(id) {
    try {
        const l = await apiGet(`/locations/${id}`);
        document.getElementById('modalTitle').textContent = 'Edit Location';
        document.getElementById('locationId').value = l.LocationId;
        document.getElementById('locationId').disabled = true;
        document.getElementById('country').value = l.Country || '';
        document.getElementById('region').value = l.Region || '';
        document.getElementById('latitude').value = l.Latitude;
        document.getElementById('longitude').value = l.Longitude;
        document.getElementById('ecosystemType').value = l.EcosystemType || '';
        document.getElementById('locationModal').style.display = 'block';
    } catch (e) {
        alert(e.message);
    }
}

async function saveLocation(ev) {
    ev.preventDefault();
    const payload = {
        locationId: parseInt(document.getElementById('locationId').value),
        country: document.getElementById('country').value.trim(),
        region: document.getElementById('region').value.trim(),
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        ecosystemType: document.getElementById('ecosystemType').value.trim()
    };
    try {
        if (document.getElementById('locationId').disabled) {
            await apiSend(`/locations/${payload.locationId}`, 'PUT', payload);
        } else {
            await apiSend('/locations', 'POST', payload);
        }
        closeModal();
        await loadLocations();
    } catch (e) {
        alert(e.message);
    }
}

async function deleteLocation(id) {
    if (!confirm(`Delete location ${id}?`)) return;
    try {
        await apiSend(`/locations/${id}`, 'DELETE');
        await loadLocations();
    } catch (e) {
        alert(e.message);
    }
}

window.addEventListener('click', (e) => {
    if (e.target.id === 'locationModal') closeModal();
});

document.addEventListener('DOMContentLoaded', loadLocations);
