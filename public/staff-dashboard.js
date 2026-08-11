// Staff Dashboard Manager for Modi Medical
// Interactive drug delivery status Excel sheet editor for shop staff

class StaffDashboard {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.currentTab = 'staff-excel';
        this.currentExcelData = null;
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.setupEventListeners();
        this.loadExcelEditor();
        this.loadMedicines();
        this.loadMarketingMaterials();
    }

    setupEventListeners() {
        document.querySelectorAll('#staffDashboard .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) this.switchTab(tab);
            });
        });

        const saveBtn = document.getElementById('saveExcelBtn');
        if (saveBtn) saveBtn.onclick = () => this.saveExcelChanges();

        const resetBtn = document.getElementById('resetExcelBtn');
        if (resetBtn) resetBtn.onclick = () => this.loadExcelEditor();

        const staffSearch = document.getElementById('staffMedicineSearch');
        if (staffSearch) staffSearch.oninput = (e) => this.filterMedicines(e.target.value);
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('#staffDashboard .nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('#staffDashboard .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) activeContent.classList.add('active');
    }

    loadExcelEditor() {
        const files = getExcelFiles();
        let activeData = [];

        if (files.length > 0 && files[0].data) {
            activeData = files[0].data;
        } else {
            activeData = [
                { 'Order ID': 'ORD101', 'Shop Name': 'Bokaro Medical Hall', 'Medicine Name': 'Paracetamol 500mg', 'Quantity': 500, 'Delivery Status': 'In Transit', 'Remarks': 'Dispatched via Express' },
                { 'Order ID': 'ORD102', 'Shop Name': 'Chas Pharmacy', 'Medicine Name': 'Amoxicillin 250mg', 'Quantity': 200, 'Delivery Status': 'Delivered', 'Remarks': 'Received in Good Condition' },
                { 'Order ID': 'ORD103', 'Shop Name': 'City Care Chemist', 'Medicine Name': 'Omeprazole 20mg', 'Quantity': 300, 'Delivery Status': 'Pending', 'Remarks': 'Awaiting Route Allocation' }
            ];
        }

        this.currentExcelData = JSON.parse(JSON.stringify(activeData));
        this.renderExcelTable(this.currentExcelData);
    }

    renderExcelTable(data) {
        const container = document.getElementById('excelEditor');
        if (!container || !data || data.length === 0) {
            if (container) container.innerHTML = '<p class="text-center p-3">No delivery status data available.</p>';
            return;
        }

        const headers = Object.keys(data[0]);
        const editableColumns = ['Delivery Status', 'Remarks'];

        let html = '<table class="data-table"><thead><tr>';
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead><tbody>';

        data.forEach((row, rowIndex) => {
            html += '<tr>';
            headers.forEach(h => {
                const val = row[h] || '';
                if (editableColumns.includes(h)) {
                    html += `<td><input type="text" class="excel-cell-editable" data-row="${rowIndex}" data-col="${h}" value="${val}"></td>`;
                } else {
                    html += `<td>${val}</td>`;
                }
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    saveExcelChanges() {
        const inputs = document.querySelectorAll('#excelEditor .excel-cell-editable');
        inputs.forEach(input => {
            const r = parseInt(input.dataset.row);
            const c = input.dataset.col;
            if (this.currentExcelData[r]) {
                this.currentExcelData[r][c] = input.value;
            }
        });

        const files = getExcelFiles();
        if (files.length > 0) {
            updateExcelFile(files[0].id, { data: this.currentExcelData });
        } else {
            addExcelFile({
                filename: 'delivery_status.xlsx',
                uploaded_by: 'staff',
                data: this.currentExcelData
            });
        }

        this.showToast('Delivery Status & Remarks saved successfully!', 'success');
    }

    loadMedicines() {
        const medicines = getMedicines();
        this.renderMedicineTable(medicines);
    }

    renderMedicineTable(medicines) {
        const tbody = document.getElementById('staffMedicinesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        medicines.forEach(med => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${med.name}</strong></td>
                <td>${med.manufacturer}</td>
                <td>₹${med.mrp_price.toFixed(2)}</td>
                <td style="color:var(--accent-color); font-weight:700;">₹${med.discounted_price.toFixed(2)}</td>
                <td><span class="stock-badge ${med.stock_status}">${med.stock_status.replace('_', ' ')}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    filterMedicines(query) {
        const lower = query.toLowerCase();
        const filtered = getMedicines().filter(med => 
            med.name.toLowerCase().includes(lower) || 
            med.manufacturer.toLowerCase().includes(lower)
        );
        this.renderMedicineTable(filtered);
    }

    loadMarketingMaterials() {
        const grid = document.getElementById('staffMaterialsGrid');
        if (!grid) return;
        const materials = getMarketingMaterials();
        grid.innerHTML = '';

        materials.forEach(mat => {
            const div = document.createElement('div');
            div.className = 'card material-card';
            div.innerHTML = `
                <h4>${mat.title}</h4>
                <p style="font-size:0.8rem; color:var(--text-muted);">${mat.type.toUpperCase()}</p>
                <img src="${mat.file_path}" alt="${mat.title}" style="width:100%; height:140px; object-fit:cover; border-radius:6px;" onerror="this.src='assets/logo.jpg'">
            `;
            grid.appendChild(div);
        });
    }

    showToast(msg, type = 'info') {
        if (window.authSystem) window.authSystem.showToast(msg, type);
    }
}

let staffDashboard;
document.addEventListener('DOMContentLoaded', () => {
    staffDashboard = new StaffDashboard();
    window.staffDashboard = staffDashboard;
});