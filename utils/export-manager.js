// Export Manager Utility for Modi Medical
// Handles data export, backup, and import functionality

class ExportManager {
    constructor() {
        this.exportFormats = ['json', 'csv', 'xlsx'];
    }

    // Export all application data
    exportAllData(format = 'json') {
        const data = {
            version: '1.0.0',
            exported_at: new Date().toISOString(),
            users: getUsers(),
            medicines: getMedicines(),
            marketing_materials: getMarketingMaterials(),
            excel_files: getExcelFiles(),
            settings: getSettings(),
            delivery_status: JSON.parse(localStorage.getItem('modi_delivery_status_current') || 'null')
        };

        switch (format.toLowerCase()) {
            case 'json':
                return this.exportAsJSON(data);
            case 'csv':
                return this.exportAsCSV(data);
            case 'xlsx':
                return this.exportAsExcel(data);
            default:
                return this.exportAsJSON(data);
        }
    }

    // Export as JSON
    exportAsJSON(data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            this.downloadFile(url, `modi_medical_backup_${this.getTimestamp()}.json`);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('JSON export error:', error);
            return false;
        }
    }

    // Export as CSV
    exportAsCSV(data) {
        try {
            // Export each collection as separate CSV
            const collections = {
                users: data.users,
                medicines: data.medicines,
                marketing_materials: data.marketing_materials
            };

            for (const [collectionName, collectionData] of Object.entries(collections)) {
                if (collectionData && collectionData.length > 0) {
                    const csvContent = this.convertToCSV(collectionData);
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    
                    this.downloadFile(url, `modi_medical_${collectionName}_${this.getTimestamp()}.csv`);
                    URL.revokeObjectURL(url);
                }
            }

            return true;
        } catch (error) {
            console.error('CSV export error:', error);
            return false;
        }
    }

    // Export as Excel
    exportAsExcel(data) {
        try {
            if (typeof XLSX === 'undefined') {
                console.error('SheetJS library not loaded');
                return false;
            }

            const workbook = XLSX.utils.book_new();

            // Add users sheet
            if (data.users && data.users.length > 0) {
                const usersSheet = XLSX.utils.json_to_sheet(data.users);
                XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');
            }

            // Add medicines sheet
            if (data.medicines && data.medicines.length > 0) {
                const medicinesSheet = XLSX.utils.json_to_sheet(data.medicines);
                XLSX.utils.book_append_sheet(workbook, medicinesSheet, 'Medicines');
            }

            // Add marketing materials sheet
            if (data.marketing_materials && data.marketing_materials.length > 0) {
                const materialsSheet = XLSX.utils.json_to_sheet(data.marketing_materials);
                XLSX.utils.book_append_sheet(workbook, materialsSheet, 'Marketing');
            }

            // Add delivery status sheet
            if (data.delivery_status && data.delivery_status.data) {
                const deliverySheet = XLSX.utils.json_to_sheet(data.delivery_status.data);
                XLSX.utils.book_append_sheet(workbook, deliverySheet, 'Delivery Status');
            }

            XLSX.writeFile(workbook, `modi_medical_backup_${this.getTimestamp()}.xlsx`);
            return true;
        } catch (error) {
            console.error('Excel export error:', error);
            return false;
        }
    }

    // Export specific collection
    exportCollection(collectionName, format = 'json') {
        let data;
        
        switch (collectionName) {
            case 'users':
                data = getUsers();
                break;
            case 'medicines':
                data = getMedicines();
                break;
            case 'marketing_materials':
                data = getMarketingMaterials();
                break;
            case 'excel_files':
                data = getExcelFiles();
                break;
            default:
                console.error('Unknown collection:', collectionName);
                return false;
        }

        if (!data || data.length === 0) {
            console.error('No data to export for collection:', collectionName);
            return false;
        }

        switch (format.toLowerCase()) {
            case 'json':
                return this.exportAsJSON({ [collectionName]: data });
            case 'csv':
                return this.exportAsCSV({ [collectionName]: data });
            case 'xlsx':
                return this.exportAsExcel({ [collectionName]: data });
            default:
                return this.exportAsJSON({ [collectionName]: data });
        }
    }

    // Convert array of objects to CSV
    convertToCSV(data) {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                const stringValue = typeof value === 'string' ? value : String(value);
                return `"${stringValue.replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });

        return csvRows.join('\n');
    }

    // Import data from JSON
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Validate data structure
            if (!data.version || !data.exported_at) {
                throw new Error('Invalid backup file format');
            }

            // Import collections
            if (data.users) {
                localStorage.setItem('modi_users', JSON.stringify(data.users));
            }
            if (data.medicines) {
                localStorage.setItem('modi_medicines', JSON.stringify(data.medicines));
            }
            if (data.marketing_materials) {
                localStorage.setItem('modi_marketing_materials', JSON.stringify(data.marketing_materials));
            }
            if (data.excel_files) {
                localStorage.setItem('modi_excel_files', JSON.stringify(data.excel_files));
            }
            if (data.settings) {
                localStorage.setItem('modi_settings', JSON.stringify(data.settings));
            }
            if (data.delivery_status) {
                localStorage.setItem('modi_delivery_status_current', JSON.stringify(data.delivery_status));
            }

            return true;
        } catch (error) {
            console.error('JSON import error:', error);
            return false;
        }
    }

    // Download file helper
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Get timestamp for filename
    getTimestamp() {
        const now = new Date();
        return now.toISOString().split('T')[0].replace(/-/g, '');
    }

    // Create backup summary
    createBackupSummary() {
        const data = {
            users: getUsers(),
            medicines: getMedicines(),
            marketing_materials: getMarketingMaterials(),
            excel_files: getExcelFiles()
        };

        return {
            timestamp: new Date().toISOString(),
            total_records: {
                users: data.users.length,
                medicines: data.medicines.length,
                marketing_materials: data.marketing_materials.length,
                excel_files: data.excel_files.length
            },
            estimated_size: JSON.stringify(data).length
        };
    }

    // Auto backup (if enabled)
    autoBackup() {
        const settings = getSettings();
        if (settings.autoBackup !== false) {
            this.exportAllData('json');
        }
    }

    // Clear all data (with confirmation)
    clearAllData() {
        if (confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
            localStorage.clear();
            // Reinitialize with default data
            if (typeof initializeStorage === 'function') {
                initializeStorage();
            }
            return true;
        }
        return false;
    }
}

// Create global instance
const exportManager = new ExportManager();