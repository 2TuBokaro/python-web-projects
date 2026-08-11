// Excel Parser Utility for Modi Medical
// Handles Excel file parsing, editing, and generation using SheetJS

class ExcelParser {
    constructor() {
        this.editableColumns = ['Delivery Status', 'Remarks'];
    }

    // Parse Excel file to JSON
    parseExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Get first sheet
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    if (jsonData.length === 0) {
                        resolve([]);
                        return;
                    }

                    // Convert array of arrays to array of objects
                    const headers = jsonData[0];
                    const rows = jsonData.slice(1).map(row => {
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = row[index] || '';
                        });
                        return obj;
                    });

                    resolve(rows);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    // Convert JSON data to Excel file
    jsonToExcel(data, filename) {
        try {
            if (!data || data.length === 0) {
                throw new Error('No data to export');
            }

            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);
            
            // Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            
            // Generate file
            XLSX.writeFile(workbook, filename);
            
            return true;
        } catch (error) {
            console.error('Excel export error:', error);
            return false;
        }
    }

    // Create editable HTML table from Excel data
    createEditableTable(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !data || data.length === 0) {
            container.innerHTML = '<p class="text-center">No data available</p>';
            return;
        }

        const headers = Object.keys(data[0]);
        
        let tableHTML = '<table class="data-table"><thead><tr>';
        
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        
        tableHTML += '</tr></thead><tbody>';

        data.forEach((row, rowIndex) => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                const isEditable = this.editableColumns.includes(header);
                const value = row[header] || '';
                
                if (isEditable) {
                    tableHTML += `<td><input type="text" class="excel-cell-editable" 
                        data-row="${rowIndex}" 
                        data-column="${header}" 
                        value="${value}"></td>`;
                } else {
                    tableHTML += `<td>${value}</td>`;
                }
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    // Extract changes from editable table
    extractTableChanges(containerId, originalData) {
        const container = document.getElementById(containerId);
        const editableCells = container.querySelectorAll('.excel-cell-editable');
        
        const changes = [];
        editableCells.forEach(cell => {
            const rowIndex = parseInt(cell.dataset.row);
            const column = cell.dataset.column;
            const newValue = cell.value;
            const oldValue = originalData[rowIndex][column];

            if (newValue !== oldValue) {
                changes.push({
                    row: rowIndex,
                    column: column,
                    oldValue: oldValue,
                    newValue: newValue
                });
            }
        });

        return changes;
    }

    // Apply changes to data
    applyChanges(data, changes) {
        const modifiedData = JSON.parse(JSON.stringify(data));
        
        changes.forEach(change => {
            if (modifiedData[change.row]) {
                modifiedData[change.row][change.column] = change.newValue;
            }
        });

        return modifiedData;
    }

    // Validate Excel file
    validateExcelFile(file) {
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            return {
                valid: false,
                error: 'Invalid file type. Please upload an Excel file (.xlsx, .xls, or .csv)'
            };
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'File size exceeds 5MB limit'
            };
        }

        return { valid: true };
    }

    // Create sample delivery status Excel data
    createSampleDeliveryData() {
        return [
            {
                'Order ID': 'ORD001',
                'Medicine Name': 'Paracetamol 500mg',
                'Quantity': 100,
                'Delivery Status': 'In Transit',
                'Remarks': 'Expected delivery tomorrow'
            },
            {
                'Order ID': 'ORD002',
                'Medicine Name': 'Amoxicillin 250mg',
                'Quantity': 50,
                'Delivery Status': 'Delivered',
                'Remarks': 'Received in good condition'
            },
            {
                'Order ID': 'ORD003',
                'Medicine Name': 'Omeprazole 20mg',
                'Quantity': 200,
                'Delivery Status': 'Pending',
                'Remarks': 'Awaiting confirmation'
            },
            {
                'Order ID': 'ORD004',
                'Medicine Name': 'Metformin 500mg',
                'Quantity': 150,
                'Delivery Status': 'In Transit',
                'Remarks': 'Out for delivery'
            },
            {
                'Order ID': 'ORD005',
                'Medicine Name': 'Cetirizine 10mg',
                'Quantity': 75,
                'Delivery Status': 'Delivered',
                'Remarks': 'Customer satisfied'
            }
        ];
    }

    // Download sample Excel template
    downloadSampleTemplate() {
        const sampleData = this.createSampleDeliveryData();
        this.jsonToExcel(sampleData, 'delivery_status_template.xlsx');
    }
}

// Create global instance
const excelParser = new ExcelParser();