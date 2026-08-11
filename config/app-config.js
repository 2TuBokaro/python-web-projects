// Modi Medical Application Configuration
const APP_CONFIG = {
    // Application Info
    appName: "Modi Medical",
    version: "1.0.0",
    
    // Data Layer Configuration
    dataLayer: {
        useLocalStorage: true,  // Set to false to use API
        apiBaseUrl: window.location.origin + '/api'  // Dynamic API URL for Vercel
    },
    
    // File Configuration
    files: {
        mediaPath: 'D:\\OtherImpDataFromLappy\\Business\\Modi',
        staticPath: '/static/modi-media',
        featuredImage: 'MainYouTubeImageFinalInJPEG.jpg',
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
        allowedVideoTypes: ['mp4', 'mov', 'avi'],
        allowedDocTypes: ['pdf', 'docx', 'xlsx', 'txt']
    },
    
    // WhatsApp Configuration
    whatsapp: {
        number: '8709484805',
        message: 'Hello! I want to register for Modi Medical portal.',
        registrationUrl: '/register?source=whatsapp'
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
    
    // Initial Admin Credentials
    initialAdmin: {
        username: 'admin',
        password: 'password',
        forcePasswordChange: true
    },
    
    // UI Configuration
    ui: {
        itemsPerPage: 10,
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        mobileBreakpoint: 768
    },
    
    // Export Configuration
    export: {
        formats: ['csv', 'json', 'xlsx'],
        autoBackup: true,
        backupInterval: 24 * 60 * 60 * 1000 // 24 hours
    }
};