// Data Layer Abstraction for Modi Medical
// Following Open Architecture: UI → Data Layer → Storage (LocalStorage/API)

const DATA_LAYER_CONFIG = {
    useLocalStorage: true,
    apiBaseUrl: 'http://localhost:8000/api'
};

// Storage Keys
const STORAGE_KEYS = {
    USERS: 'modi_users',
    MEDICINES: 'modi_medicines',
    MARKETING_MATERIALS: 'modi_marketing_materials',
    EXCEL_FILES: 'modi_excel_files',
    SESSION: 'modi_session',
    SETTINGS: 'modi_settings',
    NOTIFICATIONS: 'modi_notifications'
};

// Initialize Storage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const initialUsers = [{
            id: 'user_001',
            username: 'admin',
            password: 'password',
            role: 'admin',
            name: 'Administrator',
            email: 'admin@modimedical.com',
            phone: '8709484805',
            shop_name: 'Modi Medical HQ',
            created_at: new Date().toISOString(),
            last_login: null,
            status: 'active',
            registration_source: 'system',
            force_password_change: false
        }];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.MEDICINES)) {
        const sampleMedicines = [
            {
                id: 'med_001',
                name: 'Paracetamol 500mg',
                manufacturer: 'Sun Pharmaceutical',
                category: 'Tablet',
                mrp_price: 25.00,
                unit_price: 20.00,
                discounted_price: 18.00,
                lot_number: 'PAR20250101',
                manufacturing_date: '2025-01-01',
                expiry_date: '2027-01-01',
                stock_status: 'available',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'med_002',
                name: 'Amoxicillin 250mg',
                manufacturer: 'Cipla Limited',
                category: 'Capsule',
                mrp_price: 45.00,
                unit_price: 38.00,
                discounted_price: 35.00,
                lot_number: 'AMX20250215',
                manufacturing_date: '2025-02-15',
                expiry_date: '2027-02-15',
                stock_status: 'available',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'med_003',
                name: 'Omeprazole 20mg',
                manufacturer: "Dr. Reddy's Laboratories",
                category: 'Capsule',
                mrp_price: 65.00,
                unit_price: 55.00,
                discounted_price: 52.00,
                lot_number: 'OME20250301',
                manufacturing_date: '2025-03-01',
                expiry_date: '2027-03-01',
                stock_status: 'low_stock',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'med_004',
                name: 'Metformin 500mg',
                manufacturer: 'Lupin Limited',
                category: 'Tablet',
                mrp_price: 35.00,
                unit_price: 28.00,
                discounted_price: 25.00,
                lot_number: 'MET20250120',
                manufacturing_date: '2025-01-20',
                expiry_date: '2027-01-20',
                stock_status: 'available',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'med_005',
                name: 'Cetirizine 10mg',
                manufacturer: 'Zydus Cadila',
                category: 'Tablet',
                mrp_price: 22.00,
                unit_price: 18.00,
                discounted_price: 16.00,
                lot_number: 'CET20250228',
                manufacturing_date: '2025-02-28',
                expiry_date: '2027-02-28',
                stock_status: 'available',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'med_006',
                name: 'Azithromycin 500mg',
                manufacturer: 'Pfizer India',
                category: 'Tablet',
                mrp_price: 85.00,
                unit_price: 72.00,
                discounted_price: 68.00,
                lot_number: 'AZI20250310',
                manufacturing_date: '2025-03-10',
                expiry_date: '2027-03-10',
                stock_status: 'out_of_stock',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: 'med_007',
                name: 'Pantoprazole 40mg',
                manufacturer: 'Abbott India',
                category: 'Tablet',
                mrp_price: 120.00,
                unit_price: 100.00,
                discounted_price: 95.00,
                lot_number: 'PAN20250401',
                manufacturing_date: '2025-04-01',
                expiry_date: '2027-04-01',
                stock_status: 'available',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(sampleMedicines));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.MARKETING_MATERIALS)) {
        const sampleMaterials = [
            {
                id: 'media_001',
                title: 'Modi Medical Main Banner Video',
                type: 'video',
                file_path: 'assets/BannerVideo.mp4',
                category: 'promo',
                uploaded_at: new Date().toISOString(),
                is_featured: true
            },
            {
                id: 'media_002',
                title: 'Main YouTube Animated Banner',
                type: 'image',
                file_path: 'assets/MainYouTubeImage.gif',
                category: 'banner',
                uploaded_at: new Date().toISOString(),
                is_featured: true
            },
            {
                id: 'media_003',
                title: 'Modi Medical Animated Commercial',
                type: 'video',
                file_path: 'assets/MManimation1.mp4',
                category: 'promo',
                uploaded_at: new Date().toISOString(),
                is_featured: true
            },
            {
                id: 'media_004',
                title: 'Red Green Minimalist Logo',
                type: 'image',
                file_path: 'assets/Red Green Minimalist Medical Logo.gif',
                category: 'logo',
                uploaded_at: new Date().toISOString(),
                is_featured: false
            },
            {
                id: 'media_005',
                title: 'Big Savings Offer Sticker',
                type: 'image',
                file_path: 'assets/Stickers/MMSelectedFlyer.jpg',
                category: 'promo',
                uploaded_at: new Date().toISOString(),
                is_featured: false
            },
            {
                id: 'media_006',
                title: 'Chas Bokaro Market Leading Discounts',
                type: 'image',
                file_path: 'assets/Stickers/Big Savings at MODI MEDICAL (Medical Store in Chas, Bokaro)___ Market-leading discounts..jpg',
                category: 'promo',
                uploaded_at: new Date().toISOString(),
                is_featured: false
            }
        ];
        localStorage.setItem(STORAGE_KEYS.MARKETING_MATERIALS, JSON.stringify(sampleMaterials));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.EXCEL_FILES)) {
        const sampleExcel = [
            {
                id: 'excel_001',
                filename: 'delivery_status_bokaro.xlsx',
                file_path: 'assets/ModiContacts.xlsx',
                uploaded_by: 'admin',
                uploaded_at: new Date().toISOString(),
                last_updated: new Date().toISOString(),
                data: [
                    { 'Order ID': 'ORD101', 'Shop Name': 'Bokaro Medical Hall', 'Medicine Name': 'Paracetamol 500mg', 'Quantity': 500, 'Delivery Status': 'In Transit', 'Remarks': 'Dispatched via Express Logistics' },
                    { 'Order ID': 'ORD102', 'Shop Name': 'Chas Pharmacy', 'Medicine Name': 'Amoxicillin 250mg', 'Quantity': 200, 'Delivery Status': 'Delivered', 'Remarks': 'Signed by Store Manager' },
                    { 'Order ID': 'ORD103', 'Shop Name': 'City Care Chemist', 'Medicine Name': 'Omeprazole 20mg', 'Quantity': 300, 'Delivery Status': 'Pending', 'Remarks': 'Awaiting Route Allocation' },
                    { 'Order ID': 'ORD104', 'Shop Name': 'LifeLine Drug Store', 'Medicine Name': 'Metformin 500mg', 'Quantity': 450, 'Delivery Status': 'In Transit', 'Remarks': 'On-route - ETA 2 PM' },
                    { 'Order ID': 'ORD105', 'Shop Name': 'Verma Medicals', 'Medicine Name': 'Cetirizine 10mg', 'Quantity': 150, 'Delivery Status': 'Delivered', 'Remarks': 'Payment Received' }
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEYS.EXCEL_FILES, JSON.stringify(sampleExcel));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
            last_file_refresh: new Date().toISOString(),
            app_version: '1.0.0'
        }));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
}

