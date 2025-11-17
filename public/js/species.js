const API = 'http://localhost:3000/api';

async function fetchJSON(url, options = {}) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
}

function statusBadge(status) {
    return `<span class="status-badge status-${status}">${status}</span>`;
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Species';
    document.getElementById('speciesId').disabled = false;
    document.getElementById('speciesForm').reset();
    document.getElementById('speciesModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('speciesModal').style.display = 'none';
}

async function loadSpecies() {
    const tbody = document.querySelector('#speciesTable tbody');
    tbody.innerHTML = `<tr><td colspan="7" class="loading">Loading species...</td></tr>`;
    try {
        const rows = await fetchJSON(`${API}/species`);
        tbody.innerHTML = '';
        rows.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.SpeciesId}</td>
                <td>${s.CommonName || '-'}</td>
                <td>${s.ScientificName || '-'}</td>
                <td>${statusBadge(s.ConservationStatus || 'NE')}</td>
                <td>${s.HabitatType || '-'}</td>
                <td>${s.Diets || '-'}</td>
                <td>
                    <button class="btn btn-primary" onclick='editSpecies(${JSON.stringify(s.SpeciesId)})'>Edit</button>
                    <button class="btn btn-danger" onclick='deleteSpecies(${JSON.stringify(s.SpeciesId)})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="7" class="loading">Error: ${e.message}</td></tr>`;
    }
}

async function editSpecies(id) {
    try {
        const s = await fetchJSON(`${API}/species/${id}`);
        document.getElementById('modalTitle').textContent = 'Edit Species';
        document.getElementById('speciesId').value = s.SpeciesId;
        document.getElementById('speciesId').disabled = true;
        document.getElementById('commonName').value = s.CommonName || '';
        document.getElementById('scientificName').value = s.ScientificName || '';
        document.getElementById('conservationStatus').value = s.ConservationStatus || '';
        document.getElementById('habitatType').value = s.HabitatType || '';
        document.getElementById('speciesModal').style.display = 'block';
    } catch (e) {
        alert(e.message);
    }
}

async function saveSpecies(ev) {
    ev.preventDefault();
    const payload = {
        speciesId: parseInt(document.getElementById('speciesId').value),
        commonName: document.getElementById('commonName').value.trim(),
        scientificName: document.getElementById('scientificName').value.trim(),
        conservationStatus: document.getElementById('conservationStatus').value,
        habitatType: document.getElementById('habitatType').value.trim()
    };
    try {
        if (document.getElementById('speciesId').disabled) {
            await fetchJSON(`${API}/species/${payload.speciesId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await fetchJSON(`${API}/species`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        closeModal();
        await loadSpecies();
    } catch (e) {
        alert(e.message);
    }
}

async function deleteSpecies(id) {
    if (!confirm(`Delete species ${id}? This will cascade related rows.`)) return;
    try {
        await fetchJSON(`${API}/species/${id}`, { method: 'DELETE' });
        await loadSpecies();
    } catch (e) {
        alert(e.message);
    }
}

window.addEventListener('click', (e) => {
    if (e.target.id === 'speciesModal') closeModal();
});

document.addEventListener('DOMContentLoaded', loadSpecies);
