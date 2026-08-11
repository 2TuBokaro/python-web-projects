// Admin Dashboard Manager for Modi Medical

class AdminDashboard {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.currentTab = 'users';
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.setupEventListeners();
        this.loadUsers();
        this.loadMedicines();
        this.loadMarketingMaterials();
        this.loadExcelFiles();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('#adminDashboard .nav-btn').forEach(btn => {
            btn.onclick = (e) => {
                const tab = e.target.dataset.tab;
                if (tab) this.switchTab(tab);
            };
        });

        // User Management Buttons
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) addUserBtn.onclick = () => this.showUserModal();

        const closeUserModal = document.getElementById('closeUserModal');
        if (closeUserModal) closeUserModal.onclick = () => this.hideUserModal();

        const userForm = document.getElementById('userForm');
        if (userForm) userForm.onsubmit = (e) => { e.preventDefault(); this.handleUserSubmit(); };

        // Medicine Management Buttons
        const addMedicineBtn = document.getElementById('addMedicineBtn');
        if (addMedicineBtn) addMedicineBtn.onclick = () => this.showMedicineModal();

        const closeMedicineModal = document.getElementById('closeMedicineModal');
        if (closeMedicineModal) closeMedicineModal.onclick = () => this.hideMedicineModal();

        const medicineForm = document.getElementById('medicineForm');
        if (medicineForm) medicineForm.onsubmit = (e) => { e.preventDefault(); this.handleMedicineSubmit(); };

        const medicineSearch = document.getElementById('medicineSearch');
        if (medicineSearch) medicineSearch.oninput = (e) => this.filterMedicines(e.target.value);

        // Marketing Media Management Buttons (Full CRUD for Admin)
        const addMaterialBtn = document.getElementById('addMaterialBtn');
        if (addMaterialBtn) addMaterialBtn.onclick = () => this.showMaterialModal();

        const closeMaterialModal = document.getElementById('closeMaterialModal');
        if (closeMaterialModal) closeMaterialModal.onclick = () => this.hideMaterialModal();

        const materialForm = document.getElementById('materialForm');
        if (materialForm) materialForm.onsubmit = (e) => { e.preventDefault(); this.handleMaterialSubmit(); };

        const refreshFilesBtn = document.getElementById('refreshFilesBtn');
        if (refreshFilesBtn) refreshFilesBtn.onclick = () => this.refreshMarketingMaterials();

        // Excel Upload / Management
        const uploadExcelBtn = document.getElementById('uploadExcelBtn');
        if (uploadExcelBtn) uploadExcelBtn.onclick = () => this.handleExcelUploadClick();

        const excelFileInput = document.getElementById('excelFileInput');
        if (excelFileInput) excelFileInput.onchange = (e) => this.handleExcelFileUpload(e);

        // Export Data
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) exportDataBtn.onclick = () => this.exportAllData();
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('#adminDashboard .nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('#adminDashboard .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) activeContent.classList.add('active');

        // When switching to Excel tab, ensure the upload option is visible
        if (tabName === 'excel') {
            this.loadExcelFiles();
        }
    }

    // ============ USER SUPERVISION ============
    loadUsers() {
        const users = getUsers();
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${user.username}</strong></td>
                <td>${user.name}</td>
                <td>${user.shop_name || '-'}</td>
                <td>${user.phone || '-'}</td>
                <td><span class="status-badge ${user.role}">${user.role}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editUser('${user.id}')">Edit</button>
                    ${user.username !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteUser('${user.id}')">Delete</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    showUserModal(user = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        if (!modal) return;

        if (user) {
            title.textContent = 'Edit User';
            document.getElementById('userId').value = user.id;
            document.getElementById('modalUsername').value = user.username;
            document.getElementById('modalPassword').value = user.password;
            document.getElementById('modalFullName').value = user.name;
            document.getElementById('modalPhone').value = user.phone || '';
            document.getElementById('modalRole').value = user.role;
            document.getElementById('modalShopName').value = user.shop_name || '';
        } else {
            title.textContent = 'Add New User';
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
        }
        modal.classList.remove('hidden');
    }

    hideUserModal() {
        const modal = document.getElementById('userModal');
        if (modal) modal.classList.add('hidden');
    }

    handleUserSubmit() {
        const userId = document.getElementById('userId').value;
        const userData = {
            username: document.getElementById('modalUsername').value.trim(),
            password: document.getElementById('modalPassword').value.trim(),
            name: document.getElementById('modalFullName').value.trim(),
            phone: document.getElementById('modalPhone').value.trim(),
            role: document.getElementById('modalRole').value,
            shop_name: document.getElementById('modalShopName').value.trim()
        };

        if (userId) {
            updateUser(userId, userData);
            this.showToast('User updated successfully!', 'success');
        } else {
            createUser(userData);
            this.showToast('User created successfully!', 'success');
        }
        this.hideUserModal();
        this.loadUsers();
    }

    editUser(id) {
        const user = getUserById(id);
        if (user) this.showUserModal(user);
    }

    deleteUser(id) {
        if (confirm('Are you sure you want to remove this user?')) {
            deleteUser(id);
            this.loadUsers();
            this.showToast('User removed.', 'info');
        }
    }

    // ============ MEDICINE INVENTORY ============
    loadMedicines() {
        const medicines = getMedicines();
        this.renderMedicineTable(medicines);
    }

    renderMedicineTable(medicines) {
        const tbody = document.getElementById('medicinesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        medicines.forEach(med => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${med.name}</strong></td>
                <td>${med.manufacturer}</td>
                <td>${med.category}</td>
                <td>₹${med.mrp_price.toFixed(2)}</td>
                <td>₹${med.unit_price.toFixed(2)}</td>
                <td style="color: var(--accent-color); font-weight:700;">₹${med.discounted_price.toFixed(2)}</td>
                <td>${med.lot_number || '-'}<br><small>${formatDate(med.expiry_date)}</small></td>
                <td><span class="stock-badge ${med.stock_status}">${med.stock_status.replace('_', ' ')}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editMedicine('${med.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteMedicine('${med.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    filterMedicines(query) {
        const lower = query.toLowerCase();
        const filtered = getMedicines().filter(med => 
            med.name.toLowerCase().includes(lower) || 
            med.manufacturer.toLowerCase().includes(lower) ||
            med.category.toLowerCase().includes(lower)
        );
        this.renderMedicineTable(filtered);
    }

    showMedicineModal(med = null) {
        const modal = document.getElementById('medicineModal');
        const title = document.getElementById('medicineModalTitle');
        if (!modal) return;

        if (med) {
            title.textContent = 'Edit Medicine Item';
            document.getElementById('medicineId').value = med.id;
            document.getElementById('medicineName').value = med.name;
            document.getElementById('medicineManufacturer').value = med.manufacturer;
            document.getElementById('medicineCategory').value = med.category;
            document.getElementById('medicineMRP').value = med.mrp_price;
            document.getElementById('medicineUnitPrice').value = med.unit_price;
            document.getElementById('medicineDiscountedPrice').value = med.discounted_price;
            document.getElementById('medicineLotNumber').value = med.lot_number || '';
            document.getElementById('medicineManufacturingDate').value = med.manufacturing_date || '';
            document.getElementById('medicineExpiryDate').value = med.expiry_date || '';
            document.getElementById('medicineStockStatus').value = med.stock_status;
        } else {
            title.textContent = 'Add Medicine Item';
            document.getElementById('medicineForm').reset();
            document.getElementById('medicineId').value = '';
        }
        modal.classList.remove('hidden');
    }

    hideMedicineModal() {
        const modal = document.getElementById('medicineModal');
        if (modal) modal.classList.add('hidden');
    }

    handleMedicineSubmit() {
        const medId = document.getElementById('medicineId').value;
        const medData = {
            name: document.getElementById('medicineName').value.trim(),
            manufacturer: document.getElementById('medicineManufacturer').value.trim(),
            category: document.getElementById('medicineCategory').value,
            mrp_price: parseFloat(document.getElementById('medicineMRP').value) || 0,
            unit_price: parseFloat(document.getElementById('medicineUnitPrice').value) || 0,
            discounted_price: parseFloat(document.getElementById('medicineDiscountedPrice').value) || 0,
            lot_number: document.getElementById('medicineLotNumber').value.trim(),
            manufacturing_date: document.getElementById('medicineManufacturingDate').value,
            expiry_date: document.getElementById('medicineExpiryDate').value,
            stock_status: document.getElementById('medicineStockStatus').value
        };

        if (medId) {
            updateMedicine(medId, medData);
            this.showToast('Medicine updated.', 'success');
        } else {
            createMedicine(medData);
            this.showToast('Medicine added to inventory.', 'success');
        }
        this.hideMedicineModal();
        this.loadMedicines();
    }

    editMedicine(id) {
        const med = getMedicineById(id);
        if (med) this.showMedicineModal(med);
    }

    deleteMedicine(id) {
        if (confirm('Delete this medicine item?')) {
            deleteMedicine(id);
            this.loadMedicines();
            this.showToast('Medicine deleted.', 'info');
        }
    }

    // ============ PROMOTIONAL MEDIA MANAGEMENT (ADMIN CRUD) ============
    loadMarketingMaterials() {
        const grid = document.getElementById('materialsGrid');
        if (!grid) return;
        const materials = getMarketingMaterials();
        grid.innerHTML = '';

        if (materials.length === 0) {
            grid.innerHTML = '<p class="text-center">No promotional media loaded.</p>';
            return;
        }

        materials.forEach(mat => {
            const div = document.createElement('div');
            div.className = 'card material-card';

            // Normalize file path for display
            let displayPath = mat.file_path ? mat.file_path.replace(/\\/g, '/') : '';
            
            let mediaPreview = '';
            if (mat.type === 'video') {
                mediaPreview = `
                    <video controls muted autoplay loop style="width:100%; height:160px; object-fit:cover; border-radius:8px;">
                        <source src="${displayPath}" type="video/mp4">
                    </video>
                `;
            } else {
                mediaPreview = `
                    <img src="${displayPath}" alt="${mat.title}" style="width:100%; height:160px; object-fit:cover; border-radius:8px;" onerror="this.src='assets/logo.jpg'">
                `;
            }

            div.innerHTML = `
                ${mediaPreview}
                <div style="margin-top:10px;">
                    <h4 style="font-size:1.1rem; color:var(--primary-color);">${mat.title}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">${mat.type.toUpperCase()} • ${mat.category.toUpperCase()} ${mat.is_featured ? '⭐ Featured' : ''}</p>
                    <p style="font-size:0.7rem; color:var(--text-secondary); margin-top:4px;">${displayPath}</p>
                    <div style="display:flex; gap:8px; margin-top:10px;">
                        <button class="btn btn-sm btn-secondary" onclick="adminDashboard.editMaterial('${mat.id}')">✏️ Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="adminDashboard.deleteMaterial('${mat.id}')">🗑️ Delete</button>
                    </div>
                </div>
            `;
            grid.appendChild(div);
        });

        if (window.modiMedicalApp) window.modiMedicalApp.loadHomeMaterials();
    }

    showMaterialModal(mat = null) {
        const modal = document.getElementById('materialModal');
        const title = document.getElementById('materialModalTitle');
        if (!modal) return;

        if (mat) {
            title.textContent = 'Edit Promotional Media';
            document.getElementById('materialId').value = mat.id;
            document.getElementById('materialTitle').value = mat.title;
            document.getElementById('materialType').value = mat.type;
            // Normalize file path for display
            const normalizedPath = mat.file_path ? mat.file_path.replace(/\\/g, '/') : '';
            document.getElementById('materialPath').value = normalizedPath;
            document.getElementById('materialCategory').value = mat.category;
            document.getElementById('materialFeatured').checked = !!mat.is_featured;
        } else {
            title.textContent = 'Add Promotional Media';
            document.getElementById('materialForm').reset();
            document.getElementById('materialId').value = '';
        }
        modal.classList.remove('hidden');
    }

    hideMaterialModal() {
        const modal = document.getElementById('materialModal');
        if (modal) modal.classList.add('hidden');
    }

    handleMaterialSubmit() {
        const matId = document.getElementById('materialId').value;
        let filePath = document.getElementById('materialPath').value.trim();
        
        // Normalize file path - ensure it uses forward slashes and is relative
        filePath = filePath.replace(/\\/g, '/');
        if (!filePath.startsWith('assets/') && !filePath.startsWith('http')) {
            filePath = 'assets/' + filePath;
        }
        
        const matData = {
            title: document.getElementById('materialTitle').value.trim(),
            type: document.getElementById('materialType').value,
            file_path: filePath,
            category: document.getElementById('materialCategory').value,
            is_featured: document.getElementById('materialFeatured').checked
        };

        if (matId) {
            updateMarketingMaterial(matId, matData);
            this.showToast('Promotional media updated!', 'success');
        } else {
            addMarketingMaterial(matData);
            this.showToast('Promotional media added!', 'success');
        }
        this.hideMaterialModal();
        this.loadMarketingMaterials();
    }

    editMaterial(id) {
        const mat = getMarketingMaterialById(id);
        if (mat) this.showMaterialModal(mat);
    }

    deleteMaterial(id) {
        if (confirm('Are you sure you want to delete this promotional media item?')) {
            deleteMarketingMaterial(id);
            this.loadMarketingMaterials();
            this.showToast('Promotional media deleted.', 'info');
        }
    }

    async refreshMarketingMaterials() {
        try {
            // Use FileManager to actually scan and refresh from directory
            if (typeof fileManager !== 'undefined' && fileManager.refreshMarketingMaterials) {
                await fileManager.refreshMarketingMaterials();
                this.loadMarketingMaterials();
                this.showToast('Marketing materials refreshed from folder.', 'success');
            } else {
                // Fallback to localStorage refresh if FileManager not available
                this.loadMarketingMaterials();
                this.showToast('Marketing materials refreshed from storage.', 'success');
            }
        } catch (error) {
            console.error('Error refreshing marketing materials:', error);
            this.showToast('Error refreshing materials. Please try again.', 'error');
        }
    }

    // ============ EXCEL FILES ============
    loadExcelFiles() {
        const list = document.getElementById('excelFilesList');
        if (!list) return;
        const files = getExcelFiles();
        list.innerHTML = '';

        if (files.length === 0) {
            list.innerHTML = '<p class="text-center">No Excel files uploaded yet.</p>';
            return;
        }

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.marginBottom = '12px';
            div.style.cursor = 'pointer';
            div.style.padding = '15px';
            div.style.border = '2px solid var(--border-color)';
            div.style.borderRadius = '8px';
            div.style.transition = 'all 0.3s ease';
            
            div.onmouseenter = () => {
                div.style.borderColor = 'var(--primary-color)';
                div.style.transform = 'translateY(-2px)';
                div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            };
            
            div.onmouseleave = () => {
                div.style.borderColor = 'var(--border-color)';
                div.style.transform = 'translateY(0)';
                div.style.boxShadow = 'none';
            };

            div.onclick = () => this.showExcelFileContent(file);

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0; color: var(--primary-color);">📊 ${file.filename}</h4>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin: 5px 0;">
                            Uploaded by: ${file.uploaded_by} | Updated: ${formatDate(file.last_updated)} | Records: ${file.data ? file.data.length : 0}
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); adminDashboard.downloadExcelFile('${file.id}')">📥 Download</button>
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); adminDashboard.showExcelFileContent(adminDashboard.getExcelFileById('${file.id}'))">👁️ View</button>
                        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); adminDashboard.deleteExcelFile('${file.id}')">🗑️ Delete</button>
                    </div>
                </div>
            `;
            list.appendChild(div);
        });
    }

    getExcelFileById(id) {
        const files = getExcelFiles();
        return files.find(f => f.id === id);
    }

    showExcelFileContent(file) {
        if (!file || !file.data) {
            this.showToast('No data available for this file.', 'error');
            return;
        }

        // Create a modal to display the Excel content
        const existingModal = document.getElementById('excelContentModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'excelContentModal';
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 12px;
            max-width: 95%;
            max-height: 95%;
            overflow: hidden;
            position: relative;
            min-width: 800px;
            display: flex;
            flex-direction: column;
        `;

        const headers = Object.keys(file.data[0] || {});
        
        let tableHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; flex-shrink: 0;">
                <h3 style="margin: 0; font-size: 1.2rem;">📊 ${file.filename}</h3>
                <button class="btn btn-sm btn-secondary" onclick="document.getElementById('excelContentModal').remove()">✕ Close</button>
            </div>
            <div id="excelTableContainer" style="overflow-x: auto; overflow-y: auto; max-height: 70vh; border: 1px solid #ddd; border-radius: 8px; width: 100%; flex-grow: 1;">
                <table class="data-table" style="font-size: 0.75rem; border-collapse: collapse; width: max-content; min-width: 100%;">
                    <thead style="position: sticky; top: 0; background: #f5f5f5; z-index: 10;">
                        <tr>
                            ${headers.map(h => `<th style="padding: 6px 10px; text-align: left; border-bottom: 2px solid #ddd; white-space: nowrap; min-width: 100px;">${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${file.data.map(row => `
                            <tr style="border-bottom: 1px solid #eee;">
                                ${headers.map(h => `<td style="padding: 4px 10px; border-bottom: 1px solid #eee; white-space: nowrap;">${row[h] !== undefined ? row[h] : ''}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-shrink: 0;">
                <p style="font-size: 0.85rem; color: #666; margin: 0;">Total Records: ${file.data.length} | Columns: ${headers.length}</p>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" onclick="adminDashboard.downloadExcelFile('${file.id}')">📥 Download ${file.filename}</button>
                    <button class="btn btn-danger" onclick="adminDashboard.deleteExcelFile('${file.id}')">🗑️ Delete File</button>
                </div>
            </div>
        `;

        modalContent.innerHTML = tableHTML;
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    downloadExcelFile(id) {
        const file = this.getExcelFileById(id);
        if (!file || !file.data) {
            this.showToast('File not found or no data available.', 'error');
            return;
        }

        try {
            // Create worksheet from data
            const worksheet = XLSX.utils.json_to_sheet(file.data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            
            // Generate and download the file
            XLSX.writeFile(workbook, file.filename);
            
            this.showToast(`File ${file.filename} downloaded successfully!`, 'success');
        } catch (error) {
            console.error('Error downloading Excel file:', error);
            this.showToast('Error downloading file.', 'error');
        }
    }

    deleteExcelFile(id) {
        if (confirm('Are you sure you want to delete this Excel file? This action cannot be undone.')) {
            try {
                const files = getExcelFiles();
                const filteredFiles = files.filter(f => f.id !== id);
                localStorage.setItem('modi_excel_files', JSON.stringify(filteredFiles));
                
                // Close the modal if it's open
                const modal = document.getElementById('excelContentModal');
                if (modal) modal.remove();
                
                // Reload the files list
                this.loadExcelFiles();
                
                this.showToast('Excel file deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting Excel file:', error);
                this.showToast('Error deleting file.', 'error');
            }
        }
    }

    handleExcelUploadClick() {
        const excelFileInput = document.getElementById('excelFileInput');
        if (excelFileInput) {
            excelFileInput.click();
        }
    }

    async handleExcelFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            
            // Read the file
            const arrayBuffer = await file.arrayBuffer();
            let data = [];

            if (fileExtension === 'csv') {
                // Parse CSV
                const text = new TextDecoder().decode(arrayBuffer);
                data = this.parseCSV(text);
            } else {
                // Parse Excel using SheetJS
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                data = XLSX.utils.sheet_to_json(worksheet);
            }

            // Add or update the Excel file in storage
            const existingFiles = getExcelFiles();
            const existingFileIndex = existingFiles.findIndex(f => f.filename === fileName);
            
            const fileData = {
                filename: fileName,
                uploaded_by: 'admin',
                data: data
            };

            if (existingFileIndex !== -1) {
                updateExcelFile(existingFiles[existingFileIndex].id, fileData);
                this.showToast(`Excel file ${fileName} updated successfully!`, 'success');
            } else {
                addExcelFile(fileData);
                this.showToast(`Excel file ${fileName} uploaded successfully!`, 'success');
            }

            this.loadExcelFiles();
            
            // Clear the file input
            event.target.value = '';

        } catch (error) {
            console.error('Error uploading Excel file:', error);
            this.showToast('Error uploading file. Please check the file format.', 'error');
        }
    }

    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        
        return data;
    }

    exportAllData() {
        const data = {
            users: getUsers(),
            medicines: getMedicines(),
            marketing_materials: getMarketingMaterials(),
            excel_files: getExcelFiles(),
            exported_at: new Date().toISOString()
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Modi_Medical_Data_Backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('All data exported successfully!', 'success');
    }

    showToast(msg, type = 'info') {
        if (window.authSystem) window.authSystem.showToast(msg, type);
    }
}

let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    window.adminDashboard = adminDashboard;
});