// ============ USER MANAGEMENT ============
function getUsers() {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

function getUserById(id) {
    return getUsers().find(user => user.id === id);
}

function getUserByUsername(username) {
    return getUsers().find(user => user.username === username);
}

function createUser(userData) {
    const users = getUsers();
    const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
        created_at: new Date().toISOString(),
        last_login: null,
        status: 'active',
        force_password_change: false
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
}

function updateUser(id, userData) {
    const users = getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...userData, updated_at: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return users[index];
    }
    return null;
}

function deleteUser(id) {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
    return filteredUsers.length < users.length;
}

function authenticateUser(username, password) {
    const user = getUserByUsername(username);
    if (user && user.password === password && user.status === 'active') {
        updateUser(user.id, { last_login: new Date().toISOString() });
        return user;
    }
    return null;
}

// ============ MEDICINE INVENTORY MANAGEMENT ============
function getMedicines() {
    const medicines = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return medicines ? JSON.parse(medicines) : [];
}

function getMedicineById(id) {
    return getMedicines().find(med => med.id === id);
}

function createMedicine(medicineData) {
    const medicines = getMedicines();
    const newMedicine = {
        id: `med_${Date.now()}`,
        ...medicineData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    medicines.push(newMedicine);
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    return newMedicine;
}

function updateMedicine(id, medicineData) {
    const medicines = getMedicines();
    const index = medicines.findIndex(med => med.id === id);
    if (index !== -1) {
        medicines[index] = { ...medicines[index], ...medicineData, updated_at: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
        return medicines[index];
    }
    return null;
}

function deleteMedicine(id) {
    const medicines = getMedicines();
    const filteredMedicines = medicines.filter(med => med.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(filteredMedicines));
    return filteredMedicines.length < medicines.length;
}

// ============ MARKETING MATERIALS MANAGEMENT ============
function getMarketingMaterials() {
    const materials = localStorage.getItem(STORAGE_KEYS.MARKETING_MATERIALS);
    if (!materials) return [];
    
    const parsedMaterials = JSON.parse(materials);
    
    // Normalize file paths - convert backslashes to forward slashes
    return parsedMaterials.map(mat => ({
        ...mat,
        file_path: mat.file_path ? mat.file_path.replace(/\\/g, '/') : mat.file_path
    }));
}

function getMarketingMaterialById(id) {
    return getMarketingMaterials().find(m => m.id === id);
}

function setMarketingMaterials(materials) {
    localStorage.setItem(STORAGE_KEYS.MARKETING_MATERIALS, JSON.stringify(materials));
}

// Make these functions globally available for FileManager
window.setMarketingMaterials = setMarketingMaterials;
window.updateSettings = updateSettings;

function addMarketingMaterial(materialData) {
    const materials = getMarketingMaterials();
    const newMaterial = {
        id: `media_${Date.now()}`,
        ...materialData,
        uploaded_at: new Date().toISOString()
    };
    materials.push(newMaterial);
    localStorage.setItem(STORAGE_KEYS.MARKETING_MATERIALS, JSON.stringify(materials));
    return newMaterial;
}

function updateMarketingMaterial(id, materialData) {
    const materials = getMarketingMaterials();
    const index = materials.findIndex(m => m.id === id);
    if (index !== -1) {
        materials[index] = { ...materials[index], ...materialData, updated_at: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.MARKETING_MATERIALS, JSON.stringify(materials));
        return materials[index];
    }
    return null;
}

function deleteMarketingMaterial(id) {
    const materials = getMarketingMaterials();
    const filtered = materials.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MARKETING_MATERIALS, JSON.stringify(filtered));
    return filtered.length < materials.length;
}

// ============ EXCEL FILES MANAGEMENT ============
function getExcelFiles() {
    const files = localStorage.getItem(STORAGE_KEYS.EXCEL_FILES);
    return files ? JSON.parse(files) : [];
}

function addExcelFile(fileData) {
    const files = getExcelFiles();
    const newFile = {
        id: `excel_${Date.now()}`,
        ...fileData,
        uploaded_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
    };
    files.push(newFile);
    localStorage.setItem(STORAGE_KEYS.EXCEL_FILES, JSON.stringify(files));
    return newFile;
}

function updateExcelFile(id, fileData) {
    const files = getExcelFiles();
    const index = files.findIndex(file => file.id === id);
    if (index !== -1) {
        files[index] = { ...files[index], ...fileData, last_updated: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.EXCEL_FILES, JSON.stringify(files));
        return files[index];
    }
    return null;
}

// ============ SESSION MANAGEMENT ============
function setSession(sessionData) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
        ...sessionData,
        created_at: new Date().getTime()
    }));
}

function getSession() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function isAuthenticated() {
    const session = getSession();
    if (!session) return false;
    const now = new Date().getTime();
    if (now - session.created_at > 60 * 60 * 1000) { // 60 mins
        clearSession();
        return false;
    }
    return true;
}

function getCurrentUser() {
    const session = getSession();
    if (session) {
        return getUserById(session.user_id);
    }
    return null;
}

// ============ SETTINGS MANAGEMENT ============
function getSettings() {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {};
}

function updateSettings(settingsData) {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settingsData };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return newSettings;
}

// ============ UTILITY FUNCTIONS ============
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Initialize storage on load
initializeStorage();

// Make these functions globally available for FileManager
window.setMarketingMaterials = setMarketingMaterials;
window.updateSettings = updateSettings;