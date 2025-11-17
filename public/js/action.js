const API_ACT = 'http://localhost:3000/api';

async function fetchAPI(path) {
    const res = await fetch(`${API_ACT}${path}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Request failed');
    return json.data;
}

async function sendAPI(path, method, body) {
    const res = await fetch(`${API_ACT}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Request failed');
    return json.data;
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Conservation Action';
    document.getElementById('actionId').disabled = false;
    document.getElementById('actionForm').reset();
    document.getElementById('actionModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('actionModal').style.display = 'none';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN');
}

function getStatusBadge(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (start > now) {
        return '<span class="status-badge status-NT">Planned</span>';
    } else if (!end || end >= now) {
        return '<span class="status-badge status-LC">Active</span>';
    } else {
        return '<span class="status-badge status-DD">Completed</span>';
    }
}

async function loadActions() {
    const tbody = document.querySelector('#actionsTable tbody');
    tbody.innerHTML = `<tr><td colspan="8" class="loading">Loading...</td></tr>`;
    try {
        const rows = await fetchAPI('/actions');
        tbody.innerHTML = '';
        rows.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.ActionId}</td>
                <td>${a.ActionType}</td>
                <td>${formatDate(a.StartDate)}</td>
                <td>${formatDate(a.EndDate)}</td>
                <td>${a.ResponsibleOrg}</td>
                <td><strong>${a.Effectiveness}%</strong></td>
                <td>${getStatusBadge(a.StartDate, a.EndDate)}</td>
                <td>
                    <button class="btn btn-primary" onclick='editAction(${a.ActionId})'>Edit</button>
                    <button class="btn btn-danger" onclick='deleteAction(${a.ActionId})'>Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="8" class="loading">Error: ${e.message}</td></tr>`;
    }
}

async function editAction(id) {
    try {
        const a = await fetchAPI(`/actions/${id}`);
        document.getElementById('modalTitle').textContent = 'Edit Conservation Action';
        document.getElementById('actionId').value = a.ActionId;
        document.getElementById('actionId').disabled = true;
        document.getElementById('actionType').value = a.ActionType || '';
        document.getElementById('startDate').value = a.StartDate ? a.StartDate.split('T')[0] : '';
        document.getElementById('endDate').value = a.EndDate ? a.EndDate.split('T')[0] : '';
        document.getElementById('responsibleOrg').value = a.ResponsibleOrg || '';
        document.getElementById('effectiveness').value = a.Effectiveness || 0;
        document.getElementById('actionModal').style.display = 'block';
    } catch (e) {
        alert(e.message);
    }
}

async function saveAction(ev) {
    ev.preventDefault();
    const payload = {
        actionId: parseInt(document.getElementById('actionId').value),
        actionType: document.getElementById('actionType').value.trim(),
        startDate: document.getElementById('startDate').value || null,
        endDate: document.getElementById('endDate').value || null,
        responsibleOrg: document.getElementById('responsibleOrg').value.trim(),
        effectiveness: parseFloat(document.getElementById('effectiveness').value)
    };
    try {
        if (document.getElementById('actionId').disabled) {
            await sendAPI(`/actions/${payload.actionId}`, 'PUT', payload);
        } else {
            await sendAPI('/actions', 'POST', payload);
        }
        closeModal();
        await loadActions();
    } catch (e) {
        alert(e.message);
    }
}

async function deleteAction(id) {
    if (!confirm(`Delete conservation action ${id}?`)) return;
    try {
        await sendAPI(`/actions/${id}`, 'DELETE');
        await loadActions();
    } catch (e) {
        alert(e.message);
    }
}

window.addEventListener('click', (e) => {
    if (e.target.id === 'actionModal') closeModal();
});

document.addEventListener('DOMContentLoaded', loadActions);
