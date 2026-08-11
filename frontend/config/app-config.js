// Modi Medical Application Configuration
const APP_CONFIG = {
    // Application Info
    appName: "Modi Medical",
    version: "1.0.0",
    
    // Data Layer Configuration
    dataLayer: {
        useLocalStorage: true,  // Set to false to use FastAPI backend
        apiBaseUrl: 'http://localhost:8000/api'
    },
    
    // File Configuration
    files: {
        assetsPath: 'assets/',
        featuredImage: 'assets/MainYouTubeImageFinalInJPEG.jpg',
        logoImage: 'assets/Red Green Minimalist Medical Logo.gif',
        promoVideo: 'assets/MMpromoNoVoice.mov',
        hindiPromoTextFile: 'assets/MMpromotextInHindi.txt',
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        allowedVideoTypes: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
        allowedDocTypes: ['pdf', 'docx', 'xlsx', 'txt', 'doc']
    },
    
    // WhatsApp Configuration
    whatsapp: {
        number: '8709484805',
        message: 'Hello! I want to register for Modi Medical portal.',
        url: 'https://wa.me/918709484805'
    },
    
    // Excel Configuration
    excel: {
        deliveryStatusFile: 'delivery_status.xlsx',
        editableColumns: ['Delivery Status', 'Remarks'],
        staffEditableFiles: ['delivery_status.xlsx']
    },
    
    // User Roles
    roles: {
        ADMIN: 'admin',
        STAFF: 'staff', 
        PUBLIC: 'public'
    },
    
    // Initial Admin Credentials (password change is optional/provisioned, not forced)
    initialAdmin: {
        username: 'admin',
        password: 'password',
        forcePasswordChange: false
    },
    
    // UI Configuration
    ui: {
        itemsPerPage: 10,
        sessionTimeout: 60 * 60 * 1000, // 60 minutes
        mobileBreakpoint: 768
    },
    
    // Export Configuration
    export: {
        formats: ['csv', 'json', 'xlsx'],
        autoBackup: true
    }
};