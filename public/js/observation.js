const API_BASE = 'http://localhost:3000/api';

async function jget(path) {
    const res = await fetch(`${API_BASE}${path}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
}

async function jpost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
}

function showAddModal() {
    document.getElementById('observationForm').reset();
    document.getElementById('observationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('observationModal').style.display = 'none';
}

function fmt(dt) {
    return new Date(dt).toLocaleString();
}

async function loadLookups() {
    const [observers, species, locations] = await Promise.all([
        jget('/observers'),
        jget('/species'),
        jget('/locations')
    ]);

    const obsSel = document.getElementById('observerId');
    const spSel = document.getElementById('speciesId');
    const locSel = document.getElementById('locationId');

    obsSel.innerHTML = '<option value="">Select Observer</option>';
    observers.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.ObserverId;
        opt.textContent = `${o.ObserverId} - ${o.Name}`;
        obsSel.appendChild(opt);
    });

    spSel.innerHTML = '<option value="">Select Species</option>';
    species.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.SpeciesId;
        opt.textContent = `${s.SpeciesId} - ${s.CommonName || s.ScientificName}`;
        spSel.appendChild(opt);
    });

    locSel.innerHTML = '<option value="">Select Location</option>';
    locations.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.LocationId;
        opt.textContent = `${l.LocationId} - ${l.Country}, ${l.Region}`;
        locSel.appendChild(opt);
    });
}

async function loadObservations() {
    const tbody = document.querySelector('#observationsTable tbody');
    tbody.innerHTML = `<tr><td colspan="8" class="loading">Loading...</td></tr>`;
    try {
        const rows = await jget('/observations');
        tbody.innerHTML = '';
        rows.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.ObserverId}</td>
                <td>${r.ObservationNo}</td>
                <td>${r.SpeciesName}</td>
                <td>${r.Country}, ${r.Region}</td>
                <td>${fmt(r.DateTime)}</td>
                <td>${r.Count}</td>
                <td>${r.Behavior || '-'}</td>
                <td>${r.Evidence || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="8" class="loading">Error: ${e.message}</td></tr>`;
    }
}

async function saveObservation(ev) {
    ev.preventDefault();
    const payload = {
        observerId: parseInt(document.getElementById('observerId').value),
        observationNo: parseInt(document.getElementById('observationNo').value),
        speciesId: parseInt(document.getElementById('speciesId').value),
        locationId: parseInt(document.getElementById('locationId').value),
        dateTime: document.getElementById('dateTime').value ? new Date(document.getElementById('dateTime').value).toISOString().slice(0, 19).replace('T', ' ') : null,
        count: parseInt(document.getElementById('count').value),
        behavior: document.getElementById('behavior').value.trim() || null,
        evidence: document.getElementById('evidence').value.trim() || null
    };
    try {
        await jpost('/observations', payload);
        closeModal();
        await loadObservations();
    } catch (e) {
        alert(e.message);
    }
}

window.addEventListener('click', (e) => {
    if (e.target.id === 'observationModal') closeModal();
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadLookups();
    await loadObservations();
});
