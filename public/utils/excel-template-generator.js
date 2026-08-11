// Excel Template Generator for Modi Medical
// Creates sample Excel delivery status template

class ExcelTemplateGenerator {
    constructor() {
        this.templateName = 'delivery_status_template.xlsx';
    }

    // Generate sample delivery status Excel file
    generateDeliveryStatusTemplate() {
        if (typeof XLSX === 'undefined') {
            console.error('SheetJS library not loaded');
            return false;
        }

        const sampleData = [
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
            },
            {
                'Order ID': 'ORD006',
                'Medicine Name': 'Azithromycin 500mg',
                'Quantity': 30,
                'Delivery Status': 'Pending',
                'Remarks': 'Payment confirmation pending'
            },
            {
                'Order ID': 'ORD007',
                'Medicine Name': 'Pantoprazole 40mg',
                'Quantity': 80,
                'Delivery Status': 'Delivered',
                'Remarks': 'Delivered to main warehouse'
            },
            {
                'Order ID': 'ORD008',
                'Medicine Name': 'Ibuprofen 400mg',
                'Quantity': 120,
                'Delivery Status': 'In Transit',
                'Remarks': 'Transport delayed by weather'
            },
            {
                'Order ID': 'ORD009',
                'Medicine Name': 'Ciprofloxacin 500mg',
                'Quantity': 60,
                'Delivery Status': 'Pending',
                'Remarks': 'Order processing'
            },
            {
                'Order ID': 'ORD010',
                'Medicine Name': 'Montelukast 10mg',
                'Quantity': 45,
                'Delivery Status': 'Delivered',
                'Remarks': 'Express delivery completed'
            }
        ];

        try {
            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(sampleData);
            
            // Set column widths
            worksheet['!cols'] = [
                { wch: 15 }, // Order ID
                { wch: 25 }, // Medicine Name
                { wch: 10 }, // Quantity
                { wch: 15 }, // Delivery Status
                { wch: 30 }  // Remarks
            ];

            // Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Status');
            
            // Generate and download file
            XLSX.writeFile(workbook, this.templateName);
            
            return true;
        } catch (error) {
            console.error('Error generating Excel template:', error);
            return false;
        }
    }

    // Generate transit status Excel file
    generateTransitStatusTemplate() {
        if (typeof XLSX === 'undefined') {
            console.error('SheetJS library not loaded');
            return false;
        }

        const sampleData = [
            {
                'Batch ID': 'BATCH001',
                'Medicine Name': 'Paracetamol 500mg',
                'Source': 'Sun Pharmaceutical',
                'Destination': 'Modi Medical Bokaro',
                'Quantity': 500,
                'Transit Status': 'In Transit',
                'Current Location': 'Ranchi Warehouse',
                'Expected Arrival': '2025-08-15',
                'Remarks': 'On schedule'
            },
            {
                'Batch ID': 'BATCH002',
                'Medicine Name': 'Amoxicillin 250mg',
                'Source': 'Cipla Limited',
                'Destination': 'Modi Medical Bokaro',
                'Quantity': 300,
                'Transit Status': 'Delivered',
                'Current Location': 'Modi Medical Bokaro',
                'Expected Arrival': '2025-08-12',
                'Remarks': 'Received successfully'
            },
            {
                'Batch ID': 'BATCH003',
                'Medicine Name': 'Omeprazole 20mg',
                'Source': 'Dr. Reddy\'s Laboratories',
                'Destination': 'Modi Medical Bokaro',
                'Quantity': 200,
                'Transit Status': 'Pending',
                'Current Location': 'Factory',
                'Expected Arrival': '2025-08-20',
                'Remarks': 'Awaiting dispatch'
            }
        ];

        try {
            const worksheet = XLSX.utils.json_to_sheet(sampleData);
            worksheet['!cols'] = [
                { wch: 15 }, // Batch ID
                { wch: 25 }, // Medicine Name
                { wch: 20 }, // Source
                { wch: 25 }, // Destination
                { wch: 10 }, // Quantity
                { wch: 15 }, // Transit Status
                { wch: 20 }, // Current Location
                { wch: 15 }, // Expected Arrival
                { wch: 30 }  // Remarks
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Transit Status');
            XLSX.writeFile(workbook, 'transit_status_template.xlsx');
            
            return true;
        } catch (error) {
            console.error('Error generating transit status template:', error);
            return false;
        }
    }

    // Generate medicine inventory Excel file
    generateMedicineInventoryTemplate() {
        if (typeof XLSX === 'undefined') {
            console.error('SheetJS library not loaded');
            return false;
        }

        const sampleData = [
            {
                'Medicine ID': 'MED001',
                'Medicine Name': 'Paracetamol 500mg',
                'Manufacturer': 'Sun Pharmaceutical',
                'Category': 'Tablet',
                'MRP Price': 25.00,
                'Unit Price': 20.00,
                'Discounted Price': 18.00,
                'Lot Number': 'PAR20250101',
                'Manufacturing Date': '2025-01-01',
                'Expiry Date': '2027-01-01',
                'Stock Status': 'Available',
                'Current Stock': 500
            },
            {
                'Medicine ID': 'MED002',
                'Medicine Name': 'Amoxicillin 250mg',
                'Manufacturer': 'Cipla Limited',
                'Category': 'Capsule',
                'MRP Price': 45.00,
                'Unit Price': 38.00,
                'Discounted Price': 35.00,
                'Lot Number': 'AMX20250215',
                'Manufacturing Date': '2025-02-15',
                'Expiry Date': '2027-02-15',
                'Stock Status': 'Available',
                'Current Stock': 300
            }
        ];

        try {
            const worksheet = XLSX.utils.json_to_sheet(sampleData);
            worksheet['!cols'] = [
                { wch: 12 }, // Medicine ID
                { wch: 25 }, // Medicine Name
                { wch: 25 }, // Manufacturer
                { wch: 12 }, // Category
                { wch: 10 }, // MRP Price
                { wch: 10 }, // Unit Price
                { wch: 15 }, // Discounted Price
                { wch: 15 }, // Lot Number
                { wch: 18 }, // Manufacturing Date
                { wch: 12 }, // Expiry Date
                { wch: 15 }, // Stock Status
                { wch: 12 }  // Current Stock
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Medicine Inventory');
            XLSX.writeFile(workbook, 'medicine_inventory_template.xlsx');
            
            return true;
        } catch (error) {
            console.error('Error generating medicine inventory template:', error);
            return false;
        }
    }

    // Add download button to admin dashboard
    addTemplateDownloadButtons() {
        const excelTab = document.getElementById('excelTab');
        if (excelTab) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'template-buttons';
            buttonContainer.style.marginTop = '1rem';
            buttonContainer.innerHTML = `
                <h4>Download Templates:</h4>
                <button class="btn btn-sm btn-secondary" onclick="excelTemplateGenerator.generateDeliveryStatusTemplate()">
                    Delivery Status Template
                </button>
                <button class="btn btn-sm btn-secondary" onclick="excelTemplateGenerator.generateTransitStatusTemplate()">
                    Transit Status Template
                </button>
                <button class="btn btn-sm btn-secondary" onclick="excelTemplateGenerator.generateMedicineInventoryTemplate()">
                    Medicine Inventory Template
                </button>
            `;
            excelTab.appendChild(buttonContainer);
        }
    }
}

// Create global instance
const excelTemplateGenerator = new ExcelTemplateGenerator();

// Add template download buttons when admin dashboard loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (authSystem && authSystem.isAdmin()) {
            excelTemplateGenerator.addTemplateDownloadButtons();
        }
    }, 500);
});